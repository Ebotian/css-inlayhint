import type { TextDocument } from "vscode-css-languageservice";

import type { CssHintInstruction } from "../../collector.js";
import type { CssHintResolvedInstruction } from "../../constructor.js";
import { collectShorthandValueTokens } from "../classifyNormalize.js";

export type ShorthandSemanticSpec = {
	propertyNames: readonly string[];
	getLabelParts?: (valueText: string | undefined, tokenCount: number) => string[] | null;
	getLabelSlots?: (valueText: string, labelParts: readonly string[]) => string[] | null;
	resolveHints?: (
		document: TextDocument,
		instruction: CssHintInstruction,
		tokenMatches: ReadonlyArray<{ text: string; index: number }>,
		labelParts: readonly string[],
	) => CssHintResolvedInstruction[] | null;
};

export function createMappedSemanticSpec(
	propertyNames: readonly string[],
	resolveLabel: (tokenText: string) => string | null,
): ShorthandSemanticSpec {
	return {
		propertyNames,
		getLabelParts: (valueText, tokenCount) =>
			inferTokenLabelParts(valueText, tokenCount, (tokenTexts) => mapTokenLabels(tokenTexts, resolveLabel)),
		getLabelSlots: (valueText, labelParts) =>
			buildTokenLabelSlots(valueText, labelParts, (tokenTexts) => mapTokenLabels(tokenTexts, resolveLabel)),
	};
}

export function collectValueTokenTexts(valueText: string): string[] {
	return collectShorthandValueTokens(valueText)
		.map((token) => token.text.trim())
		.filter((tokenText) => tokenText.length > 0);
}

export function inferTokenLabelParts(
	valueText: string | undefined,
	tokenCount: number,
	resolveSegmentLabels: (tokenTexts: readonly string[]) => string[] | null,
): string[] | null {
	if (!valueText || tokenCount <= 0) {
		return null;
	}

	const tokenTexts = collectValueTokenTexts(valueText);
	if (tokenTexts.length === 0 || tokenTexts.length !== tokenCount) {
		return null;
	}

	const labels = resolveSegmentLabels(tokenTexts);
	if (!labels || labels.length !== tokenTexts.length) {
		return null;
	}

	return labels;
}

export function buildTokenLabelSlots(
	valueText: string,
	labelParts: readonly string[],
	resolveSegmentLabels: (tokenTexts: readonly string[]) => string[] | null,
): string[] | null {
	const tokenTexts = collectValueTokenTexts(valueText);
	if (tokenTexts.length === 0) {
		return null;
	}

	const slots = resolveSegmentLabels(tokenTexts);
	if (!slots || slots.length !== tokenTexts.length) {
		return null;
	}

	return slots.length === labelParts.length ? slots : null;
}

export function splitTopLevelCommaSegments(valueText: string): string[] {
	const segments: string[] = [];
	let segmentStart = 0;
	let parenDepth = 0;
	let bracketDepth = 0;
	let braceDepth = 0;
	let quote: string | null = null;
	let escaped = false;

	for (let index = 0; index < valueText.length; index += 1) {
		const character = valueText[index] ?? "";

		if (quote) {
			if (escaped) {
				escaped = false;
			} else if (character === "\\") {
				escaped = true;
			} else if (character === quote) {
				quote = null;
			}

			continue;
		}

		if (character === '"' || character === "'") {
			quote = character;
			continue;
		}

		if (character === "(") {
			parenDepth += 1;
			continue;
		}

		if (character === ")") {
			parenDepth = Math.max(0, parenDepth - 1);
			continue;
		}

		if (character === "[") {
			bracketDepth += 1;
			continue;
		}

		if (character === "]") {
			bracketDepth = Math.max(0, bracketDepth - 1);
			continue;
		}

		if (character === "{") {
			braceDepth += 1;
			continue;
		}

		if (character === "}") {
			braceDepth = Math.max(0, braceDepth - 1);
			continue;
		}

		if (parenDepth === 0 && bracketDepth === 0 && braceDepth === 0 && character === ",") {
			segments.push(valueText.slice(segmentStart, index).trim());
			segmentStart = index + 1;
		}
	}

	segments.push(valueText.slice(segmentStart).trim());
	return segments.filter((segment) => segment.length > 0);
}

function mapTokenLabels(
	tokenTexts: readonly string[],
	resolveLabel: (tokenText: string) => string | null,
): string[] | null {
	const labels: string[] = [];
	for (const tokenText of tokenTexts) {
		const label = resolveLabel(tokenText);
		if (!label) {
			return null;
		}

		labels.push(label);
	}

	return labels.length === tokenTexts.length ? labels : null;
}
