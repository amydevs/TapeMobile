const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const fs = require('fs')
const html = new JSDOM(fs.readFileSync('./app/app.html', 'utf8'));
const document = html.window.document

const scriptsrcs = [
    "polyfills/lodash.js",
    "polyfills/jquery.js",
    "polyfills/browserfs.min.js",
    "polyfills/polyfill.js"
]
scriptsrcs.reverse()

for (src of scriptsrcs) {
    const script = document.createElement('script');
    script.src = src;
    document.querySelector("head").prepend(script);
}
fs.writeFileSync('./app/index.html', html.serialize())