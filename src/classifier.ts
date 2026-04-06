import { createRequire } from "node:module";

import type { CssExtractorCandidate } from "./extractor";
import { collectShorthandValueTokens } from "./helper/classifyNormalize.js";
import { isGridLineProperty } from "./helper/judgment.js";
import { isReferenceOnlyHintProperty } from "./helper/semanticMap.js";
import { classifyPropertyStructure } from "./helper/noHintDesign.js";
import { isSingletonLabelVocabularyProperty } from "./helper/singletonLabelVocabulary.js";
import { getShorthandExpansion } from "./helper/calculation.js";
import { getPropertyStatus, getPropertySyntax } from "./helper/summary.js";
import { countStructuredShorthandTokens, isStructuredShorthandProperty } from "./helper/structuredShorthand.js";
import { hasShorthandSemanticSpec } from "./helper/shorthandSemantics.js";

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
const shorthandApi = nodeRequire("css-shorthand-properties") as {
	default?: {
		isShorthand?(propertyName: string): boolean;
	};
	isShorthand?(propertyName: string): boolean;
	expand?(propertyName: string): string[];
};

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

			if (suppressGlobalValues && containsCssWideKeyword(valueText) && !isGridLineProperty(candidate.propertyName)) {
				return buildSuppressedClassification(candidate, valueText, "global CSS keyword");
			}

			if (suppressVariableReferences && /\bvar\(/i.test(valueText)) {
				return buildSuppressedClassification(candidate, valueText, "variable reference");
			}

			if (isSingletonLabelVocabularyProperty(candidate.propertyName)) {
				return buildSuppressedClassification(candidate, valueText, "singleton label vocabulary");
			}

			if (!isRuleBasedHintCandidate(candidate.propertyName)) {
				return {
					state: "ignored",
					propertyName: candidate.propertyName,
					reason: "unsupported shorthand syntax",
				};
			}

			const tokenCount = countStructuredShorthandTokens(candidate.propertyName, valueText);
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
	const tokenCount = countStructuredShorthandTokens(candidate.propertyName, valueText);
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
	const syntax = getPropertySyntax(propertyName).trim();
	if (!syntax) {
		return false;
	}

	if (getPropertyStatus(propertyName) !== "standard") {
		return false;
	}

	if (syntax.includes("<grid-line>") || syntax.includes("||")) {
		return true;
	}

	if (isReferenceOnlyHintProperty(propertyName)) {
		return true;
	}

	if (isStructuredShorthandProperty(propertyName)) {
		return true;
	}

	if (hasShorthandSemanticSpec(propertyName)) {
		return true;
	}

	const shorthandExpansion = getShorthandExpansion(propertyName);
	if (syntax.includes("#") || hasBoundedRepetition(syntax)) {
		return shorthandExpansion.length > 1;
	}

	return shorthandExpansion.length > 1;
}

function containsCssWideKeyword(valueText: string): boolean {
	return collectShorthandValueTokens(valueText).some((token) => CSS_WIDE_KEYWORDS.has(token.text.trim()));
}

function hasBoundedRepetition(syntax: string): boolean {
	return /\{\s*\d+\s*(?:,\s*\d*)?\s*\}/.test(syntax);
}

function countValueTokens(valueText: string): number {
	let tokenCount = 0;
	let depth = 0;
	let quote: string | null = null;
	let inToken = false;

	for (const character of valueText) {
		if (quote) {
			if (character === quote) {
				quote = null;
			}
			inToken = true;
			continue;
		}

		if (character === '"' || character === "'") {
			quote = character;
			inToken = true;
			continue;
		}

		if (character === "(" || character === "[" || character === "{") {
			depth += 1;
			inToken = true;
			continue;
		}

		if ((character === ")" || character === "]" || character === "}") && depth > 0) {
			depth -= 1;
			inToken = true;
			continue;
		}

		if (depth === 0 && (character === "/" || character === "," || /\s/.test(character))) {
			if (inToken) {
				tokenCount += 1;
				inToken = false;
			}
			continue;
		}

		inToken = true;
	}

	if (inToken) {
		tokenCount += 1;
	}

	return Math.max(1, tokenCount);
}
