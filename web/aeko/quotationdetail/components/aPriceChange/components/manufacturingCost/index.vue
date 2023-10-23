<template>
  <div class="manufacturingCost">
    <i class="topCutLine" v-if="topCutLine"></i>
    <div class="header">
      <span class="title">2.2 {{ language("ZHIZAOCHENGBEN", "制造成本") }}</span>
      <div class="control" v-if="!disabled">
        <iButton @click="handleAddOriginData" v-permission.auto="AEKO_QUOTATION_CBD_VIEW_ZHIZAOCHENGBEN_BUTTON_TIANJIAYUANLINGJIANCBD|添加原零件CBD">{{ language("TIANJIAYUANLINGJIANCBD", "添加原零件CBD") }}</iButton>
        <iButton @click="handleAddNewData" v-permission.auto="AEKO_QUOTATION_CBD_VIEW_ZHIZAOCHENGBEN_BUTTON_TIANJIAXINLINGJIANCBD|添加新零件CBD">{{ language("TIANJIAXINLINGJIANCBD", "添加新零件CBD") }}</iButton>
        <iButton @click="handleDelete" v-permission.auto="AEKO_QUOTATION_CBD_VIEW_ZHIZAOCHENGBEN_BUTTON_SHANCHUHANG|删除行">{{ language("SHANCHUHANG", "删除行") }}</iButton>
      </div>
    </div>
    <div class="body margin-top20">
      <el-table class="table" ref="table" :data="tableListData" :row-class-name="originRowClass" @selection-change="selectionChange">
        <el-table-column :label="language('ZHIZAOCHENGBEN', '制造成本')" align="center">
          <el-table-column type="selection" align="center" width="55" v-if="!disabled"></el-table-column>
          <el-table-column label="#" prop="index" align="center" width="55" ></el-table-column>
          <el-table-column :label="language('ZHIZAOGONGXU', '制造工序')" align="center" width="120">
            <template v-slot="scope">
              <div class="manufacturingMethodColumn">
                <iconFont v-if="scope.row.partCbdType == 2" class="iconFont" />
                <div>
                  <iInput v-if="(scope.row.partCbdType == 1 || scope.row.partCbdType == 2) && !disabled" class="input-center" v-model="scope.row.manufacturingMethod" :class="{ changeClass: originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId] ? (scope.row.manufacturingMethod !== originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId].manufacturingMethod) : false }"></iInput>
                  <div v-else :class="{ changeClass: originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId] ? (scope.row.manufacturingMethod !== originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId].manufacturingMethod) : false }">{{ scope.row.manufacturingMethod }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" width="140" :render-header="h => h('span', { domProps: { innerHTML: `${ language('DUIYINGYUANCAILIAOSANJIAN', '对应原材料/散件') }<br/>(Ref.-ID)` }})">
          <template v-slot="scope">
            <iInput v-if="(scope.row.partCbdType == 1 || scope.row.partCbdType == 2) && !disabled" class="input-center" v-model="scope.row.material" :class="{ changeClass: originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId] ? (scope.row.material !== originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId].material) : false }"></iInput>
            <span v-else :class="{ changeClass: originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId] ? (scope.row.material !== originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId].material) : false }">{{ scope.row.material }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="120" :render-header="h => h('span', { domProps: { innerHTML: `${ language('SHEBEIMINGCHENGXINGHAO', '设备名称/型号') }<br/>(Ref.-Name)` }})">
          <template v-slot="scope">
            <iInput v-if="(scope.row.partCbdType == 1 || scope.row.partCbdType == 2) && !disabled" class="input-center" v-model="scope.row.machineName" :class="{ changeClass: originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId] ? (scope.row.machineName !== originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId].machineName) : false }"></iInput>
            <span v-else :class="{ changeClass: originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId] ? (scope.row.machineName !== originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId].machineName) : false }">{{ scope.row.machineName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="160" :render-header="h => h('span', { domProps: { innerHTML: `${ language('SHANGQIDAZHONGZHUANYONGSHEBEIFEI', '上汽大众专用设备费') }<br/>（RMB）` }})">
          <template v-slot="scope">
            <!-- <iInput v-if="(scope.row.partCbdType == 1 || scope.row.partCbdType == 2) && !disabled" class="input-center" v-model="scope.row.specialDeviceCost" :class="{ changeClass: originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId] ? (scope.row.specialDeviceCost !== originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId].specialDeviceCost) : false }" @input="handleInputByNumber($event, 'specialDeviceCost', scope.row, 2)"></iInput> -->
            <thousandsFilterInput v-if="(scope.row.partCbdType == 1 || scope.row.partCbdType == 2) && !disabled" class="input-center" :inputValue="scope.row.specialDeviceCost" :class="{ changeClass: originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId] ? (scope.row.specialDeviceCost !== originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId].specialDeviceCost) : false }" :numberProcessor="2" :handleArg="['specialDeviceCost', scope.row, 2]" @handleInput="handleInputByNumber"/>
            <span v-else :class="{ changeClass: originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId] ? (scope.row.specialDeviceCost !== originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId].specialDeviceCost) : false }" @input="handleInputByNumber($event, 'specialDeviceCost', scope.row, 2)">{{ floatFixNum(scope.row.specialDeviceCost) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="85" :render-header="h => h('span', { domProps: { innerHTML: `${ language('SHENGCHANJIEPAI', '生产节拍') }<br/>（Sec.）` }})">
          <template v-slot="scope">
            <iInput v-if="(scope.row.partCbdType == 1 || scope.row.partCbdType == 2) && !disabled" class="input-center" v-model="scope.row.taktTime" :class="{ changeClass: originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId] ? (scope.row.taktTime !== originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId].taktTime) : false }" @input="handleInputByNumber($event, 'taktTime', scope.row, 2, updateTaktTime)"></iInput>
            <span v-else :class="{ changeClass: originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId] ? (scope.row.taktTime !== originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId].taktTime) : false }">{{ scope.row.taktTime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="120" :render-header="h => h('span', { domProps: { innerHTML: `${ language('JIANSHUSHENGCHANJIEPAI', '件数/生产节拍') }<br/>（1..n）` }})">
          <template v-slot="scope">
            <iInput v-if="(scope.row.partCbdType == 1 || scope.row.partCbdType == 2) && !disabled" class="input-center" v-model="scope.row.taktTimeNumber" :class="{ changeClass: originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId] ? (scope.row.taktTimeNumber !== originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId].taktTimeNumber) : false }" @input="handleInputByNumber($event, 'taktTimeNumber', scope.row, 0, updateTaktTimeNumber)"></iInput>
            <span v-else :class="{ changeClass: originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId] ? (scope.row.taktTimeNumber !== originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId].taktTimeNumber) : false }">{{ scope.row.taktTimeNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="language('RENGONGCHENGBEN', '人工成本')" align="center">
          <el-table-column align="center" width="115" :render-header="h => h('span', { domProps: { innerHTML: `${ language('ZHIJIERENGONGFEILV', '直接人工费率') }<br/>(RMB/Hour)` }})">
            <template v-slot="scope">
              <iInput v-if="(scope.row.partCbdType == 1 || scope.row.partCbdType == 2) && !disabled" class="input-center" v-model="scope.row.directLaborRate" :class="{ changeClass: originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId] ? (scope.row.directLaborRate !== originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId].directLaborRate) : false }" @input="handleInputByNumber($event, 'directLaborRate', scope.row, 2, updateDirectLaborRate)"></iInput>
              <span v-else :class="{ changeClass: originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId] ? (scope.row.directLaborRate !== originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId].directLaborRate) : false }">{{ floatFixNum(scope.row.directLaborRate) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" width="112" :render-header="h => h('span', { domProps: { innerHTML: `${ language('ZHIJIERENGONGSHULIANG', '直接人工数量') }<br/>(0..n)` }})">
            <template v-slot="scope">
              <iInput v-if="(scope.row.partCbdType == 1 || scope.row.partCbdType == 2) && !disabled" class="input-center" v-model="scope.row.directLaborQuantity" :class="{ changeClass: originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId] ? (scope.row.directLaborQuantity !== originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId].directLaborQuantity) : false }" @input="handleInputByNumber($event, 'directLaborQuantity', scope.row, 0, updateDirectLaborQuantity)"></iInput>
              <span v-else :class="{ changeClass: originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId] ? (scope.row.directLaborQuantity !== originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId].directLaborQuantity) : false }">{{ scope.row.directLaborQuantity }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="language('SHEBEIFEI', '设备费')" align="center">
          <el-table-column align="center" width="125" :render-header="h => h('span', { domProps: { innerHTML: `${ language('SHEBEIFEILV', '设备费率') }<br/>（RMB/Hour）` }})">
            <template v-slot="scope">
              <iInput v-if="(scope.row.partCbdType == 1 || scope.row.partCbdType == 2) && !disabled" class="input-center" v-model="scope.row.deviceRate" :class="{ changeClass: originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId] ? (scope.row.deviceRate !== originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId].deviceRate) : false }" @input="handleInputByNumber($event, 'deviceRate', scope.row, 2, updateDeviceRate)"></iInput>
              <span v-else :class="{ changeClass: originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId] ? (scope.row.deviceRate !== originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId].deviceRate) : false }">{{ scope.row.deviceRate }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="language('JIANJIEZHIZAOCHENGBEN', '间接制造成本')" align="center">
          <el-table-column label="(%)" align="center" width="70">
            <template v-slot="scope">
              <iInput v-if="(scope.row.partCbdType == 1 || scope.row.partCbdType == 2) && !disabled" class="input-center" v-model="scope.row.indirectManufacturingRate" :class="{ changeClass: originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId] ? (scope.row.indirectManufacturingRate !== originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId].indirectManufacturingRate) : false }" @input="handleInputByNumber($event, 'indirectManufacturingRate', scope.row, 2, updateIndirectManufacturingRate)"></iInput>
              <span v-else :class="{ changeClass: originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId] ? (scope.row.indirectManufacturingRate !== originMap[scope.row.frontOriginProductionId ? scope.row.frontOriginProductionId : scope.row.originProductionId].indirectManufacturingRate) : false }">{{ floatFixNum(scope.row.indirectManufacturingRate) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="(RMB/Pc.)" align="center" width="90" prop="indirectManufacturingAmount">
            <template slot-scope="scope">{{ floatFixNum(scope.row.indirectManufacturingAmount) }}</template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" width="110" prop="laborCost" :render-header="h => h('span', { domProps: { innerHTML: `${ language('RENGONGCHENGBEN', '人工成本') }<br/>（RMB/Pc.）` }})">
          <template slot-scope="scope">{{ floatFixNum(scope.row.laborCost) }}</template>
        </el-table-column>
        <el-table-column align="center" min-width="110" prop="deviceCost" :render-header="h => h('span', { domProps: { innerHTML: `${ language('SHEBEICHENGBEN', '设备成本') }<br/>（RMB/Pc.）` }})">
          <template slot-scope="scope">{{ floatFixNum(scope.row.deviceCost) }}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>  
</template>

<script>
/* eslint-disable no-undef */

import { iButton, iInput, iMessage, iMessageBox } from "rise"
import iconFont from "../iconFont"
import { uuidv4, originRowClass, validateChangeKeysByManufacturingCost as validateChangeKeys } from "../data"
import { floatFixNum } from "../../../data"
import { cloneDeep } from "lodash"
import { handleInputByNumber } from "rise/web/quotationdetail/components/data"
import thousandsFilterInput from 'rise/web/aeko/quotationdetail/components/thousandsFilterInput'

export default {
  components: { iButton, iInput, iconFont,thousandsFilterInput },
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
    }
  },
  data() {
    return {
      tableListData: [],
      originMap: {},
      originTableListData: [],
      multipleSelection: [],
      validateChangeKeys,
      sumDataReal: {
        originLaborCostSum: null,
        newLaborCostSum: null,
        originDeviceCostSum: null,
        newDeviceCostSum: null,
        originIndirectManufacturingAmountSum: null,
        newIndirectManufacturingAmountSum: null,
        makeCostChange: null
      },
    }
  },
  created() {
    let index = 0
    this.originTableListData = this.tableListData.filter(item => {
      if (item.partCbdType == 0 || item.partCbdType == 1) {
        this.$set(this.originMap, item.id, item)
        this.$set(item, "index", `P${ ++index }`)
        return true
      } else 
        return false
    })
    // 组件可能是已填写数据后重新隐藏的，加载时计算一次
    this.allCompute()
  },
  methods: {
    floatFixNum,
    originRowClass,
    selectionChange(list) {
      this.multipleSelection = list
    },
    handleAddOriginData() {
      const data = {
        frontProductionId: uuidv4(),
        index: `P${ this.originTableListData.length + 1 }`,
        partCbdType: 1
      }

      this.tableListData.push(data)
      this.originTableListData.push(data)
      this.$set(this.originMap, data.frontProductionId, data)
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
          originIdSet.add(item.id || item.frontProductionId)
        }

        if (item.partCbdType == 2) {
          originIdSet.add(item.originProductionId || item.frontOriginProductionId)
        }
      })

      originIdSet.forEach(id => {
        if (!this.originMap[id]) return

        const originData = this.originMap[id]
        const data = cloneDeep(originData)
        data.id = ""
        data.index = ""
        data.partCbdType = 2

        if (originData.partCbdType == 0) {
          data.originProductionId = originData.id
        }

        if (originData.partCbdType == 1) {
          data.frontOriginProductionId = originData.id ? originData.id : originData.frontProductionId
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
      
        if ((item.partCbdType == 2 && this.validateChangeKeys.some(key => item[key] !== this.originMap[item.frontOriginProductionId ? item.frontOriginProductionId : item.originProductionId][key])) || (item.partCbdType == 1 && this.validateChangeKeys.some(key => item[key] || item[key] === 0))) {
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
            this.originTableListData.splice(this.originTableListData.indexOf(this.originMap[item.frontProductionId]), 1)
            delete this.originMap[item.frontProductionId]
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
      if (originData.id) return originData.id === newData.originProductionId || originData.id === newData.frontOriginProductionId
      if (originData.frontProductionId) return originData.frontProductionId === newData.originProductionId || originData.frontProductionId === newData.frontOriginProductionId

      return false
    },
    updateOriginDataIndex() {
      this.originTableListData.forEach((item, index) => this.$set(item, "index", `P${ ++index }`))
    },
    handleInputByNumber,
    updateTaktTime(value, key, row) {
      this.computeIndirectManufacturingAmount(value, key, row)
      this.computeLaborCost(value, key, row)
      this.computeDeviceCost(value, key, row)
    },
    updateTaktTimeNumber(value, key, row) {
      this.computeIndirectManufacturingAmount(value, key, row)
      this.computeLaborCost(value, key, row)
      this.computeDeviceCost(value, key, row)
    },
    updateDirectLaborRate(value, key, row) {
      this.computeIndirectManufacturingAmount(value, key, row)
      this.computeLaborCost(value, key, row)
    },
    updateDirectLaborQuantity(value, key, row) {
      this.computeIndirectManufacturingAmount(value, key, row)
      this.computeLaborCost(value, key, row)
    },
    updateDeviceRate(value, key, row) {
      this.computeIndirectManufacturingAmount(value, key, row)
      this.computeDeviceCost(value, key, row)
    },
    updateIndirectManufacturingRate(value, key, row) {
      this.computeIndirectManufacturingAmount(value, key, row)
      this.computeLaborCost(value, key, row)
      this.computeDeviceCost(value, key, row)
    },
    // 计算间接制造成本
    computeIndirectManufacturingAmount(originValue, originKey, row) {
      let indirectManufacturingAmount = null
      if((row.deviceRate||row.deviceRate===0)&&(row.directLaborRate||row.directLaborRate===0)&&(row.directLaborQuantity||row.directLaborQuantity===0)){
        indirectManufacturingAmount = math.chain(
          math.add(
            math.bignumber(row.deviceRate || 0),
            math.multiply(
              math.bignumber(row.directLaborRate || 0),
              math.bignumber(row.directLaborQuantity || 0)
            )
          )
        )
        .multiply(math.bignumber(row.taktTime || 0))
        .divide(3600)
        .divide(+row.taktTimeNumber ? math.bignumber(row.taktTimeNumber) : 1)
        .multiply(
          math.divide(math.bignumber(row.indirectManufacturingRate || 0), 100)
        )
        .done()
        .toFixed(2)
      }

      this.$set(row, "indirectManufacturingAmount", indirectManufacturingAmount)
    
      this.computeMakeCost()
    },
    // 计算人工成本
    computeLaborCost(originValue, originKey, row) {
      let laborCost = null
      if((row.directLaborRate || row.directLaborRate===0)&&(row.directLaborQuantity || row.directLaborQuantity===0)&&(row.taktTime || row.taktTime===0)&&
      // (row.taktTimeNumber || row.taktTimeNumber===0)&&
      (row.indirectManufacturingRate || row.indirectManufacturingRate===0)){
        laborCost = math.chain(math.bignumber(row.directLaborRate || 0))
        .multiply(math.bignumber(row.directLaborQuantity || 0))
        .multiply(math.bignumber(row.taktTime || 0))
        .divide(3600)
        .divide(+row.taktTimeNumber ? math.bignumber(row.taktTimeNumber) : 1)
        .multiply(
          math.add(
            1,
            math.divide(math.bignumber(row.indirectManufacturingRate || 0), 100)
          )
        )
        .done()
        .toFixed(2)
      }

      this.$set(row, "laborCost", laborCost)
    
      this.computeLaborCostSum(laborCost, "laborCost", row)
    },
    // 计算设备成本
    computeDeviceCost(originValue, originKey, row) {
      let deviceCost = null
      if((row.deviceRate || row.deviceRate===0)&&(row.taktTime || row.taktTime===0)&&
      // (row.taktTimeNumber || row.taktTimeNumber===0)&&
      (row.indirectManufacturingRate || row.indirectManufacturingRate===0)){
        deviceCost = math.chain(math.bignumber(row.deviceRate || 0))
        .multiply(math.bignumber(row.taktTime || 0))
        .divide(3600)
        .divide(+row.taktTimeNumber ? math.bignumber(row.taktTimeNumber) : 1)
        .multiply(
          math.add(
            1,
            math.divide(math.bignumber(row.indirectManufacturingRate || 0), 100)
          )
        )
        .done()
        .toFixed(2)
      }
      
      this.$set(row, "deviceCost", deviceCost)

      this.computeDeviceCostSum(deviceCost, "deviceCost", row)
    },
    // 计算新、原零件人工成本变动值
    computeLaborCostSum(originValue, originKey, row) {
      const originTableListData = []
      const newTableListData = []

      const tableListData = this.tableListData
      tableListData.forEach(item => {
        if (item.partCbdType == 0 || item.partCbdType == 1) { // 原零件
          originTableListData.push(item)
        }

        if (item.partCbdType == 2) {  // 新零件
          newTableListData.push(item)
        }
      })
      // 原零件 总人工成本
      this.sumDataReal.originLaborCostSum = originTableListData.reduce((acc, cur) => {
        if(cur.laborCost||cur.laborCost===0){
          return math.bignumber(math.add(acc||0, cur.laborCost))
        }else{
          return acc
        }
      }, null)
      this.sumDataReal.originLaborCostSum = this.sumDataReal.originLaborCostSum&&this.sumDataReal.originLaborCostSum.toFixed(2)
      // 新零件 总人工成本
      this.sumDataReal.newLaborCostSum = newTableListData.reduce((acc, cur) => {
        if(cur.laborCost||cur.laborCost===0){
          return math.bignumber(math.add(acc||0, cur.laborCost))
        }else{
          return acc
        }
      }, null)
      this.sumDataReal.newLaborCostSum = this.sumDataReal.newLaborCostSum&&this.sumDataReal.newLaborCostSum.toFixed(2)

      this.updateSumData()
      this.computeMakeCost()
    },
    // 计算新、原零件设备成本变动值
    computeDeviceCostSum(originValue, originKey, row) {
      const originTableListData = []
      const newTableListData = []

      const tableListData = this.tableListData
      tableListData.forEach(item => {
        if (item.partCbdType == 0 || item.partCbdType == 1) {
          originTableListData.push(item)
        }

        if (item.partCbdType == 2) {
          newTableListData.push(item)
        }
      })

      // 原零件 总设备成本
      this.sumDataReal.originDeviceCostSum = originTableListData.reduce((acc, cur) => {
        if(cur.deviceCost||cur.deviceCost===0){
          return math.bignumber(math.add(acc||0, cur.deviceCost))
        }else{
          return acc
        }
      }, null)
      this.sumDataReal.originDeviceCostSum = this.sumDataReal.originDeviceCostSum&&this.sumDataReal.originDeviceCostSum.toFixed(2)
      // 新零件 总设备成本
      this.sumDataReal.newDeviceCostSum = newTableListData.reduce((acc, cur) => {
        if(cur.deviceCost||cur.deviceCost===0){
          return math.bignumber(math.add(acc||0, cur.deviceCost))
        }else{
          return acc
        }
      }, null)
      this.sumDataReal.newDeviceCostSum = this.sumDataReal.newDeviceCostSum&&this.sumDataReal.newDeviceCostSum.toFixed(2)

      this.updateSumData()
      this.computeMakeCost()
    },
    // 未使用
    computeIndirectManufacturingAmountSum(originValue, originKey, row) {
      const originTableListData = []
      const newTableListData = []
      
      const changeList = []
      this.tableListData.forEach(item => {
        if (item.partCbdType == 2) {
          if (this.originMap[item.frontOriginProductionId ? item.frontOriginProductionId : item.originProductionId]) {
            changeList.push(this.originMap[item.frontOriginProductionId ? item.frontOriginProductionId : item.originProductionId])
          }

          changeList.push(item)
        }
      })

      changeList.forEach(item => {
        if (item.partCbdType == 0 || item.partCbdType == 1) {
          originTableListData.push(item)
        }

        if (item.partCbdType == 2) {
          newTableListData.push(item)
        }
      })

      this.sumDataReal.originIndirectManufacturingAmountSum = originTableListData.reduce((acc, cur) => {
        if(cur.indirectManufacturingAmount||cur.indirectManufacturingAmount===0){
          return math.bignumber(math.add(acc||0, cur.indirectManufacturingAmount))
        }else{
          return acc
        }
      }, null)
      this.sumDataReal.originIndirectManufacturingAmountSum = this.sumDataReal.originIndirectManufacturingAmountSum&&this.sumDataReal.originIndirectManufacturingAmountSum.toFixed(2)
      this.sumDataReal.newIndirectManufacturingAmountSum = newTableListData.reduce((acc, cur) => {
        if(cur.indirectManufacturingAmount||cur.indirectManufacturingAmount===0){
          return math.bignumber(math.add(acc||0, cur.indirectManufacturingAmount))
        }else{
          return acc
        }
      }, null)
      this.sumDataReal.newIndirectManufacturingAmountSum = this.sumDataReal.newIndirectManufacturingAmountSum&&this.sumDataReal.newIndirectManufacturingAmountSum.toFixed(2)

      this.updateSumData()
    },
    // 计算新、原零件成本变动值汇总
    computeMakeCost(originValue, originKey, row) {
      if(this.sumDataReal.newLaborCostSum!=null&&this.sumDataReal.originLaborCostSum!=null&&this.sumDataReal.newDeviceCostSum!=null&&this.sumDataReal.originDeviceCostSum!=null){
        this.sumDataReal.makeCostChange = math.add(
          math.subtract(math.bignumber(this.sumDataReal.newLaborCostSum), math.bignumber(this.sumDataReal.originLaborCostSum)),
          math.subtract(math.bignumber(this.sumDataReal.newDeviceCostSum), math.bignumber(this.sumDataReal.originDeviceCostSum))
        ).toFixed(2)
      }else{
        this.sumDataReal.makeCostChange = null
      }
      
      this.updateSumData()
    },
    // 更新父组件sumData，修改表格数据
    updateSumData(data) {
      const sumData = {}
      Object.keys(this.sumDataReal).forEach(key => sumData[key] = this.sumDataReal[key])

      this.$emit("update:sumData", sumData)
    },
    allCompute() {
      if(this.tableListData.length){
        this.tableListData.forEach(item => {
          this.computeIndirectManufacturingAmount("", "", item) // 间接制造成本
          this.computeLaborCost("", "", item) // 人工成本
          this.computeDeviceCost("", "", item)  // 设备成本
        })
      }else{
        Object.keys(this.sumDataReal).forEach(key => this.sumDataReal[key] = null)
        this.$emit("update:sumData", this.sumDataReal)
      }
    }
  },
  beforeDestroy(){
    // 隐藏显示时,清空变动值
    Object.keys(this.sumDataReal).forEach(key => this.sumDataReal[key] = null)
    this.$emit("update:sumData", this.sumDataReal)
  }
}
</script>

<style lang="scss" scoped>
.manufacturingCost {
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
  }

  .table {
    .manufacturingMethodColumn {
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