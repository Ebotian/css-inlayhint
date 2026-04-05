import assert from "node:assert/strict";
import test from "node:test";

import {
	getShorthandExpansion,
	getShorthandLabelParts,
	usesCommaSeparatedRepeatableListSyntax,
	usesUnorderedOptionalGroupSyntax,
} from "../src/propertySyntax.js";

test("propertySyntax trims unordered shorthand member prefixes", () => {
	assert.equal(usesUnorderedOptionalGroupSyntax("text-decoration"), true);
	assert.deepEqual(getShorthandExpansion("text-decoration"), [
		"text-decoration-line",
		"text-decoration-style",
		"text-decoration-color",
	]);
	assert.deepEqual(getShorthandLabelParts("text-decoration", 1, "underline"), ["line"]);
	assert.deepEqual(getShorthandLabelParts("text-decoration", 1, "double"), ["style"]);
	assert.deepEqual(getShorthandLabelParts("text-decoration", 1, "red"), ["color"]);
	assert.deepEqual(getShorthandLabelParts("text-decoration", 2, "underline red"), ["line", "color"]);
	assert.ok(
		!getShorthandLabelParts("text-decoration", 1, "underline")?.some((label) => label.includes("text-decoration")),
	);
});

test("propertySyntax keeps repeatable-list detection separate from unordered groups", () => {
	assert.equal(usesCommaSeparatedRepeatableListSyntax("background-position"), true);
	assert.equal(usesCommaSeparatedRepeatableListSyntax("text-decoration"), false);
});

test("propertySyntax infers offset-rotate syntax labels from syntax branches", () => {
	assert.equal(usesUnorderedOptionalGroupSyntax("offset-rotate"), true);
	assert.deepEqual(getShorthandLabelParts("offset-rotate", 1, "auto"), ["direction"]);
	assert.deepEqual(getShorthandLabelParts("offset-rotate", 1, "90deg"), ["angle"]);
	assert.deepEqual(getShorthandLabelParts("offset-rotate", 2, "auto 90deg"), ["direction", "angle"]);
	assert.deepEqual(getShorthandLabelParts("offset-rotate", 2, "90deg auto"), ["angle", "direction"]);
});

