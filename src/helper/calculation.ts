import { createRequire } from "node:module";

import { usesUnorderedOptionalGroupSyntax } from "./judgment.js";
import { inferUnorderedShorthandLabelParts, inferUnorderedSyntaxLabelParts } from "./parseInfer.js";
import {
	compactShorthandLabels,
	normalizeShorthandMemberLabel,
	tokenizeShorthandValueText,
	shouldCompactShorthandLabels,
} from "./classifyNormalize.js";
import { normalizeReferencedPropertyLabel } from "./semanticMap.js";
import { collectReferencedSyntaxLabels, collectReferencedSyntaxPrefixes } from "./referenceSyntax.js";
import { inferShorthandSemanticLabelParts } from "./shorthandSemantics.js";
import { classifyStandardText } from "../share/cssValueAtoms.js";
import { inferStructuredShorthandLabelParts } from "./structuredShorthand.js";

const nodeRequire = createRequire(__filename);
const shorthandApi = nodeRequire("css-shorthand-properties") as {
	default?: {
		expand?(propertyName: string): string[];
	};
	expand?(propertyName: string): string[];
};

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
	const semanticLabels = inferShorthandSemanticLabelParts(propertyName, valueText, tokenCount);
	if (semanticLabels !== null) {
		return semanticLabels;
	}

	const structuredLabels = inferStructuredShorthandLabelParts(propertyName, tokenCount);
	if (structuredLabels !== null) {
		return structuredLabels;
	}

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
		const referencePrefixes = collectReferencedSyntaxPrefixes(propertyName);
		if (referencePrefixes.length >= 2) {
			if (tokenCount === 1) {
				return ["all"];
			}

			return referencePrefixes.slice(0, Math.min(tokenCount, referencePrefixes.length));
		}

		const referenceLabels = collectReferencedSyntaxLabels(propertyName);
		if (referenceLabels.length >= 2) {
			return referenceLabels.slice(0, Math.min(tokenCount, referenceLabels.length));
		}

		const referenceLabel = normalizeReferencedPropertyLabel(propertyName);
		if (referenceLabel) {
			return Array.from({ length: tokenCount }, () => referenceLabel);
		}

		return null;
	}

	const labels = expanded.map((member) => normalizeShorthandMemberLabel(member, expanded));
	if (labels.some((label) => !label)) {
		return null;
	}

	const normalizedLabels = shouldCompactShorthandLabels(labels as string[])
		? compactShorthandLabels(labels as string[])
		: [...labels];
	if (tokenCount === 1) {
		return [normalizedLabels.join("/")];
	}

	if (tokenCount > normalizedLabels.length) {
		const fallbackLabels = inferGenericTokenLabels(valueText, tokenCount);
		if (fallbackLabels) {
			return fallbackLabels;
		}
	}

	if (tokenCount <= normalizedLabels.length) {
		return normalizedLabels.slice(0, tokenCount);
	}

	return null;
}

function inferGenericTokenLabels(valueText: string | undefined, tokenCount: number): string[] | null {
	if (!valueText) {
		return Array.from({ length: tokenCount }, (_unused, index) => (index === 0 ? "value" : `value-${index + 1}`));
	}

	const tokens = tokenizeShorthandValueText(valueText);
	const meaningfulTokens = tokens.filter((token) => token !== "/");
	if (meaningfulTokens.length === 0) {
		return null;
	}

	const labels = meaningfulTokens.map(inferGenericTokenLabel);
	if (labels.length >= tokenCount) {
		return labels.slice(0, tokenCount) as string[];
	}

	return [
		...labels,
		...Array.from({ length: tokenCount - labels.length }, (_unused, index) => `value-${labels.length + index + 1}`),
	];
}

function inferGenericTokenLabel(token: string): string {
	if (/^(['"]).*\1$/.test(token)) {
		return "string";
	}

	if (/^\[[^\]]+\]$/.test(token)) {
		return "ident";
	}

	const atom = classifyStandardText(token, { allowsColor: true });
	if (!atom) {
		return "value";
	}

	switch (atom.kind) {
		case "keyword":
		case "auto":
			return "keyword";
		case "length":
		case "percent":
		case "zero":
		case "calc":
			return "length";
		case "color":
			return "color";
		case "custom-ident":
			return "ident";
		default:
			return "value";
	}
}

function extractSingleDirection(name: string): DirectionalName | null {
	const parts = name.split("-").filter(Boolean);
	const directions = parts.filter((part): part is DirectionalName => DIRECTION_ORDER.includes(part as DirectionalName));
	if (directions.length !== 1) {
		return null;
	}

	return directions[0] ?? null;
}

const DIRECTION_ORDER = ["top", "right", "bottom", "left"] as const;

type DirectionalName = (typeof DIRECTION_ORDER)[number];
