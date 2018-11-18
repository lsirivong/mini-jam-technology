const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = env => ({
  mode: env && env.production ? 'production' : 'development',
  entry: {
    main: './src/index.js',
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Output Mgmt',
      template: 'src/index.html',
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        type: 'javascript/auto',
        test: /\.json$/,
        use: [
          {
            loader: 'file-loader',
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif|fnt)$/,
        use: [
          {
            loader: 'file-loader',
          }
        ]
      }
    ]
  }
})
