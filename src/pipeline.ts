import type { CssHintCollector, CssHintInstruction } from "./collector";
import { createCssHintCollector } from "./collector";
import type { CssHintFilter } from "./filter";
import { createCssHintFilter } from "./filter";

export type CssHintPipeline = {
	collect(sourceText: string): CssHintInstruction[];
};

export type CssHintPipelineOptions = {
	collector?: CssHintCollector;
	filter?: CssHintFilter;
};

export function createCssHintPipeline(options: CssHintPipelineOptions = {}): CssHintPipeline {
	const collector = options.collector ?? createCssHintCollector();
	const filter = options.filter ?? createCssHintFilter();

	return {
		collect(sourceText: string): CssHintInstruction[] {
			return filter.filter(collector.collect(sourceText));
		},
	};
}
