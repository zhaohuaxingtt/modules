<template>
  <div class="aPriceChange">
    <iCard :title="language('BIANDONGZHI', '变动值')">
      <template #header-control>
        <iButton v-if="sourceApriceChange != apriceChange && !disabled && !editDisabled"  :loading="saveChangeLoading" @click="saveAPriceChange">{{ language("BAOCUN", "保存") }}</iButton>
      </template>
      <div class="aPriceChangeMode">
        <div class="margin-top20">
          <div class="input" v-permission.auto="AEKO_QUOTATION_CBD_INPUT_AJIABIANDONGHANFENTAN|A价变动_含分摊">
            <span class="label">{{ language("AJIABIANDONGHANFENTAN", "A价变动(含分摊)") }}:</span>
            <iInput v-if="!apriceChangeDisabled && !editDisabled" v-model="apriceChange" @input="handleInputByApriceChange" />
            <iText v-else>{{ floatFixNum(apriceChange) }}</iText>
          </div>
        </div>
      </div>
    </iCard>
    <changeSummary ref="changeSummary" class="margin-top20" :partInfo="partInfo" :moduleOptions="allModuleOptions" :disabled="disabled" :editDisabled="editDisabled" @updateTotal="updateTotal" @updateIsChange="updateIsChange" @getBasicInfo="getBasicInfo"/>
    <iCard v-permission.auto="AEKO_QUOTATION_CBD_TAB_BIANDONGZHICBD|变动值CBD" class="margin-top20">
      <template #header>
        <div class="title">
          <span>{{ `${ language("BIANDONGZHI", "变动值") } - CBD` }}</span>
          <span class="tip margin-left12">{{ language("DANWEI", "单位") }}：RMB/Pc.</span>
        </div>
        <div class="header-control" >
          <el-switch
            class="switch"
            :disabled="cbdDisabled || disabled || editDisabled"
            :class="{ switchSpace: !cbdDisabled }"
            v-model="cbdCanEdit"
            :active-text="language('YOUXIAO', '有效')"
            :active-value="true"
            :inactive-value="false"
            @change="handleChangeByCbdCanEdit">
          </el-switch>
          <iButton v-permission.auto="AEKO_QUOTATION_CBD_BUTTON_BAOCUN|保存" v-if="!disabled && !cbdDisabled && cbdCanEdit&&!editDisabled" :loading="saveLoading" @click="handleSave">{{ language("BAOCUN", "保存") }}</iButton>
          <iButton v-permission.auto="AEKO_QUOTATION_CBD_BUTTON_XIAZAI|下载" v-if="!disabled && !cbdDisabled && cbdCanEdit&&!editDisabled" :loading="downloadLoading" @click="handleDownload">{{ language("XIAZAI", "下载") }}</iButton>
        </div>
      </template>
      <div class="body" v-loading="loading">
        <div class="aPriceChangeModule" v-permission.auto="AEKO_QUOTATION_CBD_SELECT_CBDXUTIAOZHENGBUFEN|CBD需调整部分">
          <span class="label">{{ language("CBDXUTIAOZHENGBUFEN", "CBD需调整部分") }}:</span>
          <iSelect 
            multiple
            v-model="modules"
            :placeholder="language('QINGXUANZE','请选择')"
            :disabled="disabled || cbdDisabled || editDisabled || !cbdCanEdit"
            @change="handleChangeByModules">
            <el-option
              value=""
              :label="language('ALL', '全部') | capitalizeFilter"
            ></el-option>
            <el-option
              v-for="item in moduleOptions"
              v-permission.dynamic.auto="item.permissionKey"
              :key="item.value"
              :label="`${ item.seq } ${ language(item.key, item.label) }`"
              :value="item.value"
            ></el-option>
          </iSelect>
        </div>
        <cbdSummary class="margin-top20" v-model="cbdSummaryTableData" v-permission.auto="AEKO_QUOTATION_CBD_VIEW_BIANDONGZHICBDHUIZONG|变动值CBD汇总" @updateApriceChange="updateApriceChange" :isFetch="isFetch" @updateIsFetch="isFetch=$event" />
        <div v-if="!loading">
          <rawMaterials 
            topCutLine 
            class="margin-top30" 
            ref="rawMaterials"
            v-if="moduleMap.material" 
            v-model="rawMaterialsTableData" 
            :disabled="disabled || cbdDisabled || editDisabled || !cbdCanEdit"
            :materialTypeOptions="materialTypeOptions"
            :sumData.sync="rawMaterialsSumData"
            v-permission.auto="AEKO_QUOTATION_CBD_VIEW_YUANCAILIAOSANJIAN|原材料/散件" />
          <manufacturingCost 
            topCutLine 
            class="margin-top30" 
            ref="manufacturingCost"
            v-if="moduleMap.production" 
            v-model="manufacturingCostTableData" 
            :disabled="disabled || cbdDisabled || editDisabled || !cbdCanEdit"
            :sumData.sync="manufacturingCostSumData"
            v-permission.auto="AEKO_QUOTATION_CBD_VIEW_ZHIZAOCHENGBEN|制造成本" />
          <div class="flexBox">
            <scrapCost v-if="moduleMap.scrap" class="margin-top30" topCutLine v-model="scrapCostTableData" :disabled="disabled || cbdDisabled || editDisabled || !cbdCanEdit" :sumData="sumData" :discardCostChange.sync="discardCostChange" v-permission.auto="AEKO_QUOTATION_CBD_VIEW_BAOFEICHENGBEN|报废成本" />
            <manageCost v-if="moduleMap.manage" class="margin-top30" topCutLine v-model="manageTableData" :disabled="disabled || cbdDisabled || editDisabled || !cbdCanEdit" :sumData="sumData" :manageFeeChange.sync="manageFeeChange" v-permission.auto="AEKO_QUOTATION_CBD_VIEW_GUANLIFEI|管理费" />
            <otherCost v-if="Array.isArray(otherCostTableData) && otherCostTableData.length > 0" class="margin-top30" :tableListData="otherCostTableData" topCutLine :otherFee.sync="otherFee" v-permission.auto="AEKO_QUOTATION_CBD_VIEW_QITAFEIYONG|其他费用" />
            <profit v-if="moduleMap.profit" class="margin-top30" topCutLine v-model="profitTableData" :disabled="disabled || cbdDisabled || editDisabled || !cbdCanEdit" :sumData="sumData" :profitChange.sync="profitChange" v-permission.auto="AEKO_QUOTATION_CBD_VIEW_LIRUN|利润" />
          </div>
        </div>
      </div>
    </iCard>
  </div>
