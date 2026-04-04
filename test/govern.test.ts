import assert from "node:assert/strict";
import test from "node:test";

type InlayHint = {
	position: { line: number; character: number };
	label: string;
	kind?: 1 | 2;
	paddingLeft?: boolean;
	paddingRight?: boolean;
};

type CssHintGovernance = {
	govern(
		hints: readonly InlayHint[],
		range: { start: { line: number; character: number }; end: { line: number; character: number } },
	): InlayHint[];
};

function createCssHintGovernance(): CssHintGovernance {
	const module = require("../src/govern.js") as {
		createCssHintGovernance: (options?: { maxLabelLength?: number }) => CssHintGovernance;
	};

	return module.createCssHintGovernance({ maxLabelLength: 8 });
}

test("govern deduplicates sorts filters and truncates final hints", () => {
	const governance = createCssHintGovernance();
	const hints: InlayHint[] = [
		{ position: { line: 2, character: 0 }, label: "very-long-label", kind: 2, paddingLeft: true },
		{ position: { line: 1, character: 4 }, label: "keep", kind: 2, paddingLeft: true },
		{ position: { line: 1, character: 4 }, label: "keep", kind: 2, paddingLeft: true },
		{ position: { line: 3, character: 0 }, label: "drop", kind: 2, paddingLeft: true },
	];
	const range = {
		start: { line: 1, character: 0 },
		end: { line: 2, character: 99 },
	};

	const governed = governance.govern(hints, range);

	assert.equal(governed.length, 2);
	assert.deepEqual(governed[0], { position: { line: 1, character: 4 }, label: "keep", kind: 2, paddingLeft: true });
	assert.deepEqual(governed[1], {
		position: { line: 2, character: 0 },
		label: "very-lon",
		kind: 2,
		paddingLeft: true,
	});
});
