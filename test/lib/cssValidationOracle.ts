import { getCSSLanguageService, TextDocument } from "vscode-css-languageservice";
import type { CssValidationOracle } from "./cssCaseModel.js";

const cssLanguageService = getCSSLanguageService();

export function createCssValidationOracle(): CssValidationOracle {
	return {
		validate(code: string) {
			const document = TextDocument.create("test://generated.css", "css", 1, code);
			const stylesheet = cssLanguageService.parseStylesheet(document);
			return cssLanguageService.doValidation(document, stylesheet);
		},
	};
}
