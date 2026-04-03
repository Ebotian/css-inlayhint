#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import mdnData from "mdn-data";
import cssShorthandProperties from "css-shorthand-properties";

const DEFAULT_FORMAT = "markdown";
const properties = mdnData.css.properties;
const shorthandApi = cssShorthandProperties?.default ?? cssShorthandProperties;
const args = parseArgs(process.argv.slice(2));

process.stdout.on("error", (error) => {
	if (error && error.code === "EPIPE") {
		process.exit(0);
	}
	throw error;
});

if (args.help) {
	printHelp();
	process.exit(0);
}

const report = buildReport(properties, {
	includeNonStandard: args.includeNonStandard,
	all: args.all,
});

const output = args.format === "json" ? JSON.stringify(report, null, 2) : renderMarkdown(report, args.all);

if (args.out) {
	const outPath = path.resolve(process.cwd(), args.out);
	fs.mkdirSync(path.dirname(outPath), { recursive: true });
	fs.writeFileSync(outPath, output, "utf8");
	console.log(`Wrote ${outPath}`);
} else {
	process.stdout.write(output);
	if (!output.endsWith("\n")) {
		process.stdout.write("\n");
	}
}

function parseArgs(argv) {
	const options = {
		format: DEFAULT_FORMAT,
		all: false,
		includeNonStandard: false,
		out: "",
		help: false,
	};

	for (let index = 0; index < argv.length; ++index) {
		const arg = argv[index];
		switch (arg) {
			case "--json":
				options.format = "json";
				break;
			case "--markdown":
				options.format = "markdown";
				break;
			case "--all":
				options.all = true;
				break;
			case "--include-nonstandard":
				options.includeNonStandard = true;
				break;
			case "--standard-only":
				options.includeNonStandard = false;
				break;
			case "--out":
				if (index + 1 >= argv.length) {
					throw new Error("--out expects a file path");
				}
				options.out = argv[++index];
				break;
			case "--help":
			case "-h":
				options.help = true;
				break;
			default:
				throw new Error(`Unknown argument: ${arg}`);
		}
	}

	return options;
}

function printHelp() {
	console.log(`Analyze MDN CSS property metadata.

Usage:
  node scripts/analyze-mdn-css-properties.mjs [options]

Options:
  --markdown              Render markdown output (default)
  --json                  Render JSON output
  --all                   Include the full property catalog in markdown output
  --include-nonstandard   Include non-standard properties
  --standard-only         Exclude non-standard properties (default)
  --out <file>            Write output to a file
  --help, -h              Show this help
`);
}

