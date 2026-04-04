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

test("mapper rejects redundant reference-only suffix labels", () => {
	const mapper = createCssHintMapper();

	const mappedBlockSize = mapper.map([createInstruction("block-size", 1, "1rem")])[0];

	assert.equal(mappedBlockSize.label, "width");
	assert.ok(!mappedBlockSize.label.includes("block-size"));
	assert.throws(
		() => mapper.map([createInstruction("flood-opacity", 1, "0.5")]),
		/Forbidden label echo of property suffix/,
	);
	assert.throws(
		() => mapper.map([createInstruction("margin-block-end", 1, "1rem")]),
		/Forbidden label echo of property suffix/,
	);
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

	assert.equal(mappedBlockPadding.label, "start, end");
	assert.equal(mappedInlinePadding.label, "start, end");
});

test("mapper rejects forbidden global labels", () => {
	const mapper = createCssHintMapper();

	assert.throws(() => mapper.map([createInstruction("text-decoration", 1, "inherit")]), /Forbidden label "global"/);
});

test("mapper rejects labels that exactly match the value text", () => {
	const mapper = createCssHintMapper();

	assert.throws(() => mapper.map([createInstruction("text-box", 1, "normal")]), /Forbidden label echo of value/);
});
