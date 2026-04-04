import fastCartesian from "fast-cartesian";
import {
	getPropertySyntax,
	usesCommaSeparatedRepeatableListSyntax,
	usesSlashSeparatedGridLineSyntax,
} from "../../src/propertySyntax.js";
import { collectStandardValueAtomsForProperty, usesSyntaxDrivenUnorderedGroupSyntax } from "./cssPropertyRules.js";
import {
	parseCssSyntax as parseStandardCssSyntax,
	syntaxIncludesType as syntaxAstIncludesType,
} from "./old/cssSyntaxAst.js";
import { extractSyntaxAtoms as extractStandardSyntaxAtoms } from "./old/cssStandardAtoms.js";
import type {
	ConstructedCssCaseFamily,
	CssPropertySamplingRule,
	CssValueAtom,
	GeneratedCssCase,
} from "./cssCaseModel.js";

export function constructExactCaseFamilies(rule: CssPropertySamplingRule): ConstructedCssCaseFamily[] {
	const syntaxAst = parseStandardCssSyntax(getPropertySyntax(rule.propertyName));
	if (usesSyntaxDrivenUnorderedGroupSyntax(syntaxAst)) {
		return constructSyntaxDrivenFamilies(rule.propertyName, syntaxAst);
	}

	return rule.arities.flatMap((arity) => {
		if (rule.valueAtoms.length === 0 || arity <= 0) {
			return [];
		}

		const slotAtomSets: readonly CssValueAtom[][] = Array.from({ length: arity }, () => [...rule.valueAtoms]);
		return [{ propertyName: rule.propertyName, arity, slotAtomSets }];
	});
}

function constructSyntaxDrivenFamilies(
	propertyName: string,
	syntaxAst: ReturnType<typeof parseStandardCssSyntax>,
): ConstructedCssCaseFamily[] {
	const propertyAtoms = collectStandardValueAtomsForProperty(propertyName);
	const families = collectFamiliesFromSyntaxAst(propertyName, syntaxAst);
	const oneValueAtoms = collectSyntaxDrivenOneValueAtoms(propertyAtoms, families);
	const mergedFamilies = families.filter((family) => family.arity !== 1);

	if (oneValueAtoms.length > 0) {
		mergedFamilies.unshift({ propertyName, arity: 1, slotAtomSets: [oneValueAtoms] });
	}

	return dedupeFamilies(mergedFamilies);
}

function collectSyntaxDrivenOneValueAtoms(
	propertyAtoms: readonly CssValueAtom[],
	families: readonly ConstructedCssCaseFamily[],
): CssValueAtom[] {
	const familyAtoms = families.filter((family) => family.arity === 1).flatMap((family) => family.slotAtomSets[0] ?? []);
	return uniqueAtoms([...propertyAtoms, ...familyAtoms]);
}

function collectFamiliesFromSyntaxAst(
	propertyName: string,
	syntaxAst: ReturnType<typeof parseStandardCssSyntax>,
): ConstructedCssCaseFamily[] {
	if (syntaxAst.type !== "Group") {
		const atoms = collectSyntaxBranchAtoms(syntaxAst);
		return atoms.length > 0 ? [{ propertyName, arity: 1, slotAtomSets: [atoms] }] : [];
	}

	if (syntaxAst.combinator === " ") {
		const families: ConstructedCssCaseFamily[] = [];
		for (const term of syntaxAst.terms) {
			if (isOptionalSlashMultiplier(term)) {
				continue;
			}

			families.push(...collectFamiliesFromSyntaxAst(propertyName, term as ReturnType<typeof parseStandardCssSyntax>));
		}

		return families;
	}

	if (syntaxAst.combinator === "|") {
		const nestedFamilies: ConstructedCssCaseFamily[] = [];
		const leafAtoms: CssValueAtom[] = [];

		for (const term of syntaxAst.terms) {
			if (term.type === "Group" && term.combinator === "||") {
				nestedFamilies.push(...collectFamiliesFromSyntaxAst(propertyName, term));
				continue;
			}

			leafAtoms.push(...collectSyntaxBranchAtoms(term));
		}

		if (leafAtoms.length > 0) {
			nestedFamilies.unshift({ propertyName, arity: 1, slotAtomSets: [uniqueAtoms(leafAtoms)] });
		}

		return nestedFamilies;
	}

	if (syntaxAst.combinator === "||") {
		const families: ConstructedCssCaseFamily[] = [];
		for (let arity = 1; arity <= syntaxAst.terms.length; arity += 1) {
			for (const branchSubset of chooseBranchSubsets(syntaxAst.terms, arity)) {
				const slotAtomSets = branchSubset
					.map((branch) => collectSyntaxBranchAtoms(branch))
					.filter((atoms) => atoms.length > 0);
				if (slotAtomSets.length === branchSubset.length) {
					families.push({ propertyName, arity, slotAtomSets });
				}
			}
		}

		return families;
	}

	return [];
}

