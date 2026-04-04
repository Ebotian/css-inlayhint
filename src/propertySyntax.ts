import { createRequire } from "node:module";

type StandardPropertyRecord = {
	name: string;
	syntax?: string;
	values?: { name: string }[];
	status?: string;
};

type StandardPropertyWithoutName = Omit<StandardPropertyRecord, "name">;

type StandardCssData = {
	properties: StandardPropertyRecord[];
};

const nodeRequire = createRequire(__filename);
const shorthandApi = nodeRequire("css-shorthand-properties") as {
	default?: {
		expand?(propertyName: string): string[];
	};
	expand?(propertyName: string): string[];
};
const builtInCssData = nodeRequire("vscode-css-languageservice/lib/esm/data/webCustomData.js") as {
	cssData: StandardCssData;
};
const mdnProperties = nodeRequire("mdn-data/css/properties.json") as Record<string, StandardPropertyWithoutName>;

const PROPERTY_BY_NAME = new Map<string, StandardPropertyRecord>();

for (const property of builtInCssData.cssData.properties) {
	PROPERTY_BY_NAME.set(property.name, property);
}

for (const [propertyName, property] of Object.entries(mdnProperties)) {
	if (!PROPERTY_BY_NAME.has(propertyName)) {
		PROPERTY_BY_NAME.set(propertyName, {
			name: propertyName,
			syntax: property.syntax,
			values: property.values,
			status: property.status,
		});
	}
}

export function getPropertySyntax(propertyName: string): string {
	return PROPERTY_BY_NAME.get(propertyName)?.syntax ?? "";
}

export function getPropertyStatus(propertyName: string): string {
	return PROPERTY_BY_NAME.get(propertyName)?.status ?? "standard";
}

export function listPropertyNames(): string[] {
	return [...PROPERTY_BY_NAME.keys()];
}

export function isGridLineProperty(propertyName: string): boolean {
	return getPropertySyntax(propertyName).includes("<grid-line>");
}

export function usesSlashSeparatedGridLineSyntax(propertyName: string): boolean {
	const syntax = getPropertySyntax(propertyName);
	return syntax.includes("<grid-line>") && syntax.includes("/");
}

export function getDirectionalFamily(propertyName: string): readonly string[] | null {
	const expanded = shorthandApi?.default?.expand?.(propertyName) ?? shorthandApi.expand?.(propertyName) ?? [];
	if (!Array.isArray(expanded) || expanded.length !== 4) {
		return null;
	}

	const directions = expanded
		.map(extractSingleDirection)
		.filter((direction): direction is DirectionalName => Boolean(direction));
	if (directions.length !== 4) {
		return null;
	}

	const uniqueDirections = new Set(directions);
	if (uniqueDirections.size !== 4) {
		return null;
	}

	const orderedDirections = [...uniqueDirections].sort(
		(left, right) => DIRECTION_ORDER.indexOf(left) - DIRECTION_ORDER.indexOf(right),
	);
	if (orderedDirections.length !== 4) {
		return null;
	}

	if (orderedDirections.some((direction, index) => direction !== DIRECTION_ORDER[index])) {
		return null;
	}

	return orderedDirections;
}

const DIRECTION_ORDER = ["top", "right", "bottom", "left"] as const;

type DirectionalName = (typeof DIRECTION_ORDER)[number];

function extractSingleDirection(name: string): DirectionalName | null {
	const parts = name.split("-").filter(Boolean);
	const directions = parts.filter((part): part is DirectionalName => DIRECTION_ORDER.includes(part as DirectionalName));
	if (directions.length !== 1) {
		return null;
	}

	return directions[0] ?? null;
}
