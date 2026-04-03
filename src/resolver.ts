import type { TextDocument } from "vscode-css-languageservice";

import type { CssHintInstruction } from "./collector";
import type { CssHintResolvedInstruction } from "./constructor";

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
	const tokenMatches = [...instruction.valueText.matchAll(/\S+/g)];
	const labelParts = instruction.label
		.split(",")
		.map((part) => part.trim())
		.filter(Boolean);
	const valueStartOffset = document.offsetAt(instruction.valueRange.start);

	return tokenMatches.map((match, index) => {
		return {
			...instruction,
			label: labelParts[index] ?? instruction.label,
			position: document.positionAt(valueStartOffset + (match.index ?? 0)),
		};
	});
}
