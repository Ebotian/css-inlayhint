import { createRequire } from "node:module";

import type { CssExtractorCandidate } from "./extractor";

export type CssHintStrategy = "inline-right" | "block-end-right";

export type CssHintKind = "Parameter" | "BlockEnd";

export type CssHintMatchedClassification = {
	state: "matched";
	propertyName: string;
	label: string;
	kind: CssHintKind;
	strategy: CssHintStrategy;
	tokenCount: number;
};

export type CssHintSuppressedClassification = {
	state: "suppressed";
	propertyName: string;
	label: string;
	kind: CssHintKind;
	strategy: CssHintStrategy;
	tokenCount: number;
	suppressReason: string;
};

export type CssHintIgnoredClassification = {
	state: "ignored";
	propertyName: string;
	reason: string;
};

export type CssHintClassification =
	| CssHintMatchedClassification
	| CssHintSuppressedClassification
	| CssHintIgnoredClassification;

export type CssHintClassifier = {
	classify(candidate: CssExtractorCandidate): CssHintClassification;
};

export function formatCssHintClassification(classification: CssHintClassification): string {
	switch (classification.state) {
		case "matched":
			return `matched ${classification.label}`;
		case "suppressed":
			return `suppressed ${classification.label} (${classification.suppressReason})`;
		case "ignored":
			return `ignored ${classification.propertyName} (${classification.reason})`;
	}
}

export type CssHintClassifierOptions = {
	suppressGlobalValues?: boolean;
	suppressVariableReferences?: boolean;
};

const CSS_WIDE_KEYWORDS = new Set(["initial", "inherit", "unset", "revert", "revert-layer"]);
const nodeRequire = createRequire(__filename);
const mdnData = nodeRequire("mdn-data") as {
	css: {
		properties: Record<string, { status?: string; syntax?: string }>;
	};
};
const shorthandApi = nodeRequire("css-shorthand-properties") as {
	default?: {
		isShorthand?(propertyName: string): boolean;
	};
	isShorthand?(propertyName: string): boolean;
	expand?(propertyName: string): string[];
};
const standardProperties = new Map<string, { status?: string; syntax?: string }>(
	Object.entries(mdnData.css.properties as Record<string, { status?: string; syntax?: string }>),
);

export function createCssHintClassifier(options: CssHintClassifierOptions = {}): CssHintClassifier {
	const suppressGlobalValues = options.suppressGlobalValues !== false;
	const suppressVariableReferences = options.suppressVariableReferences !== false;

	return {
		classify(candidate: CssExtractorCandidate): CssHintClassification {
			const valueText = candidate.valueText.trim();
			if (!valueText) {
				return {
					state: "ignored",
					propertyName: candidate.propertyName,
					reason: "empty value",
				};
			}

			if (suppressGlobalValues && CSS_WIDE_KEYWORDS.has(valueText)) {
				return buildSuppressedClassification(candidate, valueText, "global CSS keyword");
			}

			if (suppressVariableReferences && /\bvar\(/i.test(valueText)) {
				return buildSuppressedClassification(candidate, valueText, "variable reference");
			}

			if (!isRuleBasedHintCandidate(candidate.propertyName)) {
				return {
					state: "ignored",
					propertyName: candidate.propertyName,
					reason: "unsupported shorthand syntax",
				};
			}

			const tokenCount = countValueTokens(valueText);
			return {
				state: "matched",
				propertyName: candidate.propertyName,
				label: `${candidate.propertyName}-${tokenCount}-values`,
				kind: "Parameter",
				strategy: "inline-right",
				tokenCount,
			};
		},
	};
}

function buildSuppressedClassification(
	candidate: CssExtractorCandidate,
	valueText: string,
	suppressReason: string,
): CssHintClassification {
	const tokenCount = countValueTokens(valueText);
	return {
		state: "suppressed",
		propertyName: candidate.propertyName,
		label: `${candidate.propertyName}-${tokenCount}-values`,
		kind: "Parameter",
		strategy: "inline-right",
		tokenCount,
		suppressReason,
	};
}

function isRuleBasedHintCandidate(propertyName: string): boolean {
	const property = standardProperties.get(propertyName);
	if (!property || property.status !== "standard") {
		return false;
	}

	const syntax = typeof property.syntax === "string" ? property.syntax.trim() : "";
	if (!syntax) {
		return false;
	}

	if (syntax.includes("<grid-line>") || syntax.includes("||") || syntax.includes("#") || hasBoundedRepetition(syntax)) {
		return true;
	}

	return Boolean(
		shorthandApi && typeof shorthandApi.isShorthand === "function" && shorthandApi.isShorthand(propertyName),
	);
}

function hasBoundedRepetition(syntax: string): boolean {
	return /\{\s*\d+\s*(?:,\s*\d*)?\s*\}/.test(syntax);
}

function countValueTokens(valueText: string): number {
	const tokens = valueText
		.split(/\s+/)
		.map((token) => token.trim())
		.filter(Boolean);

	return Math.max(1, tokens.length);
}
