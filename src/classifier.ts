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

function countValueTokens(valueText: string): number {
	const tokens = valueText
		.split(/\s+/)
		.map((token) => token.trim())
		.filter(Boolean);

	return Math.max(1, tokens.length);
}
