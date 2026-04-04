export type MdnFormalSyntaxPage = {
	propertyName: string;
	url: string;
	title: string;
	description: string;
	formalSyntax: string;
	uncertain: boolean;
	verified: boolean;
};

export type MdnFormalSyntaxParseResult = Omit<MdnFormalSyntaxPage, "verified">;

export type MdnFormalSyntaxOptions = {
	baseUrl?: string;
	fetchImpl?: typeof fetch;
	html?: string;
	verifyOnline?: boolean;
};

const DEFAULT_BASE_URL = "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/";

export function buildMdnPropertyUrl(propertyName: string, baseUrl = DEFAULT_BASE_URL): string {
	if (/^https?:\/\//i.test(propertyName)) {
		return ensureFormalSyntaxHash(propertyName);
	}

	return `${baseUrl}${encodeURIComponent(propertyName)}#formal_syntax`;
}

export function parseMdnFormalSyntaxPage(html: string, propertyName = "", url = ""): MdnFormalSyntaxParseResult {
	const title = extractMdnPageTitle(html, propertyName);
	const description = extractMdnPropertyDescription(html);
	const formalSyntax = extractMdnFormalSyntax(html);
	const uncertain =
		description.length === 0 || formalSyntax.length === 0 || !/<h2\b[^>]*id=["']formal_syntax["']/i.test(html);

	return {
		propertyName,
		url,
		title,
		description,
		formalSyntax,
		uncertain,
	};
}

export function extractMdnPropertyDescription(html: string): string {
	return normalizeBlockText(
		decodeHtmlEntities(
			findMetaContent(html, "description") ??
				findFirstParagraphText(html) ??
				findMetaContent(html, "og:description") ??
				"",
		),
	);
}

export function extractMdnFormalSyntax(html: string): string {
	const headingIndex = html.indexOf('id="formal_syntax"');
	if (headingIndex < 0) {
		return "";
	}

	const sectionStart = html.lastIndexOf("<section", headingIndex);
	if (sectionStart < 0) {
		return "";
	}

	const nextHeadingIndex = html.indexOf('id="examples"', headingIndex);
	const sectionEnd =
		nextHeadingIndex >= 0 ? html.lastIndexOf("</section>", nextHeadingIndex) : html.indexOf("</section>", headingIndex);
	const sectionHtml = html.slice(sectionStart, sectionEnd >= 0 ? sectionEnd : html.length);
	const preMatch = sectionHtml.match(/<pre\b[^>]*>([\s\S]*?)<\/pre>/i);
	if (!preMatch) {
		return "";
	}

	return decodeHtmlEntities(htmlToText(preMatch[1])).replace(/\r\n?/g, "\n");
}

export async function fetchMdnFormalSyntax(
	propertyName: string,
	options: MdnFormalSyntaxOptions = {},
): Promise<MdnFormalSyntaxPage> {
	const baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
	const url = buildMdnPropertyUrl(propertyName, baseUrl);
	const fetchImpl = options.fetchImpl ?? fetch;

	if (options.html) {
		const parsed = parseMdnFormalSyntaxPage(options.html, propertyName, url);
		if (options.verifyOnline && parsed.uncertain) {
			const verifiedResponse = await fetchImpl(url);
			if (!verifiedResponse.ok) {
				throw new Error(
					`Failed to verify MDN page for ${propertyName}: ${verifiedResponse.status} ${verifiedResponse.statusText}`,
				);
			}

			const verifiedParsed = parseMdnFormalSyntaxPage(await verifiedResponse.text(), propertyName, url);
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
		throw new Error(`Failed to fetch MDN page for ${propertyName}: ${response.status} ${response.statusText}`);
	}

	const html = await response.text();
	const parsed = parseMdnFormalSyntaxPage(html, propertyName, url);

	return {
		...parsed,
		verified: true,
	};
}

export async function getFormalSyntax(
	propertyName: string,
	options: MdnFormalSyntaxOptions = {},
): Promise<MdnFormalSyntaxPage> {
	return fetchMdnFormalSyntax(propertyName, options);
}

function ensureFormalSyntaxHash(url: string): string {
	if (url.includes("#formal_syntax")) {
		return url;
	}

	return `${url.replace(/#.*$/, "")}#formal_syntax`;
}

function extractMdnPageTitle(html: string, fallback: string): string {
	return normalizeBlockText(
		decodeHtmlEntities(findMetaContent(html, "og:title") ?? findTitleTagText(html) ?? fallback),
	);
}

function findTitleTagText(html: string): string {
	const match = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
	return match ? htmlToText(match[1]).trim() : "";
}

function findMetaContent(html: string, name: string): string {
	const metaTagPattern = /<meta\b[^>]*>/gi;
	for (const metaTag of html.match(metaTagPattern) ?? []) {
		if (readTagAttribute(metaTag, "name") === name || readTagAttribute(metaTag, "property") === name) {
			return readTagAttribute(metaTag, "content");
		}
	}

	return "";
}

function findFirstParagraphText(html: string): string {
	const paragraphMatch = html.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i);
	return paragraphMatch ? htmlToText(paragraphMatch[1]) : "";
}

function readTagAttribute(tag: string, attributeName: string): string {
	const pattern = new RegExp(`${attributeName}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'<>]+))`, "i");
	const match = tag.match(pattern);
	return match?.[1] ?? match?.[2] ?? match?.[3] ?? "";
}

function htmlToText(html: string): string {
	return stripHtmlTags(
		html
			.replace(/<!--([\s\S]*?)-->/g, "")
			.replace(/<br\b[^>]*>/gi, "\n")
			.replace(/<\/p>/gi, "\n")
			.replace(/<\/li>/gi, "\n"),
	);
}

function stripHtmlTags(html: string): string {
	let text = "";
	let index = 0;

	while (index < html.length) {
		const character = html[index];
		if (character !== "<") {
			text += character;
			index += 1;
			continue;
		}

		let cursor = index + 1;
		let quote: string | null = null;
		while (cursor < html.length) {
			const current = html[cursor];
			if (quote) {
				if (current === quote) {
					quote = null;
				}
				cursor += 1;
				continue;
			}

			if (current === '"' || current === "'") {
				quote = current;
				cursor += 1;
				continue;
			}

			if (current === ">") {
				index = cursor + 1;
				break;
			}

			cursor += 1;
		}

		if (cursor >= html.length) {
			break;
		}
	}

	return text;
}

function normalizeBlockText(text: string): string {
	return text
		.replace(/\r\n?/g, "\n")
		.split("\n")
		.map((line) => line.replace(/\s+$/u, ""))
		.join("\n")
		.replace(/^\s*\n/, "")
		.replace(/\n\s*$/, "")
		.trim();
}

function decodeHtmlEntities(text: string): string {
	const namedEntities: Record<string, string> = {
		amp: "&",
		lt: "<",
		gt: ">",
		quot: '"',
		apos: "'",
		nbsp: " ",
	};

	return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (_match, entity: string) => {
		if (entity.startsWith("#x") || entity.startsWith("#X")) {
			return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
		}

		if (entity.startsWith("#")) {
			return String.fromCodePoint(Number.parseInt(entity.slice(1), 10));
		}

		return namedEntities[entity] ?? `&${entity};`;
	});
}
