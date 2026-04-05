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
	shape?: { family: "grid-line" };
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
		label: `hint-${tokenCount}`,
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
		["hint-2", "hint-2"],
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

test("resolver rejects duplicate labels on the same line", () => {
	const resolver = createCssHintResolver();
	const document = TextDocument.create("untitled://resolver.css", "css", 1, "padding: value1 value2;");
	const duplicateInstruction = {
		...createInstruction("padding", "inline-right", 2),
		label: "left, left",
	};

	assert.throws(() => resolver.resolveInline(document, [duplicateInstruction]), /Duplicate label detected/);
});

test("resolver allows duplicate labels when explicit label slots are present", () => {
	const resolver = createCssHintResolver();
	const document = TextDocument.create("untitled://resolver.css", "css", 1, "padding: value1 value2;");
	const duplicateInstruction = {
		...createInstruction("padding", "inline-right", 2),
		label: "edge, edge",
		labelSlots: ["edge", "edge"],
	};

	const hints = resolver.resolveInline(document, [duplicateInstruction]);

	assert.equal(hints.length, 2);
	assert.deepEqual(
		hints.map((hint) => hint.label),
		["edge", "edge"],
	);
});

test("resolver allows duplicate labels for grid-line shapes", () => {
	const resolver = createCssHintResolver();
	const document = TextDocument.create("untitled://resolver.css", "css", 1, "grid-column: 1 1;");
	const gridLineInstruction = {
		...createInstruction("grid-column", "inline-right", 2),
		shape: { family: "grid-line" as const },
		label: "line, line",
	};

	const hints = resolver.resolveInline(document, [gridLineInstruction]);

	assert.equal(hints.length, 2);
	assert.deepEqual(
		hints.map((hint) => hint.label),
		["line", "line"],
	);
});

test("resolver places border-spacing hints on horizontal and vertical values", () => {
	const resolver = createCssHintResolver();
	const css = "a { border-spacing: 1cm 2em; }";
	const document = TextDocument.create("untitled://resolver.css", "css", 1, css);
	const instruction = {
		...createInstruction("border-spacing", "inline-right", 2),
		valueText: "1cm 2em",
		range: {
			start: { line: 0, character: css.indexOf("1cm") },
			end: { line: 0, character: css.indexOf(";") },
		},
		valueRange: {
			start: { line: 0, character: css.indexOf("1cm") },
			end: { line: 0, character: css.indexOf(";") },
		},
		label: "horizontal, vertical",
	};

	const hints = resolver.resolveInline(document, [instruction]);

	assert.equal(hints.length, 2);
	assert.deepEqual(
		hints.map((hint) => hint.label),
		["horizontal", "vertical"],
	);
	assert.deepEqual(
		hints.map((hint) => hint.position),
		[document.positionAt(css.indexOf("1cm")), document.positionAt(css.indexOf("2em"))],
	);
});

test("resolver places grid-template hints on semantic track boundaries", () => {
	const resolver = createCssHintResolver();
	const css = "a { grid-template: [line-name] 100px / [column-name1] 30% [column-name2] 70%; }";
	const document = TextDocument.create("untitled://resolver.css", "css", 1, css);
	const gridTemplateInstruction = {
		...createInstruction("grid-template", "inline-right", 2),
		valueText: "[line-name] 100px / [column-name1] 30% [column-name2] 70%",
		range: {
			start: { line: 0, character: css.indexOf("[line-name]") },
			end: { line: 0, character: css.indexOf(";") },
		},
		valueRange: {
			start: { line: 0, character: css.indexOf("[line-name]") },
			end: { line: 0, character: css.indexOf(";") },
		},
		label: "rows, columns",
	};

	const hints = resolver.resolveInline(document, [gridTemplateInstruction]);

	assert.equal(hints.length, 2);
	assert.deepEqual(
		hints.map((hint) => hint.label),
		["rows", "columns"],
	);
	assert.deepEqual(
		hints.map((hint) => hint.position),
		[document.positionAt(css.indexOf("100px")), document.positionAt(css.indexOf("30%"))],
	);
});

