import assert from "node:assert/strict";
import test from "node:test";

import { createTodoPlan } from "./generateTodoPlan.js";

test("todo plan batches properties by validation signal, structure, and complexity", async () => {
	const plan = await createTodoPlan(
		{
			noHintTodoProperties: {
				beta: true,
				alpha: true,
				gamma: true,
			},
		},
		(propertyName: string) => {
			if (propertyName === "alpha") {
				return { key: "reference-only", complexity: "simple" };
			}

			if (propertyName === "beta") {
				return { key: "generic-single", complexity: "repeat" };
			}

			return { key: "keyword-union", complexity: "alternation" };
		},
		async ({ properties }) => {
			const [representativeProperty] = properties;
			if (representativeProperty === "alpha") {
				return {
					representativeProperty,
					localSyntax: "alpha-local",
					mdnSyntax: "alpha-local",
					mdnVerified: true,
					sourceAgreement: "aligned",
					sampleCaseCount: 1,
				};
			}

			if (representativeProperty === "beta") {
				return {
					representativeProperty,
					localSyntax: "beta-local",
					mdnSyntax: "beta-mdn",
					mdnVerified: true,
					sourceAgreement: "verified",
					sampleCaseCount: 2,
				};
			}

			return {
				representativeProperty,
				localSyntax: "gamma-local",
				mdnSyntax: "",
				mdnVerified: false,
				sourceAgreement: "unverified",
				sampleCaseCount: 3,
			};
		},
	);

	assert.deepEqual(plan, {
		source: "test/passlist/property-pass-statistics.json",
		todoCount: 3,
		batchCount: 3,
		batches: [
			{
				phase: 1,
				key: "reference-only",
				complexity: "simple",
				count: 1,
				properties: ["alpha"],
				rationale: "reference-only / lowest cross-validation risk",
				validation: {
					representativeProperty: "alpha",
					localSyntax: "alpha-local",
					mdnSyntax: "alpha-local",
					mdnVerified: true,
					sourceAgreement: "aligned",
					sampleCaseCount: 1,
				},
			},
			{
				phase: 2,
				key: "generic-single",
				complexity: "repeat",
				count: 1,
				properties: ["beta"],
				rationale: "generic-single / repeat-heavy but still structure-driven",
				validation: {
					representativeProperty: "beta",
					localSyntax: "beta-local",
					mdnSyntax: "beta-mdn",
					mdnVerified: true,
					sourceAgreement: "verified",
					sampleCaseCount: 2,
				},
			},
			{
				phase: 3,
				key: "keyword-union",
				complexity: "alternation",
				count: 1,
				properties: ["gamma"],
				rationale: "keyword-union / branch-selection work after the simple cases",
				validation: {
					representativeProperty: "gamma",
					localSyntax: "gamma-local",
					mdnSyntax: "",
					mdnVerified: false,
					sourceAgreement: "unverified",
					sampleCaseCount: 3,
				},
			},
		],
	});
});
