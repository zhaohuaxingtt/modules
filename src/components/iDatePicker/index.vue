<!--
* * @Author: shujie
 * @Date: 2021-4-23 15:52:57
 * @LastEditTime: 2021-05-13 23:57:50
 * @LastEditors: Please set LastEditors
 * @Description: 基于element的Input组件，支持element全属性
 * @FilePath: \Front\src\components\iInput\index.vue
 -->
<script>
import { DatePicker } from 'element-ui' 
/**
 * @example ./README.me
*/
export default{
  extends:DatePicker,
	props:{
		valueFormat:{
			type:String,
			default:'yyyy-MM-dd HH:mm:ss'
		}
	}
}
</script>
<style lang='scss' scoped>
	.el-input{
		width: 100%;
		height: $input-height;
		::v-deep .el-input__inner{
			@include input_inner;
		}
	}
 .el-range-editor.el-input__inner {
    width: auto;
    @include input_inner;
  } 
  .el-range-editor .el-range-input {
    width: 40%;
  }
  .el-date-editor .el-range-separator {
    line-height: 22px;
    width: 10%;
  }
  .el-date-editor .el-range__close-icon {
    display: none;
  }
</style>