import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
	DEFAULT_PROPERTY_SAMPLING_RULES,
	createCssValidationOracle,
	createStandardPropertySamplingRule,
	constructExactCaseFamilies,
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

	test("background-position generator keeps the full position atom set", () => {
		const rule = createStandardPropertySamplingRule("background-position");
		const cases = sampleExactCases(constructExactCaseFamilies(rule));
		const oracle = createCssValidationOracle();

		assert.ok(cases.length > 7);
		assert.ok(cases.some((generatedCase) => generatedCase.code.includes("top")));
		assert.ok(cases.some((generatedCase) => generatedCase.code.includes("left")));
		assert.ok(cases.some((generatedCase) => generatedCase.code.includes("right")));

		for (const generatedCase of cases) {
			assert.equal(oracle.validate(generatedCase.code).length, 0, generatedCase.code);
		}
	});

	test("list-style generator expands unordered shorthand members", () => {
		const rule = createStandardPropertySamplingRule("list-style");
		const cases = sampleExactCases(constructExactCaseFamilies(rule));
		const oracle = createCssValidationOracle();

		assert.ok(cases.length > 4);
		assert.ok(cases.some((generatedCase) => generatedCase.code.includes("inside")));
		assert.ok(cases.some((generatedCase) => generatedCase.code.includes("none")));

		for (const generatedCase of cases) {
			assert.equal(oracle.validate(generatedCase.code).length, 0, generatedCase.code);
		}
	});

	test("offset-rotate generator emits direction and angle samples", () => {
		const rule = createStandardPropertySamplingRule("offset-rotate");
		const cases = sampleExactCases(constructExactCaseFamilies(rule));
		const oracle = createCssValidationOracle();

		assert.ok(rule.arities.includes(2));
		assert.ok(cases.some((generatedCase) => generatedCase.code.includes("90deg")));
		assert.ok(cases.some((generatedCase) => generatedCase.code.includes("auto 90deg")));

		for (const generatedCase of cases) {
			assert.equal(oracle.validate(generatedCase.code).length, 0, generatedCase.code);
		}
	});

	test("aspect-ratio generator emits ratio samples instead of the syntax name", () => {
		const rule = createStandardPropertySamplingRule("aspect-ratio");
		const cases = sampleExactCases(constructExactCaseFamilies(rule));
		const oracle = createCssValidationOracle();

		assert.deepEqual(rule.arities, [1, 2]);
		assert.ok(cases.some((generatedCase) => generatedCase.code.includes("1/1") || generatedCase.code.includes("16/9")));
		assert.ok(!cases.some((generatedCase) => /:\s*ratio;/.test(generatedCase.code)));

		for (const generatedCase of cases) {
			assert.equal(oracle.validate(generatedCase.code).length, 0, generatedCase.code);
		}
	});

	test("text-emphasis generator expands referenced color members", () => {
		const rule = createStandardPropertySamplingRule("text-emphasis");
		const cases = sampleExactCases(constructExactCaseFamilies(rule));
		const oracle = createCssValidationOracle();

		assert.deepEqual(rule.arities, [1, 2]);
		assert.ok(cases.some((generatedCase) => generatedCase.valueAtoms.some((atom) => atom.kind === "color")));
		assert.ok(cases.some((generatedCase) => generatedCase.valueAtoms.length === 2));

		for (const generatedCase of cases) {
			assert.equal(oracle.validate(generatedCase.code).length, 0, generatedCase.code);
		}
	});

	test("columns generator expands unordered members beyond single values", () => {
		const rule = createStandardPropertySamplingRule("columns");
		const cases = sampleExactCases(constructExactCaseFamilies(rule));
		const oracle = createCssValidationOracle();

		assert.deepEqual(rule.arities, [1, 2]);
		assert.ok(cases.some((generatedCase) => generatedCase.valueAtoms.length === 2));
		assert.ok(cases.some((generatedCase) => generatedCase.code.includes("0ch") || generatedCase.code.includes("0cap")));

		for (const generatedCase of cases) {
			assert.equal(oracle.validate(generatedCase.code).length, 0, generatedCase.code);
		}
	});
});
