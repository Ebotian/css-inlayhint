import assert from "node:assert/strict";
import test from "node:test";

import {
	isGridLineProperty,
	usesCommaSeparatedRepeatableListSyntax,
	usesSlashSeparatedGridLineSyntax,
	usesUnorderedOptionalGroupSyntax,
} from "../../src/helper/judgment.js";

test("judgment classifies syntax families", () => {
	assert.equal(isGridLineProperty("grid-column"), true);
	assert.equal(usesSlashSeparatedGridLineSyntax("grid-column"), true);
	assert.equal(usesCommaSeparatedRepeatableListSyntax("background-position"), true);
	assert.equal(usesUnorderedOptionalGroupSyntax("text-decoration"), true);
});
