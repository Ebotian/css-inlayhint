import assert from "node:assert/strict";
import test from "node:test";

import { TextDocument } from "vscode-css-languageservice";

type CssHintInstruction = {
	propertyName: string;
	label: string;
	kind: "Parameter" | "BlockEnd";
	strategy: "inline-right" | "block-end-right";
	tokenCount: number;
	valueText: string;
	range: {
		start: { line: number; character: number };
		end: { line: number; character: number };
	};
	valueRange: {
		start: { line: number; character: number };
		end: { line: number; character: number };
	};
};

type CssHintResolver = {
	resolveInline(
		document: TextDocument,
		instructions: readonly CssHintInstruction[],
	): Array<{ position: CssHintInstruction["range"]["end"]; label: string; kind?: 2; paddingLeft?: boolean }>;
	resolveBlockEnd(
		document: TextDocument,
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
		valueText: Array.from({ length: tokenCount }, (_, index) => `value${index + 1}`).join(" "),
		range: {
			start: { line: 0, character: 0 },
			end: { line: 0, character: 15 },
		},
		valueRange: {
			start: { line: 0, character: 9 },
			end: { line: 0, character: 22 },
		},
	};
}

test("resolver uses each token start for inline hints", () => {
	const resolver = createCssHintResolver();
	const document = TextDocument.create("untitled://resolver.css", "css", 1, "padding: value1 value2;");
	const hints = resolver.resolveInline(document, [createInstruction("padding", "inline-right", 2)]);

	assert.equal(hints.length, 2);
	assert.deepEqual(
		hints.map((hint) => hint.label),
		["padding-2-values", "padding-2-values"],
	);
	assert.deepEqual(
		hints.map((hint) => hint.position),
		[
			{ line: 0, character: 9 },
			{ line: 0, character: 16 },
		],
	);
});

test("resolver ignores block-end hints for now", () => {
	const resolver = createCssHintResolver();
	const document = TextDocument.create("untitled://resolver.css", "css", 1, "padding: value1 value2;");

	const hints = resolver.resolveBlockEnd(document, [createInstruction("padding", "block-end-right", 2)]);

	assert.deepEqual(hints, []);
});
