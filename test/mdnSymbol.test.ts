import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

import { createCssExtractor } from "../src/extractor.js";
import { createServiceScheduler } from "../src/scheduler.js";
import { extractSyntaxExamples } from "./passlist/generateMdnSymbolCss.js";
import { extractSyntaxExamplesFromBlock } from "./passlist/generateMdnSymbolCss.js";
import { collectSymbolPropertyNames as collectMdnSymbolPropertyNames } from "./passlist/generateMdnSymbolCss.js";
import { collectPendingSymbolPropertyNames } from "./passlist/generateMdnSymbolCss.js";

type PasslistStatistics = {
	matchedProperties: Record<string, true>;
	noHintDesignedProperties: Record<string, true>;
};

const workspaceRoot = resolve(process.cwd());
const passlistPath = resolve(workspaceRoot, "test/passlist/property-pass-statistics.json");
const mdnSymbolCssPath = resolve(workspaceRoot, "test/passlist/mdnsymbol.css");

test("mdn symbol css covers all matched and designed properties", () => {
	const statistics = readPasslistStatistics(passlistPath);
	const cssText = readFileSync(mdnSymbolCssPath, "utf8");
	const extractor = createCssExtractor();
	const candidates = extractor.collectCandidates(cssText);
	const candidateCounts = countValuesByProperty(candidates.map((candidate) => candidate.propertyName));
	const generatedRuleCount = countGeneratedDeclarationRules(cssText);
	const expectedPropertyNames = collectSymbolPropertyNames(statistics);
	const candidatePropertyNames = uniqueSorted(candidates.map((candidate) => candidate.propertyName));

	assert.equal(candidates.length, generatedRuleCount, "all generated CSS rules should be parsed as declarations");
	assert.ok((candidateCounts.get("container") ?? 0) >= 6, "container should include all syntax examples from MDN");
	assert.ok(
		(candidateCounts.get("text-emphasis-color") ?? 0) >= 2,
		"text-emphasis-color should include multiple syntax examples from MDN",
	);

	for (const propertyName of expectedPropertyNames) {
		assert.ok(candidatePropertyNames.includes(propertyName), `missing parsed declaration for ${propertyName}`);
	}
});

test("mdn symbol property generation prefers matched properties first", () => {
	const order = collectMdnSymbolPropertyNames({
		matchedProperties: {
			b: true,
			a: true,
		},
		noHintDesignedProperties: {
			d: true,
			c: true,
		},
	});

	assert.deepEqual(order, ["a", "b", "c", "d"]);
});

test("mdn symbol css flows through the scheduler without label-validation errors", async () => {
	const cssText = readFileSync(mdnSymbolCssPath, "utf8");
	const scheduler = createServiceScheduler();
	const file = "file:///workspace/mdnsymbol.css";
	const fullRange = {
		start: { line: 0, character: 0 },
		end: { line: 9999, character: 9999 },
	};

	scheduler.addDocument(file, cssText, 1);

	const instructions = await scheduler.inlayHints(file, fullRange);
	assert.ok(instructions.length > 0, "expected the generated CSS to produce hint instructions");
});

test("mdn symbol crawler keeps the three animation syntax examples", () => {
	const examples = extractSyntaxExamplesFromBlock(
		[
			"/* @keyframes duration | easing-function | delay |",
			"iteration-count | direction | fill-mode | play-state | name */",
			"animation: 3s ease-in 1s 2 reverse both paused slide-in;",
			"",
			"/* @keyframes duration | easing-function | delay | name */",
			"animation: 3s linear 1s slide-in;",
			"",
			"/* two animations */",
			"animation:",
			"  3s linear slidein,",
			"  3s ease-out 5s slideout;",
		].join("\n"),
	);

	assert.deepEqual(examples, [
		{
			comments: [
				"@keyframes duration | easing-function | delay | iteration-count | direction | fill-mode | play-state | name",
			],
			declaration: "animation: 3s ease-in 1s 2 reverse both paused slide-in;",
		},
		{
			comments: ["@keyframes duration | easing-function | delay | name"],
			declaration: "animation: 3s linear 1s slide-in;",
		},
		{
			comments: ["two animations"],
			declaration: ["animation:", "  3s linear slidein,", "  3s ease-out 5s slideout;"].join("\n"),
		},
	]);
});

test("mdn symbol crawler preserves br-wrapped syntax examples", () => {
	const html = [
		"<section>",
		'  <h2 id="syntax">Syntax</h2>',
		"  <pre><code>",
		"    /* two animations */<br>",
		"    animation:<br>",
		"      3s linear slidein,<br>",
		"      3s ease-out 5s slideout;<br>",
		"  </code></pre>",
		"</section>",
	].join("\n");

	const examples = extractSyntaxExamples(html);

	assert.deepEqual(examples, [
		{
			comments: ["two animations"],
			declaration: ["animation:", "  3s linear slidein,", "  3s ease-out 5s slideout;"].join("\n"),
		},
	]);
});

test("mdn symbol animation-range positions repeated range labels at group starts", async () => {
	const scheduler = createServiceScheduler();
	const file = "file:///workspace/animation-range.css";
	const cssText = "a { animation-range: cover 0% cover 200px; }";
	const fullRange = {
		start: { line: 0, character: 0 },
		end: { line: 0, character: 9999 },
	};

	scheduler.addDocument(file, cssText, 1);

	const hints = await scheduler.inlayHints(file, fullRange);

	assert.deepEqual(
		hints.map((hint) => ({ label: hint.label, character: hint.position.character })),
		[
			{ label: "start:", character: 21 },
			{ label: "end:", character: 30 },
		],
	);
});

test("mdn symbol crawler skips properties already present in existing css", () => {
	const statistics = {
		matchedProperties: {
			container: true as const,
			"animation-range": true as const,
		},
		noHintDesignedProperties: {
			"text-emphasis-color": true as const,
		},
	};

	const existingCssText = [
		"/* Generated from MDN syntax pages for parser pipeline coverage */",
		"",
		"/* container */",
		"/* source: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/container#syntax */",
		"/* examples: 1 */",
		".mdn-symbol-container-001 {",
		"  container: my-layout;",
		"}",
	].join("\n");

	assert.deepEqual(collectPendingSymbolPropertyNames(statistics, existingCssText), [
		"animation-range",
		"text-emphasis-color",
	]);
});

function readPasslistStatistics(filePath: string): PasslistStatistics {
	return JSON.parse(readFileSync(filePath, "utf8")) as PasslistStatistics;
}

function collectSymbolPropertyNames(statistics: PasslistStatistics): string[] {
	return [
		...new Set([...Object.keys(statistics.matchedProperties), ...Object.keys(statistics.noHintDesignedProperties)]),
	].sort((left, right) => left.localeCompare(right));
}

function uniqueSorted(values: readonly string[]): string[] {
	return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function countValuesByProperty(values: readonly string[]): Map<string, number> {
	const counts = new Map<string, number>();

	for (const value of values) {
		counts.set(value, (counts.get(value) ?? 0) + 1);
	}

	return counts;
}

function countGeneratedDeclarationRules(cssText: string): number {
	return [...cssText.matchAll(/^\.mdn-symbol-[^{]+\{/gm)].length;
}
