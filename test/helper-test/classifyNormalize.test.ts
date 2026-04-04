import assert from "node:assert/strict";
import test from "node:test";

import {
	compactShorthandLabels,
	getCommonPrefix,
	normalizeShorthandMemberLabel,
	normalizeSyntaxKeywordLabel,
	normalizeSyntaxTypeLabel,
	shouldCompactShorthandLabels,
	tokenizeShorthandValueText,
} from "../../src/helper/classifyNormalize.js";

test("classifyNormalize tokenizes and normalizes shorthand labels", () => {
	assert.deepEqual(tokenizeShorthandValueText("underline red"), ["underline", "red"]);
	assert.equal(normalizeSyntaxTypeLabel("<length-percentage>"), "length");
	assert.equal(normalizeSyntaxKeywordLabel("AUTO"), "auto");
	assert.equal(
		normalizeShorthandMemberLabel("text-decoration-line", ["text-decoration-line", "text-decoration-style"]),
		"line",
	);
	assert.equal(getCommonPrefix(["border-block-start", "border-block-end"]), "border-block-");
	assert.equal(shouldCompactShorthandLabels(["top", "right", "bottom", "left"]), true);
	assert.deepEqual(compactShorthandLabels(["top", "right", "bottom", "left"]), ["top", "right", "bottom", "left"]);
});
