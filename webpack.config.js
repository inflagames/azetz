const path = require('path');
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const environment = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 9000;

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: [
    './main.js',
    './main.scss'
  ],
  watch: environment === 'development',
  target: "web",
  mode: environment,
  devtool: environment === 'development' ? 'inline-source-map' : 'source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {loader: "css-loader", options: {sourceMap: true}},
          {loader: "sass-loader", options: {sourceMap: true}}
        ]
      },
      {
        test: /\.html$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        {from: "./*.html"},

        // copy assets to the build
        {from: "./assets/"}
      ],
    })
  ],
  optimization: {
    minimize: environment === 'production',
    minimizer: [
      new HtmlMinimizerPlugin(),
      new CssMinimizerPlugin(),
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
  devServer: {
    contentBase: [path.join(__dirname, 'src'), path.join(__dirname, 'dist')],
    port: port,
    hot: true,
    inline: true,
    liveReload: true
  },
};
