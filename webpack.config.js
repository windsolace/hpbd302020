const webpack = require('webpack');
// const path = require("path");

module.exports = {
  mode: "development",
  output: {
    filename: "./bundle.js",
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
