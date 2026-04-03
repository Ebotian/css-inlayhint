import type { InlayHint, Position, Range } from "vscode-languageserver";

export type ServiceSchedulerDocumentVersion = number;

export type ServiceSchedulerHint = InlayHint;

export type ServiceSchedulerRequestContext = {
	signal?: AbortSignal;
};

export type ServiceSchedulerDocumentSnapshot = {
	file: string;
	contents: string;
	version: ServiceSchedulerDocumentVersion;
	revision: number;
};

export type ServiceSchedulerHintProducer = (
	snapshot: ServiceSchedulerDocumentSnapshot,
	range: Range,
) => ServiceSchedulerHint[] | Promise<ServiceSchedulerHint[]>;

export type ServiceSchedulerOptions = {
	produceHints?: ServiceSchedulerHintProducer;
};

export type ServiceScheduler = {
	addDocument(file: string, contents: string, version: ServiceSchedulerDocumentVersion): void;
	updateDocument(file: string, contents: string, version: ServiceSchedulerDocumentVersion): void;
	removeDocument(file: string): void;
	inlayHints(file: string, range: Range, context?: ServiceSchedulerRequestContext): Promise<ServiceSchedulerHint[]>;
};

type TrackedDocument = {
	contents: string;
	version: ServiceSchedulerDocumentVersion;
	revision: number;
};

type RequestState = "ok" | "missing" | "stale" | "cancelled";

function comparePositions(left: Position, right: Position): number {
	if (left.line < right.line) {
		return -1;
	}
	if (left.line > right.line) {
		return 1;
	}
	if (left.character < right.character) {
		return -1;
	}
	if (left.character > right.character) {
		return 1;
	}
	return 0;
}

function isPositionBefore(position: Position, other: Position): boolean {
	return comparePositions(position, other) < 0;
}

function isPositionAfter(position: Position, other: Position): boolean {
	return comparePositions(position, other) > 0;
}

function isPositionWithinRange(position: Position, range: Range): boolean {
	return comparePositions(position, range.start) >= 0 && comparePositions(position, range.end) <= 0;
}

function isAbortError(error: unknown): boolean {
	return error instanceof Error && /abort|cancel|stale/i.test(error.message);
}

function createRequestError(message: string): Error {
	return new Error(message);
}

function createSnapshot(file: string, tracked: TrackedDocument): ServiceSchedulerDocumentSnapshot {
	return {
		file,
		contents: tracked.contents,
		version: tracked.version,
		revision: tracked.revision,
	};
}

function getRequestState(
	tracked: TrackedDocument | undefined,
	current: TrackedDocument | undefined,
	signal?: AbortSignal,
): RequestState {
	if (signal?.aborted) {
		return "cancelled";
	}
	if (!tracked || !current) {
		return "missing";
	}
	if (tracked.revision !== current.revision) {
		return "stale";
	}
	return "ok";
}

function createRequestStateError(file: string, state: Exclude<RequestState, "ok">): Error {
	switch (state) {
		case "cancelled":
			return createRequestError(`Request aborted for ${file}`);
		case "missing":
			return createRequestError(`Document removed or missing: ${file}`);
		case "stale":
			return createRequestError(`Stale request for ${file}`);
	}
}

async function waitForNextMicrotask(signal?: AbortSignal): Promise<void> {
	if (signal?.aborted) {
		throw createRequestError("Request aborted before scheduling");
	}

	await Promise.resolve();

	if (signal?.aborted) {
		throw createRequestError("Request cancelled by client");
	}
}

function defaultProduceHints(snapshot: ServiceSchedulerDocumentSnapshot, range: Range): ServiceSchedulerHint[] {
	if (!snapshot.contents) {
		return [];
	}

	const position = range.start;
	if (!isPositionWithinRange(position, range)) {
		return [];
	}

	return [
		{
			position,
			label: snapshot.contents,
		} satisfies ServiceSchedulerHint,
	];
}

function filterHintsByRange(hints: readonly ServiceSchedulerHint[], range: Range): ServiceSchedulerHint[] {
	return hints.filter((hint) => isPositionWithinRange(hint.position, range));
}

export function createServiceScheduler(options: ServiceSchedulerOptions = {}): ServiceScheduler {
	const documents = new Map<string, TrackedDocument>();
	const produceHints = options.produceHints ?? defaultProduceHints;

	function requireTrackedDocument(file: string): TrackedDocument {
		const tracked = documents.get(file);
		if (!tracked) {
			throw createRequestError(`Document removed or missing: ${file}`);
		}
		return tracked;
	}

	function validateRequest(file: string, tracked: TrackedDocument | undefined, signal?: AbortSignal): RequestState {
		return getRequestState(tracked, documents.get(file), signal);
	}

	function mutateDocument(file: string, contents: string, version: ServiceSchedulerDocumentVersion): void {
		const previous = documents.get(file);
		documents.set(file, {
			contents,
			version,
			revision: previous ? previous.revision + 1 : 1,
		});
	}

	return {
		addDocument(file: string, contents: string, version: ServiceSchedulerDocumentVersion): void {
			mutateDocument(file, contents, version);
		},
		updateDocument(file: string, contents: string, version: ServiceSchedulerDocumentVersion): void {
			mutateDocument(file, contents, version);
		},
		removeDocument(file: string): void {
			documents.delete(file);
		},
		async inlayHints(
			file: string,
			range: Range,
			context: ServiceSchedulerRequestContext = {},
		): Promise<ServiceSchedulerHint[]> {
			const tracked = requireTrackedDocument(file);
			const snapshot = createSnapshot(file, tracked);

			await waitForNextMicrotask(context.signal);

			const requestState = validateRequest(file, tracked, context.signal);
			if (requestState !== "ok") {
				throw createRequestStateError(file, requestState);
			}
			const hints = await produceHints(snapshot, range);
			return filterHintsByRange(hints, range);
		},
	};
}

export function isServiceSchedulerAbortError(error: unknown): boolean {
	return isAbortError(error);
}
