import assert from "node:assert/strict";
import test from "node:test";

import {
	assertNoGlobalLabels,
	assertNoPropertyNameEchoLabels,
	assertNoValueEchoLabels,
} from "../../src/helper/labelValidation.js";

test("labelValidation rejects global and echoed property-name labels", () => {
	assert.throws(() => assertNoGlobalLabels("margin", ["global"]), /Forbidden label "global"/);
	assert.throws(
		() => assertNoPropertyNameEchoLabels("font-variant-numeric", ["font-variant-numeric-1-values"]),
		/Forbidden label echo/,
	);
	assert.throws(() => assertNoValueEchoLabels("text-box", "normal", ["normal"]), /Forbidden label echo of value/);
});
