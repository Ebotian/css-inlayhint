import assert from "node:assert/strict";
import test from "node:test";

import type { CssHintInstruction } from "../src/collector.js";

type CssHintRouter = {
	route<TResult>(
		instructions: readonly CssHintInstruction[],
		handlers: {
			inline(instructions: readonly CssHintInstruction[]): TResult[];
			blockEnd(instructions: readonly CssHintInstruction[]): TResult[];
		},
	): TResult[];
};

function createCssHintRouter(): CssHintRouter {
	const module = require("../src/router.js") as {
		createCssHintRouter: () => CssHintRouter;
	};

	return module.createCssHintRouter();
}

function createInstruction(
	propertyName: string,
	strategy: CssHintInstruction["strategy"],
	tokenCount: number,
): CssHintInstruction {
	return {
		propertyName,
		label: `${propertyName}-${tokenCount}-values`,
		kind: "Parameter",
		strategy,
		tokenCount,
		valueText: Array.from({ length: tokenCount }, (_, index) => `value${index + 1}`).join(" "),
		range: {
			start: { line: tokenCount, character: 0 },
			end: { line: tokenCount, character: 1 },
		},
		valueRange: {
			start: { line: tokenCount, character: 0 },
			end: { line: tokenCount, character: 1 },
		},
	};
}

test("router dispatches instructions by strategy", () => {
	const router = createCssHintRouter();
	const instructions = [
		createInstruction("margin", "inline-right", 1),
		createInstruction("padding", "block-end-right", 2),
		createInstruction("border-width", "inline-right", 3),
	];
	const calls: string[] = [];

	const result = router.route(instructions, {
		inline(items) {
			calls.push(`inline:${items.map((item) => item.propertyName).join(",")}`);
			return items.map((item) => `inline:${item.propertyName}`);
		},
		blockEnd(items) {
			calls.push(`blockEnd:${items.map((item) => item.propertyName).join(",")}`);
			return items.map((item) => `blockEnd:${item.propertyName}`);
		},
	});

	assert.deepEqual(calls, ["inline:margin,border-width", "blockEnd:padding"]);
	assert.deepEqual(result, ["inline:margin", "inline:border-width", "blockEnd:padding"]);
});
