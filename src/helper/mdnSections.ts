export type MdnDefinitionEntry = {
	id: string;
	label: string;
	description: string;
};

export function extractMdnSectionHtml(html: string, headingId: string): string {
	const headingIndex = html.indexOf(`id="${headingId}"`);
	if (headingIndex < 0) {
		return "";
	}

	const sectionStart = html.lastIndexOf("<section", headingIndex);
	if (sectionStart < 0) {
		return "";
	}

	const nextSectionIndex = html.indexOf("</section>", headingIndex);
	return html.slice(sectionStart, nextSectionIndex >= 0 ? nextSectionIndex : html.length);
}

export function extractMdnSectionText(html: string, headingId: string): string {
	return decodeHtmlEntities(normalizeBlockText(htmlToText(stripHtmlTags(extractMdnSectionHtml(html, headingId)))));
}

export function extractMdnDefinitionEntries(html: string, headingId: string): MdnDefinitionEntry[] {
	const sectionHtml = extractMdnSectionHtml(html, headingId);
	if (!sectionHtml) {
		return [];
	}

	const entries: MdnDefinitionEntry[] = [];
	const entryPattern = /<dt\b[^>]*id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/dt>\s*<dd\b[^>]*>([\s\S]*?)<\/dd>/gi;
	for (const match of sectionHtml.matchAll(entryPattern)) {
		const id = decodeHtmlEntities(match[1] ?? "").trim();
		if (!id) {
			continue;
		}

		entries.push({
			id,
			label: normalizeInlineText(decodeHtmlEntities(stripHtmlTags(match[2] ?? ""))),
			description: normalizeBlockText(decodeHtmlEntities(htmlToText(match[3] ?? ""))),
		});
	}

	return entries;
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

function normalizeInlineText(text: string): string {
	return text.replace(/\r\n?/g, " ").replace(/\s+/g, " ").trim();
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
