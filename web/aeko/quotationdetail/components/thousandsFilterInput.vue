<!--
 * @Author: wentliao
 * @Date: 2021-11-22 14:35:47
 * @Description: 处理千分位输入框
-->
<template>
  <div>
      <!--  -->
      <iInput  v-if="showInput" :disabled="filterDisabled" @input="handleInput" v-model.trim="inputValue" @blur="changeFocus(false)"/>
       <iInput v-else :disabled="filterDisabled" :value="filterValue" @focus="changeFocus(true)"/>
      
  </div>
</template>

<script>
import {
    iInput,
} from 'rise';
import filters from "@/utils/filters"
import { numberProcessor } from '@/utils'
export default {
    name:'thousandsFilterInput',
    mixins: [ filters ],
    components:{
        iInput,
    },
    props:{
        inputValue:{
            type:String,
            default:'',
        },
        filterDisabled:{
            type:Boolean,
            default:false,
        },
        numProcessor:{
            type:Number,
            default:2
        },
        handleArg:{  // 输入之后调用函数的额外参数
            type:Array,
            default:()=>[],
        }
    },
    computed:{
        filterValue(){
            const value = this.inputValue;
            return value ? filters.filters.thousandsFilter(value) : '';
        }
    },
    data(){
        return{
            showInput:false,
        }
    },
    methods:{
        handleInput(value){
            const num = this.numProcessor;
            this.inputValue = numberProcessor(value,num);
            const {handleArg} = this;
            this.$emit('handleInput',value,...handleArg);
        },
        changeFocus(value){
            this.showInput = value;
        },
    }
}
</script>

<style>

</style>