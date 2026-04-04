import assert from "node:assert/strict";
import test from "node:test";

import { renderValidationCss, sortPropertyNamesByCaseCount } from "./generateValidationCss.js";

type PasslistStatistics = {
	passedCount: number;
	totalCount: number;
	passedProperties: Record<string, true>;
};

test("validation css sorts properties by ascending generated case count", () => {
	const statistics: PasslistStatistics = {
		passedCount: 3,
		totalCount: 3,
		passedProperties: {
			medium: true,
			small: true,
			large: true,
		},
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
		passedCount: 1,
		totalCount: 1,
		passedProperties: {
			broken: true,
		},
	};

	assert.throws(() => renderValidationCss(statistics, () => []), /Generated no validation cases for property: broken/);
});
