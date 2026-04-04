import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { getPropertySyntax } from "../../src/propertySyntax.js";
import { classifyPropertyStructure, type PropertyStructure } from "../../src/helper/noHintDesign.js";

type PasslistStatistics = {
	noHintTodoProperties: Record<string, true>;
};

type PropertyComplexity = "simple" | "repeat" | "alternation" | "compound";

type TodoPlanBatch = {
	phase: number;
	key: PropertyStructure;
	complexity: PropertyComplexity;
	count: number;
	properties: string[];
	rationale: string;
};

type TodoPlan = {
	source: string;
	todoCount: number;
	batchCount: number;
	batches: TodoPlanBatch[];
};

const workspaceRoot = resolve(process.cwd());
const passlistPath = resolve(workspaceRoot, "test/passlist/property-pass-statistics.json");
const outputPath = resolve(workspaceRoot, "test/passlist/plan.json");

const PROPERTY_STRUCTURE_ORDER: PropertyStructure[] = [
	"shorthand-family",
	"reference-only",
	"generic-single",
	"keyword-union",
	"mixed",
	"literal",
	"other",
];

const PROPERTY_COMPLEXITY_ORDER: PropertyComplexity[] = ["simple", "repeat", "alternation", "compound"];

if (require.main === module) {
	const statistics = readPasslistStatistics(passlistPath);
	const plan = createTodoPlan(statistics);

	mkdirSync(dirname(outputPath), { recursive: true });
	writeFileSync(outputPath, `${JSON.stringify(plan, null, 2)}\n`, "utf8");
	console.log(`Wrote ${outputPath}`);
}

export function createTodoPlan(
	statistics: PasslistStatistics,
	classifyBucket: (propertyName: string) => {
		key: PropertyStructure;
		complexity: PropertyComplexity;
	} = classifyTodoPlanBucket,
): TodoPlan {
	const groups = new Map<string, TodoPlanBatch>();

	for (const propertyName of Object.keys(statistics.noHintTodoProperties)) {
		const bucket = classifyBucket(propertyName);
		const groupKey = `${bucket.key}::${bucket.complexity}`;
		const existing = groups.get(groupKey);
		if (existing) {
			existing.properties.push(propertyName);
			continue;
		}

		groups.set(groupKey, {
			phase: 0,
			key: bucket.key,
			complexity: bucket.complexity,
			count: 0,
			properties: [propertyName],
			rationale: describeBatch(bucket.key, bucket.complexity),
		});
	}

	const batches = [...groups.values()]
		.sort((left, right) => {
			const structureDifference =
				PROPERTY_STRUCTURE_ORDER.indexOf(left.key) - PROPERTY_STRUCTURE_ORDER.indexOf(right.key);
			if (structureDifference !== 0) {
				return structureDifference;
			}

			const complexityDifference =
				PROPERTY_COMPLEXITY_ORDER.indexOf(left.complexity) - PROPERTY_COMPLEXITY_ORDER.indexOf(right.complexity);
			if (complexityDifference !== 0) {
				return complexityDifference;
			}

			return left.properties.length - right.properties.length || left.key.localeCompare(right.key);
		})
		.map((batch, index) => {
			const properties = [...batch.properties].sort((left, right) => left.localeCompare(right));
			return {
				phase: index + 1,
				key: batch.key,
				complexity: batch.complexity,
				count: properties.length,
				properties,
				rationale: batch.rationale,
			};
		});

	const mergedBatches: TodoPlanBatch[] = [];
	for (const batch of batches) {
		const previousBatch = mergedBatches[mergedBatches.length - 1];
		if (batch.count === 1 && previousBatch && previousBatch.key === batch.key) {
			previousBatch.properties.push(...batch.properties);
			previousBatch.count = previousBatch.properties.length;
			continue;
		}

		mergedBatches.push(batch);
	}

	for (const batch of mergedBatches) {
		batch.properties.sort((left, right) => left.localeCompare(right));
	}

	return {
		source: "test/passlist/property-pass-statistics.json",
		todoCount: Object.keys(statistics.noHintTodoProperties).length,
		batchCount: mergedBatches.length,
		batches: mergedBatches.map((batch, index) => ({ ...batch, phase: index + 1 })),
	};
}

export function classifyTodoPlanBucket(propertyName: string): {
	key: PropertyStructure;
	complexity: PropertyComplexity;
} {
	return {
		key: classifyPropertyStructure(propertyName),
		complexity: classifyPropertyComplexity(getPropertySyntax(propertyName)),
	};
}

function classifyPropertyComplexity(syntax: string): PropertyComplexity {
	const trimmed = syntax.trim();
	const hasPipe = trimmed.includes("|");
	const hasRepeat = /\{\s*\d+\s*(?:,\s*\d*)?\s*\}/.test(trimmed) || /#\s*$/.test(trimmed);
	const angleTokens = [...trimmed.matchAll(/<([^>]+)>/g)].map((match) => match[1].trim());
	const propertyRefs = angleTokens.filter((token) => /^'[^']+'$/.test(token));
	const genericTokens = angleTokens.filter((token) => !/^'[^']+'$/.test(token));
	const literalTokens = extractLiteralTokens(trimmed, angleTokens);

	if (hasPipe && hasRepeat) {
		return "compound";
	}

	if (hasPipe) {
		return "alternation";
	}

	if (hasRepeat) {
		return "repeat";
	}

	if (genericTokens.length + propertyRefs.length + literalTokens.length > 1) {
		return "compound";
	}

	return "simple";
}

function describeBatch(key: PropertyStructure, complexity: PropertyComplexity): string {
	const structureDescription: Record<PropertyStructure, string> = {
		"shorthand-family": "shorthand-family",
		"reference-only": "reference-only",
		"generic-single": "generic-single",
		"keyword-union": "keyword-union",
		mixed: "mixed",
		literal: "literal",
		other: "other",
	};
	const complexityDescription: Record<PropertyComplexity, string> = {
		simple: "lowest cross-validation risk",
		repeat: "repeat-heavy but still structure-driven",
		alternation: "branch-selection work after the simple cases",
		compound: "nested or mixed syntax, best left for later",
	};

	return `${structureDescription[key]} / ${complexityDescription[complexity]}`;
}

function extractLiteralTokens(syntax: string, angleTokens: readonly string[]): string[] {
	const withoutAngles = syntax.replace(/<[^>]+>/g, " ");
	const parts = withoutAngles
		.split("|")
		.map((part) => part.trim())
		.filter(Boolean)
		.filter((part) => part !== "?" && part !== "+" && part !== "*");
	const literals: string[] = [];
	for (const part of parts) {
		const tokens = part
			.split(/\s+/)
			.map((token) => token.trim())
			.filter(Boolean)
			.filter((token) => !/^[{}()?,]+$/.test(token));
		for (const token of tokens) {
			if (!token.startsWith('"') && !token.startsWith("'") && !angleTokens.includes(token)) {
				literals.push(token);
			}
		}
	}
	return [...new Set(literals.filter((value) => value.length > 0))];
}

function readPasslistStatistics(filePath: string): PasslistStatistics {
	const sourceText = readFileSync(filePath, "utf8");
	return JSON.parse(sourceText) as PasslistStatistics;
}
