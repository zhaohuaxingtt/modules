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
          <el-table-column type="selection" align="center" width="55" v-if="!disabled"></el-table-column>
          <el-table-column label="#" prop="index" align="center" width="55" ></el-table-column>
          <el-table-column :label="language('LEIXING', '类型')" align="center" width="132" >
            <template v-slot="scope">
              <div class="partNameColumn">
                <iconFont v-if="scope.row.partCbdType == 2" class="iconFont" />
                <div>
                  <iSelect v-if="(scope.row.partCbdType == 1 || scope.row.partCbdType == 2) && !disabled" class="select-center" v-model="scope.row.partName" :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.partName !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].partName) : false }">
                    <el-option
                      v-for="item in materialTypeOptions"
                      :key="item.key"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </iSelect>
                  <!-- <iInput v-if="(scope.row.partCbdType == 1 || scope.row.partCbdType == 2) && !disabled" class="input-center" v-model="scope.row.partName" :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.partName !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].partName) : false }"></iInput> -->
                  <div v-else :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.partName !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].partName) : false }">{{ partNameTranslate(scope.row.partName) }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="language('YUANCAILIAOSANJIANMIAOSHU', '原材料/散件描述')" align="center" width="145">
          <template v-slot="scope">
            <iInput v-if="(scope.row.partCbdType == 1 || scope.row.partCbdType == 2) && !disabled" class="input-center" v-model="scope.row.partNumber" :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.partNumber !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].partNumber) : false }"></iInput>
            <span v-else :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.partNumber !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].partNumber) : false }">{{ scope.row.partNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="language('GONGYINGSHANGMINGCHENG', '供应商名称')" align="center" width="110">
          <template v-slot="scope">
            <iInput v-if="(scope.row.partCbdType == 1 || scope.row.partCbdType == 2) && !disabled" class="input-center" v-model="scope.row.supplierName" :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.supplierName !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].supplierName) : false }"></iInput>
            <span v-else :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.supplierName !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].supplierName) : false }">{{ scope.row.supplierName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="language('YUANCHANGUO', '原产国')" align="center" width="110">
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
        <el-table-column :render-header="h => h('span', { domProps: { innerHTML: `${this.language('是否', '是否')}SVW<br/>${this.language('指定价格散件', '指定价格散件')}` } })" align="center" width="120">
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
        <el-table-column align="center" width="90" :render-header="h => h('span', { domProps: { innerHTML: `${ language('SHULIANGDANWEI', '数量单位') }<br/>(UoM)` }})">
          <template v-slot="scope">
            <iInput v-if="(scope.row.partCbdType == 1 || scope.row.partCbdType == 2) && !disabled" class="input-center" v-model="scope.row.quantityUnit" :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.quantityUnit !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].quantityUnit) : false }"></iInput>
            <span v-else :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.quantityUnit !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].quantityUnit) : false }">{{ scope.row.quantityUnit }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="100" :render-header="h => h('span', { domProps: { innerHTML: `${ language('DANJIARMBUOM', '单价') }<br/>(RMB/UoM)` }})">
          <template v-slot="scope">
            <iInput v-if="(scope.row.partCbdType == 1 || scope.row.partCbdType == 2) && !disabled" class="input-center" v-model="scope.row.unitPrice" :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.unitPrice !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].unitPrice) : false }" @input="handleInputByNumber($event, 'unitPrice', scope.row, 2, updateUnitPrice)"></iInput>
            <span v-else :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.unitPrice !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].unitPrice) : false }">{{ floatFixNum(scope.row.unitPrice) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="80" :render-header="h => h('span', { domProps: { innerHTML: `${ language('SHULIANG', '数量') }<br/>(1..n)` }})">
          <template v-slot="scope">
            <iInput v-if="(scope.row.partCbdType == 1 || scope.row.partCbdType == 2) && !disabled" class="input-center" v-model="scope.row.quantity" :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.quantity !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].quantity) : false }" @input="handleInputByNumber($event, 'quantity', scope.row, 0, updateQuantity)"></iInput>
            <span v-else :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.quantity !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].quantity) : false }" @input="handleInputByNumber($event, 'quantity', scope.row, 0, updateQuantity)">{{ floatFixNum(scope.row.quantity) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="165" prop="directMaterialCost" :render-header="h => h('span', { domProps: { innerHTML: `${ language('ZHIJIEYUANCAILIAOSANJIANCHENGBEN', '直接原材料/散件成本') }<br/>(RMB/Pc.)` }})">
          <template slot-scope="scope">{{ floatFixNum(scope.row.directMaterialCost) }}</template>
        </el-table-column>
        <el-table-column :label="language('WULIAOGUANLIFEI', '物料管理费')" align="center">
          <el-table-column label="(%)" align="center" width="80">
            <template v-slot="scope">
              <iInput v-if="(scope.row.partCbdType == 1 || scope.row.partCbdType == 2) && !disabled" class="input-center" v-model="scope.row.materialManageCostRate" :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.materialManageCostRate !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].materialManageCostRate) : false }" @input="handleInputByNumber($event, 'materialManageCostRate', scope.row, 2, updateMaterialManageCostRate)"></iInput>
              <span v-else :class="{ changeClass: originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId] ? (scope.row.materialManageCostRate !== originMap[scope.row.frontOriginMaterialId ? scope.row.frontOriginMaterialId : scope.row.originMaterialId].materialManageCostRate) : false }">{{ floatFixNum(scope.row.materialManageCostRate) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="(RMB/Pc.)" align="center" width="90" prop="materialManageCost">
            <template slot-scope="scope">{{ floatFixNum(scope.row.materialManageCost) }}</template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" min-width="122" prop="materialCost" :render-header="h => h('span', { domProps: { innerHTML: `${ language('YUANCAILIAOSANJIANCHENGBEN', '原材料/散件成本') }<br/>（RMB/Pc.）` }})">
          <template slot-scope="scope">{{ floatFixNum(scope.row.materialCost) }}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>  
</template>

<script>
/* eslint-disable no-undef */

import { iButton, iInput, iSelect, iMessage, iMessageBox } from "rise"
import iconFont from "../iconFont"
import { floatFixNum } from "../../../data"
import { uuidv4, originRowClass, validateChangeKeysByRawMaterials as validateChangeKeys } from "../data"
import { handleInputByNumber } from "rise/web/quotationdetail/components/data"

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
    materialTypeOptions: {
      type: Array,
      required: true,
      default: () => ([])
    }
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
      originMap: {},  // 记录原零件
      originTableListData: [],  // 记录原零件数据
      multipleSelection: [],
      validateChangeKeys,
    }
  },
  filters: {
    statusFilter(value) { // true || false
      return value ? "是" : "否"
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
    // 组件可能是已填写数据后重新隐藏的，加载时计算一次
    this.computeMaterialCostSum()
  },
  methods: {
    floatFixNum,
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
      if (!this.multipleSelection.length){
        // 当列表有原零件数据时 提示用户勾选
        if(this.tableListData.length){
          return iMessage.warn(this.language('LK_HANDLEADDNEWDATA_TIPS_CHECK','请先勾选一条原零件CBD行项目'));
        }else{ // 当列表无数据时提示条件行
          return iMessage.warn(this.language('LK_HANDLEADDNEWDATA_TIPS','请先添加一行原零件CBD行项目'));
        }
      } 

      const originIdSet = new Set()
      this.multipleSelection.forEach(item => {
        if (item.partCbdType == 0) {
          originIdSet.add(item.id)
        }

        if (item.partCbdType == 1) {
          originIdSet.add(item.id || item.frontMaterialId)
        }

        if (item.partCbdType == 2) {
          originIdSet.add(item.originMaterialId || item.frontOriginMaterialId)
        }
      })

      originIdSet.forEach(id => {
        if (!this.originMap[id]) return

        const originData = this.originMap[id]
        const data = _.cloneDeep(originData)
        data.id = ""
        data.index = ""
        data.partCbdType = 2

        if (originData.partCbdType == 0) {
          data.originMaterialId = originData.id
        }

        if (originData.partCbdType == 1) {
          data.frontOriginMaterialId = originData.id ? originData.id : originData.frontMaterialId
        }
        if (!this.validateChangeKeys.every(key => originData[key] || originData[key] === 0 || originData[key] === false)) throw iMessage.warn(this.language("XUANZEDESHUJUZHONGCUNZAIWEITIANXIEWANZHENGDEYUANLINGJIANSHUJU", "选择的数据中存在未填写完整的原零件数据"))

        this.tableListData.splice(this.tableListData.indexOf(originData) + 1, 0, data)
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
      // 通过change事件，修改tableListData中选中的数据
      this.$emit("change", this.tableListData.filter(item => !this.multipleSelection.includes(item)))

      let flag = false
      this.multipleSelection.forEach(item => {
        if (item.partCbdType == 1) {  // 1: 原零件
          if (item.id) {  // 查询到的
            this.originTableListData.splice(this.originTableListData.indexOf(this.originMap[item.id]), 1) // 原零件数据删除
            this.tableListData.splice(this.tableListData.indexOf(this.originMap[item.id]), 1)
            delete this.originMap[item.id]
          } else {  // 新增的
            this.originTableListData.splice(this.originTableListData.indexOf(this.originMap[item.frontMaterialId]), 1) // 原零件数据删除
            this.tableListData.splice(this.tableListData.indexOf(this.originMap[item.frontMaterialId]), 1)
            delete this.originMap[item.frontMaterialId]
          }

          flag = true
        }
      })
      flag && (this.updateOriginDataIndex())
      setTimeout(()=>{  // 触发change修改tableListData，时间上有延迟会导致计算错误，所以添加setTimeout
        this.allCompute()
      })
    },
    isRelatedNewData(originData, newData) {
      if (originData.id) return originData.id === newData.originMaterialId || originData.id === newData.frontOriginMaterialId
      if (originData.frontMaterialId) return originData.frontMaterialId === newData.originMaterialId || originData.frontMaterialId === newData.frontOriginMaterialId

      return false
    },
    updateOriginDataIndex() {
      this.originTableListData.forEach((item, index) => this.$set(item, "index", `C${ ++index }`))
    },
    handleInputByNumber,
    updateUnitPrice(value, key, row) {
      this.computeDirectMaterialCost(value, key, row)
    },
    updateQuantity(value, key, row) {
      this.computeDirectMaterialCost(value, key, row)
    },
    computeDirectMaterialCost(originValue, originKey, row) {
      if((row.unitPrice||row.unitPrice===0)&&(row.quantity||row.quantity===0)){
        this.$set(row, "directMaterialCost", math.multiply(math.bignumber(row.unitPrice || 0), math.bignumber(row.quantity || 0)).toFixed(2))
      }else{
        this.$set(row, "directMaterialCost", null )
      }
    
      this.computeMaterialManageCost(originValue, originKey, row)
    },
    updateMaterialManageCostRate(value, key, row) {
      this.computeMaterialManageCost(value, key, row)
    },
    computeMaterialManageCost(originValue, originKey, row) {
      if((row.directMaterialCost||row.directMaterialCost===0)&&(row.materialManageCostRate||row.materialManageCostRate===0)){
        this.$set(row, "materialManageCost", math.multiply(
          math.bignumber(row.directMaterialCost || 0),
          math.divide(math.bignumber(row.materialManageCostRate || 0), 100)
        ).toFixed(2))
      }else{
        this.$set(row, "materialManageCost", null)
      }

      this.computeMaterialCost(originValue, originKey, row)
    },
    computeMaterialCost(originValue, originKey, row) {
      const materialCost = math.add(math.bignumber(row.directMaterialCost || 0), math.bignumber(row.materialManageCost || 0)).toFixed(2)
      this.$set(row, "materialCost", materialCost)
    
      this.computeMaterialCostSum(materialCost, "materialCost", row)
    },
    // 计算原、新零件成本差
    computeMaterialCostSum(originValue, originKey, row) {
      let originMaterialCostSum = null // 原材料成本
      let originMaterialCostSumByNotSvwAssignPriceParts = null // 不参与计算的原材料成本
      let newMaterialCostSum = null  // 新材料成本
      let newMaterialCostSumByNotSvwAssignPriceParts = null  // 不参与计算的新材料成本
  
      const tableListData = this.tableListData
      tableListData.forEach(item => {
        if (item.partCbdType == 0 || item.partCbdType == 1) { // 原材料,成本汇总
          if(item.materialCost!=null){
            originMaterialCostSum = math.add(originMaterialCostSum||0, math.bignumber(item.materialCost))
            if (!item.isSvwAssignPriceParts) {
              originMaterialCostSumByNotSvwAssignPriceParts = math.add(originMaterialCostSumByNotSvwAssignPriceParts||0, math.bignumber(item.materialCost))
            }
          }

        }
        if (item.partCbdType == 2) {  // 新材料,成本汇总
          if(item.materialCost!=null){
            newMaterialCostSum = math.add(newMaterialCostSum||0, math.bignumber(item.materialCost))
            if (!item.isSvwAssignPriceParts) {
              newMaterialCostSumByNotSvwAssignPriceParts = math.add(newMaterialCostSumByNotSvwAssignPriceParts||0, math.bignumber(item.materialCost))
            }
          }
        }
      })
      let materialChange = null
      // 新，原材料成本相减，获取变动值
      if(newMaterialCostSum!=null && originMaterialCostSum!=null){
        materialChange = math.subtract(newMaterialCostSum, originMaterialCostSum).toFixed(2)
      }
      originMaterialCostSum = originMaterialCostSum&&originMaterialCostSum.toFixed(2)
      originMaterialCostSumByNotSvwAssignPriceParts = originMaterialCostSumByNotSvwAssignPriceParts&&originMaterialCostSumByNotSvwAssignPriceParts.toFixed(2)
      newMaterialCostSum = newMaterialCostSum&&newMaterialCostSum.toFixed(2)
      newMaterialCostSumByNotSvwAssignPriceParts = newMaterialCostSumByNotSvwAssignPriceParts&&newMaterialCostSumByNotSvwAssignPriceParts.toFixed(2)
      this.$emit("update:sumData", {
        originMaterialCostSum,  // 原材料成本
        originMaterialCostSumByNotSvwAssignPriceParts,  //不是SVW指定 的原材料成本
        newMaterialCostSum, // 新材料成本
        newMaterialCostSumByNotSvwAssignPriceParts,  //不是SVW指定 的新材料成本
        materialChange  //  变动值
      })
    },
    allCompute() {
      if(this.tableListData.length){
        this.tableListData.forEach(item => {
          this.computeDirectMaterialCost("", "", item)
          this.computeMaterialManageCost("", "", item)
        })
      }else{
        this.computeMaterialCostSum()
      }
    },
    partNameTranslate(value) {
      const data = this.materialTypeOptions.find(item => item.value === value)
      return data ? data.label : value
    }
  },
  beforeDestroy(){
    // 隐藏显示时,清空变动值
    this.$emit("update:sumData", {
      originMaterialCostSum:null,  // 原材料成本
      originMaterialCostSumByNotSvwAssignPriceParts:null,  //不是SVW指定 的原材料成本
      newMaterialCostSum:null, // 新材料成本
      newMaterialCostSumByNotSvwAssignPriceParts:null,  //不是SVW指定 的新材料成本
      materialChange:null  //  变动值
    })
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
    color: #67C23A;

    input {
      font-style: italic;
      color: #67C23A;
    }
  }
}
</style>