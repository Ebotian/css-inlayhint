import { createRequire } from "node:module";

import type { CssHintInstruction } from "./collector";

export type CssHintMapper = {
	map(instructions: readonly CssHintInstruction[]): CssHintInstruction[];
};

const nodeRequire = createRequire(__filename);
const shorthandApi = nodeRequire("css-shorthand-properties") as {
	default?: {
		expand?(propertyName: string): string[];
	};
	expand?(propertyName: string): string[];
};

const DIRECTION_ORDER = ["top", "right", "bottom", "left"] as const;

export function createCssHintMapper(): CssHintMapper {
	return {
		map(instructions: readonly CssHintInstruction[]): CssHintInstruction[] {
			return instructions.map(mapInstruction);
		},
	};
}

function mapInstruction(instruction: CssHintInstruction): CssHintInstruction {
	if (instruction.kind !== "Parameter" || instruction.strategy !== "inline-right") {
		return instruction;
	}

	const mappedLabel = mapShorthandLabel(instruction.propertyName, instruction.tokenCount);
	if (!mappedLabel) {
		return instruction;
	}

	return {
		...instruction,
		label: mappedLabel,
	};
}

function mapShorthandLabel(propertyName: string, tokenCount: number): string | null {
	const directions = getDirectionalFamily(propertyName);
	if (!directions) {
		return null;
	}

	switch (tokenCount) {
		case 1:
			return "all";
		case 2:
			return `${directions[0]}/${directions[2]}, ${directions[1]}/${directions[3]}`;
		case 3:
			return `${directions[0]}, ${directions[1]}/${directions[3]}, ${directions[2]}`;
		case 4:
			return directions.join(", ");
		default:
			return null;
	}
}

function getDirectionalFamily(propertyName: string): readonly string[] | null {
	const expanded = shorthandApi?.default?.expand?.(propertyName) ?? shorthandApi.expand?.(propertyName) ?? [];
	if (!Array.isArray(expanded) || expanded.length !== 4) {
		return null;
	}

	const directions = expanded
		.map(extractSingleDirection)
		.filter((direction): direction is DirectionalName => Boolean(direction));
	if (directions.length !== 4) {
		return null;
	}

	const uniqueDirections = new Set(directions);
	if (uniqueDirections.size !== 4) {
		return null;
	}

	const orderedDirections = [...uniqueDirections].sort(
		(left, right) => DIRECTION_ORDER.indexOf(left) - DIRECTION_ORDER.indexOf(right),
	);
	if (
		orderedDirections.length !== 4 ||
		orderedDirections.some((direction, index) => direction !== DIRECTION_ORDER[index])
	) {
		return null;
	}

	return orderedDirections;
}

type DirectionalName = (typeof DIRECTION_ORDER)[number];

function extractSingleDirection(name: string): DirectionalName | null {
	const parts = name.split("-").filter(Boolean);
	const directions = parts.filter((part): part is DirectionalName => DIRECTION_ORDER.includes(part as DirectionalName));
	if (directions.length !== 1) {
		return null;
	}

	return directions[0] ?? null;
}
