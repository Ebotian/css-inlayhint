import assert from "node:assert/strict";
import test from "node:test";

import type { CssHintInstruction } from "../src/collector.js";
import { createStandardPropertySamplingRule, generateExactCases } from "./lib/exactCssCaseGenerator.js";

type CssHintCollector = {
	collect(sourceText: string): CssHintInstruction[];
};

type CssHintFilter = {
	filter(instructions: readonly CssHintInstruction[]): CssHintInstruction[];
};

type CssHintMapper = {
	map(instructions: readonly CssHintInstruction[]): CssHintInstruction[];
};

function createCssHintPipeline(options: { collector: CssHintCollector; filter: CssHintFilter; mapper: CssHintMapper }) {
	const module = require("../src/pipeline.js") as any;

	return module.createCssHintPipeline(options);
}

test("pipeline composes collector output with filter cleanup", () => {
	const rule = createStandardPropertySamplingRule("padding");
	const generatedCase = generateExactCases(rule).find((candidateCase) => candidateCase.valueAtoms.length === 2);

	assert.ok(generatedCase);

	let capturedSourceText = "";
	let capturedCollectorOutput: CssHintInstruction[] = [];

	const pipeline = createCssHintPipeline({
		collector: {
			collect(sourceText) {
				capturedSourceText = sourceText;
				capturedCollectorOutput = [
					{
						propertyName: "padding",
						label: "padding-4-values",
						kind: "Parameter",
						strategy: "inline-right",
						tokenCount: generatedCase.valueAtoms.length,
						valueText: "1rem 2rem",
						range: {
							start: { line: 2, character: 4 },
							end: { line: 2, character: 19 },
						},
						valueRange: {
							start: { line: 2, character: 11 },
							end: { line: 2, character: 19 },
						},
					},
				];
				return capturedCollectorOutput;
			},
		},
		filter: {
			filter(instructions) {
				assert.strictEqual(instructions, capturedCollectorOutput);
				return instructions;
			},
		},
		mapper: {
			map(instructions) {
				assert.strictEqual(instructions, capturedCollectorOutput);
				return instructions.map((instruction) => ({
					...instruction,
					label: "top/bottom, right/left",
				}));
			},
		},
	});

	const instructions = pipeline.collect(generatedCase.code);

	assert.equal(capturedSourceText, generatedCase.code);
	assert.equal(instructions.length, 1);
	assert.equal(instructions[0].propertyName, "padding");
	assert.equal(instructions[0].label, "top/bottom, right/left");
});
