import { classifyStandardText } from "../share/cssValueAtoms.js";

export function normalizeReferencedPropertyLabel(propertyName: string): string | null {
	return inferReferencedPropertyLabel(propertyName) ?? REFERENCED_PROPERTY_LABELS.get(propertyName) ?? null;
}

export function isReferenceOnlyHintProperty(propertyName: string): boolean {
	const label = normalizeReferencedPropertyLabel(propertyName);
	if (!label) {
		return false;
	}

	return !isReferenceOnlySuffixEchoProperty(propertyName, label);
}

export function matchesReferencedPropertyToken(propertyName: string, token: string): boolean {
	const label = normalizeReferencedPropertyLabel(propertyName);
	if (!label) {
		return false;
	}

	if (label === "color") {
		return classifyStandardText(token, { allowsColor: true })?.kind === "color";
	}

	if (label === "count") {
		return /^[+-]?\d+$/.test(token) || token.toLowerCase() === "auto";
	}

	if (
		label === "width" ||
		label === "height" ||
		label === "size" ||
		label === "thickness" ||
		label === "start" ||
		label === "end" ||
		label === "opacity"
	) {
		return (
			classifyStandardText(token, { allowsColor: false })?.kind === "length" ||
			classifyStandardText(token, { allowsColor: false })?.kind === "zero" ||
			classifyStandardText(token, { allowsColor: false })?.kind === "percent" ||
			classifyStandardText(token, { allowsColor: false })?.kind === "auto"
		);
	}

	if (label === "style") {
		return classifyStandardText(token, { allowsColor: false })?.kind === "keyword";
	}

	if (label === "trim") {
		return TEXT_BOX_TRIM_KEYWORDS.has(token.toLowerCase());
	}

	if (label === "wrap") {
		return TEXT_WRAP_MODE_KEYWORDS.has(token.toLowerCase());
	}

	if (label === "collapse") {
		return WHITE_SPACE_COLLAPSE_KEYWORDS.has(token.toLowerCase());
	}

	if (label === "edge") {
		return token.toLowerCase() === "auto" || TEXT_EDGE_KEYWORDS.has(token.toLowerCase());
	}

	if (label === "caps") {
		return FONT_VARIANT_CAPS_KEYWORDS.has(token.toLowerCase());
	}

	return false;
}

function inferReferencedPropertyLabel(propertyName: string): string | null {
	if (/^(?:block|inline|max-block|max-inline|min-block|min-inline)-size$/.test(propertyName)) {
		return "width";
	}

	const borderDirectionalMatch = propertyName.match(/^border-(?:block|inline)-(?:start|end)-(color|style|width)$/);
	if (borderDirectionalMatch) {
		return borderDirectionalMatch[1] ?? null;
	}

	if (/^border-bottom-color$/.test(propertyName)) {
		return "color";
	}

	const columnRuleMatch = propertyName.match(/^column-rule-(style|width)$/);
	if (columnRuleMatch) {
		return columnRuleMatch[1] ?? null;
	}

	const logicalEdgeMatch = propertyName.match(/^(?:inset|margin|padding)-(?:block|inline)-(start|end)$/);
	if (logicalEdgeMatch) {
		return logicalEdgeMatch[1] ?? null;
	}

	if (/^(?:fill|flood|stop|stroke)-opacity$/.test(propertyName)) {
		return "opacity";
	}

	if (/^stop-color$/.test(propertyName)) {
		return "color";
	}

	if (/^column-(width|count)$/.test(propertyName)) {
		return propertyName.endsWith("width") ? "width" : "count";
	}

	if (/^text-emphasis-(style|color)$/.test(propertyName)) {
		return propertyName.endsWith("style") ? "style" : "color";
	}

	return null;
}

function isReferenceOnlySuffixEchoProperty(propertyName: string, label: string): boolean {
	const suffix = propertyName
		.split("-")
		.map((part) => part.trim())
		.filter(Boolean)
		.at(-1);

	return suffix === label;
}

const REFERENCED_PROPERTY_LABELS = new Map<string, string>([
	["text-emphasis-style", "style"],
	["text-emphasis-color", "color"],
	["text-box-trim", "trim"],
	["text-box-edge", "edge"],
	["white-space-collapse", "collapse"],
	["text-wrap-mode", "wrap"],
	["font-variant-caps", "caps"],
]);

const TEXT_BOX_TRIM_KEYWORDS = new Set(["none", "trim-start", "trim-end", "trim-both"]);
const TEXT_WRAP_MODE_KEYWORDS = new Set(["wrap", "nowrap"]);
const WHITE_SPACE_COLLAPSE_KEYWORDS = new Set([
	"collapse",
	"preserve",
	"preserve-breaks",
	"preserve-spaces",
	"break-spaces",
]);
const FONT_VARIANT_CAPS_KEYWORDS = new Set([
	"normal",
	"small-caps",
	"all-small-caps",
	"petite-caps",
	"all-petite-caps",
	"unicase",
	"titling-caps",
]);

const TEXT_EDGE_KEYWORDS = new Set(["text", "cap", "ex", "ideographic", "ideographic-ink", "alphabetic"]);
