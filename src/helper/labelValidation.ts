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

	const valueParts = valueText.match(/[^\s,]+/g) ?? [];
	const compactLabelParts = labelParts.map((part) => part.trim()).filter((part) => part.length > 0);
	if (valueParts.length === 0 || compactLabelParts.length === 0) {
		return;
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
