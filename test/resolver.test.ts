import assert from "node:assert/strict";
import test from "node:test";

import { createStandardPropertySamplingRule, generateExactCases } from "./lib/exactCssCaseGenerator.js";

type CssHintInstruction = {
	propertyName: string;
	label: string;
	kind: "Parameter" | "BlockEnd";
	strategy: "inline-right" | "block-end-right";
	tokenCount: number;
	range: {
		start: { line: number; character: number };
		end: { line: number; character: number };
	};
};

type CssHintResolver = {
	resolveInline(
		instructions: readonly CssHintInstruction[],
	): Array<{ position: CssHintInstruction["range"]["end"]; label: string; kind?: 2; paddingLeft?: boolean }>;
	resolveBlockEnd(
		instructions: readonly CssHintInstruction[],
	): Array<{ position: CssHintInstruction["range"]["end"]; label: string; kind?: 2; paddingLeft?: boolean }>;
};

function createCssHintResolver(): CssHintResolver {
	const module = require("../src/resolver.js") as {
		createCssHintResolver: () => CssHintResolver;
	};

	return module.createCssHintResolver();
}

function createInstruction(
	propertyName: string,
	strategy: CssHintInstruction["strategy"],
	tokenCount: number,
): CssHintInstruction {
	return {
		propertyName,
		label: `${propertyName}-${tokenCount}-values`,
		kind: strategy === "inline-right" ? "Parameter" : "BlockEnd",
		strategy,
		tokenCount,
		range: {
			start: { line: 1, character: 2 },
			end: { line: 1, character: 14 },
		},
	};
}

test("resolver uses declaration end for inline hints", () => {
	const resolver = createCssHintResolver();
	const rule = createStandardPropertySamplingRule("margin");
	const generatedCase = generateExactCases(rule).find(
		(candidateCase) =>
			candidateCase.valueAtoms.length === 1 && !candidateCase.valueAtoms.some((atom) => atom.kind === "global"),
	);

	assert.ok(generatedCase);

	const hint = resolver.resolveInline([
		createInstruction(rule.propertyName, "inline-right", generatedCase.valueAtoms.length),
	])[0];

	assert.equal(hint.label, "margin-1-values");
	assert.equal(hint.kind, "Parameter");
	assert.deepEqual(hint.position, { line: 1, character: 14 });
});

test("resolver ignores block-end hints for now", () => {
	const resolver = createCssHintResolver();

	const hints = resolver.resolveBlockEnd([createInstruction("padding", "block-end-right", 2)]);

	assert.deepEqual(hints, []);
});
