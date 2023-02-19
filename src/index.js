import MagicString from "magic-string";
import getComponents from './getComponents';
import { ModuleInfo } from "./utils.js";
const {
	name,
	version,
} = ModuleInfo;
import { createFilter } from '@rollup/pluginutils';

const CORE = "'prismjs/components/prism-core'";

/**
 * @typedef { object } Filter
 * @property { (id: unknown) => boolean } filter
 * @property { (code: string) => string } pre_transform
 */

/**
 * @typedef  { object    } PrismOptions
 * @property { string[]? } languages // TODO: replace with all names
 * @property { string[]? } plugins   // TODO: replace with all names
 * @property { string?   } theme     // TODO: replace with all names
 * @property { boolean   } css       // TODO: replace with all names
 */

/**
 * @param { PrismOptions } opts
 * @param { Filter[] } filters
 * @returns { import("rollup").Plugin }
 */
function BundlePrismjs(opts = {}, filters) {
	const sourceMap = opts.sourceMap !== false && opts.sourcemap !== false;

	function isImportDeclaration(node) {
		return node.type === "ImportDeclaration";
	}

	function isFunction(x) {
		return typeof x === "function";
	}

	const DEFAULT_FILTER = {
		filter: createFilter(/\.[jt]s$/),
		pre_transform: code => code,
	};

	if (filters == null) {
		filters = [ DEFAULT_FILTER ];
	}

	let is_valid_filter_array = true;
	if (!Array.isArray(filters)) {
		is_valid_filter_array = false;
	}
	for (let f of filters) {
		if (!isFunction(f.filter) || !isFunction(f.pre_transform)) {
			is_valid_filter_array = false;
			break;
		}
	}

	return {
		name,
		version,
		transform(code, id) {
			if (!is_valid_filter_array) {
				this.error({
					message: `${name}: the filters are not valid`,
				});
			}

			let ast = null;
			let match = false;
			for (let f of filters) {
				if (f.filter(id)) {
					match = true;
					code = f.pre_transform(code);
					break;
				}
			}

			if (!match) {
				return null;
			}

			try {
				ast = this.parse(code);
			} catch (err) {
				this.warn({
					code: "PARSE_ERROR",
					message: `${name}: failed to parse ${id}.`,
				});
			}
			if (!ast) {
				return null;
			}

			const magicString = new MagicString(code);
			let isModified = false;

			ast.body.forEach(node => {
				if (isImportDeclaration(node) && node.source.value === "prismjs") {
					magicString.update(node.source.start, node.source.end, CORE);
					isModified = true;

					const components = getComponents(opts);
					if (components.length > 0) {
						const text = components.map(c => `import '${c}';`).join("\n");
						magicString.appendRight(node.end, `\n${text}`);
					}
				}
			});

			if (!isModified) {
				return null;
			}

			code = magicString.toString();
			ast = this.parse(code);

			return {
				code,
				ast,
				map: sourceMap ? magicString.generateMap({ hires: true }) : null,
			};
		},
	};
}

export {
	BundlePrismjs,
}

