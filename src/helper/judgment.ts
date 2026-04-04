import { getPropertySyntax } from "./summary.js";

export function isGridLineProperty(propertyName: string): boolean {
	return getPropertySyntax(propertyName).includes("<grid-line>");
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
