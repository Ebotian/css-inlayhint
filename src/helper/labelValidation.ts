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
