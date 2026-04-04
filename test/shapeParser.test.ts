import assert from "node:assert/strict";
import test from "node:test";

import type { CssHintInstruction } from "../src/collector.js";

type CssHintShapeParser = {
	parse(instructions: readonly CssHintInstruction[]): CssHintInstruction[];
};

function createCssShapeParser(): CssHintShapeParser {
	const module = require("../src/shapeParser.js") as {
		createCssShapeParser: () => CssHintShapeParser;
	};

	return module.createCssShapeParser();
}

function createInstruction(propertyName: string, valueText: string): CssHintInstruction {
	return {
		state: "matched",
		propertyName,
		label: `${propertyName}-label`,
		kind: "Parameter",
		strategy: "inline-right",
		tokenCount: valueText.split(/\s+/).filter(Boolean).length,
		valueText,
		range: {
			start: { line: 0, character: 0 },
			end: { line: 0, character: valueText.length },
		},
		valueRange: {
			start: { line: 0, character: 0 },
			end: { line: 0, character: valueText.length },
		},
	};
}

test("shape parser classifies grid-line shapes", () => {
	const parser = createCssShapeParser();
	const parsed = parser.parse([
		createInstruction("grid-area", "auto"),
		createInstruction("grid-column", "span 3"),
		createInstruction("grid-column-start", "4 some-grid-line"),
		createInstruction("grid-row", "span some-grid-line / 2"),
	])[0];

	assert.equal(parsed?.shape?.family, "grid-line");
	assert.deepEqual(parsed?.shape?.lineKinds, ["auto"]);
});

test("shape parser keeps box-family arities", () => {
	const parser = createCssShapeParser();
	const parsed = parser.parse([
		createInstruction("margin", "1rem 2rem"),
		createInstruction("border-radius", "1rem 2rem 3rem 4rem"),
	]);

	assert.deepEqual(parsed[0]?.shape, { family: "box-sides", tokenCount: 2 });
	assert.deepEqual(parsed[1]?.shape, { family: "box-corners", tokenCount: 4 });
});
