export function mapGridLineTokenLabel(token: string): string | null {
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
