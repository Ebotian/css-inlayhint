import assert from "node:assert/strict";
import test from "node:test";

import { getDirectionalFamily, getShorthandExpansion, getShorthandLabelParts } from "../../src/helper/calculation.js";
import { tokenizeShorthandValueText } from "../../src/helper/classifyNormalize.js";

test("calculation preserves shorthand expansion and label inference", () => {
	assert.deepEqual(getShorthandExpansion("text-decoration"), [
		"text-decoration-line",
		"text-decoration-style",
		"text-decoration-color",
	]);
	assert.deepEqual(getShorthandLabelParts("text-decoration", 1, "underline"), ["line"]);
	assert.deepEqual(getShorthandLabelParts("offset-rotate", 2, "auto 90deg"), ["direction", "angle"]);
	assert.deepEqual(getShorthandLabelParts("background-position", 2, "25% 75%"), ["horizontal", "vertical"]);
	assert.deepEqual(getShorthandLabelParts("background-position", 4, "bottom 10px right 20px"), [
		"vertical",
		"length",
		"horizontal",
		"length",
	]);
	assert.deepEqual(getShorthandLabelParts("background-position", 1, "center"), ["middle"]);
	assert.deepEqual(getDirectionalFamily("margin"), ["top", "right", "bottom", "left"]);
	assert.deepEqual(tokenizeShorthandValueText("calc(10% + 20px) bottom 10px"), ["calc(10% + 20px)", "bottom", "10px"]);
});
