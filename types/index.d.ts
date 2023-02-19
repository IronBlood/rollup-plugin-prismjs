import { Plugin } from "rollup";

interface Filter {
	filter: (id: unknown) => boolean;
	pre_transform: (code: string) => string;
}

export interface PrismOptions {
	languages?: string[] | "all";
	plugins?:   string[];
	theme?:     string;
	css:        boolean;
}

declare const BundlePrismjs: (opts: PrismOptions, filters?: Filter[]) => Plugin;

