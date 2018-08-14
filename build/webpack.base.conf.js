const config = require('./config');
const fs = require('fs');
const path = require('path');
// 生成HTML
const HTMLWebpackPlugin = require('html-webpack-plugin');
// 复制静态资源
const CopyWebpackPlugin = require("copy-webpack-plugin");

// 获取所有的html文件名的集合
function getHtmlList(path) {
    let fileList = [];
    let dirlist = fs.readdirSync(path);
    let reg = /(.*)\.(html|htm)$/;
    dirlist.forEach(item => {
        if (reg.test(item)) {
            fileList.push(RegExp.$1);
        }
    });
    return fileList;
}
let htmlDirs = getHtmlList(config.htmlpath);
// 根据每个html文件来生成HTMLWebpackPlugin实例 和 入口列表
let HTMLPlugins = [];
let Entries = {};

htmlDirs.forEach(page => {
    let htmlConfig = {
        filename: `${page}.html`,
        template: `./src/${page}.html`,
        chunksSortMode: 'dependency',
        // hash: true, //防止缓存
    };
    let found = config.ignoreJs.findIndex((val) => {
        return val === page;
    });
    if (found == -1) {
        // html文件绑定入口JS和页面名相同的
        htmlConfig.chunks = ['manifest', 'vendor', 'utils', page];
        // 每个HTML文件添加一个入口，除非设置不用
        Entries[page] = config.jspath + `${page}.js`;
    } else {
        htmlConfig.chunks = [];
    }
    HTMLPlugins.push(new HTMLWebpackPlugin(htmlConfig));
});

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: Entries,
    output: {
        path: config.build.assetsRoot,
        filename: 'js/[name].js'
    },
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@': resolve('src')
        }
    },
    module: {
        rules: [{
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }, {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: 'assets/[name].[ext]'
                }
            }, {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: 'assets/[name].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: 'assets/[name].[ext]'
                }
            },
            {
                test: /\.(htm|html)$/,
                use: 'html-withimg-loader'
            }
        ]
    },
    plugins: [
        ...HTMLPlugins,
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../src/assets'),
            to: './assets'
        }])
    ]
};