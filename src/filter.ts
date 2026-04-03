import type { CssHintInstruction } from "./collector";

export type CssHintFilter = {
	filter(instructions: readonly CssHintInstruction[]): CssHintInstruction[];
};

export function createCssHintFilter(): CssHintFilter {
	return {
		filter(instructions: readonly CssHintInstruction[]): CssHintInstruction[] {
			const uniqueInstructions = dedupeInstructions(instructions);
			return [...uniqueInstructions].sort(compareInstructions);
		},
	};
}

function dedupeInstructions(instructions: readonly CssHintInstruction[]): CssHintInstruction[] {
	const seen = new Set<string>();
	const uniqueInstructions: CssHintInstruction[] = [];

	for (const instruction of instructions) {
		const fingerprint = fingerprintInstruction(instruction);
		if (seen.has(fingerprint)) {
			continue;
		}
		seen.add(fingerprint);
		uniqueInstructions.push(instruction);
	}

	return uniqueInstructions;
}

function fingerprintInstruction(instruction: CssHintInstruction): string {
	return [
		instruction.propertyName,
		instruction.label,
		instruction.kind,
		instruction.strategy,
		instruction.tokenCount,
		instruction.range.start.line,
		instruction.range.start.character,
		instruction.range.end.line,
		instruction.range.end.character,
	].join("|");
}

function compareInstructions(left: CssHintInstruction, right: CssHintInstruction): number {
	const leftStart = left.range.start;
	const rightStart = right.range.start;
	if (leftStart.line !== rightStart.line) {
		return leftStart.line - rightStart.line;
	}
	if (leftStart.character !== rightStart.character) {
		return leftStart.character - rightStart.character;
	}
	if (left.propertyName !== right.propertyName) {
		return left.propertyName.localeCompare(right.propertyName);
	}
	if (left.label !== right.label) {
		return left.label.localeCompare(right.label);
	}
	if (left.kind !== right.kind) {
		return left.kind.localeCompare(right.kind);
	}
	if (left.strategy !== right.strategy) {
		return left.strategy.localeCompare(right.strategy);
	}
	return left.tokenCount - right.tokenCount;
}
