import MagicString from "magic-string";
import getComponents from './getComponents';
import { ModuleInfo } from "./utils.js";
const {
	name,
	version,
} = ModuleInfo;

const CORE = "'prismjs/components/prism-core'";

/**
 * @typedef  { object    } PrismOptions
 * @property { string[]? } languages // TODO: replace with all names
 * @property { string[]? } plugins   // TODO: replace with all names
 * @property { string?   } theme     // TODO: replace with all names
 * @property { boolean   } css       // TODO: replace with all names
 */

/**
 * @param { PrismOptions } opts
 * @returns { import("rollup").Plugin }
 */
function BundlePrismjs(opts = {}) {
	const sourceMap = opts.sourceMap !== false && opts.sourcemap !== false;

	function isImportDeclaration(node) {
		return node.type === "ImportDeclaration";
	}

	return {
		name,
		version,
		transform(code, id) {
			let ast = null;
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

