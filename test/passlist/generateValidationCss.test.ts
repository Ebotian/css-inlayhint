import assert from "node:assert/strict";
import test from "node:test";

import { renderValidationCss, sortPropertyNamesByCaseCount } from "./generateValidationCss.js";

type PasslistStatistics = {
	matchedCount: number;
	totalCount: number;
	matchedProperties: Record<string, true>;
	noHintCount: number;
	noHintProperties: Record<string, true>;
};

test("validation css sorts properties by ascending generated case count", () => {
	const statistics: PasslistStatistics = {
		matchedCount: 3,
		totalCount: 3,
		matchedProperties: {
			medium: true,
			small: true,
			large: true,
		},
		noHintCount: 0,
		noHintProperties: {},
	};

	const counts = new Map([
		["small", 1],
		["medium", 2],
		["large", 3],
	]);

	const ordered = sortPropertyNamesByCaseCount(statistics, (propertyName) =>
		Array.from({ length: counts.get(propertyName) ?? 0 }, (_, index) => ({
			description: `${propertyName}/${index}`,
			code: `.probe { ${propertyName}: value-${index}; }`,
		})),
	);

	assert.deepEqual(ordered, ["small", "medium", "large"]);
});

test("validation css throws when a property generates no cases", () => {
	const statistics: PasslistStatistics = {
		matchedCount: 1,
		totalCount: 1,
		matchedProperties: {
			broken: true,
		},
		noHintCount: 0,
		noHintProperties: {},
	};

	assert.throws(() => renderValidationCss(statistics, () => []), /Generated no validation cases for property: broken/);
});

test("validation css ignores no-hint properties", () => {
	const statistics: PasslistStatistics = {
		matchedCount: 1,
		totalCount: 2,
		matchedProperties: {
			visible: true,
		},
		noHintCount: 1,
		noHintProperties: {
			silent: true,
		},
	};

	const rendered = renderValidationCss(statistics, (propertyName) =>
		propertyName === "visible" ? [{ description: "visible/0", code: ".probe { visible: value; }" }] : [],
	);

	assert.ok(rendered.includes("visible"));
	assert.ok(!rendered.includes("silent"));
});
