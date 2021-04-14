<!--
 * @Author: yuszhou
 * @Date: 2021-03-01 17:10:03
 * @LastEditTime: 2021-04-12 02:37:39
 * @LastEditors: Please set LastEditors
 * @Description: 基于element的from封装。让在详情里的三列 或者 4列的列表数据能够在固定的格式下面快速展示出来。
                 el-form 新增一个props row --- number（3，4）
 * @FilePath: \rise\src\components\iFormGroup\index.vue
-->
<script>
import {Form} from 'element-ui'
export default{
    name:'iFormGroup',
    extends:Form,
    props:{
      row:{type:Number,default:3},
      icon:Boolean
    },
    mounted(){
      this.addClassElformItems()
    },
    methods:{
    getRowItemsNumber(){
      if(this.row){return 'row'+this.row}
      return null
    },
    getRowItemsIcon(){
      //if(this.icon) return 'icon_self';
      return null
    },
    addClassElformItems(){
      this.$el.querySelectorAll('.el-form-item').forEach(nodes=>{
        let hasRowClass = nodes.getAttribute('class').indexOf('row') == -1
        if(this.getRowItemsNumber()&& hasRowClass) nodes.classList.add(this.getRowItemsNumber())
        if(this.getRowItemsIcon()) nodes.classList.add(this.getRowItemsIcon())
      })
    }
  }
}
</script>
<style lang='scss' scoped>
  .el-form{
      &::after{
      content: "";
      display: block;
      height: 0;
      clear:both;
      visibility: hidden;
    }
  }
  .noMargin{
    .el-form-item{
      margin-bottom: 0px;
    }
  }
</style>