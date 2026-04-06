import assert from "node:assert/strict";
import test from "node:test";

import { getMdnValues } from "../../src/helper/getMdnValues.js";

test("getMdnValues fetches the live values list for a property", async () => {
	const page = await getMdnValues("background-attachment");

	assert.equal(page.propertyName, "background-attachment");
	assert.equal(
		page.url,
		"https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/background-attachment#values",
	);
	assert.equal(page.verified, true);
	assert.equal(page.uncertain, false);
	assert.deepEqual(
		page.values.map((entry) => entry.id),
		["fixed", "local", "scroll"],
	);
	assert.ok(page.values.every((entry) => entry.label.length > 0));
	assert.ok(page.values.every((entry) => entry.description.length > 0));
});

test("getMdnValues exposes the background values semantics", async () => {
	const page = await getMdnValues("background");

	assert.equal(page.propertyName, "background");
	assert.equal(page.verified, true);
	assert.equal(page.uncertain, false);
	assert.ok(page.values.some((entry) => entry.id === "background-color"));
	assert.ok(page.values.some((entry) => entry.id === "bg-image"));
	assert.ok(page.values.some((entry) => entry.id === "repeat-style"));
	assert.ok(page.values.some((entry) => entry.id === "bg-size"));
});
