import assert from "node:assert/strict";
import { describe, test } from "node:test";

import type { InlayHint, Range } from "vscode-languageserver";
import { createStandardPropertySamplingRule, generateExactCases } from "./lib/exactCssCaseGenerator.js";

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

const fullRange = {
	start: { line: 0, character: 0 },
	end: { line: 999, character: 999 },
};

const marginRule = createStandardPropertySamplingRule("margin");
const marginCases = generateExactCases(marginRule);
const schedulerMarginCases = marginCases.filter(
	(candidateCase) =>
		candidateCase.valueAtoms.length === 1 &&
		!candidateCase.valueAtoms.some((atom) => atom.kind === "global" || atom.kind === "variable"),
);
const firstMarginCase = schedulerMarginCases[0];
const secondMarginCase = schedulerMarginCases[1];

if (!firstMarginCase || !secondMarginCase) {
	throw new Error("Expected generated margin cases for scheduler tests");
}

describe("scheduler layer", () => {
	test("uses the in-memory draft instead of the disk file", async () => {
		const scheduler = createServiceScheduler();
		const file = "file:///workspace/example.css";

		scheduler.addDocument(file, firstMarginCase.code, 1);
		scheduler.updateDocument(file, secondMarginCase.code, 2);

		const hints = await scheduler.inlayHints(file, fullRange);

		assert.equal(hints.length, 1);
		assert.equal(hints[0].label, "margin-1-values");
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
		assert.equal(secondHints[0].label, "margin-1-values");
	});

	test("does not answer after the document is closed", async () => {
		const scheduler = createServiceScheduler();
		const file = "file:///workspace/closed.css";

		scheduler.addDocument(file, firstMarginCase.code, 1);
		scheduler.removeDocument(file);

		await assert.rejects(scheduler.inlayHints(file, fullRange), /closed|missing|removed/i);
	});
});
