import assert from "node:assert/strict";
import test from "node:test";

import { DEFAULT_PROPERTY_SAMPLING_RULES, renderCssDeclaration } from "./lib/exactCssCaseGenerator.js";

const SAFE_PROPERTIES = new Set([
	"border-color",
	"border-radius",
	"border-style",
	"border-width",
	"grid-area",
	"margin",
	"padding",
]);

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

test("classifier labels multi-token declarations from the generator samples", () => {
	const collector = createExtractor();
	const classifier = createCssHintClassifier();
	const rule = DEFAULT_PROPERTY_SAMPLING_RULES.find(
		(candidateRule) => candidateRule.arities.includes(2) && SAFE_PROPERTIES.has(candidateRule.propertyName),
	);

	assert.ok(rule);

	const sourceText = renderCssDeclaration(rule.propertyName, rule.valueAtoms.slice(0, 2));
	const candidate = collector.collectCandidates(sourceText)[0];
	const classification = classifier.classify(candidate);

	assert.ok(classification);
	assert.equal(classification?.propertyName, rule.propertyName);
	assert.equal(classification?.kind, "Parameter");
	assert.equal(classification?.strategy, "inline-right");
	assert.equal(classification?.label, `${rule.propertyName}-2-values`);
});

test("classifier suppresses non-safe properties", () => {
	const collector = createExtractor();
	const classifier = createCssHintClassifier();
	const candidate = collector.collectCandidates(".probe { color: red; }")[0];

	assert.equal(classifier.classify(candidate), null);
});

test("classifier suppresses global CSS keywords", () => {
	const collector = createExtractor();
	const classifier = createCssHintClassifier();
	const candidate = collector.collectCandidates(".probe { margin: inherit; }")[0];

	assert.equal(classifier.classify(candidate), null);
});

test("classifier suppresses variable references", () => {
	const collector = createExtractor();
	const classifier = createCssHintClassifier();
	const candidate = collector.collectCandidates(".probe { padding: var(--gap); }")[0];

	assert.equal(classifier.classify(candidate), null);
});
