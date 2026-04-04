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

test("mapper derives shorthand-family component labels", () => {
	const mapper = createCssHintMapper();

	const mappedBorder = mapper.map([createInstruction("border", 1)])[0];
	const mappedFlexFlow = mapper.map([createInstruction("flex-flow", 1)])[0];
	const mappedColumns = mapper.map([createInstruction("columns", 1)])[0];

	assert.equal(mappedBorder.label, "width");
	assert.equal(mappedFlexFlow.label, "direction");
	assert.equal(mappedColumns.label, "width");
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

test("mapper derives logical-axis shorthand labels", () => {
	const mapper = createCssHintMapper();

	const mappedBlockPadding = mapper.map([createInstruction("scroll-padding-block", 2)])[0];
	const mappedInlinePadding = mapper.map([createInstruction("scroll-padding-inline", 2)])[0];

	assert.equal(mappedBlockPadding.label, "start, end");
	assert.equal(mappedInlinePadding.label, "start, end");
});
