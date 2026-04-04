import { createRequire } from "node:module";

type DefinitionSyntaxNode = {
	type: string;
	[key: string]: unknown;
};

type DefinitionSyntaxApi = {
	parse(source: string): unknown;
	walk(node: unknown, visit: (node: DefinitionSyntaxNode) => void): void;
};

const nodeRequire = createRequire(__filename);
const cssTree = nodeRequire("css-tree") as {
	definitionSyntax: DefinitionSyntaxApi;
};

export type CssSyntaxAst =
	| CssSyntaxGroupNode
	| CssSyntaxMultiplierNode
	| CssSyntaxBooleanNode
	| CssSyntaxTypeNode
	| CssSyntaxPropertyNode
	| CssSyntaxKeywordNode
	| CssSyntaxAtKeywordNode
	| CssSyntaxFunctionNode
	| CssSyntaxStringNode
	| CssSyntaxTokenNode
	| CssSyntaxCommaNode
	| CssSyntaxRangeNode;

export type CssSyntaxGroupNode = {
	type: "Group";
	terms: CssSyntaxAst[];
	combinator: string;
	disallowEmpty: boolean;
	explicit: boolean;
};

export type CssSyntaxMultiplierNode = {
	type: "Multiplier";
	comma: boolean;
	min: number;
	max: number;
	term: CssSyntaxAst;
};

export type CssSyntaxBooleanNode = {
	type: "Boolean";
	term: CssSyntaxAst;
};

export type CssSyntaxTypeNode = {
	type: "Type";
	name: string;
	opts: CssSyntaxRangeNode | null;
};

export type CssSyntaxPropertyNode = {
	type: "Property";
	name: string;
};

export type CssSyntaxKeywordNode = {
	type: "Keyword";
	name: string;
};

export type CssSyntaxAtKeywordNode = {
	type: "AtKeyword";
	name: string;
};

export type CssSyntaxFunctionNode = {
	type: "Function";
	name: string;
};

export type CssSyntaxStringNode = {
	type: "String";
	value: string;
};

export type CssSyntaxTokenNode = {
	type: "Token";
	value: string;
};

export type CssSyntaxCommaNode = {
	type: "Comma";
};

export type CssSyntaxRangeNode = {
	type: "Range";
	min: number | null;
	max: number | null;
};

export function parseCssSyntax(propertySyntax: string): CssSyntaxAst {
	return cssTree.definitionSyntax.parse(propertySyntax) as CssSyntaxAst;
}

export function parseShorthandArities(propertySyntax: CssSyntaxAst): number[] {
	const arities = new Set<number>();
	visitCssSyntaxAst(propertySyntax, (node) => {
		if (node.type !== "Multiplier") {
			return;
		}

		if (node.max === 0) {
			if (node.min > 0) {
				arities.add(node.min);
			}

			return;
		}

		for (let arity = node.min; arity <= node.max; arity += 1) {
			if (arity > 0) {
				arities.add(arity);
			}
		}
	});

	return arities.size > 0 ? [...arities].sort((left, right) => left - right) : [1];
}

export function syntaxIncludesType(syntaxAst: CssSyntaxAst, typeName: string): boolean {
	let matched = false;
	const loweredTypeName = typeName.toLowerCase();

	visitCssSyntaxAst(syntaxAst, (node) => {
		if (node.type === "Type" && node.name.toLowerCase().includes(loweredTypeName)) {
			matched = true;
		}
	});

	return matched;
}

export function visitCssSyntaxAst(node: CssSyntaxAst, visit: (node: CssSyntaxAst) => void): void {
	cssTree.definitionSyntax.walk(node, (currentNode: DefinitionSyntaxNode) => {
		visit(currentNode as CssSyntaxAst);
	});
}
