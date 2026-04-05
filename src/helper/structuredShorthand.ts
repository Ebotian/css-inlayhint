import { collectShorthandValueTokens } from "./classifyNormalize.js";
import {
	isCornerRadiusProperty,
	isInsetProperty,
	isLogicalAxisRepeatProperty,
	isScrollMarginProperty,
} from "./judgment.js";

export function isStructuredShorthandProperty(propertyName: string): boolean {
	return (
		propertyName === "border-radius" ||
		propertyName === "border-spacing" ||
		propertyName === "mask-border-slice" ||
		isCornerShapeProperty(propertyName) ||
		isCornerRadiusProperty(propertyName) ||
		isLogicalAxisRepeatProperty(propertyName) ||
		isInsetProperty(propertyName) ||
		isScrollMarginProperty(propertyName)
	);
}

export function isBorderRadiusProperty(propertyName: string): boolean {
	return propertyName === "border-radius";
}

export function isCornerShapeProperty(propertyName: string): boolean {
	return /^corner-(?:[a-z]+(?:-[a-z]+)*)-shape$/.test(propertyName);
}

export function countStructuredShorthandTokens(propertyName: string, valueText: string): number {
	if (isBorderRadiusProperty(propertyName)) {
		return countBorderRadiusTokens(valueText);
	}

	return Math.max(1, collectShorthandValueTokens(valueText).length);
}

export function inferStructuredShorthandLabelParts(propertyName: string, tokenCount: number): string[] | null {
	if (isCornerShapeProperty(propertyName)) {
		return inferCornerShapeLabelParts(propertyName, tokenCount);
	}

	if (propertyName === "border-spacing") {
		if (tokenCount === 1) {
			return ["all"];
		}

		if (tokenCount === 2) {
			return ["horizontal", "vertical"];
		}

		return null;
	}

	if (isCornerRadiusProperty(propertyName)) {
		if (tokenCount === 1) {
			return ["all"];
		}

		if (tokenCount === 2) {
			return ["horizontal", "vertical"];
		}

		return null;
	}

	if (isLogicalAxisRepeatProperty(propertyName)) {
		if (tokenCount === 1) {
			return ["all"];
		}

		if (tokenCount === 2) {
			return ["start", "end"];
		}

		return null;
	}

	if (isInsetProperty(propertyName) || isScrollMarginProperty(propertyName)) {
		return inferInsetLabelParts(tokenCount);
	}

	return null;
}

function inferCornerShapeLabelParts(propertyName: string, tokenCount: number): string[] | null {
	if (tokenCount === 1) {
		return ["all"];
	}

	const pairLabels = CORNER_SHAPE_PAIR_LABELS.get(propertyName);
	if (!pairLabels || tokenCount !== 2) {
		return null;
	}

	return [...pairLabels];
}

const CORNER_SHAPE_PAIR_LABELS = new Map<string, readonly [string, string]>([
	["corner-top-shape", ["left", "right"]],
	["corner-right-shape", ["top", "bottom"]],
	["corner-bottom-shape", ["left", "right"]],
	["corner-left-shape", ["top", "bottom"]],
	["corner-block-start-shape", ["inline-start", "inline-end"]],
	["corner-block-end-shape", ["inline-start", "inline-end"]],
	["corner-inline-start-shape", ["block-start", "block-end"]],
	["corner-inline-end-shape", ["block-start", "block-end"]],
]);

function inferInsetLabelParts(tokenCount: number): string[] | null {
	switch (tokenCount) {
		case 1:
			return ["all"];
		case 2:
			return ["top/bottom", "right/left"];
		case 3:
			return ["top", "right/left", "bottom"];
		case 4:
			return ["top", "right", "bottom", "left"];
		default:
			return null;
	}
}

function countBorderRadiusTokens(valueText: string): number {
	let tokenCount = 0;
	let maxTokenCount = 0;
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

		if (depth === 0 && character === "/") {
			if (inToken) {
				tokenCount += 1;
				inToken = false;
			}

			if (tokenCount > maxTokenCount) {
				maxTokenCount = tokenCount;
			}

			tokenCount = 0;
			continue;
		}

		if (depth === 0 && (character === "," || /\s/.test(character))) {
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

	if (tokenCount > maxTokenCount) {
		maxTokenCount = tokenCount;
	}

	return Math.max(1, maxTokenCount);
}
