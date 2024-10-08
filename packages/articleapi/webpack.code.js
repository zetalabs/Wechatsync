const path = require('path')
const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const projectRoot = path.resolve(__dirname, '../../')

module.exports = env => {
  const prodMode = env.production

  resolve: {
    fallback: {
      util: require.resolve("util/")
    }
  }
  return {
    mode: 'production',
    entry: './src/driver.js',
    output: {
      globalObject: 'this',
      filename: 'code.js',
      path: path.resolve(__dirname, './dist'),
      clean: true,
      library: 'modules',
      libraryTarget: 'umd'
    },
    optimization: {
      minimize: false,
      usedExports: false,
    },
    plugins: [
      new Dotenv({
        path: path.resolve(
          projectRoot,
          prodMode ? '.env.production' : '.env.development'
        ),
        safe: true,
        ignoreStub: true,
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"',
          WECHAT_ENV: '"production"',
        },
      }),
      new NodePolyfillPlugin()
    ],
  }
}
