import assert from "node:assert/strict";
import test from "node:test";

import { createStandardPropertySamplingRule, generateExactCases } from "./lib/exactCssCaseGenerator.js";

test("text-box sampling expands nested syntax references", () => {
	const rule = createStandardPropertySamplingRule("text-box");

	assert.deepEqual(rule.arities, [1, 2]);
	assert.ok(rule.valueAtoms.some((atom) => atom.text === "normal"));

	const generatedCases = generateExactCases(rule).map((generatedCase) => generatedCase.code);
	assert.ok(generatedCases.some((code) => code.includes("text-box: normal;")));
	assert.ok(generatedCases.some((code) => code.includes("text-box: trim-start;")));
	assert.ok(generatedCases.some((code) => code.includes("text-box: auto;")));
});
