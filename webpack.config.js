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
        test: /\.(png|gif|svg|jpg)/,
        use:[
            'file-loader'
        ]
      },
      {
        test: /\.html/,
        loader:'file-loader',
        options:{
            name: '[name].[ext]'
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
