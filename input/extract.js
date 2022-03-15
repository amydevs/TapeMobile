const asar = require('asar');
const path = require('path')
const fs = require('fs');
const fse = require('fs-extra');

const appoutputpath = path.join(__dirname, '../', 'app')

const baseinputpath = path.join(process.cwd(), 'input')
let asarpath = path.join(baseinputpath, 'app.asar')
const _tmpasarpth = path.join(process.env.HOME, "AppData", String.raw`\Local\Programs\Tape\resources\app.asar`)
if (fs.existsSync(_tmpasarpth)) {
    asarpath = _tmpasarpth
}

const extractedpath = path.join(baseinputpath, 'app.extracted')

asar.extractAll(asarpath, extractedpath)
fs.readdirSync(path.join(extractedpath, 'app')).forEach((e, i) => {
    fse.move(path.join(extractedpath, 'app', e), path.join(appoutputpath, e), { overwrite: true }, err => {
        if (err) return console.error(err)
    })
})
console.log('copied over all files')
