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
