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
	valueRange: {
		start: { line: number; character: number };
		end: { line: number; character: number };
	};
};

type CssExtractor = {
	collectCandidates(sourceText: string): CssExtractorCandidate[];
};

type CssHintClassification = {
	state: "matched" | "suppressed" | "ignored";
	propertyName: string;
	label: string;
	kind: "Parameter" | "BlockEnd";
	strategy: "inline-right" | "block-end-right";
	tokenCount?: number;
	suppressReason?: string;
	reason?: string;
};

type CssHintClassifier = {
	classify(candidate: CssExtractorCandidate): CssHintClassification;
};

type ClassifierModule = {
	createCssHintClassifier: () => CssHintClassifier;
	formatCssHintClassification: (classification: CssHintClassification) => string;
};

function createExtractor(): CssExtractor {
	const module = require("../src/extractor.js") as {
		createCssExtractor: () => CssExtractor;
	};

	return module.createCssExtractor();
}

function createCssHintClassifier(): CssHintClassifier {
	const module = require("../src/classifier.js") as ClassifierModule;

	return module.createCssHintClassifier();
}

function formatCssHintClassification(classification: CssHintClassification): string {
	const module = require("../src/classifier.js") as ClassifierModule;

	return module.formatCssHintClassification(classification);
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

test("classifier labels shorthands with alternation syntax", () => {
	const collector = createExtractor();
	const classifier = createCssHintClassifier();
	const rule = createStandardPropertySamplingRule("border");
	const generatedCase = generateExactCases(rule).find(
		(candidateCase) => !candidateCase.valueAtoms.some((atom) => atom.kind === "global" || atom.kind === "variable"),
	);

	assert.ok(generatedCase);
	const candidate = collector.collectCandidates(generatedCase.code)[0];

	const classification = classifier.classify(candidate);

	assert.ok(classification);
	assert.equal(classification.state, "matched");
	assert.equal(classification.propertyName, "border");
	assert.equal(classification.label, "border-1-values");
	assert.equal(formatCssHintClassification(classification), "matched border-1-values");
});

test("classifier matches phase-one reference-only properties", () => {
	const collector = createExtractor();
	const classifier = createCssHintClassifier();
	const rule = createStandardPropertySamplingRule("block-size");
	const generatedCase = generateExactCases(rule).find(
		(candidateCase) => !candidateCase.valueAtoms.some((atom) => atom.kind === "global" || atom.kind === "variable"),
	);

	assert.ok(generatedCase);
	const candidate = collector.collectCandidates(generatedCase.code)[0];
	const classification = classifier.classify(candidate);

	assert.ok(classification);
	assert.equal(classification.state, "matched");
	assert.equal(classification.propertyName, "block-size");
});

test("classifier suppresses global CSS keywords", () => {
	const collector = createExtractor();
	const classifier = createCssHintClassifier();
	const candidate = collector.collectCandidates(
		renderCssDeclaration("margin", [{ kind: "global", text: "inherit" }]),
	)[0];

	const classification = classifier.classify(candidate);

	assert.ok(classification);
	assert.equal(classification.state, "suppressed");
	assert.equal(classification.propertyName, "margin");
	assert.equal(classification.suppressReason, "global CSS keyword");
	assert.equal(formatCssHintClassification(classification), "suppressed margin-1-values (global CSS keyword)");
});

test("classifier suppresses variable references", () => {
	const collector = createExtractor();
	const classifier = createCssHintClassifier();
	const candidate = collector.collectCandidates(
		renderCssDeclaration("padding", [{ kind: "variable", text: "var(--gap)" }]),
	)[0];

	const classification = classifier.classify(candidate);

	assert.ok(classification);
	assert.equal(classification.state, "suppressed");
	assert.equal(classification?.propertyName, "padding");
	assert.equal(classification.suppressReason, "variable reference");
	assert.equal(formatCssHintClassification(classification), "suppressed padding-1-values (variable reference)");
});
