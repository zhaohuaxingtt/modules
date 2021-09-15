<template>
  <iCard class="aPriceChange" v-permission.auto="AEKO_QUOTATION_CBD_TAB_BIANDONGZHICBD|变动值CBD" :title="language('BIANDONGZHICBD', '变动值CBD')">
    <template #header-control>
      <iButton v-permission.auto="AEKO_QUOTATION_CBD_BUTTON_BAOCUN|保存" v-if="!disabled" :loading="saveLoading" @click="handleSave">{{ language("BAOCUN", "保存") }}</iButton>
      <iButton v-permission.auto="AEKO_QUOTATION_CBD_BUTTON_XIAZAI|下载" :loading="downloadLoading" @click="handleDownload">{{ language("XIAZAI", "下载") }}</iButton>
    </template>
    <div class="body" v-loading="loading">
      <div class="aPriceChangeMode">
        <el-checkbox v-model="hasManualInput" v-permission.auto="AEKO_QUOTATION_CBD_RADIO_SHOUDONGSHURU|手动输入" :disabled="disabled">{{ language("SHOUDONGSHURU", "手动输入") }}</el-checkbox>
        <div>
          <div class="input" v-permission.auto="AEKO_QUOTATION_CBD_INPUT_AJIABIANDONGHANFENTAN|A价变动_含分摊">
            <span class="label">{{ language("AJIABIANDONGHANFENTAN", "A价变动(含分摊)") }}:</span>
            <iInput v-if="hasManualInput" v-model="apriceChange" @input="handleInputByApriceChange" :disabled="disabled"/>
            <iText v-else />
          </div>
        </div>
      </div>
      <div v-if="!hasManualInput">
        <i class="topCutLine"></i>
        <div class="aPriceChangeModule" v-permission.auto="AEKO_QUOTATION_CBD_SELECT_CBDXUTIAOZHENGBUFEN|CBD需调整部分">
          <span class="label">{{ language("CBDXUTIAOZHENGBUFEN", "CBD需调整部分") }}:</span>
          <iSelect 
            multiple
            v-model="modules"
            :placeholder="language('QINGXUANZE','请选择')"
            :disabled="disabled"
            @change="handleChangeByModules">
            <el-option
              value=""
              :label="language('ALL', '全部') | capitalizeFilter"
            ></el-option>
            <el-option
              v-for="(item, $index) in moduleOptions"
              v-permission.dynamic.auto="item.permissionKey"
              :value="item.value"
              :label="`${ item.seq } ${ language(item.key, item.label) }`"
              :key="$index"
            ></el-option>
          </iSelect> 
        </div>
        <cbdSummary class="margin-top20" v-model="cbdSummaryTableData" v-permission.auto="AEKO_QUOTATION_CBD_VIEW_BIANDONGZHICBDHUIZONG|变动值CBD汇总" @updateApriceChange="$emit('updateApriceChange', $event)" />
        <div v-if="!loading">
          <rawMaterials 
            topCutLine 
            class="margin-top30" 
            ref="rawMaterials"
            v-if="moduleMap.material" 
            v-model="rawMaterialsTableData" 
            :disabled="disabled"
            :sumData.sync="rawMaterialsSumData"
            v-permission.auto="AEKO_QUOTATION_CBD_VIEW_YUANCAILIAOSANJIAN|原材料/散件" />
          <manufacturingCost 
            topCutLine 
            class="margin-top30" 
            ref="manufacturingCost"
            v-if="moduleMap.production" 
            v-model="manufacturingCostTableData" 
            :disabled="disabled"
            :sumData.sync="manufacturingCostSumData"
            v-permission.auto="AEKO_QUOTATION_CBD_VIEW_ZHIZAOCHENGBEN|制造成本" />
          <div class="flexBox">
            <scrapCost v-if="moduleMap.scrap" class="margin-top30" topCutLine v-model="scrapCostTableData" :disabled="disabled" :sumData="sumData" :discardCostChange.sync="discardCostChange" v-permission.auto="AEKO_QUOTATION_CBD_VIEW_BAOFEICHENGBEN|报废成本" />
            <manageCost v-if="moduleMap.manage" class="margin-top30" topCutLine v-model="manageTableData" :disabled="disabled" :sumData="sumData" :manageFeeChange.sync="manageFeeChange" v-permission.auto="AEKO_QUOTATION_CBD_VIEW_GUANLIFEI|管理费" />
            <otherCost v-if="Array.isArray(otherCostTableData) && otherCostTableData.length > 0" class="margin-top30" :tableListData="otherCostTableData" topCutLine :otherFee.sync="otherFee" v-permission.auto="AEKO_QUOTATION_CBD_VIEW_QITAFEIYONG|其他费用" />
            <profit v-if="moduleMap.profit" class="margin-top30" topCutLine v-model="profitTableData" :disabled="disabled" :sumData="sumData" :profitChange.sync="profitChange" v-permission.auto="AEKO_QUOTATION_CBD_VIEW_LIRUN|利润" />
          </div>
        </div>
      </div>
    </div>
  </iCard>
