const webpack = require('webpack');
const webpackcfg = require('../webpack.config');
const WebpackDevServer = require('webpack-dev-server');
const path = require("path");

(async () => {
    process.env.NODE_ENV = "production";
    process.env.NODE_PWA = "true";

    require("../input/extract.js");

    process.cwd(path.join(__dirname, "../"));
    const server = new WebpackDevServer(webpackcfg.devServer, webpack(webpackcfg));

    await server.start()
})()
