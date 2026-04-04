import assert from "node:assert/strict";
import test from "node:test";

import { buildMdnPropertyUrl, getFormalSyntax } from "../../src/helper/getFormalSyntax.js";

const EXPECTED_TEXT_EMPHASIS_FORMAL_SYNTAX = [
	"text-emphasis = ",
	"  <'text-emphasis-style'>  ||",
	"  <'text-emphasis-color'>  ",
	"",
	"<text-emphasis-style> = ",
	"  none                                                |",
	"  [ [ filled | open ] || [ dot | circle | double-circle | triangle | sesame ] ]  |",
	"  <string>                                            ",
	"",
	"<text-emphasis-color> = ",
	"  <color>  ",
	"",
].join("\n");

test("getFormalSyntax builds MDN property URLs", () => {
	assert.equal(
		buildMdnPropertyUrl("text-emphasis"),
		"https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-emphasis#formal_syntax",
	);
	assert.equal(
		buildMdnPropertyUrl("https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border"),
		"https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border#formal_syntax",
	);
});

test("getFormalSyntax fetches the full live formal syntax block for a property name", async () => {
	const page = await getFormalSyntax("text-emphasis");

	assert.equal(page.propertyName, "text-emphasis");
	assert.equal(
		page.url,
		"https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-emphasis#formal_syntax",
	);
	assert.equal(page.verified, true);
	assert.equal(page.uncertain, false);
	assert.equal(page.title, "text-emphasis - CSS | MDN");
	assert.equal(
		page.description,
		"The text-emphasis CSS property applies emphasis marks to text (except spaces and control characters). It is a shorthand for text-emphasis-style and text-emphasis-color.",
	);
	assert.equal(page.formalSyntax, EXPECTED_TEXT_EMPHASIS_FORMAL_SYNTAX);
});

test("getFormalSyntax also works for border", async () => {
	const page = await getFormalSyntax("border");

	assert.equal(page.propertyName, "border");
	assert.equal(page.url, "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border#formal_syntax");
	assert.equal(page.verified, true);
	assert.equal(page.uncertain, false);
	assert.equal(page.title, "border - CSS | MDN");
	assert.equal(
		page.description,
		"The border shorthand CSS property sets an element's border. It sets the values of border-width, border-style, and border-color.",
	);
	assert.ok(page.formalSyntax.startsWith("border = \n  <line-width>  ||\n  <line-style>  ||\n  <color>"));
	assert.ok(
		page.formalSyntax.includes(
			"<line-width> = \n  <length [0,∞]>  |\n  hairline        |\n  thin            |\n  medium          |\n  thick",
		),
	);
	assert.ok(
		page.formalSyntax.includes(
			"<line-style> = \n  none    |\n  hidden  |\n  dotted  |\n  dashed  |\n  solid   |\n  double  |\n  groove  |\n  ridge   |\n  inset   |\n  outset",
		),
	);
});
