const asar = require('asar');
const path = require('path')
const fs = require('fs');
const fse = require('fs-extra');

const appoutputpath = path.join(__dirname, '../', 'app')
const baseinputpath = path.join(__dirname)
const extractedpath = path.join(baseinputpath, 'app.extracted')

asar.extractAll(path.join(baseinputpath, 'app.asar'), extractedpath)
fs.readdirSync(path.join(extractedpath, 'app')).forEach((e, i) => {
    fse.move(path.join(extractedpath, 'app', e), path.join(appoutputpath, e), { overwrite: true }, err => {
        if (err) return console.error(err)
    })
})
console.log('copied over all files')
// fse.move('./input/app.extracted', './app', { overwrite: true }, err => {
//     if (err) return console.error(err)
//     console.log('copied over')
// })