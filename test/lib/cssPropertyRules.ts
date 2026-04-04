import { createRequire } from "node:module";
import mdnProperties from "mdn-data/css/properties.json";
import {
	getShorthandExpansion,
	isGridLineProperty,
	usesCommaSeparatedRepeatableListSyntax,
} from "../../src/propertySyntax.js";
import {
	parseCssSyntax as parseStandardCssSyntax,
	parseShorthandArities as parseStandardShorthandArities,
	syntaxIncludesType as syntaxAstIncludesType,
	visitCssSyntaxAst,
} from "./old/cssSyntaxAst.js";
import {
	appendDistinctAtom as appendStandardDistinctAtom,
	classifyStandardText as classifyStandardCssText,
	extractSyntaxAtoms as extractStandardSyntaxAtoms,
} from "./old/cssStandardAtoms.js";
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
const builtInCssSyntaxes = nodeRequire("mdn-data/css/syntaxes.json") as Record<string, { syntax?: string }>;

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
		: usesSyntaxDrivenUnorderedGroupSyntax(syntaxAst)
			? parseUnorderedGroupArities(syntaxAst)
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
			appendDistinctAtomWithoutCap(memberAtomsByKind, atom);
		}
	}

	const memberAtoms = [...memberAtomsByKind.values()]
		.flatMap((memberAtoms) => memberAtoms)
		.sort((left, right) => {
			const kindDifference = left.kind.localeCompare(right.kind);
			if (kindDifference !== 0) {
				return kindDifference;
			}

			return left.text.localeCompare(right.text);
		});

	if (memberAtoms.length === 0) {
		return atoms;
	}

	const mergedAtomsByKind = new Map<CssValueKind, CssValueAtom[]>();
	for (const atom of atoms) {
		appendDistinctAtomWithoutCap(mergedAtomsByKind, atom);
	}
	for (const atom of memberAtoms) {
		appendDistinctAtomWithoutCap(mergedAtomsByKind, atom);
	}

	return [...mergedAtomsByKind.values()].flat();
}

