import { parseCssSyntax, visitCssSyntaxAst } from "../share/cssSyntax.js";
import { getPropertySyntax } from "./summary.js";

export function collectReferencedSyntaxLabels(propertyName: string): string[] {
	const propertyNames = collectReferencedPropertyNames(propertyName);
	if (propertyNames.length < 2) {
		return [];
	}

	return propertyNames.map((name) => name.split("-").filter(Boolean).at(-1) ?? "");
}

export function collectReferencedSyntaxPrefixes(propertyName: string): string[] {
	const propertyNames = collectReferencedPropertyNames(propertyName);
	if (propertyNames.length < 2 || !propertyNames.every((name) => name.split("-").length === 2)) {
		return [];
	}

	const suffix = propertyNames[0]?.split("-").at(-1) ?? "";
	if (!suffix || !propertyNames.every((name) => name.endsWith(`-${suffix}`))) {
		return [];
	}

	return propertyNames.map((name) => name.split("-").at(0) ?? "");
}

function collectReferencedPropertyNames(propertyName: string): string[] {
	const syntax = getPropertySyntax(propertyName).trim();
	if (!syntax) {
		return [];
	}

	const propertyNames: string[] = [];
	const seenPropertyNames = new Set<string>();
	const syntaxAst = parseCssSyntax(syntax);
	visitCssSyntaxAst(syntaxAst, (node) => {
		if (node.type !== "Property" || !node.name || seenPropertyNames.has(node.name)) {
			return;
		}

		seenPropertyNames.add(node.name);
		if (node.name.trim()) {
			propertyNames.push(node.name);
		}
	});

	return propertyNames;
}

export function hasMeaningfulReferenceSyntaxLabels(propertyName: string): boolean {
	return collectReferencedSyntaxLabels(propertyName).length >= 2;
}
