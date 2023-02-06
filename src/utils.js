import fs from "fs";

const url_package_json = new URL("../package.json", import.meta.url);

export const ModuleInfo = JSON.parse(fs.readFileSync(url_package_json, "utf8"));

