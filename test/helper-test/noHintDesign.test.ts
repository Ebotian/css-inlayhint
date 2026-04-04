import assert from "node:assert/strict";
import test from "node:test";

import { classifyPropertyStructure, isDesignedNoHintProperty } from "../../src/helper/noHintDesign.js";

test("noHintDesign classifies generic-single as designed no-hint", () => {
	assert.equal(classifyPropertyStructure("stroke"), "generic-single");
	assert.equal(isDesignedNoHintProperty("stroke"), true);
	assert.equal(isDesignedNoHintProperty("animation"), false);
	assert.equal(isDesignedNoHintProperty("margin"), false);
});
