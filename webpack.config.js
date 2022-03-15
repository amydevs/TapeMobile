const path = require('path');
const webpack = require('webpack');
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");

const webpackConf = {
    context: path.resolve(__dirname, 'app'),
    mode: process.env.NODE_ENV || 'development',
    entry: [
        './polyfills/polyfill',
        './app.js',
        './helpers/context_menu.js',
    ],
    // entry: {
    //     app: './app.js',
    //     "helpers/context_menu": './helpers/context_menu.js'
    // },
    output: {
        filename: "app.js"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
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
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.ts$/,
                exclude: '/node_modules/',
                use: 'ts-loader'
            }

        ],
    },    
    watch: process.env.NODE_ENV === "development" ? true : false,    
    devtool: "inline-source-map",
    devServer: {
        static: './dist',
        hot: true,
    },
    plugins: [
        // Expose BrowserFS, process, and Buffer globals.
        // NOTE: If you intend to use BrowserFS in a script tag, you do not need
        // to expose a BrowserFS global.
     
        new webpack.ProvidePlugin({ BrowserFS: 'bfsGlobal', process: 'processGlobal', Buffer: 'bufferGlobal' }),
        {
            apply: (compiler) => {
                compiler.hooks.afterEmit.tap('AfterEmitPlugin', (stats) => {
                    const scriptSrcs = ["app.js"];
                    const jsdom = require("jsdom");
                    const { JSDOM } = jsdom;

                    const fs = require('fs')
                    const html = new JSDOM(fs.readFileSync('./app/app.html'), 'utf8');
                    const document = html.window.document

                    document.querySelector('link[rel="stylesheet"]').remove()

                    for (const [i, script] of document.querySelectorAll("head > script").entries()) {
                        script.remove();
                    }

                    const _headelm = document.querySelector('head')
                    for (const src of scriptSrcs.reverse()) {
                        const scrp = document.createElement("script")
                        scrp.src = src
                        _headelm.prepend(scrp)
                    }
                    const pwamanifest = document.createElement("link");
                    pwamanifest.rel = "manifest";
                    pwamanifest.href = "manifest.json"
                    _headelm.append(pwamanifest);
                    
                    fs.writeFileSync('./dist/index.html', html.serialize())
                    console.log(require("child_process").execSync("npm run sync").toString("utf-8"));
                });
            }
        },
        new WorkboxWebpackPlugin.GenerateSW({
            swDest: "sw.js",
            maximumFileSizeToCacheInBytes: 50 * 1024 * 1024,
            clientsClaim: true,
            skipWaiting: true,
        })
    ]
}
module.exports = webpackConf;
