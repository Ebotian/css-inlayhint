import type { CssHintInstruction } from "./collector";

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
			family: "grid-area";
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
		matches: (instruction) => instruction.propertyName === "border-radius",
		parse: (instruction) => ({ family: "box-corners", tokenCount: instruction.tokenCount }),
	},
	{
		matches: (instruction) => BOX_SIDE_PROPERTIES.has(instruction.propertyName),
		parse: (instruction) => ({ family: "box-sides", tokenCount: instruction.tokenCount }),
	},
	{
		matches: (instruction) => instruction.propertyName === "grid-area",
		parse: (instruction) => {
			const lineKinds = parseGridAreaLineKinds(instruction.valueText);
			return lineKinds.length === 0 ? null : { family: "grid-area", lineKinds };
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

function parseGridAreaLineKinds(valueText: string): readonly CssHintGridLineKind[] {
	return valueText
		.split("/")
		.map((part) => classifyGridLine(part.trim()))
		.filter((kind): kind is CssHintGridLineKind => kind !== "unknown");
}

function classifyGridLine(text: string): CssHintGridLineKind {
	if (!text) {
		return "unknown";
	}

	const tokens = text.split(/\s+/).filter(Boolean);
	for (const rule of GRID_LINE_RULES) {
		if (rule.matches(tokens)) {
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
