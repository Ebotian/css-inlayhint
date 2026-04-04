import type { CssExtractor, CssExtractorCandidate } from "./extractor";
import { createCssExtractor } from "./extractor";
import { createCssHintClassifier, type CssHintMatchedClassification } from "./classifier";
import type { CssHintShape } from "./shapeParser";

export type CssHintInstruction = CssHintMatchedClassification & {
	valueText: string;
	range: CssExtractorCandidate["range"];
	valueRange: CssExtractorCandidate["valueRange"];
	shape?: CssHintShape;
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
				if (classification.state !== "matched") {
					continue;
				}

				instructions.push({
					...classification,
					valueText: candidate.valueText,
					range: candidate.range,
					valueRange: candidate.valueRange,
				});
			}

			return instructions;
		},
	};
}
