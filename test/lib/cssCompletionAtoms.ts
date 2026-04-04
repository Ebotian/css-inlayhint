import { getCSSLanguageService, TextDocument } from "vscode-css-languageservice";
import { classifyStandardText as classifyStandardCssText } from "./old/cssStandardAtoms.js";
import type { CssValueAtom } from "./cssCaseModel.js";

type DefinitionSyntaxNode = {
	type: string;
	name?: string;
	value?: string;
};

type CssLanguageService = ReturnType<typeof getCSSLanguageService>;

const cssLanguageService: CssLanguageService = getCSSLanguageService();

export function collectAtomsFromCompletions(propertyName: string, allowsColor: boolean): CssValueAtom[] {
	const document = TextDocument.create("test://completion-probe.css", "css", 1, `.probe { ${propertyName}: `);
	const stylesheet = cssLanguageService.parseStylesheet(document);
	const position = document.positionAt(document.getText().length);
	const completionResult = cssLanguageService.doComplete(document, position, stylesheet);
	const atoms: CssValueAtom[] = [];

	for (const item of completionResult.items) {
		const atom = classifyStandardCssText(item.textEdit?.newText ?? item.label, { allowsColor });
		if (atom) {
			atoms.push(atom);
		}
	}

	return atoms;
}
