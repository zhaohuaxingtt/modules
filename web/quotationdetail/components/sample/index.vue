<!--
 * @Author: ldh
 * @Date: 2021-04-23 14:26:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-11-22 18:03:21
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\sample\index.vue
-->
<template>
  <div class="sample" v-loading="loading">
    <iCard>
      <tableList lang class="table" :selection="false" :tableData="tableListData" :tableTitle="sampleTableTitle">
        <!-- <template #a="scope">
          <span>{{ $t(scope.row.a) }}</span>
        </template> -->
        <template #sampleUnitPrice="scope">
          <!-- <iInput v-if="!disabled && !isOriginprice" v-model="scope.row.sampleUnitPrice" @input="handleInputBySampleUnitPrice($event, scope.row)" /> -->
          <thousandsFilterInput v-if="!disabled && !isOriginprice" :inputValue="scope.row.sampleUnitPrice" :numberProcessor="2" :handleArg="[scope.row]" @handleInput="handleInputBySampleUnitPrice" />
          <span v-else>{{ scope.row.sampleUnitPrice | thousandsFilter }}</span>
        </template>
        <template #addionalMouldCost="scope">
          <!-- <iInput v-if="!disabled && !isOriginprice" v-model="scope.row.addionalMouldCost" @input="handleInputByAddionalMouldCost($event, scope.row)" /> -->
          <thousandsFilterInput v-if="!disabled && !isOriginprice" :inputValue="scope.row.addionalMouldCost"  :numberProcessor="2" :handleArg="[scope.row]"  @handleInput="handleInputByAddionalMouldCost" />
          <span v-else>{{ scope.row.addionalMouldCost | thousandsFilter }}</span>
        </template>
        <template #addionalMouldLife="scope">
          <iInput v-if="!disabled && !isOriginprice" v-model="scope.row.addionalMouldLife" @input="handleInputByAddionalMouldLife($event, scope.row)" />
          <span v-else>{{ scope.row.addionalMouldLife | thousandsFilter}}</span>
        </template>
        <template #remark="scope">
          <iInput v-if="!disabled && !isOriginprice" v-model="scope.row.remark" />
          <span v-else>{{ scope.row.remark }}</span>
        </template>
      </tableList>
    </iCard>
  </div>
</template>

<script>
import { iCard, iInput,iMessage } from "rise"
import tableList from "../tableList"
import { sampleTableTitle  } from "./data"
import { getToolingSample, saveToolingSample } from "@/api/rfqManageMent/quotationdetail"
import { numberProcessor } from '@/utils'
import filters from "@/utils/filters"
import thousandsFilterInput from 'rise/web/aeko/quotationdetail/components/thousandsFilterInput'

export default {
  mixins: [ filters ],
  components: {
    iCard,
    iInput,
    tableList,
    thousandsFilterInput,
  },
  props: {
    partInfo: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isAeko:{
      type:Boolean,
      default: false,
    },
    isDb: {
      type:Boolean,
      default: false,
    },
    isOriginprice: {
      type:Boolean,
      default: false,
    }
  },
  data() {
    return {
      loading: false,
      tableListData: [], 
      sampleTableTitle:sampleTableTitle(true) // 
    }
  },
  created(){
    if(this.isDb){
       if(this.isAeko)
      {
         this.sampleTableTitle=sampleTableTitle(false).filter((item)=>item.isAeko);
      } else {
        this.sampleTableTitle =sampleTableTitle(false)
      }
    } else {
      if(this.isAeko)
      {
         this.sampleTableTitle=sampleTableTitle(true).filter((item)=>item.isAeko);
      } else {
        this.sampleTableTitle =sampleTableTitle(true)
      }
    }
  },
  methods: {
    // 获取工装样件
    init() {
      this.loading = true

      getToolingSample(this.partInfo.quotationId)
      .then(res => {
        if (res.code == 200) {
          this.tableListData = Array.isArray(res.data.toolingSampleDTOList) ? res.data.toolingSampleDTOList : []
        } else {
          iMessage.error(this.$i18n.locale === 'zh' ? res.desZh : res.desEn)
        }

        this.loading = false
      })
      .catch(() => this.loading = false)
    },
    handleInputBySampleUnitPrice(value, row) {
      this.$set(row, "sampleUnitPrice", numberProcessor(value, 2))
    },
    handleInputByAddionalMouldCost(value, row) {
      this.$set(row, "addionalMouldCost", numberProcessor(value, 2))
    },
    handleInputByAddionalMouldLife(value, row) {
      this.$set(row, "addionalMouldLife", numberProcessor(value, 0))
    },
    // 保存工装样件，父组件通过ref调用
    save(type) {
      console.log(this.tableListData,'tableListData');
      return new Promise((r,j)=>{
        saveToolingSample({
          quotationId: this.partInfo.quotationId,
          toolingSampleDTOList: this.tableListData
        })
        .then(res => {
          if (res.code == 200) {
            if (type !== "submit") {
              iMessage.success(this.$i18n.locale === 'zh' ? res.desZh : res.desEn)
            }
            this.init()
            r(res)
          } else {
            iMessage.error(this.$i18n.locale === 'zh' ? res.desZh : res.desEn)
            j(res)
          }
        }).catch(rej=>{
          j(rej)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sample {

}
</style>