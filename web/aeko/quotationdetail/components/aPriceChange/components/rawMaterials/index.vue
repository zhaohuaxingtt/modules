<template>
  <div class="rawMaterials">
    <i class="topCutLine" v-if="topCutLine"></i>
    <div class="header">
      <span class="title">2.1 {{ language("YUANCAILIAOSANJIANCHENGBEN", "原材料/散件成本") }}</span>
      <div class="control" v-if="!disabled">
        <iButton @click="handleAddOriginData" v-permission.auto="AEKO_QUOTATION_CBD_VIEW_YUANCAILIAOSANJIANCHENGBEN_BUTTON_TIANJIAYUANLINGJIANCBD|添加原零件CBD">{{ language("TIANJIAYUANLINGJIANCBD", "添加原零件CBD") }}</iButton>
        <iButton @click="handleAddNewData" v-permission.auto="AEKO_QUOTATION_CBD_VIEW_YUANCAILIAOSANJIANCHENGBEN_BUTTON_TIANJIAXINLINGJIANCBD|添加新零件CBD">{{ language("TIANJIAXINLINGJIANCBD", "添加新零件CBD") }}</iButton>
        <iButton @click="handleDelete" v-permission.auto="AEKO_QUOTATION_CBD_VIEW_YUANCAILIAOSANJIANCHENGBEN_BUTTON_SHANCHUHANG|删除行">{{ language("SHANCHUHANG", "删除行") }}</iButton>
      </div>
    </div>
    <div class="body margin-top20">
      <el-table class="table" ref="table" :data="tableListData" :row-class-name="originRowClass" @selection-change="selectionChange">
        <el-table-column :label="language('YUANCAILIAOSANJIANCHENGBEN', '原材料/散件成本')" align="center">
          <el-table-column type="selection" align="center" width="40"></el-table-column>
          <el-table-column label="#" prop="index" align="center" width="55" ></el-table-column>
          <el-table-column :label="language('LEIXING', '类型')" align="center" width="132" >
            <template v-slot="scope">
              <div class="partNameColumn">
                <iconFont v-if="scope.row.partCbdType == 2" class="iconFont" />
                <div>
                  <iInput v-if="(scope.row.partCbdType == 1 || scope.row.partCbdType == 2) && !disabled" class="input-center" v-model="scope.row.partName" :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.partName !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].partName) : false }"></iInput>
                  <div v-else :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.partName !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].partName) : false }">{{ scope.row.partName }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="language('YUANCAILIAOSANJIANMIAOSHU', '原材料/散件描述')" align="center" width="120">
          <template v-slot="scope">
            <iInput v-if="(scope.row.partCbdType == 1 || scope.row.partCbdType == 2) && !disabled" class="input-center" v-model="scope.row.partNumber" :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.partNumber !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].partNumber) : false }"></iInput>
            <span v-else :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.partNumber !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].partNumber) : false }">{{ scope.row.partNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="language('GONGYINGSHANGMINGCHENG', '供应商名称')" align="center" width="92">
          <template v-slot="scope">
            <iInput v-if="(scope.row.partCbdType == 1 || scope.row.partCbdType == 2) && !disabled" class="input-center" v-model="scope.row.supplierName" :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.supplierName !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].supplierName) : false }"></iInput>
            <span v-else :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.supplierName !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].supplierName) : false }">{{ scope.row.supplierName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="language('YUANCHANGUO', '原产国')" align="center" width="100">
          <template v-slot="scope">
            <iSelect v-if="(scope.row.partCbdType == 1 || scope.row.partCbdType == 2) && !disabled" class="select-center" filterable v-model="scope.row.productionCountry" :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.productionCountry !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].productionCountry) : false }">
              <el-option
                v-for="item in countryOptions"
                :key="item.key"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </iSelect>
            <span v-else :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.productionCountry !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].productionCountry) : false }">{{ scope.row.productionCountry }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="language('SHIFOUSVWZHIDINGJIAGESANJIAN', '是否SVW指定价格散件')" align="center" width="150">
          <template v-slot="scope">
            <iSelect v-if="(scope.row.partCbdType == 1 || scope.row.partCbdType == 2) && !disabled" class="select-center" v-model="scope.row.isSvwAssignPriceParts" :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.isSvwAssignPriceParts !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].isSvwAssignPriceParts) : false }" @change="computeMaterialCostSum()">
              <el-option
                v-for="item in options"
                :key="item.key"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </iSelect>
            <span v-else :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.isSvwAssignPriceParts !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].isSvwAssignPriceParts) : false }">{{ scope.row.isSvwAssignPriceParts | statusFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="81" :render-header="h => h('span', { domProps: { innerHTML: `${ language('SHULIANGDANWEI', '数量单位') }<br/>（UoM）` }})">
          <template v-slot="scope">
            <iInput v-if="(scope.row.partCbdType == 1 || scope.row.partCbdType == 2) && !disabled" class="input-center" v-model="scope.row.quantityUnit" :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.quantityUnit !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].quantityUnit) : false }"></iInput>
            <span v-else :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.quantityUnit !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].quantityUnit) : false }">{{ scope.row.quantityUnit }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="120" :render-header="h => h('span', { domProps: { innerHTML: `${ language('DANJIARMBUOM', '单价') }(RMB/UoM)` }})">
          <template v-slot="scope">
            <iInput v-if="(scope.row.partCbdType == 1 || scope.row.partCbdType == 2) && !disabled" class="input-center" v-model="scope.row.unitPrice" :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.unitPrice !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].unitPrice) : false }" @input="handleInputByNumber($event, 'unitPrice', scope.row, 2, updateUnitPrice)"></iInput>
            <span v-else :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.unitPrice !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].unitPrice) : false }">{{ scope.row.unitPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="96" :render-header="h => h('span', { domProps: { innerHTML: `${ language('SHULIANG', '数量') }(1..n)` }})">
          <template v-slot="scope">
            <iInput v-if="(scope.row.partCbdType == 1 || scope.row.partCbdType == 2) && !disabled" class="input-center" v-model="scope.row.quantity" :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.quantity !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].quantity) : false }" @input="handleInputByNumber($event, 'quantity', scope.row, 0, updateQuantity)"></iInput>
            <span v-else :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.quantity !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].quantity) : false }" @input="handleInputByNumber($event, 'quantity', scope.row, 0, updateQuantity)">{{ scope.row.quantity }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="140" prop="directMaterialCost" :render-header="h => h('span', { domProps: { innerHTML: `${ language('ZHIJIEYUANCAILIAOSANJIANCHENGBEN', '直接原材料/散件成本') }<br/>（RMB/Pc.）` }})"></el-table-column>
        <el-table-column :label="language('WULIAOGUANLIFEI', '物料管理费')" align="center">
          <el-table-column label="(%)" align="center" width="88">
            <template v-slot="scope">
              <iInput v-if="(scope.row.partCbdType == 1 || scope.row.partCbdType == 2) && !disabled" class="input-center" v-model="scope.row.materialManageCostRate" :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.materialManageCostRate !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].materialManageCostRate) : false }" @input="handleInputByNumber($event, 'materialManageCostRate', scope.row, 2, updateMaterialManageCostRate)"></iInput>
              <span v-else :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.materialManageCostRate !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].materialManageCostRate) : false }">{{ scope.row.materialManageCostRate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="(RMB/Pc.)" align="center" width="93" prop="materialManageCost"></el-table-column>
        </el-table-column>
        <el-table-column align="center" min-width="122" prop="materialCost" :render-header="h => h('span', { domProps: { innerHTML: `${ language('YUANCAILIAOSANJIANCHENGBEN', '原材料/散件成本') }<br/>（RMB/Pc.）` }})"></el-table-column>
      </el-table>
    </div>
  </div>  