function buildReport(allProperties, options) {
	const entries = [];
	const structureCounts = new Map();
	const complexityCounts = new Map();
	const evidenceCounts = new Map();
	const conservativeCounts = new Map();
	const groupCounts = new Map();
	let standardCount = 0;
	let nonStandardCount = 0;

	for (const [name, meta] of Object.entries(allProperties)) {
		if (!options.includeNonStandard && meta.status !== "standard") {
			continue;
		}

		if (meta.status === "standard") {
			++standardCount;
		} else {
			++nonStandardCount;
		}

		const info = analyzeProperty(name, meta);
		entries.push(info);

		structureCounts.set(info.structure, (structureCounts.get(info.structure) ?? 0) + 1);
		complexityCounts.set(info.complexity, (complexityCounts.get(info.complexity) ?? 0) + 1);
		evidenceCounts.set(info.evidence, (evidenceCounts.get(info.evidence) ?? 0) + 1);
		for (const group of info.groups) {
			groupCounts.set(group, (groupCounts.get(group) ?? 0) + 1);
		}
	}

	entries.sort((left, right) => left.name.localeCompare(right.name));
	for (const entry of entries) {
		const conservative = classifyConservative(entry);
		entry.conservative = conservative.kind;
		entry.conservativeReason = conservative.reason;
		conservativeCounts.set(conservative.kind, (conservativeCounts.get(conservative.kind) ?? 0) + 1);
	}

	const mdnCompositeFamilies = entries
		.filter((entry) => entry.familyMembers.length > 1)
		.sort(
			(left, right) => right.familyMembers.length - left.familyMembers.length || left.name.localeCompare(right.name),
		);

	const shorthandFamilies = entries
		.filter((entry) => entry.structure === "shorthand-family")
		.sort(
			(left, right) =>
				right.shorthandMembers.length - left.shorthandMembers.length || left.name.localeCompare(right.name),
		);
	const referenceOnly = entries.filter((entry) => entry.structure === "reference-only");
	const keywordUnions = entries.filter((entry) => entry.structure === "keyword-union");
	const mixed = entries.filter((entry) => entry.structure === "mixed");
	const genericSingles = entries.filter((entry) => entry.structure === "generic-single");
	const literals = entries.filter((entry) => entry.structure === "literal");
	const others = entries.filter((entry) => entry.structure === "other");
	const simpleComplexity = entries.filter((entry) => entry.complexity === "simple");
	const alternationComplexity = entries.filter((entry) => entry.complexity === "alternation");
	const repeatComplexity = entries.filter((entry) => entry.complexity === "repeat");
	const compoundComplexity = entries.filter((entry) => entry.complexity === "compound");
	const mdnEvidence = entries.filter((entry) => entry.evidence === "mdn-family");
	const shorthandEvidence = entries.filter((entry) => entry.evidence === "shorthand-family");
	const noEvidence = entries.filter((entry) => entry.evidence === "none");
	const conservativeSafe = entries
		.filter((entry) => entry.conservative === "safe")
		.sort((left, right) => left.name.localeCompare(right.name));
	const conservativeDeferred = entries
		.filter((entry) => entry.conservative === "defer")
		.sort((left, right) => left.name.localeCompare(right.name));
	const conservativeSuppressed = entries
		.filter((entry) => entry.conservative === "suppress")
		.sort((left, right) => left.name.localeCompare(right.name));

	const topGroups = [...groupCounts.entries()]
		.sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
		.slice(0, 12)
		.map(([group, count]) => ({ group, count }));

	return {
		summary: {
			total: entries.length,
			standard: standardCount,
			nonStandard: nonStandardCount,
			structures: Object.fromEntries(
				[...structureCounts.entries()].sort(([left], [right]) => left.localeCompare(right)),
			),
			complexities: Object.fromEntries(
				[...complexityCounts.entries()].sort(([left], [right]) => left.localeCompare(right)),
			),
			evidence: Object.fromEntries([...evidenceCounts.entries()].sort(([left], [right]) => left.localeCompare(right))),
			conservative: Object.fromEntries(
				[...conservativeCounts.entries()].sort(([left], [right]) => left.localeCompare(right)),
			),
			topGroups,
		},
		shorthandFamilies,
		referenceOnly,
		mdnCompositeFamilies,
		genericSingles,
		keywordUnions,
		mixed,
		repeatComplexity,
		simpleComplexity,
		alternationComplexity,
		compoundComplexity,
		literals,
		mdnEvidence,
		shorthandEvidence,
		noEvidence,
		others,
		conservativeSafe,
		conservativeDeferred,
		conservativeSuppressed,
		properties: options.all ? entries : undefined,
	};
}

function analyzeProperty(name, meta) {
	const syntax = typeof meta.syntax === "string" ? meta.syntax : "";
	const syntaxInfo = classifySyntax(syntax);
	const shorthandMembers = isShorthand(name) ? expandShorthand(name) : [];
	const familyMembers = uniqueStrings([...extractNameList(meta.initial), ...extractNameList(meta.computed)]).filter(
		(member) => member !== name,
	);
	const structure = classifyStructure({ shorthandMembers, syntaxInfo });
	const complexity = classifyComplexity(syntaxInfo);
	const evidence = classifyEvidence({ shorthandMembers, familyMembers });

	return {
		name,
		status: meta.status ?? "",
		inherited: Boolean(meta.inherited),
		media: meta.media ?? "",
		animationType: formatValue(meta.animationType),
		percentages: formatValue(meta.percentages),
		initial: formatValue(meta.initial),
		computed: formatValue(meta.computed),
		appliesto: meta.appliesto ?? "",
		groups: Array.isArray(meta.groups) ? [...meta.groups] : [],
		mdnUrl: meta.mdn_url ?? "",
		syntax,
		structure,
		complexity,
		evidence,
		bucket: structure,
		shorthandMembers,
		familyMembers,
		syntaxInfo,
		conservative: "",
		conservativeReason: "",
	};
}

