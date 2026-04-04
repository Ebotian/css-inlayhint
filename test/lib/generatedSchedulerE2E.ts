import assert from "node:assert/strict";

import { TextDocument } from "vscode-css-languageservice";
import type { InlayHint, Range } from "vscode-languageserver";
import type { GeneratedCssCase } from "./exactCssCaseGenerator.js";
import { usesSlashSeparatedGridLineSyntax } from "../../src/propertySyntax.js";
import { createCssShapeParser } from "../../src/shapeParser.js";
import { getDirectionalFamily } from "../../src/propertySyntax.js";
import { mapGridLineTokenLabel } from "./gridLineHintLabels.js";

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
}): GeneratedSchedulerExpectedHint[] {
	const { valueRangeStart, valueAtoms, propertyName, sourceText, file } = options;
	const document = TextDocument.create(file, "css", 1, sourceText);
	const positions: GeneratedSchedulerExpectedHint[] = [];
	const valueStartOffset = document.offsetAt(valueRangeStart);
	const valueText = renderGeneratedValueText(propertyName, valueAtoms);
	const labelParts = inferLabelParts(propertyName, valueText);

	for (const [index, match] of [...valueText.matchAll(/[^\s/]+/g)].entries()) {
		const label = labelParts[index] ?? "";
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
	const separator = usesSlashSeparatedGridLineSyntax(propertyName) && valueAtoms.length > 1 ? " / " : " ";
	return valueAtoms.map((atom) => atom.text).join(separator);
}

function inferLabelParts(propertyName: string, valueText: string): string[] {
	const tokenCount = [...valueText.matchAll(/[^\s/]+/g)].length;
	const parsedShape = createCssShapeParser().parse([
		{
			state: "matched",
			propertyName,
			label: `${propertyName}-${tokenCount}-values`,
			kind: "Parameter",
			strategy: "inline-right",
			tokenCount,
			valueText,
			range: {
				start: { line: 0, character: 0 },
				end: { line: 0, character: valueText.length },
			},
			valueRange: {
				start: { line: 0, character: 0 },
				end: { line: 0, character: valueText.length },
			},
		},
	])[0]?.shape;

	if (parsedShape?.family === "box-sides") {
		return inferBoxSideLabelParts(propertyName, tokenCount);
	}

	if (parsedShape?.family === "box-corners") {
		return inferCornerLabelParts(tokenCount);
	}

	if (parsedShape?.family === "grid-line") {
		return [...valueText.matchAll(/[^\s/]+/g)].map((match) => mapGridLineTokenLabel(match[0] ?? "") ?? "");
	}

	return Array.from({ length: tokenCount }, () => `${propertyName}-${tokenCount}-values`);
}

function inferBoxSideLabelParts(propertyName: string, tokenCount: number): string[] {
	const directions = getDirectionalFamily(propertyName);
	if (!directions) {
		return Array.from({ length: tokenCount }, () => `${propertyName}-${tokenCount}-values`);
	}

	switch (tokenCount) {
		case 1:
			return ["all"];
		case 2:
			return [`${directions[0]}/${directions[2]}`, `${directions[1]}/${directions[3]}`];
		case 3:
			return [directions[0], `${directions[1]}/${directions[3]}`, directions[2]];
		case 4:
			return [...directions];
		default:
			return Array.from({ length: tokenCount }, () => `${propertyName}-${tokenCount}-values`);
	}
}

function inferCornerLabelParts(tokenCount: number): string[] {
	switch (tokenCount) {
		case 1:
			return ["all"];
		case 2:
			return ["top-L/bottom-R", "top-R/bottom-L"];
		case 3:
			return ["top-L", "top-R/bottom-L", "bottom-R"];
		case 4:
			return ["top-L", "top-R", "bottom-R", "bottom-L"];
		default:
			return Array.from({ length: tokenCount }, () => "all");
	}
}
