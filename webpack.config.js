const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
// const path = require("path");

module.exports = {
  mode: "production",
  output: {
    filename: "./bundle.js",
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader", // creates style nodes from JS strings
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
          },
          {
            loader: "less-loader", // compiles Less to CSS
          },
        ],
      },
      {
        test: /\.css$/,
        loader:'file-loader',
        options:{
            name:'css/[name].[ext]'
        }
      },
      {
        test: /\.(png|gif|svg|jpg)$/,
        loader:'file-loader',
        options:{
            name:'img/[name].[ext]'
        }
      },
      {
        test: /\.html/,
        loader:'file-loader',
        options:{
            name: '[name].[ext]'
        }
      },
      {
        test: /(plugins|modernizr-3.8.0.min)\.js/,
        loader:'file-loader',
        options:{
            name: 'js/vendor/[name].[ext]'
        }
      },
      {
        test: /\.(otf|woff|woff2|eot|ttf)$/,
        use:[
            'file-loader'
        ]
      },
    ],
  },
  externals:{
      "jquery":"jQuery"
  },
  plugins: [
    new webpack.ProvidePlugin({$: 'jquery',jQuery: 'jquery'})
  ]
};
