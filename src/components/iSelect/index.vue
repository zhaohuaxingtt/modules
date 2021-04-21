<!--
 * @Author: yuszhou
 * @Date: 2021-02-20 14:35:10
 * @LastEditTime: 2021-04-21 21:41:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \rise\src\components\iSelect\index.vue
-->
<script>
import {Select} from 'element-ui' 
/**
 * @example ./README.me
*/
export default{
  name:'iSelect',
  extends:Select,
    computed:{
    iconClass() {
        return this.remote && this.filterable ? '' : (this.visible ? ' is-reverse el-icon-caret-top' : ' el-icon-caret-top');
    }
  }
}
</script>
<style lang='scss' scoped>
  .el-select{
    height: $input-height;
    width: 100%;
    ::v-deep .el-input__inner{
      @include input_inner;
    }
    .el-input__icon{
      line-height: 33px;
    }
  }
</style>