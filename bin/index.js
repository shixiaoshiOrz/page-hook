const fs = require("fs");
const path = require("path");
const { start } = require("repl");
async function build() {
    const filePath = path.resolve(__dirname, "..", "dist/tool.js");

    let text = fs.readFileSync(filePath, "utf8");

    const bannerPath = path.resolve(__dirname, "..", "./bin/banner.txt");
    let banner = fs.readFileSync(bannerPath, "utf8");

    let outputPath = path.resolve(__dirname, "..", "dist/persagytool-v1.2.1.js");
    fs.writeFileSync(outputPath, banner + "\n" + text);


}
build()