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

type CssHintShapeParser = {
	parse(instructions: readonly CssHintInstruction[]): CssHintInstruction[];
};

type CssHintMapper = {
	map(instructions: readonly CssHintInstruction[]): CssHintInstruction[];
};

function createCssHintPipeline(options: {
	collector: CssHintCollector;
	filter: CssHintFilter;
	shapeParser: CssHintShapeParser;
	mapper: CssHintMapper;
}) {
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
						state: "matched",
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
		shapeParser: {
			parse(instructions) {
				assert.strictEqual(instructions, capturedCollectorOutput);
				return [...instructions].map((instruction) => ({
					...instruction,
					shape: { family: "box-sides", tokenCount: instruction.tokenCount },
				}));
			},
		},
		mapper: {
			map(instructions) {
				assert.equal(instructions.length, capturedCollectorOutput.length);
				assert.deepEqual(instructions[0].shape, { family: "box-sides", tokenCount: 2 });
				return [...instructions].map((instruction) => ({
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

test("pipeline forwards shape parsing output into mapper", () => {
	const pipeline = createCssHintPipeline({
		collector: {
			collect() {
				return [
					{
						state: "matched",
						propertyName: "grid-area",
						label: "grid-area-1-values",
						kind: "Parameter",
						strategy: "inline-right",
						tokenCount: 1,
						valueText: "span 3",
						range: {
							start: { line: 0, character: 0 },
							end: { line: 0, character: 9 },
						},
						valueRange: {
							start: { line: 0, character: 0 },
							end: { line: 0, character: 9 },
						},
					},
				];
			},
		},
		filter: {
			filter(instructions) {
				return [...instructions];
			},
		},
		shapeParser: {
			parse(instructions) {
				return [...instructions].map((instruction) => ({
					...instruction,
					shape: {
						family: "grid-area",
						lineKinds: ["span"],
					},
				}));
			},
		},
		mapper: {
			map(instructions) {
				assert.equal(instructions[0].shape?.family, "grid-area");
				assert.deepEqual(instructions[0].shape?.lineKinds, ["span"]);
				return [...instructions];
			},
		},
	});

	const instructions = pipeline.collect(".probe { grid-area: span 3; }");

	assert.equal(instructions.length, 1);
	assert.equal(instructions[0].propertyName, "grid-area");
});
