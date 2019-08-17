const webpackBaseConfig = require('./webpack.base.conf');
const config = require('./config');
const utils = require('./utils');
const webpack = require('webpack');
const merge = require('webpack-merge');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const path = require('path');
module.exports = merge(webpackBaseConfig, {
    mode: 'development',
    output: {
        publicPath: config.dev.assetsPublicPath
    },
    module: {
        rules: utils.styleLoaders({
            usePostCSS: true
        })
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
                messages: [`Your application is running on: http://${config.dev.host}:${config.dev.port}`],
            },
            onErrors: config.dev.notifyOnErrors ?
                utils.createNotifierCallback() : undefined
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        host: config.dev.host,
        port: config.dev.port,
        contentBase: config.build.assetsRoot,
        historyApiFallback: true,
        hot: true,
        compress: true,
        overlay: {
            warn: false,
            errors: true
        },
        clientLogLevel: "none",
        quiet: true,
        open: config.dev.autoOpenBrowser,
        proxy: config.dev.proxyTable,
        before(app, server, compiler) {
            const watchFiles = ['.html', '.pug'];
            compiler.hooks.done.tap('done', () => {
                const changedFiles = Object.keys(compiler.watchFileSystem.watcher.mtimes);
                if (
                    this.hot
                    && changedFiles.some(filePath => watchFiles.includes(path.parse(filePath).ext))
                ) {
                    server.sockWrite(server.sockets, 'content-changed');
                }
            });
        },
    },
});