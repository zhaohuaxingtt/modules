<!--
 * @Author: yuszhou
 * @Date: 2021-03-01 10:06:56
 * @LastEditTime: 2021-04-21 21:39:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \rise\src\components\iDialog\index.vue
-->
<script>
import {Dialog} from 'element-ui'

/**
 * @example ./README.me
 */
export default {
  name: 'iDialog',
  extends: Dialog
}
</script>
<style lang='scss' scoped>
::v-deep .el-dialog {
  border-radius: 10px;

  @mixin pdlr {
    padding-left: 40px;
    padding-right: 40px;
  }

  .el-dialog__header {
    padding: 30px 0;
    @include pdlr;

    .el-dialog__title {
      font-size: 18px;
      font-weight: bold;
      line-height: 25px;
    }

    .el-dialog__headerbtn {
      transition: 150ms all;
      width: 24px;
      height: 24px;
      background: #A0BFFC;
      border-radius: 50%;
      top: 27px;
      right: 25px;

      &:hover {
        background: $color-blue;
      }

      i {
        line-height: 24px;
        color: $color-white;
        font-weight: bold;
      }
    }
  }

  .el-dialog__header,
  .el-dialog__body,
  .el-dialog__footer {
    @include pdlr;
  }
}
</style>
