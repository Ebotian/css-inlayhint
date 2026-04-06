import type { CssHintInstruction } from "./collector";
import { mapBasicLabel, mapGridLineLabelSlots } from "./helper/familys/basic.js";
import {
	assertNoGlobalLabels,
	assertNoDuplicateLabels,
	assertNoPropertyNameEchoLabels,
	assertNoValueEchoLabels,
} from "./helper/index.js";
import { compactShorthandLabels, shouldCompactShorthandLabels } from "./helper/classifyNormalize.js";
import { buildShorthandSemanticLabelSlots } from "./helper/shorthandSemantics.js";
import { isCornerShapeProperty } from "./helper/structuredShorthand.js";
import { getShorthandLabelParts } from "./propertySyntax.js";

export type CssHintMapper = {
	map(instructions: readonly CssHintInstruction[]): CssHintInstruction[];
};

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
		const labelSlots = mapGridLineLabelSlots(instruction.valueText);
		if (labelSlots) {
			return {
				...instruction,
				label: labelSlots.filter(Boolean).join(", ") || instruction.label,
				labelSlots,
			};
		}
	}

	const basicLabel = mapBasicLabel(instruction);
	if (basicLabel) {
		return { ...instruction, label: basicLabel };
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

	const semanticLabelSlots = buildShorthandSemanticLabelSlots(
		instruction.propertyName,
		instruction.valueText,
		labelParts,
	);
	if (semanticLabelSlots) {
		return { ...instruction, label: mappedLabel, labelSlots: semanticLabelSlots };
	}

	return {
		...instruction,
		label: mappedLabel,
		labelSlots: labelParts,
	};
}

function mapShorthandLabel(propertyName: string, tokenCount: number, valueText?: string): string | null {
	const shorthandLabelParts = getShorthandLabelParts(propertyName, tokenCount, valueText);
	if (!shorthandLabelParts) {
		return null;
	}

	const semanticLabelSlotsFromRaw = buildShorthandSemanticLabelSlots(
		propertyName,
		valueText ?? "",
		shorthandLabelParts,
	);
	const normalizedLabelParts = isCornerShapeProperty(propertyName)
		? [...shorthandLabelParts]
		: semanticLabelSlotsFromRaw || shorthandLabelParts.length <= 1
			? [...shorthandLabelParts]
			: shouldCompactShorthandLabels(shorthandLabelParts)
				? compactShorthandLabels(shorthandLabelParts)
				: [...shorthandLabelParts];
	const semanticLabelSlots =
		semanticLabelSlotsFromRaw ??
		(normalizedLabelParts.length > 1
			? buildShorthandSemanticLabelSlots(propertyName, valueText ?? "", normalizedLabelParts)
			: null);

	assertNoGlobalLabels(propertyName, normalizedLabelParts);
	assertNoPropertyNameEchoLabels(propertyName, normalizedLabelParts);
	assertNoValueEchoLabels(propertyName, valueText, normalizedLabelParts);
	assertNoDuplicateLabels(propertyName, normalizedLabelParts, Boolean(semanticLabelSlots));

	return normalizedLabelParts.join(", ");
}
