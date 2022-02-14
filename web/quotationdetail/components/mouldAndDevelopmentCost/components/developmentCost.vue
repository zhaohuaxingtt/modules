<!--
 * @Author: ldh
 * @Date: 2021-04-23 00:21:17
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-01-24 23:49:05
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\mouldAndDevelopmentCost\components\developmentCost.vue
-->
<template>
  <div class="developmentCost" v-loading="loading">
    <iCard>
      <template #header>
        <div class="header">
          <div>
            <span class="title">{{ `${ (showMode ? (isSkd ? "SKD" : "LC") : "") + " " }${ language('LK_KAIFAFEIYONG', '开发费用') }` }}</span>
            <span class="tip margin-left10">({{ language('LK_DANWEI', '单位') }}：{{ language('LK_YUAN', '元') }})</span>
            <iFormGroup class="total margin-left20" :row="1" inline v-if="!isAeko">
              <iFormItem class="item" :label="`${ language(developmentCostInfos[0].key, developmentCostInfos[0].name) }`">
                <iText>{{ dataGroup[developmentCostInfos[0].props] }}</iText>
              </iFormItem>
            </iFormGroup>
          </div>
          <div class="control">
              <iButton @click="edittableHeader">{{ language("LK_SHEZHITOUBU", "设置头部")}}</iButton>
            <template  v-if="!disabled&&!editDisabled" >
              <iButton v-if="isAeko" @click="save" :loading="saveLoading">{{ language('BAOCUN','保存') }}</iButton>
              <iButton @click="handleAdd">{{ language('LK_TIANJIAHANG', '添加行') }}</iButton>
              <iButton @click="handleDel">{{ language('LK_SHANCHUHANG', '删除行') }}</iButton>
            </template>
          </div>
        </div>
      </template>
      <div>
        <tableList 
        ref="tableList"
        lang 
        class="table" 
        index 
        :tableData="tableListData" 
        :tableTitle="tableTitle" 
        @handleSelectionChange="handleSelectionChange"
        :handleSaveSetting="handleSaveSetting"
        :handleResetSetting="handleResetSetting"
        >
          <template #item="scope">
            <iInput v-if="!disabled&&!editDisabled" v-model="scope.row.item" />
            <span v-else>{{ scope.row.item }}</span>
          </template>
          <template #itemDescription="scope">
            <iInput v-if="!disabled&&!editDisabled" v-model="scope.row.itemDescription" />
            <span v-else>{{ scope.row.itemDescription }}</span>
          </template>
          <template #unitPrice="scope">
            <iInput v-if="!disabled&&!editDisabled" v-model="scope.row.unitPrice" @input="handleInputByUnitPrice($event, scope.row)"/>
            <span v-else>{{ scope.row.unitPrice | thousandsFilter }}</span>
          </template>
          <template #quantity="scope">
            <iInput v-if="!disabled&&!editDisabled" v-model="scope.row.quantity" @input="handleInputByQuantity($event, scope.row)"/>
            <span v-else>{{ scope.row.quantity | thousandsFilter }}</span>
          </template>
          <template #total="scope">
            <sapn>{{scope.row.total | thousandsFilter }}</sapn>
          </template>
          <template #isShared="scope">
            <iSelect v-if="!disabled&&!editDisabled" :disabled='partInfo.roundsType == "biddingRound"' v-model="scope.row.isShared" @change="updateTotal($event,scope)">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </iSelect>
            <span v-else>{{ scope.row.isShared | statesFilter }}</span>
          </template>
        </tableList>
        <iFormGroup class="subCost margin-top30" :row="4" inline>
          <template v-for="(info, $index) in subDevelopmentCostInfos">
            <iFormItem class="item" v-if='info.props == "devFee"'  :key="$index" :label="isAeko&&info.languageKey ? language(info.languageKey,info.languageName) : language(info.key, info.name)">
              <iText v-if="dataGroup['biddingDevFee']">{{ dataGroup['biddingDevFee'] | thousandsFilter }}</iText>
              <iText v-else>{{ dataGroup[info.props] | thousandsFilter }}</iText>
            </iFormItem>
            <iFormItem class="item" v-else :key="$index" :label="isAeko&&info.languageKey ? language(info.languageKey,info.languageName) : language(info.key, info.name)">
              <iInput v-if="info.props === 'shareQuantity' && !disabled&& !editDisabled" v-model="dataGroup[info.props]" @input="handleInputByShareQuantity" />
              <iText v-else>{{ dataGroup[info.props] | thousandsFilter }}</iText>
            </iFormItem>
          </template>
        </iFormGroup>
      </div>
    </iCard>
  </div>
</template>

<script>
/* eslint-disable no-undef */
import { iCard, iButton, iFormGroup, iFormItem, iInput, iSelect, iText, iMessage } from "rise"
import tableList from "@/components/iTableSort"
import { developmentCostInfos, developmentCostTableTitle as tableTitle, statesFilter } from "./data"
import { cloneDeep } from "lodash"
import { getDevFee, getDevFeeSKD } from "@/api/rfqManageMent/quotationdetail"
import { numberProcessor } from "@/utils"
import filters from "@/utils/filters"

export default {
  inject:['jjys'],
  mixins: [ filters ],
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
    },
    isSkd: {
      type: Boolean,
      default: false
    },
    showMode: {
      type: Boolean,
      default: false
    },
    // 是否禁用编辑状态
    editDisabled: {
      type: Boolean,
      default: false
    },
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
      multipleSelection: [],
      saveLoading: false
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
          this.$set(this.dataGroup,"biddingDevFee",res.data.biddingDevFee)
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }

        this.loading = false
      })
      .catch(() => this.loading = false)
    },
    getDevFeeSKD() {
      this.loading = true

      getDevFeeSKD({
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
      })
      .finally(() => this.loading = false)
    },
    handleSelectionChange(list) {
      this.multipleSelection = list
    },
    handleAdd() {
      this.tableListData.push({isShared:this.partInfo.roundsType == "biddingRound"?0:''})
    },
    handleDel() {
      if (this.multipleSelection.length < 1) {
        iMessage.warn(this.language('LK_QINGXUANZEXUYAOSHANCHUDEHANG', '请选择需要删除的行'))
        return
      }else{
         this.$confirm(
            this.language('LK_TIPS_SHIFOUSHANCHUBEIXUANZHONGDEHANGXIANGMU','是否删除被选中的行项目？'),
            this.language('LK_SHANCHU','删除'),
            {
                confirmButtonText: this.language('nominationLanguage.Yes','是'),
                cancelButtonText: this.language('nominationLanguage.No','否'),
            }).then(()=>{
               this.tableListData = this.tableListData.filter(item => !this.multipleSelection.includes(item))
                this.updateTotal()
            }).catch(()=>{

            })
      }
     
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
      const {isAeko} = this;
      row.quantity = numberProcessor(val, isAeko ? 0:2)

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
    updateTotal(e,scope) {
      scope?scope.row.isShared = e:''
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
    },
    updateSaveLoading(value = false) {
      this.saveLoading = value
    },
    handleResetSetting({data, done} = data) {
      done(data)
    },
    handleSaveSetting({data, done} = data) {
      done(data)
    },
    edittableHeader() {
      this.$refs.tableList.settingVisible = true
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