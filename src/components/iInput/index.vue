<!--
 * @Author: yuszhou
 * @Date: 2020-07-30 12:23:08
 * @LastEditTime: 2021-04-21 21:40:18
 * @LastEditors: Please set LastEditors
 * @Description: 基于element的Input组件，支持element全属性
 * @FilePath: \Front\src\components\iInput\index.vue
--> 
<script>
import { Input } from 'element-ui' 
/**
 * @example ./README.me
*/
export default{
  name:'iInput',
  extends:Input,
  methods: {
    handleInput(e) {
      const input = this.getInput()
      if (this.isComposing) return
      
      if (this.type === 'text') input.value = e.target.value.trim() // CRW1-8418
      
      if (e.target.value === this.nativeInputValue) return
      this.$emit('input', e.target.value)
      this.$nextTick(this.setNativeInputValue)
    }
  }
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