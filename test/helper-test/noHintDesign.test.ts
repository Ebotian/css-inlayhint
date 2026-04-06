import assert from "node:assert/strict";
import test from "node:test";

import {
	classifyPropertyStructure,
	getNoHintDesignKind,
	isDesignedNoHintProperty,
	isLogicalListNoHintProperty,
	isStructureMappingNoHintProperty,
} from "../../src/helper/noHintDesign.js";

test("noHintDesign classifies plain generic-single properties as designed no-hint", () => {
	assert.equal(classifyPropertyStructure("font-weight"), "generic-single");
	assert.equal(isStructureMappingNoHintProperty("font-weight"), true);
	assert.equal(getNoHintDesignKind("font-weight"), "structure-mapping");
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

test("noHintDesign keeps container designed no-hint", () => {
	assert.equal(classifyPropertyStructure("container"), "reference-only");
	assert.equal(isStructureMappingNoHintProperty("container"), true);
	assert.equal(getNoHintDesignKind("container"), "structure-mapping");
	assert.equal(isDesignedNoHintProperty("container"), true);
});

test("noHintDesign marks singleton label vocabulary properties as logical-list no-hint", () => {
	assert.equal(isLogicalListNoHintProperty("animation-delay"), true);
	assert.equal(isLogicalListNoHintProperty("background-image"), true);
	assert.equal(isLogicalListNoHintProperty("position-try-fallbacks"), true);
	assert.equal(isLogicalListNoHintProperty("size"), true);
	assert.equal(getNoHintDesignKind("animation-delay"), "logical-list");
	assert.equal(getNoHintDesignKind("background-image"), "logical-list");
	assert.equal(getNoHintDesignKind("position-try-fallbacks"), "logical-list");
	assert.equal(getNoHintDesignKind("size"), "logical-list");
	assert.equal(isDesignedNoHintProperty("animation-delay"), true);
	assert.equal(isDesignedNoHintProperty("background-image"), true);
});

test("noHintDesign keeps grid-line properties hintable", () => {
	assert.equal(isDesignedNoHintProperty("grid-column"), false);
	assert.equal(isDesignedNoHintProperty("grid-column-start"), false);
	assert.equal(isDesignedNoHintProperty("grid-column-end"), false);
	assert.equal(isDesignedNoHintProperty("grid-row-start"), false);
	assert.equal(isDesignedNoHintProperty("grid-row-end"), false);
	assert.equal(isDesignedNoHintProperty("grid-area"), false);
});

test("noHintDesign keeps inset hintable", () => {
	assert.equal(classifyPropertyStructure("inset"), "reference-only");
	assert.equal(isDesignedNoHintProperty("inset"), false);
});

test("noHintDesign keeps scroll-margin hintable", () => {
	assert.equal(classifyPropertyStructure("scroll-margin"), "generic-single");
	assert.equal(isDesignedNoHintProperty("scroll-margin"), false);
});
