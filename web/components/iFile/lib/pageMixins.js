/*
 * @Author: yuszhou
 * @Date: 2021-02-24 14:28:34
 * @LastEditTime: 2021-09-02 16:19:56
 * @LastEditors: Hao,Jiang
 * @Description: 针对所有的分页插件，实行方法混入。
 * @FilePath: \rise\src\utils\pageMixins.js
 */

 export const pageMixins = {
   data(){
     return {
       page:{
         totalCount:0, //总条数
         pageSize:10,   //每页多少条
         pageSizes:[10,20,50,100,300], //每页条数切换
         currPage:1,    //当前页
         layout:"sizes, prev, pager, next, jumper"
       }
     }
   },
   methods:{
    handleSizeChange(val,callback){
      if(typeof callback != 'function') return console.warn('function handleSizeChange parmars must be a function!')
      this.page.pageSize = val
      this.page.currPage = 1
      callback();
    },
    handleCurrentChange(val,callback){
      if(typeof callback != 'function') return console.warn('function handleCurrentChange parmars must be a function!')
      this.page.currPage = val
      callback();
    },
    pageParmars(){
      return {
        pageSize:this.page.pageSize,
        currPage:this.page.currPage
      }
    }
   }
 } 

