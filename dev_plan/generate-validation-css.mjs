#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const nodeRequire = createRequire(import.meta.url);
const { createStandardPropertySamplingRule, generateExactCases } = nodeRequire(
	"../dist-test/test/lib/exactCssCaseGenerator.js",
);

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDir, "..");
const sourcePath = path.resolve(workspaceRoot, "dev_plan/done.md");
const outputPath = path.resolve(workspaceRoot, "dev_plan/css-validation.generated.css");

const sourceText = fs.readFileSync(sourcePath, "utf8");
const stages = parseStages(sourceText);
const rendered = renderValidationCss(stages);

fs.writeFileSync(outputPath, rendered, "utf8");
console.log(`Wrote ${outputPath}`);

function parseStages(markdown) {
	const stages = [];
	let currentStage = null;

	for (const rawLine of markdown.split(/\r?\n/)) {
		const line = rawLine.trim();
		if (!line) {
			continue;
		}

		const stageMatch = /^##\s+(v\d+)/i.exec(line);
		if (stageMatch) {
			currentStage = {
				name: stageMatch[1].toLowerCase(),
				properties: [],
			};
			stages.push(currentStage);
			continue;
		}

		if (!currentStage) {
			continue;
		}

		if (/^[a-z0-9_-]+$/i.test(line)) {
			currentStage.properties.push(line);
		}
	}

	return stages;
}

function renderValidationCss(stages) {
	const chunks = ["/* Generated validation CSS for left-hint verification */"];

	for (const stage of stages) {
		chunks.push("", `/* ${stage.name} */`);
		for (const propertyName of stage.properties) {
			const rule = createStandardPropertySamplingRule(propertyName);
			const cases = generateExactCases(rule);

			chunks.push(`/* ${propertyName} (${cases.length} cases) */`);
			for (const generatedCase of cases) {
				chunks.push(`/* ${generatedCase.description} */`);
				chunks.push(generatedCase.code);
			}
			chunks.push("");
		}
	}

	return `${chunks.join("\n").trimEnd()}\n`;
}
