import type { TextDocument } from "vscode-css-languageservice";

import type { CssHintInstruction } from "../collector.js";
import type { CssHintResolvedInstruction } from "../constructor.js";
import { classifyStandardText } from "../share/cssValueAtoms.js";
import {
	inferLayeredSemanticLabelParts,
	findTopLevelSlashIndex,
	type LayeredSemanticMatcher,
} from "./layeredSyntax.js";
import {
	collectShorthandValueTokens,
	matchesSyntaxTypeToken,
	tokenizeShorthandValueText,
} from "./classifyNormalize.js";

type ShorthandSemanticSpec = {
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

const SHORTHAND_SEMANTIC_SPECS: readonly ShorthandSemanticSpec[] = [
	{
		propertyNames: ["background"],
		getLabelParts: inferBackgroundLabelParts,
	},
	{
		propertyNames: ["background-position"],
		getLabelParts: inferBackgroundPositionLabelParts,
	},
	{
		propertyNames: ["mask-border-slice"],
		getLabelParts: inferMaskBorderSliceLabelParts,
		getLabelSlots: buildMaskBorderSliceLabelSlots,
	},
	{
		propertyNames: ["mask"],
		getLabelParts: inferMaskLabelParts,
	},
	{
		propertyNames: ["grid-template"],
		getLabelParts: inferGridTemplateLabelParts,
		resolveHints: resolveGridTemplateHints,
	},
	{
		propertyNames: ["animation-range"],
		getLabelSlots: buildAnimationRangeLabelSlots,
	},
];

export function inferShorthandSemanticLabelParts(
	propertyName: string,
	valueText: string | undefined,
	tokenCount: number,
): string[] | null {
	const spec = findShorthandSemanticSpec(propertyName);
	return spec?.getLabelParts?.(valueText, tokenCount) ?? null;
}

export function buildShorthandSemanticLabelSlots(
	propertyName: string,
	valueText: string,
	labelParts: readonly string[],
): string[] | null {
	const spec = findShorthandSemanticSpec(propertyName);
	return spec?.getLabelSlots?.(valueText, labelParts) ?? null;
}

export function resolveShorthandSemanticHints(
	propertyName: string,
	document: TextDocument,
	instruction: CssHintInstruction,
	tokenMatches: ReadonlyArray<{ text: string; index: number }>,
	labelParts: readonly string[],
): CssHintResolvedInstruction[] | null {
	const spec = findShorthandSemanticSpec(propertyName);
	return spec?.resolveHints?.(document, instruction, tokenMatches, labelParts) ?? null;
}

function findShorthandSemanticSpec(propertyName: string): ShorthandSemanticSpec | null {
	return SHORTHAND_SEMANTIC_SPECS.find((spec) => spec.propertyNames.includes(propertyName)) ?? null;
}

function inferBackgroundLabelParts(valueText: string | undefined, tokenCount: number): string[] | null {
	return inferLayeredSemanticLabelParts(valueText, tokenCount, BACKGROUND_LAYER_MATCHERS);
}

function inferBackgroundPositionLabelParts(valueText: string | undefined, tokenCount: number): string[] | null {
	if (!valueText || tokenCount <= 0) {
		return null;
	}

	const tokens = collectShorthandValueTokens(valueText);
	if (tokens.length === 0) {
		return null;
	}

	const tokenTexts = tokens.map((token) => token.text.trim()).filter((tokenText) => tokenText.length > 0);
	if (tokenTexts.length !== tokenCount) {
		return null;
	}

	if (tokenCount === 2 && tokenTexts.every(isBackgroundPositionLengthToken)) {
		return ["horizontal", "vertical"];
	}

	const labels: string[] = [];
	for (const tokenText of tokenTexts) {
		const label = inferBackgroundPositionTokenLabel(tokenText);
		if (!label) {
			return null;
		}

		labels.push(label);
	}

	return labels.length === tokenCount ? labels : null;
}

function inferBackgroundPositionTokenLabel(tokenText: string): string | null {
	const loweredTokenText = tokenText.toLowerCase();
	if (HORIZONTAL_EDGE_POSITION_KEYWORDS.has(loweredTokenText)) {
		return "horizontal";
	}

	if (VERTICAL_EDGE_POSITION_KEYWORDS.has(loweredTokenText)) {
		return "vertical";
	}

	if (loweredTokenText === "center") {
		return "middle";
	}

	if (isBackgroundPositionLengthToken(tokenText)) {
		return "length";
	}

	const atom = classifyStandardText(tokenText, { allowsColor: false });
	if (!atom) {
		return null;
	}

	switch (atom.kind) {
		case "percent":
		case "zero":
		case "calc":
			return "length";
		case "keyword":
			return "keyword";
		case "auto":
			return "middle";
		default:
			return null;
	}
}

function isBackgroundPositionLengthToken(tokenText: string): boolean {
	const atom = classifyStandardText(tokenText, { allowsColor: false });
	return atom?.kind === "length" || atom?.kind === "percent" || atom?.kind === "zero" || atom?.kind === "calc";
}

function inferMaskLabelParts(valueText: string | undefined, tokenCount: number): string[] | null {
	const semanticLabels = inferMaskSpecificLabelParts(valueText, tokenCount);
	if (semanticLabels) {
		return semanticLabels;
	}

	return inferLayeredSemanticLabelParts(valueText, tokenCount, MASK_LAYER_MATCHERS);
}

function inferMaskBorderSliceLabelParts(valueText: string | undefined, tokenCount: number): string[] | null {
	if (!valueText || tokenCount <= 0) {
		return null;
	}

	const sliceTokens = collectShorthandValueTokens(valueText)
		.map((token) => token.text.trim())
		.filter((tokenText) => tokenText.length > 0 && tokenText.toLowerCase() !== "fill");
	if (sliceTokens.length === 0 || sliceTokens.length > 4) {
		return null;
	}

	if (!sliceTokens.every(isMaskBorderSliceValueToken)) {
		return null;
	}

	return inferMaskBorderSliceSliceLabelParts(sliceTokens.length);
}

function buildMaskBorderSliceLabelSlots(valueText: string, labelParts: readonly string[]): string[] | null {
	const tokens = collectShorthandValueTokens(valueText);
	if (tokens.length === 0) {
		return null;
	}

	const slots = Array.from({ length: tokens.length }, () => "");
	let labelIndex = 0;
	let fillCount = 0;

	for (const [index, token] of tokens.entries()) {
		const tokenText = token.text.trim();
		if (!tokenText) {
			continue;
		}

		if (tokenText.toLowerCase() === "fill") {
			fillCount += 1;
			if (fillCount > 1) {
				return null;
			}

			continue;
		}

		if (!isMaskBorderSliceValueToken(tokenText)) {
			return null;
		}

		if (labelIndex >= labelParts.length) {
			return null;
		}

		slots[index] = labelParts[labelIndex] ?? "";
		labelIndex += 1;
	}

	return labelIndex === labelParts.length ? slots : null;
}

function inferMaskBorderSliceSliceLabelParts(sliceTokenCount: number): string[] | null {
	switch (sliceTokenCount) {
		case 1:
			return ["all"];
		case 2:
			return ["top/bottom", "left/right"];
		case 3:
			return ["top", "left/right", "bottom"];
		case 4:
			return ["top", "right", "bottom", "left"];
		default:
			return null;
	}
}

function isMaskBorderSliceValueToken(tokenText: string): boolean {
	return /^[+-]?(?:\d*\.\d+|\d+\.?\d*)%?$/.test(tokenText);
}

function inferMaskSpecificLabelParts(valueText: string | undefined, tokenCount: number): string[] | null {
	if (!valueText || tokenCount <= 0) {
		return null;
	}

	const tokens = collectShorthandValueTokens(valueText);
	if (tokens.length === 0) {
		return null;
	}

	const slashIndex = findTopLevelSlashIndex(valueText);
	const labels: string[] = [];
	let imageConsumed = false;
	let positionIndex = 0;
	let sizeIndex = 0;
	let originConsumed = false;

	for (const token of tokens) {
		const tokenText = token.text.trim();
		if (!tokenText) {
			continue;
		}

		if (!imageConsumed && isMaskImageToken(tokenText)) {
			labels.push("image");
			imageConsumed = true;
			continue;
		}

		if (slashIndex >= 0 && token.index > slashIndex) {
			if (!isMaskSizeToken(tokenText)) {
				return null;
			}

			labels.push(sizeIndex === 0 ? "width" : "height");
			sizeIndex += 1;
			continue;
		}

		if (isMaskPositionToken(tokenText)) {
			labels.push(positionIndex === 0 ? "top" : "left");
			positionIndex += 1;
			continue;
		}

		if (isMaskModeToken(tokenText)) {
			labels.push("mode");
			continue;
		}

		if (isMaskRepeatToken(tokenText)) {
			labels.push("repeat");
			continue;
		}

		if (tokenText === "no-clip") {
			labels.push("clip");
			continue;
		}

		if (matchesSyntaxTypeToken("geometry-box", tokenText)) {
			labels.push(originConsumed ? "clip" : "origin");
			originConsumed = true;
			continue;
		}

		if (isMaskCompositeToken(tokenText)) {
			labels.push("composite");
			continue;
		}

		return null;
	}

	return labels.length === tokenCount ? labels : null;
}

function isMaskImageToken(tokenText: string): boolean {
	return tokenText === "none" || matchesSyntaxTypeToken("mask-reference", tokenText);
}

function isMaskPositionToken(tokenText: string): boolean {
	return matchesSyntaxTypeToken("position", tokenText) || matchesSyntaxTypeToken("mask-position", tokenText);
}

function isMaskSizeToken(tokenText: string): boolean {
	return matchesSyntaxTypeToken("bg-size", tokenText);
}

function isMaskModeToken(tokenText: string): boolean {
	return matchesSyntaxTypeToken("masking-mode", tokenText);
}

function isMaskRepeatToken(tokenText: string): boolean {
	return matchesSyntaxTypeToken("repeat-style", tokenText);
}

function isMaskCompositeToken(tokenText: string): boolean {
	return matchesSyntaxTypeToken("compositing-operator", tokenText);
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

	const hasQuotedString = tokens.some((token) => /^(['"]).*\1$/.test(token));
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

function buildAnimationRangeLabelSlots(valueText: string, labelParts: readonly string[]): string[] | null {
	if (labelParts.length !== 2) {
		return null;
	}

	const tokens = collectShorthandValueTokens(valueText).map((token) => token.text);
	if (tokens.length === 0) {
		return null;
	}

	const slots = Array.from({ length: tokens.length }, () => "");
	slots[0] = labelParts[0] ?? "";

	if (tokens.length === 1) {
		return slots;
	}

	const secondLabelIndex = shouldShiftAnimationRangeEndLabel(tokens) ? 2 : 1;
	if (secondLabelIndex >= tokens.length) {
		return null;
	}

	slots[secondLabelIndex] = labelParts[1] ?? "";
	return slots;
}

function shouldShiftAnimationRangeEndLabel(tokens: readonly string[]): boolean {
	if (tokens.length < 3) {
		return false;
	}

	const firstToken = tokens[0]?.toLowerCase();
	const secondToken = tokens[1] ?? "";
	if (!firstToken || !ANIMATION_RANGE_RANGE_NAME_TOKENS.has(firstToken)) {
		return false;
	}

	return isLengthPercentageToken(secondToken);
}

function isLengthPercentageToken(token: string): boolean {
	const atom = classifyStandardText(token, { allowsColor: false });
	return atom?.kind === "length" || atom?.kind === "percent" || atom?.kind === "zero";
}

const ANIMATION_RANGE_RANGE_NAME_TOKENS = new Set(["cover", "contain", "entry", "exit"]);
const HORIZONTAL_EDGE_POSITION_KEYWORDS = new Set(["left", "right", "x-start", "x-end"]);
const VERTICAL_EDGE_POSITION_KEYWORDS = new Set(["top", "bottom", "y-start", "y-end"]);

const BACKGROUND_LAYER_MATCHERS: readonly LayeredSemanticMatcher[] = [
	{ label: "image", matches: (tokenText) => tokenText === "none" || matchesSyntaxTypeToken("bg-image", tokenText) },
	{
		label: "position",
		matches: (tokenText, context) =>
			(context.slashIndex < 0 || context.token.index < context.slashIndex) &&
			(matchesSyntaxTypeToken("bg-position", tokenText) || matchesSyntaxTypeToken("position", tokenText)),
	},
	{
		label: "size",
		matches: (tokenText, context) =>
			context.slashIndex >= 0 &&
			context.token.index > context.slashIndex &&
			matchesSyntaxTypeToken("bg-size", tokenText),
	},
	{ label: "repeat", matches: (tokenText) => matchesSyntaxTypeToken("repeat-style", tokenText) },
	{ label: "attachment", matches: (tokenText) => matchesSyntaxTypeToken("attachment", tokenText) },
	{
		label: "origin",
		matches: (tokenText, context) =>
			(matchesSyntaxTypeToken("visual-box", tokenText) || matchesSyntaxTypeToken("geometry-box", tokenText)) &&
			(context.seenLabelCounts.get("origin") ?? 0) === 0,
	},
	{
		label: "clip",
		matches: (tokenText, context) =>
			tokenText === "no-clip" ||
			matchesSyntaxTypeToken("bg-clip", tokenText) ||
			(matchesSyntaxTypeToken("geometry-box", tokenText) && (context.seenLabelCounts.get("origin") ?? 0) > 0),
	},
	{ label: "color", matches: (tokenText) => matchesSyntaxTypeToken("color", tokenText) },
];

const MASK_LAYER_MATCHERS: readonly LayeredSemanticMatcher[] = [
	{
		label: "image",
		matches: (tokenText) => tokenText === "none" || matchesSyntaxTypeToken("mask-reference", tokenText),
	},
	{ label: "mode", matches: (tokenText) => matchesSyntaxTypeToken("masking-mode", tokenText) },
	{
		label: "position",
		matches: (tokenText, context) =>
			(context.slashIndex < 0 || context.token.index < context.slashIndex) &&
			(matchesSyntaxTypeToken("position", tokenText) || matchesSyntaxTypeToken("mask-position", tokenText)),
	},
	{
		label: "size",
		matches: (tokenText, context) =>
			context.slashIndex >= 0 &&
			context.token.index > context.slashIndex &&
			matchesSyntaxTypeToken("bg-size", tokenText),
	},
	{ label: "repeat", matches: (tokenText) => matchesSyntaxTypeToken("repeat-style", tokenText) },
	{
		label: "origin",
		matches: (tokenText, context) =>
			matchesSyntaxTypeToken("geometry-box", tokenText) && (context.seenLabelCounts.get("origin") ?? 0) === 0,
	},
	{
		label: "clip",
		matches: (tokenText, context) =>
			tokenText === "no-clip" ||
			(matchesSyntaxTypeToken("geometry-box", tokenText) && (context.seenLabelCounts.get("origin") ?? 0) > 0),
	},
	{ label: "composite", matches: (tokenText) => matchesSyntaxTypeToken("compositing-operator", tokenText) },
];
