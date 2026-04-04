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
	passedCount: number;
	totalCount: number;
	passedProperties: Record<string, true>;
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

	const passedPropertyNames: string[] = [];
	for (const propertyName of candidatePropertyNames) {
		const classifier = createCssHintClassifier();
		const extractor = createCssExtractor();
		const rule = createStandardPropertySamplingRule(propertyName);
		const cases = generateExactCases(rule);
		if (cases.length === 0) {
			continue;
		}

		const matchedCases = cases.filter((generatedCase) => isMatchedHintCase(classifier, extractor, generatedCase.code));
		if (matchedCases.length === 0) {
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
			passedPropertyNames.push(propertyName);
		} catch {
			continue;
		}
	}

	const passedProperties = Object.fromEntries(passedPropertyNames.map((propertyName) => [propertyName, true] as const));

	return {
		passedCount: passedPropertyNames.length,
		totalCount: candidatePropertyNames.length,
		passedProperties,
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
