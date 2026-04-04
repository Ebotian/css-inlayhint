import assert from "node:assert/strict";
import test from "node:test";

import {
	isReferenceOnlyHintProperty,
	matchesReferencedPropertyToken,
	normalizeReferencedPropertyLabel,
} from "../../src/helper/semanticMap.js";

test("semanticMap resolves explicit property labels", () => {
	assert.equal(normalizeReferencedPropertyLabel("block-size"), "width");
	assert.equal(normalizeReferencedPropertyLabel("border-inline-end-width"), "width");
	assert.equal(normalizeReferencedPropertyLabel("margin-block-end"), "end");
	assert.equal(normalizeReferencedPropertyLabel("column-count"), "count");
	assert.equal(normalizeReferencedPropertyLabel("columns"), null);
	assert.equal(normalizeReferencedPropertyLabel("text-box-trim"), "trim");
	assert.equal(isReferenceOnlyHintProperty("block-size"), true);
	assert.equal(isReferenceOnlyHintProperty("margin-block-end"), false);
	assert.equal(matchesReferencedPropertyToken("text-box-trim", "trim-both"), true);
	assert.equal(matchesReferencedPropertyToken("text-box-edge", "normal"), false);
	assert.equal(matchesReferencedPropertyToken("text-box-edge", "ideographic"), true);
	assert.equal(matchesReferencedPropertyToken("white-space-collapse", "break-spaces"), true);
	assert.equal(matchesReferencedPropertyToken("column-count", "2"), true);
	assert.equal(matchesReferencedPropertyToken("text-emphasis-color", "#f00"), true);
});
