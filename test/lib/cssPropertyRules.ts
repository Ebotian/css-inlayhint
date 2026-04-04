import { createRequire } from "node:module";
import mdnProperties from "mdn-data/css/properties.json";
import { isGridLineProperty, usesCommaSeparatedRepeatableListSyntax } from "../../src/propertySyntax.js";
import {
	parseCssSyntax as parseStandardCssSyntax,
	parseShorthandArities as parseStandardShorthandArities,
	syntaxIncludesType as syntaxAstIncludesType,
	visitCssSyntaxAst,
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
const shorthandApi = nodeRequire("css-shorthand-properties") as {
	default?: {
		expand?(propertyName: string): string[];
	};
	expand?(propertyName: string): string[];
};
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
	const arities = isGridLineProperty(propertyName)
		? parseGridLineArities(property.syntax ?? "", syntaxAst)
		: parseStandardShorthandArities(syntaxAst);
	const sampledArities =
		usesCommaSeparatedRepeatableListSyntax(propertyName) && arities.length === 1 ? [1, 2] : arities;
	const valueAtoms = isGridLineProperty(propertyName)
		? collectGridLineValueAtoms()
		: collectStandardValueAtoms(propertyName, syntaxAst);

	return {
		propertyName,
		arities: sampledArities,
		valueAtoms,
	};
}

export function collectStandardValueAtomsForProperty(propertyName: string): CssValueAtom[] {
	const property = getPropertyRecord(propertyName);
	const syntaxAst = parseStandardCssSyntax(property.syntax ?? "");
	return collectStandardValueAtomsFromRecord(propertyName, property, syntaxAst);
}

function collectGridLineValueAtoms(): CssValueAtom[] {
	return [
		{ kind: "auto", text: "auto" },
		{ kind: "global", text: "inherit" },
		{ kind: "global", text: "initial" },
		{ kind: "custom-ident", text: "some-grid-line" },
		{ kind: "integer", text: "4 some-grid-line" },
		{ kind: "integer", text: "span 3" },
		{ kind: "custom-ident", text: "span some-grid-line" },
		{ kind: "custom-ident", text: "5 some-grid-line span" },
	];
}

function parseGridLineArities(propertySyntax: string, syntaxAst: ReturnType<typeof parseStandardCssSyntax>): number[] {
	if (!propertySyntax.includes("<grid-line>") || !propertySyntax.includes("/")) {
		return parseStandardShorthandArities(syntaxAst);
	}

	const repeatRange = findGridLineRepeatRange(syntaxAst);
	if (!repeatRange) {
		return parseStandardShorthandArities(syntaxAst);
	}

	const arities = new Set<number>();
	for (let repeatCount = repeatRange.min; repeatCount <= repeatRange.max; repeatCount += 1) {
		if (repeatCount >= 0) {
			arities.add(repeatCount + 1);
		}
	}

	return arities.size > 0 ? [...arities].sort((left, right) => left - right) : parseStandardShorthandArities(syntaxAst);
}

function findGridLineRepeatRange(
	syntaxAst: ReturnType<typeof parseStandardCssSyntax>,
): { min: number; max: number } | null {
	let repeatRange: { min: number; max: number } | null = null;

	visitCssSyntaxAst(syntaxAst, (node) => {
		if (repeatRange || node.type !== "Multiplier") {
			return;
		}

		if (!isSlashSeparatedGridLineMultiplier(node.term)) {
			return;
		}

		repeatRange = { min: node.min, max: node.max };
	});

	return repeatRange;
}

function isSlashSeparatedGridLineMultiplier(term: ReturnType<typeof parseStandardCssSyntax>): boolean {
	if (term.type !== "Group") {
		return false;
	}

	return (
		term.terms.some((node) => node.type === "Token" && node.value === "/") &&
		term.terms.some((node) => node.type === "Type" && node.name === "grid-line")
	);
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
	const property = getPropertyRecord(propertyName);
	const atoms = collectStandardValueAtomsFromRecord(propertyName, property, syntaxAst);
	if (atoms.some((atom) => atom.kind !== "global")) {
		return atoms;
	}

	const expandedMembers = shorthandApi?.default?.expand?.(propertyName) ?? shorthandApi.expand?.(propertyName) ?? [];
	if (!Array.isArray(expandedMembers) || expandedMembers.length === 0) {
		return atoms;
	}

	const memberAtomsByKind = new Map<CssValueKind, CssValueAtom[]>();
	for (const memberName of expandedMembers) {
		if (memberName === propertyName) {
			continue;
		}

		const memberProperty = PROPERTY_BY_NAME.get(memberName);
		if (!memberProperty) {
			continue;
		}

		const memberSyntaxAst = parseStandardCssSyntax(memberProperty.syntax ?? "");
		for (const atom of collectStandardValueAtomsFromRecord(memberName, memberProperty, memberSyntaxAst)) {
			appendStandardDistinctAtom(memberAtomsByKind, atom);
		}
	}

	const memberAtoms = [...memberAtomsByKind.values()]
		.flatMap((memberAtoms) => memberAtoms.slice(0, 2))
		.sort((left, right) => {
			const kindDifference = left.kind.localeCompare(right.kind);
			if (kindDifference !== 0) {
				return kindDifference;
			}

			return left.text.localeCompare(right.text);
		});

	return memberAtoms.length > 0 ? memberAtoms : atoms;
}

function collectStandardValueAtomsFromRecord(
	propertyName: string,
	property: StandardPropertyRecord,
	syntaxAst: ReturnType<typeof parseStandardCssSyntax>,
): CssValueAtom[] {
	const atomsByKind = new Map<CssValueKind, CssValueAtom[]>();
	const allowsColor = syntaxAstIncludesType(syntaxAst, "color");
	const preserveAllAtoms = usesCommaSeparatedRepeatableListSyntax(propertyName);
	const appendAtom = preserveAllAtoms ? appendDistinctAtomWithoutCap : appendStandardDistinctAtom;

	for (const atom of extractStandardSyntaxAtoms(syntaxAst, { allowsColor })) {
		appendAtom(atomsByKind, atom);
	}

	for (const value of property.values ?? []) {
		const atom = classifyStandardCssText(value.name, { allowsColor });
		if (atom) {
			appendAtom(atomsByKind, atom);
		}
	}

	for (const atom of collectAtomsFromCompletions(propertyName, allowsColor)) {
		appendAtom(atomsByKind, atom);
	}

	return [...atomsByKind.values()]
		.flatMap((atoms) => (preserveAllAtoms ? atoms : atoms.slice(0, 2)))
		.sort((left, right) => {
			const kindDifference = left.kind.localeCompare(right.kind);
			if (kindDifference !== 0) {
				return kindDifference;
			}

			return left.text.localeCompare(right.text);
		});
}

function appendDistinctAtomWithoutCap(atomsByKind: Map<CssValueKind, CssValueAtom[]>, atom: CssValueAtom): void {
	const atoms = atomsByKind.get(atom.kind) ?? [];
	if (atoms.some((existingAtom) => existingAtom.text === atom.text)) {
		return;
	}

	atoms.push(atom);
	atomsByKind.set(atom.kind, atoms);
}
