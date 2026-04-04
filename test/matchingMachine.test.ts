import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
	DEFAULT_PROPERTY_SAMPLING_RULES,
	createCssValidationOracle,
	createStandardPropertySamplingRule,
	constructExactCaseFamilies,
	countExactCases,
	sampleExactCases,
} from "./lib/exactCssCaseGenerator.js";

describe("matching machine", () => {
	test("constructs an exact legal case space without manual pruning", () => {
		assert.ok(DEFAULT_PROPERTY_SAMPLING_RULES.length > 0);
		assert.ok(DEFAULT_PROPERTY_SAMPLING_RULES.some((rule) => rule.arities.length > 1));
		assert.ok(DEFAULT_PROPERTY_SAMPLING_RULES.every((rule) => rule.arities.length > 0));

		for (const rule of DEFAULT_PROPERTY_SAMPLING_RULES) {
			const families = constructExactCaseFamilies(rule);
			const cases = sampleExactCases(families);

			assert.equal(cases.length, countExactCases(families));
			assert.equal(new Set(cases.map((generatedCase) => generatedCase.code)).size, cases.length);
			assert.ok(cases.length > 0);
			assert.deepEqual(
				[...new Set(cases.map((generatedCase) => generatedCase.arity))].sort(),
				[...rule.arities].sort(),
			);
		}
	});

	test("parser oracle accepts all generated legal cases", () => {
		const oracle = createCssValidationOracle();
		const cases = DEFAULT_PROPERTY_SAMPLING_RULES.flatMap((rule) => sampleExactCases(constructExactCaseFamilies(rule)));

		for (const generatedCase of cases) {
			const diagnostics = oracle.validate(generatedCase.code);
			assert.equal(diagnostics.length, 0, generatedCase.code);
		}
	});

	test("grid-column generator emits slash-separated legal samples", () => {
		const rule = createStandardPropertySamplingRule("grid-column");
		assert.deepEqual(rule.arities, [1, 2]);

		const cases = sampleExactCases(constructExactCaseFamilies(rule));
		const oracle = createCssValidationOracle();

		assert.ok(cases.some((generatedCase) => generatedCase.code.includes(" / ")));
		assert.ok(cases.some((generatedCase) => generatedCase.code.includes("span")));

		for (const generatedCase of cases) {
			assert.equal(oracle.validate(generatedCase.code).length, 0, generatedCase.code);
		}
	});
});
