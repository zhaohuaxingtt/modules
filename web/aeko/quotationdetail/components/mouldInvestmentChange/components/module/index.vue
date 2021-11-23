<template>
  <iCard class="module">
    <template #header>
      <div class="title">
        <span>{{ `${language("MUJUCBD", "模具CBD")} ${language("BIANJILAN", "编辑栏")}` }}</span>
        <span class="tip margin-left14">({{ language("DANWEI", "单位") }}：{{ language("YUAN", "元") }})</span>
      </div>
      <div class="header-control">
        <div class="btn" v-if="!editDisabled">
          <iButton v-if="!disabled" @click="handleAdd">{{ language("TIANJIAHANG", "添加行") }}</iButton>
          <iButton v-if="!disabled" @click="handleDelete">{{ language("SHANCHUHANG", "删除行") }}</iButton>
          <iButton v-permission.auto="AEKO_QUOTATION_DETAIL_MOULDLE_BUTTON_GUANLIANLINGJIAN|模具投资变动_关联零件" v-if="!disabled" @click="handleQuote">{{ language("GUANLIANLINGJIAN", "关联零件") }}</iButton>
          <iButton v-if="!disabled" :loading="saveLoading" @click="save">{{ language("BAOCUN", "保存") }}</iButton>
        </div>
      </div>
    </template>
    <div class="body margin-top18">
      <div class="mainTip margin-top10">{{
          language("AEKOQUOTATIONMODULETIP_1", "当模具行项目不分摊进单价，”修模”或”减值”必须先引用原零件模具CBD; 当模具行项目将分摊进单价，”修模”或”减值”无需引用原零件模具CBD。")
        }}
      </div>
      <tableList
          lang
          class="table"
          v-loading="loading"
          :tableTitle="tableTitle"
          :tableData="tableListData"
          @handleSelectionChange="handleSelectionChange">
        <template #isShared="scope">
          <iSelect v-if="!disabled && !isQuote(scope.row) && !editDisabled" v-model="scope.row.isShared"
                   @change="handleChangeByIsShared($event, scope.row)">
            <el-option :label="language('SHI', '是')" :value="1"></el-option>
            <el-option :label="language('FOU', '否')" :value="0"></el-option>
          </iSelect>
          <span v-else>{{ scope.row.isShared | statesFilter }}</span>
        </template>
        <!--类型选择--->
        <template #changeType="scope">
          <iSelect v-if="scope.row.isShared == 1 && !disabled && !editDisabled" v-model="scope.row.changeType"
                   @change="handleChangeByChangeType($event, scope.row)">
            <el-option v-if="!isQuote(scope.row) " :label="language('XINZENG', '新增')" value="新增"></el-option>
            <el-option :label="language('XIUMU', '修模')" value="修模"></el-option>
            <el-option :label="language('JIANZHI', '减值')" value="减值"></el-option>
          </iSelect>
          <span v-else>{{ scope.row.changeType }}</span>
        </template>
        <!--工艺类型-->
        <template #stuffType="scope">
          <iInput v-if="!isQuote(scope.row) && !disabled && !editDisabled" v-model="scope.row.stuffType"></iInput>
          <span v-else>{{ scope.row.stuffType }}</span>
        </template>
        <!--工模具种类-->
        <template #mouldType="scope">
          <iInput v-if="!isQuote(scope.row) && !disabled && !editDisabled" v-model="scope.row.mouldType"
                  @input="handleInputByMouldType($event, scope.row)"></iInput>
          <span v-else>{{ scope.row.mouldType }}</span>
        </template>
        <!--资产分类编号-->
        <template #assetTypeCode="scope">
          <iSelect v-if="!isQuote(scope.row) && !disabled && !editDisabled" v-model="scope.row.assetTypeCode">
            <el-option v-for="assetType in assetTypeCodeOptions" :key="assetType.value"
                       :label="`${assetType.value}-${assetType.label}`"
                       :value="assetType.value"></el-option>
          </iSelect>
          <span v-else>{{ getAssetClassificationVal(scope.row.assetTypeCode) }}</span>
        </template>
        <!--FS号-->
        <template #assembledPartPrjCode="scope">
          <iInput v-if="!isQuote(scope.row) && !disabled && !editDisabled"
                  v-model="scope.row.assembledPartPrjCode"></iInput>
          <span v-else>{{ scope.row.assembledPartPrjCode }}</span>
        </template>
        <!--散件名称-->
        <template #supplierPartNameList="scope">
          <iInput v-if="!isQuote(scope.row) && !disabled && !editDisabled" v-model="scope.row.supplierPartNameList"
                  @input="handleInputBySupplierPartNameList($event, scope.row)"></iInput>
          <span v-else>{{ scope.row.supplierPartNameList }}</span>
        </template>
        <!--散件零件号-->
        <template #supplierPartCodeList="scope">
          <iInput v-if="!isQuote(scope.row) && !disabled && !editDisabled"
                  v-model="scope.row.supplierPartCodeList"></iInput>
          <span v-else>{{ scope.row.supplierPartCodeList }}</span>
        </template>
        <!--数量-->
        <template #quantity="scope">
          <iInput v-model="scope.row.quantity" v-if="!editDisabled"
                  @input="handleInputByNumber($event, 'quantity', scope.row, 0, updateQuantity)"></iInput>
          <span v-else>{{ floatFixNum(scope.row.quantity, 0, 0) }}</span>
        </template>
        <!--资产变动单价-->
        <template #changeUnitPrice="scope">
          <iInput v-model="scope.row.changeUnitPrice" v-if="!editDisabled"
                  @input="handleInputByNumber($event, 'changeUnitPrice', scope.row, 2, updateChangeUnitPrice, scope.row.changeType === '减值')"></iInput>
          <span v-else>{{ floatFixNum(scope.row.changeUnitPrice) }}</span>
        </template>
        <!--资产变动总额-->
        <template #changeTotalPrice="scope">{{ floatFixNum(scope.row.changeTotalPrice) }}</template>
        <!--原零件资产总额-->
        <template #originTotalPrice="scope">{{ floatFixNum(scope.row.originTotalPrice) }}</template>
        <!--新零件资产总额-->
        <template #totalPrice="scope">{{ floatFixNum(scope.row.totalPrice) }}</template>
      </tableList>
      <iFormGroup class="subCost margin-top30" :row="4" inline>
        <iFormItem class="item" v-for="(info, $index) in mouldCostInfos" :key="$index"
                   :label="`${ language(info.key, info.name) }`">
          <iInput v-if="info.props === 'shareQuantity' && !disabled && !editDisabled" v-model="shareQuantity"
                  @input="handleInputByShareQuantity"/>
          <iText v-else>{{ floatFixNum(dataGroup[info.props], info.props == 'shareQuantity' ? 0 : 2) }}</iText>
        </iFormItem>
      </iFormGroup>
    </div>
  </iCard>
