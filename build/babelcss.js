/*
 * @Author: yuszhou
 * @Date: 2021-04-11 20:50:45
 * @LastEditTime: 2021-04-12 13:12:41
 * @LastEditors: Please set LastEditors
 * @Description: 实际上在babel生成的按需引入中，必须对应一个组件的style文件，但是我们的
 * css 已经连同组件，打包为了js文件。所以这个做法是在配合babel。
 * @FilePath: \front-modules\build\initPackage.js
 */
const fs = require('fs')
const path = require('path')
const resolve = dir => path.join(__dirname, dir)
const component = require('../components.json')
let components = Object.keys(component)
components.push('base')
components.forEach(element => {
  fs.mkdir(resolve(`../dist/lib/style/`),()=>{
    fs.writeFile(resolve(`../dist/lib/style/${element}.css`),'',(err)=>{
      if(err){
        console.log(`-----------------------写入配置文件错误:---------------------------------------------`)
        console.log(err)
      }
    }) 
  })
});