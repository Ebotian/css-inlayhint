import type { Diagnostic } from "vscode-languageserver";

export type CssValueKind =
	| "keyword"
	| "length"
	| "percent"
	| "zero"
	| "auto"
	| "calc"
	| "variable"
	| "global"
	| "color";

export type CssValueAtom = {
	kind: CssValueKind;
	text: string;
};

export type CssPropertySamplingRule = {
	propertyName: string;
	arities: readonly number[];
	valueAtoms: readonly CssValueAtom[];
};

export type ConstructedCssCaseFamily = {
	propertyName: string;
	arity: number;
	slotAtomSets: readonly CssValueAtom[][];
};

export type GeneratedCssCase = {
	propertyName: string;
	arity: number;
	valueAtoms: readonly CssValueAtom[];
	code: string;
	description: string;
};

export type CssValidationOracle = {
	validate(code: string): Diagnostic[];
};

export type StandardPropertyRecord = {
	name: string;
	syntax?: string;
	values?: { name: string }[];
	status?: string;
};

export type StandardPropertyWithoutName = Omit<StandardPropertyRecord, "name">;

export type StandardCssData = {
	properties: StandardPropertyRecord[];
};
