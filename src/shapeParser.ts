import type { CssHintInstruction } from "./collector";
import { isGridLineProperty } from "./propertySyntax";
import { isBorderRadiusProperty } from "./helper/structuredShorthand.js";

export type CssHintShapeParser = {
	parse(instructions: readonly CssHintInstruction[]): CssHintInstruction[];
};

export type CssHintShape =
	| {
			family: "box-sides";
			tokenCount: number;
	  }
	| {
			family: "box-corners";
			tokenCount: number;
	  }
	| {
			family: "grid-line";
			lineKinds: readonly CssHintGridLineKind[];
	  };

export type CssHintGridLineKind = "auto" | "global" | "custom-ident" | "integer" | "span" | "unknown";

const GRID_AREA_GLOBAL_KEYWORDS = new Set(["inherit", "initial", "unset", "revert", "revert-layer"]);
const BOX_SIDE_PROPERTIES = new Set(["margin", "padding", "border-width", "border-style", "border-color"]);

type ShapeRule = {
	matches(instruction: CssHintInstruction): boolean;
	parse(instruction: CssHintInstruction): CssHintShape | null;
};

type GridLineRule = {
	matches(tokens: readonly string[]): boolean;
	kind: CssHintGridLineKind;
};

const SHAPE_RULES: readonly ShapeRule[] = [
	{
		matches: (instruction) => isBorderRadiusProperty(instruction.propertyName),
		parse: (instruction) => ({ family: "box-corners", tokenCount: instruction.tokenCount }),
	},
	{
		matches: (instruction) => BOX_SIDE_PROPERTIES.has(instruction.propertyName),
		parse: (instruction) => ({ family: "box-sides", tokenCount: instruction.tokenCount }),
	},
	{
		matches: (instruction) => isGridLineProperty(instruction.propertyName),
		parse: (instruction) => {
			const lineKinds = parseGridLineKinds(instruction.valueText);
			return lineKinds.length === 0 ? null : { family: "grid-line", lineKinds };
		},
	},
];

const GRID_LINE_RULES: readonly GridLineRule[] = [
	{
		matches: (tokens) => tokens.length === 1 && tokens[0] === "auto",
		kind: "auto",
	},
	{
		matches: (tokens) => tokens.length === 1 && GRID_AREA_GLOBAL_KEYWORDS.has(tokens[0] ?? ""),
		kind: "global",
	},
	{
		matches: (tokens) => tokens.some((token) => token === "span"),
		kind: "span",
	},
	{
		matches: (tokens) => tokens.length === 1 && isCustomIdent(tokens[0] ?? ""),
		kind: "custom-ident",
	},
	{
		matches: (tokens) => tokens.length >= 1 && isIntegerToken(tokens[0] ?? ""),
		kind: "integer",
	},
];

export function createCssShapeParser(): CssHintShapeParser {
	return {
		parse(instructions: readonly CssHintInstruction[]): CssHintInstruction[] {
			return instructions.map(parseInstruction);
		},
	};
}

function parseInstruction(instruction: CssHintInstruction): CssHintInstruction {
	if (instruction.kind !== "Parameter" || instruction.strategy !== "inline-right") {
		return instruction;
	}

	const shape = parseShape(instruction);
	if (!shape) {
		return instruction;
	}

	return {
		...instruction,
		shape,
	};
}

function parseShape(instruction: CssHintInstruction): CssHintShape | null {
	for (const rule of SHAPE_RULES) {
		if (!rule.matches(instruction)) {
			continue;
		}

		const shape = rule.parse(instruction);
		if (shape) {
			return shape;
		}
	}

	return null;
}

function parseGridLineKinds(valueText: string): readonly CssHintGridLineKind[] {
	return valueText
		.split("/")
		.flatMap((part) => classifyGridLinePart(part.trim()))
		.filter((kind): kind is CssHintGridLineKind => kind !== "unknown");
}

function classifyGridLinePart(text: string): CssHintGridLineKind[] {
	if (!text) {
		return [];
	}

	const kinds: CssHintGridLineKind[] = [];
	for (const token of text.split(/\s+/).filter(Boolean)) {
		const kind = classifyGridLineToken(token);
		if (kind === "unknown") {
			return [];
		}

		kinds.push(kind);
	}

	return kinds;
}

function classifyGridLineToken(token: string): CssHintGridLineKind {
	if (!token) {
		return "unknown";
	}

	for (const rule of GRID_LINE_RULES) {
		if (rule.matches([token])) {
			return rule.kind;
		}
	}

	return "unknown";
}

function isIntegerToken(text: string): boolean {
	return /^[+-]?\d+$/.test(text);
}

function isCustomIdent(text: string): boolean {
	return (
		/^[a-z_][a-z0-9_-]*$/i.test(text) && !GRID_AREA_GLOBAL_KEYWORDS.has(text) && text !== "auto" && text !== "span"
	);
}
