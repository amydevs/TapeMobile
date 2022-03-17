const asar = require('asar');
const path = require('path')
const fs = require('fs');
const fse = require('fs-extra');
const util = require("util")

module.exports = (async () => {
    const appoutputpath = path.join(__dirname, '../', 'app')
    const baseinputpath = path.join(process.cwd(), 'input')
    let asarpath = path.join(baseinputpath, 'app.asar')
    const _tmpasarpth = path.join(require('os').homedir(), "AppData", String.raw`\Local\Programs\Tape\resources\app.asar`)
    if (fs.existsSync(_tmpasarpth)) {
        asarpath = _tmpasarpth
    }

    const extractedpath = path.join(baseinputpath, 'app.extracted')

    asar.extractAll(asarpath, extractedpath)
    for (const e of fs.readdirSync(path.join(extractedpath, 'app'))) {
        await util.promisify(fse.move)(path.join(extractedpath, 'app', e), path.join(appoutputpath, e), { overwrite: true })
    }
    console.log('copied over all files')
    return true;
})()
