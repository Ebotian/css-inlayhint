import type { CssExtractor, CssExtractorCandidate } from "./extractor";
import { createCssExtractor } from "./extractor";
import { createCssHintClassifier, type CssHintClassification } from "./classifier";

export type CssHintInstruction = CssHintClassification & {
	range: CssExtractorCandidate["range"];
};

export type CssHintCollector = {
	collect(sourceText: string): CssHintInstruction[];
};

export type CssHintCollectorOptions = {
	extractor?: CssExtractor;
	classifier?: ReturnType<typeof createCssHintClassifier>;
};

export function createCssHintCollector(options: CssHintCollectorOptions = {}): CssHintCollector {
	const extractor = options.extractor ?? createCssExtractor();
	const classifier = options.classifier ?? createCssHintClassifier();

	return {
		collect(sourceText: string): CssHintInstruction[] {
			const candidates = extractor.collectCandidates(sourceText);
			const instructions: CssHintInstruction[] = [];

			for (const candidate of candidates) {
				const classification = classifier.classify(candidate);
				if (!classification) {
					continue;
				}

				instructions.push({
					...classification,
					range: candidate.range,
				});
			}

			return instructions;
		},
	};
}
