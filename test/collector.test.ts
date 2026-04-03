import assert from "node:assert/strict";
import test from "node:test";

import { DEFAULT_PROPERTY_SAMPLING_RULES, renderCssDeclaration } from "./lib/exactCssCaseGenerator.js";

type CssHintInstruction = {
	propertyName: string;
	label: string;
	kind: "Parameter" | "BlockEnd";
	strategy: "inline-right" | "block-end-right";
	range: {
		start: { line: number; character: number };
		end: { line: number; character: number };
	};
};

type CssHintCollector = {
	collect(sourceText: string): CssHintInstruction[];
};

function createCssHintCollector(): CssHintCollector {
	const module = require("../src/collector.js") as {
		createCssHintCollector: () => CssHintCollector;
	};

	return module.createCssHintCollector();
}

test("collector turns semantic candidates into classified instructions", () => {
	const collector = createCssHintCollector();
	const rule = DEFAULT_PROPERTY_SAMPLING_RULES.find((candidateRule) => candidateRule.arities.includes(2));

	assert.ok(rule);

	const sourceText = renderCssDeclaration(rule.propertyName, rule.valueAtoms.slice(0, 2));
	const instructions = collector.collect(sourceText);

	assert.equal(instructions.length, 1);
	assert.equal(instructions[0].propertyName, rule.propertyName);
	assert.equal(instructions[0].kind, "Parameter");
	assert.equal(instructions[0].strategy, "inline-right");
	assert.equal(instructions[0].label, `${rule.propertyName}-2-values`);
	assert.ok(instructions[0].range.start.line >= 0);
});

test("collector drops suppressed global declarations", () => {
	const collector = createCssHintCollector();
	const instructions = collector.collect(".probe { margin: inherit; }");

	assert.equal(instructions.length, 0);
});
