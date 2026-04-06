import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { extractMdnSectionHtml } from "../../src/helper/mdnSections.js";
import { buildMdnPropertyUrl } from "../../src/helper/getFormalSyntax.js";
import { createStandardPropertySamplingRule, generateExactCases } from "../lib/exactCssCaseGenerator.js";
import type { GeneratedCssCase } from "../lib/cssCaseModel.js";

type PasslistStatistics = {
	matchedProperties: Record<string, true>;
	noHintDesignedProperties: Record<string, true>;
};

type GeneratedMdnSymbolExample = {
	comments: string[];
	declaration: string;
};

type GeneratedMdnSymbolEntry = {
	propertyName: string;
	syntaxUrl: string;
	examples: GeneratedMdnSymbolExample[];
};

const workspaceRoot = resolve(process.cwd());
const passlistPath = resolve(workspaceRoot, "test/passlist/property-pass-statistics.json");
const outputPath = resolve(workspaceRoot, "test/passlist/mdnsymbol.css");
const MAX_CONCURRENCY = 6;

if (require.main === module) {
	void main();
}

async function main(): Promise<void> {
	const statistics = readPasslistStatistics(passlistPath);
	const rendered = await renderMdnSymbolCss(statistics);

	mkdirSync(dirname(outputPath), { recursive: true });
	writeFileSync(outputPath, rendered, "utf8");
	console.log(`Wrote ${outputPath}`);
}

function readPasslistStatistics(filePath: string): PasslistStatistics {
	const sourceText = readFileSync(filePath, "utf8");
	return JSON.parse(sourceText) as PasslistStatistics;
}

export async function renderMdnSymbolCss(statistics: PasslistStatistics, existingCssText = ""): Promise<string> {
	const propertyNames = collectPendingSymbolPropertyNames(statistics, existingCssText);
	const entries = await mapWithConcurrency(propertyNames, MAX_CONCURRENCY, async (propertyName) =>
		buildMdnSymbolEntry(propertyName),
	);

	const renderedEntries = renderMdnSymbolCssEntries(entries);
	if (existingCssText.trim().length === 0) {
		return renderedEntries;
	}

	return `${existingCssText.trimEnd()}\n\n${renderedEntries}`;
}

export function collectSymbolPropertyNames(statistics: PasslistStatistics): string[] {
	const matchedPropertyNames = Object.keys(statistics.matchedProperties).sort((left, right) =>
		left.localeCompare(right),
	);
	const noHintDesignedPropertyNames = Object.keys(statistics.noHintDesignedProperties).sort((left, right) =>
		left.localeCompare(right),
	);
	const seen = new Set<string>();
	const orderedPropertyNames: string[] = [];

	for (const propertyName of matchedPropertyNames) {
		if (seen.has(propertyName)) {
			continue;
		}

		seen.add(propertyName);
		orderedPropertyNames.push(propertyName);
	}

	for (const propertyName of noHintDesignedPropertyNames) {
		if (seen.has(propertyName)) {
			continue;
		}

		seen.add(propertyName);
		orderedPropertyNames.push(propertyName);
	}

	return orderedPropertyNames;
}

export function collectPendingSymbolPropertyNames(statistics: PasslistStatistics, existingCssText = ""): string[] {
	const existingPropertyNames = collectExistingSymbolPropertyNames(existingCssText);
	return collectSymbolPropertyNames(statistics).filter((propertyName) => !existingPropertyNames.has(propertyName));
}

async function buildMdnSymbolEntry(propertyName: string): Promise<GeneratedMdnSymbolEntry> {
	const syntaxUrl = buildMdnSyntaxUrl(propertyName);
	const examples = await fetchMdnSyntaxExamples(syntaxUrl);
	if (examples.length > 0) {
		return {
			propertyName,
			syntaxUrl,
			examples,
		};
	}

	const cases = generateExactCases(createStandardPropertySamplingRule(propertyName));
	if (cases.length === 0) {
		throw new Error(`Generated no CSS cases for property: ${propertyName}`);
	}

	const fallbackDeclaration = extractDeclarationLine(chooseRepresentativeCase(cases).code);
	if (!fallbackDeclaration) {
		throw new Error(`Failed to derive fallback declaration for property: ${propertyName}`);
	}

	return {
		propertyName,
		syntaxUrl,
		examples: [{ comments: ["fallback exact case"], declaration: fallbackDeclaration }],
	};
}

