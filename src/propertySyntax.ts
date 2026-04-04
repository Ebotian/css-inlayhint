import { createRequire } from "node:module";

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
const CSS_WIDE_KEYWORDS = new Set(["initial", "inherit", "unset", "revert", "revert-layer"]);

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
	return Array.isArray(expanded) ? expanded : [];
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
	if (!Array.isArray(expanded) || expanded.length === 0) {
		return null;
	}

	if (usesUnorderedOptionalGroupSyntax(propertyName)) {
		const unorderedLabelParts = inferUnorderedShorthandLabelParts(expanded, valueText, tokenCount);
		if (unorderedLabelParts) {
			return unorderedLabelParts;
		}
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
	if (!valueText) {
		return tokenCount > 0
			? expanded.slice(0, tokenCount).map((member) => normalizeShorthandMemberLabel(member, expanded))
			: null;
	}

	const tokens = tokenizeShorthandValueText(valueText);
	if (tokens.length === 0) {
		return null;
	}

	const labels: string[] = [];
	for (const token of tokens) {
		if (CSS_WIDE_KEYWORDS.has(token.toLowerCase())) {
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

function tokenizeShorthandValueText(valueText: string): string[] {
	return valueText.match(/[^\s,]+/g) ?? [];
}

function matchesShorthandMemberToken(memberName: string, token: string): boolean {
	const property = PROPERTY_BY_NAME.get(memberName);
	if (!property) {
		return false;
	}

	const loweredToken = token.toLowerCase();
	if (property.values?.some((value) => value.name.toLowerCase() === loweredToken)) {
		return true;
	}

	const syntax = property.syntax ?? "";
	if (syntax.includes("<image>") && (/^[a-z-]+\(/i.test(token) || loweredToken === "none")) {
		return true;
	}

	if (syntax.includes("<string>") && (/^['\"].*['\"]$/.test(token) || loweredToken === "none")) {
		return true;
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
