import { createRequire } from "node:module";

const nodeRequire = createRequire(__filename);
const cssTree = nodeRequire("css-tree") as {
	lexer: {
		matchType(typeName: string, valueText: string): { matched: boolean };
	};
};

export function tokenizeShorthandValueText(valueText: string): string[] {
	return valueText.match(/[^\s,]+/g) ?? [];
}

export function matchesSyntaxTypeToken(typeName: string, token: string): boolean {
	return matchesCssTreeTypeToken(typeName, token);
}

export function normalizeSyntaxTypeLabel(typeName: string): string | null {
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

export function normalizeSyntaxKeywordLabel(name: string): string {
	return name.toLowerCase();
}

export function matchesTypeNodeToken(typeName: string, token: string): boolean {
	return matchesCssTreeTypeToken(typeName, token);
}

function matchesCssTreeTypeToken(typeName: string, token: string): boolean {
	const normalizedTypeName = normalizeCssTreeTypeName(typeName);
	if (!normalizedTypeName) {
		return false;
	}

	try {
		return cssTree.lexer.matchType(normalizedTypeName, token).matched;
	} catch {
		return false;
	}
}

function normalizeCssTreeTypeName(typeName: string): string {
	return typeName.trim().split(/\s+/)[0] ?? "";
}

export function normalizeShorthandMemberLabel(member: string, members: readonly string[]): string {
	const commonPrefix = getCommonPrefix(members);
	let label = member.startsWith(commonPrefix) ? member.slice(commonPrefix.length) : member;
	label = label.replace(/^-/, "");

	return label;
}

export function shouldCompactShorthandLabels(labels: readonly string[]): boolean {
	return labels.length > 0 && labels.every((label) => isAxisLabel(label));
}

export function compactShorthandLabels(labels: readonly string[]): string[] {
	const commonPrefix = getCommonPrefix(labels);
	if (!commonPrefix) {
		return [...labels];
	}

	return labels.map((label) => label.slice(commonPrefix.length).replace(/^-/, ""));
}

export function getCommonPrefix(members: readonly string[]): string {
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

export function isAxisLabel(label: string): boolean {
	return (
		label === "start" ||
		label === "end" ||
		label === "top" ||
		label === "right" ||
		label === "bottom" ||
		label === "left"
	);
}
