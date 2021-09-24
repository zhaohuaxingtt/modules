<!--
 * @Author: ldh
 * @Date: 2021-04-23 14:26:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-13 15:24:45
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\sample\index.vue
-->
<template>
  <div class="sample" v-loading="loading">
    <iCard>
      <tableList class="table" :selection="false" :tableData="tableListData" :tableTitle="isDb ? dbSampleTableTitle : tableTitle">
        <!-- <template #a="scope">
          <span>{{ $t(scope.row.a) }}</span>
        </template> -->
        <template #sampleUnitPrice="scope">
          <iInput v-if="!disabled" v-model="scope.row.sampleUnitPrice" @input="handleInputBySampleUnitPrice($event, scope.row)" />
          <span v-else>{{ scope.row.sampleUnitPrice }}</span>
        </template>
        <template #addionalMouldCost="scope">
          <iInput v-if="!disabled" v-model="scope.row.addionalMouldCost" @input="handleInputByAddionalMouldCost($event, scope.row)" />
          <span v-else>{{ scope.row.addionalMouldCost }}</span>
        </template>
        <template #addionalMouldLife="scope">
          <iInput v-if="!disabled" v-model="scope.row.addionalMouldLife" @input="handleInputByAddionalMouldLife($event, scope.row)" />
          <span v-else>{{ scope.row.addionalMouldLife }}</span>
        </template>
        <template #remark="scope">
          <iInput v-if="!disabled" v-model="scope.row.remark" />
          <span v-else>{{ scope.row.remark }}</span>
        </template>
      </tableList>
    </iCard>
  </div>
</template>

<script>
import { iCard, iInput,iMessage } from "rise"
import tableList from "../tableList"
import { sampleTableTitle ,dbSampleTableTitle } from "./data"
import { getToolingSample, saveToolingSample } from "@/api/rfqManageMent/quotationdetail"
import { numberProcessor } from '@/utils'

export default {
  components: {
    iCard,
    iInput,
    tableList
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
      default:false,
    },
    isDb: {
      type:Boolean,
      default:false,
    }
  },
  data() {
    return {
      loading: false,
      tableTitle:[],
      tableListData: [],
      dbSampleTableTitle
    }
  },
  created(){
    if(this.isDb){
        if(this.isAeko) {
          this.tableTitle = dbSampleTableTitle.filter((item)=>item.isAeko);
        } else {
          this.tableTitle = dbSampleTableTitle
        }
    } else {
      if(this.isAeko)
      {
          this.tableTitle = sampleTableTitle.filter((item)=>item.isAeko);
      } else {
        this.tableTitle = sampleTableTitle
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
      const limit = this.isAeko ? 0 : 2;
      this.$set(row, "addionalMouldLife", numberProcessor(value, limit))
    },
    // 保存工装样件，父组件通过ref调用
    save(type) {
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