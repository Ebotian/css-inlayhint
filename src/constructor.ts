import type { InlayHint } from "vscode-languageserver";
import type { Position } from "vscode-languageserver";

import type { CssHintInstruction } from "./collector";

export type CssHintResolvedInstruction = CssHintInstruction & {
	position: Position;
};

export type CssHintConstructor = {
	construct(instructions: readonly CssHintResolvedInstruction[]): InlayHint[];
};

export function createCssHintConstructor(): CssHintConstructor {
	return {
		construct(instructions: readonly CssHintResolvedInstruction[]): InlayHint[] {
			return instructions.flatMap(constructHint);
		},
	};
}

function constructHint(instruction: CssHintResolvedInstruction): InlayHint[] {
	if (instruction.kind !== "Parameter" || instruction.strategy !== "inline-right") {
		return [];
	}

	if (!instruction.label.trim()) {
		return [];
	}

	return [
		{
			position: instruction.position,
			label: `${instruction.label}:`,
			kind: 2,
			paddingLeft: false,
			paddingRight: true,
		},
	];
}
