import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { getFormalSyntax } from "../../src/helper/getFormalSyntax.js";
import { getMdnValues } from "../../src/helper/getMdnValues.js";
import { getPropertySyntax } from "../../src/propertySyntax.js";
import { classifyPropertyStructure, type PropertyStructure } from "../../src/helper/noHintDesign.js";
import { createStandardPropertySamplingRule, generateExactCases } from "../lib/exactCssCaseGenerator.js";

type PasslistStatistics = {
	noHintTodoProperties: Record<string, true>;
};

type PropertyComplexity = "simple" | "repeat" | "alternation" | "compound";

type ValidationAgreement = "aligned" | "verified" | "unverified";

type TodoPlanValidation = {
	representativeProperty: string;
	localSyntax: string;
	mdnSyntax: string;
	mdnVerified: boolean;
	mdnValues?: {
		url: string;
		uncertain: boolean;
		entries: Array<{
			id: string;
			label: string;
			description: string;
		}>;
	};
	sourceAgreement: ValidationAgreement;
	sampleCaseCount: number;
};

type TodoPlanBatch = {
	phase: number;
	key: PropertyStructure;
	complexity: PropertyComplexity;
	count: number;
	properties: string[];
	rationale: string;
	validation: TodoPlanValidation;
};

type TodoPlan = {
	source: string;
	todoCount: number;
	batchCount: number;
	batches: TodoPlanBatch[];
};

type BatchDescriptor = {
	key: PropertyStructure;
	complexity: PropertyComplexity;
	properties: string[];
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
const VALIDATION_AGREEMENT_ORDER: ValidationAgreement[] = ["aligned", "verified", "unverified"];

if (require.main === module) {
	void main();
}

async function main(): Promise<void> {
	const statistics = readPasslistStatistics(passlistPath);
	const plan = await createTodoPlan(statistics);

	mkdirSync(dirname(outputPath), { recursive: true });
	writeFileSync(outputPath, `${JSON.stringify(plan, null, 2)}\n`, "utf8");
	console.log(`Wrote ${outputPath}`);
}

export async function createTodoPlan(
	statistics: PasslistStatistics,
	classifyBucket: (propertyName: string) => {
		key: PropertyStructure;
		complexity: PropertyComplexity;
	} = classifyTodoPlanBucket,
	validateBatch: (batch: BatchDescriptor) => Promise<TodoPlanValidation> = validateTodoPlanBatch,
): Promise<TodoPlan> {
	const groups = new Map<string, BatchDescriptor>();

	for (const propertyName of Object.keys(statistics.noHintTodoProperties)) {
		const bucket = classifyBucket(propertyName);
		const groupKey = `${bucket.key}::${bucket.complexity}`;
		const existing = groups.get(groupKey);
		if (existing) {
			existing.properties.push(propertyName);
			continue;
		}

		groups.set(groupKey, {
			key: bucket.key,
			complexity: bucket.complexity,
			properties: [propertyName],
		});
	}

	const batches = await Promise.all(
		[...groups.values()].map(async (batch) => {
			const properties = [...batch.properties].sort((left, right) => left.localeCompare(right));
			const validation = await validateBatch({
				key: batch.key,
				complexity: batch.complexity,
				properties,
			});

			return {
				phase: 0,
				key: batch.key,
				complexity: batch.complexity,
				count: properties.length,
				properties,
				rationale: describeBatch(batch.key, batch.complexity),
				validation,
			};
		}),
	);

	batches.sort((left, right) => {
		const agreementDifference =
			VALIDATION_AGREEMENT_ORDER.indexOf(left.validation.sourceAgreement) -
			VALIDATION_AGREEMENT_ORDER.indexOf(right.validation.sourceAgreement);
		if (agreementDifference !== 0) {
			return agreementDifference;
		}

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

		const caseCountDifference = left.validation.sampleCaseCount - right.validation.sampleCaseCount;
		if (caseCountDifference !== 0) {
			return caseCountDifference;
		}

		return left.count - right.count || left.key.localeCompare(right.key);
	});

	return {
		source: "test/passlist/property-pass-statistics.json",
		todoCount: Object.keys(statistics.noHintTodoProperties).length,
		batchCount: batches.length,
		batches: batches.map((batch, index) => ({ ...batch, phase: index + 1 })),
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

async function validateTodoPlanBatch(batch: BatchDescriptor): Promise<TodoPlanValidation> {
	const representativeProperty = batch.properties[0];
	const localSyntax = normalizeSyntaxSignature(getPropertySyntax(representativeProperty));
	const sampleCaseCount = generateExactCases(createStandardPropertySamplingRule(representativeProperty)).length;

	try {
		const mdnPage = await getFormalSyntax(representativeProperty);
		const mdnValuesPage = await getMdnValues(representativeProperty);
		const mdnSyntax = normalizeSyntaxSignature(extractMdnTopLevelSyntax(mdnPage.formalSyntax));
		const sourceAgreement =
			mdnPage.verified && mdnSyntax.length > 0 && mdnSyntax === localSyntax
				? "aligned"
				: mdnPage.verified
					? "verified"
					: "unverified";

		return {
			representativeProperty,
			localSyntax,
			mdnSyntax,
			mdnVerified: mdnPage.verified,
			mdnValues: {
				url: mdnValuesPage.url,
				uncertain: mdnValuesPage.uncertain,
				entries: mdnValuesPage.values,
			},
			sourceAgreement,
			sampleCaseCount,
		};
	} catch {
		return {
			representativeProperty,
			localSyntax,
			mdnSyntax: "",
			mdnVerified: false,
			mdnValues: undefined,
			sourceAgreement: "unverified",
			sampleCaseCount,
		};
	}
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

function normalizeSyntaxSignature(text: string): string {
	return text
		.replace(/\r\n?/g, " ")
		.replace(/\s+/g, " ")
		.trim()
		.replace(/^\s*[^=]+=\s*/, "");
}

function extractMdnTopLevelSyntax(formalSyntax: string): string {
	const normalized = formalSyntax.replace(/\r\n?/g, "\n");
	const lines = normalized.split("\n");
	const collected: string[] = [];
	let started = false;

	for (const line of lines) {
		if (started && line.trim().length === 0) {
			break;
		}

		if (!started && line.trim().length === 0) {
			continue;
		}

		started = true;
		collected.push(line);
	}

	return collected.join("\n");
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
