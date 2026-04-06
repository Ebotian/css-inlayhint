import { buildMdnPropertyUrl } from "./getFormalSyntax.js";
import { extractMdnDefinitionEntries } from "./mdnSections.js";

export type MdnValuesPage = {
	propertyName: string;
	url: string;
	values: MdnValueEntry[];
	uncertain: boolean;
	verified: boolean;
};

export type MdnValueEntry = {
	id: string;
	label: string;
	description: string;
};

export type MdnValuesOptions = {
	baseUrl?: string;
	fetchImpl?: typeof fetch;
	html?: string;
	verifyOnline?: boolean;
};

export async function getMdnValues(propertyName: string, options: MdnValuesOptions = {}): Promise<MdnValuesPage> {
	const baseUrl = options.baseUrl ?? undefined;
	const url = buildMdnValuesUrl(propertyName, baseUrl);
	const fetchImpl = options.fetchImpl ?? fetch;

	if (options.html) {
		const parsed = parseMdnValuesPage(options.html, propertyName, url);
		if (options.verifyOnline && parsed.uncertain) {
			const verifiedResponse = await fetchImpl(url);
			if (!verifiedResponse.ok) {
				throw new Error(
					`Failed to verify MDN values page for ${propertyName}: ${verifiedResponse.status} ${verifiedResponse.statusText}`,
				);
			}

			const verifiedParsed = parseMdnValuesPage(await verifiedResponse.text(), propertyName, url);
			return {
				...verifiedParsed,
				verified: true,
			};
		}

		return {
			...parsed,
			verified: false,
		};
	}

	const response = await fetchImpl(url);
	if (!response.ok) {
		throw new Error(`Failed to fetch MDN values page for ${propertyName}: ${response.status} ${response.statusText}`);
	}

	const html = await response.text();
	const parsed = parseMdnValuesPage(html, propertyName, url);

	return {
		...parsed,
		verified: true,
	};
}

export function parseMdnValuesPage(html: string, propertyName = "", url = ""): Omit<MdnValuesPage, "verified"> {
	const values = extractMdnValueEntries(html);
	const uncertain = values.length === 0 || !/<h3\b[^>]*id=["']values["']/i.test(html);

	return {
		propertyName,
		url,
		values,
		uncertain,
	};
}

export function extractMdnValueEntries(html: string): MdnValueEntry[] {
	return extractMdnDefinitionEntries(html, "values").map((entry) => ({
		id: entry.id,
		label: entry.label,
		description: entry.description,
	}));
}

function buildMdnValuesUrl(propertyName: string, baseUrl?: string): string {
	const propertyUrl = buildMdnPropertyUrl(propertyName, baseUrl);
	return propertyUrl.replace(/#formal_syntax$/, "#values");
}
