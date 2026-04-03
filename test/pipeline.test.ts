import assert from "node:assert/strict";
import test from "node:test";

import type { CssHintInstruction } from "../src/collector.js";

type CssHintCollector = {
	collect(sourceText: string): CssHintInstruction[];
};

type CssHintFilter = {
	filter(instructions: readonly CssHintInstruction[]): CssHintInstruction[];
};

function createCssHintPipeline(options: { collector: CssHintCollector; filter: CssHintFilter }) {
	const module = require("../src/pipeline.js") as any;

	return module.createCssHintPipeline(options);
}

test("pipeline composes collector output with filter cleanup", () => {
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
						tokenCount: 4,
						range: {
							start: { line: 2, character: 4 },
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
				return instructions.slice().reverse();
			},
		},
	});

	const instructions = pipeline.collect(".probe { padding: 1rem 2rem; }");

	assert.equal(capturedSourceText, ".probe { padding: 1rem 2rem; }");
	assert.equal(instructions.length, 1);
	assert.equal(instructions[0].propertyName, "padding");
});
