import { type InlayHint, type Position, type Range } from "vscode-languageserver";

export { InlayHintKind } from "vscode-languageserver";
export type { InlayHint, InlayHintLabelPart, Position, Range } from "vscode-languageserver";

export type RequestContext = {
	requestId?: string | number;
	traceName?: string;
	timeStarted?: number;
	cancellationRequested?: boolean;
};

export type MethodHandler<TParams, TResult> = (params: TParams, context: RequestContext) => TResult | Promise<TResult>;

export type NotificationHandler<TParams> = (params: TParams, context: RequestContext) => void | Promise<void>;

function normalizeInlayHintLabel(label: InlayHint["label"]): string {
	if (typeof label === "string") {
		return label;
	}
	if (Array.isArray(label)) {
		return label.map((part) => (typeof part === "string" ? part : String(part.value))).join("");
	}
	return String(label ?? "");
}

function comparePositions(left: Position, right: Position): number {
	if (left.line !== right.line) {
		return left.line - right.line;
	}
	return left.character - right.character;
}

export function isPositionInsideRange(position: Position, range: Range): boolean {
	return comparePositions(position, range.start) >= 0 && comparePositions(position, range.end) <= 0;
}

export function filterInlayHintsByRange(hints: readonly InlayHint[], range: Range): InlayHint[] {
	return hints.filter((hint) => isPositionInsideRange(hint.position, range));
}

export interface MethodRegistry {
	request<TParams, TResult>(method: string, handler: MethodHandler<TParams, TResult>): MethodRegistry;
	notification<TParams>(method: string, handler: NotificationHandler<TParams>): MethodRegistry;
	command<TParams, TResult>(method: string, handler: MethodHandler<TParams, TResult>): MethodRegistry;
	has(method: string): boolean;
	dispatchRequest<TParams, TResult>(method: string, params: TParams, context?: RequestContext): Promise<TResult>;
	dispatchNotification<TParams>(method: string, params: TParams, context?: RequestContext): Promise<void>;
	listMethods(): string[];
}

export function createMethodRegistry(): MethodRegistry {
	const requestHandlers = new Map<string, MethodHandler<unknown, unknown>>();
	const notificationHandlers = new Map<string, NotificationHandler<unknown>>();
	const commandHandlers = new Map<string, MethodHandler<unknown, unknown>>();

	const registry: MethodRegistry = {
		request<TParams, TResult>(method: string, handler: MethodHandler<TParams, TResult>): MethodRegistry {
			requestHandlers.set(method, handler as MethodHandler<unknown, unknown>);
			return registry;
		},
		notification<TParams>(method: string, handler: NotificationHandler<TParams>): MethodRegistry {
			notificationHandlers.set(method, handler as NotificationHandler<unknown>);
			return registry;
		},
		command<TParams, TResult>(method: string, handler: MethodHandler<TParams, TResult>): MethodRegistry {
			commandHandlers.set(method, handler as MethodHandler<unknown, unknown>);
			return registry;
		},
		has(method: string): boolean {
			return requestHandlers.has(method) || notificationHandlers.has(method) || commandHandlers.has(method);
		},
		async dispatchRequest<TParams, TResult>(
			method: string,
			params: TParams,
			context: RequestContext = {},
		): Promise<TResult> {
			const handler = requestHandlers.get(method) ?? commandHandlers.get(method);
			if (!handler) {
				throw new Error(`No request handler registered for ${method}`);
			}
			return (await handler(params, context)) as TResult;
		},
		async dispatchNotification<TParams>(method: string, params: TParams, context: RequestContext = {}): Promise<void> {
			const handler = notificationHandlers.get(method);
			if (!handler) {
				throw new Error(`No notification handler registered for ${method}`);
			}
			await handler(params, context);
		},
		listMethods(): string[] {
			return [...requestHandlers.keys(), ...notificationHandlers.keys(), ...commandHandlers.keys()];
		},
	};

	return registry;
}
