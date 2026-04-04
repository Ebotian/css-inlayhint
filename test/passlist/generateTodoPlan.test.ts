import assert from "node:assert/strict";
import test from "node:test";

import { createTodoPlan } from "./generateTodoPlan.js";

test("todo plan batches properties by structure and complexity", () => {
	const plan = createTodoPlan(
		{
			noHintTodoProperties: {
				beta: true,
				alpha: true,
				gamma: true,
				delta: true,
			},
		},
		(propertyName: string) => {
			if (propertyName === "alpha" || propertyName === "gamma") {
				return { key: "reference-only", complexity: "simple" };
			}

			if (propertyName === "beta") {
				return { key: "shorthand-family", complexity: "simple" };
			}

			return { key: "mixed", complexity: "compound" };
		},
	);

	assert.deepEqual(plan, {
		source: "test/passlist/property-pass-statistics.json",
		todoCount: 4,
		batchCount: 3,
		batches: [
			{
				phase: 1,
				key: "shorthand-family",
				complexity: "simple",
				count: 1,
				properties: ["beta"],
				rationale: "shorthand-family / lowest cross-validation risk",
			},
			{
				phase: 2,
				key: "reference-only",
				complexity: "simple",
				count: 2,
				properties: ["alpha", "gamma"],
				rationale: "reference-only / lowest cross-validation risk",
			},
			{
				phase: 3,
				key: "mixed",
				complexity: "compound",
				count: 1,
				properties: ["delta"],
				rationale: "mixed / nested or mixed syntax, best left for later",
			},
		],
	});
});
