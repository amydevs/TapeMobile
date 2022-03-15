require("./input/extract.js")
const webpack = require('webpack');
const webpackcfg = require('./webpack.config');
const WebpackDevServer = require('webpack-dev-server');

(async () => {
    process.env.NODE_ENV = "production";
    process.env.NODE_PWA = "true";

    const server = new WebpackDevServer(webpack(webpackcfg));

    await server.start()
})()
