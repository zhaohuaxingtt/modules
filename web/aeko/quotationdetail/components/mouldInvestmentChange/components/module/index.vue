<template>
  <iCard class="module">
    <template #header>
      <div class="title">
        <span>{{ `${ language("MUJUCBD", "模具CBD") } ${ language("BIANJILAN", "编辑栏") }` }}</span>
        <span class="tip margin-left14">({{ language("DANWEI", "单位") }}：{{ language("YUAN", "元") }})</span>
      </div>
      <div class="header-control">
				<div class="btn">
          <iButton v-if="!disabled" @click="handleAdd">{{ language("TIANJIAHANG", "添加行") }}</iButton>
          <iButton v-if="!disabled" @click="handleDelete">{{ language("SHANCHUHANG", "删除行") }}</iButton>
          <iButton @click="handleQuote">{{ language("GUANLIANLINGJIAN", "关联零件") }}</iButton>
          <iButton v-if="!disabled" :loading="saveLoading" @click="handleSave">{{ language("BAOCUN", "保存") }}</iButton>
				</div>
      </div>
    </template>
    <div class="body margin-top18">
      <div class="mainTip">{{ language("AEKOQUOTATIONMODULETIP", "当模具行项目不分摊进单价，”修模”或”减值”必须先引用原零件模具CBD; 当以下模具行项目将分摊进单价，”修模”或”减值”无需引用原零件模具CBD。") }}</div>
      <tableList 
        lang
        class="table"
        v-loading="loading"
        :tableTitle="tableTitle"
        :tableData="tableListData"
        @handleSelectionChange="handleSelectionChange">
          <template #isShared="scope">
            <iSelect v-if="!disabled && !isQuote(scope.row)" v-model="scope.row.isShared" @change="handleChangeByIsShared($event, scope.row)">
              <el-option :label="language('SHI', '是')" :value="1"></el-option>
              <el-option :label="language('FOU', '否')" :value="0"></el-option>
            </iSelect>
            <span v-else>{{ scope.row.isShared | statesFilter }}</span>
          </template>
          <template #changeType="scope">
            <iSelect v-if="scope.row.isShared == 1 && !disabled" v-model="scope.row.changeType" @change="handleChangeByChangeType($event, scope.row)">
              <el-option :label="language('XINZENG', '新增')" value="新增"></el-option>
              <el-option :label="language('XIUMU', '修模')" value="修模"></el-option>
              <el-option :label="language('JIANZHI', '减值')" value="减值"></el-option>
            </iSelect>
            <span v-else>{{ scope.row.changeType }}</span>
          </template>
          <template #stuffType="scope">
            <iInput v-if="!isQuote(scope.row) && !disabled" v-model="scope.row.stuffType"></iInput>
            <span v-else>{{ scope.row.stuffType }}</span>
          </template>
          <template #mouldType="scope">
            <iInput v-if="!isQuote(scope.row) && !disabled" v-model="scope.row.mouldType" @input="handleInputByMouldType($event, scope.row)"></iInput>
            <span v-else>{{ scope.row.mouldType }}</span>
          </template>
          <template #assetTypeCode="scope">
            <iSelect v-if="!isQuote(scope.row) && !disabled" v-model="scope.row.assetTypeCode">
              <el-option v-for="assetType in assetTypeCodeOptions" :key="assetType.value" :label="assetType.label" :value="assetType.value"></el-option>
            </iSelect>
            <span v-else>{{ scope.row.assetTypeCode }}</span>
          </template>
          <template #assembledPartPrjCode="scope">
            <iInput v-if="!isQuote(scope.row) && !disabled" v-model="scope.row.assembledPartPrjCode"></iInput>
            <span v-else>{{ scope.row.assembledPartPrjCode }}</span>
          </template>
          <template #supplierPartNameList="scope">
            <iInput v-if="!isQuote(scope.row) && !disabled" v-model="scope.row.supplierPartNameList" @input="handleInputBySupplierPartNameList($event, scope.row)"></iInput>
            <span v-else>{{ scope.row.supplierPartNameList }}</span>
          </template>
          <template #supplierPartCodeList="scope">
            <iInput v-if="!isQuote(scope.row) && !disabled" v-model="scope.row.supplierPartCodeList"></iInput>
            <span v-else>{{ scope.row.supplierPartCodeList }}</span>
          </template>
          <template #quantity="scope">
            <iInput v-model="scope.row.quantity" @input="handleInputByNumber($event, 'quantity', scope.row, 0, updateQuantity)"></iInput>
          </template>
          <template #changeUnitPrice="scope">
            <iInput v-model="scope.row.changeUnitPrice" @input="handleInputByNumber($event, 'changeUnitPrice', scope.row, 2, updateChangeUnitPrice, scope.row.changeType === '减值')"></iInput>
          </template>
      </tableList>
      <iFormGroup class="subCost margin-top30" :row="4" inline>
        <iFormItem class="item" v-for="(info, $index) in mouldCostInfos" :key="$index" :label="`${ language(info.key, info.name) }`">
          <iInput v-if="info.props === 'shareQuantity' && !disabled" v-model="dataGroup[info.props]" @input="handleInputByShareQuantity" />
          <iText v-else>{{ dataGroup[info.props] }}</iText>
        </iFormItem>
      </iFormGroup>
    </div>
  </iCard>
