/*
 * @Author: yuszhou
 * @Date: 2021-04-07 13:52:03
 * @LastEditTime: 2021-04-12 13:18:44
 * @LastEditors: Please set LastEditors
 * @Description:自动生成文档的配置文件，对那个目录需要生成文档，做了控制
 * @FilePath: \front-common\vuese.config.js
 */

module.exports = {
  title: "Rise Components v1", // 文档的标题
  components: "./src/components/**/*.vue", // 组件的目录
  defaultExample: false, // 是否使用默认样例
  usageMode: "expand", // 是否展开用法
  exampleMode: "expand", // 是否展开示例代码
  styleguideDir: "styleguide", // 打包的目录
  codeSplit: true, // 打包时是否进行分片
  skipComponentsWithoutExample: false, // 是否跳过没有样例的组件
};
