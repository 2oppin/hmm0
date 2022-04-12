const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  mode: process.env.DEBUG ? 'development' : 'production',
  entry: './src/index.tsx',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", {loader: "css-loader", options: {url: false}}, {loader: "sass-loader", options: {
          sassOptions: {},
        }}],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.HTML$/i,
        use: ["html-loader"],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./public" },
      ],
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devServer: process.env.DEBUG ? {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    // Enable compression
    compress: true,

    // Enable hot reloading
    hot: true,

    host: 'localhost',

    port: 9005,

  } : undefined,
  watchOptions: {
    aggregateTimeout: 200,
    poll: 1000,
  },
//  watch: !!process.env.DEBUG,
};