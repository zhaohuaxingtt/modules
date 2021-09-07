<!--
 * @Author: wentliao
 * @Date: 2021-08-25 09:56:39
 * @Description: 
-->
<template>
  <!-- 样件费 -->
  <iCard class="sampleFee">
    <template #header>
        <div class="header">
          <div>
            <span class="title">{{ language('LK_DAMAGES_SAMPLEFEE_YANGJIANFEI','样件费') }}</span>
          </div>
          <div class="control">
            <iButton @click="save">{{language('LK_BAOCUN','保存')}}</iButton>
          </div>
        </div>
      </template>
      <div>
        <sample ref="sample" :partInfo="basicInfo" :isAeko="true"/>
      </div>
  </iCard>
</template>

<script>
import {
  iCard,
  iButton,
  iInput,
} from 'rise'
import sample from 'rise/web/quotationdetail/components/sample'

export default {
  components:{
    iCard,
    iButton,
    sample,
  },
  props:{
    basicInfo:{
      type:Object,
      default:()=>{},
    }
  },
  data(){
    return{
      loading:false,
    }
  },
  methods:{
    // 保存
    save(){
      this.$refs.sample.save();
    },
    init(){
      this.$refs.sample.init();
    },
  },
}
</script>

<style lang="scss" scoped>
  .sampleFee{
    width: 100%;
    .header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title {
        height: 25px;
        line-height: 25px;
        font-size: 18px;
        font-weight: bold;
        color: #131523;
      }
    }
    .tableInput{
      width: 70%;
    }
  }
</style>