import { classifyStandardText } from "../../share/cssValueAtoms.js";
import { inferLayeredSemanticLabelParts, type LayeredSemanticMatcher } from "../layeredSyntax.js";
import {
	collectValueTokenTexts,
	createMappedSemanticSpec,
	splitTopLevelCommaSegments,
	type ShorthandSemanticSpec,
} from "./shared.js";
import { matchesSyntaxTypeToken } from "../classifyNormalize.js";

const HORIZONTAL_EDGE_POSITION_KEYWORDS = new Set(["left", "right", "x-start", "x-end"]);
const VERTICAL_EDGE_POSITION_KEYWORDS = new Set(["top", "bottom", "y-start", "y-end"]);

export function createBackgroundSemanticSpecs(): readonly ShorthandSemanticSpec[] {
	return [
		{ propertyNames: ["background"], getLabelParts: inferBackgroundLabelParts },
		createMappedSemanticSpec(["background-blend-mode"], inferBackgroundBlendModeTokenLabel),
		createMappedSemanticSpec(["background-clip"], inferBackgroundClipTokenLabel),
		createMappedSemanticSpec(["background-image"], inferBackgroundImageTokenLabel),
		createMappedSemanticSpec(["background-origin"], inferBackgroundOriginTokenLabel),
		createAxisBackgroundSemanticSpec(["background-position-x"]),
		createAxisBackgroundSemanticSpec(["background-position-y"]),
		createBackgroundPositionSemanticSpec(["background-position"]),
		createBackgroundAttachmentSemanticSpec(["background-attachment"]),
		createBackgroundRepeatSemanticSpec(["background-repeat"]),
		createBackgroundSizeSemanticSpec(["background-size"]),
	];
}

function inferBackgroundLabelParts(valueText: string | undefined, tokenCount: number): string[] | null {
	const labels = inferLayeredSemanticLabelParts(valueText, tokenCount, BACKGROUND_LAYER_MATCHERS);
	return labels ? uniquifyRepeatedLabels(labels) : null;
}

function uniquifyRepeatedLabels(labels: readonly string[]): string[] {
	const seenCounts = new Map<string, number>();
	return labels.map((label, index) => {
		const count = (seenCounts.get(label) ?? 0) + 1;
		seenCounts.set(label, count);
		if (count === 1) {
			return label;
		}

		if (index === labels.length - 1) {
			return "final";
		}

		return `${label}-${count}`;
	});
}

function createAxisBackgroundSemanticSpec(propertyNames: readonly string[]): ShorthandSemanticSpec {
	return {
		propertyNames,
		getLabelParts: (valueText, tokenCount) =>
			inferBackgroundTokenLabelParts(valueText, tokenCount, inferBackgroundAxisPositionLabels),
		getLabelSlots: (valueText, labelParts) =>
			buildBackgroundTokenLabelSlots(valueText, labelParts, inferBackgroundAxisPositionLabels),
	};
}

function createBackgroundPositionSemanticSpec(propertyNames: readonly string[]): ShorthandSemanticSpec {
	return {
		propertyNames,
		getLabelParts: inferBackgroundPositionLabelParts,
		getLabelSlots: buildBackgroundPositionLabelSlots,
	};
}

function createBackgroundSizeSemanticSpec(propertyNames: readonly string[]): ShorthandSemanticSpec {
	return {
		propertyNames,
		getLabelParts: inferBackgroundSizeLabelParts,
		getLabelSlots: buildBackgroundSizeLabelSlots,
	};
}

function createBackgroundAttachmentSemanticSpec(propertyNames: readonly string[]): ShorthandSemanticSpec {
	return createMappedSemanticSpec(propertyNames, inferBackgroundAttachmentTokenLabel);
}

function createBackgroundRepeatSemanticSpec(propertyNames: readonly string[]): ShorthandSemanticSpec {
	return {
		propertyNames,
		getLabelParts: inferBackgroundRepeatLabelParts,
		getLabelSlots: buildBackgroundRepeatLabelSlots,
	};
}

function inferBackgroundRepeatLabelParts(valueText: string | undefined, tokenCount: number): string[] | null {
	if (!valueText || tokenCount <= 0) {
		return null;
	}

	const tokenTexts = collectValueTokenTexts(valueText);
	if (tokenTexts.length !== tokenCount) {
		return null;
	}

	if (tokenCount === 2) {
		return tokenTexts.every((tokenText) => inferBackgroundRepeatTokenLabel(tokenText) !== null)
			? ["horizontal", "vertical"]
			: null;
	}

	const labels = tokenTexts.map((tokenText) => inferBackgroundRepeatTokenLabel(tokenText));
	if (labels.some((label) => !label)) {
		return null;
	}

	return labels as string[];
}

function buildBackgroundRepeatLabelSlots(valueText: string, labelParts: readonly string[]): string[] | null {
	const tokenTexts = collectValueTokenTexts(valueText);
	if (tokenTexts.length !== labelParts.length) {
		return null;
	}

	if (tokenTexts.length === 2) {
		return tokenTexts.every((tokenText) => inferBackgroundRepeatTokenLabel(tokenText) !== null)
			? ["horizontal", "vertical"]
			: null;
	}

	const labels = tokenTexts.map((tokenText) => inferBackgroundRepeatTokenLabel(tokenText));
	if (labels.some((label) => !label)) {
		return null;
	}

	return labels as string[];
}

