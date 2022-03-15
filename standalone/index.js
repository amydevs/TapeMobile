const webpack = require('webpack');
const webpackcfg = require('../webpack.config');
process.env.NODE_ENV = "production";
process.env.NODE_PWA = "true";

const WebpackDevServer = require('webpack-dev-server');
const path = require("path");

(async () => {
    console.log(require("../input/extract.js"));

    process.chdir(path.resolve(__dirname, "../"));
    console.log(process.cwd())
    webpack(webpackcfg).run((err, stats) => {
        console.log(err)
        const server = new WebpackDevServer(webpackcfg.devServer, webpack(webpackcfg));
        server.start();
    })
})()
