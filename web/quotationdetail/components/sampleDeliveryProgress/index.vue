<!--
 * @Author: Luoshuang
 * @Date: 2021-05-27 15:54:05
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-11-09 21:32:55
 * @Description: 送样进度
 * @FilePath: \front-modules\web\quotationdetail\components\sampleDeliveryProgress\index.vue
-->

<template>
  <iCard class="sampleDelivery">
    <div class="header margin-bottom20">
      <span class="title">{{ language('LK_SONGYANGJINDU','送样进度') }}</span>
      <span class="margin-left10">
        <span class="tip">{{language('LK_YISHANGSONGYANGZHOUQIYIDINGDINASHIJIANWEIQISHIRI','备注：以上送样周期，均以定点时间为起始日')}}</span>
        <el-radio-group class="margin-left20" v-model="priceType" @change="tableData = tableDataCache[$event]">
          <el-radio label="LC">LC</el-radio>
          <el-radio label="SKD">SKD{{ isSkd || isSkdLc ? `（${ language("BITIAN", "必填") }）` : "" }}</el-radio>
        </el-radio-group>
      </span>
    </div>
    <tableList :selection="false" :tableTitle="tableTitle" :tableData="tableData" :tableLoading="loading">
      <template #supplierTime="scope">
        <div class="flexWrapper">
          <span v-if="!disabled && (['1st Tryout送样周期', 'EM送样周期'].includes(scope.row.sampleDeliverType) || isBmgpart)" :class="requiredClass()"></span>
          <iInput v-if="!disabled" v-model="scope.row.supplierTime" @click="handleInputBySupplierTime($event, row)"/>
          <span v-else>{{ scope.row.supplierTime }}</span>
        </div>
      </template>
      <template #remark="scope">
        <iInput v-if="!disabled" v-model="scope.row.remark" />
        <span v-else>{{ scope.row.remark }}</span>
      </template>
    </tableList>
    <!-- <iPagination
      v-update
      @size-change="handleSizeChange($event, getTableList)"
      @current-change="handleCurrentChange($event, getTableList)"
      background
      :page-sizes="page.pageSizes"
      :page-size="page.pageSize"
      :layout="page.layout"
      :current-page="page.currPage"
      :total="page.totalCount"
      :isEdit="!disabled"
    /> -->
  </iCard>
</template>

<script>
import { iCard, iInput, iMessage } from 'rise'
import { tableTitle, dateTemplate } from './data'
import tableList from "../tableList"
import { pageMixins } from "@/utils/pageMixins"
import { getSampleProgress, saveSampleProgress } from "@/api/rfqManageMent/quotationdetail"
import { cloneDeep } from "lodash"
import { numberProcessor } from "@/utils"
import { priceStatusMixin } from "../mixins"