function collectStandardValueAtomsFromRecord(
	propertyName: string,
	property: StandardPropertyRecord,
	syntaxAst: ReturnType<typeof parseStandardCssSyntax>,
	visitedProperties = new Set<string>([propertyName]),
): CssValueAtom[] {
	const atomsByKind = new Map<CssValueKind, CssValueAtom[]>();
	const allowsColor = syntaxAstIncludesType(syntaxAst, "color");
	const preserveAllAtoms = usesCommaSeparatedRepeatableListSyntax(propertyName);
	const appendAtom = preserveAllAtoms ? appendDistinctAtomWithoutCap : appendStandardDistinctAtom;

	for (const atom of extractStandardSyntaxAtoms(syntaxAst, { allowsColor })) {
		appendAtom(atomsByKind, atom);
	}

	for (const atom of collectTypeSyntaxAtoms(syntaxAst, allowsColor)) {
		appendAtom(atomsByKind, atom);
	}

	for (const referencedPropertyName of collectReferencedPropertyNames(syntaxAst)) {
		if (visitedProperties.has(referencedPropertyName)) {
			continue;
		}

		visitedProperties.add(referencedPropertyName);
		const referencedProperty = PROPERTY_BY_NAME.get(referencedPropertyName);
		if (!referencedProperty) {
			continue;
		}

		const referencedSyntaxAst = parseStandardCssSyntax(referencedProperty.syntax ?? "");
		for (const atom of collectStandardValueAtomsFromRecord(
			referencedPropertyName,
			referencedProperty,
			referencedSyntaxAst,
			visitedProperties,
		)) {
			appendAtom(atomsByKind, atom);
		}
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

	for (const atom of collectAngleValueAtoms(syntaxAst)) {
		appendAtom(atomsByKind, atom);
	}

	for (const atom of collectColorValueAtoms(syntaxAst)) {
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

function collectReferencedPropertyNames(syntaxAst: ReturnType<typeof parseStandardCssSyntax>): string[] {
	const names: string[] = [];
	const seen = new Set<string>();
	visitCssSyntaxAst(syntaxAst, (node) => {
		if (node.type !== "Property" || !node.name || seen.has(node.name)) {
			return;
		}

		seen.add(node.name);
		names.push(node.name);
	});

	return names;
}

function collectTypeSyntaxAtoms(
	syntaxAst: ReturnType<typeof parseStandardCssSyntax>,
	allowsColor: boolean,
	visitedTypes = new Set<string>(),
): CssValueAtom[] {
	const atomsByKind = new Map<CssValueKind, CssValueAtom[]>();
	visitCssSyntaxAst(syntaxAst, (node) => {
		if (node.type !== "Type") {
			return;
		}

		for (const atom of collectTypeAtoms(node.name, allowsColor, visitedTypes)) {
			appendDistinctAtomWithoutCap(atomsByKind, atom);
		}
	});

	return [...atomsByKind.values()].flat();
}

function collectTypeAtoms(typeName: string, allowsColor: boolean, visitedTypes: Set<string>): CssValueAtom[] {
	const loweredTypeName = typeName.toLowerCase();
	if (visitedTypes.has(loweredTypeName)) {
		return [];
	}

	visitedTypes.add(loweredTypeName);

	if (loweredTypeName === "angle") {
		return [
			{ kind: "length", text: "0deg" },
			{ kind: "length", text: "90deg" },
		];
	}

	if (loweredTypeName === "ratio") {
		return [
			{ kind: "keyword", text: "1/1" },
			{ kind: "keyword", text: "16/9" },
		];
	}

	const syntax = builtInCssSyntaxes[loweredTypeName]?.syntax;
	if (!syntax) {
		return [];
	}

	const typeSyntaxAst = parseStandardCssSyntax(syntax);
	const atomsByKind = new Map<CssValueKind, CssValueAtom[]>();
	for (const atom of extractStandardSyntaxAtoms(typeSyntaxAst, { allowsColor })) {
		appendDistinctAtomWithoutCap(atomsByKind, atom);
	}

	for (const atom of collectTypeSyntaxAtoms(typeSyntaxAst, allowsColor, visitedTypes)) {
		appendDistinctAtomWithoutCap(atomsByKind, atom);
	}

	return [...atomsByKind.values()].flat();
}

function parseUnorderedGroupArities(syntaxAst: ReturnType<typeof parseStandardCssSyntax>): number[] {
	const branches = findUnorderedGroupBranches(syntaxAst);
	if (!branches || branches.length === 0) {
		return parseStandardShorthandArities(syntaxAst);
	}

	return Array.from({ length: branches.length }, (_, index) => index + 1);
}

export function usesSyntaxDrivenUnorderedGroupSyntax(syntaxAst: ReturnType<typeof parseStandardCssSyntax>): boolean {
	if (syntaxAst.type === "Group" && syntaxAst.combinator === "||") {
		return syntaxAst.terms.every((term) => isSimpleSyntaxDrivenTerm(term));
	}

	if (syntaxAst.type === "Group" && syntaxAst.combinator === "|") {
		let unorderedGroupCount = 0;
		for (const term of syntaxAst.terms) {
			if (isOptionalSlashMultiplier(term)) {
				continue;
			}

			if (term.type === "Group" && term.combinator === "||") {
				if (
					!term.terms.every((child) => isSimpleSyntaxDrivenTerm(child as ReturnType<typeof parseStandardCssSyntax>))
				) {
					return false;
				}

				unorderedGroupCount += 1;
				continue;
			}

			if (isSimpleSyntaxDrivenTerm(term)) {
				continue;
			}

			return false;
		}

		return unorderedGroupCount === 1;
	}

	if (syntaxAst.type === "Group" && syntaxAst.combinator === " ") {
		let unorderedGroupCount = 0;
		for (const term of syntaxAst.terms) {
			if (isOptionalSlashMultiplier(term)) {
				continue;
			}

			if (term.type === "Group" && term.combinator === "||") {
				unorderedGroupCount += 1;
				continue;
			}

			return false;
		}

		return unorderedGroupCount === 1;
	}

	return false;
}

function isSimpleSyntaxDrivenTerm(term: ReturnType<typeof parseStandardCssSyntax>): boolean {
	if (term.type === "Keyword" || term.type === "Type" || term.type === "Property") {
		return true;
	}

	if (term.type !== "Group" || term.combinator !== "|") {
		return false;
	}

	return term.terms.every((child) => isSimpleSyntaxDrivenTerm(child as ReturnType<typeof parseStandardCssSyntax>));
}

function isOptionalSlashMultiplier(term: unknown): boolean {
	if (!term || typeof term !== "object") {
		return false;
	}

	const node = term as { type?: string; min?: number; max?: number; term?: unknown };
	if (node.type !== "Multiplier" || node.min !== 0 || node.max !== 1) {
		return false;
	}

	const inner = node.term as { type?: string; terms?: unknown[] } | undefined;
	return Boolean(
		inner &&
		inner.type === "Group" &&
		Array.isArray(inner.terms) &&
		inner.terms.some(
			(child) =>
				child &&
				typeof child === "object" &&
				(child as { type?: string; value?: string }).type === "Token" &&
				(child as { value?: string }).value === "/",
		),
	);
}

function findUnorderedGroupBranches(syntaxAst: ReturnType<typeof parseStandardCssSyntax>): readonly unknown[] | null {
	if (syntaxAst.type === "Group" && syntaxAst.combinator === "||") {
		return syntaxAst.terms;
	}

	if (syntaxAst.type === "Group") {
		for (const term of syntaxAst.terms) {
			const branches = findUnorderedGroupBranches(term as ReturnType<typeof parseStandardCssSyntax>);
			if (branches) {
				return branches;
			}
		}
	}

	if (syntaxAst.type === "Multiplier") {
		return findUnorderedGroupBranches(syntaxAst.term as ReturnType<typeof parseStandardCssSyntax>);
	}

	return null;
}

function collectAngleValueAtoms(syntaxAst: ReturnType<typeof parseStandardCssSyntax>): CssValueAtom[] {
	if (!syntaxAstIncludesType(syntaxAst, "angle")) {
		return [];
	}

	return [
		{ kind: "length", text: "0deg" },
		{ kind: "length", text: "90deg" },
	];
}

function collectColorValueAtoms(syntaxAst: ReturnType<typeof parseStandardCssSyntax>): CssValueAtom[] {
	if (!syntaxAstIncludesType(syntaxAst, "color")) {
		return [];
	}

	return [
		{ kind: "color", text: "red" },
		{ kind: "color", text: "blue" },
	];
}

function appendDistinctAtomWithoutCap(atomsByKind: Map<CssValueKind, CssValueAtom[]>, atom: CssValueAtom): void {
	const atoms = atomsByKind.get(atom.kind) ?? [];
	if (atoms.some((existingAtom) => existingAtom.text === atom.text)) {
		return;
	}

	atoms.push(atom);
	atomsByKind.set(atom.kind, atoms);
}
