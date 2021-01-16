const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
// let devEnv = process.env.NODE_ENV === 'development';
const devEnv = true;
module.exports = {
    mode: "development",
    entry: path.resolve(__dirname, "src/index.tsx"),
    output: {
        path: path.resolve(__dirname, "dist/"),
        publicPath: "/",
        filename: devEnv ? 'build.js' : 'build.[contenthash].js',
    },
    stats: {children: false, warnings: false},
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node-modules/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    cacheCompression: false
                }
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node-modules/,
                use: [
                    'babel-loader', 'ts-loader'
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(sa|sc)ss$/,
                use: [
                    devEnv ? 'style-loader' : {loader: miniCssExtractPlugin.loader},
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                            sassOptions: {
                                fiber: require('fibers'),
                                indentedSyntax: true
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: [{
                    loader: "file-loader?cacheDirectory=true",
                    options: {
                        name: '[name].[ext]?[hash]',
                        outputPath: 'font/',
                        publicPath: devEnv ? '/font/' : './dist/font/'
                    }
                }],
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                use: [{
                    loader: "file-loader?cacheDirectory=true",
                    options: {
                        name: '[name].[ext]?[hash]',
                        outputPath: 'assets/',
                        publicPath: '/assets/',
                        esModule: false
                    }
                }],
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.vue', '.scss', '.tsx', '.ts'],
        alias:
            {
                '@': path.resolve(__dirname, './src'),
            },
        modules: [
            './src', './node_modules'
        ],
    },
    plugins: [
        new miniCssExtractPlugin({
            filename: devEnv ? '[name].css' : '[name].[hash:8].css',
            chunkFilename: devEnv ? '[id].css' : "[id].[hash:8].css",
            ignoreOrder: false,
        }),
        new htmlWebpackPlugin({
            title: "曼城",
            favicon: 'public/favicon.ico',
            template: path.resolve(__dirname, './public/index.html'),
            filename: 'index.html',
            hash: true
        }),
    ],
    devServer:
        {
            contentBase: path.join(__dirname, 'build'),
            compress: true,
            historyApiFallback: true,
            noInfo: true,
            host: 'localhost',
            port: '8080',
            stats: {
                children: false, warnings: false
            },
            proxy: {
                '/': {
                    target: '',
                    changOrigin: true,
                    secure: false
                }
            }
        },
    performance: {
        hints: false
    }
};