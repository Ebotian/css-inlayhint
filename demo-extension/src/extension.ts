import * as vscode from "vscode";
import {
	filterProtocolHintsByRange,
	normalizeProtocolLabel,
	ProtocolInlayHint,
	toProtocolInlayHintKind,
} from "../../dist/index.js";
import { getCSSLanguageService } from "vscode-css-languageservice";
import type { Stylesheet as CSSStylesheet, TextDocument as CSSTextDocument } from "vscode-css-languageservice";

type CSSLanguageServiceWithOptionalInlayHints = ReturnType<typeof getCSSLanguageService> & {
	doInlayHints?: (document: CSSTextDocument, stylesheet: CSSStylesheet) => ProtocolInlayHint[];
};

function toVsCodeHint(hint: ProtocolInlayHint): vscode.InlayHint {
	const result = new vscode.InlayHint(
		new vscode.Position(hint.position.line, hint.position.character),
		normalizeProtocolLabel(hint.label),
		toProtocolInlayHintKind(hint.kind) as vscode.InlayHintKind | undefined,
	);
	result.paddingLeft = Boolean(hint.paddingLeft);
	result.paddingRight = Boolean(hint.paddingRight);
	return result;
}

export async function activate(context: vscode.ExtensionContext): Promise<void> {
	const languageService = getCSSLanguageService() as CSSLanguageServiceWithOptionalInlayHints;
	const changeEmitter = new vscode.EventEmitter<void>();

	context.subscriptions.push(changeEmitter);
	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument((event: vscode.TextDocumentChangeEvent) => {
			if (event.document.languageId === "css") {
				changeEmitter.fire(undefined);
			}
		}),
		vscode.workspace.onDidChangeConfiguration((event: vscode.ConfigurationChangeEvent) => {
			if (event.affectsConfiguration("editor.inlayHints")) {
				changeEmitter.fire(undefined);
			}
		}),
	);

	const provider: vscode.InlayHintsProvider = {
		onDidChangeInlayHints: changeEmitter.event,
		provideInlayHints(
			document: vscode.TextDocument,
			range: vscode.Range,
			token: vscode.CancellationToken,
		): vscode.InlayHint[] {
			if (token.isCancellationRequested) {
				return [];
			}

			const stylesheet = languageService.parseStylesheet(document as unknown as CSSTextDocument) as CSSStylesheet;
			const hints = (languageService.doInlayHints?.(document as unknown as CSSTextDocument, stylesheet) ??
				[]) as ProtocolInlayHint[];
			return filterProtocolHintsByRange(hints, range).map(toVsCodeHint);
		},
	};

	context.subscriptions.push(
		vscode.languages.registerInlayHintsProvider({ language: "css", scheme: "file" }, provider),
	);
}

export function deactivate(): void {}
