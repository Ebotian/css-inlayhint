import { getPropertySyntax } from "./summary.js";

export function isGridLineProperty(propertyName: string): boolean {
	return getPropertySyntax(propertyName).includes("<grid-line>");
}

export function isCornerRadiusProperty(propertyName: string): boolean {
	return propertyName !== "border-radius" && propertyName.endsWith("-radius");
}

export function isLogicalAxisRepeatProperty(propertyName: string): boolean {
	return /^(?:padding|margin|inset|scroll-margin)-(?:block|inline)$/.test(propertyName);
}

export function isInsetProperty(propertyName: string): boolean {
	return propertyName === "inset";
}

export function isScrollMarginProperty(propertyName: string): boolean {
	return propertyName === "scroll-margin";
}

export function isIgnoredScrollMarginPaddingLonghandProperty(propertyName: string): boolean {
	return /^(?:scroll-margin|scroll-padding)-(?:block-start|block-end|inline-start|inline-end|top|right|bottom|left)$/.test(
		propertyName,
	);
}

export function usesSlashSeparatedGridLineSyntax(propertyName: string): boolean {
	const syntax = getPropertySyntax(propertyName);
	return syntax.includes("<grid-line>") && syntax.includes("/");
}

export function usesCommaSeparatedRepeatableListSyntax(propertyName: string): boolean {
	return getPropertySyntax(propertyName).includes("#");
}

export function usesUnorderedOptionalGroupSyntax(propertyName: string): boolean {
	return getPropertySyntax(propertyName).includes("||");
}
