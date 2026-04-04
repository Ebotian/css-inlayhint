import fastCartesian from "fast-cartesian";
import {
	getShorthandExpansion,
	usesCommaSeparatedRepeatableListSyntax,
	usesSlashSeparatedGridLineSyntax,
	usesUnorderedOptionalGroupSyntax,
} from "../../src/propertySyntax.js";
import { collectStandardValueAtomsForProperty } from "./cssPropertyRules.js";
import type {
	ConstructedCssCaseFamily,
	CssPropertySamplingRule,
	CssValueAtom,
	GeneratedCssCase,
} from "./cssCaseModel.js";

export function constructExactCaseFamilies(rule: CssPropertySamplingRule): ConstructedCssCaseFamily[] {
	if (usesUnorderedOptionalGroupSyntax(rule.propertyName)) {
		return constructUnorderedOptionalGroupFamilies(rule.propertyName);
	}

	return rule.arities.flatMap((arity) => {
		if (rule.valueAtoms.length === 0 || arity <= 0) {
			return [];
		}

		const slotAtomSets: readonly CssValueAtom[][] = Array.from({ length: arity }, () => [...rule.valueAtoms]);
		return [{ propertyName: rule.propertyName, arity, slotAtomSets }];
	});
}

function constructUnorderedOptionalGroupFamilies(propertyName: string): ConstructedCssCaseFamily[] {
	const members = getShorthandExpansion(propertyName);
	if (members.length === 0) {
		return [];
	}

	const globalAtoms = collectStandardValueAtomsForProperty(propertyName).filter((atom) => atom.kind === "global");
	const memberAtomsByName = new Map<string, CssValueAtom[]>();
	const seenTexts = new Set<string>(globalAtoms.map((atom) => atom.text));

	for (const memberName of members) {
		const memberAtoms = collectStandardValueAtomsForProperty(memberName).filter((atom) => {
			if (atom.kind === "global" || seenTexts.has(atom.text)) {
				return false;
			}

			seenTexts.add(atom.text);
			return true;
		});
		memberAtomsByName.set(memberName, memberAtoms);
	}

	const families: ConstructedCssCaseFamily[] = [];
	if (globalAtoms.length > 0) {
		families.push({ propertyName, arity: 1, slotAtomSets: [globalAtoms] });
	}

	for (let subsetSize = 1; subsetSize <= members.length; subsetSize += 1) {
		for (const subset of chooseMemberSubsets(members, subsetSize)) {
			const slotAtomSets = subset
				.map((memberName) => memberAtomsByName.get(memberName) ?? [])
				.filter((atoms) => atoms.length > 0);

			if (slotAtomSets.length !== subset.length) {
				continue;
			}

			families.push({ propertyName, arity: subset.length, slotAtomSets });
		}
	}

	return families;
}

function chooseMemberSubsets(members: readonly string[], subsetSize: number): string[][] {
	if (subsetSize <= 0 || subsetSize > members.length) {
		return [];
	}

	const subsets: string[][] = [];
	const chosen: string[] = [];

	function visit(startIndex: number): void {
		if (chosen.length === subsetSize) {
			subsets.push([...chosen]);
			return;
		}

		for (let index = startIndex; index < members.length; index += 1) {
			chosen.push(members[index] ?? "");
			visit(index + 1);
			chosen.pop();
		}
	}

	visit(0);
	return subsets;
}

export function sampleExactCases(families: readonly ConstructedCssCaseFamily[]): GeneratedCssCase[] {
	return families.flatMap((family) => {
		const combinations = fastCartesian(family.slotAtomSets);
		return combinations.map((valueAtoms) => ({
			propertyName: family.propertyName,
			arity: family.arity,
			valueAtoms,
			code: renderCssDeclaration(family.propertyName, valueAtoms),
			description: `${family.propertyName}/${family.arity}-value/${formatCaseDescription(family.propertyName, valueAtoms)}`,
		}));
	});
}

export function generateExactCases(rule: CssPropertySamplingRule): GeneratedCssCase[] {
	return sampleExactCases(constructExactCaseFamilies(rule));
}

export function renderCssDeclaration(propertyName: string, valueAtoms: readonly CssValueAtom[]): string {
	const separator =
		usesSlashSeparatedGridLineSyntax(propertyName) && valueAtoms.length > 1
			? " / "
			: usesCommaSeparatedRepeatableListSyntax(propertyName) && valueAtoms.length > 1
				? ", "
				: " ";
	return `.probe {\n  ${propertyName}: ${valueAtoms.map((atom) => atom.text).join(separator)};\n}`;
}

export function countExactCases(families: readonly ConstructedCssCaseFamily[]): number {
	return families.reduce((total, family) => {
		if (family.slotAtomSets.length === 0) {
			return total;
		}

		const width = family.slotAtomSets.reduce((product, slotAtomSet) => product * slotAtomSet.length, 1);
		return total + width;
	}, 0);
}

function formatCaseDescription(propertyName: string, valueAtoms: readonly CssValueAtom[]): string {
	const separator =
		usesSlashSeparatedGridLineSyntax(propertyName) && valueAtoms.length > 1
			? "/"
			: usesCommaSeparatedRepeatableListSyntax(propertyName) && valueAtoms.length > 1
				? ","
				: "+";
	return valueAtoms.map((atom) => atom.kind).join(separator);
}
