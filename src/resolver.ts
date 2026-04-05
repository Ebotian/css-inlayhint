import type { TextDocument } from "vscode-css-languageservice";

import type { CssHintInstruction } from "./collector";
import type { CssHintResolvedInstruction } from "./constructor";
import { validateLabelParts } from "./helper/labelValidation.js";
import { collectShorthandValueTokens } from "./helper/classifyNormalize.js";
import { resolveShorthandSemanticHints } from "./helper/shorthandSemantics.js";

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
	const tokenMatches = collectShorthandValueTokens(instruction.valueText);
	const labelParts = (instruction.labelSlots ?? instruction.label.split(",")).map((part) => part.trim());
	validateLabelParts(
		instruction.propertyName,
		labelParts,
		instruction.shape?.family === "grid-line" || Boolean(instruction.labelSlots?.length),
	);
	const semanticHints = resolveShorthandSemanticHints(
		instruction.propertyName,
		document,
		instruction,
		tokenMatches,
		labelParts,
	);
	if (semanticHints) {
		return semanticHints;
	}
	const valueStartOffset = document.offsetAt(instruction.valueRange.start);

	const resolvedInstructions: CssHintResolvedInstruction[] = [];
	const hasExplicitLabelSlots = labelParts.length > 1;

	for (const [index, match] of tokenMatches.entries()) {
		const label = hasExplicitLabelSlots ? (labelParts[index] ?? "") : (labelParts[0] ?? instruction.label);
		if (!label) {
			continue;
		}

		resolvedInstructions.push({
			...instruction,
			label,
			position: document.positionAt(valueStartOffset + (match.index ?? 0)),
		});
	}

	return resolvedInstructions;
}