test("resolver places mask hints on concrete position and size tokens", () => {
	const resolver = createCssHintResolver();
	const css = 'a { mask: url("masks.svg#star") 40px 20px/50px 50px; }';
	const document = TextDocument.create("untitled://resolver.css", "css", 1, css);
	const maskInstruction = {
		...createInstruction("mask", "inline-right", 5),
		valueText: 'url("masks.svg#star") 40px 20px/50px 50px',
		range: {
			start: { line: 0, character: css.indexOf('url("masks.svg#star")') },
			end: { line: 0, character: css.indexOf(";") },
		},
		valueRange: {
			start: { line: 0, character: css.indexOf('url("masks.svg#star")') },
			end: { line: 0, character: css.indexOf(";") },
		},
		label: "image, top, left, width, height",
	};

	const hints = resolver.resolveInline(document, [maskInstruction]);

	assert.equal(hints.length, 5);
	assert.deepEqual(
		hints.map((hint) => hint.label),
		["image", "top", "left", "width", "height"],
	);
	assert.deepEqual(
		hints.map((hint) => hint.position),
		[
			document.positionAt(css.indexOf('url("masks.svg#star")')),
			document.positionAt(css.indexOf("40px")),
			document.positionAt(css.indexOf("20px")),
			document.positionAt(css.indexOf("50px")),
			document.positionAt(css.lastIndexOf("50px")),
		],
	);
});

test("resolver skips fill while placing mask-border-slice hints", () => {
	const resolver = createCssHintResolver();
	const css = "a { mask-border-slice: 10% fill 7 12; }";
	const document = TextDocument.create("untitled://resolver.css", "css", 1, css);
	const maskBorderSliceInstruction = {
		...createInstruction("mask-border-slice", "inline-right", 4),
		valueText: "10% fill 7 12",
		range: {
			start: { line: 0, character: css.indexOf("10%") },
			end: { line: 0, character: css.indexOf(";") },
		},
		valueRange: {
			start: { line: 0, character: css.indexOf("10%") },
			end: { line: 0, character: css.indexOf(";") },
		},
		label: "top, left/right, bottom",
		labelSlots: ["top", "", "left/right", "bottom"],
	};

	const hints = resolver.resolveInline(document, [maskBorderSliceInstruction]);

	assert.equal(hints.length, 3);
	assert.deepEqual(
		hints.map((hint) => hint.label),
		["top", "left/right", "bottom"],
	);
	assert.deepEqual(
		hints.map((hint) => hint.position),
		[
			document.positionAt(css.indexOf("10%")),
			document.positionAt(css.indexOf("7")),
			document.positionAt(css.lastIndexOf("12")),
		],
	);
});

test("resolver places corner-shape hints on the correct tokens", () => {
	const resolver = createCssHintResolver();
	const css = "a { corner-right-shape: bevel notch; }";
	const document = TextDocument.create("untitled://resolver.css", "css", 1, css);
	const instruction = {
		...createInstruction("corner-right-shape", "inline-right", 2),
		valueText: "bevel notch",
		range: {
			start: { line: 0, character: css.indexOf("bevel") },
			end: { line: 0, character: css.indexOf(";") },
		},
		valueRange: {
			start: { line: 0, character: css.indexOf("bevel") },
			end: { line: 0, character: css.indexOf(";") },
		},
		label: "top, bottom",
	};

	const hints = resolver.resolveInline(document, [instruction]);

	assert.equal(hints.length, 2);
	assert.deepEqual(
		hints.map((hint) => hint.label),
		["top", "bottom"],
	);
	assert.deepEqual(
		hints.map((hint) => hint.position),
		[document.positionAt(css.indexOf("bevel")), document.positionAt(css.indexOf("notch"))],
	);
});

test("resolver rejects forbidden global labels", () => {
	const resolver = createCssHintResolver();
	const document = TextDocument.create("untitled://resolver.css", "css", 1, "padding: value1;");
	const globalInstruction = {
		...createInstruction("margin", "inline-right", 1),
		label: "global",
	};

	assert.throws(() => resolver.resolveInline(document, [globalInstruction]), /Forbidden label "global"/);
});

test("resolver rejects property-name prefix labels for grid-column-end", () => {
	const resolver = createCssHintResolver();
	const document = TextDocument.create("untitled://resolver.css", "css", 1, "grid-column-end: 1;");
	const prefixInstruction = {
		...createInstruction("grid-column-end", "inline-right", 1),
		label: "grid-column-end-1-values",
	};

	assert.throws(() => resolver.resolveInline(document, [prefixInstruction]), /Forbidden label echo/);
});
