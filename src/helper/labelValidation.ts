import { tokenizeShorthandValueText } from "./classifyNormalize.js";
import { getShorthandLabelParts } from "../propertySyntax.js";

type SemanticValueCase = {
	description: string;
	valueAtoms: readonly { kind: string; text: string }[];
};

export function assertNoGlobalLabels(propertyName: string, labelParts: readonly string[]): void {
	if (labelParts.some((part) => part === "global")) {
		throw new Error(`Forbidden label "global" for ${propertyName}`);
	}
}

export function assertNoPropertyNameEchoLabels(propertyName: string, labelParts: readonly string[]): void {
	const echoedLabel = labelParts.find((part) => part === propertyName || part.startsWith(`${propertyName}-`));

	if (echoedLabel) {
		throw new Error(`Forbidden label echo "${echoedLabel}" for ${propertyName}`);
	}
}

export function assertNoValueEchoLabels(
	propertyName: string,
	valueText: string | undefined,
	labelParts: readonly string[],
): void {
	if (!valueText) {
		return;
	}

	const valueParts = tokenizeShorthandValueText(valueText);
	const compactLabelParts = labelParts.map((part) => part.trim()).filter((part) => part.length > 0);
	if (valueParts.length === 0 || compactLabelParts.length === 0) {
		return;
	}

	if (isSingleValueEcho(propertyName, valueParts, compactLabelParts)) {
		const suffixLabel = getPropertyNameSuffix(propertyName);
		if (suffixLabel && compactLabelParts[0] === suffixLabel) {
			throw new Error(`Forbidden label echo of property suffix "${suffixLabel}" for ${propertyName}`);
		}
	}

	if (
		compactLabelParts.length === valueParts.length &&
		compactLabelParts.every((part, index) => part === (valueParts[index] ?? ""))
	) {
		throw new Error(`Forbidden label echo of value "${valueParts.join(" ")}" for ${propertyName}`);
	}

	if (compactLabelParts.length === 1 && valueParts.length === 1 && compactLabelParts[0] === valueParts[0]) {
		throw new Error(`Forbidden label echo of value "${valueParts[0]}" for ${propertyName}`);
	}
}

export function hasValueLabelStringOverlap(valueText: string | undefined, labelParts: readonly string[]): boolean {
	if (!valueText) {
		return false;
	}

	const valueParts = tokenizeShorthandValueText(valueText);
	const compactLabelParts = labelParts.map((part) => part.trim()).filter((part) => part.length > 0);
	if (valueParts.length === 0 || compactLabelParts.length === 0) {
		return false;
	}

	for (const labelPart of compactLabelParts) {
		const labelAtoms = collectStringAtoms(labelPart);
		if (labelAtoms.length === 0) {
			continue;
		}

		for (const valuePart of valueParts) {
			const valueAtoms = collectStringAtoms(valuePart);
			if (valueAtoms.length === 0) {
				continue;
			}

			for (const labelAtom of labelAtoms) {
				if (valueAtoms.includes(labelAtom)) {
					return true;
				}
			}
		}
	}

	return false;
}

export function assertNoDuplicateLabels(
	propertyName: string,
	labelParts: readonly string[],
	allowDuplicateLabels = false,
): void {
	if (allowDuplicateLabels) {
		return;
	}

	const seen = new Set<string>();
	for (const label of labelParts) {
		const normalizedLabel = label.trim();
		if (!normalizedLabel) {
			continue;
		}

		if (seen.has(normalizedLabel)) {
			throw new Error(`Duplicate label detected for ${propertyName}: ${normalizedLabel}`);
		}

		seen.add(normalizedLabel);
	}
}

export function validateLabelParts(
	propertyName: string,
	labelParts: readonly string[],
	allowDuplicateLabels: boolean,
): void {
	assertNoGlobalLabels(propertyName, labelParts);
	assertNoPropertyNameEchoLabels(propertyName, labelParts);
	assertNoDuplicateLabels(propertyName, labelParts, allowDuplicateLabels);
}

export function assertNoSemanticMultiValueNoHintCases(
	propertyName: string,
	cases: ReadonlyArray<SemanticValueCase>,
): void {
	const semanticMultiValueCases = cases.filter((generatedCase) =>
		hasSemanticMultiValueLabelCase(propertyName, generatedCase),
	);
	if (semanticMultiValueCases.length === 0) {
		return;
	}

	throw new Error(
		`Property ${propertyName} has semantic multi-value cases without generated hints: ${semanticMultiValueCases[0]?.description ?? "unknown"}`,
	);
}

function isSingleValueEcho(
	propertyName: string,
	valueParts: readonly string[],
	labelParts: readonly string[],
): boolean {
	return valueParts.length === 1 && labelParts.length === 1 && Boolean(getPropertyNameSuffix(propertyName));
}

function getPropertyNameSuffix(propertyName: string): string {
	return (
		propertyName
			.split("-")
			.map((part) => part.trim())
			.filter(Boolean)
			.at(-1) ?? ""
	);
}

function collectStringAtoms(text: string): string[] {
	return text
		.toLowerCase()
		.split(/[^a-z0-9]+/g)
		.map((part) => part.trim())
		.filter((part) => part.length > 0);
}

function hasSemanticMultiValueLabelCase(propertyName: string, generatedCase: SemanticValueCase): boolean {
	const meaningfulAtoms = generatedCase.valueAtoms.filter((atom) => atom.kind !== "global");
	if (meaningfulAtoms.length < 2) {
		return false;
	}

	const inferredLabels = getShorthandLabelParts(
		propertyName,
		meaningfulAtoms.length,
		meaningfulAtoms.map((atom) => atom.text).join(" "),
	);
	return Boolean(inferredLabels && inferredLabels.length > 0);
}