</template>

<script>
import { iCard, iButton, iInput, iText, iSelect, iMessage } from "rise"
import cbdSummary from "./components/cbdSummary"
import rawMaterials from "./components/rawMaterials"
import manufacturingCost from "./components/manufacturingCost"
import scrapCost from "./components/scrapCost"
import manageCost from "./components/manageCost"
import otherCost from "./components/otherCost"
import profit from "./components/profit"
import { validateChangeKeysByRawMaterials, validateChangeKeysByManufacturingCost } from "./components/data"
import { getAekoCarDosage, getAekoQuotationSummary, saveAekoQuotationSummary, exportQuotation } from "@/api/aeko/quotationdetail"
import { numberProcessor } from "@/utils"

export default {
  components: { iCard, iButton, iInput, iText, iSelect, cbdSummary, rawMaterials, manufacturingCost, scrapCost, manageCost, otherCost, profit },
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
      saveLoading: false,
      downloadLoading: false,
      form: {},
      hasManualInput: false,
      apriceChange: "",
      moduleOptions: [],
      modules: [],
      moduleMap: {},
      rawMaterialsTableData: [],
      rawMaterialsSumData: {
        originMaterialCostSum: 0,
        originMaterialCostSumByNotSvwAssignPriceParts: 0,
        newMaterialCostSum: 0,
        newMaterialCostSumByNotSvwAssignPriceParts: 0
      },
      manufacturingCostTableData: [],
      manufacturingCostSumData: {
        originLaborCostSum: 0,
        originDeviceCostSum: 0,
        newLaborCostSum: 0,
        newDeviceCostSum: 0
      },
      scrapCostTableData: [],
      discardCostChange: 0,
      manageTableData: [],
      manageFeeChange: 0,
      otherCostTableData: [],
      otherFee: 0,
      profitTableData: [],
      profitChange: 0
    }
  },
  inject: ["getBasicInfo", "allSummaryData"],
  computed: {
    cbdSummarySelected() {
      if (this.modules.length) {
        if (this.modules[0] === "") {
          return this.moduleOptions.map(item => item.code).join(",")
        } else {
          const selected = this.moduleOptions.filter(item => this.modules.includes(item.value))
          return selected.map(item => item.code).join(",")
        } 
      } else {
        return ""
      }
    },
    sumData() {
      return {
        ...this.rawMaterialsSumData,
        ...this.manufacturingCostSumData
      }
    },
    cbdSummaryTableData() {
      return [{
        materialChange: this.rawMaterialsSumData.materialChange || "0.00",
        makeCostChange: this.manufacturingCostSumData.makeCostChange || "0.00",
        discardCostChange: this.discardCostChange || "0.00",
        manageFeeChange: this.manageFeeChange || "0.00",
        otherFee: this.otherFee || "0.00",
        profitChange: this.profitChange || "0.00"
      }]
    },
  },
  watch: {
    moduleMap: {
      handler(nv, ov) {

      },
      deep: true
    }
  },
  methods: {
    init() {
      this.getAekoCarDosage()
      this.getAekoQuotationSummary()
    },
    getAekoCarDosage() {
      getAekoCarDosage()
      .then(res => {
        if (res.code == 200) {
          this.moduleOptions = 
            Array.isArray(res.data) ?
            res.data.map(item => {
              switch(item.code) {
                case "1":
                  return { code: item.code, seq: "2.1", key: "YUANCAILIAOSANJIAN", label: "原材料/散件", value: "material", permissionKey: "AEKO_QUOTATION_CBD_VIEW_YUANCAILIAOSANJIAN|原材料/散件" }
                case "2":
                  return { code: item.code, seq: "2.2", key: "ZHIZAOCHENGBEN", label: "制造成本", value: "production", permissionKey: "AEKO_QUOTATION_CBD_VIEW_ZHIZAOCHENGBEN|制造成本" }
                case "3":
                  return { code: item.code, seq: "2.3", key: "BAOFEICHENGBEN", label: "报废成本", value: "scrap", permissionKey: "AEKO_QUOTATION_CBD_VIEW_BAOFEICHENGBEN|报废成本" }
                case "4":
                  return { code: item.code, seq: "2.4", key: "GUANLIFEI", label: "管理费", value: "manage", permissionKey: "AEKO_QUOTATION_CBD_VIEW_GUANLIFEI|管理费" }
                case "5":
                  return { code: item.code, seq: "2.6", key: "LIRUN", label: "利润", value: "profit", permissionKey: "AEKO_QUOTATION_CBD_VIEW_LIRUN|利润" }
                default:
                  return {}
              }
            }) :
            []

          // this.handleChangeByModules([""])
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      })
      .catch()
    },
    getAekoQuotationSummary() {
      this.loading = true

      getAekoQuotationSummary({
        quotationId: this.partInfo.quotationId
      })
      .then(res => {
        if (res.code == 200) {
          this.form = res.data
          this.hasManualInput = res.data.hasManualInput ? true : (res.data.hasManualInput === null ? true : false)
          this.apriceChange = res.data.apriceChange
          this.setCbdSummarySelected(res.data.cbdSummarySelected)
          this.rawMaterialsTableData = Array.isArray(res.data.rawMaterialList) ? res.data.rawMaterialList : []
          this.manufacturingCostTableData = Array.isArray(res.data.makeCostList) ? res.data.makeCostList : []
          this.scrapCostTableData = this.setScrapCostTableData(res.data.scrapVO ? [res.data.scrapVO] : [])
          this.manageTableData = this.setManageTableData(Array.isArray(res.data.manageFeeList) ? res.data.manageFeeList : [])
          this.otherCostTableData = this.setOtherCostTableData(Array.isArray(res.data.otherFeeList) ? res.data.otherFeeList : [])
          this.profitTableData = this.setProfitTableData(res.data.profitVO ? [res.data.profitVO] : [])
          this.rawMaterialsSumData.materialChange = res.data.materialChange
          this.manufacturingCostSumData.makeCostChange = res.data.makeCostChange
          this.discardCostChange = res.data.discardCostChange
          this.manageFeeChange = res.data.manageFeeChange
          this.otherFee = res.data.otherFee
          this.profitChange = res.data.profitChange
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }

        this.loading = false
      })
      .catch(() => this.loading = false)
    },
    handleInputByApriceChange(value) {
      this.apriceChange = numberProcessor(value, 2, true)

      if (this.hasManualInput) {
        this.$emit("updateApriceChange", this.apriceChange)
      }
    },
    handleChangeByModules(modules) {
      this.moduleMap = {}

      if (modules.includes("") && modules[this.modules.length - 1] !== "") this.modules = modules.filter(item => !!item)

      if (Array.isArray(modules) && modules.length) {
        if (this.modules.includes("") || modules.length === this.moduleOptions.length) {
          this.modules = [""]
          this.moduleOptions.forEach(module => this.$set(this.moduleMap, module.value, true))
          return
        }

        modules.forEach(moduleKey => this.$set(this.moduleMap, moduleKey, true))
        this.modules = this.moduleOptions.filter(module => !!this.moduleMap[module.value]).map(module => module.value)
      }
    },
    setCbdSummarySelected(data = "") {
      if (data) {
        const selected = data.split(",")

        if (selected === "1,2,3,4,5") {
          this.modules = [""]
        } else {
          this.modules = selected.map(item => {
            switch(item) {
              case "1":
                return "material"
              case "2":
                return "production"
              case "3":
                return "scrap"
              case "4":
                return "manage"
              case "5":
                return "profit"
              default:
            }
          })
        }

        this.handleChangeByModules(this.modules)
      }
    },
    setScrapCostTableData(data = []) {
      const result = []

      if (data.length > 0) {
        result.push(
          {
            index: "S1",
            typeName: "discardCost",
            typeNameByLang: () => this.language("ZHENGTIBAOFEICHENGBENBIANDONG", "整体报废成本变动"),
            originRatio: data[0].originRatio ?? "0.00",
            ratio: data[0].ratio ?? "0.00",
            changeAmount: data[0].changeAmount ?? "0.00"
          }
        )
      } else {
        result.push(
          {
            index: "S1",
            typeName: "discardCost",
            typeNameByLang: () => this.language("ZHENGTIBAOFEICHENGBENBIANDONG", "整体报废成本变动"),
            originRatio: "0.00",
            ratio: "0.00",
            changeAmount: "0.00"
          }
        )
      }

      return result
    },
    setManageTableData(data = []) {
      const result = []

      if (data.length > 0) {
        return data.map(item => {
          switch(item.typeName) {
            case "原材料与散件（不含SVW指定散件）管理费":
              item.index = "O1"
              item.typeNameByLang = () => this.language("YUANCAILIAOYUSANJIANBUHANSVWZHIDINGSANJIANGUANLIFEI", "原材料与散件(不含SVW指定散件)管理费")
              break
            case "制造管理费":
              item.index = "O2"
              item.typeNameByLang = () => this.language("ZHIZAOGUANLIFEI", "制造管理费")
              break
            default:
          }

          return item
        })
      } else {
        result.push(
          {
            index: "O1",
            typeName: "原材料与散件（不含SVW指定散件）管理费",
            typeNameByLang: () => this.language("YUANCAILIAOYUSANJIANBUHANSVWZHIDINGSANJIANGUANLIFEI", "原材料与散件(不含SVW指定散件)管理费"),
            originRatio: "0.00",
            ratio: "0.00",
            changeAmount: "0.00",
          },
          {
            index: "O2",
            typeName: "制造管理费",
            typeNameByLang: () => this.language("ZHIZAOGUANLIFEI", "制造管理费"),
            originRatio: "0.00",
            ratio: "0.00",
            changeAmount: "0.00",
          }
        )
      }

      return result
    },
    setOtherCostTableData(data = []) {
      const result = []

      if (data.length > 0) {
        data.forEach((item, index) => {
          switch(item.itemType) {
            case 0:
              result.push({
                index: `A${ ++index }`,
                itemType: item.itemType,
                itemTypeNameByLang: () => this.language("FENTANMUJUFEI", "分摊模具费"),
                shareTotal: item.shareTotal,
                shareQuantity: item.shareQuantity,
                shareAmount: item.shareAmount,
                totalPrice: item.totalPrice
              })
              break
            case 1:
              result.push({
                index: `A${ ++index }`,
                itemType: item.itemType,
                itemTypeNameByLang: () => this.language("FENTANKAIFAFEI", "分摊开发费"),
                shareTotal: item.shareTotal,
                shareQuantity: item.shareQuantity,
                shareAmount: item.shareAmount,
                totalPrice: item.totalPrice
              })
              break
            default:
          }
        })
      }

      return result
    },
    setProfitTableData(data = []) {
      const result = []

      if (data.length > 0) {
        result.push(
          {
            index: "P1",
            typeName: "profit",
            typeNameByLang: () => this.language("LIRUNBUHANSVWZHIDINGSANJIAN", "利润(不含SVW指定散件)"),
            originRatio: data[0].originRatio ?? "0.00",
            ratio: data[0].ratio ?? "0.00",
            changeAmount: data[0].changeAmount ?? "0.00"
          }
        )
      } else {
        result.push(
          {
            index: "P1",
            typeName: "profit",
            typeNameByLang: () => this.language("LIRUNBUHANSVWZHIDINGSANJIAN", "利润(不含SVW指定散件)"),
            originRatio: "0.00",
            ratio: "0.00",
            changeAmount: "0.00"
          }
        )
      }

      return result
    },
    save() {
      return this.saveAekoQuotationSummary(
        () => this.saveLoading = true,
        () => this.saveLoading = false
      )
    },
    handleSave() {
      this.save()
      .then(res => {
        if (res.code == 200) {
          iMessage.success(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
          this.getBasicInfo()
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      })
    },
    saveAekoQuotationSummary(beforeHook, afterHook) {
      if (!this.hasManualInput && this.moduleMap.material) {
        if (!this.rawMaterialsTableData.length || !this.rawMaterialsTableData.every(item => validateChangeKeysByRawMaterials.every(key => item[key] || item[key] === 0 || item[key] === false))) {
          return iMessage.warn(this.language("QINGTIANXIEWANZHENGYUANCAILIAOSANJIANCHENGBEN", "请填写完整原材料/散件成本"))
        }
      }

      if (!this.hasManualInput && this.moduleMap.production) {
        if (!this.manufacturingCostTableData.length || !this.manufacturingCostTableData.every(item => validateChangeKeysByManufacturingCost.every(key => item[key] || item[key] === 0))) {
          return iMessage.warn(this.language("QINGTIANXIEWANZHENGZHIZAOCHENGBEN", "请填写完整制造成本"))
        }
      }

      if (typeof beforeHook === "function") beforeHook()

      return saveAekoQuotationSummary({
        ...(this.hasManualInput ? 
          {
            hasManualInput: this.hasManualInput || false,
            apriceChange: this.apriceChange,
            quotationId: this.partInfo.quotationId,
            aprice: this.allSummaryData()[0].aprice || "0.00",
          } : 
          {
          ...this.form,
          aprice: this.allSummaryData()[0].aprice || "0.00",
          hasManualInput: this.hasManualInput || false,
          quotationId: this.partInfo.quotationId,
          rawMaterialList: this.moduleMap.material ? this.rawMaterialsTableData : undefined,
          makeCostList: this.moduleMap.production ? this.manufacturingCostTableData : undefined,
          scrapVO: this.moduleMap.scrap ? this.scrapCostTableData[0] : undefined,
          manageFeeList: this.moduleMap.manage ? this.manageTableData : undefined,
          otherFeeList: this.otherCostTableData.length ? this.otherCostTableData : undefined,
          profitVO: this.moduleMap.profit ? this.profitTableData[0] : undefined,
          apriceChange: this.cbdSummaryTableData[0].apriceChange,
          cbdSummarySelected: this.hasManualInput ? "" : this.cbdSummarySelected,
          materialChange: this.cbdSummaryTableData[0].materialChange,
          makeCostChange: this.cbdSummaryTableData[0].makeCostChange,
          discardCostChange: this.cbdSummaryTableData[0].discardCostChange,
          manageFeeChange: this.cbdSummaryTableData[0].manageFeeChange,
          otherFee: this.cbdSummaryTableData[0].otherFee,
          profitChange: this.cbdSummaryTableData[0].profitChange
        })
      })
      .finally(() => {
        if (typeof afterHook === "function") afterHook()
      })
    },
    async handleDownload() {
      this.downloadLoading = true

      await exportQuotation({
        quotationId: this.partInfo.quotationId
      })

      this.downloadLoading = false
    },
  }
}
</script>

<style lang="scss" scoped>
.aPriceChange {
  .aPriceChangeMode {
    display: flex;
    align-items: center;
    
    .input {
      margin-left: 50px;
      width: 366px;
      display: flex;
      align-items: center;

      .label {
        width: 126px;
        margin-right: 20px;
      }

      ::v-deep 
      .el-input,
      .itext {
        width: 220px;
      }
    }
  }

  .topCutLine {
    margin-top: 22px;
    display: block;
    height: 2px;
    background: #AFB3BC;
    opacity: 0.45;
  }

  .aPriceChangeModule {
    margin-top: 30px;
    display: flex;
    align-items: center;
    width: 509px;

    .label {
      width: 123px;
      margin-right: 20px;
    }

    ::v-deep .el-select {
      width: 356px;
    }
  }

  .flexBox {
    display: flex;
    flex-wrap: wrap;
    
    & > div {
      width: 50%;
      box-sizing: border-box;

      &:nth-of-type(odd) {
        ::v-deep .topCutLine {
          margin-right: 2px;
        }

        ::v-deep .main {
          padding-right: 55px;
        }
      }

      &:nth-of-type(even) {
        ::v-deep .topCutLine {
          margin-left: 2px;
        }

        ::v-deep .main {
          padding-left: 55px;
        }
      }

      &:last-of-type:not(&:nth-of-type(even)) {
        ::v-deep .topCutLine {
          width: 200%;
        }
      }
    }
  }
}
</style>