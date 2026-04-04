import { createRequire } from "node:module";

import { parseCssSyntax, visitCssSyntaxAst } from "./share/cssSyntax.js";
import { isCssWideKeyword } from "./share/cssValueAtoms.js";

type StandardPropertyRecord = {
	name: string;
	syntax?: string;
	values?: { name: string }[];
	status?: string;
};

type StandardPropertyWithoutName = Omit<StandardPropertyRecord, "name">;

type StandardCssData = {
	properties: StandardPropertyRecord[];
};

const nodeRequire = createRequire(__filename);
const shorthandApi = nodeRequire("css-shorthand-properties") as {
	default?: {
		expand?(propertyName: string): string[];
	};
	expand?(propertyName: string): string[];
};
const builtInCssData = nodeRequire("vscode-css-languageservice/lib/esm/data/webCustomData.js") as {
	cssData: StandardCssData;
};
const mdnProperties = nodeRequire("mdn-data/css/properties.json") as Record<string, StandardPropertyWithoutName>;

const PROPERTY_BY_NAME = new Map<string, StandardPropertyRecord>();

for (const property of builtInCssData.cssData.properties) {
	PROPERTY_BY_NAME.set(property.name, property);
}

for (const [propertyName, property] of Object.entries(mdnProperties)) {
	if (!PROPERTY_BY_NAME.has(propertyName)) {
		PROPERTY_BY_NAME.set(propertyName, {
			name: propertyName,
			syntax: property.syntax,
			values: property.values,
			status: property.status,
		});
	}
}

export function getPropertySyntax(propertyName: string): string {
	return PROPERTY_BY_NAME.get(propertyName)?.syntax ?? "";
}

export function getPropertyStatus(propertyName: string): string {
	return PROPERTY_BY_NAME.get(propertyName)?.status ?? "standard";
}

export function listPropertyNames(): string[] {
	return [...PROPERTY_BY_NAME.keys()];
}

export function isGridLineProperty(propertyName: string): boolean {
	return getPropertySyntax(propertyName).includes("<grid-line>");
}

export function usesSlashSeparatedGridLineSyntax(propertyName: string): boolean {
	const syntax = getPropertySyntax(propertyName);
	return syntax.includes("<grid-line>") && syntax.includes("/");
}

export function usesCommaSeparatedRepeatableListSyntax(propertyName: string): boolean {
	return getPropertySyntax(propertyName).includes("#");
}

export function usesUnorderedOptionalGroupSyntax(propertyName: string): boolean {
	return getPropertySyntax(propertyName).includes("||");
}

export function getShorthandExpansion(propertyName: string): string[] {
	const expanded = shorthandApi?.default?.expand?.(propertyName) ?? shorthandApi.expand?.(propertyName) ?? [];
	if (!Array.isArray(expanded) || expanded.length === 0) {
		return [];
	}

	if (expanded.length === 1 && expanded[0] === propertyName) {
		return [];
	}

	return expanded;
}

export function getDirectionalFamily(propertyName: string): readonly string[] | null {
	const expanded = shorthandApi?.default?.expand?.(propertyName) ?? shorthandApi.expand?.(propertyName) ?? [];
	if (!Array.isArray(expanded) || expanded.length !== 4) {
		return null;
	}

	const directions = expanded
		.map(extractSingleDirection)
		.filter((direction): direction is DirectionalName => Boolean(direction));
	if (directions.length !== 4) {
		return null;
	}

	const uniqueDirections = new Set(directions);
	if (uniqueDirections.size !== 4) {
		return null;
	}

	const orderedDirections = [...uniqueDirections].sort(
		(left, right) => DIRECTION_ORDER.indexOf(left) - DIRECTION_ORDER.indexOf(right),
	);
	if (orderedDirections.length !== 4) {
		return null;
	}

	if (orderedDirections.some((direction, index) => direction !== DIRECTION_ORDER[index])) {
		return null;
	}

	return orderedDirections;
}

export function getShorthandLabelParts(propertyName: string, tokenCount: number, valueText?: string): string[] | null {
	const expanded = getShorthandExpansion(propertyName);

	if (usesUnorderedOptionalGroupSyntax(propertyName)) {
		const unorderedLabelParts =
			expanded.length > 0 ? inferUnorderedShorthandLabelParts(expanded, valueText, tokenCount) : null;
		if (unorderedLabelParts) {
			return unorderedLabelParts;
		}

		return inferUnorderedSyntaxLabelParts(propertyName, valueText, tokenCount);
	}

	if (!Array.isArray(expanded) || expanded.length === 0) {
		return null;
	}

	const labels = expanded.map((member) => normalizeShorthandMemberLabel(member, expanded));
	if (labels.some((label) => !label)) {
		return null;
	}

	const normalizedLabels = shouldCompactShorthandLabels(labels as string[])
		? compactShorthandLabels(labels as string[])
		: [...expanded];
	if (tokenCount === 1) {
		return [normalizedLabels.join("/")];
	}

	if (tokenCount <= normalizedLabels.length) {
		return normalizedLabels.slice(0, tokenCount);
	}

	return null;
}

