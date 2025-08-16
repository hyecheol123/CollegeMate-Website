const { merge } = require('webpack-merge');
const common = require('./webpack.common.cjs');
const RefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    port: 3000,
    hot: true,
    allowedHosts: ['.loca.lt'],
    historyApiFallback: true,
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new RefreshWebpackPlugin(),
  ],
});
