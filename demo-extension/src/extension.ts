import * as vscode from "vscode";
import { getCSSLanguageService } from "vscode-css-languageservice";
import type { Stylesheet as CSSStylesheet, TextDocument as CSSTextDocument } from "vscode-css-languageservice";

type LibraryInlayHint = {
	position: { line: number; character: number };
	label: unknown;
	kind?: number;
	paddingLeft?: boolean;
	paddingRight?: boolean;
};

function toInlayHintKind(kind: number | undefined): vscode.InlayHintKind | undefined {
	switch (kind) {
		case 1:
			return vscode.InlayHintKind.Parameter;
		case 2:
			return vscode.InlayHintKind.Type;
		default:
			return undefined;
	}
}

function toLabel(label: LibraryInlayHint["label"]): string {
	if (typeof label === "string") {
		return label;
	}
	if (Array.isArray(label)) {
		return label
			.map((part) => {
				if (typeof part === "string") {
					return part;
				}
				if (part && typeof part === "object" && "label" in part) {
					return String((part as { label: unknown }).label);
				}
				return "";
			})
			.join("");
	}
	return String(label ?? "");
}

function isInsideRange(position: vscode.Position, range: vscode.Range): boolean {
	return range.contains(position);
}

function toVsCodeHint(hint: LibraryInlayHint): vscode.InlayHint {
	const result = new vscode.InlayHint(
		new vscode.Position(hint.position.line, hint.position.character),
		toLabel(hint.label),
		toInlayHintKind(hint.kind),
	);
	result.paddingLeft = Boolean(hint.paddingLeft);
	result.paddingRight = Boolean(hint.paddingRight);
	return result;
}

export async function activate(context: vscode.ExtensionContext): Promise<void> {
	const languageService = getCSSLanguageService();
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
				[]) as LibraryInlayHint[];
			return hints
				.filter((hint) => isInsideRange(new vscode.Position(hint.position.line, hint.position.character), range))
				.map(toVsCodeHint);
		},
	};

	context.subscriptions.push(
		vscode.languages.registerInlayHintsProvider({ language: "css", scheme: "file" }, provider),
	);
}

export function deactivate(): void {}
