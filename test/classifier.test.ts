import assert from "node:assert/strict";
import test from "node:test";

import {
	createStandardPropertySamplingRule,
	generateExactCases,
	renderCssDeclaration,
} from "./lib/exactCssCaseGenerator.js";

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
};

type CssHintClassifier = {
	classify(candidate: CssExtractorCandidate): CssHintClassification | null;
};

function createExtractor(): CssExtractor {
	const module = require("../src/extractor.js") as {
		createCssExtractor: () => CssExtractor;
	};

	return module.createCssExtractor();
}

function createCssHintClassifier(): CssHintClassifier {
	const module = require("../src/classifier.js") as {
		createCssHintClassifier: () => CssHintClassifier;
	};

	return module.createCssHintClassifier();
}

test("classifier labels shorthand declarations that match the syntax rule", () => {
	const collector = createExtractor();
	const classifier = createCssHintClassifier();
	const rule = createStandardPropertySamplingRule("margin");

	assert.ok(rule);

	const generatedCase = generateExactCases(rule).find(
		(candidateCase) => !candidateCase.valueAtoms.some((atom) => atom.kind === "global" || atom.kind === "variable"),
	);

	assert.ok(generatedCase);

	const candidate = collector.collectCandidates(generatedCase.code)[0];
	const classification = classifier.classify(candidate);

	assert.ok(classification);
	assert.equal(classification?.propertyName, rule.propertyName);
	assert.equal(classification?.kind, "Parameter");
	assert.equal(classification?.strategy, "inline-right");
	assert.equal(classification?.label, `${rule.propertyName}-${generatedCase.valueAtoms.length}-values`);
});

test("classifier suppresses shorthand syntax with alternation", () => {
	const collector = createExtractor();
	const classifier = createCssHintClassifier();
	const rule = createStandardPropertySamplingRule("border");
	const generatedCase = generateExactCases(rule)[0];
	const candidate = collector.collectCandidates(generatedCase.code)[0];

	assert.equal(classifier.classify(candidate), null);
});

test("classifier suppresses global CSS keywords", () => {
	const collector = createExtractor();
	const classifier = createCssHintClassifier();
	const candidate = collector.collectCandidates(
		renderCssDeclaration("margin", [{ kind: "global", text: "inherit" }]),
	)[0];

	assert.equal(classifier.classify(candidate), null);
});

test("classifier suppresses variable references", () => {
	const collector = createExtractor();
	const classifier = createCssHintClassifier();
	const candidate = collector.collectCandidates(
		renderCssDeclaration("padding", [{ kind: "variable", text: "var(--gap)" }]),
	)[0];

	assert.equal(classifier.classify(candidate), null);
});
