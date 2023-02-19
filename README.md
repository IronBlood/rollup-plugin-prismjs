# Rollup-plugin-prismjs

![Github CI](https://github.com/IronBlood/rollup-plugin-prismjs/workflows/rollup-plugin-prismjs%20ci/badge.svg?branch=main) [![Coverage Status](https://coveralls.io/repos/github/IronBlood/rollup-plugin-prismjs/badge.svg?branch=main)](https://coveralls.io/github/IronBlood/rollup-plugin-prismjs?branch=main)

This is another bundler plugin to use [PrismJS](https://github.com/PrismJS/prism) 1.x in a node project. It's almost a port of [babel-plugin-prismjs](https://github.com/mAAdhaTTah/babel-plugin-prismjs) with most of its test cases, but doesn't use babel any more. (PS: There's [vite-plugin-prismjs](https://github.com/code-farmer-i/vite-plugin-prismjs) which is basically a wrapper of babel-plugin-prismjs.)

## Installation

```bash
npm i rollup-plugin-prismjs -D
```

## Usage

Rollup:

```js
import { rollup } from "rollup";
import { BundlePrismjs } from "rollup-plugin-prismjs";

rollup({
    entry: "main.js",
    plugins: [
        BundlePrismjs({
            languages: [ "markup" ],
        });
    ]
});
```

Vite:

```js
// vite.config.mjs
import { defineConfig } from "vite";
import { BundlePrismjs } from "rollup-plugin-prismjs";

export default defineConfig({
    plugins: [
        BundlePrismjs({
        }),
    ],
});
```

## License

MIT

