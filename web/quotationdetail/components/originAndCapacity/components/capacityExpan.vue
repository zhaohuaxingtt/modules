<!--
 * @Author: haojiang
 * @Date: 2021-07-09 15:47:10
 * @LastEditTime: 2021-07-12 11:08:32
 * @LastEditors: Please set LastEditors
 * @Description: 扩产能计划
-->
<template>
  <iCard class="caexpan-card" :title="i18nLanguage('KUOCHANNENGJIHUA','扩产能计划')">
    <div class="caexpan-card-body">
      <el-table
        fit
        border
        tooltip-effect='light'
        :data='dataList'
        width="100%"
        default-expand-all
        :empty-text="i18nLanguage('LK_ZANWUSHUJU','暂无数据')"
        class="capacityTable">
        <el-table-column
          align='center'
          width="150"
          prop="capacityExtPlan"
          :label="i18nLanguage('KUOCHANNENGJIHUA','扩产能计划')">
        </el-table-column>
        <el-table-column
          align='center'
          prop="eday"
          label="">
        <template slot="header">
          <div class="auoHeader">
            <div class="auoHeaderRow">{{i18nLanguage('CAP_EATCHANNENGTIAN','E./AT产能/天')}}</div>
            <div class="auoHeaderCol"><div>Norm.</div><div>Max.</div></div>
          </div>
        </template>
        <template slot-scope="scope">
          <div class="auoCol">
             <div>
              <iInput
                v-model="scope.row.capacityNormDay"
                :placeholder="i18nLanguage('LK_QINGSHURU','请输入')"
                :disabled="disabled"
                clearable
              ></iInput>
            </div>
            <div>
              <iInput
                v-model="scope.row.capacityMaxDay"
                :placeholder="i18nLanguage('LK_QINGSHURU','请输入')"
                :disabled="disabled"
                clearable
              ></iInput>
            </div>
          </div>
        </template>
        </el-table-column>
        <el-table-column
          align='center'
          prop="eday"
          label="">
        <template slot="header">
          <div class="auoHeader">
            <div class="auoHeaderRow">{{i18nLanguage('CAP_CHANNENGZHOU','E./AT产能/周')}}</div>
            <div class="auoHeaderCol"><div>Norm.</div><div>Max.</div></div>
          </div>
        </template>
        <template slot-scope="scope">
          <div class="auoCol">
            <div>
              <iInput
                v-model="scope.row.capacityNormWeek"
                :placeholder="i18nLanguage('LK_QINGSHURU','请输入')"
                :disabled="disabled"
                clearable
              ></iInput>
            </div>
            <div>
              <iInput
                v-model="scope.row.capacityMaxWeek"
                :placeholder="i18nLanguage('LK_QINGSHURU','请输入')"
                :disabled="disabled"
                clearable
              ></iInput>
            </div>
          </div>
        </template>
        </el-table-column>
        <el-table-column
          align='center'
          prop="eday"
          label="">
        <template slot="header">
          <div class="auoHeader">
            <div class="auoHeaderRow">{{i18nLanguage('CAP_CHANNENGNIAN','E./AT产能/年')}}</div>
            <div class="auoHeaderCol"><div>Norm.</div><div>Max.</div></div>
          </div>
        </template>
        <template slot-scope="scope">
          <div class="auoCol">
            <div>
              <iInput
                v-model="scope.row.capacityNormYear"
                :placeholder="i18nLanguage('LK_QINGSHURU','请输入')"
                :disabled="disabled"
                clearable
              ></iInput>
            </div>
            <div>
              <iInput
                v-model="scope.row.capacityMaxYear"
                :placeholder="i18nLanguage('LK_QINGSHURU','请输入')"
                :disabled="disabled"
                clearable
              ></iInput>
            </div>
          </div>
        </template>
        </el-table-column>
      </el-table>
    </div>
  </iCard>
</template>

<script>
import {iCard, iInput, iMessage} from 'rise'
import { 
  getQuotCapacityExtPlan,
  saveQuotCapacityExtPlan
} from "@/api/rfqManageMent/capacityExt"

