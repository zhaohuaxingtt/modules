/*
 * @Author: yuszhou
 * @Date: 2021-04-11 20:50:45
 * @LastEditTime: 2021-04-12 13:13:55
 * @LastEditors: Please set LastEditors
 * @Description: 在npm组件库中，必须存在一个package.json, 指定了默认加载的文件和不重复的版本号。
 * @FilePath: \front-modules\build\initPackage.js
 */
const fs = require('fs')
const path = require('path')
const resolve = dir => path.join(__dirname, dir)
const packagetext = fs.readFileSync('./package.txt','utf-8')
console.log(packagetext)
class RemovePackageJs {
  constructor(){}
  apply(compiler){
    compiler.plugin('compilation',function(){
      fs.writeFile(resolve("../dist/package.json"),packagetext,(err)=>{
        if(err){
          console.log(`-----------------------写入配置文件错误:---------------------------------------------`)
          console.log(err)
        }
      })
    })
  }
}
module.exports = RemovePackageJs