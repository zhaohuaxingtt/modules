<!--
 * @Author: yuszhou
 * @Date: 2021-02-22 13:59:24
 * @LastEditTime: 2021-04-12 02:39:14
 * @LastEditors: Please set LastEditors
 * @Description: 项目中使用到的按钮集合。
 * @FilePath: \rise\src\components\iButton\index.vue
-->
<script>
import { Button } from 'element-ui'
/**
 * @example ./README.me
*/
export default{
  name:'iButton',
  extends:Button
}
</script>
<style lang='scss' scoped>
.el-button{
  border:transparent;
}
.el-button--default{
    background-color: $color-btn-background;
    padding: 9px 20px;
    font-size: 16px;
    color: $color-blue;
    min-width: 100px;
    .el-icon-loading{
      color:$color-blue;
    }
    &:hover{
      background-color: $color-blue;
      color:$color-white;
    }
}
.is-disabled{
  color: #ACB8CF;
   &:hover{
      background-color: $color-btn-background;
      color:#ACB8CF;
    }
}
.el-button--mini{
  padding: 7px 15px;
  font-size: 12px;
}
</style>