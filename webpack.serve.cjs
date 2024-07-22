const { merge } = require('webpack-merge');
const common = require('./webpack.common.cjs');

module.exports = merge(common, {
  devServer: {
    hot: false,
    port: 5501,
    allowedHosts: ['.loca.lt'],
    historyApiFallback: true,
  },
});
