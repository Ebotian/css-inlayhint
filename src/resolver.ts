import type { TextDocument } from "vscode-css-languageservice";

import type { CssHintInstruction } from "./collector";
import type { CssHintResolvedInstruction } from "./constructor";
import { assertNoGlobalLabels, assertNoPropertyNameEchoLabels } from "./helper/labelValidation.js";

export type CssHintResolver = {
	resolveInline(document: TextDocument, instructions: readonly CssHintInstruction[]): CssHintResolvedInstruction[];
	resolveBlockEnd(document: TextDocument, instructions: readonly CssHintInstruction[]): CssHintResolvedInstruction[];
};

export function createCssHintResolver(): CssHintResolver {
	return {
		resolveInline(document: TextDocument, instructions: readonly CssHintInstruction[]): CssHintResolvedInstruction[] {
			return instructions.flatMap((instruction) => resolveInlineInstruction(document, instruction));
		},
		resolveBlockEnd(
			_document: TextDocument,
			_instructions: readonly CssHintInstruction[],
		): CssHintResolvedInstruction[] {
			return [];
		},
	};
}

function resolveInlineInstruction(
	document: TextDocument,
	instruction: CssHintInstruction,
): CssHintResolvedInstruction[] {
	const tokenMatches = [...instruction.valueText.matchAll(/[^\s/]+/g)];
	const labelParts = (instruction.labelSlots ?? instruction.label.split(",")).map((part) => part.trim());
	validateLabelParts(instruction.propertyName, labelParts, instruction.shape?.family === "grid-line");
	const valueStartOffset = document.offsetAt(instruction.valueRange.start);

	const resolvedInstructions: CssHintResolvedInstruction[] = [];
	const hasExplicitLabelSlots = labelParts.length > 1;

	for (const [index, match] of tokenMatches.entries()) {
		const label = hasExplicitLabelSlots ? (labelParts[index] ?? "") : (labelParts[0] ?? instruction.label);

		resolvedInstructions.push({
			...instruction,
			label,
			position: document.positionAt(valueStartOffset + (match.index ?? 0)),
		});
	}

	return resolvedInstructions;
}

function validateLabelParts(propertyName: string, labelParts: readonly string[], allowDuplicateLabels: boolean): void {
	assertNoGlobalLabels(propertyName, labelParts);
	assertNoPropertyNameEchoLabels(propertyName, labelParts);

	const compactLabelParts = labelParts.filter((part) => part.length > 0);
	if (!allowDuplicateLabels && new Set(compactLabelParts).size !== compactLabelParts.length) {
		throw new Error(`Duplicate label detected for ${propertyName}: ${compactLabelParts.join(", ")}`);
	}
}
