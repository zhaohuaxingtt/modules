<!--
 * @Author: yuszhou
 * @Date: 2021-02-20 14:35:10
 * @LastEditTime: 2021-04-21 21:41:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \rise\src\components\iDropdown\index.vue
-->
<script>
import {Dropdown} from 'element-ui' 

export default{
  name:'iDropdown',
  extends:Dropdown,
}
</script>
<style lang='scss' scoped>
  .el-dropdown{
    height: $input-height;
  }
</style>