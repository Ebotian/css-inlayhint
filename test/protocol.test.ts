import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
	ProtocolInlayHintKind,
	createProtocolMethodRegistry,
	filterProtocolHintsByRange,
	normalizeProtocolLabel,
	toProtocolInlayHintKind,
} from "../src/index.js";

describe("protocol layer", () => {
	test("normalizeProtocolLabel keeps plain strings", () => {
		assert.equal(normalizeProtocolLabel("compile-ok"), "compile-ok");
	});

	test("normalizeProtocolLabel flattens label parts", () => {
		assert.equal(
			normalizeProtocolLabel([
				"margin:",
				{ label: " top" },
				"/",
				{ label: "bottom" },
			]),
			"margin: top/bottom",
		);
	});

	test("toProtocolInlayHintKind maps supported kinds only", () => {
		assert.equal(toProtocolInlayHintKind(1), ProtocolInlayHintKind.Parameter);
		assert.equal(toProtocolInlayHintKind(2), ProtocolInlayHintKind.Type);
		assert.equal(toProtocolInlayHintKind(0), undefined);
		assert.equal(toProtocolInlayHintKind(undefined), undefined);
	});

	test("filterProtocolHintsByRange keeps only in-range hints", () => {
		const hints = [
			{ position: { line: 1, character: 2 }, label: "keep" },
			{ position: { line: 2, character: 0 }, label: "drop" },
		];
		const range = {
			contains(position: { line: number; character: number }) {
				return position.line === 1;
			},
		};

		assert.deepEqual(filterProtocolHintsByRange(hints, range), [hints[0]]);
	});

	test("createProtocolMethodRegistry dispatches requests notifications and commands", async () => {
		const registry = createProtocolMethodRegistry();
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
		assert.deepEqual(registry.listMethods().sort(), [
			"command/method",
			"notification/method",
			"request/method",
		]);
	});
});