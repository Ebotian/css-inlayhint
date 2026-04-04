import assert from "node:assert/strict";
import test from "node:test";

import { getPropertyStatus, getPropertySyntax, listPropertyNames } from "../../src/helper/summary.js";

test("summary exposes merged property metadata", () => {
	assert.equal(typeof getPropertySyntax("text-decoration"), "string");
	assert.equal(getPropertyStatus("text-decoration"), "standard");
	assert.ok(listPropertyNames().includes("text-decoration"));
});
