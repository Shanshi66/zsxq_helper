const webpack = require('webpack')
const { merge } = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const CommentJson = require('comment-json')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ExtensionReloader = require('webpack-extension-reloader');
const path = require('path')
const package_json = require('./package.json')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const autoImport = require('unplugin-auto-import/webpack');
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
const Icons = require('unplugin-icons/webpack')
const IconsResolver = require('unplugin-icons/resolver')


const commonConfig = {
    mode: process.env.NODE_ENV,
    context: path.resolve(__dirname, './src'),
    entry: {
        'popup/index': './popup/index.js',
        'options/index': './options/index.js',
        'background/index': './background/index.js',
        'content/index': './content/index.js',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.js', '.css', '.scss', '.less', '.vue'],
        alias: {
            '@': path.resolve(__dirname, './src'),
            vue: '@vue/runtime-dom'
        },
        modules: ['node_modules'],
        fallback: { "url": require.resolve("url/") }
    },
    target: ['web'],
    experiments: {
        asyncWebAssembly: true,
        syncWebAssembly: true,
        topLevelAwait: true,
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/images/[hash][ext][query]'
                }
            },
            {
                test: /\.ico$/,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/icons/[hash][ext][query]'
                }
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                type: 'asset/inline'
            },
            {
                // Refer: https://qiita.com/yuusuke510/items/af3adfd17af0114f4a2a
                test: /\.pug$/,
                oneOf: [
                    // this applies to pug imports inside JavaScript
                    {
                        exclude: /\.vue$/,
                        use: ['raw-loader', 'pug-plain-loader']
                    },
                    // this applies to `<template lang="pug">` in Vue components
                    {
                        use: ['pug-plain-loader']
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            // create global constants which can be configured at compile time
            'process.env': {
                APP_NAME: JSON.stringify(package_json.productName),
                REPO_ENV: JSON.stringify(process.env.REPO_ENV)
            },
            __VUE_OPTIONS_API__: 'true',
            __VUE_PROD_DEVTOOLS__: 'false'
        }),
        new VueLoaderPlugin(), // for Vue3
        new BundleAnalyzerPlugin(),
        new CleanWebpackPlugin(),
        autoImport({
            resolvers: [ElementPlusResolver(), IconsResolver({
                prefix: 'Icon',
            }),]
        }),
        Components({
            resolvers: [ElementPlusResolver(), IconsResolver({
                enabledCollections: ['ep'],
            }),],
        }),
        Icons({
            autoInstall: true,
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new ExtensionReloader({
            entry: {
                popup: './popup/index.js',
                option: './options/index.js',
                background: './background/index.js',
                content: './content/index.js'
            },
        }),
        new CopyWebpackPlugin({
            patterns: [
                // manifest.json
                {
                    from: './manifest.json',
                    to: './manifest.json',
                    transform: {
                        transformer: (content) => {
                            const json = JSON.parse(transformJson(content))
                            json.name = package_json.productName
                            json.version = package_json.version
                            json.description = package_json.description
                            return JSON.stringify(json, null, 2)
                        },
                        cache: true
                    }
                },
                {
                    from: './cors.json',
                    to: './cors.json'
                },
                // icons
                {
                    from: './public',
                    to: './public'
                },
                // options
                {
                    from: './options/index.html',
                    to: './options/index.html',
                    transform: {
                        transformer: transformHtml,
                        cache: true
                    }
                },
                // popup
                {
                    from: './popup/index.html',
                    to: './popup/index.html',
                    transform: {
                        transformer: transformHtml,
                        cache: true
                    }
                }
            ]
        })
    ]
}


// webpack config for production
const productionConfig = {}

// webpack config for development
const developmentConfig = {
    devtool: 'inline-source-map',
    optimization: {
        minimize: true,
        minimizer: [new CssMinimizerPlugin()]
    }
}

// transform content
function transformJson(content, _path) {
    const obj = CommentJson.parse(content.toString(), null, true)
    return CommentJson.stringify(obj, null, 2)
}

function transformHtml(content, _path) {
    return content.toString()
}

module.exports = (() => {
    switch (process.env.NODE_ENV) {
        case 'development':
            return merge(commonConfig, developmentConfig)
        case 'production':
            return merge(commonConfig, productionConfig)
        default:
            throw new Error('No matching configuration was found!')
    }
})()