function chooseRepresentativeCase(cases: readonly GeneratedCssCase[]): GeneratedCssCase {
	return cases.find((generatedCase) => generatedCase.valueAtoms.some((atom) => atom.kind !== "global")) ?? cases[0];
}

function renderMdnSymbolCssEntries(entries: readonly GeneratedMdnSymbolEntry[]): string {
	const chunks = ["/* Generated from MDN syntax pages for parser pipeline coverage */"];

	for (const entry of entries) {
		chunks.push(
			"",
			`/* ${entry.propertyName} */`,
			`/* source: ${entry.syntaxUrl} */`,
			`/* examples: ${entry.examples.length} */`,
		);

		let previousCommentKey = "";
		for (const [exampleIndex, example] of entry.examples.entries()) {
			const commentKey = example.comments.join("\u0001");
			if (example.comments.length > 0 && commentKey !== previousCommentKey) {
				chunks.push(...example.comments.map((comment) => `/* ${comment} */`));
			}

			previousCommentKey = commentKey;
			chunks.push(
				renderDeclarationRule(
					example.declaration,
					`${sanitizeSelectorTag(entry.propertyName)}-${String(exampleIndex + 1).padStart(3, "0")}`,
				),
			);
		}
	}

	return `${chunks.join("\n").trimEnd()}\n`;
}

function normalizeInlineText(text: string): string {
	return text.replace(/\r\n?/g, " ").replace(/\s+/g, " ").trim();
}

function readExistingCssText(filePath: string): string {
	try {
		return readFileSync(filePath, "utf8");
	} catch {
		return "";
	}
}

function collectExistingSymbolPropertyNames(cssText: string): Set<string> {
	const propertyNames = new Set<string>();
	for (const match of cssText.matchAll(/^\s*([a-z-][a-z0-9-]*)\s*:/gim)) {
		propertyNames.add(match[1] ?? "");
	}

	return propertyNames;
}

