export type ProtocolUri = string;

export type ProtocolPosition = {
	line: number;
	character: number;
};

export type ProtocolRange = {
	start: ProtocolPosition;
	end: ProtocolPosition;
};

export type ProtocolRangeLike = {
	contains(position: ProtocolPosition): boolean;
};

export type ProtocolDocumentVersion = string | number | null;

export interface ProtocolTextDocumentLike {
	uri: ProtocolUri;
	version?: ProtocolDocumentVersion;
	languageId?: string;
	getText(range?: ProtocolRange): string;
	positionAt(offset: number): ProtocolPosition;
	offsetAt(position: ProtocolPosition): number;
}

export type ProtocolRequestContext = {
	requestId?: string | number;
	traceName?: string;
	timeStarted?: number;
	cancellationRequested?: boolean;
};

export type ProtocolInlayHintLabelPart = {
	label: unknown;
};

export type ProtocolInlayHintLabel = string | ProtocolInlayHintLabelPart[] | unknown;

export type ProtocolInlayHint = {
	position: ProtocolPosition;
	label: ProtocolInlayHintLabel;
	kind?: number;
	paddingLeft?: boolean;
	paddingRight?: boolean;
};

export enum ProtocolInlayHintKind {
	Parameter = 1,
	Type = 2,
}

export interface ProtocolFeatureEnvelope<TPayload> {
	feature: string;
	payload: TPayload;
	source?: string;
	revision?: ProtocolDocumentVersion;
	confidence?: number;
	tags?: string[];
}

export type ProtocolMethodHandler<TParams, TResult> = (
	params: TParams,
	context: ProtocolRequestContext,
) => TResult | Promise<TResult>;

export type ProtocolNotificationHandler<TParams> = (
	params: TParams,
	context: ProtocolRequestContext,
) => void | Promise<void>;

export function normalizeProtocolLabel(label: ProtocolInlayHintLabel): string {
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
					return String((part as ProtocolInlayHintLabelPart).label);
				}
				return "";
			})
			.join("");
	}
	return String(label ?? "");
}

export function isProtocolPositionInsideRange(position: ProtocolPosition, range: ProtocolRangeLike): boolean {
	return range.contains(position);
}

export function filterProtocolHintsByRange(
	hints: readonly ProtocolInlayHint[],
	range: ProtocolRangeLike,
): ProtocolInlayHint[] {
	return hints.filter((hint) => isProtocolPositionInsideRange(hint.position, range));
}

export interface ProtocolMethodRegistry {
	request<TParams, TResult>(method: string, handler: ProtocolMethodHandler<TParams, TResult>): ProtocolMethodRegistry;
	notification<TParams>(method: string, handler: ProtocolNotificationHandler<TParams>): ProtocolMethodRegistry;
	command<TParams, TResult>(method: string, handler: ProtocolMethodHandler<TParams, TResult>): ProtocolMethodRegistry;
	has(method: string): boolean;
	dispatchRequest<TParams, TResult>(
		method: string,
		params: TParams,
		context?: ProtocolRequestContext,
	): Promise<TResult>;
	dispatchNotification<TParams>(method: string, params: TParams, context?: ProtocolRequestContext): Promise<void>;
	listMethods(): string[];
}

export function createProtocolMethodRegistry(): ProtocolMethodRegistry {
	const requestHandlers = new Map<string, ProtocolMethodHandler<unknown, unknown>>();
	const notificationHandlers = new Map<string, ProtocolNotificationHandler<unknown>>();
	const commandHandlers = new Map<string, ProtocolMethodHandler<unknown, unknown>>();

	const registry: ProtocolMethodRegistry = {
		request<TParams, TResult>(
			method: string,
			handler: ProtocolMethodHandler<TParams, TResult>,
		): ProtocolMethodRegistry {
			requestHandlers.set(method, handler as ProtocolMethodHandler<unknown, unknown>);
			return registry;
		},
		notification<TParams>(method: string, handler: ProtocolNotificationHandler<TParams>): ProtocolMethodRegistry {
			notificationHandlers.set(method, handler as ProtocolNotificationHandler<unknown>);
			return registry;
		},
		command<TParams, TResult>(
			method: string,
			handler: ProtocolMethodHandler<TParams, TResult>,
		): ProtocolMethodRegistry {
			commandHandlers.set(method, handler as ProtocolMethodHandler<unknown, unknown>);
			return registry;
		},
		has(method: string): boolean {
			return requestHandlers.has(method) || notificationHandlers.has(method) || commandHandlers.has(method);
		},
		async dispatchRequest<TParams, TResult>(
			method: string,
			params: TParams,
			context: ProtocolRequestContext = {},
		): Promise<TResult> {
			const handler = requestHandlers.get(method) ?? commandHandlers.get(method);
			if (!handler) {
				throw new Error(`No request handler registered for ${method}`);
			}
			return (await handler(params, context)) as TResult;
		},
		async dispatchNotification<TParams>(
			method: string,
			params: TParams,
			context: ProtocolRequestContext = {},
		): Promise<void> {
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

export function toProtocolInlayHintKind(kind: number | undefined): ProtocolInlayHintKind | undefined {
	switch (kind) {
		case ProtocolInlayHintKind.Parameter:
		case ProtocolInlayHintKind.Type:
			return kind;
		default:
			return undefined;
	}
}
