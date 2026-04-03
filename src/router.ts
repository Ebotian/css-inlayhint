import type { CssHintInstruction } from "./collector";

export type CssHintRouterHandlers<TResult> = {
	inline(instructions: readonly CssHintInstruction[]): TResult[];
	blockEnd(instructions: readonly CssHintInstruction[]): TResult[];
};

export type CssHintRouter = {
	route<TResult>(instructions: readonly CssHintInstruction[], handlers: CssHintRouterHandlers<TResult>): TResult[];
};

export function createCssHintRouter(): CssHintRouter {
	return {
		route<TResult>(instructions: readonly CssHintInstruction[], handlers: CssHintRouterHandlers<TResult>): TResult[] {
			const inlineInstructions: CssHintInstruction[] = [];
			const blockEndInstructions: CssHintInstruction[] = [];

			for (const instruction of instructions) {
				switch (instruction.strategy) {
					case "inline-right":
						inlineInstructions.push(instruction);
						break;
					case "block-end-right":
						blockEndInstructions.push(instruction);
						break;
				}
			}

			return [...handlers.inline(inlineInstructions), ...handlers.blockEnd(blockEndInstructions)];
		},
	};
}
