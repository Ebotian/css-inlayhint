export function tokenizeShorthandValueText(valueText: string): string[] {
	return valueText.match(/[^\s,]+/g) ?? [];
}

export function matchesSyntaxTypeToken(typeName: string, token: string): boolean {
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
