import assert from "node:assert/strict";
import { describe, test } from "node:test";

import type { InlayHint, Range } from "vscode-languageserver";
import { createStandardPropertySamplingRule, generateExactCases } from "./lib/exactCssCaseGenerator.js";
import { assertGeneratedSchedulerE2E } from "./lib/generatedSchedulerE2E.js";

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

type ServiceScheduler = {
	addDocument(file: string, contents: string, version: number): void;
	updateDocument(file: string, contents: string, version: number): void;
	removeDocument(file: string): void;
	inlayHints(file: string, range: Range, context?: { signal?: AbortSignal }): Promise<InlayHint[]>;
};

function createServiceScheduler(): ServiceScheduler {
	const module = require("../src/scheduler.js") as {
		createServiceScheduler: () => ServiceScheduler;
	};
	return module.createServiceScheduler();
}

function createExtractor() {
	const module = require("../src/extractor.js") as {
		createCssExtractor: () => { collectCandidates(sourceText: string): CssExtractorCandidate[] };
	};

	return module.createCssExtractor();
}

const fullRange = {
	start: { line: 0, character: 0 },
	end: { line: 999, character: 999 },
};

const marginRule = createStandardPropertySamplingRule("margin");
const marginCases = generateExactCases(marginRule);
const gridAreaRule = createStandardPropertySamplingRule("grid-area");
const gridAreaCases = generateExactCases(gridAreaRule);
const gridColumnRule = createStandardPropertySamplingRule("grid-column");
const gridColumnCases = generateExactCases(gridColumnRule);
const schedulerMarginCases = marginCases.filter(
	(candidateCase) =>
		candidateCase.valueAtoms.length === 1 &&
		!candidateCase.valueAtoms.some((atom) => atom.kind === "global" || atom.kind === "variable"),
);
const firstMarginCase = schedulerMarginCases[0];
const secondMarginCase = schedulerMarginCases[1];

if (!firstMarginCase || !secondMarginCase || gridAreaCases.length === 0 || gridColumnCases.length === 0) {
	throw new Error("Expected generated margin cases for scheduler tests");
}

