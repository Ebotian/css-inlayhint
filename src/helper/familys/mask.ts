import { inferLayeredSemanticLabelParts, findTopLevelSlashIndex } from "../layeredSyntax.js";
import { type ShorthandSemanticSpec } from "./shared.js";
import { matchesSyntaxTypeToken } from "../classifyNormalize.js";
import { collectShorthandValueTokens } from "../classifyNormalize.js";

export function createMaskSemanticSpecs(): readonly ShorthandSemanticSpec[] {
	return [
		{
			propertyNames: ["mask-border-slice"],
			getLabelParts: inferMaskBorderSliceLabelParts,
			getLabelSlots: buildMaskBorderSliceLabelSlots,
		},
		{ propertyNames: ["mask"], getLabelParts: inferMaskLabelParts },
	];
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

const MASK_LAYER_MATCHERS: readonly import("../layeredSyntax.js").LayeredSemanticMatcher[] = [
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
