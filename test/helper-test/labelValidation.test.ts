import assert from "node:assert/strict";
import test from "node:test";

import {
	assertNoGlobalLabels,
	assertNoSemanticMultiValueNoHintCases,
	assertNoPropertyNameEchoLabels,
	assertNoValueEchoLabels,
} from "../../src/helper/labelValidation.js";

test("labelValidation rejects global and echoed property-name labels", () => {
	assert.throws(() => assertNoGlobalLabels("margin", ["global"]), /Forbidden label "global"/);
	assert.throws(
		() => assertNoPropertyNameEchoLabels("font-variant-numeric", ["font-variant-numeric-1-values"]),
		/Forbidden label echo/,
	);
	assert.throws(
		() => assertNoValueEchoLabels("margin-block-end", "1rem", ["end"]),
		/Forbidden label echo of property suffix/,
	);
	assert.throws(() => assertNoValueEchoLabels("text-box", "normal", ["normal"]), /Forbidden label echo of value/);
});

test("labelValidation rejects semantic multi-value no-hint cases", () => {
	assert.throws(
		() =>
			assertNoSemanticMultiValueNoHintCases("border-spacing", [
				{
					description: "border-spacing/2-value/length+length",
					valueAtoms: [
						{ kind: "length", text: "1cm" },
						{ kind: "length", text: "2em" },
					],
				},
			]),
		/Property border-spacing has semantic multi-value cases without generated hints/,
	);
});

test("labelValidation ignores single-value-only cases in the semantic guard", () => {
	assert.doesNotThrow(() =>
		assertNoSemanticMultiValueNoHintCases("display", [
			{
				description: "display/1-value/keyword",
				valueAtoms: [{ kind: "keyword", text: "block" }],
			},
		]),
	);
});
