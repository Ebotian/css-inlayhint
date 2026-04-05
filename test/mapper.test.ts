import assert from "node:assert/strict";
import test from "node:test";

import { createStandardPropertySamplingRule, generateExactCases } from "./lib/exactCssCaseGenerator.js";

type CssHintInstruction = {
	propertyName: string;
	label: string;
	valueText?: string;
	kind: "Parameter" | "BlockEnd";
	strategy: "inline-right" | "block-end-right";
	tokenCount: number;
	range: {
		start: { line: number; character: number };
		end: { line: number; character: number };
	};
};

type CssHintMapper = {
	map(instructions: readonly CssHintInstruction[]): CssHintInstruction[];
};

function createCssHintMapper(): CssHintMapper {
	const module = require("../src/mapper.js") as {
		createCssHintMapper: () => CssHintMapper;
	};

	return module.createCssHintMapper();
}

function createInstruction(propertyName: string, tokenCount: number, valueText?: string): CssHintInstruction {
	return {
		propertyName,
		label: `${propertyName}-${tokenCount}-values`,
		valueText,
		kind: "Parameter",
		strategy: "inline-right",
		tokenCount,
		range: {
			start: { line: 0, character: 0 },
			end: { line: 0, character: 0 },
		},
	};
}

test("mapper derives shorthand labels from standard family relations", () => {
	const mapper = createCssHintMapper();
	const rule = createStandardPropertySamplingRule("margin");
	const generatedCases = generateExactCases(rule);

	const expectedLabels = new Map([
		[1, "all"],
		[2, "top/bottom, right/left"],
		[3, "top, right/left, bottom"],
		[4, "top, right, bottom, left"],
	]);

	for (const [tokenCount, expectedLabel] of expectedLabels) {
		assert.ok(generatedCases.some((generatedCase) => generatedCase.valueAtoms.length === tokenCount));
		const mapped = mapper.map([createInstruction(rule.propertyName, tokenCount)])[0];
		assert.equal(mapped.label, expectedLabel);
	}
});

test("mapper derives border-radius corner labels from token counts", () => {
	const mapper = createCssHintMapper();

	const expectedLabels = new Map([
		[1, "all"],
		[2, "top-L/bottom-R, top-R/bottom-L"],
		[3, "top-L, top-R/bottom-L, bottom-R"],
		[4, "top-L, top-R, bottom-R, bottom-L"],
	]);

	for (const [tokenCount, expectedLabel] of expectedLabels) {
		const mapped = mapper.map([createInstruction("border-radius", tokenCount)])[0];
		assert.equal(mapped.label, expectedLabel);
	}
});

test("mapper derives border-family labels from actual border tokens", () => {
	const mapper = createCssHintMapper();

	const mappedBorderWidth = mapper.map([createInstruction("border", 1, "1px")])[0];
	const mappedBorderStyle = mapper.map([createInstruction("border", 1, "solid")])[0];
	const mappedBorderColor = mapper.map([createInstruction("border", 1, "red")])[0];
	const mappedBorderPair = mapper.map([createInstruction("border", 2, "1px solid")])[0];
	const mappedBorderTop = mapper.map([createInstruction("border-top", 3, "1px solid red")])[0];

	assert.equal(mappedBorderWidth.label, "width");
	assert.equal(mappedBorderStyle.label, "style");
	assert.equal(mappedBorderColor.label, "color");
	assert.equal(mappedBorderPair.label, "width, style");
	assert.equal(mappedBorderTop.label, "width, style, color");
	assert.ok(!mappedBorderStyle.label.includes("border"));
	assert.ok(!mappedBorderColor.label.includes("border"));
});

test("mapper derives corner-radius labels from single-corner values", () => {
	const mapper = createCssHintMapper();

	const mappedSingle = mapper.map([createInstruction("border-bottom-left-radius", 1, "20%")])[0];
	const mappedPair = mapper.map([createInstruction("border-bottom-left-radius", 2, "20% 10%")])[0];

	assert.equal(mappedSingle.label, "all");
	assert.equal(mappedPair.label, "horizontal, vertical");
	assert.ok(!mappedSingle.label.includes("border-bottom-left-radius"));
});