export default {
  components: { iCard, iInput, tableList },
  mixins: [pageMixins, priceStatusMixin],
  props: {
    partInfo: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 判断是否是bmg零件
    isBmgpart() {
      return this.partInfo && this.partInfo.isBmg
    }
  },
  data() {
    return {
      loading: false,
      priceType: 'LC',
      tableTitle: tableTitle,
      tableData: JSON.parse(JSON.stringify(dateTemplate)),
      tableDataCache: {
        LC: JSON.parse(JSON.stringify(dateTemplate)),
        SKD: JSON.parse(JSON.stringify(dateTemplate))
      }
    }
  },
  methods: {
    init() {
      this.loading = true
      getSampleProgress({
        quotationId: this.partInfo.quotationId
      })
      .then(res => {
        if (res.code == 200) {
          if (Array.isArray(res.data.sampleProgressDTOList) && res.data.sampleProgressDTOList.length > 0) {
            res.data.sampleProgressDTOList.forEach(item => {
              switch(item.priceType) {
                case "LC":
                  for (let i = 0, template; (template = this.tableDataCache.LC[i++]); ) {
                    if (template.sampleDeliverType == item.sampleDeliverType) {
                      Object.keys(item).forEach(key => this.$set(template, key, item[key]))
                      break
                    }
                  }
                  break
                case "SKD":
                  for (let i = 0, template; (template = this.tableDataCache.SKD[i++]); ) {
                    if (template.sampleDeliverType == item.sampleDeliverType) {
                      Object.keys(item).forEach(key => this.$set(template, key, item[key]))
                      break
                    }
                  }
                  break
                default:
                  break
              }
            })
          }

          this.tableData = this.tableDataCache[this.priceType]
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }

        this.$nextTick(() => {
          this.loading = false
        })
      })
      .catch(() => this.loading = false)
    },
    save(type) {
      return new Promise((r,j)=>{
        const sampleProgressDTOS = [
          ...(this.tableDataCache.LC.map(item => ({
            ...item,
            priceType: "LC",
          }))),
          ...(this.tableDataCache.SKD.map(item => ({
            ...item,
            priceType: "SKD",
          }))),
        ]
        // let checkSupplierTimeNull = Boolean(sampleProgressDTOS.filter(o => o.priceType === this.priceType && ['1st Tryout送样周期', 'EM送样周期'].includes(o.sampleDeliverType) && !o.supplierTime).length)
        // this.isBmgpart && !checkSupplierTimeNull && (checkSupplierTimeNull = Boolean(sampleProgressDTOS.filter(o => o.priceType === this.priceType && ['OTS送样周期'].includes(o.sampleDeliverType) && !o.supplierTime).length))
        // if (checkSupplierTimeNull) {
        //   j()
        //   iMessage.error(this.language('LK_BITIANXIANGBUNENGWEIKONG','请输入必填项'))
        // } else {

          if (this.isSkd || this.isSkdLc) {
            sampleProgressDTOS.forEach((item) => {
              if (this.isSkd && item.priceType == "LC") return

              switch(item.sampleDeliverType) { 
                case "1st Tryout送样周期":
                  if (!item.supplierTime) {
                    j()
                    throw iMessage.warn(`${ item.priceType }: 1st Tryout送样周期 ${ this.language("LK_GONGYINGSHANGZHOUQIZHOU", "供应商周期(周)") }${ this.language("BUNENGWEIKONG", "不能为空") }`)
                  }
                case "EM送样周期":
                  if (!item.supplierTime) {
                    j()
                    throw iMessage.warn(`${ item.priceType }: EM送样周期 ${ this.language("LK_GONGYINGSHANGZHOUQIZHOU", "供应商周期(周)") }${ this.language("BUNENGWEIKONG", "不能为空") }`)
                  }
                case "OTS送样周期":
                  if (this.isBmgpart && !item.supplierTime) {
                    j()
                    throw iMessage.warn(`${ item.priceType }: OTS送样周期 ${ this.language("LK_GONGYINGSHANGZHOUQIZHOU", "供应商周期(周)") }${ this.language("BUNENGWEIKONG", "不能为空") }`)
                  }
                default:
              }
            })
          } else {
            sampleProgressDTOS.forEach(item => {
              if (item.priceType === this.priceType) {
                switch(item.sampleDeliverType) { 
                  case "1st Tryout送样周期":
                    if (!item.supplierTime) {
                      j()
                      throw iMessage.warn(`1st Tryout送样周期 ${ this.language("LK_GONGYINGSHANGZHOUQIZHOU", "供应商周期(周)") }${ this.language("BUNENGWEIKONG", "不能为空") }`)
                    }
                  case "EM送样周期":
                    if (!item.supplierTime) {
                      j()
                      throw iMessage.warn(`EM送样周期 ${ this.language("LK_GONGYINGSHANGZHOUQIZHOU", "供应商周期(周)") }${ this.language("BUNENGWEIKONG", "不能为空") }`)
                    }
                  case "OTS送样周期":
                    if (this.isBmgpart && !item.supplierTime) {
                      j()
                      throw iMessage.warn(`OTS送样周期 ${ this.language("LK_GONGYINGSHANGZHOUQIZHOU", "供应商周期(周)") }${ this.language("BUNENGWEIKONG", "不能为空") }`)
                    }
                  default:
                }
              }
            })
          }

          saveSampleProgress({
            quotationId: this.partInfo.quotationId,
            sampleProgressDTOS
          })
          .then(res => {
            const message = this.$i18n.locale === "zh" ? res.desZh : res.desEn

            if (res.code == 200) {
              r()
              if (type !== "submit") iMessage.success(message)
              this.init()
            } else {
              j()
              iMessage.error(message)
            }
          }).catch(()=>{
            j()
          })
        // }
      })
        
    },
    handleInputBySupplierTime(value, row) {
      row.supplierTime = numberProcessor(value, 2)
    },
    requiredClass() {
      if (this.isSkd) {
        return this.priceType === "SKD" ? { required: true } : {}
      }
      
      if (this.isSkdLc) {
        return { required: true }
      }

      return this.priceType === "LC" ? { required: true } : {}
    }
  }
}
</script>

<style lang="scss" scoped>
.sampleDelivery{
    .header {
        .title {
            height: 25px;
            line-height: 25px;
            font-size: 18px;
            font-weight: bold;
            color: #131523;
        }

        .tip {
            height: 20px;
            line-height: 20px;
            font-size: 14px;
            color: #86878e;
        }
    }
}
.required {
  display: inline-block;
  &:before {
    display: inline-block;
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
}

.flexWrapper {
  display: flex;
}
</style>