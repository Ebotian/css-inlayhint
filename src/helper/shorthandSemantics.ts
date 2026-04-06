import type { TextDocument } from "vscode-css-languageservice";

import type { CssHintInstruction } from "../collector.js";
import type { CssHintResolvedInstruction } from "../constructor.js";
import { createAnimationSemanticSpecs } from "./familys/animation.js";
import { createBackgroundSemanticSpecs } from "./familys/background.js";
import { createGridSemanticSpecs } from "./familys/grid.js";
import { createMaskSemanticSpecs } from "./familys/mask.js";
import type { ShorthandSemanticSpec } from "./familys/shared.js";

const SHORTHAND_SEMANTIC_SPECS: readonly ShorthandSemanticSpec[] = [
	...createBackgroundSemanticSpecs(),
	...createAnimationSemanticSpecs(),
	...createMaskSemanticSpecs(),
	...createGridSemanticSpecs(),
];

export function inferShorthandSemanticLabelParts(
	propertyName: string,
	valueText: string | undefined,
	tokenCount: number,
): string[] | null {
	const spec = findShorthandSemanticSpec(propertyName);
	return spec?.getLabelParts?.(valueText, tokenCount) ?? null;
}

export function buildShorthandSemanticLabelSlots(
	propertyName: string,
	valueText: string,
	labelParts: readonly string[],
): string[] | null {
	const spec = findShorthandSemanticSpec(propertyName);
	return spec?.getLabelSlots?.(valueText, labelParts) ?? null;
}

export function resolveShorthandSemanticHints(
	propertyName: string,
	document: TextDocument,
	instruction: CssHintInstruction,
	tokenMatches: ReadonlyArray<{ text: string; index: number }>,
	labelParts: readonly string[],
): CssHintResolvedInstruction[] | null {
	const spec = findShorthandSemanticSpec(propertyName);
	return spec?.resolveHints?.(document, instruction, tokenMatches, labelParts) ?? null;
}

export function hasShorthandSemanticSpec(propertyName: string): boolean {
	return findShorthandSemanticSpec(propertyName) !== null;
}

function findShorthandSemanticSpec(propertyName: string): ShorthandSemanticSpec | null {
	return SHORTHAND_SEMANTIC_SPECS.find((spec) => spec.propertyNames.includes(propertyName)) ?? null;
}
