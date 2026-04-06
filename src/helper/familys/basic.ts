import type { CssHintInstruction } from "../../collector.js";
import { collectShorthandValueTokens } from "../classifyNormalize.js";
import { getDirectionalFamily } from "../calculation.js";
import { isBorderRadiusProperty } from "../structuredShorthand.js";

export function mapBasicLabel(instruction: CssHintInstruction): string | null {
	if (instruction.shape?.family === "box-sides") {
		return mapBoxSideLabel(instruction.propertyName, instruction.shape.tokenCount);
	}

	if (instruction.shape?.family === "box-corners") {
		return mapCornerLabel(instruction.shape.tokenCount);
	}

	if (isBorderRadiusProperty(instruction.propertyName)) {
		return mapCornerLabel(instruction.tokenCount);
	}

	const directionalLabel = mapBoxSideLabel(instruction.propertyName, instruction.tokenCount);
	if (directionalLabel) {
		return directionalLabel;
	}

	return null;
}

export function mapGridLineLabelSlots(valueText: string): string[] | null {
	const tokenTexts = collectShorthandValueTokens(valueText)
		.map((token) => token.text.trim())
		.filter(Boolean);
	if (tokenTexts.length === 0) {
		return null;
	}

	return tokenTexts.map((tokenText) => mapGridLineTokenLabel(tokenText) ?? "");
}

export function mapBoxSideLabel(propertyName: string, tokenCount: number): string | null {
	const directions = getDirectionalFamily(propertyName);
	if (!directions) {
		return null;
	}

	switch (tokenCount) {
		case 1:
			return "all";
		case 2:
			return `${directions[0]}/${directions[2]}, ${directions[1]}/${directions[3]}`;
		case 3:
			return `${directions[0]}, ${directions[1]}/${directions[3]}, ${directions[2]}`;
		case 4:
			return directions.join(", ");
		default:
			return null;
	}
}

export function mapCornerLabel(tokenCount: number): string | null {
	switch (tokenCount) {
		case 1:
			return "all";
		case 2:
			return `${formatCornerName("top-left")}/${formatCornerName("bottom-right")}, ${formatCornerName("top-right")}/${formatCornerName("bottom-left")}`;
		case 3:
			return `${formatCornerName("top-left")}, ${formatCornerName("top-right")}/${formatCornerName("bottom-left")}, ${formatCornerName("bottom-right")}`;
		case 4:
			return ["top-left", "top-right", "bottom-right", "bottom-left"].map(formatCornerName).join(", ");
		default:
			return null;
	}
}

function mapGridAreaTokenLabel(token: string): string | null {
	if (token === "auto") {
		return null;
	}

	if (token === "span") {
		return null;
	}

	if (
		token === "inherit" ||
		token === "initial" ||
		token === "unset" ||
		token === "revert" ||
		token === "revert-layer"
	) {
		return null;
	}

	if (/^[+-]?\d+$/.test(token)) {
		return "line";
	}

	if (/^[a-z_][a-z0-9_-]*$/i.test(token)) {
		return "name";
	}

	return null;
}

function mapGridLineTokenLabel(token: string): string | null {
	if (token === "auto") {
		return null;
	}

	if (token === "span") {
		return null;
	}

	if (
		token === "inherit" ||
		token === "initial" ||
		token === "unset" ||
		token === "revert" ||
		token === "revert-layer"
	) {
		return null;
	}

	if (/^[+-]?\d+$/.test(token)) {
		return "line";
	}

	if (/^[a-z_][a-z0-9_-]*$/i.test(token)) {
		return "name";
	}

	return "line";
}

function formatCornerName(name: string): string {
	const parts = name.split("-");
	if (parts.length !== 2) {
		return name;
	}

	const [prefix, suffix] = parts;
	if (suffix !== "left" && suffix !== "right") {
		return name;
	}

	return `${prefix}-${suffix === "left" ? "L" : "R"}`;
}
