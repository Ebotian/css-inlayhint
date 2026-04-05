import { collectShorthandValueTokens } from "./classifyNormalize.js";

export type LayeredSemanticMatcher = {
	label: string;
	matches(tokenText: string, context: LayeredSemanticContext): boolean;
};

export type LayeredSemanticContext = {
	token: { text: string; index: number };
	slashIndex: number;
	seenLabelCounts: ReadonlyMap<string, number>;
};

export function inferLayeredSemanticLabelParts(
	valueText: string | undefined,
	tokenCount: number,
	matchers: readonly LayeredSemanticMatcher[],
): string[] | null {
	if (!valueText || tokenCount <= 0) {
		return null;
	}

	const tokens = collectShorthandValueTokens(valueText);
	if (tokens.length === 0) {
		return null;
	}

	const slashIndex = findTopLevelSlashIndex(valueText);
	const seenLabelCounts = new Map<string, number>();
	const labels: string[] = [];

	for (const token of tokens) {
		const tokenText = token.text.trim();
		if (!tokenText || tokenText === "/") {
			continue;
		}

		const context: LayeredSemanticContext = { token, slashIndex, seenLabelCounts };
		const matcher = matchers.find((candidate) => candidate.matches(tokenText, context));
		if (!matcher) {
			return null;
		}

		labels.push(matcher.label);
		seenLabelCounts.set(matcher.label, (seenLabelCounts.get(matcher.label) ?? 0) + 1);
	}

	return labels.length === tokenCount ? labels : null;
}

export function findTopLevelSlashIndex(valueText: string): number {
	let parenDepth = 0;
	let bracketDepth = 0;
	let braceDepth = 0;
	let quote: string | null = null;
	let escaped = false;

	for (let index = 0; index < valueText.length; index += 1) {
		const character = valueText[index] ?? "";

		if (quote) {
			if (escaped) {
				escaped = false;
			} else if (character === "\\") {
				escaped = true;
			} else if (character === quote) {
				quote = null;
			}

			continue;
		}

		if (character === '"' || character === "'") {
			quote = character;
			continue;
		}

		if (character === "(") {
			parenDepth += 1;
			continue;
		}

		if (character === ")") {
			parenDepth = Math.max(0, parenDepth - 1);
			continue;
		}

		if (character === "[") {
			bracketDepth += 1;
			continue;
		}

		if (character === "]") {
			bracketDepth = Math.max(0, bracketDepth - 1);
			continue;
		}

		if (character === "{") {
			braceDepth += 1;
			continue;
		}

		if (character === "}") {
			braceDepth = Math.max(0, braceDepth - 1);
			continue;
		}

		if (parenDepth === 0 && bracketDepth === 0 && braceDepth === 0 && character === "/") {
			return index;
		}
	}

	return -1;
}