function inferUnorderedShorthandLabelParts(
	expanded: readonly string[],
	valueText: string | undefined,
	tokenCount: number,
): string[] | null {
	if (!valueText || tokenCount <= 0) {
		return null;
	}

	const tokens = tokenizeShorthandValueText(valueText);
	if (tokens.length === 0) {
		return null;
	}

	const labels: string[] = [];
	for (const token of tokens) {
		if (isCssWideKeyword(token)) {
			labels.push("global");
			continue;
		}

		const matchedMember = expanded.find((memberName) => matchesShorthandMemberToken(memberName, token));
		if (!matchedMember) {
			return null;
		}

		labels.push(normalizeShorthandMemberLabel(matchedMember, expanded));
	}

	return labels.length === tokenCount ? labels : null;
}

function inferUnorderedSyntaxLabelParts(
	propertyName: string,
	valueText: string | undefined,
	tokenCount: number,
): string[] | null {
	if (!valueText || tokenCount <= 0) {
		return null;
	}

	const syntaxAst = getPropertySyntaxAst(propertyName);
	const branches = getTopLevelUnorderedSyntaxBranches(syntaxAst);
	if (!branches || branches.length === 0) {
		return null;
	}

	const tokens = tokenizeShorthandValueText(valueText);
	if (tokens.length === 0) {
		return null;
	}

	const labels: string[] = [];
	for (const token of tokens) {
		const branch = branches.find((candidate) => matchesSyntaxBranchToken(candidate, token));
		if (!branch) {
			return null;
		}

		const label = inferSyntaxBranchLabel(branch);
		if (!label) {
			return null;
		}

		labels.push(label);
	}

	return labels.length === tokenCount ? labels : null;
}

function getTopLevelUnorderedSyntaxBranches(syntaxAst: unknown): unknown[] | null {
	if (!syntaxAst || typeof syntaxAst !== "object") {
		return null;
	}

	const group = syntaxAst as { type?: string; combinator?: string; terms?: unknown[] };
	if (group.type !== "Group" || group.combinator !== "||" || !Array.isArray(group.terms)) {
		return null;
	}

	return group.terms;
}

function inferSyntaxBranchLabel(branch: unknown): string | null {
	if (!branch || typeof branch !== "object") {
		return null;
	}

	const node = branch as { type?: string; name?: string; terms?: Array<{ type?: string; name?: string }> };
	if (node.type === "Type") {
		return normalizeSyntaxTypeLabel(node.name ?? "");
	}

	if (node.type === "Group" && Array.isArray(node.terms)) {
		const keywordNames = node.terms
			.filter((term): term is { type: "Keyword"; name: string } => term.type === "Keyword" && Boolean(term.name))
			.map((term) => term.name.toLowerCase());

		if (keywordNames.length > 0 && keywordNames.every((keyword) => DIRECTION_KEYWORDS.has(keyword))) {
			return "direction";
		}

		if (keywordNames.length === 1) {
			return keywordNames[0] ?? null;
		}
	}

	if (node.type === "Keyword") {
		return normalizeSyntaxKeywordLabel(node.name ?? "");
	}

	return null;
}

function matchesSyntaxBranchToken(branch: unknown, token: string): boolean {
	if (!branch || typeof branch !== "object") {
		return false;
	}

	const node = branch as { type?: string; name?: string; terms?: Array<{ type?: string; name?: string }> };
	if (node.type === "Type") {
		return matchesSyntaxTypeToken(node.name ?? "", token);
	}

	if (node.type === "Group" && Array.isArray(node.terms)) {
		return node.terms.some((term) => term.type === "Keyword" && term.name?.toLowerCase() === token.toLowerCase());
	}

	if (node.type === "Keyword") {
		return node.name?.toLowerCase() === token.toLowerCase();
	}

	return false;
}

