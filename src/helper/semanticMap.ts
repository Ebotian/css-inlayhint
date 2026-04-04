import { classifyStandardText } from "../share/cssValueAtoms.js";
import { hasMeaningfulReferenceSyntaxLabels } from "./referenceSyntax.js";

export function normalizeReferencedPropertyLabel(propertyName: string): string | null {
	return REFERENCED_PROPERTY_LABELS.get(propertyName) ?? null;
}

export function isReferenceOnlyHintProperty(propertyName: string): boolean {
	return hasMeaningfulReferenceSyntaxLabels(propertyName);
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

const REFERENCED_PROPERTY_LABELS = new Map<string, string>([
	["column-width", "width"],
	["column-count", "count"],
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
