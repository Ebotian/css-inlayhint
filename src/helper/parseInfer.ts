import { parseCssSyntax, visitCssSyntaxAst } from "../share/cssSyntax.js";
import { isCssWideKeyword } from "../share/cssValueAtoms.js";
import { getPropertySyntax } from "./summary.js";
import { matchesReferencedPropertyToken, normalizeReferencedPropertyLabel } from "./semanticMap.js";
import { collectReferencedSyntaxLabels } from "./referenceSyntax.js";
import { classifyPropertyStructure } from "./noHintDesign.js";
import {
	matchesTypeNodeToken,
	normalizeShorthandMemberLabel,
	matchesSyntaxTypeToken,
	normalizeSyntaxKeywordLabel,
	normalizeSyntaxTypeLabel,
	tokenizeShorthandValueText,
} from "./classifyNormalize.js";

export function inferUnorderedShorthandLabelParts(
	expanded: readonly string[],
	valueText: string | undefined,
	tokenCount: number,
): string[] | null {
	if (!valueText || tokenCount <= 0) {
		return null;
	}

	const tokens = tokenizeShorthandValueText(valueText);
	if (tokens.length === 0) {
		return null;
	}

	const labels: string[] = [];
	for (const token of tokens) {
		if (isCssWideKeyword(token)) {
			labels.push("global");
			continue;
		}

		const matchedMember = findBestMatchedShorthandMember(expanded, token);
		if (!matchedMember) {
			return null;
		}

		labels.push(normalizeShorthandMemberLabel(matchedMember, expanded));
	}

	return labels.length === tokenCount ? labels : null;
}

export function inferUnorderedSyntaxLabelParts(
	propertyName: string,
	valueText: string | undefined,
	tokenCount: number,
): string[] | null {
	if (!valueText || tokenCount <= 0) {
		return null;
	}

	const referenceLabels =
		classifyPropertyStructure(propertyName) === "reference-only" ? collectReferencedSyntaxLabels(propertyName) : [];
	if (referenceLabels.length >= 2) {
		return referenceLabels.slice(0, Math.min(tokenCount, referenceLabels.length));
	}

	const syntaxAst = getPropertySyntaxAst(propertyName);
	const branches = findUnorderedSyntaxBranches(syntaxAst);
	if (!branches || branches.length === 0) {
		return null;
	}

	const tokens = tokenizeShorthandValueText(valueText);
	if (tokens.length === 0) {
		return null;
	}

	const labels: string[] = [];
	for (const token of tokens) {
		const branch = branches.find((candidate) => matchesSyntaxBranchToken(candidate, token));
		if (!branch) {
			return null;
		}

		const label = inferSyntaxBranchLabel(branch);
		if (!label) {
			return null;
		}

		labels.push(label);
	}

	return labels.length === tokenCount ? labels : null;
}

export function findUnorderedSyntaxBranches(syntaxAst: unknown): unknown[] | null {
	if (!syntaxAst || typeof syntaxAst !== "object") {
		return null;
	}

	const group = syntaxAst as { type?: string; combinator?: string; terms?: unknown[]; term?: unknown };
	if (group.type === "Group" && group.combinator === "|" && Array.isArray(group.terms)) {
		const flattenedBranches: unknown[] = [];
		let sawUnorderedGroup = false;

		for (const term of group.terms) {
			if (term && typeof term === "object") {
				const nested = term as { type?: string; combinator?: string; terms?: unknown[] };
				if (nested.type === "Group" && nested.combinator === "||" && Array.isArray(nested.terms)) {
					sawUnorderedGroup = true;
					flattenedBranches.push(...nested.terms);
					continue;
				}
			}

			if (
				term &&
				typeof term === "object" &&
				((term as { type?: string }).type === "Keyword" ||
					(term as { type?: string }).type === "Type" ||
					(term as { type?: string }).type === "Property")
			) {
				flattenedBranches.push(term);
				continue;
			}

			const nested = findUnorderedSyntaxBranches(term);
			if (nested) {
				sawUnorderedGroup = true;
				flattenedBranches.push(...nested);
			}
		}

		if (sawUnorderedGroup && flattenedBranches.length > 0) {
			return flattenedBranches;
		}
	}

	if (group.type === "Group" && group.combinator === "||" && Array.isArray(group.terms)) {
		return group.terms;
	}

	if (group.type === "Group" && Array.isArray(group.terms)) {
		for (const term of group.terms) {
			const branches = findUnorderedSyntaxBranches(term);
			if (branches) {
				return branches;
			}
		}
	}

	if (group.type === "Multiplier") {
		return findUnorderedSyntaxBranches(group.term);
	}

	return null;
}

