import assert from "node:assert/strict";
import test from "node:test";

import { buildGeneratedSchedulerExpectedHints } from "./generatedSchedulerE2E.js";

test("generated scheduler E2E rejects fallback labels", () => {
	assert.throws(
		() =>
			buildGeneratedSchedulerExpectedHints({
				valueRangeStart: { line: 0, character: 0 },
				valueAtoms: [{ text: "one" }, { text: "two" }, { text: "three" }, { text: "four" }, { text: "five" }],
				propertyName: "margin",
				sourceText: "margin: one two three four five;",
				file: "file:///workspace/fallback.css",
			}),
		/Fallback label inference detected/,
	);
});
