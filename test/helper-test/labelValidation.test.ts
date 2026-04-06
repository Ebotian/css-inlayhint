import assert from "node:assert/strict";
import test from "node:test";

import { createCssHintClassifier } from "../../src/classifier.js";
import { SINGLETON_LABEL_VOCABULARY_PROPERTIES } from "../../src/helper/singletonLabelVocabulary.js";
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

test("labelValidation suppresses singleton label vocabulary properties", () => {
	const classifier = createCssHintClassifier();
	const singletonProperties = [...SINGLETON_LABEL_VOCABULARY_PROPERTIES];

	assert.ok(singletonProperties.length > 0, "expected singleton vocabulary properties to be declared");
	assert.ok(singletonProperties.includes("background-image"));
	assert.ok(!singletonProperties.includes("background-clip"));
	assert.ok(!singletonProperties.includes("background-origin"));

	for (const propertyName of singletonProperties) {
		const classification = classifier.classify({
			propertyName,
			valueText: "x",
		} as never);

		assert.equal(classification.state, "suppressed", propertyName);
		assert.equal(classification.suppressReason, "singleton label vocabulary", propertyName);
	}
});
