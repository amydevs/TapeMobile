const fs = require("fs");

let ignores = ["./node_modules/.bin"]

ignores = ignores.concat(fs.readFileSync("./.gitignore").toString().split("\n").filter(x => !x.includes("node_modules") && x.length !== 0));
for (const [i, ignore] of ignores.entries()) {
    ignores[i] = `"${ignore}"`
}
const string = `caxa --identifier \"tape-mobile-installer-files\" -i \"./\" -o \"standalone/dist/tapemobileinstaller\" --exclude ${ignores.join(" ")} --no-dedupe -- \"{{caxa}}/node_modules/.bin/node\" \"{{caxa}}/standalone/index.js\"`;

const json = JSON.parse(fs.readFileSync("./package.json").toString());
json["scripts"]["standalone:build"] = string;
fs.writeFileSync("./package.json", JSON.stringify(json, null, 2))