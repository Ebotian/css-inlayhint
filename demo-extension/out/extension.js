import * as vscode from "vscode";
import { createServiceScheduler } from "../../dist/index.js";
function normalizeInlayHintLabel(label) {
    if (typeof label === "string") {
        return label;
    }
    if (Array.isArray(label)) {
        return label.map((part) => (typeof part === "string" ? part : String(part.value))).join("");
    }
    return String(label ?? "");
}
function toVsCodeHint(hint) {
    const result = new vscode.InlayHint(new vscode.Position(hint.position.line, hint.position.character), normalizeInlayHintLabel(hint.label), hint.kind);
    result.paddingLeft = Boolean(hint.paddingLeft);
    result.paddingRight = Boolean(hint.paddingRight);
    return result;
}
function toLspRange(range) {
    return {
        start: { line: range.start.line, character: range.start.character },
        end: { line: range.end.line, character: range.end.character },
    };
}
export async function activate(context) {
    const scheduler = createServiceScheduler();
    const changeEmitter = new vscode.EventEmitter();
    const trackedDocuments = new Map();
    for (const document of vscode.workspace.textDocuments) {
        if (document.languageId === "css") {
            trackedDocuments.set(document.uri.toString(), document.version);
            scheduler.addDocument(document.uri.toString(), document.getText(), document.version);
        }
    }
    context.subscriptions.push(changeEmitter);
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument((document) => {
        if (document.languageId === "css") {
            trackedDocuments.set(document.uri.toString(), document.version);
            scheduler.addDocument(document.uri.toString(), document.getText(), document.version);
            changeEmitter.fire(undefined);
        }
    }));
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument((event) => {
        if (event.document.languageId === "css") {
            trackedDocuments.set(event.document.uri.toString(), event.document.version);
            scheduler.updateDocument(event.document.uri.toString(), event.document.getText(), event.document.version);
            changeEmitter.fire(undefined);
        }
    }), vscode.workspace.onDidCloseTextDocument((document) => {
        if (document.languageId === "css") {
            trackedDocuments.delete(document.uri.toString());
            scheduler.removeDocument(document.uri.toString());
            changeEmitter.fire(undefined);
        }
    }), vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration("editor.inlayHints")) {
            changeEmitter.fire(undefined);
        }
    }));
    const provider = {
        onDidChangeInlayHints: changeEmitter.event,
        async provideInlayHints(document, range, token) {
            if (token.isCancellationRequested) {
                return [];
            }
            const abortController = new AbortController();
            const cancellationSubscription = token.onCancellationRequested(() => abortController.abort());
            const uri = document.uri.toString();
            if (!trackedDocuments.has(uri)) {
                trackedDocuments.set(uri, document.version);
                scheduler.addDocument(uri, document.getText(), document.version);
            }
            try {
                const hints = await scheduler.inlayHints(uri, toLspRange(range), { signal: abortController.signal });
                return hints.map(toVsCodeHint);
            }
            finally {
                cancellationSubscription.dispose();
            }
        },
    };
    context.subscriptions.push(vscode.languages.registerInlayHintsProvider({ language: "css", scheme: "file" }, provider));
}
export function deactivate() { }
//# sourceMappingURL=extension.js.map