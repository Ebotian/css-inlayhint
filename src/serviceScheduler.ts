import type { ProtocolDocumentVersion, ProtocolInlayHint, ProtocolPosition, ProtocolRange } from "./protocol";

export type ServiceSchedulerHint = ProtocolInlayHint;

export type ServiceSchedulerCancellationSignal = {
	aborted: boolean;
	addEventListener?(type: "abort", listener: () => void, options?: { once?: boolean }): void;
	removeEventListener?(type: "abort", listener: () => void): void;
};

export type ServiceSchedulerRequestContext = {
	signal?: ServiceSchedulerCancellationSignal;
};

export type ServiceSchedulerDocumentSnapshot = {
	file: string;
	contents: string;
	version: ProtocolDocumentVersion;
	revision: number;
};

export type ServiceSchedulerHintProducer = (
	snapshot: ServiceSchedulerDocumentSnapshot,
	range: ProtocolRange,
) => ServiceSchedulerHint[] | Promise<ServiceSchedulerHint[]>;

export type ServiceSchedulerOptions = {
	produceHints?: ServiceSchedulerHintProducer;
};

export type ServiceScheduler = {
	addDocument(file: string, contents: string, version: ProtocolDocumentVersion): void;
	updateDocument(file: string, contents: string, version: ProtocolDocumentVersion): void;
	removeDocument(file: string): void;
	inlayHints(
		file: string,
		range: ProtocolRange,
		context?: ServiceSchedulerRequestContext,
	): Promise<ServiceSchedulerHint[]>;
};

type TrackedDocument = {
	contents: string;
	version: ProtocolDocumentVersion;
	revision: number;
};

type RequestState = "ok" | "missing" | "stale" | "cancelled";

function comparePositions(left: ProtocolPosition, right: ProtocolPosition): number {
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

function isPositionBefore(position: ProtocolPosition, other: ProtocolPosition): boolean {
	return comparePositions(position, other) < 0;
}

function isPositionAfter(position: ProtocolPosition, other: ProtocolPosition): boolean {
	return comparePositions(position, other) > 0;
}

function isPositionWithinRange(position: ProtocolPosition, range: ProtocolRange): boolean {
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
	signal?: ServiceSchedulerCancellationSignal,
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

async function waitForNextMicrotask(signal?: ServiceSchedulerCancellationSignal): Promise<void> {
	if (signal?.aborted) {
		throw createRequestError("Request aborted before scheduling");
	}

	await Promise.resolve();

	if (signal?.aborted) {
		throw createRequestError("Request cancelled by client");
	}
}

function defaultProduceHints(snapshot: ServiceSchedulerDocumentSnapshot, range: ProtocolRange): ServiceSchedulerHint[] {
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

function filterHintsByRange(hints: readonly ServiceSchedulerHint[], range: ProtocolRange): ServiceSchedulerHint[] {
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

	function validateRequest(
		file: string,
		tracked: TrackedDocument | undefined,
		signal?: ServiceSchedulerCancellationSignal,
	): RequestState {
		return getRequestState(tracked, documents.get(file), signal);
	}

	function mutateDocument(file: string, contents: string, version: ProtocolDocumentVersion): void {
		const previous = documents.get(file);
		documents.set(file, {
			contents,
			version,
			revision: previous ? previous.revision + 1 : 1,
		});
	}

	return {
		addDocument(file: string, contents: string, version: ProtocolDocumentVersion): void {
			mutateDocument(file, contents, version);
		},
		updateDocument(file: string, contents: string, version: ProtocolDocumentVersion): void {
			mutateDocument(file, contents, version);
		},
		removeDocument(file: string): void {
			documents.delete(file);
		},
		async inlayHints(
			file: string,
			range: ProtocolRange,
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