function matchesSyntaxTypeToken(typeName: string, token: string): boolean {
	const loweredTypeName = typeName.toLowerCase();
	if (loweredTypeName === "angle") {
		return /^(?:[+-]?(?:\d*\.?\d+))(?:deg|grad|rad|turn)$/i.test(token) || /^calc\(/i.test(token);
	}

	if (loweredTypeName.includes("length") || loweredTypeName.includes("percentage")) {
		return /^(?:[+-]?\d*\.?\d+(?:[a-z]+|%)|0(?:[a-z%]+)?)$/i.test(token);
	}

	if (loweredTypeName.includes("color")) {
		return (
			/^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(token) ||
			/^[a-z][a-z-]*$/i.test(token) ||
			/^[a-z-]+\(/i.test(token)
		);
	}

	return false;
}

function normalizeSyntaxTypeLabel(typeName: string): string | null {
	const loweredTypeName = typeName.toLowerCase();
	if (loweredTypeName === "angle") {
		return "angle";
	}

	if (loweredTypeName.includes("length") || loweredTypeName.includes("percentage")) {
		return "length";
	}

	if (loweredTypeName.includes("color")) {
		return "color";
	}

	if (loweredTypeName.includes("image")) {
		return "image";
	}

	if (loweredTypeName.includes("string")) {
		return "string";
	}

	if (loweredTypeName.includes("ident")) {
		return "ident";
	}

	return null;
}

function normalizeSyntaxKeywordLabel(name: string): string {
	return name.toLowerCase();
}

function tokenizeShorthandValueText(valueText: string): string[] {
	return valueText.match(/[^\s,]+/g) ?? [];
}

function matchesShorthandMemberToken(memberName: string, token: string): boolean {
	const property = PROPERTY_BY_NAME.get(memberName);
	if (!property) {
		return false;
	}

	const syntax = property.syntax ?? "";
	if (!syntax) {
		return false;
	}

	const syntaxAst = getPropertySyntaxAst(memberName);
	let matched = false;
	visitCssSyntaxAst(syntaxAst as ReturnType<typeof parseCssSyntax>, (node) => {
		if (matched) {
			return;
		}

		if (node.type === "Keyword" && node.name?.toLowerCase() === token.toLowerCase()) {
			matched = true;
			return;
		}

		if (node.type === "Type" && matchesTypeNodeToken(node.name ?? "", token)) {
			matched = true;
		}
	});

	return matched;
}

function getPropertySyntaxAst(propertyName: string): unknown {
	let syntaxAst = SHORTHAND_SYNTAX_AST_CACHE.get(propertyName);
	if (!syntaxAst) {
		syntaxAst = parseCssSyntax(getPropertySyntax(propertyName));
		SHORTHAND_SYNTAX_AST_CACHE.set(propertyName, syntaxAst);
	}

	return syntaxAst;
}

function matchesTypeNodeToken(typeName: string, token: string): boolean {
	const loweredToken = token.toLowerCase();
	if (typeName.toLowerCase().includes("color")) {
		return (
			/^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(token) ||
			/^[a-z][a-z-]*$/i.test(token) ||
			/^[a-z-]+\(/i.test(token)
		);
	}

	if (typeName.toLowerCase().includes("length") || typeName.toLowerCase().includes("percentage")) {
		return /^(?:[+-]?\d*\.?\d+(?:[a-z]+|%)|0(?:[a-z%]+)?)$/i.test(token);
	}

	if (typeName.toLowerCase().includes("image")) {
		return /^[a-z-]+\(/i.test(token) || loweredToken === "none";
	}

	if (typeName.toLowerCase().includes("string")) {
		return /^['\"].*['\"]$/.test(token) || loweredToken === "none";
	}

	if (typeName.toLowerCase().includes("custom-ident") || typeName.toLowerCase().includes("ident")) {
		return /^[a-z_][a-z0-9_-]*$/i.test(token);
	}

	return false;
}

function normalizeShorthandMemberLabel(member: string, members: readonly string[]): string {
	const commonPrefix = getCommonPrefix(members);
	let label = member.startsWith(commonPrefix) ? member.slice(commonPrefix.length) : member;
	label = label.replace(/^-/, "");

	return label;
}

function shouldCompactShorthandLabels(labels: readonly string[]): boolean {
	return labels.length > 0 && labels.every((label) => isAxisLabel(label));
}

function compactShorthandLabels(labels: readonly string[]): string[] {
	const commonPrefix = getCommonPrefix(labels);
	if (!commonPrefix) {
		return [...labels];
	}

	return labels.map((label) => label.slice(commonPrefix.length).replace(/^-/, ""));
}

function isAxisLabel(label: string): boolean {
	return (
		label === "start" ||
		label === "end" ||
		label === "top" ||
		label === "right" ||
		label === "bottom" ||
		label === "left"
	);
}

function getCommonPrefix(members: readonly string[]): string {
	if (members.length === 0) {
		return "";
	}

	let prefix = members[0] ?? "";
	for (const member of members.slice(1)) {
		while (prefix && !member.startsWith(prefix)) {
			prefix = prefix.slice(0, -1);
		}
	}

	const lastHyphen = prefix.lastIndexOf("-");
	if (lastHyphen < 0) {
		return "";
	}

	return prefix.slice(0, lastHyphen + 1);
}

const DIRECTION_ORDER = ["top", "right", "bottom", "left"] as const;

type DirectionalName = (typeof DIRECTION_ORDER)[number];

function extractSingleDirection(name: string): DirectionalName | null {
	const parts = name.split("-").filter(Boolean);
	const directions = parts.filter((part): part is DirectionalName => DIRECTION_ORDER.includes(part as DirectionalName));
	if (directions.length !== 1) {
		return null;
	}

	return directions[0] ?? null;
}

const SHORTHAND_SYNTAX_AST_CACHE = new Map<string, unknown>();
const DIRECTION_KEYWORDS = new Set(["auto", "reverse"]);
