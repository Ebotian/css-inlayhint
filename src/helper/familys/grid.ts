import type { TextDocument } from "vscode-css-languageservice";

import type { CssHintInstruction } from "../../collector.js";
import type { CssHintResolvedInstruction } from "../../constructor.js";
import { collectShorthandValueTokens, tokenizeShorthandValueText } from "../classifyNormalize.js";
import { findTopLevelSlashIndex } from "../layeredSyntax.js";
import { collectValueTokenTexts, type ShorthandSemanticSpec } from "./shared.js";

export function createGridSemanticSpecs(): readonly ShorthandSemanticSpec[] {
	return [
		{
			propertyNames: ["grid-template"],
			getLabelParts: inferGridTemplateLabelParts,
			getLabelSlots: buildGridTemplateLabelSlots,
			resolveHints: resolveGridTemplateHints,
		},
	];
}

function inferGridTemplateLabelParts(valueText: string | undefined, tokenCount: number): string[] | null {
	if (!valueText || tokenCount <= 0) {
		return null;
	}

	const trimmedValueText = valueText.trim();
	if (!trimmedValueText || trimmedValueText === "none") {
		return [];
	}

	const tokens = tokenizeShorthandValueText(trimmedValueText);
	if (tokens.length === 0) {
		return null;
	}

	const hasQuotedString = tokens.some((token) => isQuotedString(token));
	const hasLineNames = tokens.some((token) => isGridLineName(token));
	const tokenLabels = inferGridTemplateTokenLabels(trimmedValueText);
	if (tokenLabels) {
		return tokenLabels;
	}

	if (tokenCount === 1) {
		return hasQuotedString ? ["areas"] : null;
	}

	if (trimmedValueText.includes("/")) {
		return [hasQuotedString ? "areas" : "rows", "columns"];
	}

	if (hasQuotedString) {
		return Array.from({ length: tokenCount }, () => "areas");
	}

	return null;
}

function buildGridTemplateLabelSlots(valueText: string, labelParts: readonly string[]): string[] | null {
	const tokenLabels = inferGridTemplateTokenLabels(valueText.trim());
	if (tokenLabels) {
		return tokenLabels.length === labelParts.length ? tokenLabels : null;
	}

	const trimmedValueText = valueText.trim();
	if (!trimmedValueText || trimmedValueText.includes("/")) {
		return null;
	}

	const tokenTexts = collectValueTokenTexts(trimmedValueText);
	if (tokenTexts.length === 0) {
		return null;
	}

	if (tokenTexts.some((tokenText) => /^(['"]).*\1$/.test(tokenText))) {
		return Array.from({ length: labelParts.length }, () => "areas");
	}

	return null;
}

function inferGridTemplateTokenLabels(valueText: string): string[] | null {
	const tokens = collectShorthandValueTokens(valueText);
	if (tokens.length === 0) {
		return null;
	}

	const slashIndex = findTopLevelSlashIndex(valueText);
	const hasQuotedString = tokens.some((token) => isQuotedString(token.text.trim()));
	const hasLineNames = tokens.some((token) => isGridLineName(token.text.trim()));
	if (!hasQuotedString && !hasLineNames) {
		if (slashIndex >= 0 && tokens.length === 2) {
			return ["rows", "columns"];
		}

		return null;
	}

	const labels: string[] = [];
	for (const token of tokens) {
		const tokenText = token.text.trim();
		if (!tokenText) {
			continue;
		}

		if (slashIndex >= 0 && token.index > slashIndex) {
			labels.push("columns");
			continue;
		}

		if (isQuotedString(tokenText)) {
			labels.push("areas");
			continue;
		}

		labels.push("rows");
	}

	return labels.length === tokens.length ? labels : null;
}

function resolveGridTemplateHints(
	document: TextDocument,
	instruction: CssHintInstruction,
	tokenMatches: ReadonlyArray<{ text: string; index: number }>,
	labelParts: readonly string[],
): CssHintResolvedInstruction[] | null {
	if (labelParts.length !== 2 || tokenMatches.length === 0) {
		return null;
	}

	const slashIndex = findTopLevelSlashIndex(instruction.valueText);
	const leftToken = findFirstGridTemplateValueToken(
		tokenMatches,
		0,
		slashIndex >= 0 ? slashIndex : Number.POSITIVE_INFINITY,
	);
	const rightToken = slashIndex >= 0 ? findFirstGridTemplateValueToken(tokenMatches, slashIndex + 1) : null;
	const valueStartOffset = document.offsetAt(instruction.valueRange.start);
	const resolvedInstructions: CssHintResolvedInstruction[] = [];

	if (leftToken) {
		resolvedInstructions.push({
			...instruction,
			label: labelParts[0] ?? instruction.label,
			position: document.positionAt(valueStartOffset + leftToken.index),
		});
	}

	if (rightToken) {
		resolvedInstructions.push({
			...instruction,
			label: labelParts[1] ?? instruction.label,
			position: document.positionAt(valueStartOffset + rightToken.index),
		});
	}

	return resolvedInstructions.length > 0 ? resolvedInstructions : null;
}

function findFirstGridTemplateValueToken(
	tokenMatches: ReadonlyArray<{ text: string; index: number }>,
	fromIndex: number,
	toIndex = Number.POSITIVE_INFINITY,
): { text: string; index: number } | null {
	for (const token of tokenMatches) {
		if (token.index < fromIndex || token.index >= toIndex) {
			continue;
		}

		if (/^\[[^\]]+\]$/.test(token.text.trim())) {
			continue;
		}

		return token;
	}

	return null;
}

function isQuotedString(text: string): boolean {
	return /^(['"]).*\1$/.test(text);
}

function isGridLineName(text: string): boolean {
	return /^\[[^\]]+\]$/.test(text);
}
