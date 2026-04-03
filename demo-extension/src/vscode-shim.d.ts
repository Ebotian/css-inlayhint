declare module "vscode" {
	export interface Disposable {
		dispose(): void;
	}

	export type Event<T> = (listener: (e: T) => unknown) => Disposable;

	export interface CancellationToken {
		readonly isCancellationRequested: boolean;
	}

	export interface TextDocument {
		readonly languageId: string;
	}

	export interface TextDocumentChangeEvent {
		readonly document: TextDocument;
	}

	export interface ConfigurationChangeEvent {
		affectsConfiguration(section: string): boolean;
	}

	export class Position {
		constructor(line: number, character: number);
		readonly line: number;
		readonly character: number;
	}

	export class Range {
		constructor(start: Position, end: Position);
		contains(position: Position): boolean;
	}

	export enum InlayHintKind {
		Parameter = 1,
		Type = 2,
	}

	export class InlayHint {
		constructor(position: Position, label: string, kind?: InlayHintKind);
		paddingLeft: boolean;
		paddingRight: boolean;
	}

	export interface InlayHintsProvider {
		onDidChangeInlayHints?: Event<void>;
		provideInlayHints(
			document: TextDocument,
			range: Range,
			token: CancellationToken,
		): InlayHint[] | Promise<InlayHint[]>;
	}

	export class EventEmitter<T> implements Disposable {
		constructor();
		readonly event: Event<T>;
		fire(data: T): void;
		dispose(): void;
	}

	export interface ExtensionContext {
		subscriptions: Disposable[];
	}

	export namespace workspace {
		function onDidChangeTextDocument(listener: (event: TextDocumentChangeEvent) => unknown): Disposable;
		function onDidChangeConfiguration(listener: (event: ConfigurationChangeEvent) => unknown): Disposable;
	}

	export namespace languages {
		function registerInlayHintsProvider(
			selector: { language: string; scheme?: string },
			provider: InlayHintsProvider,
		): Disposable;
	}
}
