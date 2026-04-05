import { getPropertySyntax } from "./summary.js";
import { hasMeaningfulReferenceSyntaxLabels } from "./referenceSyntax.js";
import { isStructuredShorthandProperty } from "./structuredShorthand.js";

export type PropertyStructure =
	| "shorthand-family"
	| "reference-only"
	| "keyword-union"
	| "mixed"
	| "generic-single"
	| "literal"
	| "other";

export function classifyPropertyStructure(propertyName: string): PropertyStructure {
	return classifySyntaxStructure(getPropertySyntax(propertyName));
}

export function isDesignedNoHintProperty(propertyName: string): boolean {
	if (isStructuredShorthandProperty(propertyName)) {
		return false;
	}

	if (classifyPropertyStructure(propertyName) === "reference-only") {
		return !hasMeaningfulReferenceSyntaxLabels(propertyName);
	}

	if (classifyPropertyStructure(propertyName) !== "generic-single") {
		return false;
	}

	return !getPropertySyntax(propertyName).includes("#");
}

function classifySyntaxStructure(syntax: string): PropertyStructure {
	const trimmed = syntax.trim();
	const angleTokens = [...trimmed.matchAll(/<([^>]+)>/g)].map((match) => match[1].trim());
	const propertyRefs = angleTokens.filter((token) => /^'[^']+'$/.test(token)).map((token) => token.slice(1, -1));
	const genericTokens = angleTokens.filter((token) => !/^'[^']+'$/.test(token));
	const hasPipe = trimmed.includes("|");
	const literalTokens = extractLiteralTokens(trimmed, angleTokens);

	if (propertyRefs.length > 0 && genericTokens.length === 0 && !hasPipe) {
		return "reference-only";
	}

	if (genericTokens.length > 0 && hasPipe) {
		return "mixed";
	}

	if (hasPipe) {
		return "keyword-union";
	}

	if (genericTokens.length > 0) {
		return "generic-single";
	}

	if (propertyRefs.length > 0) {
		return "reference-only";
	}

	if (literalTokens.length > 0) {
		return "literal";
	}

	return "other";
}

function extractLiteralTokens(syntax: string, angleTokens: readonly string[]): string[] {
	const withoutAngles = syntax.replace(/<[^>]+>/g, " ");
	const parts = withoutAngles
		.split("|")
		.map((part) => part.trim())
		.filter(Boolean)
		.filter((part) => part !== "?" && part !== "+" && part !== "*");
	const literals: string[] = [];
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
	return [...new Set(literals.filter((value) => value.length > 0))];
}