export function inferSyntaxBranchLabel(branch: unknown): string | null {
	if (!branch || typeof branch !== "object") {
		return null;
	}

	const node = branch as { type?: string; name?: string; terms?: Array<{ type?: string; name?: string }> };
	if (node.type === "Type") {
		return normalizeSyntaxTypeLabel(node.name ?? "");
	}

	if (node.type === "Property") {
		return normalizeReferencedPropertyLabel(node.name ?? "");
	}

	if (node.type === "Group" && Array.isArray(node.terms)) {
		const keywordNames = node.terms
			.filter((term): term is { type: "Keyword"; name: string } => term.type === "Keyword" && Boolean(term.name))
			.map((term) => term.name.toLowerCase());

		if (keywordNames.length > 0 && keywordNames.every((keyword) => DIRECTION_KEYWORDS.has(keyword))) {
			return "direction";
		}

		if (keywordNames.length === 1) {
			return keywordNames[0] ?? null;
		}
	}

	if (node.type === "Keyword") {
		return normalizeSyntaxKeywordLabel(node.name ?? "");
	}

	return null;
}

export function matchesSyntaxBranchToken(branch: unknown, token: string): boolean {
	if (!branch || typeof branch !== "object") {
		return false;
	}

	const node = branch as { type?: string; name?: string; terms?: Array<{ type?: string; name?: string }> };
	if (node.type === "Type") {
		return matchesSyntaxTypeToken(node.name ?? "", token);
	}

	if (node.type === "Property") {
		return matchesReferencedPropertyToken(node.name ?? "", token);
	}

	if (node.type === "Group" && Array.isArray(node.terms)) {
		return node.terms.some((term) => term.type === "Keyword" && term.name?.toLowerCase() === token.toLowerCase());
	}

	if (node.type === "Keyword") {
		return node.name?.toLowerCase() === token.toLowerCase();
	}

	return false;
}

export function matchesShorthandMemberToken(memberName: string, token: string): boolean {
	return getShorthandMemberMatchScore(memberName, token) !== null;
}

function findBestMatchedShorthandMember(expanded: readonly string[], token: string): string | null {
	let bestMember: string | null = null;
	let bestScore = -1;

	for (const memberName of expanded) {
		const score = getShorthandMemberMatchScore(memberName, token);
		if (score === null || score <= bestScore) {
			continue;
		}

		bestScore = score;
		bestMember = memberName;
	}

	return bestMember;
}

function getShorthandMemberMatchScore(memberName: string, token: string): number | null {
	const syntax = getPropertySyntax(memberName);
	if (!syntax) {
		return null;
	}

	const syntaxAst = getPropertySyntaxAst(memberName);
	let bestScore: number | null = null;
	visitCssSyntaxAst(syntaxAst as ReturnType<typeof parseCssSyntax>, (node) => {
		if (bestScore === 2) {
			return;
		}

		if (node.type === "Keyword" && node.name?.toLowerCase() === token.toLowerCase()) {
			bestScore = 2;
			return;
		}

		if (node.type === "Type" && matchesTypeNodeToken(node.name ?? "", token)) {
			bestScore = bestScore ?? 1;
			return;
		}

		if (node.type === "Property" && matchesReferencedPropertyToken(node.name ?? "", token)) {
			bestScore = bestScore ?? 1;
		}
	});

	return bestScore;
}

function getPropertySyntaxAst(propertyName: string): unknown {
	let syntaxAst = SHORTHAND_SYNTAX_AST_CACHE.get(propertyName);
	if (!syntaxAst) {
		syntaxAst = parseCssSyntax(getPropertySyntax(propertyName));
		SHORTHAND_SYNTAX_AST_CACHE.set(propertyName, syntaxAst);
	}

	return syntaxAst;
}

const SHORTHAND_SYNTAX_AST_CACHE = new Map<string, unknown>();
const DIRECTION_KEYWORDS = new Set(["auto", "reverse"]);