</template>

<script>
/* eslint-disable no-undef */

import { iButton, iInput, iSelect, iMessage, iMessageBox } from "rise"
import iconFont from "../iconFont"
import { uuidv4, originRowClass, validateChangeKeysByRawMaterials as validateChangeKeys } from "../data"
import { numberProcessor } from "@/utils"
import { cloneDeep } from "lodash"

export default {
  components: { iButton, iInput, iSelect, iconFont },
  model: {
    prop: "tableListData",
    event: "change"
  },
  props: {
    topCutLine: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    tableListData: {
      type: Array,
      required: true,
      default: () => ([])
    },
    sumData: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      countryOptions: [
        { key: "China", label: "China", value: "China" },
        { key: "Japan", label: "Japan", value: "Japan" },
        { key: "Germany", label: "Germany", value: "Germany" }
      ],
      options: [
        { key: "Y", label: "是", value: true },
        { key: "N", label: "否", value: false }
      ],
      originMap: {},
      originTableListData: [],
      multipleSelection: [],
      validateChangeKeys,
    }
  },
  filters: {
    statusFilter(value) {
      return value === "Y" ? "是" : "否"
    }
  },
  created() {
    let index = 0
    this.originTableListData = this.tableListData.filter(item => {
      if (item.partCbdType == 0 || item.partCbdType == 1) {
        this.$set(this.originMap, item.id, item)
        this.$set(item, "index", `C${ ++index }`)
        return true
      } else 
        return false
    })
  },
  methods: {
    originRowClass,
    selectionChange(list) {
      this.multipleSelection = list
    },
    handleAddOriginData() {
      const data = {
        frontMaterialId: uuidv4(),
        index: `C${ this.originTableListData.length + 1 }`,
        partCbdType: 1
      }

      this.tableListData.push(data)
      this.originTableListData.push(data)
      this.$set(this.originMap, data.frontMaterialId, data)
    },
    handleAddNewData() {
      if (!this.multipleSelection.some(item => item.partCbdType == 0 || item.partCbdType == 1)) return iMessage.warn(this.language("QINGXUANZEZHISHAOYITIAOYUANLINGJIANSHUJUZUOWEITIANJIAYANGBAN", "请选择至少一条原零件数据作为添加样板"))

      this.multipleSelection.forEach(item => {
        if (item.partCbdType != 0 && item.partCbdType != 1) return

        const data = cloneDeep(item)
        data.id = ""
        data.index = ""
        data.partCbdType = 2

        if (item.partCbdType == 0) {
          data.originMaterialId = item.id
        }

        if (item.partCbdType == 1) {
          data.frontOriginMaterialId = item.id ? item.id : item.frontMaterialId
        }

        if (item.partCbdType == 0 || item.partCbdType == 1) {
          if (!this.validateChangeKeys.every(key => item[key] || item[key] === 0 || item[key] === false)) throw iMessage.warn(this.language("QINGXUANZETIANXIEWANZHENGDEYUANLINGJIANSHUJUZUOWEITIANJIAYANGBAN", "请选择填写完整的原零件数据作为添加样板"))
        }

        this.tableListData.splice(this.tableListData.indexOf(item) + 1, 0, data)
      })

      this.$refs.table.clearSelection()

      this.allCompute()
    },
    async handleDelete() {
      for (let i = 0, item; item = this.multipleSelection[i++]; ) {
        if (item.partCbdType == 0) return iMessage.warn(this.language("WUFASHANCHUYUANYOUYUANLINGJIANHANGXIANGMU", "无法删除原有原零件行项目！"))
      
        if ((item.partCbdType == 2 && this.validateChangeKeys.some(key => item[key] !== this.originMap[item.frontOriginMaterialId ? item.frontOriginMaterialId : item.originMaterialId][key])) || (item.partCbdType == 1 && this.validateChangeKeys.some(key => item[key] || item[key] === 0))) { 
          await iMessageBox(
            this.language("HASCHANGEDELETE", "已维护的有值，请确认是否删除？"),
            { confirmButtonText: this.language("SHI", "是"), cancelButtonText: this.language("FOU", "否") }
          )
        }
        
        if (item.partCbdType == 1 && this.tableListData.some(row => row.partCbdType == 2 && this.isRelatedNewData(item, row))) {
          await iMessageBox(
            this.language("HASNEWDATADELETE", "该原零件行项目对应的所有新零件行项目也将一并删除，请确认是否删除？"),
            { confirmButtonText: this.language("SHI", "是"), cancelButtonText: this.language("FOU", "否") }
          )

          this.multipleSelection = this.multipleSelection.concat(this.tableListData.filter(row => row.partCbdType == 2 && this.isRelatedNewData(item, row)))
        }
      }

      this.$emit("change", this.tableListData.filter(item => !this.multipleSelection.includes(item)))

      let flag = false
      this.multipleSelection.forEach(item => {
        if (item.partCbdType == 1) {
          if (item.id) {
            this.originTableListData.splice(this.originTableListData.indexOf(this.originMap[item.id]), 1)
            delete this.originMap[item.id]
          } else {
            this.originTableListData.splice(this.originTableListData.indexOf(this.originMap[item.frontMaterialId]), 1)
            delete this.originMap[item.frontMaterialId]
          }

          flag = true
        }
      })

      flag && (this.updateOriginDataIndex())

      this.allCompute()
    },
    isRelatedNewData(originData, newData) {
      if (originData.id) return originData.id === newData.originMaterialId || originData.id === newData.frontOriginMaterialId
      if (originData.frontMaterialId) return originData.frontMaterialId === newData.originMaterialId || originData.frontMaterialId === newData.frontOriginMaterialId

      return false
    },
    updateOriginDataIndex() {
      this.originTableListData.forEach((item, index) => this.$set(item, "index", `C${ ++index }`))
    },
    handleInputByNumber(value, key, row, precision, cb) {
      this.$set(row, key, numberProcessor(value, precision))
      
      if (typeof cb === "function") {
        cb(value, key, row)
      }
    },
    updateUnitPrice(value, key, row) {
      this.computeDirectMaterialCost(value, key, row)
    },
    updateQuantity(value, key, row) {
      this.computeDirectMaterialCost(value, key, row)
    },
    computeDirectMaterialCost(originValue, originKey, row) {
      const directMaterialCost = math.multiply(math.bignumber(row.unitPrice || 0), math.bignumber(row.quantity || 0)).toFixed(2)
      this.$set(row, "directMaterialCost", directMaterialCost)
    
      this.computeMaterialManageCost(directMaterialCost, "directMaterialCost", row)
    },
    updateMaterialManageCostRate(value, key, row) {
      this.computeMaterialManageCost(value, key, row)
    },
    computeMaterialManageCost(originValue, originKey, row) {
      const materialManageCost = math.multiply(
        math.bignumber(row.directMaterialCost || 0),
        math.divide(math.bignumber(row.materialManageCostRate || 0), 100)
      ).toFixed(2)
      this.$set(row, "materialManageCost", materialManageCost)

      this.computeMaterialCost(materialManageCost, "materialManageCost", row)
    },
    computeMaterialCost(originValue, originKey, row) {
      const materialCost = math.add(math.bignumber(row.directMaterialCost || 0), math.bignumber(row.materialManageCost || 0)).toFixed(2)
      this.$set(row, "materialCost", materialCost)
    
      this.computeMaterialCostSum(materialCost, "materialCost", row)
    },
    computeMaterialCostSum(originValue, originKey, row) {
      let originMaterialCostSum = 0
      let originMaterialCostSumByNotSvwAssignPriceParts = 0
      let newMaterialCostSum = 0
      let newMaterialCostSumByNotSvwAssignPriceParts = 0

      const changeList = []
      this.tableListData.forEach(item => {
        if (item.partCbdType == 2) {
          if (this.originMap[item.frontOriginMaterialId ? item.frontOriginMaterialId : item.originMaterialId]) {
            changeList.push(this.originMap[item.frontOriginMaterialId ? item.frontOriginMaterialId : item.originMaterialId])
          }

          changeList.push(item)
        }
      })

      changeList.forEach(item => {
        if (item.partCbdType == 0 || item.partCbdType == 1) {
          originMaterialCostSum = math.add(originMaterialCostSum, math.bignumber(item.materialCost || 0))

          if (!item.isSvwAssignPriceParts) {
            originMaterialCostSumByNotSvwAssignPriceParts = math.add(originMaterialCostSumByNotSvwAssignPriceParts, math.bignumber(item.materialCost || 0))
          }
        }

        if (item.partCbdType == 2) {
          newMaterialCostSum = math.add(newMaterialCostSum, math.bignumber(item.materialCost || 0))

          if (!item.isSvwAssignPriceParts) {
            newMaterialCostSumByNotSvwAssignPriceParts = math.add(newMaterialCostSumByNotSvwAssignPriceParts, math.bignumber(item.materialCost || 0))
          }
        }
      })

      const materialChange = math.subtract(newMaterialCostSum, originMaterialCostSum).toFixed(2)
      originMaterialCostSum = originMaterialCostSum.toFixed(2)
      originMaterialCostSumByNotSvwAssignPriceParts = originMaterialCostSumByNotSvwAssignPriceParts.toFixed(2)
      newMaterialCostSum = newMaterialCostSum.toFixed(2)
      newMaterialCostSumByNotSvwAssignPriceParts = newMaterialCostSumByNotSvwAssignPriceParts.toFixed(2)

      this.$emit("update:sumData", {
        originMaterialCostSum,
        originMaterialCostSumByNotSvwAssignPriceParts,
        newMaterialCostSum,
        newMaterialCostSumByNotSvwAssignPriceParts,
        materialChange
      })
    },
    allCompute() {
      this.tableListData.forEach(item => {
        this.computeDirectMaterialCost("", "", item)
        this.computeMaterialManageCost("", "", item)
        this.computeMaterialCost("", "", item)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.rawMaterials {
  .topCutLine {
    display: block;
    border-top: 2px #BBC4D6 dashed;
    margin-bottom: 30px;
  }

  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    .title {
      font-size: 18px;
      color: #131523;
      font-weight: bold;
    }

    .control {}
  }

  .table {
    .partNameColumn {
      position: relative;

      ::v-deep .iconFont {
        width: 30px;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translate(0, -50%);

        svg {
          vertical-align: middle;
          float: left;
        }
      }

      & > div:not(.iconFont) {
        padding-left: 30px;
      }
    }

    ::v-deep .el-table__row {
      background-color: #fff;
    }

    ::v-deep td {
      border-right: 0;
      border-bottom: 1px solid rgba(112, 112, 112, .1);
    }

    ::v-deep .originRow {
      background: #f4f8ff;
    }
  }

  ::v-deep .changeClass {
    font-style: italic;
    color: #1660F1;

    input {
      font-style: italic;
      color: #1660F1;
    }
  }
}
</style>