</template>

<script>
import { iCard, iButton, iInput, iText, iSelect, iMessage, iMessageBox } from "rise"
import changeSummary from "./components/changeSummary"
import cbdSummary from "./components/cbdSummary"
import rawMaterials from "./components/rawMaterials"
import manufacturingCost from "./components/manufacturingCost"
import scrapCost from "./components/scrapCost"
import manageCost from "./components/manageCost"
import otherCost from "./components/otherCost"
import { floatNum, floatFixNum } from "../data"
import profit from "./components/profit"
import { validateChangeKeysByRawMaterials, validateChangeKeysByManufacturingCost } from "./components/data"
import { getAekoCarDosage, getAekoQuotationSummary, saveAekoQuotationSummary, exportQuotation,updateCbdCanEdit, saveAPirce } from "@/api/aeko/quotationdetail"
import { getDictByCode } from "@/api/dictionary"
import { numberProcessor } from "@/utils"
import { difference } from "lodash"

export default {
  components: { iCard, iButton, iInput, iText, iSelect, changeSummary, cbdSummary, rawMaterials, manufacturingCost, scrapCost, manageCost, otherCost, profit },
  props: {
    partInfo: {
      type: Object,
      required: true,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    },
    editDisabled: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      loading: false,
      saveLoading: false,
      downloadLoading: false,
      form: {},
      cbdCanEdit: false,
      apriceChange: "",
      apriceChangeDisabled: true,
      cbdDisabled: true,
      moduleOptions: [],
      allModuleOptions: [],
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
      profitChange: 0,
      materialTypeOptions: [],
      responseData: {},
      saveChangeLoading: false,
      isChange: false,
      total: 0, // 汇总表
      cbdTotal: 0, // CBD
      isFetch: false
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
        materialChange: this.moduleMap.material ? (this.rawMaterialsSumData.materialChange || "0.00") : "0.00",
        makeCostChange: this.moduleMap.production ? (this.manufacturingCostSumData.makeCostChange || "0.00") : "0.00",
        discardCostChange: this.moduleMap.scrap ? (this.discardCostChange || "0.00") : "0.00",
        manageFeeChange: this.moduleMap.manage ? (this.manageFeeChange || "0.00") : "0.00",
        otherFee: this.otherFee || "0.00",
        profitChange: this.moduleMap.profit ? (this.profitChange || "0.00") : "0.00"
      }]
    },
  },
  created() {
    this.getMaterialTypeOptions()
  },
  methods: {
    floatNum,
    floatFixNum,
    init() {
      this.$refs.changeSummary.getAekoCbdPriceSum()
      this.getAekoCarDosage()
      this.getAekoQuotationSummary()
    },
    getAekoCarDosage() {
      getAekoCarDosage()
      .then(res => {
        if (res.code == 200) {
          console.log('----',res.data)
          this.allModuleOptions = 
            Array.isArray(res.data) ?
            res.data.map(item => {

              switch(item.code) {
                case "1":
                  return { code: item.code, seq: "2.1", key: "原材料/散件", label: "原材料/散件", value: "material", permissionKey: "AEKO_QUOTATION_CBD_VIEW_YUANCAILIAOSANJIAN|原材料/散件" }
                case "2":
                  return { code: item.code, seq: "2.2", key: "ZHIZAOCHENGBEN", label: "制造成本", value: "production", permissionKey: "AEKO_QUOTATION_CBD_VIEW_ZHIZAOCHENGBEN|制造成本" }
                case "3":
                  return { code: item.code, seq: "2.3", key: "BAOFEICHENGBEN", label: "报废成本", value: "scrap", permissionKey: "AEKO_QUOTATION_CBD_VIEW_BAOFEICHENGBEN|报废成本" }
                case "4":
                  return { code: item.code, seq: "2.4", key: "GUANLIFEI", label: "管理费", value: "manage", permissionKey: "AEKO_QUOTATION_CBD_VIEW_GUANLIFEI|管理费" }
                case "6":
                  return { code: item.code, seq: "2.5", key: "QITAFEIYONG", label: "其他费用", value: "other" }
                case "5":
                  return { code: item.code, seq: "2.6", key: "LIRUN", label: "利润", value: "profit", permissionKey: "AEKO_QUOTATION_CBD_VIEW_LIRUN|利润" }
                default:
                  return {}
              }
            }) :
            []

          this.moduleOptions = this.allModuleOptions.filter(item => item.code != 6)

          // this.handleChangeByModules([""])
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      })
      .catch()
    },
    getMaterialTypeOptions() {
      getDictByCode("MaterialType")
      .then(res => {
        if (res.code == 200) {
          this.materialTypeOptions = 
            Array.isArray(res.data) && res.data[0] && Array.isArray(res.data[0].subDictResultVo) ?
            res.data[0].subDictResultVo.map(item => ({
              key: item.code,
              label: item.name,
              value: item.code
            })) :
            []
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      })
    },
    getAekoQuotationSummary() {
      this.loading = true

      getAekoQuotationSummary({
        quotationId: this.partInfo.quotationId
      })
      .then(res => {
        if (res.code == 200) {
          this.form = res.data
          this.cbdCanEdit = res.data.cbdCanEdit
          this.cbdDisabled = res.data.isChange
          
          this.responseData = {}
          this.responseData.cbdSummarySelected = res.data.cbdSummarySelected

          this.apriceChange = res.data.apriceChange || "0"
          this.apriceChangeDisabled = !+this.apriceChange
          this.sourceApriceChange = this.apriceChange
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

          this.isFetch = true
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      })
      .finally(() => {
        this.loading = false;
        this.setApriceChange()
      })
    },
    handleInputByApriceChange(value) {
      this.apriceChange = numberProcessor(value, 4, true)
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
      } else {
        this.modules = []
        this.handleChangeByModules([])
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
            changeAmount: data[0].changeAmount ?? "0.00",
            originScrapId: data[0].originScrapId
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
            changeAmount: data[0].changeAmount ?? "0.00",
            originProfitId: data[0].originProfitId
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
    async saveAekoQuotationSummary(beforeHook, afterHook) {
      if (this.moduleMap.material) {
        if (!this.rawMaterialsTableData.length || !this.rawMaterialsTableData.every(item => validateChangeKeysByRawMaterials.every(key => item[key] || item[key] === 0 || item[key] === false))) {
          throw iMessage.warn(this.language("QINGTIANXIEWANZHENGYUANCAILIAOSANJIANCHENGBEN", "请填写完整原材料/散件成本"))
        }
      }

      if (this.moduleMap.production) {
        if (!this.manufacturingCostTableData.length || !this.manufacturingCostTableData.every(item => validateChangeKeysByManufacturingCost.every(key => item[key] || item[key] === 0))) {
          throw iMessage.warn(this.language("QINGTIANXIEWANZHENGZHIZAOCHENGBEN", "请填写完整制造成本"))
        }
      }

      const responseDataCbdSummarySelectedArr = this.responseData.cbdSummarySelected ? this.responseData.cbdSummarySelected.split(",") : []
      const cbdSummarySelectedArr = this.cbdSummarySelected ? this.cbdSummarySelected.split(",") : []
      if (difference(responseDataCbdSummarySelectedArr, cbdSummarySelectedArr).length) {
        await iMessageBox(
          this.language("CANCELCBDADJUSTTIPS", "存在已维护的CBD调整部分被取消的情况，是否继续保存？"),
          { confirmButtonText: this.language("SHI", "是"), cancelButtonText: this.language("FOU", "否") }
        )
      }

      if (!this.isChange && !this.cbdCanEdit) {
        if (+this.apriceChange > +this.$refs.changeSummary.total) throw iMessage.warn(this.language("AEKOCBDTOTALADJUSTTIPS", "变动值大于变动值-汇总表/变动值-CBD的值，请修改后，再次保存。"))
      }

      if (!this.isChange && this.cbdCanEdit) {
        if (this.$refs.changeSummary.tableListData.length && +this.$refs.changeSummary.total < +this.cbdTotal) {
          if (+this.apriceChange > +this.$refs.changeSummary.total) throw iMessage.warn(this.language("AEKOCBDTOTALADJUSTTIPS", "变动值大于变动值-汇总表/变动值-CBD的值，请修改后，再次保存。"))
        } else {
          if (+this.apriceChange > +this.cbdTotal) throw iMessage.warn(this.language("AEKOCBDTOTALADJUSTTIPS", "变动值大于变动值-汇总表/变动值-CBD的值，请修改后，再次保存。"))
        }
      }

      if (typeof beforeHook === "function") beforeHook()

      return saveAekoQuotationSummary({
        ...this.form,
        apriceCbdChange:this.cbdSummaryTableData[0].apriceChange,
        apriceChange:this.apriceChange,
        isChange: this.isChange,
        cbdCanEdit: this.isChange&&false||this.cbdCanEdit,
        aprice: this.allSummaryData()[0].aprice || "0.00",
        quotationId: this.partInfo.quotationId,
        rawMaterialList: this.moduleMap.material ? this.rawMaterialsTableData : undefined,
        makeCostList: this.moduleMap.production ? this.manufacturingCostTableData : undefined,
        scrapVO: this.moduleMap.scrap ? this.scrapCostTableData[0] : undefined,
        manageFeeList: this.moduleMap.manage ? this.manageTableData : undefined,
        otherFeeList: this.otherCostTableData.length ? this.otherCostTableData : undefined,
        profitVO: this.moduleMap.profit ? this.profitTableData[0] : undefined,
        // apriceChange: this.cbdSummaryTableData[0].apriceChange,
        cbdSummarySelected: this.cbdSummarySelected,
        materialChange: this.cbdSummaryTableData[0].materialChange,
        makeCostChange: this.cbdSummaryTableData[0].makeCostChange,
        discardCostChange: this.cbdSummaryTableData[0].discardCostChange,
        manageFeeChange: this.cbdSummaryTableData[0].manageFeeChange,
        otherFee: this.cbdSummaryTableData[0].otherFee,
        profitChange: this.cbdSummaryTableData[0].profitChange
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
    async handleChangeByCbdCanEdit() {
      this.saveChangeLoading = true
      this.saveLoading = true
      this.downloadLoading = true
      await updateCbdCanEdit({
        cbdCanEdit:this.cbdCanEdit,
        quotationId:this.partInfo.quotationId
      }).then((res)=>{
        if(res.code == 200){
          iMessage.success(this.language('LK_CAOZUOCHENGGONG', '操作成功'));
        }else{
          iMessage.success(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
        this.getAekoQuotationSummary();
      }).catch(()=>{
        this.getAekoQuotationSummary();
      }).finally(()=>{
        this.saveChangeLoading = false;
        this.saveLoading = false
        this.downloadLoading = false
      });


      // this.setApriceChange()
      // this.saveChange("changeValidity")
    },
    updateTotal(total) {
      // this.total = total // this.$refs.changeSummary.total

      this.setApriceChange()
    },
    updateIsChange(isChange) {
      this.isChange = isChange
      this.cbdCanEdit = !this.isChange

      this.setApriceChange()
      this.saveChange("changeValidity")
    },
    updateApriceChange(cbdTotal) {
      this.cbdTotal = cbdTotal

      this.setApriceChange()
    },
    setApriceChange() {
      let cbdTotal = this.cbdSummaryTableData[0].apriceChange
      if (!this.isChange && !this.cbdCanEdit) this.apriceChange = this.$refs.changeSummary.total

      if (!this.isChange && this.cbdCanEdit) {
        if (this.$refs.changeSummary.tableListData.length) {
          this.apriceChange = +this.$refs.changeSummary.total > +cbdTotal ?cbdTotal : this.$refs.changeSummary.total
        } else {
          this.apriceChange = cbdTotal
        }
      }

      if (this.isChange && !this.cbdCanEdit) this.apriceChange = "0"
      this.apriceChange = this.floatNum(this.apriceChange)
      this.apriceChangeDisabled = !+this.apriceChange
      this.$emit("updateApriceChange", this.apriceChange)
    },
    // 修改接口
    saveChange(type) {
      this.saveChangeLoading = true

      Promise.all([
        this.$refs.changeSummary.save(),  // 保存汇总表
        // this.save() // 保存变动值CBD
      ])
      .then(([res1, res2]) => {
        if (res1 && res1.code == 200
        //  && res2 && res2.code == 200
         ) {
          iMessage.success(this.$i18n.locale === "zh" ? res1.desZh : res1.desEn)

          this.$refs.changeSummary.getAekoCbdPriceSum() // 获取汇总表数据
          this.getAekoQuotationSummary()  // 获取变动值CBD数据
        } else {
          iMessage.error(this.language("CAOZUOSHIBAI", "操作失败"))

          if (type === "changeValidity") {  // 修改A价变动
            this.cbdCanEdit = !this.cbdCanEdit
            this.cbdDisabled = !this.cbdCanEdit
            this.setApriceChange()
          }
        }
      })
      .catch(err => {
        if (type === "changeValidity") {
          this.cbdCanEdit = !this.cbdCanEdit
          this.cbdDisabled = !this.cbdCanEdit
          this.setApriceChange()
        }
      })
      .finally(() => {
        this.saveChangeLoading = false
      })
    },
    saveAPriceChange(type) {
      if (!this.isChange && !this.cbdCanEdit) {
        if (+this.apriceChange > +this.$refs.changeSummary.total) throw iMessage.warn(this.language("AEKOCBDTOTALADJUSTTIPS", "变动值大于变动值-汇总表/变动值-CBD的值，请修改后，再次保存。"))
      }

      if (!this.isChange && this.cbdCanEdit) {
        if (this.$refs.changeSummary.tableListData.length && +this.$refs.changeSummary.total < +this.cbdTotal) {
          if (+this.apriceChange > +this.$refs.changeSummary.total) throw iMessage.warn(this.language("AEKOCBDTOTALADJUSTTIPS", "变动值大于变动值-汇总表/变动值-CBD的值，请修改后，再次保存。"))
        } else {
          if (+this.apriceChange > +this.cbdTotal) throw iMessage.warn(this.language("AEKOCBDTOTALADJUSTTIPS", "变动值大于变动值-汇总表/变动值-CBD的值，请修改后，再次保存。"))
        }
      }
      
      this.saveChangeLoading = true
      saveAPirce({
        ...this.form,
        apriceCbdChange:this.cbdSummaryTableData[0].apriceChange,
        apriceChange:this.apriceChange,
        isChange:!this.isChange,
        cbdCanEdit: this.cbdCanEdit,
        aprice: this.allSummaryData()[0].aprice || "0.00",
        quotationId: this.partInfo.quotationId,
        rawMaterialList: this.moduleMap.material ? this.rawMaterialsTableData : undefined,
        makeCostList: this.moduleMap.production ? this.manufacturingCostTableData : undefined,
        scrapVO: this.moduleMap.scrap ? this.scrapCostTableData[0] : undefined,
        manageFeeList: this.moduleMap.manage ? this.manageTableData : undefined,
        otherFeeList: this.otherCostTableData.length ? this.otherCostTableData : undefined,
        profitVO: this.moduleMap.profit ? this.profitTableData[0] : undefined,
        cbdSummarySelected: this.cbdSummarySelected,
        materialChange: this.cbdSummaryTableData[0].materialChange,
        makeCostChange: this.cbdSummaryTableData[0].makeCostChange,
        discardCostChange: this.cbdSummaryTableData[0].discardCostChange,
        manageFeeChange: this.cbdSummaryTableData[0].manageFeeChange,
        otherFee: this.cbdSummaryTableData[0].otherFee,
        profitChange: this.cbdSummaryTableData[0].profitChange
      }).then((res)=>{
        if(res?.code==200){
          this.getBasicInfo(false)
          this.getAekoQuotationSummary()
          iMessage.success(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }else{
          iMessage.error(this.language("CAOZUOSHIBAI", "操作失败"))
        }
      })
      .finally(() => {
        this.saveChangeLoading = false
      })
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
      // margin-left: 50px;
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

  ::v-deep .cardHeader {
    padding-bottom: 0;
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

    .switch {
      ::v-deep .el-switch__label--right {
        order: -1;
        margin-left: 0;
        margin-right: 10px;
      }

      ::v-deep .is-active {
        background: transparent;
        box-shadow: none;
      }
    }

    .switchSpace {
      margin-right: 30px;
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
    margin-top: 20px;
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