test("propertySyntax infers reference-syntax labels from ordered property refs", () => {
	assert.deepEqual(getShorthandLabelParts("animation-range", 1, "cover"), ["start"]);
	assert.deepEqual(getShorthandLabelParts("animation-range", 2, "cover 20%"), ["start", "end"]);
	assert.deepEqual(getShorthandLabelParts("border-bottom-left-radius", 1, "20%"), ["all"]);
	assert.deepEqual(getShorthandLabelParts("border-bottom-left-radius", 2, "20% 10%"), ["horizontal", "vertical"]);
	assert.deepEqual(getShorthandLabelParts("padding-block", 1, "10px"), ["all"]);
	assert.deepEqual(getShorthandLabelParts("padding-block", 2, "10px 20px"), ["start", "end"]);
	assert.deepEqual(getShorthandLabelParts("inset", 1, "10px"), ["all"]);
	assert.deepEqual(getShorthandLabelParts("inset", 2, "4px 8px"), ["top/bottom", "right/left"]);
	assert.deepEqual(getShorthandLabelParts("inset-block", 1, "3px"), ["all"]);
	assert.deepEqual(getShorthandLabelParts("inset-block", 2, "3px 10px"), ["start", "end"]);
	assert.deepEqual(getShorthandLabelParts("inset-inline", 2, "3px 10px"), ["start", "end"]);
	assert.deepEqual(getShorthandLabelParts("scroll-margin", 1, "10px"), ["all"]);
	assert.deepEqual(getShorthandLabelParts("scroll-margin", 2, "4px 8px"), ["top/bottom", "right/left"]);
	assert.deepEqual(getShorthandLabelParts("scroll-margin-block", 1, "3px"), ["all"]);
	assert.deepEqual(getShorthandLabelParts("scroll-margin-block", 2, "3px 10px"), ["start", "end"]);
	assert.deepEqual(getShorthandLabelParts("scroll-margin-inline", 2, "3px 10px"), ["start", "end"]);
	assert.deepEqual(getShorthandLabelParts("border-spacing", 1, "2px"), ["all"]);
	assert.deepEqual(getShorthandLabelParts("border-spacing", 2, "1cm 2em"), ["horizontal", "vertical"]);
	assert.deepEqual(getShorthandLabelParts("grid-template", 1, "none"), []);
	assert.deepEqual(getShorthandLabelParts("grid-template", 1, '"a"'), ["areas"]);
	assert.deepEqual(getShorthandLabelParts("grid-template", 2, "100px 1fr / 50px 1fr"), ["rows", "columns"]);
	assert.deepEqual(getShorthandLabelParts("corner-right-shape", 1, "bevel"), ["all"]);
	assert.deepEqual(getShorthandLabelParts("corner-right-shape", 2, "bevel notch"), ["top", "bottom"]);
	assert.deepEqual(getShorthandLabelParts("corner-inline-end-shape", 2, "squircle scoop"), [
		"block-start",
		"block-end",
	]);
	assert.deepEqual(getShorthandLabelParts("corner-bottom-shape", 2, "scoop square"), ["left", "right"]);
	assert.deepEqual(getShorthandLabelParts("corner-block-end-shape", 2, "square scoop"), ["inline-start", "inline-end"]);
	assert.deepEqual(getShorthandLabelParts("corner-bottom-left-shape", 1, "bevel"), ["all"]);
	assert.deepEqual(getShorthandLabelParts("mask-border-slice", 1, "30%"), ["all"]);
	assert.deepEqual(getShorthandLabelParts("mask-border-slice", 2, "10% 30%"), ["top/bottom", "left/right"]);
	assert.deepEqual(getShorthandLabelParts("mask-border-slice", 3, "30 30% 45"), ["top", "left/right", "bottom"]);
	assert.deepEqual(getShorthandLabelParts("mask-border-slice", 4, "7 12 14 5"), ["top", "right", "bottom", "left"]);
	assert.deepEqual(getShorthandLabelParts("mask-border-slice", 3, "10% fill 7 12"), ["top", "left/right", "bottom"]);
	assert.deepEqual(getShorthandLabelParts("mask", 2, 'url("masks.svg#star") luminance'), ["image", "mode"]);
	assert.deepEqual(getShorthandLabelParts("mask", 3, 'url("masks.svg#star") 40px 20px'), ["image", "top", "left"]);
	assert.deepEqual(getShorthandLabelParts("mask", 5, 'url("masks.svg#star") 0 0/50px 50px'), [
		"image",
		"top",
		"left",
		"width",
		"height",
	]);
	assert.deepEqual(getShorthandLabelParts("background-position", 4, "bottom 10px right 20px"), [
		"vertical",
		"length",
		"horizontal",
		"length",
	]);
	assert.deepEqual(getShorthandLabelParts("background-position", 4, "right 3em bottom 10px"), [
		"horizontal",
		"length",
		"vertical",
		"length",
	]);
	assert.deepEqual(getShorthandLabelParts("background-position", 3, "bottom 10px right"), [
		"vertical",
		"length",
		"horizontal",
	]);
	assert.deepEqual(getShorthandLabelParts("background-position", 1, "x-start"), ["horizontal"]);
	assert.deepEqual(getShorthandLabelParts("background-position", 1, "y-end"), ["vertical"]);
	assert.deepEqual(getShorthandLabelParts("background-position", 3, "top right 10px"), [
		"vertical",
		"horizontal",
		"length",
	]);
	assert.deepEqual(getShorthandLabelParts("background", 1, "url(x)"), ["image"]);
	assert.deepEqual(getShorthandLabelParts("background", 2, "url(x) center"), ["image", "position"]);
	assert.deepEqual(getShorthandLabelParts("background", 2, "border-box red"), ["origin", "color"]);
	assert.deepEqual(getShorthandLabelParts("gap", 1, "10px"), ["all"]);
	assert.deepEqual(getShorthandLabelParts("gap", 2, "10px 20px"), ["row", "column"]);
	assert.deepEqual(getShorthandLabelParts("place-content", 1, "center"), ["all"]);
	assert.deepEqual(getShorthandLabelParts("place-content", 2, "center space-between"), ["align", "justify"]);
	assert.deepEqual(getShorthandLabelParts("place-items", 2, "center start"), ["align", "justify"]);
	assert.deepEqual(getShorthandLabelParts("place-self", 2, "center start"), ["align", "justify"]);
	assert.ok(!getShorthandLabelParts("background", 1, "url(x)")?.some((label) => label.includes("background")));
	assert.deepEqual(getShorthandLabelParts("columns", 1, "12em"), ["width"]);
	assert.deepEqual(getShorthandLabelParts("columns", 1, "2"), ["count"]);
	assert.deepEqual(getShorthandLabelParts("text-emphasis", 1, "red"), ["color"]);
	assert.deepEqual(getShorthandLabelParts("text-emphasis", 1, "filled"), ["style"]);
});

test("propertySyntax infers text-box branch labels from nested syntax references", () => {
	assert.deepEqual(getShorthandLabelParts("text-box", 1, "normal"), ["normal"]);
	assert.deepEqual(getShorthandLabelParts("text-box", 1, "auto"), ["edge"]);
	assert.deepEqual(getShorthandLabelParts("text-box", 1, "trim-start"), ["trim"]);
	assert.deepEqual(getShorthandLabelParts("text-box", 2, "ideographic text"), ["edge", "edge"]);
});