export default {
  components: {
    iCard,
    iInput
  },
  props: {
    quotationId: {
      type: String,
      default: ''
    },
    partInfo: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dataList: [],
    }
  },
  methods: {
    i18nLanguage(key, value) {
      return this.language ? this.i18nLanguage(key, value) : this.$t(key)
    },
    async getFetchData() {
      try {
        const res = await getQuotCapacityExtPlan({
          quotationId: this.quotationId || this.partInfo.quotationId || '',
        })
        if (res.code === '200') {
          // 基础信息
          const dataList = res.data.capacityExtPlanDTOS || []
          dataList.map(o => {
            o.capacityNormDay && (o.capacityNormDay = String(Number(o.capacityNormDay).toFixed(2)))
            o.capacityMaxDay && (o.capacityMaxDay = String(Number(o.capacityMaxDay).toFixed(2)))
            o.capacityNormWeek && (o.capacityNormWeek = String(Number(o.capacityNormWeek).toFixed(2)))
            o.capacityMaxWeek && (o.capacityMaxWeek = String(Number(o.capacityMaxWeek).toFixed(2)))
            o.capacityNormYear && (o.capacityNormYear = String(Number(o.capacityNormYear).toFixed(2)))
            o.capacityMaxYear && (o.capacityMaxYear = String(Number(o.capacityMaxYear).toFixed(2)))
            return o
          })
          this.dataList = dataList
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      } catch(e) {
        iMessage.error(this.$i18n.locale === "zh" ? e.desZh : e.desEn)
      }
    },
    async save() {
      let state = true
      try {
        const res = await saveQuotCapacityExtPlan({
          capacityExtPlanDTOS: this.dataList,
          quotationId: this.quotationId || this.partInfo.quotationId || '',
        })
        if (res.code === '200') {
          this.getFetchData()
          iMessage.success(this.i18nLanguage('LK_CAOZUOCHENGGONG','操作成功'))
          state = true
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
          state = false
        }
      } catch(e) {
        iMessage.error(this.$i18n.locale === "zh" ? e.desZh : e.desEn)
        state = false
      }
      return state
    },

  }
}
</script>
<style lang="scss" scoped>
.capacityTable {
  ::v-deep .el-table {
    height: 450px;
  }
  ::v-deep .el-table--border {
    th,td {
      border-bottom: 1px solid #fff !important;
      border-right: 1px solid #fff !important;
      &.pin {
        background: #e8f6fb;
        &.dbl {
          background: #effbfb;
        }
        .cell {
          color: #32cec7;
        }
      }
    }
  }
  &.en ::v-deep.el-table_1_column_1 {
    border-right: 0px !important;
  }
  .tableSelection {
    line-height: 1rem;
    letter-spacing: 0px;
    padding-top: 5px
  }
  ::v-deep .tline {
    padding: 0px;
  }
  ::v-deep.el-table_1_column_3,::v-deep.el-table_1_column_4,::v-deep.el-table_1_column_5 {
    padding: 0px;
    .cell {
      padding-left: 0px;
      padding-right: 0px;
    }
  }
  .auoHeader {
    text-align: center;
    &.lineheight1 {
      line-height: 1;
    }
    .auoHeaderRow {
      text-align: center;
    }
    .auoHeaderCol {
      display: flex;
      align-content: space-between;
      justify-content: center;
      position: relative;
      
      &:before {
        content: '';
        display: block;
        width: 100%;
        height: 1px;
        background: #EBEEF5;
        position: absolute;
        left: 0px;
        top: 0px;
      }
      &:after {
        content: '';
        display: block;
        width: 1px;
        height: 100%;
        background: #EBEEF5;
        position: absolute;
        left: 50%;
        top: 0px;
      }
      &>div {
        width: 50%;
        text-align: center;
      }
    }
    
    p {
      height: 50%;
      line-height: 2rem;
      text-align: center;
      border-bottom: 1px solid #EBEEF5;
      &:last-child {
        border-bottom: 0px;
      }
    }
  }
  .auoCol {
    display: flex;
    align-content: space-between;
    justify-content: center;
    position: relative;
    &>div {
      width: 50%;
      text-align: center;
      box-sizing: border-box;
      padding: 0 10px;
    }
  }
}
.caexpan-card {
  .tit {
    padding: 15px 0;
  }
  .caexpan-card-body {
  }
}
</style>