function classifyStructure({ shorthandMembers, syntaxInfo }) {
	if (shorthandMembers.length > 0) {
		return "shorthand-family";
	}
	if (syntaxInfo.propertyRefs.length > 0 && syntaxInfo.genericTokens.length === 0 && !syntaxInfo.hasPipe) {
		return "reference-only";
	}
	if (syntaxInfo.genericTokens.length > 0 && syntaxInfo.hasPipe) {
		return "mixed";
	}
	if (syntaxInfo.hasPipe) {
		return "keyword-union";
	}
	if (syntaxInfo.genericTokens.length > 0) {
		return "generic-single";
	}
	if (syntaxInfo.propertyRefs.length > 0) {
		return "reference-only";
	}
	if (syntaxInfo.literalTokens.length > 0) {
		return "literal";
	}
	return "other";
}

function classifyComplexity(syntaxInfo) {
	if (syntaxInfo.hasPipe && syntaxInfo.hasRepeat) {
		return "compound";
	}
	if (syntaxInfo.hasPipe) {
		return "alternation";
	}
	if (syntaxInfo.hasRepeat) {
		return "repeat";
	}
	if (syntaxInfo.genericTokens.length + syntaxInfo.propertyRefs.length + syntaxInfo.literalTokens.length > 1) {
		return "compound";
	}
	return "simple";
}

function classifyEvidence({ shorthandMembers, familyMembers }) {
	if (shorthandMembers.length > 0) {
		return "shorthand-family";
	}
	if (familyMembers.length > 0) {
		return "mdn-family";
	}
	return "none";
}

function isShorthand(name) {
	return Boolean(shorthandApi && typeof shorthandApi.isShorthand === "function" && shorthandApi.isShorthand(name));
}

function expandShorthand(name) {
	if (!shorthandApi || typeof shorthandApi.expand !== "function") {
		return [];
	}
	const expanded = shorthandApi.expand(name);
	return Array.isArray(expanded) ? expanded.filter((entry) => typeof entry === "string") : [];
}

function classifyConservative(entry) {
	if (isConservativeSafe(entry)) {
		return {
			kind: "safe",
			reason: "shorthand with bounded repetition and no alternation; safe for a first-pass hint candidate",
		};
	}

	if (entry.structure === "shorthand-family" || entry.structure === "reference-only") {
		return {
			kind: "defer",
			reason:
				"recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule",
		};
	}

	return {
		kind: "suppress",
		reason: "no conservative semantic gain yet; keep it out of the first-pass hint set",
	};
}

function isConservativeSafe(entry) {
	return entry.structure === "shorthand-family" && entry.syntaxInfo.hasRepeat && !entry.syntaxInfo.hasPipe;
}

function classifySyntax(syntax) {
	const trimmed = syntax.trim();
	const angleTokens = [...trimmed.matchAll(/<([^>]+)>/g)].map((match) => match[1].trim());
	const propertyRefs = angleTokens.filter((token) => /^'[^']+'$/.test(token)).map((token) => token.slice(1, -1));
	const genericTokens = angleTokens.filter((token) => !/^'[^']+'$/.test(token));
	const hasPipe = trimmed.includes("|");
	const hasRepeat = /\{\s*\d+\s*(?:,\s*\d*)?\s*\}/.test(trimmed);
	const literalTokens = extractLiteralTokens(trimmed, angleTokens);

	return {
		angleTokens,
		propertyRefs,
		genericTokens,
		literalTokens,
		hasPipe,
		hasRepeat,
	};
}

