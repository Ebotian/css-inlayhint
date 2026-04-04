import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { InlayHintKind, createMethodRegistry, filterInlayHintsByRange } from "../src/index.js";

describe("protocol layer", () => {
	test("standard inlay hint kinds keep their LSP values", () => {
		assert.equal(InlayHintKind.Type, 1);
		assert.equal(InlayHintKind.Parameter, 2);
	});

	test("filterProtocolHintsByRange keeps only in-range hints", () => {
		const hints = [
			{ position: { line: 1, character: 2 }, label: "keep" },
			{ position: { line: 2, character: 0 }, label: "drop" },
		];
		const range = {
			start: { line: 1, character: 0 },
			end: { line: 1, character: 10 },
		};

		assert.deepEqual(filterInlayHintsByRange(hints, range), [hints[0]]);
	});

	test("createProtocolMethodRegistry dispatches requests notifications and commands", async () => {
		const registry = createMethodRegistry();
		const events: string[] = [];

		registry.request("request/method", async (params: { value: number }, context) => {
			events.push(`request:${params.value}:${context.requestId ?? "none"}`);
			return params.value + 1;
		});
		registry.notification("notification/method", (params: { value: string }) => {
			events.push(`notification:${params.value}`);
		});
		registry.command("command/method", async (params: { value: string }) => {
			events.push(`command:${params.value}`);
			return params.value.toUpperCase();
		});

		assert.equal(registry.has("request/method"), true);
		assert.equal(registry.has("notification/method"), true);
		assert.equal(registry.has("command/method"), true);

		await registry.dispatchNotification("notification/method", { value: "ping" });
		const requestResult = await registry.dispatchRequest<{ value: number }, number>(
			"request/method",
			{ value: 41 },
			{ requestId: 7 },
		);
		const commandResult = await registry.dispatchRequest<{ value: string }, string>("command/method", {
			value: "css",
		});

		assert.equal(requestResult, 42);
		assert.equal(commandResult, "CSS");
		assert.deepEqual(events, ["notification:ping", "request:41:7", "command:css"]);
		assert.deepEqual(registry.listMethods().sort(), ["command/method", "notification/method", "request/method"]);
	});
});
