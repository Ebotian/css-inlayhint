import { createRequire } from "node:module";

const nodeRequire = createRequire(__filename);
const cssTree = nodeRequire("css-tree") as {
	lexer: {
		matchType(typeName: string, valueText: string): { matched: boolean };
	};
};

export function tokenizeShorthandValueText(valueText: string): string[] {
	return collectShorthandValueTokens(valueText).map((token) => token.text);
}

export function collectShorthandValueTokens(valueText: string): Array<{ text: string; index: number }> {
	const tokens: Array<{ text: string; index: number }> = [];
	let tokenStart = -1;
	let parenDepth = 0;
	let bracketDepth = 0;
	let braceDepth = 0;
	let quote: string | null = null;
	let escaped = false;

	for (let index = 0; index < valueText.length; index += 1) {
		const character = valueText[index] ?? "";

		if (quote) {
			if (escaped) {
				escaped = false;
			} else if (character === "\\") {
				escaped = true;
			} else if (character === quote) {
				quote = null;
			}

			continue;
		}

		if (character === '"' || character === "'") {
			if (tokenStart < 0) {
				tokenStart = index;
			}
			quote = character;
			continue;
		}

		if (character === "(") {
			parenDepth += 1;
			if (tokenStart < 0) {
				tokenStart = index;
			}
			continue;
		}

		if (character === ")") {
			parenDepth = Math.max(0, parenDepth - 1);
			continue;
		}

		if (character === "[") {
			bracketDepth += 1;
			if (tokenStart < 0) {
				tokenStart = index;
			}
			continue;
		}

		if (character === "]") {
			bracketDepth = Math.max(0, bracketDepth - 1);
			continue;
		}

		if (character === "{") {
			braceDepth += 1;
			if (tokenStart < 0) {
				tokenStart = index;
			}
			continue;
		}

		if (character === "}") {
			braceDepth = Math.max(0, braceDepth - 1);
			continue;
		}

		if (isTopLevelDelimiter(character, parenDepth, bracketDepth, braceDepth)) {
			if (tokenStart >= 0) {
				tokens.push({ text: valueText.slice(tokenStart, index), index: tokenStart });
				tokenStart = -1;
			}

			continue;
		}

		if (tokenStart < 0) {
			tokenStart = index;
		}
	}

	if (tokenStart >= 0) {
		tokens.push({ text: valueText.slice(tokenStart), index: tokenStart });
	}

	return tokens;
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
	return labels.length > 0 && (labels.every((label) => isAxisLabel(label)) || Boolean(getCommonPrefix(labels)));
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

function isTopLevelDelimiter(character: string, parenDepth: number, bracketDepth: number, braceDepth: number): boolean {
	if (parenDepth > 0 || bracketDepth > 0 || braceDepth > 0) {
		return false;
	}

	return /[\s,\/]/.test(character);
}
