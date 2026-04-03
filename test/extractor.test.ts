import assert from "node:assert/strict";
import test from "node:test";

import { createStandardPropertySamplingRule, generateExactCases } from "./lib/exactCssCaseGenerator.js";

type CssExtractorCandidate = {
	kind: "declaration";
	propertyName: string;
	valueText: string;
	range: {
		start: { line: number; character: number };
		end: { line: number; character: number };
	};
};

type CssExtractor = {
	collectCandidates(sourceText: string): CssExtractorCandidate[];
};

function createExtractor(): CssExtractor {
	const { createCssExtractor: factory } = require("../src/extractor.js") as {
		createCssExtractor: () => CssExtractor;
	};

	return factory();
}

function hasCandidate(candidates: CssExtractorCandidate[], propertyName: string, valueText: string): boolean {
	return candidates.some((candidate) => candidate.propertyName === propertyName && candidate.valueText === valueText);
}

function pickGeneratedCase(
	propertyName: string,
	predicate: (generatedCase: ReturnType<typeof generateExactCases>[number]) => boolean,
): ReturnType<typeof generateExactCases>[number] {
	const rule = createStandardPropertySamplingRule(propertyName);
	const generatedCase = generateExactCases(rule).find(predicate);

	assert.ok(generatedCase, `Missing generated case for ${propertyName}`);
	return generatedCase;
}

test("extractor gathers declaration candidates from generated shorthand samples", () => {
	const extractor = createExtractor();
	const marginCase = pickGeneratedCase(
		"margin",
		(generatedCase) =>
			generatedCase.valueAtoms.length === 1 && generatedCase.valueAtoms.some((atom) => atom.text === "0cap"),
	);
	const paddingCase = pickGeneratedCase(
		"padding",
		(generatedCase) =>
			generatedCase.valueAtoms.length === 1 && generatedCase.valueAtoms.some((atom) => atom.text === "0ch"),
	);
	const sourceText = [marginCase.code, paddingCase.code].join("\n\n");

	const candidates = extractor.collectCandidates(sourceText);

	assert.ok(hasCandidate(candidates, "margin", "0cap"));
	assert.ok(hasCandidate(candidates, "padding", "0ch"));
});

test("extractor keeps declarations inside at-rules from generated samples", () => {
	const extractor = createExtractor();
	const displayCase = pickGeneratedCase("display", (generatedCase) =>
		generatedCase.valueAtoms.some((atom) => atom.text === "block"),
	);
	const transitionCase = pickGeneratedCase("transition-duration", (generatedCase) =>
		generatedCase.valueAtoms.some((atom) => atom.text === "0ms"),
	);
	const sourceText = `@media (min-width: 600px) {\n${displayCase.code}\n${transitionCase.code}\n}`;

	const candidates = extractor.collectCandidates(sourceText);

	assert.ok(hasCandidate(candidates, "display", "block"));
	assert.ok(hasCandidate(candidates, "transition-duration", "0ms"));
	assert.ok(candidates.every((candidate) => !candidate.propertyName.startsWith("@")));
});

test("extractor preserves shorthand value token order from generated samples", () => {
	const extractor = createExtractor();
	const marginCase = pickGeneratedCase(
		"margin",
		(generatedCase) =>
			generatedCase.valueAtoms.length === 2 && generatedCase.valueAtoms.every((atom) => atom.kind !== "global"),
	);
	const sourceText = marginCase.code;

	const candidates = extractor.collectCandidates(sourceText);

	assert.ok(hasCandidate(candidates, "margin", marginCase.valueAtoms.map((atom) => atom.text).join(" ")));
});

test("extractor keeps generated global values as raw candidates", () => {
	const extractor = createExtractor();
	const globalCase = pickGeneratedCase(
		"margin",
		(generatedCase) => generatedCase.valueAtoms.length === 1 && generatedCase.valueAtoms[0].kind === "global",
	);
	const sourceText = globalCase.code;

	const candidates = extractor.collectCandidates(sourceText);

	assert.ok(hasCandidate(candidates, "margin", globalCase.valueAtoms[0].text));
	assert.ok(candidates.every((candidate) => !candidate.valueText.includes("undefined")));
});
