/*
 * @Author: your name
 * @Date: 2021-04-14 15:44:20
 * @LastEditTime: 2021-04-21 20:24:14
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \front-modules\babel.config.js
 */
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}