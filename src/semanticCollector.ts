import { getCSSLanguageService, TextDocument } from "vscode-css-languageservice";
import type { Range } from "vscode-languageserver";

export type SemanticCollectorCandidate = {
	kind: "declaration";
	propertyName: string;
	valueText: string;
	range: Range;
};

export type SemanticCollector = {
	collectCandidates(sourceText: string): SemanticCollectorCandidate[];
};

type CssNode = {
	type?: number;
	offset: number;
	length: number;
	end: number;
	getText(): string;
	getChildren(): CssNode[];
	getProperty?(): CssNode | null;
	getValue?(): CssNode | null;
	getFullPropertyName?(): string;
};

const cssLanguageService = getCSSLanguageService();

function createDocument(sourceText: string): TextDocument {
	return TextDocument.create("untitled://semantic-collector.css", "css", 1, sourceText);
}

function createRange(document: TextDocument, startOffset: number, endOffset: number): Range {
	return {
		start: document.positionAt(startOffset),
		end: document.positionAt(endOffset),
	};
}

function isDeclarationNode(node: CssNode): boolean {
	return typeof node.getProperty === "function" && typeof node.getValue === "function";
}

function collectDeclarationCandidate(document: TextDocument, node: CssNode): SemanticCollectorCandidate | null {
	if (!isDeclarationNode(node)) {
		return null;
	}

	const propertyNode = node.getProperty?.();
	const valueNode = node.getValue?.();

	if (!propertyNode || !valueNode) {
		return null;
	}

	const propertyName =
		typeof node.getFullPropertyName === "function" ? node.getFullPropertyName() : propertyNode.getText();
	const valueText = valueNode.getText().trim();

	return {
		kind: "declaration",
		propertyName,
		valueText,
		range: createRange(document, propertyNode.offset, valueNode.end),
	};
}

function visitNode(document: TextDocument, node: CssNode, candidates: SemanticCollectorCandidate[]): void {
	const candidate = collectDeclarationCandidate(document, node);
	if (candidate) {
		candidates.push(candidate);
	}

	const children = typeof node.getChildren === "function" ? node.getChildren() : [];
	for (const child of children) {
		visitNode(document, child, candidates);
	}
}

export function createSemanticCollector(): SemanticCollector {
	return {
		collectCandidates(sourceText: string): SemanticCollectorCandidate[] {
			const document = createDocument(sourceText);
			const stylesheet = cssLanguageService.parseStylesheet(document) as unknown as CssNode;
			const candidates: SemanticCollectorCandidate[] = [];

			visitNode(document, stylesheet, candidates);

			return candidates;
		},
	};
}
