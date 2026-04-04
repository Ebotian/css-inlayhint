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
