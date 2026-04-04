import assert from "node:assert/strict";
import test from "node:test";

import {
	isReferenceOnlyHintProperty,
	matchesReferencedPropertyToken,
	normalizeReferencedPropertyLabel,
} from "../../src/helper/semanticMap.js";

test("semanticMap resolves explicit property labels", () => {
	assert.equal(normalizeReferencedPropertyLabel("text-box-trim"), "trim");
	assert.equal(normalizeReferencedPropertyLabel("text-box-edge"), "edge");
	assert.equal(normalizeReferencedPropertyLabel("columns"), null);
	assert.equal(isReferenceOnlyHintProperty("animation-range"), true);
	assert.equal(isReferenceOnlyHintProperty("scroll-timeline"), true);
	assert.equal(isReferenceOnlyHintProperty("animation-timeline"), false);
	assert.equal(isReferenceOnlyHintProperty("border-block-color"), false);
	assert.equal(matchesReferencedPropertyToken("text-box-trim", "trim-both"), true);
	assert.equal(matchesReferencedPropertyToken("text-box-edge", "normal"), false);
	assert.equal(matchesReferencedPropertyToken("text-box-edge", "ideographic"), true);
	assert.equal(matchesReferencedPropertyToken("white-space-collapse", "break-spaces"), true);
	assert.equal(matchesReferencedPropertyToken("column-count", "2"), true);
	assert.equal(matchesReferencedPropertyToken("text-emphasis-color", "#f00"), true);
});
