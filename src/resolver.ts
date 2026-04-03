import type { CssHintInstruction } from "./collector";
import type { CssHintResolvedInstruction } from "./constructor";

export type CssHintResolver = {
	resolveInline(instructions: readonly CssHintInstruction[]): CssHintResolvedInstruction[];
	resolveBlockEnd(instructions: readonly CssHintInstruction[]): CssHintResolvedInstruction[];
};

export function createCssHintResolver(): CssHintResolver {
	return {
		resolveInline(instructions: readonly CssHintInstruction[]): CssHintResolvedInstruction[] {
			return instructions.map(resolveInlineInstruction);
		},
		resolveBlockEnd(): CssHintResolvedInstruction[] {
			return [];
		},
	};
}

function resolveInlineInstruction(instruction: CssHintInstruction): CssHintResolvedInstruction {
	return {
		...instruction,
		position: instruction.range.end,
	};
}
