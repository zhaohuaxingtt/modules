/*
 * @Author: yuszhou
 * @Date: 2021-04-08 15:22:29
 * @LastEditTime: 2021-09-08 15:02:53
 * @LastEditors: Please set LastEditors
 * @Description: 开发人员本地开发时候，跑demo的时候，需要启动的webpack配置
 * @FilePath: \front-modules\src\vue.config.js
 */
const path = require('path')
const px2rem = require('postcss-px2rem')
const CompressionPlugin = require('compression-webpack-plugin')
const postcss = px2rem({
    remUnit: 16
})
const resolve = dir => path.join(__dirname, dir)
module.exports = {
        chainWebpack: config => {
            //定义全局别名
        config.resolve.alias
            .set('@', resolve('src'))
            .set('pages', resolve('src/views'))
        },
        configureWebpack:config => {
            config.plugins.push(
                new CompressionPlugin({
                algorithm: 'gzip',
                test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
                threshold: 5120,
                minRatio: 0.8,
                cache: true,
                deleteOriginalAssets: false
                })
            )
        },
          //引入全局css变量
        css: {
            //是否开起css分离
            extract: false,
            sourceMap: false,
            requireModuleExtension: true,
            loaderOptions: {
                sass: {
                    implementation: require('sass'),
                    data: [`@import "@/assets/global/index.scss";`]
                },
                postcss: {
                    plugins: {
                        postcss
                    }
                }
            }
        },
        transpileDependencies: [
            /[/\\]node_modules[/\\](.+?)?element-ui(.*)[/\\]packages/
        ]
}