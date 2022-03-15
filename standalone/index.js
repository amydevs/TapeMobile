process.env.NODE_ENV = "production";

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const path = require("path");

(async () => {
    require("../input/extract.js");

    process.chdir(path.resolve(__dirname, "../"));
    console.log(process.cwd())
    process.env.NODE_PWA = "false";
    webpack(require('../webpack.config'), (err, stats) => {
        console.log(err)
        process.env.NODE_PWA = "true";
        const { devServer } = webpackcfg = require('../webpack.config');
        const server = new WebpackDevServer(devServer, webpack(webpackcfg));
        server.start();
    })
})()