</template>

<script>
import {iCard, iButton, icon, iFormGroup, iFormItem, iSelect, iInput, iText, iMessageBox,} from "rise"
import tableList from "rise/web/quotationdetail/components/tableList"
import {moduleTableTitle as tableTitle, assetTypeCodeOptions, mouldCostInfos} from "../data"
import {floatFixNum} from "../../../data"
import {statesFilter} from "rise/web/quotationdetail/components/mouldAndDevelopmentCost/components/data"
import {getMoulds, saveMoulds} from "@/api/aeko/quotationdetail"
import {handleInputByNumber} from "rise/web/quotationdetail/components/data";

export default {
  components: {iCard, iButton, icon, iFormGroup, iFormItem, iSelect, iInput, iText, tableList},
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
      dataGroup: {},
      tableTitle,
      tableListData: [],
      multipleSelection: [],
      assetTypeCodeOptions,
      mouldCostInfos,
      indexSet: new Set(),
      saveLoading: false,
      //添加行校验Key
      validateKeys: [
        "isShared",
        "changeType",
        "stuffType",
        "mouldType",
        "assetTypeCode",
        "assembledPartPrjCode",
        "supplierPartNameList",
        "supplierPartCodeList",
        "quantity",
        "changeUnitPrice"
      ],
      //引用校验Key
      quoteValidateKeys: [
        "changeType",
        "quantity",
        "changeUnitPrice"
      ]


    }
  },

  filters: {
    statesFilter
  },
  computed: {
    shareQuantity: {
      get: function () {
        if (this.dataGroup.shareQuantity)
          return Math.trunc(Number(this.dataGroup.shareQuantity))
        return ''
      },
      set: function (val) {
        this.dataGroup.shareQuantity = val
      }
    },
    ...Vuex.mapState({
      userInfo: state => state.permission.userInfo,

    })
  },
  methods: {
    floatFixNum,
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
                  this.computeRowChangeTotalPrice(item)
                  this.computeRowTotalPrice(item)

                  // assembledPartCode assembledPartName 无值时从基础信息里面拿
                  if(!item.assembledPartCode) item.assembledPartCode = this.partInfo.partNum || null;
                  if(!item.assembledPartName) item.assembledPartName = this.partInfo.partName || null;
                })
              }
              this.computeTotalPriceSum()
              this.computeShareTotalSum()
              this.indexSet.add(0)
            } else {
              this.$message.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
            }
          })
          .finally(() => this.loading = false)
    },
    handleSelectionChange(list) {
      this.multipleSelection = list
    },
    handleAdd() {
      let index = 0
      while (true) {
        if (this.indexSet.has(index)) {
          index += 1
        } else break
      }

      this.tableListData.push({
        mouldId: `${this.partInfo.rfqId}_${this.$route.query.supplierCode}_${this.partInfo.partNum}_T${this.indexProcess(index)}`,
        changeType: "新增",
        assembledPartCode:this.partInfo.partNum || null,
        assembledPartName:this.partInfo.partName || null,
      })

      this.indexSet.add(index)
    },
    addQuote(list) {

      // 如果用户勾选的原零件模具CBD已经被引入过，则不对此行做任何操作
      const arrId = this.tableListData.map((item) => item.id) || [];
      list = list.filter((item) => !arrId.includes(item.id));
      const quoteList = list.map(item => ({
        id: item.id,
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
        originPartNums: item.partsShareNum,
        isQuote: true,
      }))

      this.tableListData = this.tableListData.concat(quoteList)
    },
    isQuote(row) {

      return row.isQuote||(row.bmNum && row.bmSerialNum)
    },
    async handleDelete() {
      if (this.multipleSelection.length) {
        await iMessageBox(
            this.language("QINGQUERENSHIFOUSHANCHUSUOXUANZHONGDEMUJUHANGXIANGMU", "请确认是否删除所选中的模具行项目？"),
            {confirmButtonText: this.language("SHI", "是"), cancelButtonText: this.language("FOU", "否")}
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
      const routeData = this.$router.resolve({
        path: '/aeko/relatingParts',
        query: {
          disabled: this.disabled,
          quotationId: this.partInfo.quotationId
        },
      })
      window.open(routeData.href, '_blank')
      // this.$router.push({
      //   path: "/aeko/relatingParts",
      //   query: {
      //     disabled: this.disabled,
      //     quotationId: this.partInfo.quotationId
      //   }
      // })
    },
    indexProcess(value) {
      return value >= 10 ? value + "" : "0" + value
    },
    handleInputByNumber,
    handleChangeByIsShared(value, row) {
      if (row.isShared == 0) {
        this.$set(row, "changeType", "新增")
      }

      this.computeShareTotalSum()
    },
    handleChangeByChangeType(value, row) {
      if (row.changeType === "减值") {
        const value = (row.changeUnitPrice ? row.changeUnitPrice : 0) * -1
        this.$set(row, "changeUnitPrice", value)
      } else {
        this.$set(row, "changeUnitPrice", Math.abs(row.changeUnitPrice ? row.changeUnitPrice : 0))
      }
      this.computeChangeTotalPrice(value, "changeUnitPrice", row)
    },
    handleInputByShareQuantity(val) {
      this.dataGroup.shareQuantity = Math.trunc(val)
      this.computeShareAmount()
    },
    handleInputByMouldType($event, row) {
      if ($event && row.supplierPartNameList) {
        this.$set(row, "fixedAssetsName", `${this.partInfo.partName}${row.supplierPartNameList}${$event}`)
      } else {
        this.$set(row, "fixedAssetsName", "")
      }
    },
    handleInputBySupplierPartNameList($event, row) {
      if ($event && row.mouldType) {
        this.$set(row, "fixedAssetsName", `${this.partInfo.partName}${$event}${row.mouldType}`)
      } else {
        this.$set(row, "fixedAssetsName", "")
      }
    },
    updateQuantity(value, key, row) {
      this.computeChangeTotalPrice(value, key, row)
    },
    updateChangeUnitPrice(value, key, row) {
      if (row.changeType === "减值") {
        const value = row.changeUnitPrice * -1
        this.$set(row, "changeUnitPrice", value)
      } else {
        this.$set(row, "changeUnitPrice", Math.abs(row.changeUnitPrice))
      }
      this.computeChangeTotalPrice(value, key, row)
    },
    computeChangeTotalPrice(originValue, originKey, row) {
      if (row != null) {
        this.$set(row, "changeTotalPrice", math.multiply(math.bignumber(row.quantity || 0), math.bignumber(row.changeUnitPrice || 0)).toFixed(2))
        this.computeTotalPrice(originValue, originKey, row)
        this.computeTotalPriceSum() // 计算总投资变动成本
        this.computeShareTotalSum() // 计算分摊投资变动成本
      }
    },
    //计算行ChangeTotalPrice
    computeRowChangeTotalPrice(row) {
      this.$set(row, "changeTotalPrice", math.multiply(math.bignumber(row.quantity || 0), math.bignumber(row.changeUnitPrice || 0)).toFixed(2))
    },
    computeRowTotalPrice(row) {
      this.$set(row, "totalPrice", math.add(math.bignumber(row.changeTotalPrice || 0), math.bignumber(row.originTotalPrice || 0)).toFixed(2))
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
    save(){
      this.saveLoading = true
      this.handleSave().then(res => {
            if (res.code == 200) {
              this.$message.success(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
              // this.getMoulds()
              this.$emit("getBasicInfo")
            } else {
              this.$message.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
            }
          })
          .catch(() => this.saveLoading = false)
          .finally(() => this.saveLoading = false)
    },
    async handleSave() {
      if (!this.tableListData.every(item => item.isQuote||(item.bmNum && item.bmSerialNum)? this.quoteValidateKeys.every(key => item[key] || item[key] === 0 ): this.validateKeys.every(key => item[key] || item[key] === 0))) {
        throw this.$message.error(this.language("QINGWEIHUHAOBIANTIANXIANGHOUZAIBAOCUN", "请维护好必填项后，再保存。"))
      }

      // 保存时若列表是否分摊存在是的数据时，分摊数量必须有值
      const isShareData = this.tableListData.filter((item)=>item.isShared);
      if(isShareData.length && !this.dataGroup.shareQuantity){
        throw this.$message.error(this.language("AEKO_TIPS_QINGTIANXIEHAOFENTANSHULIANGHOUZAIBAOCUN", "请填写好分摊数量后，再保存。"))
      } 
      return saveMoulds({
        moduleFeeDTOList: this.tableListData,
        moduleOtherFee: {
          itemType: 0,
          ...this.dataGroup
        },
        quotationId: this.partInfo.quotationId
      })
    },
    getAssetClassificationVal(val) {
      let mItem = this.assetTypeCodeOptions.find(item => item.value == val)
      if (null != mItem) {
        return `${mItem.value}-${mItem.label}`
      }

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