test("mapper derives animation-range labels from reference syntax", () => {
	const mapper = createCssHintMapper();

	const mappedSingle = mapper.map([createInstruction("animation-range", 1, "cover")])[0];
	const mappedPair = mapper.map([createInstruction("animation-range", 2, "cover 20%")])[0];

	assert.equal(mappedSingle.label, "start");
	assert.equal(mappedPair.label, "start, end");
	assert.ok(!mappedSingle.label.includes("animation-range"));
});

test("mapper keeps non-hintable reference-only properties on the fallback path", () => {
	const mapper = createCssHintMapper();

	const mappedTimeline = mapper.map([createInstruction("animation-timeline", 1, "auto")])[0];

	assert.equal(mappedTimeline.label, "animation-timeline-1-values");
	assert.ok(mappedTimeline.label.includes("animation-timeline"));
});

test("mapper derives list-style member labels from the actual value text", () => {
	const mapper = createCssHintMapper();

	const mappedType = mapper.map([createInstruction("list-style", 1, "none")])[0];
	const mappedPosition = mapper.map([createInstruction("list-style", 1, "inside")])[0];
	const mappedPair = mapper.map([createInstruction("list-style", 2, "none inside")])[0];

	assert.equal(mappedType.label, "type");
	assert.equal(mappedPosition.label, "position");
	assert.equal(mappedPair.label, "type, position");
});

test("mapper trims text-decoration member prefixes and rejects composite fallback", () => {
	const mapper = createCssHintMapper();

	const mappedLine = mapper.map([createInstruction("text-decoration", 1, "underline")])[0];
	const mappedStyle = mapper.map([createInstruction("text-decoration", 1, "double")])[0];
	const mappedColor = mapper.map([createInstruction("text-decoration", 1, "red")])[0];
	const mappedPair = mapper.map([createInstruction("text-decoration", 2, "underline red")])[0];

	assert.equal(mappedLine.label, "line");
	assert.equal(mappedStyle.label, "style");
	assert.equal(mappedColor.label, "color");
	assert.equal(mappedPair.label, "line, color");
	assert.ok(!mappedLine.label.includes("text-decoration"));
	assert.ok(!mappedColor.label.includes("text-decoration"));
});

test("mapper derives offset-rotate direction and angle labels", () => {
	const mapper = createCssHintMapper();

	const mappedDirection = mapper.map([createInstruction("offset-rotate", 1, "auto")])[0];
	const mappedAngle = mapper.map([createInstruction("offset-rotate", 1, "90deg")])[0];
	const mappedPair = mapper.map([createInstruction("offset-rotate", 2, "auto 90deg")])[0];

	assert.equal(mappedDirection.label, "direction");
	assert.equal(mappedAngle.label, "angle");
	assert.equal(mappedPair.label, "direction, angle");
	assert.ok(!mappedDirection.label.includes("rotate"));
	assert.ok(!mappedPair.label.includes("rotate"));
});

test("mapper derives logical-axis shorthand labels", () => {
	const mapper = createCssHintMapper();

	const mappedBlockPadding = mapper.map([createInstruction("scroll-padding-block", 2)])[0];
	const mappedInlinePadding = mapper.map([createInstruction("scroll-padding-inline", 2)])[0];
	const mappedPaddingBlock = mapper.map([createInstruction("padding-block", 2, "10px 20px")])[0];
	const mappedPaddingInline = mapper.map([createInstruction("padding-inline", 2, "10px 20px")])[0];
	const mappedInsetBlock = mapper.map([createInstruction("inset-block", 2, "3px 10px")])[0];
	const mappedInsetInline = mapper.map([createInstruction("inset-inline", 2, "3px 10px")])[0];

	assert.equal(mappedBlockPadding.label, "start, end");
	assert.equal(mappedInlinePadding.label, "start, end");
	assert.equal(mappedPaddingBlock.label, "start, end");
	assert.equal(mappedPaddingInline.label, "start, end");
	assert.equal(mappedInsetBlock.label, "start, end");
	assert.equal(mappedInsetInline.label, "start, end");
});