</template>

<script>
/* eslint-disable no-undef */

import { iCard, iButton, icon, iFormGroup, iFormItem, iSelect, iInput, iText, iMessageBox, iMessage } from "rise"
import tableList from "rise/web/quotationdetail/components/tableList"
import { moduleTableTitle as tableTitle, assetTypeCodeOptions, mouldCostInfos } from "../data"
import { statesFilter } from "rise/web/quotationdetail/components/mouldAndDevelopmentCost/components/data"
import { handleInputByNumber } from "rise/web/aeko/quotationdetail/components/aPriceChange/components/data"
import { numberProcessor } from "@/utils"
import { getMoulds, saveMoulds } from "@/api/aeko/quotationdetail"

export default {
  components: { iCard, iButton, icon, iFormGroup, iFormItem, iSelect, iInput, iText, tableList },
  props: {
    partInfo: {
      type: Object,
      required: true,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      dataGroup: {},
      tableTitle,
      tableListData: [],
      multipleSelection: [],
      assetTypeCodeOptions,
      mouldCostInfos,
      indexSet: new Set(),
      saveLoading: false, 
    }
  },
  filters: {
    statesFilter
  },
  computed: {
    //eslint-disable-next-line no-undef
    ...Vuex.mapState({
        userInfo: state => state.permission.userInfo,
    })
  },
  methods: {
    getMoulds() {
      this.loading = true

      getMoulds({
        // rfqId: this.partInfo.rfqId,
        quotationId: this.partInfo.quotationId
      })
      .then(res => {
        if (res.code == 200) {
          this.tableListData = Array.isArray(res.data.mouldCbdEntityList) ? res.data.mouldCbdEntityList : []
          this.$set(this.dataGroup, "totalPrice", res.data.totalInvestmentCost)
          this.$set(this.dataGroup, "shareTotal", res.data.shareInvestmentFee)
          this.$set(this.dataGroup, "shareQuantity", res.data.shareQuantity)
          this.$set(this.dataGroup, "shareAmount", res.data.unitInvestmentCost)

          this.indexSet = new Set()
          if (this.tableListData.length) {
            this.tableListData.forEach(item => {
              if (item.mouldId) {
                const index = item.mouldId.replace(/.*_T(\d+)$/, "$1")

                if (+index) this.indexSet.add(+index)
              }
            })
          }

          this.indexSet.add(0)
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      })
      .finally(() => this.loading = false)
    },
    handleSelectionChange(list) {
      this.multipleSelection = list
    },
    handleAdd() {
      let index = 0
      while(true) {
        if (this.indexSet.has(index)) {
          index += 1
        } else break
      }

      this.tableListData.push({
        mouldId: `${ this.partInfo.rfqId }_${ this.userInfo.supplierId ? this.userInfo.supplierId : this.$route.query.supplierId }_${ this.partInfo.partNum }_T${ this.indexProcess(index) }`,
        changeType: "新增"
      })

      this.indexSet.add(index)
    },
    addQuote(list) {
      const quoteList = list.map(item => ({
        mouldId: item.moldId,
        bmNum: item.bmNum,
        bmSerialNum: item.bmSerial,
        isShared: item.isShared,
        fixedAssetsName: item.assetName,
        stuffType: item.craftType,
        mouldType: item.moldType,
        assetTypeCode: item.assetTypeNum,
        assembledPartPrjCode: item.fsNum,
        supplierPartNameList: item.partsName,
        supplierPartCodeList: item.partsNum,
        quantity: item.count,
        originTotalPrice: item.assetTotal,
        originPartNums: item.partsShareNum
      }))

      this.tableListData.concat(quoteList)
    },
    isQuote(row) {
      return !!row.originPartNums
    },
    async handleDelete() {
      if (this.multipleSelection.length) {
        await iMessageBox(
          this.language("QINGQUERENSHIFOUSHANCHUSUOXUANZHONGDEMUJUHANGXIANGMU", "请确认是否删除所选中的模具行项目？"),
          { confirmButtonText: this.language("SHI", "是"), cancelButtonText: this.language("FOU", "否") }
        )
      }

			this.tableListData = this.tableListData.filter(item => !this.multipleSelection.includes(item))
      this.multipleSelection.forEach(item => {
        const index = item.mouldId.replace(/.*_T(\d+)$/, "$1")
        if (+index) {
          this.indexSet.delete(+index)
        }
      })

      this.computeTotalPriceSum()
      this.computeShareTotalSum()
		},
    handleQuote() {
      this.$router.push({
        path: "/aeko/relatingParts",
        query: {
          disabled: this.disabled,
          quotationId: this.partInfo.quotationId
        }
      })
    },
    indexProcess(value) {
      return value >= 10 ? value + "" : "0" + value
    },
    handleInputByNumber,
    handleChangeByIsShared(value, row) {
      if (row.isShared == 1) {
        this.$set(row, "changeType", "新增")
      }

      this.computeShareTotalSum()
    },
    handleChangeByChangeType(value, row) {
      if (row.changeType === "减值") {
        const value = row.changeUnitPrice.replace(/^(-?)(.*)$/, "$2")
        this.$set(row, "changeUnitPrice", `${ value ? "-" : "" }${ value }`)
      }

      this.computeChangeTotalPrice(value, "changeUnitPrice", row)
    },
    handleInputByShareQuantity(val) {
      this.dataGroup.shareQuantity = numberProcessor(val, 0)

      this.computeShareAmount()
    },
    handleInputByMouldType($event, row) {
      if ($event && row.supplierPartNameList) {
        this.$set(row, "fixedAssetsName", `${ this.partInfo.partName }${ row.supplierPartNameList }${ $event }`)
      } else {
        this.$set(row, "fixedAssetsName", "")
      }
    },
    handleInputBySupplierPartNameList($event, row) {
      if ($event && row.mouldType) {
        this.$set(row, "fixedAssetsName", `${ this.partInfo.partName }${ $event }${ row.mouldType }`)
      } else {
        this.$set(row, "fixedAssetsName", "")
      }
    },
    updateQuantity(value, key, row) {
      this.computeChangeTotalPrice(value, key, row)
    },
    updateChangeUnitPrice(value, key, row) {
      if (row.changeType === "减值") {
        const value = row.changeUnitPrice.replace(/^(-?)(.*)$/, "$2")
        this.$set(row, "changeUnitPrice", `${ value ? "-" : "" }${ value }`)
      }

      this.computeChangeTotalPrice(value, key, row)
    },
    computeChangeTotalPrice(originValue, originKey, row) {
      this.$set(row, "changeTotalPrice", math.multiply(math.bignumber(row.quantity || 0), math.bignumber(row.changeUnitPrice || 0)).toFixed(2))
    
      this.computeTotalPrice(originValue, originKey, row)
      this.computeTotalPriceSum() // 计算总投资变动成本
      this.computeShareTotalSum() // 计算分摊投资变动成本
    },
    computeTotalPrice(originValue, originKey, row) {
      this.$set(row, "totalPrice", math.add(math.bignumber(row.changeTotalPrice || 0), math.bignumber(row.originTotalPrice || 0)).toFixed(2))
    },
    computeTotalPriceSum(originValue, originKey, row) {
      const totalPrice = this.tableListData.reduce((acc, cur) => {
        return math.add(math.bignumber(acc), math.bignumber(cur.changeTotalPrice || 0))
      }, 0)

      this.$set(this.dataGroup, "totalPrice", totalPrice.toFixed(2))
    },
    computeShareTotalSum(originValue, originKey, row) {
      const shareTotal = this.tableListData.reduce((acc, cur) => {
        if (cur.isShared == 1) {
          return math.add(math.bignumber(acc), math.bignumber(cur.changeTotalPrice || 0))
        }

        return acc
      }, 0)

      this.$set(this.dataGroup, "shareTotal", shareTotal.toFixed(2))
      
      this.computeShareAmount()
    },
    computeShareAmount(originValue, originKey, row) {
      const shareTotal = +this.dataGroup.shareTotal ? math.bignumber(this.dataGroup.shareTotal) : math.bignumber(0)
      const shareQuantity = +this.dataGroup.shareQuantity ? math.bignumber(this.dataGroup.shareQuantity) : math.bignumber(1)

      this.$set(this.dataGroup, "shareAmount", math.divide(shareTotal, shareQuantity).toFixed(2))
    },
    handleSave() {
      this.saveLoading = true

      saveMoulds({
        moduleFeeDTOList: this.tableListData,
        moduleOtherFee: {
          itemType: 0,
          ...this.dataGroup
        },
        quotationId: this.partInfo.quotationId
      })
      .then(res => {
        if (res.code == 200) {
          iMessage.success(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
          this.getMouldFee()
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      })
      .finally(() => this.saveLoading = false)
    }
  }
}
</script>

<style lang="scss" scoped>
.module {
  ::v-deep .cardHeader {
		padding-bottom: 20px;
	}

  ::v-deep .title {
		.tip {
			font-size: 14px;
			font-weight: 400;
			line-height: 16px;
			color: #485465;
			opacity: 0.7;
		}
  }

	.header-control {
		.btn {
			display: inline-block;
		}
	}

  .body {
    position: relative;
  
    .mainTip {
      position: absolute;
      top: -38px;
      left: 0;
      line-height: 20px;
      font-size: 14px;
      font-weight: 400;
      line-height: 16px;
      color: #E06409;
      opacity: 0.93;
    }
  }

  .subCost {
    ::v-deep .el-form-item {
      margin-bottom: 0;

      .el-form-item__label {
        width: 160px;
        font-size: 16px;
      }
    }
  }
}
</style>