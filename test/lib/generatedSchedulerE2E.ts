import assert from "node:assert/strict";

import { TextDocument } from "vscode-css-languageservice";
import type { InlayHint, Range } from "vscode-languageserver";
import type { GeneratedCssCase } from "./exactCssCaseGenerator.js";

type CssExtractorCandidate = {
	propertyName: string;
	valueText: string;
	valueRange: {
		start: { line: number; character: number };
		end: { line: number; character: number };
	};
};

type SchedulerLike = {
	addDocument(file: string, contents: string, version: number): void;
	inlayHints(file: string, range: Range, context?: { signal?: AbortSignal }): Promise<InlayHint[]>;
};

type ExtractorLike = {
	collectCandidates(sourceText: string): CssExtractorCandidate[];
};

type GeneratedSchedulerE2EOptions = {
	scheduler: SchedulerLike;
	extractor: ExtractorLike;
	cases: readonly GeneratedCssCase[];
	filePrefix: string;
	range: Range;
	labelForToken(token: string): string | null;
};

type GeneratedSchedulerExpectedHint = {
	label: string;
	position: { line: number; character: number };
};

export async function assertGeneratedSchedulerE2E(options: GeneratedSchedulerE2EOptions): Promise<void> {
	for (const [index, generatedCase] of options.cases.entries()) {
		const file = `${options.filePrefix}-${index}.css`;
		options.scheduler.addDocument(file, generatedCase.code, index + 1);

		const hints = await options.scheduler.inlayHints(file, options.range);
		const candidate = options.extractor
			.collectCandidates(generatedCase.code)
			.find((item) => item.propertyName === generatedCase.propertyName);

		assert.ok(candidate, generatedCase.description);

		const expectedHints = buildGeneratedSchedulerExpectedHints({
			valueRangeStart: candidate.valueRange.start,
			valueAtoms: generatedCase.valueAtoms,
			propertyName: generatedCase.propertyName,
			sourceText: generatedCase.code,
			file,
			labelForToken: options.labelForToken,
		});

		assert.equal(hints.length, expectedHints.length, generatedCase.description);
		assert.deepEqual(
			hints.map((hint) => hint.label),
			expectedHints.map((hint) => hint.label),
			generatedCase.description,
		);
		assert.deepEqual(
			hints.map((hint) => hint.position),
			expectedHints.map((hint) => hint.position),
			generatedCase.description,
		);
	}
}

export function buildGeneratedSchedulerExpectedHints(options: {
	valueRangeStart: { line: number; character: number };
	valueAtoms: readonly { text: string }[];
	propertyName: string;
	sourceText: string;
	file: string;
	labelForToken(token: string): string | null;
}): GeneratedSchedulerExpectedHint[] {
	const { valueRangeStart, valueAtoms, propertyName, sourceText, file, labelForToken } = options;
	const document = TextDocument.create(file, "css", 1, sourceText);
	const positions: GeneratedSchedulerExpectedHint[] = [];
	const valueStartOffset = document.offsetAt(valueRangeStart);
	const valueText = renderGeneratedValueText(propertyName, valueAtoms);

	for (const match of valueText.matchAll(/[^\s/]+/g)) {
		const token = match[0] ?? "";
		const label = labelForToken(token);
		if (!label) {
			continue;
		}

		positions.push({
			label: `${label}:`,
			position: document.positionAt(valueStartOffset + (match.index ?? 0)),
		});
	}

	return positions;
}

function renderGeneratedValueText(propertyName: string, valueAtoms: readonly { text: string }[]): string {
	const separator = propertyName === "grid-area" && valueAtoms.length > 1 ? " / " : " ";
	return valueAtoms.map((atom) => atom.text).join(separator);
}
