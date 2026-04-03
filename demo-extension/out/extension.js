import * as vscode from "vscode";
import { getCSSLanguageService } from "../../lib/esm/cssLanguageService.js";
function toInlayHintKind(kind) {
    switch (kind) {
        case 1:
            return vscode.InlayHintKind.Parameter;
        case 2:
            return vscode.InlayHintKind.Type;
        default:
            return undefined;
    }
}
function toLabel(label) {
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
                return String(part.label);
            }
            return "";
        })
            .join("");
    }
    return String(label ?? "");
}
function isInsideRange(position, range) {
    return range.contains(position);
}
function toVsCodeHint(hint) {
    const result = new vscode.InlayHint(new vscode.Position(hint.position.line, hint.position.character), toLabel(hint.label), toInlayHintKind(hint.kind));
    result.paddingLeft = Boolean(hint.paddingLeft);
    result.paddingRight = Boolean(hint.paddingRight);
    return result;
}
export async function activate(context) {
    const languageService = getCSSLanguageService();
    const changeEmitter = new vscode.EventEmitter();
    context.subscriptions.push(changeEmitter);
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument((event) => {
        if (event.document.languageId === "css") {
            changeEmitter.fire(undefined);
        }
    }), vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration("editor.inlayHints")) {
            changeEmitter.fire(undefined);
        }
    }));
    const provider = {
        onDidChangeInlayHints: changeEmitter.event,
        provideInlayHints(document, range, token) {
            if (token.isCancellationRequested) {
                return [];
            }
            const stylesheet = languageService.parseStylesheet(document);
            const hints = (languageService.doInlayHints?.(document, stylesheet) ??
                []);
            return hints
                .filter((hint) => isInsideRange(new vscode.Position(hint.position.line, hint.position.character), range))
                .map(toVsCodeHint);
        },
    };
    context.subscriptions.push(vscode.languages.registerInlayHintsProvider({ language: "css", scheme: "file" }, provider));
}
export function deactivate() { }
//# sourceMappingURL=extension.js.map