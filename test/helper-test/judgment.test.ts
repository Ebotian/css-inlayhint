import assert from "node:assert/strict";
import test from "node:test";

import {
	isGridLineProperty,
	isIgnoredScrollMarginPaddingLonghandProperty,
	usesCommaSeparatedRepeatableListSyntax,
	usesSlashSeparatedGridLineSyntax,
	usesUnorderedOptionalGroupSyntax,
} from "../../src/helper/judgment.js";

test("judgment classifies syntax families", () => {
	assert.equal(isGridLineProperty("grid-column"), true);
	assert.equal(isIgnoredScrollMarginPaddingLonghandProperty("scroll-margin-top"), true);
	assert.equal(isIgnoredScrollMarginPaddingLonghandProperty("scroll-padding-inline-end"), true);
	assert.equal(isIgnoredScrollMarginPaddingLonghandProperty("scroll-margin"), false);
	assert.equal(usesSlashSeparatedGridLineSyntax("grid-column"), true);
	assert.equal(usesCommaSeparatedRepeatableListSyntax("background-position"), true);
	assert.equal(usesUnorderedOptionalGroupSyntax("text-decoration"), true);
});
