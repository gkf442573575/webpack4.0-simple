const webpackBaseConfig = require('./webpack.base.conf');
const webpack = require('webpack');
const merge = require('webpack-merge');
const cleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const config = require('./config');
const utils = require('./utils');

module.exports = merge(webpackBaseConfig, {
    mode: 'production',
    module: {
        rules: utils.styleLoaders({
            extract: true,
            usePostCSS: true
        })
    },
    optimization: {
        runtimeChunk: { // 抽离webpack runtime文件
            name: 'manifest'
        },
        splitChunks: {
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '-',
            name: true,
            cacheGroups: {
                vendor: { // 抽离第三方插件
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'initial',
                    priority: 10
                },
                utils: { // 抽离自己写的公共代码，utils这个名字可以随意起
                    test: /\.js$/,
                    chunks: 'initial',
                    name: 'utils',
                    minSize: 0
                }
            }
        },
        minimizer: [
            new UglifyJsPlugin({ // 压缩代码是去除console.log
                uglifyOptions: {
                    compress: {
                        warnings: false,
                        drop_debugger: true,
                        drop_console: true
                    }
                }
            })
        ]
    },
    plugins: [
        new cleanWebpackPlugin(["dist"], {
            root: config.projectPath
        }),
        new webpack.HashedModuleIdsPlugin(),
        new MiniCssExtractPlugin({
            publicPath: '../',
            filename: 'css/[name].css'
        }),
    ]
});