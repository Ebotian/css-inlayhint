import { parseCssSyntax, visitCssSyntaxAst } from "../share/cssSyntax.js";
import { getPropertySyntax } from "./summary.js";

export function collectReferencedSyntaxLabels(propertyName: string): string[] {
	const syntax = getPropertySyntax(propertyName).trim();
	if (!syntax) {
		return [];
	}

	const labels: string[] = [];
	const seenPropertyNames = new Set<string>();
	const syntaxAst = parseCssSyntax(syntax);
	visitCssSyntaxAst(syntaxAst, (node) => {
		if (node.type !== "Property" || !node.name || seenPropertyNames.has(node.name)) {
			return;
		}

		seenPropertyNames.add(node.name);
		const label = node.name.split("-").filter(Boolean).at(-1) ?? "";
		if (label) {
			labels.push(label);
		}
	});

	return labels;
}

export function hasMeaningfulReferenceSyntaxLabels(propertyName: string): boolean {
	return collectReferencedSyntaxLabels(propertyName).length >= 2;
}