function buildMdnSyntaxUrl(propertyName: string): string {
	return buildMdnPropertyUrl(propertyName).replace(/#formal_syntax$/, "#syntax");
}

async function fetchMdnSyntaxExamples(url: string): Promise<GeneratedMdnSymbolExample[]> {
	let response: Response;
	try {
		response = await fetch(url);
	} catch {
		return [];
	}

	if (!response.ok) {
		return [];
	}

	const html = await response.text();
	return extractSyntaxExamples(html);
}

export function extractSyntaxExamples(html: string): GeneratedMdnSymbolExample[] {
	const sectionHtml = extractMdnSectionHtml(html, "syntax");
	if (sectionHtml.length === 0) {
		return [];
	}

	const examples: GeneratedMdnSymbolExample[] = [];
	const seen = new Set<string>();
	const codeBlocks = [...sectionHtml.matchAll(/<code\b[^>]*>([\s\S]*?)<\/code>/gi)].map((match) =>
		decodeHtmlEntities(stripHtmlTags(match[1] ?? "")),
	);

	for (const block of codeBlocks) {
		for (const example of extractSyntaxExamplesFromBlock(block)) {
			const key = `${example.comments.join("\u0001")}::${example.declaration}`;
			if (seen.has(key)) {
				continue;
			}

			seen.add(key);
			examples.push(example);
		}
	}

	return examples;
}

export function extractSyntaxExamplesFromBlock(text: string): GeneratedMdnSymbolExample[] {
	const examples: GeneratedMdnSymbolExample[] = [];
	let currentComments: string[] = [];
	let commentBuffer: string[] | null = null;
	let declarationBuffer = "";

	for (const line of text.split(/\r?\n/)) {
		const trimmed = line.trim();
		if (trimmed.length === 0) {
			continue;
		}

		if (commentBuffer !== null) {
			commentBuffer.push(trimmed);
			if (trimmed.includes("*/")) {
				const comment = extractCommentBlock(commentBuffer);
				if (comment) {
					currentComments = [...currentComments, comment];
				}

				commentBuffer = null;
			}
			continue;
		}

		if (trimmed.startsWith("/*")) {
			commentBuffer = [trimmed];
			if (trimmed.includes("*/")) {
				const comment = extractCommentBlock(commentBuffer);
				if (comment) {
					currentComments = [...currentComments, comment];
				}

				commentBuffer = null;
			}

			continue;
		}

		const normalizedLine = line.replace(/\s+$/u, "");
		declarationBuffer =
			declarationBuffer.length === 0
				? normalizedLine.trimStart()
				: `${declarationBuffer}\n  ${normalizedLine.trimStart()}`;
		while (declarationBuffer.includes(";")) {
			const semicolonIndex = declarationBuffer.indexOf(";");
			const declaration = declarationBuffer.slice(0, semicolonIndex + 1).trimEnd();
			if (isDeclarationLine(normalizeInlineText(declaration))) {
				examples.push({ comments: [...currentComments], declaration });
			}

			declarationBuffer = declarationBuffer.slice(semicolonIndex + 1).trim();
			currentComments = [];
		}
	}

	return examples;
}

function extractCommentBlock(lines: readonly string[]): string {
	const text = lines.join("\n");
	const match = text.match(/^\/\*\s*([\s\S]*?)\s*\*\/$/);
	if (!match) {
		return "";
	}

	return normalizeInlineText(decodeHtmlEntities(match[1] ?? ""));
}

function isDeclarationLine(text: string): boolean {
	return /^[a-z-][a-z0-9-]*\s*:\s*.+?;\s*(?:\/\*[\s\S]*\*\/\s*)?$/i.test(text);
}

function stripHtmlTags(html: string): string {
	let text = "";
	let index = 0;

	while (index < html.length) {
		const character = html[index];
		if (character !== "<") {
			text += character;
			index += 1;
			continue;
		}

		let cursor = index + 1;
		let quote: string | null = null;
		let tagName = "";
		let sawTagName = false;
		while (cursor < html.length) {
			const current = html[cursor];
			if (quote) {
				if (current === quote) {
					quote = null;
				}
				cursor += 1;
				continue;
			}

			if (current === '"' || current === "'") {
				quote = current;
				cursor += 1;
				continue;
			}

			if (!sawTagName && /[a-zA-Z]/.test(current)) {
				tagName += current.toLowerCase();
				sawTagName = true;
				cursor += 1;
				continue;
			}

			if (sawTagName && /[a-zA-Z0-9-]/.test(current)) {
				tagName += current.toLowerCase();
				cursor += 1;
				continue;
			}

			if (current === ">") {
				if (tagName === "br") {
					text += "\n";
				}

				index = cursor + 1;
				break;
			}

			cursor += 1;
		}

		if (cursor >= html.length) {
			break;
		}
	}

	return text;
}

function decodeHtmlEntities(text: string): string {
	const namedEntities: Record<string, string> = {
		amp: "&",
		lt: "<",
		gt: ">",
		quot: '"',
		apos: "'",
		nbsp: " ",
	};

	return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (_match, entity: string) => {
		if (entity.startsWith("#x") || entity.startsWith("#X")) {
			return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
		}

		if (entity.startsWith("#")) {
			return String.fromCodePoint(Number.parseInt(entity.slice(1), 10));
		}

		return namedEntities[entity] ?? `&${entity};`;
	});
}

function extractDeclarationLine(code: string): string {
	const match = code.match(/^\s*([a-z-][a-z0-9-]*\s*:\s*.+;\s*(?:\/\*[\s\S]*\*\/\s*)?)\s*$/im);
	return normalizeInlineText(match?.[1] ?? "");
}

function renderDeclarationRule(declarationLine: string, indexTag: string): string {
	return [`.mdn-symbol-${sanitizeSelectorTag(indexTag)} {`, `  ${declarationLine}`, `}`].join("\n");
}

function sanitizeSelectorTag(value: string): string {
	return value
		.replace(/[^a-z0-9_-]+/gi, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}

async function mapWithConcurrency<Input, Output>(
	items: readonly Input[],
	concurrency: number,
	mapper: (item: Input, index: number) => Promise<Output>,
): Promise<Output[]> {
	if (concurrency <= 0) {
		throw new Error("Concurrency must be greater than zero");
	}

	if (items.length === 0) {
		return [];
	}

	const results = new Array<Output>(items.length);
	let nextIndex = 0;

	async function worker(): Promise<void> {
		while (true) {
			const currentIndex = nextIndex;
			nextIndex += 1;
			if (currentIndex >= items.length) {
				return;
			}

			results[currentIndex] = await mapper(items[currentIndex], currentIndex);
		}
	}

	const workerCount = Math.min(concurrency, items.length);
	await Promise.all(Array.from({ length: workerCount }, () => worker()));
	return results;
}
