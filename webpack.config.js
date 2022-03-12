const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");

const webpackConf = {
    context: path.resolve(__dirname, 'app'),
    mode: 'development',
    entry: ['./polyfills/polyfill.js', './app.js', './helpers/context_menu.js'],
    // entry: {
    //     app: './app.js',
    //     "helpers/context_menu": './helpers/context_menu.js'
    // },
    output: {
        filename: "app.js"
    },
    resolve: {
        fallback: {
            "util": require.resolve("util"),
            "assert": require.resolve("assert"),
            "stream": require.resolve("stream-browserify"),
            "crypto": require.resolve("crypto-browserify"),
            "electron": require.resolve("./app/polyfills/electron.js"),
        },
        alias: {
            'fs': 'browserfs/dist/shims/fs.js',
            'buffer': 'browserfs/dist/shims/buffer.js',
            'path': 'browserfs/dist/shims/path.js',
            'processGlobal': 'browserfs/dist/shims/process.js',
            'bufferGlobal': 'browserfs/dist/shims/bufferGlobal.js',
            'bfsGlobal': require.resolve('browserfs'),
        }
    },
    devServer: {
        static: './dist',
        hot: true,
    },
    plugins: [
        // Expose BrowserFS, process, and Buffer globals.
        // NOTE: If you intend to use BrowserFS in a script tag, you do not need
        // to expose a BrowserFS global.
     
        new webpack.ProvidePlugin({ BrowserFS: 'bfsGlobal', process: 'processGlobal', Buffer: 'bufferGlobal' }),
        new CopyPlugin({
            patterns: [
              { from: "stylesheets", to: "stylesheets" },
            ],
        }),
        {
            apply: (compiler) => {
                compiler.hooks.afterEmit.tap('AfterEmitPlugin', (stats) => {
                    
                    const jsdom = require("jsdom");
                    const { JSDOM } = jsdom;

                    const fs = require('fs')
                    const html = new JSDOM(fs.readFileSync('./app/app.html'), 'utf8');
                    const document = html.window.document


                    for (const [i, script] of document.querySelectorAll("head > script").entries()) {
                        if (i == 0) {
                            script.src = "app.js";
                        }
                        else { 
                            script.remove();
                        }
                    }
                    fs.writeFileSync('./dist/index.html', html.serialize())
                });
            }
        }
    ]
}
module.exports = webpackConf;