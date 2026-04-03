import { createRequire } from "node:module";

import type { CssExtractorCandidate } from "./extractor";

export type CssHintStrategy = "inline-right" | "block-end-right";

export type CssHintKind = "Parameter" | "BlockEnd";

export type CssHintClassification = {
	propertyName: string;
	label: string;
	kind: CssHintKind;
	strategy: CssHintStrategy;
	tokenCount: number;
	suppressReason?: string;
};

export type CssHintClassifier = {
	classify(candidate: CssExtractorCandidate): CssHintClassification | null;
};

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
		classify(candidate: CssExtractorCandidate): CssHintClassification | null {
			const valueText = candidate.valueText.trim();
			if (!valueText) {
				return null;
			}

			if (suppressGlobalValues && CSS_WIDE_KEYWORDS.has(valueText)) {
				return null;
			}

			if (suppressVariableReferences && /\bvar\(/i.test(valueText)) {
				return null;
			}

			if (!isRuleBasedHintCandidate(candidate.propertyName)) {
				return null;
			}

			const tokenCount = countValueTokens(valueText);
			return {
				propertyName: candidate.propertyName,
				label: `${candidate.propertyName}-${tokenCount}-values`,
				kind: "Parameter",
				strategy: "inline-right",
				tokenCount,
			};
		},
	};
}

function isRuleBasedHintCandidate(propertyName: string): boolean {
	const property = standardProperties.get(propertyName);
	if (!property || property.status !== "standard") {
		return false;
	}

	if (
		!Boolean(shorthandApi && typeof shorthandApi.isShorthand === "function" && shorthandApi.isShorthand(propertyName))
	) {
		return false;
	}

	const syntax = typeof property.syntax === "string" ? property.syntax.trim() : "";
	if (!syntax) {
		return false;
	}

	return hasBoundedRepetition(syntax) && !syntax.includes("|");
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
