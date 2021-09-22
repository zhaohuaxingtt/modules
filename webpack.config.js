/*
 * @Author: yuszhou
 * @Date: 2021-04-07 13:37:58
 * @LastEditTime: 2021-05-26 12:21:23
 * @LastEditors: Please set LastEditors
 * @Description: 为组件库打包一个可以全量引入的webpack配置
 * @FilePath: \front-common\webpack.config.js
 */
var path = require('path')
var webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const px2rem = require('postcss-px2rem')
const postcss = new px2rem({
    remUnit: 16
})
module.exports = {
  mode:"production",
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist/lib'),
    publicPath: '/dist/',
    filename: 'rise.min.js',
    library: 'rise',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
          "postcss"
        ]
      },  
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
            {
            loader: 'postcss-loader',
            options: {
              plugins:[postcss]
              }
          },
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
                resources: './src/assets/global/variables.scss'
            }
          }
        ]
      },
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader?indentedSyntax',
          {
            loader: 'sass-resources-loader',
            options: {
                resources: './src/assets/global/variables.scss'
            }
          }
        ]
      },    
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: [
          /web/
        ],
        include: [
          path.resolve('src'),
          path.resolve('node_modules/element-ui/packages')
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [
          /web/,
        ],
        include: [
          path.resolve('src'),
          path.resolve('node_modules/element-ui/packages')
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  externals: {
    'vue': 'vue',
    'element-ui': 'element-ui'
  },
  resolve: {
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  }
}
// http://vue-loader.vuejs.org/en/workflow/production.html
module.exports.plugins = (module.exports.plugins || []).concat([
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"'
    }
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: true
  }),
  new VueLoaderPlugin(),
  new CopyWebpackPlugin([
    { from: `${ __dirname }/web`, to: `${ __dirname }/dist/web` },
  ])
])