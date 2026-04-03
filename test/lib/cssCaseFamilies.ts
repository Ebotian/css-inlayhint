import fastCartesian from "fast-cartesian";
import type {
	ConstructedCssCaseFamily,
	CssPropertySamplingRule,
	CssValueAtom,
	GeneratedCssCase,
} from "./cssCaseModel.js";

export function constructExactCaseFamilies(rule: CssPropertySamplingRule): ConstructedCssCaseFamily[] {
	return rule.arities.flatMap((arity) => {
		if (rule.valueAtoms.length === 0 || arity <= 0) {
			return [];
		}

		const slotAtomSets: readonly CssValueAtom[][] = Array.from({ length: arity }, () => [...rule.valueAtoms]);
		return [{ propertyName: rule.propertyName, arity, slotAtomSets }];
	});
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
	const separator = propertyName === "grid-area" && valueAtoms.length > 1 ? " / " : " ";
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
	const separator = propertyName === "grid-area" && valueAtoms.length > 1 ? "/" : "+";
	return valueAtoms.map((atom) => atom.kind).join(separator);
}
