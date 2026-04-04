import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { createCssHintClassifier } from "../../src/classifier.js";
import { createCssExtractor } from "../../src/extractor.js";
import { createServiceScheduler } from "../../src/scheduler.js";
import { createStandardPropertySamplingRule, generateExactCases } from "../lib/exactCssCaseGenerator.js";
import { assertGeneratedSchedulerE2E } from "../lib/generatedSchedulerE2E.js";
import { getPropertyStatus, getPropertySyntax, listPropertyNames } from "../../src/propertySyntax.js";
import type { CssExtractorCandidate } from "../../src/extractor.js";

type PasslistStatistics = {
	matchedCount: number;
	totalCount: number;
	matchedProperties: Record<string, true>;
	noHintCount: number;
	noHintProperties: Record<string, true>;
};

const FULL_RANGE = {
	start: { line: 0, character: 0 },
	end: { line: 999, character: 999 },
};

async function createPasslistStatistics(): Promise<PasslistStatistics> {
	const candidatePropertyNames = listPropertyNames().filter((propertyName) => {
		if (propertyName.startsWith("-")) {
			return false;
		}

		if (getPropertyStatus(propertyName) !== "standard") {
			return false;
		}

		return Boolean(getPropertySyntax(propertyName).trim());
	});

	const matchedPropertyNames: string[] = [];
	const noHintPropertyNames: string[] = [];
	for (const propertyName of candidatePropertyNames) {
		const classifier = createCssHintClassifier();
		const extractor = createCssExtractor();
		const rule = createStandardPropertySamplingRule(propertyName);
		const cases = generateExactCases(rule);
		const matchedCases = cases.filter((generatedCase) => isMatchedHintCase(classifier, extractor, generatedCase.code));

		if (matchedCases.length === 0) {
			noHintPropertyNames.push(propertyName);
			continue;
		}

		try {
			await assertGeneratedSchedulerE2E({
				scheduler: createServiceScheduler(),
				extractor,
				cases: matchedCases,
				filePrefix: `file:///workspace/passlist/${propertyName}`,
				range: FULL_RANGE,
			});
			matchedPropertyNames.push(propertyName);
		} catch {
			noHintPropertyNames.push(propertyName);
		}
	}

	const matchedProperties = Object.fromEntries(
		matchedPropertyNames.map((propertyName) => [propertyName, true] as const),
	);
	const noHintProperties = Object.fromEntries(noHintPropertyNames.map((propertyName) => [propertyName, true] as const));

	return {
		matchedCount: matchedPropertyNames.length,
		totalCount: candidatePropertyNames.length,
		matchedProperties,
		noHintCount: noHintPropertyNames.length,
		noHintProperties,
	};
}

function isMatchedHintCase(
	classifier: ReturnType<typeof createCssHintClassifier>,
	extractor: ReturnType<typeof createCssExtractor>,
	sourceText: string,
): boolean {
	const candidate = extractor.collectCandidates(sourceText)[0] as CssExtractorCandidate | undefined;
	if (!candidate) {
		return false;
	}

	return classifier.classify(candidate).state === "matched";
}

function main(): void {
	const outputPath = resolve(process.cwd(), "test/passlist/property-pass-statistics.json");

	createPasslistStatistics()
		.then((statistics) => {
			mkdirSync(dirname(outputPath), { recursive: true });
			writeFileSync(outputPath, `${JSON.stringify(statistics, null, 2)}\n`);
		})
		.catch((error) => {
			console.error(error);
			process.exitCode = 1;
		});
}

main();
