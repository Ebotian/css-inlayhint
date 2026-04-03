import fs from "node:fs";
import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

type SemanticCollectorCandidate = {
	kind: "declaration";
	propertyName: string;
	valueText: string;
	range: {
		start: { line: number; character: number };
		end: { line: number; character: number };
	};
};

type SemanticCollector = {
	collectCandidates(sourceText: string): SemanticCollectorCandidate[];
};

const fixturesRoot = path.resolve(__dirname, "..", "..", "fixtures");

function createSemanticCollector(): SemanticCollector {
	const { createSemanticCollector: factory } = require("../src/semanticCollector.js") as {
		createSemanticCollector: () => SemanticCollector;
	};

	return factory();
}

function loadFixture(relativePath: string): string {
	return fs.readFileSync(path.join(fixturesRoot, relativePath), "utf8");
}

function hasCandidate(candidates: SemanticCollectorCandidate[], propertyName: string, valueText: string): boolean {
	return candidates.some((candidate) => candidate.propertyName === propertyName && candidate.valueText === valueText);
}

test("semantic collector gathers declaration candidates from the flex sample", () => {
	const collector = createSemanticCollector();
	const sourceText = loadFixture("flex.style.css");

	const candidates = collector.collectCandidates(sourceText);

	assert.ok(hasCandidate(candidates, "margin", "2px"));
	assert.ok(hasCandidate(candidates, "padding", "2px"));
	assert.ok(hasCandidate(candidates, "display", "flex"));
	assert.ok(hasCandidate(candidates, "transition-duration", "500ms"));
	assert.deepEqual(
		candidates.find((candidate) => candidate.propertyName === "margin" && candidate.valueText === "2px")?.range.start,
		{ line: 3, character: 1 },
	);
});

test("semantic collector keeps declarations inside at-rules from the button hover sample", () => {
	const collector = createSemanticCollector();
	const sourceText = loadFixture("button-hover.style2.css");

	const candidates = collector.collectCandidates(sourceText);

	assert.ok(hasCandidate(candidates, "display", "flex"));
	assert.ok(hasCandidate(candidates, "padding", "15px 30px"));
	assert.ok(hasCandidate(candidates, "background", "#e51a4b"));
	assert.ok(candidates.every((candidate) => !candidate.propertyName.startsWith("@")));
});

test("semantic collector preserves shorthand value token order from the flex sample", () => {
	const collector = createSemanticCollector();
	const sourceText = loadFixture("flex.style.css");

	const candidates = collector.collectCandidates(sourceText);

	assert.ok(hasCandidate(candidates, "margin", "2px"));
	assert.ok(hasCandidate(candidates, "padding", "2px"));
	assert.ok(hasCandidate(candidates, "transform", "scale(1.3)"));
});

test("semantic collector keeps variable references as raw candidates from the notes sample", () => {
	const collector = createSemanticCollector();
	const sourceText = loadFixture("Notes.css");

	const candidates = collector.collectCandidates(sourceText);

	assert.ok(hasCandidate(candidates, "gap", "var(--gap)"));
	assert.ok(hasCandidate(candidates, "flex", "1 1 var(--min)"));
	assert.ok(candidates.every((candidate) => !candidate.valueText.includes("undefined")));
});