function extractLiteralTokens(syntax, angleTokens) {
	const withoutAngles = syntax.replace(/<[^>]+>/g, " ");
	const parts = withoutAngles
		.split("|")
		.map((part) => part.trim())
		.filter(Boolean)
		.filter((part) => part !== "?" && part !== "+" && part !== "*");
	const literals = [];
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
	return uniqueStrings(literals);
}

function extractNameList(value) {
	if (!Array.isArray(value)) {
		return [];
	}
	return value.filter((entry) => typeof entry === "string");
}

function formatValue(value) {
	if (Array.isArray(value)) {
		return value.join(", ");
	}
	return value ?? "";
}

function uniqueStrings(values) {
	return [...new Set(values.filter((value) => typeof value === "string" && value.length > 0))];
}

function renderMarkdown(report, includeAllProperties) {
	const lines = [];
	lines.push("# MDN CSS property analysis");
	lines.push("");
	lines.push(`- Total properties analyzed: ${report.summary.total}`);
	lines.push(`- Standard properties: ${report.summary.standard}`);
	lines.push(`- Non-standard properties: ${report.summary.nonStandard}`);
	lines.push("");
	lines.push("## Structure summary");
	lines.push("");
	for (const [structure, count] of Object.entries(report.summary.structures)) {
		lines.push(`- ${structure}: ${count}`);
	}
	lines.push("");
	lines.push("## Complexity summary");
	lines.push("");
	for (const [complexity, count] of Object.entries(report.summary.complexities)) {
		lines.push(`- ${complexity}: ${count}`);
	}
	lines.push("");
	lines.push("## Evidence summary");
	lines.push("");
	for (const [evidence, count] of Object.entries(report.summary.evidence)) {
		lines.push(`- ${evidence}: ${count}`);
	}
	lines.push("");
	lines.push("## Conservative gate");
	lines.push("");
	for (const [state, count] of Object.entries(report.summary.conservative)) {
		lines.push(`- ${state}: ${count}`);
	}
	lines.push("");
	lines.push("## Top groups");
	lines.push("");
	for (const { group, count } of report.summary.topGroups) {
		lines.push(`- ${group}: ${count}`);
	}
	lines.push("");
	lines.push("## Shorthand families");
	lines.push("");
	lines.push(
		renderPropertyTable(report.shorthandFamilies, [
			"name",
			"shorthandMembers",
			"syntax",
			"structure",
			"complexity",
			"evidence",
			"status",
		]),
	);
	lines.push("");
	lines.push("## Reference-only structures");
	lines.push("");
	lines.push(
		renderPropertyTable(report.referenceOnly, ["name", "syntax", "structure", "complexity", "evidence", "status"]),
	);
	lines.push("");
	lines.push("## MDN-derived composite families");
	lines.push("");
	lines.push(
		renderPropertyTable(report.mdnCompositeFamilies, [
			"name",
			"familyMembers",
			"syntax",
			"structure",
			"complexity",
			"evidence",
			"status",
		]),
	);
	lines.push("");
	lines.push("### Safe candidates");
	lines.push("");
	lines.push(
		renderPropertyTable(report.conservativeSafe, [
			"name",
			"syntax",
			"structure",
			"complexity",
			"evidence",
			"status",
			"conservativeReason",
		]),
	);
	lines.push("");
	lines.push("### Deferred candidates");
	lines.push("");
	lines.push(
		renderPropertyTable(report.conservativeDeferred, [
			"name",
			"syntax",
			"structure",
			"complexity",
			"evidence",
			"status",
			"conservativeReason",
		]),
	);
	lines.push("");
	lines.push("### Suppressed candidates");
	lines.push("");
	lines.push(
		renderPropertyTable(report.conservativeSuppressed.slice(0, 80), [
			"name",
			"syntax",
			"structure",
			"complexity",
			"evidence",
			"status",
			"conservativeReason",
		]),
	);
	lines.push("");
	lines.push("## Generic single-token candidates");
	lines.push("");
	lines.push(
		renderPropertyTable(report.genericSingles, [
			"name",
			"syntax",
			"structure",
			"complexity",
			"evidence",
			"status",
			"groups",
		]),
	);
	lines.push("");
	lines.push("## Keyword unions");
	lines.push("");
	lines.push(
		renderPropertyTable(report.keywordUnions, [
			"name",
			"syntax",
			"structure",
			"complexity",
			"evidence",
			"status",
			"groups",
		]),
	);
	lines.push("");
	lines.push("## Mixed syntax");
	lines.push("");
	lines.push(
		renderPropertyTable(report.mixed, ["name", "syntax", "structure", "complexity", "evidence", "status", "groups"]),
	);
	lines.push("");
	lines.push("## Repeat complexity");
	lines.push("");
	lines.push(
		renderPropertyTable(report.repeatComplexity, [
			"name",
			"syntax",
			"structure",
			"complexity",
			"evidence",
			"status",
			"groups",
		]),
	);
	lines.push("");
	lines.push("## Alternation complexity");
	lines.push("");
	lines.push(
		renderPropertyTable(report.alternationComplexity, [
			"name",
			"syntax",
			"structure",
			"complexity",
			"evidence",
			"status",
			"groups",
		]),
	);
	lines.push("");
	lines.push("## Simple complexity");
	lines.push("");
	lines.push(
		renderPropertyTable(report.simpleComplexity, [
			"name",
			"syntax",
			"structure",
			"complexity",
			"evidence",
			"status",
			"groups",
		]),
	);
	lines.push("");
	lines.push("## Compound complexity");
	lines.push("");
	lines.push(
		renderPropertyTable(report.compoundComplexity, [
			"name",
			"syntax",
			"structure",
			"complexity",
			"evidence",
			"status",
			"groups",
		]),
	);
	lines.push("");
	lines.push("## Evidence: shorthand family");
	lines.push("");
	lines.push(
		renderPropertyTable(report.shorthandEvidence, [
			"name",
			"syntax",
			"structure",
			"complexity",
			"evidence",
			"status",
			"groups",
		]),
	);
	lines.push("");
	lines.push("## Evidence: MDN family");
	lines.push("");
	lines.push(
		renderPropertyTable(report.mdnEvidence, [
			"name",
			"syntax",
			"structure",
			"complexity",
			"evidence",
			"status",
			"groups",
		]),
	);
	lines.push("");
	lines.push("## Evidence: none");
	lines.push("");
	lines.push(
		renderPropertyTable(report.noEvidence, [
			"name",
			"syntax",
			"structure",
			"complexity",
			"evidence",
			"status",
			"groups",
		]),
	);
	lines.push("");
	lines.push("## Other");
	lines.push("");
	lines.push(
		renderPropertyTable(report.others, ["name", "syntax", "structure", "complexity", "evidence", "status", "groups"]),
	);
	if (includeAllProperties && Array.isArray(report.properties)) {
		lines.push("");
		lines.push("## Full catalog");
		lines.push("");
		lines.push(
			renderPropertyTable(report.properties, [
				"name",
				"structure",
				"complexity",
				"evidence",
				"syntax",
				"status",
				"inherited",
				"groups",
				"shorthandMembers",
				"familyMembers",
			]),
		);
	}
	return lines.join("\n");
}

function renderPropertyTable(entries, columns) {
	if (!entries.length) {
		return "_None_";
	}
	const header = `| ${columns.join(" | ")} |`;
	const separator = `| ${columns.map(() => "---").join(" | ")} |`;
	const rows = entries.map(
		(entry) => `| ${columns.map((column) => escapeMarkdownCell(formatCell(entry[column]))).join(" | ")} |`,
	);
	return [header, separator, ...rows].join("\n");
}

function formatCell(value) {
	if (Array.isArray(value)) {
		return value.join(", ");
	}
	if (typeof value === "boolean") {
		return value ? "yes" : "no";
	}
	if (value == null) {
		return "";
	}
	if (typeof value === "object") {
		return JSON.stringify(value);
	}
	return String(value);
}

function escapeMarkdownCell(text) {
	return text.replace(/\|/g, "\\|").replace(/\n/g, "<br>");
}
