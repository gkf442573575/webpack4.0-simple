const webpackBaseConfig = require('./webpack.base.conf');
const config = require('./config');
const utils = require('./utils');
const webpack = require('webpack');
const merge = require('webpack-merge');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
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
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
                messages: [`Your application is running on: http://${config.dev.host}:${config.dev.port}`],
            },
            onErrors: config.dev.notifyOnErrors ?
                utils.createNotifierCallback() : undefined
        })
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
        proxy: config.dev.proxyTable
    },
});