test("mapper derives scroll-margin labels", () => {
	const mapper = createCssHintMapper();

	const mappedSingle = mapper.map([createInstruction("scroll-margin", 1, "10px")])[0];
	const mappedPair = mapper.map([createInstruction("scroll-margin", 2, "4px 8px")])[0];
	const mappedBlock = mapper.map([createInstruction("scroll-margin-block", 2, "3px 10px")])[0];
	const mappedInline = mapper.map([createInstruction("scroll-margin-inline", 2, "3px 10px")])[0];

	assert.equal(mappedSingle.label, "all");
	assert.equal(mappedPair.label, "top/bottom, right/left");
	assert.equal(mappedBlock.label, "start, end");
	assert.equal(mappedInline.label, "start, end");
});

test("mapper derives border-spacing labels from semantic axes", () => {
	const mapper = createCssHintMapper();

	const mappedSingle = mapper.map([createInstruction("border-spacing", 1, "2px")])[0];
	const mappedPair = mapper.map([createInstruction("border-spacing", 2, "1cm 2em")])[0];

	assert.equal(mappedSingle.label, "all");
	assert.equal(mappedPair.label, "horizontal, vertical");
});

test("mapper derives corner-shape labels", () => {
	const mapper = createCssHintMapper();

	const mappedRightSingle = mapper.map([createInstruction("corner-right-shape", 1, "bevel")])[0];
	const mappedRightPair = mapper.map([createInstruction("corner-right-shape", 2, "bevel notch")])[0];
	const mappedInlineEndPair = mapper.map([createInstruction("corner-inline-end-shape", 2, "squircle scoop")])[0];
	const mappedBottomPair = mapper.map([createInstruction("corner-bottom-shape", 2, "scoop square")])[0];
	const mappedBlockEndPair = mapper.map([createInstruction("corner-block-end-shape", 2, "square scoop")])[0];
	const mappedCornerSingle = mapper.map([createInstruction("corner-bottom-left-shape", 1, "bevel")])[0];

	assert.equal(mappedRightSingle.label, "all");
	assert.equal(mappedRightPair.label, "top, bottom");
	assert.equal(mappedInlineEndPair.label, "block-start, block-end");
	assert.equal(mappedBottomPair.label, "left, right");
	assert.equal(mappedBlockEndPair.label, "inline-start, inline-end");
	assert.equal(mappedCornerSingle.label, "all");
});

test("mapper derives background-position repeatable-list labels", () => {
	const mapper = createCssHintMapper();

	const mappedFourToken = mapper.map([createInstruction("background-position", 4, "bottom 10px right 20px")])[0];
	const mappedThreeTokenEdgeOffset = mapper.map([createInstruction("background-position", 3, "bottom 10px right")])[0];
	const mappedThreeToken = mapper.map([createInstruction("background-position", 3, "top right 10px")])[0];
	const mappedTwoLengthToken = mapper.map([createInstruction("background-position", 2, "25% 75%")])[0];
	const mappedCenter = mapper.map([createInstruction("background-position", 1, "center")])[0];
	const mappedLogicalDirection = mapper.map([createInstruction("background-position", 1, "x-start")])[0];

	assert.equal(mappedFourToken.label, "vertical, length, horizontal, length");
	assert.equal(mappedThreeTokenEdgeOffset.label, "vertical, length, horizontal");
	assert.equal(mappedThreeToken.label, "vertical, horizontal, length");
	assert.equal(mappedTwoLengthToken.label, "horizontal, vertical");
	assert.equal(mappedCenter.label, "middle");
	assert.equal(mappedLogicalDirection.label, "horizontal");
	assert.deepEqual((mappedFourToken as { labelSlots?: readonly string[] }).labelSlots, [
		"vertical",
		"length",
		"horizontal",
		"length",
	]);
	assert.ok(!mappedFourToken.label.includes("background-position"));
});

test("mapper suppresses grid-template none and labels string areas", () => {
	const mapper = createCssHintMapper();

	const mappedNone = mapper.map([createInstruction("grid-template", 1, "none")])[0];
	const mappedAreas = mapper.map([createInstruction("grid-template", 1, '"a"')])[0];

	assert.equal(mappedNone.label, "");
	assert.equal(mappedAreas.label, "areas");
});

