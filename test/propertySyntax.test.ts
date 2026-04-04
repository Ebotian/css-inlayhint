import assert from "node:assert/strict";
import test from "node:test";

import {
	getShorthandExpansion,
	getShorthandLabelParts,
	usesCommaSeparatedRepeatableListSyntax,
	usesUnorderedOptionalGroupSyntax,
} from "../src/propertySyntax.js";

test("propertySyntax trims unordered shorthand member prefixes", () => {
	assert.equal(usesUnorderedOptionalGroupSyntax("text-decoration"), true);
	assert.deepEqual(getShorthandExpansion("text-decoration"), [
		"text-decoration-line",
		"text-decoration-style",
		"text-decoration-color",
	]);
	assert.deepEqual(getShorthandLabelParts("text-decoration", 1, "underline"), ["line"]);
	assert.deepEqual(getShorthandLabelParts("text-decoration", 1, "double"), ["style"]);
	assert.deepEqual(getShorthandLabelParts("text-decoration", 1, "red"), ["color"]);
	assert.deepEqual(getShorthandLabelParts("text-decoration", 2, "underline red"), ["line", "color"]);
	assert.ok(
		!getShorthandLabelParts("text-decoration", 1, "underline")?.some((label) => label.includes("text-decoration")),
	);
});

test("propertySyntax keeps repeatable-list detection separate from unordered groups", () => {
	assert.equal(usesCommaSeparatedRepeatableListSyntax("background-position"), true);
	assert.equal(usesCommaSeparatedRepeatableListSyntax("text-decoration"), false);
});

test("propertySyntax infers offset-rotate syntax labels from syntax branches", () => {
	assert.equal(usesUnorderedOptionalGroupSyntax("offset-rotate"), true);
	assert.deepEqual(getShorthandLabelParts("offset-rotate", 1, "auto"), ["direction"]);
	assert.deepEqual(getShorthandLabelParts("offset-rotate", 1, "90deg"), ["angle"]);
	assert.deepEqual(getShorthandLabelParts("offset-rotate", 2, "auto 90deg"), ["direction", "angle"]);
	assert.deepEqual(getShorthandLabelParts("offset-rotate", 2, "90deg auto"), ["angle", "direction"]);
});

test("propertySyntax infers reference-syntax labels from ordered property refs", () => {
	assert.deepEqual(getShorthandLabelParts("animation-range", 1, "cover"), ["start"]);
	assert.deepEqual(getShorthandLabelParts("animation-range", 2, "cover 20%"), ["start", "end"]);
	assert.deepEqual(getShorthandLabelParts("border-bottom-left-radius", 1, "20%"), ["all"]);
	assert.deepEqual(getShorthandLabelParts("border-bottom-left-radius", 2, "20% 10%"), ["horizontal", "vertical"]);
	assert.deepEqual(getShorthandLabelParts("padding-block", 1, "10px"), ["all"]);
	assert.deepEqual(getShorthandLabelParts("padding-block", 2, "10px 20px"), ["start", "end"]);
	assert.deepEqual(getShorthandLabelParts("inset", 1, "10px"), ["all"]);
	assert.deepEqual(getShorthandLabelParts("inset", 2, "4px 8px"), ["top/bottom", "right/left"]);
	assert.deepEqual(getShorthandLabelParts("inset-block", 1, "3px"), ["all"]);
	assert.deepEqual(getShorthandLabelParts("inset-block", 2, "3px 10px"), ["start", "end"]);
	assert.deepEqual(getShorthandLabelParts("inset-inline", 2, "3px 10px"), ["start", "end"]);
	assert.deepEqual(getShorthandLabelParts("scroll-margin", 1, "10px"), ["all"]);
	assert.deepEqual(getShorthandLabelParts("scroll-margin", 2, "4px 8px"), ["top/bottom", "right/left"]);
	assert.deepEqual(getShorthandLabelParts("scroll-margin-block", 1, "3px"), ["all"]);
	assert.deepEqual(getShorthandLabelParts("scroll-margin-block", 2, "3px 10px"), ["start", "end"]);
	assert.deepEqual(getShorthandLabelParts("scroll-margin-inline", 2, "3px 10px"), ["start", "end"]);
	assert.deepEqual(getShorthandLabelParts("columns", 1, "12em"), ["width"]);
	assert.deepEqual(getShorthandLabelParts("columns", 1, "2"), ["count"]);
	assert.deepEqual(getShorthandLabelParts("text-emphasis", 1, "red"), ["color"]);
	assert.deepEqual(getShorthandLabelParts("text-emphasis", 1, "filled"), ["style"]);
});

test("propertySyntax infers text-box branch labels from nested syntax references", () => {
	assert.deepEqual(getShorthandLabelParts("text-box", 1, "normal"), ["normal"]);
	assert.deepEqual(getShorthandLabelParts("text-box", 1, "auto"), ["edge"]);
	assert.deepEqual(getShorthandLabelParts("text-box", 1, "trim-start"), ["trim"]);
	assert.deepEqual(getShorthandLabelParts("text-box", 2, "ideographic text"), ["edge", "edge"]);
});