function collectSyntaxBranchAtoms(branch: unknown): CssValueAtom[] {
	if (!branch || typeof branch !== "object") {
		return [];
	}

	const node = branch as { type?: string; name?: string; terms?: unknown[] };
	const atoms: CssValueAtom[] = [];
	if (node.type === "Property" && node.name) {
		return uniqueAtoms([...collectStandardValueAtomsForProperty(node.name)]);
	}

	if (node.type === "Type" && node.name === "angle") {
		atoms.push({ kind: "length", text: "0deg" }, { kind: "length", text: "90deg" });
	} else if (node.type === "Type" && node.name === "ratio") {
		atoms.push({ kind: "keyword", text: "1/1" }, { kind: "keyword", text: "16/9" });
	}

	const allowsColor = syntaxAstIncludesType(branch as ReturnType<typeof parseStandardCssSyntax>, "color");
	for (const atom of extractStandardSyntaxAtoms(branch as ReturnType<typeof parseStandardCssSyntax>, { allowsColor })) {
		atoms.push(atom);
	}

	return uniqueAtoms(atoms);
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

function chooseBranchSubsets(branches: readonly unknown[], subsetSize: number): unknown[][] {
	if (subsetSize <= 0 || subsetSize > branches.length) {
		return [];
	}

	const subsets: unknown[][] = [];
	const chosen: unknown[] = [];

	function visit(startIndex: number): void {
		if (chosen.length === subsetSize) {
			subsets.push([...chosen]);
			return;
		}

		for (let index = startIndex; index < branches.length; index += 1) {
			chosen.push(branches[index]);
			visit(index + 1);
			chosen.pop();
		}
	}

	visit(0);
	return subsets;
}

function dedupeFamilies(families: readonly ConstructedCssCaseFamily[]): ConstructedCssCaseFamily[] {
	const seen = new Set<string>();
	const unique: ConstructedCssCaseFamily[] = [];

	for (const family of families) {
		const key = `${family.arity}|${family.slotAtomSets.map((slotAtomSet) => slotAtomSet.map((atom) => `${atom.kind}:${atom.text}`).join(",")).join(";")}`;
		if (seen.has(key)) {
			continue;
		}

		seen.add(key);
		unique.push(family);
	}

	return unique;
}

function uniqueAtoms(atoms: readonly CssValueAtom[]): CssValueAtom[] {
	const seen = new Set<string>();
	const unique: CssValueAtom[] = [];

	for (const atom of atoms) {
		const key = `${atom.kind}:${atom.text}`;
		if (seen.has(key)) {
			continue;
		}

		seen.add(key);
		unique.push(atom);
	}

	return unique;
}

export function sampleExactCases(families: readonly ConstructedCssCaseFamily[]): GeneratedCssCase[] {
	const seenCodes = new Set<string>();
	return families.flatMap((family) => {
		const combinations = fastCartesian(family.slotAtomSets);
		return combinations.flatMap((valueAtoms) => {
			const code = renderCssDeclaration(family.propertyName, valueAtoms);
			if (seenCodes.has(code)) {
				return [];
			}

			seenCodes.add(code);
			return [
				{
					propertyName: family.propertyName,
					arity: family.arity,
					valueAtoms,
					code,
					description: `${family.propertyName}/${family.arity}-value/${formatCaseDescription(family.propertyName, valueAtoms)}`,
				},
			];
		});
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
