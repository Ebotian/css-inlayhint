"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
async function loadServiceSchedulerModule() {
    try {
        return require("../../dist/index.js");
    }
    catch (error) {
        if (error instanceof Error && error.message.includes("Cannot find module")) {
            return require("../dist/index.js");
        }
        throw error;
    }
}
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
async function activate(context) {
    const { createServiceScheduler } = await loadServiceSchedulerModule();
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
function deactivate() { }
//# sourceMappingURL=extension.js.map