describe("scheduler layer", () => {
	test("uses the in-memory draft instead of the disk file", async () => {
		const scheduler = createServiceScheduler();
		const extractor = createExtractor();
		const file = "file:///workspace/example.css";

		scheduler.addDocument(file, firstMarginCase.code, 1);
		scheduler.updateDocument(file, secondMarginCase.code, 2);

		const hints = await scheduler.inlayHints(file, fullRange);
		const expectedRangeStart = extractor.collectCandidates(secondMarginCase.code)[0]?.valueRange.start;

		assert.equal(hints.length, 1);
		assert.equal(hints[0].label, "all:");
		assert.deepEqual(hints[0].position, expectedRangeStart);
	});

	test("resolves grid-area end to end", async () => {
		const scheduler = createServiceScheduler();
		const extractor = createExtractor();

		await assertGeneratedSchedulerE2E({
			scheduler,
			extractor,
			cases: gridAreaCases,
			filePrefix: "file:///workspace/grid-area",
			range: fullRange,
		});
	});

	test("resolves grid-column end to end", async () => {
		const scheduler = createServiceScheduler();
		const extractor = createExtractor();

		await assertGeneratedSchedulerE2E({
			scheduler,
			extractor,
			cases: gridColumnCases,
			filePrefix: "file:///workspace/grid-column",
			range: fullRange,
		});
	});

	test("resolves border-color rgb tokens without splitting the color value", async () => {
		const scheduler = createServiceScheduler();
		const file = "file:///workspace/border-color.css";
		const css = "a { border-color: red rgb(240 30 50 / 70%) green; }";

		scheduler.addDocument(file, css, 1);

		const hints = await scheduler.inlayHints(file, fullRange);

		assert.deepEqual(
			hints.map((hint) => ({ label: hint.label, position: hint.position.character })),
			[
				{ label: "top:", position: 18 },
				{ label: "right/left:", position: 22 },
				{ label: "bottom:", position: 43 },
			],
		);
	});

	test("resolves grid-template none without producing hints", async () => {
		const scheduler = createServiceScheduler();
		const file = "file:///workspace/grid-template.css";
		const css = "a { grid-template: none; }";

		scheduler.addDocument(file, css, 1);

		const hints = await scheduler.inlayHints(file, fullRange);

		assert.deepEqual(hints, []);
	});

	test("resolves border-bottom-left-radius two-value corner values end to end", async () => {
		const scheduler = createServiceScheduler();
		const file = "file:///workspace/border-bottom-left-radius.css";
		const css = "a { border-bottom-left-radius: 20% 10%; }";

		scheduler.addDocument(file, css, 1);

		const hints = await scheduler.inlayHints(file, fullRange);

		assert.deepEqual(
			hints.map((hint) => ({ label: hint.label, position: hint.position.character })),
			[
				{ label: "horizontal:", position: 31 },
				{ label: "vertical:", position: 35 },
			],
		);
	});

	test("resolves padding-block repeat values end to end", async () => {
		const scheduler = createServiceScheduler();
		const file = "file:///workspace/padding-block.css";
		const css = "a { padding-block: 10px 20px; }";

		scheduler.addDocument(file, css, 1);

		const hints = await scheduler.inlayHints(file, fullRange);

		assert.deepEqual(
			hints.map((hint) => ({ label: hint.label, position: hint.position.character })),
			[
				{ label: "start:", position: 19 },
				{ label: "end:", position: 24 },
			],
		);
	});

	test("resolves inset edge values end to end", async () => {
		const scheduler = createServiceScheduler();
		const file = "file:///workspace/inset.css";
		const css = "a { inset: 5px 15px 10px; }";

		scheduler.addDocument(file, css, 1);

		const hints = await scheduler.inlayHints(file, fullRange);

		assert.deepEqual(
			hints.map((hint) => ({ label: hint.label, position: hint.position.character })),
			[
				{ label: "top:", position: 11 },
				{ label: "right/left:", position: 15 },
				{ label: "bottom:", position: 20 },
			],
		);
	});

	test("resolves scroll-margin edge values end to end", async () => {
		const scheduler = createServiceScheduler();
		const file = "file:///workspace/scroll-margin.css";
		const css = "a { scroll-margin: 5px 15px 10px; }";

		scheduler.addDocument(file, css, 1);

		const hints = await scheduler.inlayHints(file, fullRange);

		assert.deepEqual(
			hints.map((hint) => ({ label: hint.label, position: hint.position.character })),
			[
				{ label: "top:", position: 19 },
				{ label: "right/left:", position: 23 },
				{ label: "bottom:", position: 28 },
			],
		);
	});

	test("cancels stale request when a newer edit arrives", async () => {
		const scheduler = createServiceScheduler();
		const file = "file:///workspace/cancel.css";
		const firstSignal = new AbortController();

		scheduler.addDocument(file, firstMarginCase.code, 1);
		const firstRequest = scheduler.inlayHints(file, fullRange, { signal: firstSignal.signal });
		scheduler.updateDocument(file, secondMarginCase.code, 2);
		firstSignal.abort();
		const secondRequest = scheduler.inlayHints(file, fullRange);

		await assert.rejects(firstRequest, /abort|cancel|stale/i);
		const secondHints = await secondRequest;

		assert.equal(secondHints.length, 1);
		assert.equal(secondHints[0].label, "all:");
	});

	test("does not answer after the document is closed", async () => {
		const scheduler = createServiceScheduler();
		const file = "file:///workspace/closed.css";

		scheduler.addDocument(file, firstMarginCase.code, 1);
		scheduler.removeDocument(file);

		await assert.rejects(scheduler.inlayHints(file, fullRange), /closed|missing|removed/i);
	});
});
