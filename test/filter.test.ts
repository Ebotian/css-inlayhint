import assert from "node:assert/strict";
import test from "node:test";

import type { CssHintInstruction } from "../src/collector.js";

type CssHintFilter = {
	filter(instructions: readonly CssHintInstruction[]): CssHintInstruction[];
};

function createCssHintFilter(): CssHintFilter {
	const module = require("../src/filter.js") as any;

	return module.createCssHintFilter();
}

test("filter deduplicates and sorts collector output", () => {
	const filter = createCssHintFilter();
	const instructions: CssHintInstruction[] = [
		{
			state: "matched",
			propertyName: "padding",
			label: "padding-4-values",
			kind: "Parameter",
			strategy: "inline-right",
			tokenCount: 4,
			valueText: "1rem 2rem 3rem 4rem",
			range: {
				start: { line: 2, character: 4 },
				end: { line: 2, character: 19 },
			},
			valueRange: {
				start: { line: 2, character: 11 },
				end: { line: 2, character: 19 },
			},
		},
		{
			state: "matched",
			propertyName: "margin",
			label: "margin-2-values",
			kind: "Parameter",
			strategy: "inline-right",
			tokenCount: 2,
			valueText: "1rem 2rem",
			range: {
				start: { line: 1, character: 4 },
				end: { line: 1, character: 16 },
			},
			valueRange: {
				start: { line: 1, character: 11 },
				end: { line: 1, character: 16 },
			},
		},
		{
			state: "matched",
			propertyName: "padding",
			label: "padding-4-values",
			kind: "Parameter",
			strategy: "inline-right",
			tokenCount: 4,
			valueText: "1rem 2rem 3rem 4rem",
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

	const cleaned = filter.filter(instructions);

	assert.equal(cleaned.length, 2);
	assert.equal(cleaned[0].propertyName, "margin");
	assert.equal(cleaned[1].propertyName, "padding");
	assert.equal(cleaned[0].label, "margin-2-values");
	assert.equal(cleaned[1].label, "padding-4-values");
});

test("filter preserves distinct instructions at the same position", () => {
	const filter = createCssHintFilter();
	const instructions: CssHintInstruction[] = [
		{
			state: "matched",
			propertyName: "border-width",
			label: "border-width-4-values",
			kind: "Parameter",
			strategy: "inline-right",
			tokenCount: 4,
			valueText: "1px 2px 3px 4px",
			range: {
				start: { line: 0, character: 8 },
				end: { line: 0, character: 21 },
			},
			valueRange: {
				start: { line: 0, character: 8 },
				end: { line: 0, character: 21 },
			},
		},
		{
			state: "matched",
			propertyName: "border-style",
			label: "border-style-4-values",
			kind: "Parameter",
			strategy: "inline-right",
			tokenCount: 4,
			valueText: "solid dotted dashed double",
			range: {
				start: { line: 0, character: 8 },
				end: { line: 0, character: 21 },
			},
			valueRange: {
				start: { line: 0, character: 8 },
				end: { line: 0, character: 21 },
			},
		},
	];

	const cleaned = filter.filter(instructions);

	assert.equal(cleaned.length, 2);
	assert.equal(cleaned[0].propertyName, "border-style");
	assert.equal(cleaned[1].propertyName, "border-width");
});
