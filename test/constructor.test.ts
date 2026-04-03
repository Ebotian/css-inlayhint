import assert from "node:assert/strict";
import test from "node:test";

type CssHintResolvedInstruction = {
	propertyName: string;
	label: string;
	kind: "Parameter" | "BlockEnd";
	strategy: "inline-right" | "block-end-right";
	tokenCount: number;
	position: { line: number; character: number };
};

type CssHintConstructor = {
	construct(instructions: readonly CssHintResolvedInstruction[]): Array<{
		position: CssHintResolvedInstruction["position"];
		label: string;
		kind?: 2;
		paddingLeft?: boolean;
		paddingRight?: boolean;
	}>;
};

function createCssHintConstructor(): CssHintConstructor {
	const module = require("../src/constructor.js") as {
		createCssHintConstructor: () => CssHintConstructor;
	};

	return module.createCssHintConstructor();
}

test("constructor builds inline hints from resolved placements", () => {
	const constructor = createCssHintConstructor();
	const hints = constructor.construct([
		{
			propertyName: "margin",
			label: "all",
			kind: "Parameter",
			strategy: "inline-right",
			tokenCount: 1,
			position: { line: 1, character: 14 },
		},
	]);

	assert.equal(hints.length, 1);
	assert.deepEqual(hints[0], {
		position: { line: 1, character: 14 },
		label: "all",
		kind: 2,
		paddingLeft: true,
	});
});

test("constructor ignores block-end placements for now", () => {
	const constructor = createCssHintConstructor();
	const hints = constructor.construct([
		{
			propertyName: "padding",
			label: "top/bottom, right/left",
			kind: "BlockEnd",
			strategy: "block-end-right",
			tokenCount: 2,
			position: { line: 3, character: 0 },
		},
	]);

	assert.deepEqual(hints, []);
});