function inferBackgroundPositionLabelParts(valueText: string | undefined, tokenCount: number): string[] | null {
	if (!valueText || tokenCount <= 0) {
		return null;
	}

	const tokenTexts = collectValueTokenTexts(valueText);
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

function buildBackgroundPositionLabelSlots(valueText: string, labelParts: readonly string[]): string[] | null {
	return buildBackgroundTokenLabelSlots(valueText, labelParts, (tokenTexts) => {
		if (tokenTexts.length === 2 && tokenTexts.every(isBackgroundPositionLengthToken)) {
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

		return labels.length === tokenTexts.length ? labels : null;
	});
}

function inferBackgroundSizeLabelParts(valueText: string | undefined, tokenCount: number): string[] | null {
	if (!valueText || tokenCount <= 0) {
		return null;
	}

	const labels: string[] = [];
	for (const segmentText of splitTopLevelCommaSegments(valueText)) {
		const tokenTexts = collectValueTokenTexts(segmentText);
		if (tokenTexts.length === 0) {
			return null;
		}

		const segmentLabels = inferBackgroundSizeSegmentLabels(tokenTexts);
		if (!segmentLabels) {
			return null;
		}

		labels.push(...segmentLabels);
	}

	return labels.length === tokenCount ? labels : null;
}

function buildBackgroundSizeLabelSlots(valueText: string, labelParts: readonly string[]): string[] | null {
	if (!valueText || labelParts.length === 0) {
		return null;
	}

	const labels: string[] = [];
	for (const segmentText of splitTopLevelCommaSegments(valueText)) {
		const tokenTexts = collectValueTokenTexts(segmentText);
		if (tokenTexts.length === 0) {
			return null;
		}

		const segmentLabels = inferBackgroundSizeSegmentLabels(tokenTexts);
		if (!segmentLabels) {
			return null;
		}

		labels.push(...segmentLabels);
	}

	return labels.length === labelParts.length ? labels : null;
}

function inferBackgroundTokenLabelParts(
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

function buildBackgroundTokenLabelSlots(
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

function inferBackgroundAxisPositionLabels(tokenTexts: readonly string[]): string[] | null {
	if (tokenTexts.length === 0) {
		return null;
	}

	if (tokenTexts.length === 2 && tokenTexts.every(isBackgroundPositionLengthToken)) {
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

	return labels.length === tokenTexts.length ? labels : null;
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

function inferBackgroundAttachmentTokenLabel(tokenText: string): string | null {
	switch (tokenText.toLowerCase()) {
		case "fixed":
			return "viewport";
		case "local":
			return "content";
		case "scroll":
			return "border";
		default:
			return null;
	}
}

function inferBackgroundBlendModeTokenLabel(tokenText: string): string | null {
	if (tokenText.toLowerCase() === "normal") {
		return "default";
	}

	return isBackgroundBlendModeToken(tokenText) ? "blend" : null;
}

function inferBackgroundClipTokenLabel(tokenText: string): string | null {
	switch (tokenText.toLowerCase()) {
		case "border-box":
			return "border";
		case "padding-box":
			return "padding";
		case "content-box":
			return "content";
		case "text":
			return "glyph";
		case "border-area":
			return "border-layer";
		default:
			return null;
	}
}

function inferBackgroundImageTokenLabel(tokenText: string): string | null {
	if (tokenText.toLowerCase() === "none") {
		return "absent";
	}

	return "graphic";
}

function inferBackgroundOriginTokenLabel(tokenText: string): string | null {
	switch (tokenText.toLowerCase()) {
		case "border-box":
			return "border";
		case "padding-box":
			return "padding";
		case "content-box":
			return "content";
		default:
			return null;
	}
}

function inferBackgroundRepeatTokenLabel(tokenText: string): string | null {
	switch (tokenText.toLowerCase()) {
		case "repeat":
			return "tiling";
		case "no-repeat":
			return "single";
		case "space":
			return "distributed";
		case "round":
			return "scaled";
		case "repeat-x":
			return "horizontal";
		case "repeat-y":
			return "vertical";
		default:
			return null;
	}
}

function inferBackgroundSizeSegmentLabels(tokenTexts: readonly string[]): string[] | null {
	if (tokenTexts.length === 0 || tokenTexts.length > 2) {
		return null;
	}

	if (tokenTexts.length === 2 && tokenTexts.every(isBackgroundSizeDimensionToken)) {
		return ["width", "height"];
	}

	const labels: string[] = [];
	for (const tokenText of tokenTexts) {
		if (isBackgroundSizeFitToken(tokenText)) {
			labels.push("fit");
			continue;
		}

		if (isBackgroundSizeDimensionToken(tokenText)) {
			labels.push("width");
			continue;
		}

		return null;
	}

	return labels.length === tokenTexts.length ? labels : null;
}

function isBackgroundBlendModeToken(tokenText: string): boolean {
	return matchesSyntaxTypeToken("blend-mode", tokenText) || tokenText.toLowerCase() === "plus-lighter";
}

function isBackgroundSizeFitToken(tokenText: string): boolean {
	return tokenText.toLowerCase() === "cover" || tokenText.toLowerCase() === "contain";
}

function isBackgroundSizeDimensionToken(tokenText: string): boolean {
	const atom = classifyStandardText(tokenText, { allowsColor: false });
	return atom?.kind === "length" || atom?.kind === "percent" || atom?.kind === "zero" || atom?.kind === "auto";
}

function isBackgroundPositionLengthToken(tokenText: string): boolean {
	const atom = classifyStandardText(tokenText, { allowsColor: false });
	return atom?.kind === "length" || atom?.kind === "percent" || atom?.kind === "zero" || atom?.kind === "calc";
}

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
	{ label: "tiling", matches: (tokenText) => matchesSyntaxTypeToken("repeat-style", tokenText) },
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
