<!--
 * @Author: ldh
 * @Date: 2021-04-23 00:21:17
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-08-25 17:36:50
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\mouldAndDevelopmentCost\components\developmentCost.vue
-->
<template>
  <div class="developmentCost" v-loading="loading">
    <iCard>
      <template #header>
        <div class="header">
          <div>
            <span class="title">{{ $t('LK_KAIFAFEIYONG') }}</span>
            <span class="tip margin-left10">({{ $t('LK_DANWEI') }}：{{ $t('LK_YUAN') }})</span>
            <iFormGroup class="total margin-left20" :row="1" inline>
              <iFormItem class="item" :label="`${ $t(developmentCostInfos[0].key) }`">
                <iText>{{ dataGroup[developmentCostInfos[0].props] }}</iText>
              </iFormItem>
            </iFormGroup>
          </div>
          <div v-if="!disabled" class="control">
            <iButton v-if="isAeko" @click="save">{{language('LK_BAOCUN','保存')}}</iButton>
            <iButton @click="handleAdd">{{ $t('LK_TIANJIAHANG') }}</iButton>
            <iButton @click="handleDel">{{ $t('LK_SHANCHUHANG') }}</iButton>
          </div>
        </div>
      </template>
      <div>
        <tableList class="table" index :tableData="tableListData" :tableTitle="tableTitle" @handleSelectionChange="handleSelectionChange">
          <template #item="scope">
            <iInput v-if="!disabled" v-model="scope.row.item" />
            <span v-else>{{ scope.row.item }}</span>
          </template>
          <template #itemDescription="scope">
            <iInput v-if="!disabled" v-model="scope.row.itemDescription" />
            <span v-else>{{ scope.row.itemDescription }}</span>
          </template>
          <template #unitPrice="scope">
            <iInput v-if="!disabled" v-model="scope.row.unitPrice" @input="handleInputByUnitPrice($event, scope.row)"/>
            <span v-else>{{ scope.row.unitPrice }}</span>
          </template>
          <template #quantity="scope">
            <iInput v-if="!disabled" v-model="scope.row.quantity" @input="handleInputByQuantity($event, scope.row)"/>
            <span v-else>{{ scope.row.quantity }}</span>
          </template>
          <template #isShared="scope">
            <iSelect v-if="!disabled" v-model="scope.row.isShared" @change="updateTotal">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </iSelect>
            <span v-else>{{ scope.row.isShared | statesFilter }}</span>
          </template>
        </tableList>
        <iFormGroup class="subCost margin-top30" :row="4" inline>
          <iFormItem class="item" v-for="(info, $index) in subDevelopmentCostInfos" :key="$index" :label="$t(info.key)">
            <iInput v-if="info.props === 'shareQuantity' && !disabled" v-model="dataGroup[info.props]" @input="handleInputByShareQuantity" />
            <iText v-else>{{ dataGroup[info.props] }}</iText>
          </iFormItem>
        </iFormGroup>
      </div>
    </iCard>
  </div>
</template>

<script>
/* eslint-disable no-undef */
import { iCard, iButton, iFormGroup, iFormItem, iInput, iSelect, iText, iMessage } from "rise"
import tableList from "../../tableList"
import { developmentCostInfos, developmentCostTableTitle as tableTitle, statesFilter } from "./data"
import { cloneDeep } from "lodash"
import { getDevFee } from "@/api/rfqManageMent/quotationdetail"
import { numberProcessor } from "@/utils"

export default {
  components: {
		iCard,
    iButton,
    iFormGroup,
    iFormItem, 
    iInput,
    iSelect,
    iText,
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
      default:false
    }
  },
  filters: {
    statesFilter
  },
  data() {
    return {
      loading: false,
      developmentCostInfos,
      subDevelopmentCostInfos: cloneDeep(developmentCostInfos).slice(1, developmentCostInfos.length),
      dataGroup: {},
      tableTitle,
      tableListData: [],
      multipleSelection: []
    }
  },
  methods: {
    getDevFee() {
      this.loading = true

      getDevFee({
        rfqId: this.partInfo.rfqId,
        quotationId: this.partInfo.quotationId,
        cbdLevel: this.partInfo.currentCbdLevel || this.partInfo.cbdLevel
      })
      .then(res => {
        if (res.code == 200) {
          this.tableListData = Array.isArray(res.data.devFeeInfoList) ? res.data.devFeeInfoList : []
          this.$set(this.dataGroup, "devFee", res.data.devFee)
          this.$set(this.dataGroup, "rfqDevFeeTotal", res.data.rfqDevFeeTotal)
          this.$set(this.dataGroup, "shareDevFee", res.data.shareDevFee)
          this.$set(this.dataGroup, "shareQuantity", res.data.shareQuantity)
          this.$set(this.dataGroup, "unitPrice", res.data.unitPrice)
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }

        this.loading = false
      })
      .catch(() => this.loading = false)
    },
    handleSelectionChange(list) {
      this.multipleSelection = list
    },
    handleAdd() {
      this.tableListData.push({})
    },
    handleDel() {
      if (this.multipleSelection.length < 1) {
        iMessage.warn(this.$t('LK_QINGXUANZEXUYAOSHANCHUDEHANG'))
        return
      }
      this.tableListData = this.tableListData.filter(item => !this.multipleSelection.includes(item))

      this.updateTotal()
    },
    handleInputByUnitPrice(val, row) {
      row.unitPrice = numberProcessor(val, 2)

      row.total = math.multiply(
        math.bignumber(row.unitPrice || 0),
        math.bignumber(row.quantity || 0),
      ).toFixed(2)

      this.updateTotal()
    },
    handleInputByQuantity(val, row) {
      row.quantity = numberProcessor(val, 2)

      row.total = math.multiply(
        math.bignumber(row.unitPrice || 0),
        math.bignumber(row.quantity || 0),
      ).toFixed(2)

      this.updateTotal()
    },
    handleInputByShareQuantity(val) {
      this.dataGroup.shareQuantity = numberProcessor(val, 0)

      this.updateTotal()
    },
    updateTotal() {
      let devFee = 0
      let shareDevFee = 0
      this.tableListData.forEach(item => {
        devFee = math.add(math.bignumber(devFee), math.bignumber(item.total || 0))

        if (item.isShared == 1) {
          shareDevFee = math.add(math.bignumber(shareDevFee), math.bignumber(item.total || 0))
        }
      })

      this.$set(this.dataGroup, "devFee", devFee.toFixed(2))
      this.$set(this.dataGroup, "shareDevFee", shareDevFee.toFixed(2))
      this.$set(this.dataGroup, "unitPrice", +this.dataGroup.shareQuantity ? math.divide(shareDevFee, math.bignumber(this.dataGroup.shareQuantity)).toFixed(2) : "0")
    },
    // 保存
    save(){
      const { tableListData } = this;
      this.$emit('save',tableListData);
    }
  }
}
</script>

<style lang="scss" scoped>
.developmentCost {
  ::v-deep .cardHeader {
    display: block;

		.title {
			font-size: 18px;
			color: #131523;
			font-weight: bold;
		}
	}

  .header {
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

    .tip {
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      color: #86878E;
    }

    .control {
      display: inline-block;
    }
  }

  .total {
    display: inline-block;
    width: 368px;
    vertical-align: middle;

    ::v-deep .el-form-item__label {
      width: 170px;
    }

    .item {
      margin-bottom: 0;
    }
  }

  .subCost {
    ::v-deep .el-form-item {
      margin-bottom: 0;

      .el-form-item__label {
        width: 140px;
        font-size: 16px;
      }
    }
  }
}
</style>