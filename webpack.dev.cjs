const { merge } = require('webpack-merge');
const common = require('./webpack.common.cjs');
const RefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    port: 5500,
    hot: true,
    allowedHosts: ['.loca.lt'],
    historyApiFallback: true,
    proxy: [
      {
        context: ['/api'],
        target: 'https://public.enroll.wisc.edu',
        changeOrigin: true,
        secure: true,
        logLevel: 'debug',
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new RefreshWebpackPlugin(),
  ],
});
