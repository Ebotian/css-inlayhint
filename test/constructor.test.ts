import assert from "node:assert/strict";
import test from "node:test";

type CssHintResolvedInstruction = {
	propertyName: string;
	label: string;
	kind: "Parameter" | "BlockEnd";
	strategy: "inline-right" | "block-end-right";
	tokenCount: number;
	position: { line: number; character: number };
	valueRange: {
		start: { line: number; character: number };
		end: { line: number; character: number };
	};
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

test("constructor builds inline hints from resolved token placements", () => {
	const constructor = createCssHintConstructor();
	const hints = constructor.construct([
		{
			propertyName: "margin",
			label: "all",
			kind: "Parameter",
			strategy: "inline-right",
			tokenCount: 1,
			position: { line: 1, character: 14 },
			valueRange: {
				start: { line: 1, character: 14 },
				end: { line: 1, character: 14 },
			},
		},
	]);

	assert.equal(hints.length, 1);
	assert.deepEqual(hints[0], {
		position: { line: 1, character: 14 },
		label: "all:",
		kind: 2,
		paddingLeft: true,
		paddingRight: true,
	});
});

test("constructor preserves separate hints for separate token placements", () => {
	const constructor = createCssHintConstructor();
	const hints = constructor.construct([
		{
			propertyName: "padding",
			label: "top/bottom",
			kind: "Parameter",
			strategy: "inline-right",
			tokenCount: 2,
			position: { line: 1, character: 9 },
			valueRange: {
				start: { line: 1, character: 9 },
				end: { line: 1, character: 9 },
			},
		},
		{
			propertyName: "padding",
			label: "right/left",
			kind: "Parameter",
			strategy: "inline-right",
			tokenCount: 2,
			position: { line: 1, character: 14 },
			valueRange: {
				start: { line: 1, character: 9 },
				end: { line: 1, character: 9 },
			},
		},
	]);

	assert.equal(hints.length, 2);
	assert.deepEqual(hints[0], {
		position: { line: 1, character: 9 },
		label: "top/bottom:",
		kind: 2,
		paddingLeft: true,
		paddingRight: true,
	});
	assert.deepEqual(hints[1], {
		position: { line: 1, character: 14 },
		label: "right/left:",
		kind: 2,
		paddingLeft: true,
		paddingRight: true,
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
			valueRange: {
				start: { line: 3, character: 0 },
				end: { line: 3, character: 0 },
			},
		},
	]);

	assert.deepEqual(hints, []);
});
