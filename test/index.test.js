import { rollup } from "rollup";
import { BundlePrismjs } from "../src/index";
import fs from "fs";
import appRoot from "app-root-path";

const onwarn = msg => {
	if (/external dependency/.test(msg)) return;
	console.error(msg);
};

describe("BundlePrismjs Unit Test", () => {
	it("BundlePrismjs should be a function", () => {
		expect(typeof BundlePrismjs).toBe("function");
	});

	const fixturesDir = `${appRoot}/test/fixtures`;
	const inputFile   = `${appRoot}/test/dummy.js`;

	fs.readdirSync(fixturesDir).forEach(caseName => {
		const fixtureDir = `${fixturesDir}/${caseName}`,
			expectedFile = `${fixtureDir}/expected.js`,
			optionsFile  = `${fixtureDir}/options.json`;

		it(`should work with ${caseName.split("-").join(" ")}`, async () => {
			const options = JSON.parse(fs.readFileSync(optionsFile, "utf8"));
			const result = await rollup({
				input: inputFile,
				plugins: [
					BundlePrismjs(options),
				],
				onwarn,
			});
			const { output } = await result.generate({
				format: "esm",
			});
			const [{ code }] = output;
			const expected   = fs.readFileSync(expectedFile, "utf8");
			expect(code.trim()).toBe(expected.trim());
		});
	});

	it("should not change code if no prism is used", async () => {
		const input_file = `${appRoot}/test/no-prism.js`;
		const original = fs.readFileSync(input_file, "utf8");
		const result = await rollup({
			input: input_file,
			plugins: [
				BundlePrismjs({}),
			],
			onwarn,
		});
		const { output } = await result.generate({
			format: "esm",
		});
		const [{ code }] = output;
		expect(code.trim()).toBe(original.trim());
	});
});

