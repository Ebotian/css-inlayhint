import type { InlayHint, Range } from "vscode-languageserver";

import { filterInlayHintsByRange } from "./protocol";

export type CssHintGovernanceOptions = {
	maxLabelLength?: number;
};

export type CssHintGovernance = {
	govern(hints: readonly InlayHint[], range: Range): InlayHint[];
};

const DEFAULT_MAX_LABEL_LENGTH = 32;

export function createCssHintGovernance(options: CssHintGovernanceOptions = {}): CssHintGovernance {
	const maxLabelLength = options.maxLabelLength ?? DEFAULT_MAX_LABEL_LENGTH;

	return {
		govern(hints: readonly InlayHint[], range: Range): InlayHint[] {
			const clippedHints = filterInlayHintsByRange(hints, range);
			const normalizedHints = clippedHints.map((hint) => truncateHintLabel(hint, maxLabelLength));
			const uniqueHints = dedupeHints(normalizedHints);
			return [...uniqueHints].sort(compareHints);
		},
	};
}

function dedupeHints(hints: readonly InlayHint[]): InlayHint[] {
	const seen = new Set<string>();
	const uniqueHints: InlayHint[] = [];

	for (const hint of hints) {
		const fingerprint = fingerprintHint(hint);
		if (seen.has(fingerprint)) {
			continue;
		}
		seen.add(fingerprint);
		uniqueHints.push(hint);
	}

	return uniqueHints;
}

function fingerprintHint(hint: InlayHint): string {
	return [
		normalizeHintLabel(hint.label),
		hint.kind ?? "none",
		hint.paddingLeft ? "left" : "no-left",
		hint.paddingRight ? "right" : "no-right",
		hint.position.line,
		hint.position.character,
	].join("|");
}

function compareHints(left: InlayHint, right: InlayHint): number {
	if (left.position.line !== right.position.line) {
		return left.position.line - right.position.line;
	}
	if (left.position.character !== right.position.character) {
		return left.position.character - right.position.character;
	}
	return normalizeHintLabel(left.label).localeCompare(normalizeHintLabel(right.label));
}

function truncateHintLabel(hint: InlayHint, maxLabelLength: number): InlayHint {
	const label = normalizeHintLabel(hint.label);
	if (label.length <= maxLabelLength) {
		return hint;
	}

	return {
		...hint,
		label: label.slice(0, maxLabelLength),
	};
}

function normalizeHintLabel(label: InlayHint["label"]): string {
	if (typeof label === "string") {
		return label;
	}
	if (Array.isArray(label)) {
		return label.map((part) => (typeof part === "string" ? part : String(part.value))).join("");
	}
	return String(label ?? "");
}