test("mapper derives gap and place-family labels", () => {
	const mapper = createCssHintMapper();

	const mappedGapSingle = mapper.map([createInstruction("gap", 1, "10px")])[0];
	const mappedGapPair = mapper.map([createInstruction("gap", 2, "10px 20px")])[0];
	const mappedPlaceContentSingle = mapper.map([createInstruction("place-content", 1, "center")])[0];
	const mappedPlaceContentPair = mapper.map([createInstruction("place-content", 2, "center space-between")])[0];
	const mappedPlaceItemsPair = mapper.map([createInstruction("place-items", 2, "center start")])[0];
	const mappedPlaceSelfPair = mapper.map([createInstruction("place-self", 2, "center start")])[0];

	assert.equal(mappedGapSingle.label, "all");
	assert.equal(mappedGapPair.label, "row, column");
	assert.equal(mappedPlaceContentSingle.label, "all");
	assert.equal(mappedPlaceContentPair.label, "align, justify");
	assert.equal(mappedPlaceItemsPair.label, "align, justify");
	assert.equal(mappedPlaceSelfPair.label, "align, justify");
});

test("mapper derives mask-border-slice labels and skips fill", () => {
	const mapper = createCssHintMapper();

	const mappedSingle = mapper.map([createInstruction("mask-border-slice", 1, "30%")])[0];
	const mappedPair = mapper.map([createInstruction("mask-border-slice", 2, "10% 30%")])[0];
	const mappedFill = mapper.map([createInstruction("mask-border-slice", 4, "10% fill 7 12")])[0];

	assert.equal(mappedSingle.label, "all");
	assert.equal(mappedPair.label, "top/bottom, left/right");
	assert.equal(mappedFill.label, "top, left/right, bottom");
	assert.deepEqual((mappedFill as { labelSlots?: readonly string[] }).labelSlots, ["top", "", "left/right", "bottom"]);
});

test("mapper compacts background member labels", () => {
	const mapper = createCssHintMapper();

	const mappedSingle = mapper.map([createInstruction("background", 1, "url(x)")])[0];
	const mappedPair = mapper.map([createInstruction("background", 2, "url(x) center")])[0];
	const mappedOriginColor = mapper.map([createInstruction("background", 2, "border-box red")])[0];

	assert.equal(mappedSingle.label, "image");
	assert.equal(mappedPair.label, "image, position");
	assert.equal(mappedOriginColor.label, "origin, color");
});

test("mapper derives mask layer labels from the actual value text", () => {
	const mapper = createCssHintMapper();

	const mappedMode = mapper.map([createInstruction("mask", 2, 'url("masks.svg#star") luminance')])[0];
	const mappedPosition = mapper.map([createInstruction("mask", 3, 'url("masks.svg#star") 40px 20px')])[0];
	const mappedLayer = mapper.map([createInstruction("mask", 5, 'url("masks.svg#star") 0 0/50px 50px')])[0];

	assert.equal(mappedMode.label, "image, mode");
	assert.equal(mappedPosition.label, "image, top, left");
	assert.equal(mappedLayer.label, "image, top, left, width, height");
	assert.ok(!mappedLayer.label.includes("mask"));
});

test("mapper derives inset labels from repeated edge values", () => {
	const mapper = createCssHintMapper();

	const mappedSingle = mapper.map([createInstruction("inset", 1, "10px")])[0];
	const mappedPair = mapper.map([createInstruction("inset", 2, "4px 8px")])[0];
	const mappedTriple = mapper.map([createInstruction("inset", 3, "5px 15px 10px")])[0];
	const mappedQuad = mapper.map([createInstruction("inset", 4, "2.4em 3em 3em 3em")])[0];

	assert.equal(mappedSingle.label, "all");
	assert.equal(mappedPair.label, "top/bottom, right/left");
	assert.equal(mappedTriple.label, "top, right/left, bottom");
	assert.equal(mappedQuad.label, "top, right, bottom, left");
});

test("mapper rejects forbidden global labels", () => {
	const mapper = createCssHintMapper();

	assert.throws(() => mapper.map([createInstruction("text-decoration", 1, "inherit")]), /Forbidden label "global"/);
});

test("mapper rejects labels that exactly match the value text", () => {
	const mapper = createCssHintMapper();

	assert.throws(() => mapper.map([createInstruction("text-box", 1, "normal")]), /Forbidden label echo of value/);
});
