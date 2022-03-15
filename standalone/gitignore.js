const fs = require("fs");
const path = require("path");

let ignores = ["./node_modules/.bin"]

ignores = ignores.concat(readGitIgnore([".gitignore"]));
ignores = ignores.concat(readGitIgnore(["android", ".gitignore"]));

for (const [i, ignore] of ignores.entries()) {
    ignores[i] = `"${ignore}"`
}
const string = `caxa --identifier \"tape-mobile-installer-files\" -i \"./\" -o \"standalone/dist/tapemobileinstaller\" --exclude ${ignores.join(" ")} --no-dedupe -- \"{{caxa}}/node_modules/.bin/node\" \"{{caxa}}/standalone/index.js\"`;

const json = JSON.parse(fs.readFileSync("./package.json").toString());
json["scripts"]["standalone:build"] = string;
fs.writeFileSync("./package.json", JSON.stringify(json, null, 2))

function readGitIgnore(e) {
    const gitignores = fs.readFileSync(path.join(...e)).toString().split("\n").filter(x => 
        !x.includes("node_modules") && 
        x.length !== 0 &&
        !x.startsWith("#")
    );
    const popped = [...e]
    popped.pop()
    for (const [i, gitignore] of gitignores.entries()) {
        let mutgitignore = gitignore;
        let exclaimFlag = false;
        if(mutgitignore.startsWith("!")) {
            mutgitignore = mutgitignore.substring(1);
            exclaimFlag = true;
        }
        const tempArr = [...popped];
        tempArr.push(mutgitignore);
        mutgitignore = path.posix.join(...tempArr);
        if (exclaimFlag) {
            mutgitignore = "!" + mutgitignore;
        }
        gitignores[i] = mutgitignore;
    }
    return gitignores
}