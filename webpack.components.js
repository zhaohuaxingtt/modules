/*
 * @Author: yuszhou
 * @Date: 2021-04-07 13:37:58
 * @LastEditTime: 2021-04-15 09:47:05
 * @LastEditors: Please set LastEditors
 * @Description: 按需引入的时候，需要在dist下面为每个组件都生成一个组件的打包文件，多入口统一出口。
 * @FilePath: \front-common\webpack.config.js
 */
var path = require('path')
var webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const compoents = require('./components.json')
const Packageloader = require('./build/initPackage')
const px2rem = require('postcss-px2rem')
const postcss = new px2rem({
    remUnit: 16
})
module.exports = {
  mode:"production",
  entry: compoents,
  output: {
    path: path.resolve(__dirname, './dist/lib'),
    publicPath: '/dist/',
    filename: '[name].js',
    chunkFilename: '[id].js',
    libraryTarget: 'umd',
    library: 'rise',
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
            },
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
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
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
    'vue': { commonjs: 'vue', commonjs2: 'vue', root: 'Vue' },
    'element-ui': 'element-ui',
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
  new Packageloader()
])