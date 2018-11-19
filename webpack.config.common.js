const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    main: './src/index.js',
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Output Mgmt',
      template: 'src/index.html',
    }),
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
}
