import { createRequire } from "node:module";

import type { CssHintInstruction } from "./collector";
import {
	assertNoGlobalLabels,
	assertNoPropertyNameEchoLabels,
	assertNoValueEchoLabels,
} from "./helper/labelValidation.js";
import { compactShorthandLabels, shouldCompactShorthandLabels } from "./helper/classifyNormalize.js";
import { buildShorthandSemanticLabelSlots } from "./helper/shorthandSemantics.js";
import { isBorderRadiusProperty, isCornerShapeProperty } from "./helper/structuredShorthand.js";
import { getShorthandLabelParts } from "./propertySyntax";

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

	if (instruction.shape?.family === "grid-line") {
		return { ...instruction, label: mapGridAreaLabel(instruction.valueText) };
	}

	if (instruction.shape?.family === "box-sides") {
		const mappedLabel = mapBoxSideLabel(instruction.propertyName, instruction.shape.tokenCount);
		if (mappedLabel) {
			return { ...instruction, label: mappedLabel };
		}
	}

	if (instruction.shape?.family === "box-corners") {
		const mappedLabel = mapCornerLabel(instruction.shape.tokenCount);
		if (mappedLabel) {
			return { ...instruction, label: mappedLabel };
		}
	}

	const mappedLabel = mapShorthandLabel(instruction.propertyName, instruction.tokenCount, instruction.valueText);
	if (mappedLabel === null) {
		return instruction;
	}

	const labelParts = mappedLabel.split(", ").map((part) => part.trim());
	if (labelParts.length <= 1) {
		return {
			...instruction,
			label: mappedLabel,
		};
	}

	const labelSlots = buildShorthandSemanticLabelSlots(instruction.propertyName, instruction.valueText, labelParts);
	if (labelSlots) {
		return { ...instruction, label: mappedLabel, labelSlots };
	}

	return {
		...instruction,
		label: mappedLabel,
		labelSlots: labelParts,
	};
}

function mapShorthandLabel(propertyName: string, tokenCount: number, valueText?: string): string | null {
	if (isBorderRadiusProperty(propertyName)) {
		return mapCornerLabel(tokenCount);
	}

	const directions = getDirectionalFamily(propertyName);
	if (!directions) {
		const shorthandLabelParts = getShorthandLabelParts(propertyName, tokenCount, valueText);
		if (!shorthandLabelParts) {
			return null;
		}

		const normalizedLabelParts = isCornerShapeProperty(propertyName)
			? [...shorthandLabelParts]
			: shouldCompactShorthandLabels(shorthandLabelParts)
				? compactShorthandLabels(shorthandLabelParts)
				: [...shorthandLabelParts];

		assertNoGlobalLabels(propertyName, normalizedLabelParts);
		assertNoPropertyNameEchoLabels(propertyName, normalizedLabelParts);
		assertNoValueEchoLabels(propertyName, valueText, normalizedLabelParts);

		return normalizedLabelParts.join(", ");
	}

	return mapBoxSideLabel(propertyName, tokenCount, directions);
}

function mapBoxSideLabel(
	propertyName: string,
	tokenCount: number,
	directions = getDirectionalFamily(propertyName),
): string | null {
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

function mapGridAreaLabel(valueText: string): string {
	const labels = valueText
		.split("/")
		.flatMap((part) => part.trim().split(/\s+/).filter(Boolean))
		.map((token) => mapGridAreaTokenLabel(token) ?? "");

	return labels.join(", ");
}

function mapGridAreaTokenLabel(token: string): string | null {
	if (token === "auto") {
		return null;
	}

	if (token === "span") {
		return null;
	}

	if (
		token === "inherit" ||
		token === "initial" ||
		token === "unset" ||
		token === "revert" ||
		token === "revert-layer"
	) {
		return null;
	}

	if (/^[+-]?\d+$/.test(token)) {
		return "line";
	}

	if (/^[a-z_][a-z0-9_-]*$/i.test(token)) {
		return "name";
	}

	return null;
}

function mapCornerLabel(tokenCount: number): string | null {
	switch (tokenCount) {
		case 1:
			return "all";
		case 2:
			return `${formatCornerName("top-left")}/${formatCornerName("bottom-right")}, ${formatCornerName("top-right")}/${formatCornerName("bottom-left")}`;
		case 3:
			return `${formatCornerName("top-left")}, ${formatCornerName("top-right")}/${formatCornerName("bottom-left")}, ${formatCornerName("bottom-right")}`;
		case 4:
			return ["top-left", "top-right", "bottom-right", "bottom-left"].map(formatCornerName).join(", ");
		default:
			return null;
	}
}

function formatCornerName(name: string): string {
	const parts = name.split("-");
	if (parts.length !== 2) {
		return name;
	}

	const [prefix, suffix] = parts;
	if (suffix !== "left" && suffix !== "right") {
		return name;
	}

	return `${prefix}-${suffix === "left" ? "L" : "R"}`;
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
	if (orderedDirections.length !== 4) {
		return null;
	}

	if (orderedDirections.some((direction, index) => direction !== DIRECTION_ORDER[index])) {
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
