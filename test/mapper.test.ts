import assert from "node:assert/strict";
import test from "node:test";

import { createStandardPropertySamplingRule, generateExactCases } from "./lib/exactCssCaseGenerator.js";

type CssHintInstruction = {
	propertyName: string;
	label: string;
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

function createInstruction(propertyName: string, tokenCount: number): CssHintInstruction {
	return {
		propertyName,
		label: `${propertyName}-${tokenCount}-values`,
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
		[2, "top-left/bottom-right, top-right/bottom-left"],
		[3, "top-left, top-right/bottom-left, bottom-right"],
		[4, "top-left, top-right, bottom-right, bottom-left"],
	]);

	for (const [tokenCount, expectedLabel] of expectedLabels) {
		const mapped = mapper.map([createInstruction("border-radius", tokenCount)])[0];
		assert.equal(mapped.label, expectedLabel);
	}
});
