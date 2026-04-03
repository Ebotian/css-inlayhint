import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

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

const fixturesRoot = path.resolve(__dirname, "..", "..");

function createExtractor(): CssExtractor {
	const { createCssExtractor: factory } = require("../src/extractor.js") as {
		createCssExtractor: () => CssExtractor;
	};

	return factory();
}

function loadFixture(relativePath: string): string {
	return fs.readFileSync(path.join(fixturesRoot, "fixtures", relativePath), "utf8");
}

function hasCandidate(candidates: CssExtractorCandidate[], propertyName: string, valueText: string): boolean {
	return candidates.some((candidate) => candidate.propertyName === propertyName && candidate.valueText === valueText);
}

test("extractor gathers declaration candidates from the flex sample", () => {
	const extractor = createExtractor();
	const sourceText = loadFixture("flex.style.css");

	const candidates = extractor.collectCandidates(sourceText);

	assert.ok(hasCandidate(candidates, "margin", "2px"));
	assert.ok(hasCandidate(candidates, "padding", "2px"));
	assert.ok(hasCandidate(candidates, "display", "flex"));
	assert.ok(hasCandidate(candidates, "transition-duration", "500ms"));
	assert.deepEqual(
		candidates.find((candidate) => candidate.propertyName === "margin" && candidate.valueText === "2px")?.range.start,
		{ line: 3, character: 1 },
	);
});

test("extractor keeps declarations inside at-rules from the button hover sample", () => {
	const extractor = createExtractor();
	const sourceText = loadFixture("button-hover.style2.css");

	const candidates = extractor.collectCandidates(sourceText);

	assert.ok(hasCandidate(candidates, "display", "flex"));
	assert.ok(hasCandidate(candidates, "padding", "15px 30px"));
	assert.ok(hasCandidate(candidates, "background", "#e51a4b"));
	assert.ok(candidates.every((candidate) => !candidate.propertyName.startsWith("@")));
});

test("extractor preserves shorthand value token order from the flex sample", () => {
	const extractor = createExtractor();
	const sourceText = loadFixture("flex.style.css");

	const candidates = extractor.collectCandidates(sourceText);

	assert.ok(hasCandidate(candidates, "margin", "2px"));
	assert.ok(hasCandidate(candidates, "padding", "2px"));
	assert.ok(hasCandidate(candidates, "transform", "scale(1.3)"));
});

test("extractor keeps variable references as raw candidates from the notes sample", () => {
	const extractor = createExtractor();
	const sourceText = loadFixture("Notes.css");

	const candidates = extractor.collectCandidates(sourceText);

	assert.ok(hasCandidate(candidates, "gap", "var(--gap)"));
	assert.ok(hasCandidate(candidates, "flex", "1 1 var(--min)"));
	assert.ok(candidates.every((candidate) => !candidate.valueText.includes("undefined")));
});