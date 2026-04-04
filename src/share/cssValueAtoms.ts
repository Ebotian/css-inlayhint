import { createRequire } from "node:module";

import type { CssSyntaxAst } from "./cssSyntax.js";

type DefinitionSyntaxNode = {
	type: string;
	name?: string;
	value?: string;
};

type DefinitionSyntaxApi = {
	walk(node: unknown, visit: (node: DefinitionSyntaxNode) => void): void;
};

const nodeRequire = createRequire(__filename);
const cssTree = nodeRequire("css-tree") as {
	definitionSyntax: DefinitionSyntaxApi;
};

export type CssValueKind =
	| "keyword"
	| "custom-ident"
	| "integer"
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

export type StandardTextClassifierOptions = {
	allowsColor: boolean;
};

export function classifyStandardText(text: string, options: StandardTextClassifierOptions): CssValueAtom | undefined {
	if (!text || isSyntaxSeparator(text) || text.includes("$") || /\$\d+/.test(text)) {
		return undefined;
	}

	if (text === "auto") {
		return { kind: "auto", text };
	}

	if (isCssWideKeyword(text)) {
		return { kind: "global", text };
	}

	if (/^0(?:[a-z%]+)?$/i.test(text)) {
		if (text === "0") {
			return { kind: "zero", text };
		}

		if (text.endsWith("%")) {
			return { kind: "percent", text };
		}

		return { kind: "length", text };
	}

	if (/^[+-]?\d*\.?\d+%$/.test(text)) {
		return { kind: "percent", text };
	}

	if (/^[+-]?\d*\.?\d+[a-z]+$/i.test(text)) {
		return { kind: "length", text };
	}

	if (/^var\(/i.test(text)) {
		return { kind: "variable", text };
	}

	if (/^calc\(/i.test(text)) {
		return { kind: "calc", text };
	}

	if (options.allowsColor && isColorText(text)) {
		return { kind: "color", text };
	}

	if (/^[a-z][a-z-]*(\s+[a-z][a-z-]*)*$/i.test(text)) {
		return { kind: "keyword", text };
	}

	return undefined;
}

export function extractSyntaxAtoms(
	syntaxAst: CssSyntaxAst,
	options: StandardTextClassifierOptions = { allowsColor: false },
): CssValueAtom[] {
	const atoms: CssValueAtom[] = [];
	cssTree.definitionSyntax.walk(syntaxAst, (node: DefinitionSyntaxNode) => {
		const atom = classifySyntaxNode(node, options);
		if (atom) {
			atoms.push(atom);
		}
	});

	return atoms;
}

export function appendDistinctAtom(atomsByKind: Map<CssValueKind, CssValueAtom[]>, atom: CssValueAtom): void {
	const atoms = atomsByKind.get(atom.kind) ?? [];
	if (atoms.some((existingAtom) => existingAtom.text === atom.text) || atoms.length >= 2) {
		return;
	}

	atoms.push(atom);
	atomsByKind.set(atom.kind, atoms);
}

export function isCssWideKeyword(text: string): boolean {
	return text === "initial" || text === "inherit" || text === "unset" || text === "revert" || text === "revert-layer";
}

function classifySyntaxNode(
	node: DefinitionSyntaxNode,
	options: StandardTextClassifierOptions,
): CssValueAtom | undefined {
	switch (node.type) {
		case "Keyword":
			return classifyStandardText(node.name ?? "", options);
		case "Token":
			return classifyStandardText(node.value ?? "", options);
		case "String":
			return classifyStandardText(node.value ?? "", options);
		case "AtKeyword":
			return classifyStandardText(`@${node.name ?? ""}`, options);
		case "Type":
			return undefined;
		default:
			return undefined;
	}
}

function isSyntaxSeparator(text: string): boolean {
	return (
		text === "/" ||
		text === "," ||
		text === "|" ||
		text === "||" ||
		text === "&&" ||
		text === "#" ||
		text === "?" ||
		text === "+" ||
		text === "*"
	);
}

function isColorText(text: string): boolean {
	return (
		/^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(text) ||
		/^(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color)\(/i.test(text)
	);
}
