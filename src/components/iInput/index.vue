<!--
 * @Author: yuszhou
 * @Date: 2020-07-30 12:23:08
 * @LastEditTime: 2021-04-11 16:15:38
 * @LastEditors: Please set LastEditors
 * @Description: 基于element的Input组件，支持element全属性
 * @FilePath: \Front\src\components\iInput\index.vue
--> 
<script>
import { Input } from 'element-ui' 
export default{
  name:'iInput',
  extends:Input,
}
</script>
<style lang='scss' scoped>
  .el-input{
    height: $input-height;
    .el-input__inner{
      @include input_inner;
    }
  }
  .el-textarea{
    .el-textarea__inner{
      @include textarea_inner;
    }
  }
</style>