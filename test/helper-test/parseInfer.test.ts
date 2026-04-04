import assert from "node:assert/strict";
import test from "node:test";

import {
	findUnorderedSyntaxBranches,
	inferSyntaxBranchLabel,
	matchesSyntaxBranchToken,
} from "../../src/helper/parseInfer.js";

test("parseInfer resolves syntax branch labels", () => {
	assert.equal(inferSyntaxBranchLabel({ type: "Type", name: "<length>" }), "length");
	assert.equal(inferSyntaxBranchLabel({ type: "Property", name: "text-box-edge" }), "edge");
	assert.equal(matchesSyntaxBranchToken({ type: "Property", name: "column-width" }, "12em"), true);
	assert.equal(
		findUnorderedSyntaxBranches({ type: "Group", combinator: "||", terms: [{ type: "Keyword", name: "auto" }] })
			?.length,
		1,
	);
});
