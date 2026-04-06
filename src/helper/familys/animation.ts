import { matchesSyntaxTypeToken } from "../classifyNormalize.js";
import { classifyStandardText } from "../../share/cssValueAtoms.js";
import {
	collectValueTokenTexts,
	createMappedSemanticSpec,
	splitTopLevelCommaSegments,
	type ShorthandSemanticSpec,
} from "./shared.js";

export function createAnimationSemanticSpecs(): readonly ShorthandSemanticSpec[] {
	return [
		{ propertyNames: ["animation"], getLabelParts: inferAnimationLabelParts },
		createMappedSemanticSpec(["animation-delay"], inferAnimationDelayTokenLabel),
		createMappedSemanticSpec(["animation-direction"], inferAnimationDirectionTokenLabel),
		createMappedSemanticSpec(["animation-duration"], inferAnimationDurationTokenLabel),
		createMappedSemanticSpec(["animation-fill-mode"], inferAnimationFillModeTokenLabel),
		createMappedSemanticSpec(["animation-iteration-count"], inferAnimationIterationCountTokenLabel),
		createMappedSemanticSpec(["animation-name"], inferAnimationNameTokenLabel),
		createMappedSemanticSpec(["animation-play-state"], inferAnimationPlayStateTokenLabel),
		createMappedSemanticSpec(["animation-timing-function"], inferAnimationTimingFunctionTokenLabel),
		{ propertyNames: ["animation-range"], getLabelSlots: buildAnimationRangeLabelSlots },
	];
}

function inferAnimationLabelParts(valueText: string | undefined, tokenCount: number): string[] | null {
	if (!valueText || tokenCount <= 0) {
		return null;
	}

	const labels: string[] = [];
	for (const segmentText of splitTopLevelCommaSegments(valueText)) {
		const segmentLabels = inferAnimationSegmentLabelParts(segmentText);
		if (!segmentLabels) {
			return null;
		}

		labels.push(...segmentLabels);
	}

	return labels.length === tokenCount ? uniquifyRepeatedLabels(labels) : null;
}

function inferAnimationSegmentLabelParts(segmentText: string): string[] | null {
	const tokenTexts = collectValueTokenTexts(segmentText);
	if (tokenTexts.length === 0) {
		return null;
	}

	const labels: string[] = [];
	let seenTimeTokens = 0;

	for (const tokenText of tokenTexts) {
		const label = inferAnimationTokenLabel(tokenText, seenTimeTokens);
		if (!label) {
			return null;
		}

		if (label === "duration" || label === "delay") {
			seenTimeTokens += 1;
		}

		labels.push(label);
	}

	return labels.length === tokenTexts.length ? uniquifyRepeatedLabels(labels) : null;
}

function inferAnimationTokenLabel(tokenText: string, seenTimeTokens: number): string | null {
	if (isAnimationTimeToken(tokenText)) {
		return seenTimeTokens === 0 ? "duration" : "delay";
	}

	if (isAnimationTimingFunctionToken(tokenText)) {
		return "easing";
	}

	if (isAnimationIterationCountToken(tokenText)) {
		return "repeat";
	}

	if (isAnimationDirectionToken(tokenText)) {
		return "flow";
	}

	if (isAnimationFillModeToken(tokenText)) {
		return "fill";
	}

	if (isAnimationPlayStateToken(tokenText)) {
		return "play";
	}

	if (isAnimationNameToken(tokenText)) {
		return "name";
	}

	return null;
}

function inferAnimationDelayTokenLabel(tokenText: string): string | null {
	return isAnimationTimeToken(tokenText) ? "offset" : null;
}

function inferAnimationDirectionTokenLabel(tokenText: string): string | null {
	return isAnimationDirectionToken(tokenText) ? "flow" : null;
}

function inferAnimationDurationTokenLabel(tokenText: string): string | null {
	return tokenText.toLowerCase() === "auto" || isAnimationTimeToken(tokenText) ? "time" : null;
}

function inferAnimationFillModeTokenLabel(tokenText: string): string | null {
	return tokenText.toLowerCase() === "none" || isAnimationFillModeToken(tokenText) ? "fill" : null;
}

function inferAnimationIterationCountTokenLabel(tokenText: string): string | null {
	return isAnimationIterationCountToken(tokenText) ? "repeat" : null;
}

function inferAnimationNameTokenLabel(tokenText: string): string | null {
	return isAnimationNameToken(tokenText) ? "keyframes" : null;
}

function inferAnimationPlayStateTokenLabel(tokenText: string): string | null {
	return isAnimationPlayStateToken(tokenText) ? "play" : null;
}

function inferAnimationTimingFunctionTokenLabel(tokenText: string): string | null {
	return isAnimationTimingFunctionToken(tokenText) ? "easing" : null;
}

function isAnimationTimeToken(tokenText: string): boolean {
	return tokenText.toLowerCase() === "auto" || matchesSyntaxTypeToken("time", tokenText);
}

function isAnimationTimingFunctionToken(tokenText: string): boolean {
	switch (tokenText.toLowerCase()) {
		case "start":
		case "end":
		case "step-start":
		case "step-end":
		case "jump-start":
		case "jump-end":
		case "jump-none":
		case "jump-both":
			return true;
		default:
			return matchesSyntaxTypeToken("easing-function", tokenText);
	}
}

function isAnimationIterationCountToken(tokenText: string): boolean {
	return tokenText.toLowerCase() === "infinite" || /^-?(?:\d*\.\d+|\d+\.?\d*)$/.test(tokenText);
}

function isAnimationDirectionToken(tokenText: string): boolean {
	switch (tokenText.toLowerCase()) {
		case "normal":
		case "reverse":
		case "alternate":
		case "alternate-reverse":
			return true;
		default:
			return false;
	}
}

function isAnimationFillModeToken(tokenText: string): boolean {
	switch (tokenText.toLowerCase()) {
		case "forwards":
		case "backwards":
		case "both":
			return true;
		default:
			return false;
	}
}

function isAnimationPlayStateToken(tokenText: string): boolean {
	return tokenText.toLowerCase() === "running" || tokenText.toLowerCase() === "paused";
}

function isAnimationNameToken(tokenText: string): boolean {
	return (
		tokenText.toLowerCase() === "none" ||
		matchesSyntaxTypeToken("custom-ident", tokenText) ||
		matchesSyntaxTypeToken("string", tokenText)
	);
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

function buildAnimationRangeLabelSlots(valueText: string, labelParts: readonly string[]): string[] | null {
	if (labelParts.length !== 2) {
		return null;
	}

	const tokens = collectValueTokenTexts(valueText);
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
