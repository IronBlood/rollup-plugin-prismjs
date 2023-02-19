import { Plugin } from "rollup";

export interface PrismOptions {
	languages?: string[] | "all";
	plugins?:   string[];
	theme?:     string;
	css:        boolean;
}

declare const BundlePrismjs: (opts: PrismOptions) => Plugin;

