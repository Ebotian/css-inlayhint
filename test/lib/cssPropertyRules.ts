import { createRequire } from "node:module";
import mdnProperties from "mdn-data/css/properties.json";
import {
	parseCssSyntax as parseStandardCssSyntax,
	parseShorthandArities as parseStandardShorthandArities,
	syntaxIncludesType as syntaxAstIncludesType,
} from "./cssSyntaxAst.js";
import {
	appendDistinctAtom as appendStandardDistinctAtom,
	classifyStandardText as classifyStandardCssText,
	extractSyntaxAtoms as extractStandardSyntaxAtoms,
} from "./cssStandardAtoms.js";
import { collectAtomsFromCompletions } from "./cssCompletionAtoms.js";
import type {
	CssPropertySamplingRule,
	CssValueAtom,
	CssValueKind,
	StandardCssData,
	StandardPropertyRecord,
	StandardPropertyWithoutName,
} from "./cssCaseModel.js";

const nodeRequire = createRequire(__filename);
const builtInCssData = nodeRequire("vscode-css-languageservice/lib/esm/data/webCustomData.js") as {
	cssData: StandardCssData;
};

const PROPERTY_BY_NAME = new Map<string, StandardPropertyRecord>();

for (const property of builtInCssData.cssData.properties) {
	PROPERTY_BY_NAME.set(property.name, property);
}

for (const [propertyName, property] of Object.entries(mdnProperties as Record<string, StandardPropertyWithoutName>)) {
	if (!PROPERTY_BY_NAME.has(propertyName)) {
		PROPERTY_BY_NAME.set(propertyName, {
			name: propertyName,
			syntax: property.syntax,
			values: property.values,
			status: property.status,
		});
	}
}

export const DEFAULT_PROPERTY_SAMPLING_RULES: readonly CssPropertySamplingRule[] = createDefaultPropertySamplingRules();

export function createDefaultPropertySamplingRules(limit = 8): CssPropertySamplingRule[] {
	return [...PROPERTY_BY_NAME.values()]
		.filter(
			(property) =>
				(property.status ?? "standard") === "standard" && Boolean(property.syntax) && !property.name.startsWith("-"),
		)
		.map((property) => createStandardPropertySamplingRule(property.name))
		.filter((rule) => rule.arities.length > 0 && rule.valueAtoms.length > 0)
		.sort((left, right) => {
			const scoreDifference = scorePropertyRule(right) - scorePropertyRule(left);
			if (scoreDifference !== 0) {
				return scoreDifference;
			}

			return left.propertyName.localeCompare(right.propertyName);
		})
		.slice(0, limit);
}

export function createStandardPropertySamplingRule(propertyName: string): CssPropertySamplingRule {
	const property = getPropertyRecord(propertyName);
	const syntaxAst = parseStandardCssSyntax(property.syntax ?? "");
	const arities = propertyName === "grid-area" ? [1, 2, 3, 4] : parseStandardShorthandArities(syntaxAst);
	const valueAtoms =
		propertyName === "grid-area" ? collectGridAreaValueAtoms() : collectStandardValueAtoms(propertyName, syntaxAst);

	return {
		propertyName,
		arities,
		valueAtoms,
	};
}

function collectGridAreaValueAtoms(): CssValueAtom[] {
	return [
		{ kind: "auto", text: "auto" },
		{ kind: "global", text: "inherit" },
		{ kind: "global", text: "initial" },
		{ kind: "custom-ident", text: "some-grid-area" },
		{ kind: "integer", text: "4 some-grid-area" },
		{ kind: "integer", text: "span 3" },
		{ kind: "custom-ident", text: "span some-grid-area" },
	];
}

export function getPropertyRecord(propertyName: string): StandardPropertyRecord {
	const property = PROPERTY_BY_NAME.get(propertyName);
	if (!property) {
		throw new Error(`Missing standard metadata for CSS property: ${propertyName}`);
	}

	return property;
}

export function getPropertySyntax(propertyName: string): string {
	return getPropertyRecord(propertyName).syntax ?? "";
}

function scorePropertyRule(rule: CssPropertySamplingRule): number {
	return rule.arities.length * 10 + rule.valueAtoms.length;
}

function collectStandardValueAtoms(
	propertyName: string,
	syntaxAst: ReturnType<typeof parseStandardCssSyntax>,
): CssValueAtom[] {
	const atomsByKind = new Map<CssValueKind, CssValueAtom[]>();
	const property = getPropertyRecord(propertyName);
	const allowsColor = syntaxAstIncludesType(syntaxAst, "color");

	for (const atom of extractStandardSyntaxAtoms(syntaxAst, { allowsColor })) {
		appendStandardDistinctAtom(atomsByKind, atom);
	}

	for (const value of property.values ?? []) {
		const atom = classifyStandardCssText(value.name, { allowsColor });
		if (atom) {
			appendStandardDistinctAtom(atomsByKind, atom);
		}
	}

	for (const atom of collectAtomsFromCompletions(propertyName, allowsColor)) {
		appendStandardDistinctAtom(atomsByKind, atom);
	}

	return [...atomsByKind.values()]
		.flatMap((atoms) => atoms.slice(0, 2))
		.sort((left, right) => {
			const kindDifference = left.kind.localeCompare(right.kind);
			if (kindDifference !== 0) {
				return kindDifference;
			}

			return left.text.localeCompare(right.text);
		});
}
