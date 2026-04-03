import assert from "node:assert/strict";
import test from "node:test";

import type { CssHintInstruction } from "../src/collector.js";
import { createStandardPropertySamplingRule, generateExactCases } from "./lib/exactCssCaseGenerator.js";

type CssHintCollector = {
	collect(sourceText: string): CssHintInstruction[];
};

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

type CssHintClassification = {
	propertyName: string;
	label: string;
	kind: "Parameter" | "BlockEnd";
	strategy: "inline-right" | "block-end-right";
	tokenCount: number;
};

type CssHintClassifier = {
	classify(candidate: CssExtractorCandidate): CssHintClassification | null;
};

function createCssHintCollector(options: { extractor: CssExtractor; classifier: CssHintClassifier }): CssHintCollector {
	const module = require("../src/collector.js") as any;

	return module.createCssHintCollector(options);
}

test("collector turns semantic candidates into classified instructions", () => {
	const rule = createStandardPropertySamplingRule("margin");
	const generatedCase = generateExactCases(rule).find(
		(candidateCase) =>
			candidateCase.valueAtoms.length === 2 && !candidateCase.valueAtoms.some((atom) => atom.kind === "global"),
	);

	assert.ok(generatedCase);

	const collector = createCssHintCollector({
		extractor: {
			collectCandidates() {
				return [
					{
						kind: "declaration",
						propertyName: "margin",
						valueText: "1rem 2rem",
						range: {
							start: { line: 0, character: 9 },
							end: { line: 0, character: 18 },
						},
					},
				];
			},
		},
		classifier: {
			classify(candidate) {
				assert.equal(candidate.propertyName, "margin");
				return {
					propertyName: candidate.propertyName,
					label: "margin-2-values",
					kind: "Parameter",
					strategy: "inline-right",
					tokenCount: 2,
				};
			},
		},
	});

	const instructions = collector.collect(generatedCase.code);

	assert.equal(instructions.length, 1);
	assert.equal(instructions[0].propertyName, "margin");
	assert.equal(instructions[0].kind, "Parameter");
	assert.equal(instructions[0].strategy, "inline-right");
	assert.equal(instructions[0].label, "margin-2-values");
	assert.ok(instructions[0].range.start.line >= 0);
});

test("collector drops suppressed global declarations", () => {
	const rule = createStandardPropertySamplingRule("margin");
	const generatedCase = generateExactCases(rule).find((candidateCase) =>
		candidateCase.valueAtoms.some((atom) => atom.kind === "global"),
	);

	assert.ok(generatedCase);

	const collector = createCssHintCollector({
		extractor: {
			collectCandidates() {
				return [
					{
						kind: "declaration",
						propertyName: "margin",
						valueText: "inherit",
						range: {
							start: { line: 0, character: 9 },
							end: { line: 0, character: 16 },
						},
					},
				];
			},
		},
		classifier: {
			classify() {
				return null;
			},
		},
	});

	const instructions = collector.collect(generatedCase.code);

	assert.equal(instructions.length, 0);
});
