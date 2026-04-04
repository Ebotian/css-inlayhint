import assert from "node:assert/strict";
import test from "node:test";

import { classifyPropertyStructure, isDesignedNoHintProperty } from "../../src/helper/noHintDesign.js";

test("noHintDesign classifies plain generic-single properties as designed no-hint", () => {
	assert.equal(classifyPropertyStructure("font-weight"), "generic-single");
	assert.equal(isDesignedNoHintProperty("font-weight"), true);
	assert.equal(classifyPropertyStructure("opacity"), "generic-single");
	assert.equal(isDesignedNoHintProperty("opacity"), true);
});

test("noHintDesign keeps repeat-marked generic-single syntax out of designed no-hint", () => {
	assert.equal(classifyPropertyStructure("animation"), "generic-single");
	assert.equal(isDesignedNoHintProperty("animation"), false);
});

test("noHintDesign keeps corner-radius properties hintable", () => {
	assert.equal(classifyPropertyStructure("border-bottom-left-radius"), "generic-single");
	assert.equal(isDesignedNoHintProperty("border-bottom-left-radius"), false);
});

test("noHintDesign keeps logical-axis repeat properties hintable", () => {
	assert.equal(classifyPropertyStructure("padding-block"), "reference-only");
	assert.equal(isDesignedNoHintProperty("padding-block"), false);
	assert.equal(classifyPropertyStructure("margin-inline"), "reference-only");
	assert.equal(isDesignedNoHintProperty("margin-inline"), false);
	assert.equal(classifyPropertyStructure("inset-block"), "reference-only");
	assert.equal(isDesignedNoHintProperty("inset-block"), false);
	assert.equal(classifyPropertyStructure("inset-inline"), "reference-only");
	assert.equal(isDesignedNoHintProperty("inset-inline"), false);
	assert.equal(classifyPropertyStructure("scroll-margin-block"), "generic-single");
	assert.equal(isDesignedNoHintProperty("scroll-margin-block"), false);
	assert.equal(classifyPropertyStructure("scroll-margin-inline"), "generic-single");
	assert.equal(isDesignedNoHintProperty("scroll-margin-inline"), false);
});

test("noHintDesign keeps inset hintable", () => {
	assert.equal(classifyPropertyStructure("inset"), "reference-only");
	assert.equal(isDesignedNoHintProperty("inset"), false);
});

test("noHintDesign keeps scroll-margin hintable", () => {
	assert.equal(classifyPropertyStructure("scroll-margin"), "generic-single");
	assert.equal(isDesignedNoHintProperty("scroll-margin"), false);
});
