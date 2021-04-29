<!--
* * @Author: shujie
 * @Date: 2021-4-23 15:52:57
 * @LastEditTime:2021-4-23 15:52:57
 * @LastEditors: Please set LastEditors
 * @Description: 基于element的Input组件，支持element全属性
 * @FilePath: \Front\src\components\iInput\index.vue
 -->
<script>
import { DatePicker } from 'element-ui' 
export default{
  extends:DatePicker,
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
</style>