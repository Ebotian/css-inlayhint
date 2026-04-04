import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { createStandardPropertySamplingRule, generateExactCases } from "../lib/exactCssCaseGenerator.js";

type PasslistStatistics = {
	passedCount: number;
	totalCount: number;
	passedProperties: Record<string, true>;
};

type ValidationCase = {
	description: string;
	code: string;
};

const workspaceRoot = resolve(process.cwd());
const passlistPath = resolve(workspaceRoot, "test/passlist/property-pass-statistics.json");
const outputPath = resolve(workspaceRoot, "test/passlist/css-validation.generated.css");

if (require.main === module) {
	const statistics = readPasslistStatistics(passlistPath);
	const rendered = renderValidationCss(statistics);

	writeFileSync(outputPath, rendered, "utf8");
	console.log(`Wrote ${outputPath}`);
}

function readPasslistStatistics(filePath: string): PasslistStatistics {
	const sourceText = readFileSync(filePath, "utf8");
	return JSON.parse(sourceText) as PasslistStatistics;
}

export function renderValidationCss(
	statistics: PasslistStatistics,
	generateCases: (propertyName: string) => readonly ValidationCase[] = generateValidationCases,
): string {
	const chunks = ["/* Generated validation CSS for left-hint verification */"];
	const propertyNames = sortPropertyNamesByCaseCount(statistics, generateCases);

	for (const propertyName of propertyNames) {
		const cases = generateCases(propertyName);
		if (cases.length === 0) {
			throw new Error(`Generated no validation cases for property: ${propertyName}`);
		}

		chunks.push("", `/* ${propertyName} (${cases.length} cases) */`);
		for (const generatedCase of cases) {
			chunks.push(`/* ${generatedCase.description} */`);
			chunks.push(generatedCase.code);
		}
	}

	return `${chunks.join("\n").trimEnd()}\n`;
}

export function sortPropertyNamesByCaseCount(
	statistics: PasslistStatistics,
	generateCases: (propertyName: string) => readonly ValidationCase[] = generateValidationCases,
): string[] {
	return Object.keys(statistics.passedProperties).sort((left, right) => {
		const leftCount = generateCases(left).length;
		const rightCount = generateCases(right).length;

		if (leftCount !== rightCount) {
			return leftCount - rightCount;
		}

		return left.localeCompare(right);
	});
}

function generateValidationCases(propertyName: string): readonly ValidationCase[] {
	return generateExactCases(createStandardPropertySamplingRule(propertyName));
}
