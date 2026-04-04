import assert from "node:assert/strict";
import test from "node:test";

import { getDirectionalFamily, getShorthandExpansion, getShorthandLabelParts } from "../../src/helper/calculation.js";

test("calculation preserves shorthand expansion and label inference", () => {
	assert.deepEqual(getShorthandExpansion("text-decoration"), [
		"text-decoration-line",
		"text-decoration-style",
		"text-decoration-color",
	]);
	assert.deepEqual(getShorthandLabelParts("text-decoration", 1, "underline"), ["line"]);
	assert.deepEqual(getShorthandLabelParts("offset-rotate", 2, "auto 90deg"), ["direction", "angle"]);
	assert.deepEqual(getDirectionalFamily("margin"), ["top", "right", "bottom", "left"]);
});
