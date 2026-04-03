import type { CssHintCollector, CssHintInstruction } from "./collector";
import { createCssHintCollector } from "./collector";
import type { CssHintFilter } from "./filter";
import { createCssHintFilter } from "./filter";
import type { CssHintMapper } from "./mapper";
import { createCssHintMapper } from "./mapper";

export type CssHintPipeline = {
	collect(sourceText: string): CssHintInstruction[];
};

export type CssHintPipelineOptions = {
	collector?: CssHintCollector;
	filter?: CssHintFilter;
	mapper?: CssHintMapper;
};

export function createCssHintPipeline(options: CssHintPipelineOptions = {}): CssHintPipeline {
	const collector = options.collector ?? createCssHintCollector();
	const filter = options.filter ?? createCssHintFilter();
	const mapper = options.mapper ?? createCssHintMapper();

	return {
		collect(sourceText: string): CssHintInstruction[] {
			return mapper.map(filter.filter(collector.collect(sourceText)));
		},
	};
}
