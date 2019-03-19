const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');

const folderPath = 'dist/src';
const htmlFolderPath = 'dist';

const isDev = process.env.NODE_ENV === 'development';
const minifyHTML = !isDev;

var dotenv = require('dotenv').config({path: __dirname + '/.env'});

const APIKEY = dotenv.parsed ? dotenv.parsed.GOOGLE_API_KEY : '';

module.exports = {
    entry: './resources/app.js',
    output: {
        path: path.resolve(__dirname, folderPath),
        filename: 'main.js',
    },
    module: {
        rules: [
            {
                test: /\.(s*)css$/,
                loaders: ['style-loader','css-loader', 'sass-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: '../src/fonts/',
                            publicPath: 'src/fonts'
                        }
                    }
                ]
            },
            {
                test: /\.vue$/,
                use:
                    {
                        loader: 'vue-loader',
                    },
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, htmlFolderPath+'/index.html'),
            template: path.resolve(__dirname, 'resources/index.html'),
            chunks: ['main'],
            templateParameters: {
                '__APIKEY__': APIKEY
            },
            minify   : {
                html5                          : minifyHTML,
                collapseWhitespace             : minifyHTML,
                minifyCSS                      : minifyHTML,
                minifyJS                       : minifyHTML,
                minifyURLs                     : false,
                removeAttributeQuotes          : minifyHTML,
                removeComments                 : minifyHTML,
                removeEmptyAttributes          : minifyHTML,
                removeOptionalTags             : minifyHTML,
                removeRedundantAttributes      : minifyHTML,
                removeScriptTypeAttributes     : minifyHTML,
                removeStyleLinkTypeAttributese : minifyHTML,
                useShortDoctype                : minifyHTML
            },
        })
    ],
    resolve: {
        modules: [
            path.resolve('./resources/js'),
            path.resolve('./node_modules'),
        ],
        alias: {
            '~style': path.join(__dirname, 'resources/scss'), 
            '~': path.join(__dirname, 'resources/js') ,
            'vue$': 'vue/dist/vue.runtime.esm.js'
        },
        extensions: ['.js', '.vue', '.json'],
    }

};