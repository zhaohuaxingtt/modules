<!--
 * @Author: yuszhou
 * @Date: 2021-04-23 15:34:10
 * @LastEditTime: 2021-10-28 11:56:47
 * @LastEditors: Please set LastEditors
 * @Description: 报价成本汇总界面          
                  1）对于用户来说，在报价详情页通用的功能键包括“保存”、“下载”和“上传报价”
                  2）用户点击“保存”按钮，则保存当前页面已经编辑和输入的所有信息
                  3）若用户在未点击“保存”的情况下点击“下载”按钮，则将报价模板下载到本地；若用户在点击了“保存”之后再点击“下载”按钮，则最后一次保存后的信息内容会随着模板一起下载到本地
                  4）若用户点击“上传报价”按钮，则是将使用模板在本地填写的报价信息上传到系统，系统界面中的信息刷新成本地填写的相关报价信息
                  5）若采购员想帮助供应商进行代报价，则需要先点击“代供应商报价”按钮，才可以对页面进行编辑操作
 * @FilePath: \front-modules\web\quotationdetail\components\costsummary\index.vue
-->

<template>
  <div v-if="isSkd">
    <skdCostSummary ref="skdCostSummary" :partInfo="partInfo" :disabled="disabled" />
  </div>
  <div v-else>
    <div v-if="isSkdLc" class="margin-bottom20">
      <skdCostSummary ref="skdCostSummary" :partInfo="partInfo" :disabled="disabled" showTitle />
    </div>
    <!---partInfo.partProjectType === partProjTypes.DBLINGJIAN || partInfo.partProjectType === partProjTypes.DBYICHIXINGCAIGOU----->
    <div v-if="partInfo.partProjectType === partProjTypes.DBLINGJIAN || partInfo.partProjectType === partProjTypes.DBYICHIXINGCAIGOU || partInfo.priceStatus == 'DB'">
      <quotationAnalysis :disabled="disabled || isOriginprice" :partInfo="partInfo" :dbDetailList="dbDetailList" />
    </div>
    <div class="cost" v-else>
      <!--------------------------------------------------------->
      <!----------------------百分比模块-------------------------->
      <!--------------------------------------------------------->
      <persentComponents ref='components' :cbdlist='cbdlist' :isSteel="isSteel" :roundIsOnlineBidding='roundIsOnlineBidding' :quotationId='partInfo.quotationId' :tableData='topTableData' :disabled='disabled || isOriginprice' :allTableData='allTableData' :partType="partInfo.partType" :partProjectType="partInfo.partProjectType" :showTitle="isSkdLc" :isAutoCal.sync="isAutoCal"></persentComponents>
      <!--------------------------------------------------------->
      <!----------------------2.1 原材料/散件--------------------->
      <!--------------------------------------------------------->
      <tableTemlate 
        v-show='allTableData.level == 2' 
        :selection="!disabled && !isOriginprice" 
        :index='true' 
        pageNationReq='queryRawMaterialDTO' 
        pageNationRes='rawMaterial' 
        :notEdit='disabled || isOriginprice' 
        :tableData='allTableData.rawMaterial.records' 
        class="margin-top20" 
        :title="`${allTableData.level}.1 ${$t('LK_YUANCLSJ')}`" 
        :tableTile='titleYcl' 
        :iPagination='disabled || isOriginprice' 
        tableIndexString='C'
        @handleSelectChange="handleSelectChangeByRawMaterial"
        @handleSelectionChange="handleSelectionChangeByRawMaterial"
        @handleInput="handleInputByRawMaterialL2"
        @handleAutocompleteSelect="handleAutocompleteSelectByRawMaterial">
        <template #header-control>
          <div v-if="!disabled && !isOriginprice">
            <iButton @click="handleAddByRawMaterial">{{ $t("LK_TIANJIAHANG") }}</iButton>
            <iButton @click="handleDelByRawMaterial">{{ $t("LK_SHANCHUHANG") }}</iButton>
          </div>
        </template>
      </tableTemlate>
      <!--------------------------------------------------------->
      <!----------------------3.1 原材料/散件--------------------->
      <!--------------------------------------------------------->
      <tableTemlate 
        v-if='allTableData.level == 3'
        :selection="!disabled && !isOriginprice" 
        :index='true'
        pageNationReq='queryRawMaterialDTO' 
        pageNationRes='rawMaterial' 
        :notEdit='disabled || isOriginprice'
        :title="`${ allTableData.level }.1 ${$t('LK_YUANCLSJ')}`" 
        class="margin-top20"
        :tableTile='titleYclByL3'
        :tableData='allTableData.rawMaterial.records'
        tableIndexString='C'
        @handleSelectChange="handleSelectChangeByRawMaterial"
        @handleSelectionChange="handleSelectionChangeByRawMaterial"
        @handleInput="handleInputByRawMaterialL3"
        @handleAutocompleteSelect="handleAutocompleteSelectByRawMaterial">>
        <template #header-control>
          <div v-if="!disabled && !isOriginprice">
            <iButton @click="handleAddByRawMaterial">{{ $t("LK_TIANJIAHANG") }}</iButton>
            <iButton @click="handleDelByRawMaterial">{{ $t("LK_SHANCHUHANG") }}</iButton>
          </div>
        </template>
      </tableTemlate>
      <!--------------------------------------------------------->
      <!----------------------2.2 制造成本--------------------->
      <!--------------------------------------------------------->
      <tableTemlate
        v-show='allTableData.level == 2'
        :selection="!disabled && !isOriginprice"
        :index='true' 
        pageNationReq='queryMakeCostDTO' 
        pageNationRes='makeCost' 
        :notEdit='disabled || isOriginprice' 
        :tableData='allTableData.makeCost.records' 
        class="margin-top20"
        :title="`${allTableData.level}.2 ${$t('LK_ZHIZHAOCB')}`" 
        :tableTile='titleCbzz' 
        :iPagination='disabled || isOriginprice' 
        tableIndexString='P'
        @handleSelectionChange="handleSelectionChangeByMakeCost"
        @handleInput="handleInputByMakeCostL2">
        <template #header-control>
          <div v-if="!disabled && !isOriginprice">
            <iButton @click="handleAddByMakeCost">{{ $t("LK_TIANJIAHANG") }}</iButton>
            <iButton @click="handleDelByMakeCost">{{ $t("LK_SHANCHUHANG") }}</iButton>
          </div>
        </template>
      </tableTemlate>
      <!--------------------------------------------------------->
      <!----------------------3.2 制造成本--------------------->
      <!--------------------------------------------------------->
      <tableTemlate 
        v-if='allTableData.level == 3'
        :selection="!disabled && !isOriginprice" 
        :index='true'
        pageNationReq='queryMakeCostDTO' 
        pageNationRes='makeCost'
        :notEdit='disabled || isOriginprice'
        :title="`${ allTableData.level }.2 ${$t('LK_ZHIZHAOCB')}`" 
        class="margin-top20"
        :tableTile='titleCbzzByL3'
        :tableData='allTableData.makeCost.records'
        tableIndexString='P'
        @handleSelectionChange="handleSelectionChangeByMakeCost"
        @handleInput="handleInputByMakeCostL3">
        <template #header-control>
          <div v-if="!disabled && !isOriginprice">
            <iButton @click="handleAddByMakeCost">{{ $t("LK_TIANJIAHANG") }}</iButton>
            <iButton @click="handleDelByMakeCost">{{ $t("LK_SHANCHUHANG") }}</iButton>
          </div>
        </template>
      </tableTemlate>
      <!--------------------------------------------------------->
      <!-------2.2 报废成本 管理费 其他费用 利润--------------------->
      <!--------------------------------------------------------->
      <el-row class="row" v-show='allTableData.level == 2'>
        <el-col class="col" :span='12'>
          <tableTemlate :notEdit='disabled || isOriginprice' :tableData='allTableData.discardCost' class="margin-top20" :index='true' :title="`${allTableData.level}.3 ${$t('LK_BAOFEICHENGBEN')}`" :tableTile='titlebfcb' tableIndexString='S' @handleInput="handleInputByDiscardCostL2"></tableTemlate>
        </el-col>
        <el-col class="col" :span='12'>
          <tableTemlate :notEdit='disabled || isOriginprice' :tableData='allTableData.manageFee' class="margin-top20" :index='true' :title="`${allTableData.level}.4 ${$t('LK_GUANLIFEI')}`" :tableTile='titleglf' tableIndexString='O' @handleInput="handleInputByManageFeeL2"></tableTemlate>
        </el-col>
      </el-row>
      <el-row class="row" v-show='allTableData.level == 2'>
        <el-col class="col" :span='12'>
          <tableTemlate :notEdit='disabled || isOriginprice' :tableData='allTableData.otherFee' class="margin-top20" :index='true' :title="`${allTableData.level}.5 ${$t('LK_QITAFEIYONG')}`" :tableTile='titleqtfy' tableIndexString='A'></tableTemlate>
        </el-col>
        <el-col class="col" :span='12'>
          <tableTemlate :notEdit='disabled || isOriginprice' :tableData='allTableData.profit' class="margin-top20" :index='true' :title="`${allTableData.level}.6 ${$t('LK_LIRUN')}`" :tableTile='titlelr' tableIndexString='P' @handleInput="handleInputByProfitL2"></tableTemlate>
        </el-col>
      </el-row>
      <!--------------------------------------------------------->
      <!-------3.3 报废成本 管理费 其他费用 利润--------------------->
      <!--------------------------------------------------------->
      <el-row class="row" v-show='allTableData.level == 3'>
        <el-col class="col" :span='12'>
          <tableTemlate :notEdit='disabled || isOriginprice' :tableData='allTableData.discardCost' class="margin-top20" :index='true' :title="`${allTableData.level}.3 ${$t('LK_BAOFEICHENGBEN')}`" :tableTile='titlebfcbByL3' tableIndexString='S'></tableTemlate>
        </el-col>
        <el-col class="col" :span='12'>
          <tableTemlate :notEdit='disabled || isOriginprice' :tableData='allTableData.manageFee' class="margin-top20" :index='true' :title="`${allTableData.level}.4 ${$t('LK_GUANLIFEI')}`" :tableTile='titleglfByL3' tableIndexString='O' @handleInput="handleInputByManageFeeL3"></tableTemlate>
        </el-col>
      </el-row>
      <el-row class="row" v-show='allTableData.level == 3'>
        <el-col class="col" :span='12'>
          <tableTemlate :notEdit='disabled || isOriginprice' :tableData='allTableData.otherFee' class="margin-top20" :index='true' :title="`${allTableData.level}.5 ${$t('LK_QITAFEIYONG')}`" :tableTile='titleqtfyByL3' :filterProps="{ itemType: itemTypeFilter }" tableIndexString='A'></tableTemlate>
        </el-col>
        <el-col class="col" :span='12'>
          <tableTemlate :notEdit='disabled || isOriginprice' :tableData='allTableData.profit' class="margin-top20" :index='true' :title="`${allTableData.level}.6 ${$t('LK_LIRUN')}`" :tableTile='titlelrByL3' tableIndexString='P' @handleInput="handleInputByProfitL3"></tableTemlate>
        </el-col>
      </el-row>
      <!--------------------------------------------------------->
      <!----------------------2.2 制造成本------------------------>
      <!--------------------------------------------------------->
      <tableTemlate class="margin-top20" :cbdSelect='cbdSelect' pageNationReq='cbd' pageNationRes='cbd' title="CBD" selection :tableData='tableDataCbd' :tableTile='titleCBD' iPagination>
        <template #header-control>
          <iButton @click="downLoadFile">{{$t('LK_XIAZAI')}}</iButton>
          <iButton v-if='!disabled && !isOriginprice' @click="disabel">{{$t('delete')}}</iButton>
        </template>
      </tableTemlate>
    </div>
  </div>
</template>
<script>
/* eslint-disable no-undef */

import persentComponents from './components/timeAndlevTabel'
import tableTemlate from './components/tableTemlate'
import {persentDatalist,titleYcl,titleCbzz,titlebfcb,titleglf,titleqtfy,titlelr,titleCBD,allpagefrom,needContactData,Aprice,getAallPrice,getPersent,cbdlist, titleYclByL3, titleCbzzByL3, titlebfcbByL3, titleglfByL3, titleqtfyByL3, titlelrByL3} from './components/data'
import {iButton,iMessage} from 'rise'
import {getCostSummary,packageTransport} from '@/api/rfqManageMent/rfqDetail'
import {postCostSummary,savePackageTransport,getCostSummaryDB,updateCostSummaryDB,getCategoryDetail} from '@/api/rfqManageMent/quotationdetail'
import {getFiles,deleteFiles,downloadUdFile} from '@/api/file'
import {selectDictByKeys} from '@/api/dictionary'
import quotationAnalysis from './components/quotationAnalysis'
import {partProjTypes} from '@/config'
import {cloneDeep} from 'lodash'
import skdCostSummary from "../skdCostSummary"
import { priceStatusMixin } from "../mixins"

export default{
  components:{persentComponents,tableTemlate,iButton,quotationAnalysis, skdCostSummary},
  mixins: [ priceStatusMixin ],
  props:{
    //父组件中的值
    partInfo:{
      type:Object,
      default:()=>{
        return {
          rfqId:'',
          fsNum:'',
          cbdLevel:2,
          quotationId:'',
          partType: '' // 用于标识零件类型，暂定，根据后端具体返回而定
        }
      }
    },
    disabled:{
      type:Boolean,
      default:false
    },
    isSteel: {
      type: Boolean,
      default: false
    },
    isOriginprice: {
      type:Boolean,
      default:false
    },
    roundIsOnlineBidding:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return {
      // 零件项目类型
      partProjTypes,
      cbdlist:[],
      persentDatalist:persentDatalist,
      Aprice:Aprice,
      needContactData:needContactData,
      titleYcl:[],
      titleCbzz:titleCbzz,
      titlebfcb:titlebfcb,
      titleglf:titleglf,
      titleqtfy:titleqtfy,
      titlelr:titlelr,
      titleCBD:titleCBD,
      //界面请求数据key
      allpagefrom:allpagefrom,
      //renderData
      allTableData:{
        level:'',
        startProductDate:'',
        editFlag:true,
        discardCost:[],
        makeCost:{
          records:[],
          total:1
        },
        manageFee:[],
        otherFee:[],
        profit:[],
        rawMaterial:{
          records:[],
          total:1
        }
      },
      topTableData:{
        persent:[],
        tableData:[]
      },
      tableDataCbd:[],
      cbdSelect:{
        list:[]
      },
      dbDetailList: [],
      tableDataCbdModel:{},
      titleYclByL3,
      titleYclByL3Status: false,
      titleCbzzByL3,
      titlebfcbByL3,
      titleglfByL3,
      titleqtfyByL3,
      titlelrByL3,

      multipleSelectionByRawMaterial: [],
      multipleSelectionByMakeCost: [],

      materialSummaryL2: 0,
      materialSummaryL2ByFalse: 0,
      laborCostSummaryL2: 0,
      deviceCostSummaryL2: 0,
      scrapSummaryL2: 0,
      sourceResponseData: {},
      initData: true,
      count: 0,
      summaryData: {},
      isAutoCal: false,

      materialOptions: [],
      productionProcessOptions: [],
      materialDescribeOptions: [],
      componentDescribeOptions: []
    }
  },
  watch:{
    'topTableData.tableData':{
      handler:function(val){
        if (this.count >= 1) {
          this.initData = false
        }

        try {
          const total = getAallPrice(this.Aprice,val[0])
          this.topTableData.persent = getPersent(total,this.Aprice,val[0])
        } catch (error) {
          this.topTableData.persent = []
        }

        this.count += 1
      },
      deep:true
    },
    // allTableData: {
    //   handler(table) {
    //     if (table.level === 3) {
    //       if (table.rawMaterial && Array.isArray(table.rawMaterial.records)) {
    //         table.rawMaterial.records.forEach(item => {
    //           this.$set(item, "directMaterialCost", 9999)
    //         })
    //       }
    //     }
    //   },
    //   deep: true
    // }
  },
  provide(){
    return {
      vm:this
    }
  },
  inject: ["updateCbdLevel"],
  created(){
    this.selectDictByKeys()
  },
  computed: {
    // eslint-disable-next-line no-undef
    ...Vuex.mapState({
      userInfo: state => state.permission.userInfo,
    })
  },
  methods:{    
    translateDicKeyCodeToName(list){
      if(!list) return
      list.forEach(items => {
        items['value'] = items.name
      })
      return list
    },
    /**
     * @description: 获取用户字典 
     * @param {*}
     * @return {*}
     */
    selectDictByKeys(){
      selectDictByKeys([
        { keys: "ORIGIN_COUNTRY" },
        { keys: "CATEGORY_CBD_SETTING" },
      ]).then(res=>{
        if(res.code == 200 && res.data) {
          let originCountryOptions = []
          let materialOptions = []
          
          Object.keys(res.data).forEach(key => {
            switch(key) {
              case "ORIGIN_COUNTRY":
                originCountryOptions = res.data.ORIGIN_COUNTRY
                break
              case "CATEGORY_CBD_SETTING":
                if (Array.isArray(res.data.CATEGORY_CBD_SETTING)) {
                  res.data.CATEGORY_CBD_SETTING.forEach(item => {
                    if (item.code === "MATERIAL" || item.code === "COMPONENT") {
                      materialOptions.push({ label: item.describe, value: item.code })
                    }
                  })
                }
                break
              default:
            }
          })

          this.titleYcl = titleYcl(this.translateDicKeyCodeToName(originCountryOptions), materialOptions)
          this.titleYclByL3 = titleYclByL3(this.translateDicKeyCodeToName(originCountryOptions), materialOptions)
        }else{
          this.titleYcl = titleYcl()
          this.titleYclByL3 = titleYclByL3()
        }
      }).catch(err=>{
        iMessage.error(err.desZh)
      })
    },
    /**
     * @description: cbd文件下载。 
     * @param {*}
     * @return {*}
     */    
    downLoadFile(){
      // const fileList = {
      //   applicationName:'rise',
      //   fileList:[]
      // }
      // this.cbdSelect.list.forEach(res=>{
      //   fileList.fileList.push(res.fileName)
      // })
      if(this.cbdSelect.list.length == 0) return iMessage.warn('请选择cbd文件')
      // downloadFile(fileList).then(res=>{
      //   if(res.code == 200){
      //     iMessage.success('操作成功！')
      //   }else{
      //     iMessage.error(res.desZh)
      //   }
      // }).catch(err=>{
      //   iMessage.error(err.desZh)
      // })
      downloadUdFile(this.cbdSelect.list.map(item => item.uploadId))
    },
    /**
     * @description: 删除
     * @param {*}
     * @return {*}
     */    
    disabel(){
      if(this.cbdSelect.list.length == 0) return iMessage.warn('请选择cbd文件')
      deleteFiles(this.cbdSelect.list.map(r=>r.id)).then(res=>{
        if(res.code == 200){
          iMessage.success('操作成功!')
          this.findFiles()
        }else{
          iMessage.error(res.desZh)
        }
      }).catch(err=>{
        iMessage.error(err.desZh)
      })
    },
    /**
     * @description: 如果CBD层级初始化为2 则不能选择1 以此类推
     * @param {*}
     * @return {*}
     */    
    translateCbdList(lv){
      const data = JSON.parse(JSON.stringify(cbdlist))
      data.forEach(element => {
        if(element.value >= lv){
          this.cbdlist.push(element)  
        }
      })
    },
    /**
     * @description: string类型的数字字段转换为 => number
     * @param {*}
     * @return {*}
     */    
    translateDataForServerce(data){
      for(let i in data){
        if(Object.prototype.toString.call(data[i]) == '[object Array]'){
          data[i].forEach(items => {
            items = this.translateDataForServerce(items)
          })
        }else{
          // if(/\d$/.test(data[i])){
          //   // eslint-disable-next-line no-debugger
          //   data[i] = Number(data[i]);
          // }
        }
      }
      return data
    },
    validateByL2(form = {}) {
      if (Array.isArray(form.levelTwoSumDTO.rawMaterial) && form.levelTwoSumDTO.rawMaterial.length > 0) {
        const keys = []
        this.titleYcl.forEach(item => {
          if (item.type === "input" || item.type === "select") {
            keys.push(item.props)
          }

          if (Array.isArray(item.list) && item.list) {
            item.list.forEach(subItem => {
              if (subItem.type === "input" || subItem.type === "select") {
                keys.push(subItem.props)
              }
            })
          }
        })
        
        const rawMaterialFlag = form.levelTwoSumDTO.rawMaterial.every(item => {
          const flag = keys.every(key => {
            if (!(!!item[key] || item[key] === 0 || item[key] === false)) {
              iMessage.warn(this.$t("QINGTIANXIEWANZHENGYUANCAILIAOSANJIAN"))
              return false
            } else {
              return true
            }
          })

          return flag
        })
        if (!rawMaterialFlag) return false
      }

      if (Array.isArray(form.levelTwoSumDTO.makeCost) && form.levelTwoSumDTO.makeCost.length > 0) {
        const keys = []
        this.titleCbzz.forEach(item => {
          if (item.type === "input" || item.type === "select") {
            keys.push(item.props)
          }

          if (Array.isArray(item.list) && item.list) {
            item.list.forEach(subItem => {
              if (subItem.type === "input" || subItem.type === "select") {
                keys.push(subItem.props)
              }
            })
          }
        })
        
        const makeCostFlag = form.levelTwoSumDTO.makeCost.every(item => {
          const flag = keys.every(key => {
            if (!(!!item[key] || item[key] === 0 || item[key] === false)) {
              iMessage.warn(this.$t("QINGTIANXIEWANZHENGZHIZAOCHENGBEN"))
              return false
            } else {
              return true
            }
          })

          return flag
        })
        if (!makeCostFlag) return false
      }

      if (Array.isArray(form.levelTwoSumDTO.discardCost) && form.levelTwoSumDTO.discardCost.length > 0) {
        const keys = []
        this.titlebfcb.forEach(item => {
          if (item.type === "input" || item.type === "select") {
            keys.push(item.props)
          }

          if (Array.isArray(item.list) && item.list) {
            item.list.forEach(subItem => {
              if (subItem.type === "input" || subItem.type === "select") {
                keys.push(subItem.props)
              }
            })
          }
        })
        
        const discardCostFlag = form.levelTwoSumDTO.discardCost.every(item => {
          const flag = keys.every(key => {
            if (!(!!item[key] || item[key] === 0 || item[key] === false)) {
              iMessage.warn(this.$t("QINGTIANXIEWANZHENGBAOFEICHENGBEN"))
              return false
            } else {
              return true
            }
          })

          return flag
        })
        if (!discardCostFlag) return false
      }

      if (Array.isArray(form.levelTwoSumDTO.manageFee) && form.levelTwoSumDTO.manageFee.length > 0) {
        const keys = []
        this.titleglf.forEach(item => {
          if (item.type === "input" || item.type === "select") {
            keys.push(item.props)
          }

          if (Array.isArray(item.list) && item.list) {
            item.list.forEach(subItem => {
              if (subItem.type === "input" || subItem.type === "select") {
                keys.push(subItem.props)
              }
            })
          }
        })
        
        const manageFeeFlag = form.levelTwoSumDTO.manageFee.every(item => {
          const flag = keys.every(key => {
            if (!(!!item[key] || item[key] === 0 || item[key] === false)) {
              iMessage.warn(this.$t("QINGTIANXIEWANZHENGGUANLIFEI"))
              return false
            } else {
              return true
            }
          })

          return flag
        })
        if (!manageFeeFlag) return false
      }

      if (Array.isArray(form.levelTwoSumDTO.profit) && form.levelTwoSumDTO.profit.length > 0) {
        const keys = []
        this.titlelr.forEach(item => {
          if (item.type === "input" || item.type === "select") {
            keys.push(item.props)
          }

          if (Array.isArray(item.list) && item.list) {
            item.list.forEach(subItem => {
              if (subItem.type === "input" || subItem.type === "select") {
                keys.push(subItem.props)
              }
            })
          }
        })
        
        const profitFlag = form.levelTwoSumDTO.profit.every(item => {
          const flag = keys.every(key => {
            if (!(!!item[key] || item[key] === 0 || item[key] === false)) {
              iMessage.warn(this.$t("QINGTIANXIEWANZHENLIRUN"))
              return false
            } else {
              return true
            }
          })

          return flag
        })
        if (!profitFlag) return false
      }

      return true
    },
    validateByL3(form = {}) {
      if (Array.isArray(form.levelThreeSumDTO.rawMaterial) && form.levelThreeSumDTO.rawMaterial.length > 0) {
        const keys = []
        this.titleYclByL3.forEach(item => {
          if (item.type === "input" || item.type === "select") {
            keys.push(item.props)
          }

          if (Array.isArray(item.list) && item.list) {
            item.list.forEach(subItem => {
              if (subItem.type === "input" || subItem.type === "select") {
                keys.push(subItem.props)
              }
            })
          }
        })
        
        const rawMaterialFlag = form.levelThreeSumDTO.rawMaterial.every(item => {
          const flag = keys.every(key => {
            if (!(!!item[key] || item[key] === 0 || item[key] === false)) {
              iMessage.warn(this.$t("QINGTIANXIEWANZHENGYUANCAILIAOSANJIANCHENGBEN"))
              return false
            } else {
              return true
            }
          })

          return flag
        })
        if (!rawMaterialFlag) return false
      }

      if (Array.isArray(form.levelThreeSumDTO.makeCost) && form.levelThreeSumDTO.makeCost.length > 0) {
        const keys = []
        this.titleCbzzByL3.forEach(item => {
          if (item.type === "input" || item.type === "select") {
            keys.push(item.props)
          }

          if (Array.isArray(item.list) && item.list) {
            item.list.forEach(subItem => {
              if (subItem.type === "input" || subItem.type === "select") {
                keys.push(subItem.props)
              }
            })
          }
        })
        
        const makeCostFlag = form.levelThreeSumDTO.makeCost.every(item => {
          const flag = keys.every(key => {
            if (!(!!item[key] || item[key] === 0 || item[key] === false)) {
              iMessage.warn(this.$t("QINGTIANXIEWANZHENGZHIZAOCHENGBEN"))
              return false
            } else {
              return true
            }
          })

          return flag
        })
        if (!makeCostFlag) return false
      }

      if (Array.isArray(form.levelThreeSumDTO.manageFee) && form.levelThreeSumDTO.manageFee.length > 0) {
        const keys = []
        this.titleglfByL3.forEach(item => {
          if (item.type === "input" || item.type === "select") {
            keys.push(item.props)
          }

          if (Array.isArray(item.list) && item.list) {
            item.list.forEach(subItem => {
              if (subItem.type === "input" || subItem.type === "select") {
                keys.push(subItem.props)
              }
            })
          }
        })
        
        const manageFeeFlag = form.levelThreeSumDTO.manageFee.every(item => {
          const flag = keys.every(key => {
            if (!(!!item[key] || item[key] === 0 || item[key] === false)) {
              iMessage.warn(this.$t("QINGTIANXIEWANZHENGGUANLIFEI"))
              return false
            } else {
              return true
            }
          })

          return flag
        })
        if (!manageFeeFlag) return false
      }

      if (Array.isArray(form.levelThreeSumDTO.profit) && form.levelThreeSumDTO.profit.length > 0) {
        const keys = []
        this.titlelrByL3.forEach(item => {
          if (item.type === "input" || item.type === "select") {
            keys.push(item.props)
          }

          if (Array.isArray(item.list) && item.list) {
            item.list.forEach(subItem => {
              if (subItem.type === "input" || subItem.type === "select") {
                keys.push(subItem.props)
              }
            })
          }
        })
        
        const profitFlag = form.levelThreeSumDTO.profit.every(item => {
          const flag = keys.every(key => {
            if (!(!!item[key] || item[key] === 0 || item[key] === false)) {
              iMessage.warn(this.$t("QINGTIANXIEWANZHENLIRUN"))
              return false
            } else {
              return true
            }
          })

          return flag
        })
        if (!profitFlag) return false
      }

      return true
    },
    /**
     * @description: 提交接口save
     * @param {*}
     * @return {*}
     */    
    postCostSummary(){
      // const sendData = JSON.parse(JSON.stringify(this.allTableData))
      const sendData = this.topTableData.tableData[0]

      const baseSumDTO = {
        cbdBlockId: sendData.cbdBlockId,
        cbdHdrId: sendData.cbdHdrId,
        cbdId: sendData.cbdId,
        cbdPlantCapId: sendData.cbdPlantCapId,
        ckdManageRate: sendData.ckdManageRate,
        id: sendData.id,
        kentSummary: sendData.kentSummary,
        lcManageRate: sendData.lcManageRate,
        manageSummary: sendData.manageSummary,
        materialSummary: sendData.materialSummary,
        mouldCbdId: sendData.mouldCbdId,
        otherSummary: sendData.otherSummary,
        productionSummary: sendData.productionSummary,
        profitSummary: sendData.profitSummary,
        scrapSummary: sendData.scrapSummary,
        totalPrice: sendData.totalPrice
      }

      const form = {
        cbdLevel: this.allTableData.level,
        editFlag: this.allTableData.editFlag,
        isAutoCal: this.isAutoCal,
        levelOneSumDTO: this.allTableData.level === 1 ? baseSumDTO : undefined,
        levelTwoSumDTO: this.allTableData.level === 2 ? {
          ...baseSumDTO,
          discardCost: this.allTableData.discardCost,
          makeCost: this.allTableData.makeCost.records,
          manageFee: this.allTableData.manageFee,
          otherFee: this.allTableData.otherFee,
          profit: this.allTableData.profit,
          rawMaterial: this.allTableData.rawMaterial.records,
        } : undefined,
        levelThreeSumDTO: this.allTableData.level === 3 ? {
          ...baseSumDTO,
          discardCost: this.allTableData.discardCost,
          makeCost: this.allTableData.makeCost.records,
          manageFee: this.allTableData.manageFee,
          otherFee: this.allTableData.otherFee,
          profit: this.allTableData.profit,
          rawMaterial: this.allTableData.rawMaterial.records,
        } : undefined,
        partType: this.partInfo.partType,
        quotationId: this.partInfo.quotationId,
        startProductDate: this.allTableData.startProductDate,
      }
      
      if (form.cbdLevel == 2) {
        if (!this.validateByL2(form)) throw ""
      }

      if (form.cbdLevel == 3) {
        if (!this.validateByL3(form)) throw ""
      }

      return postCostSummary(form)
    },
    /**
     * @description: 初始化界面方法,父界面会在存在参数的情况下来调用
     * @param {*}
     * @return {*}
     */    
    init(type) {
      if (this.isSkd || this.isSkdLc) {
        this.$refs.skdCostSummary.init()
        if (this.isSkd) return
      }

      if (this.partInfo.partProjectType === partProjTypes.DBYICHIXINGCAIGOU || this.partInfo.partProjectType === partProjTypes.DBLINGJIAN || this.partInfo.priceStatus == 'DB') {
        this.getCostSummaryDB()
      } else {
        this.cbdlist = []
        if (type === "redraw") {
          this.allTableData.level = this.partInfo.currentCbdLevel
          this.allpagefrom['cbdLevel'] = this.partInfo.currentCbdLevel
        } else {
          this.allTableData.level = this.allTableData.level?this.allTableData.level:this.partInfo.currentCbdLevel
          this.allpagefrom['cbdLevel'] = this.allTableData.level?this.allTableData.level:this.partInfo.currentCbdLevel
        }
        
        this.allpagefrom.rfqId = this.partInfo.rfqId
        this.allpagefrom.quotationId = this.partInfo.quotationId
        this.translateCbdList(this.partInfo.cbdLevel)

        this.getCostSummary()
      }
    },
    /**
     * @description: 获取详情信息 
     * @param {*} 预定义分页参数。在组件中调用的时候传递
     * @return {*}
     */    
     getCostSummary(pageSize=10,currPage=1,type){
       if (type) allpagefrom[type] = {size:pageSize,current:currPage} 
       return new Promise((r)=>{
         getCostSummary({ ...allpagefrom, rfqId: undefined }).then(async res=>{
          if(res.data){
            r(res.data)
            this.sourceResponseData = cloneDeep(res.data)
            const data = await this.getBzfreeAndYunshuFree();
            this.packAndShipFee = data
            this.initData = true
            this.count = 0
            this.isAutoCal = res.data.allTableData
            if (this.isSkdLc) this.isAutoCal = false
            this.allTableData = this.translateDataForRender(res.data)
            this.topTableData = this.translateDataTopData(cloneDeep(this.allTableData), data)
            this.$refs.components && typeof this.$refs.components.partsQuotationss == "function" && this.$refs.components.partsQuotationss(this.partInfo.rfqId,this.userInfo.supplierId ? this.userInfo.supplierId : this.$route.query.supplierId,this.partInfo.round,this.allTableData.level)
            // this.allpagefrom.quotationId,
            this.findFiles()

            this.getCategoryDetail("MATERIAL")
            this.getCategoryDetail("COMPONENT")
            this.getCategoryDetail("PRODUCTION_PROCESS")
          }
        }).catch(err=>{
          this.allTableData = {
              level:this.allTableData.level?this.allTableData.level:this.partInfo.currentCbdLevel,
              startProductDate:'',
              editFlag:true,
              discardCost:[],
              makeCost:{
                records:[],
                total:1
              },
              manageFee:[],
              otherFee:[],
              profit:[],
              rawMaterial:{
                records:[],
                total:1
              }
            }
          iMessage.error(err.message)
        })
       })
    },
    /**
     * @description: 获取表格中的包装费，运输费用，操作费用 
     * @param {*} //packageCost,transportCost,operateCost
     * @return {*} //A价 = 2.1 + ...... 2.6,  B价 = A价+包装费+运输费+操作费。
     */    
    getBzfreeAndYunshuFree(){
     return new Promise((r)=>{
        packageTransport(this.allpagefrom.quotationId).then(res=>{
          r(res.data)
        }).catch(()=>{
          r({})
        })
     })
    },
    /**
     * @Description: 保存表格中的包装费，运输费，操作费
     * @Author: Luoshuang
     * @param {*}
     * @return {*}
     */    
    saveBzfreeAndYunshuFree() {
      const params = {
        ...this.packAndShipFee,
        packageCost: this.topTableData.tableData[0]?.packageCost,
        transportCost: this.topTableData.tableData[0]?.transportCost,
        operateCost: this.topTableData.tableData[0]?.operateCost,
      }

      return savePackageTransport(params)
    },
    /**
     * @description: 转换后台数据新增字段 其中根据itemType来判断其他费用类型 如果是1 为分摊模具费，如果是0 则为 分摊的开发费
     * @param {*}
     * @return {*}
     */    
    translateDataForRender(baseData){
      try {
        // if(baseData.currentCbdLevel){
        //   this.tableData.level = baseData.currentCbdLevel
        // }
        if (this.tableData) {
          this.tableData.level = this.allpagefrom.cbdLevel
        }

        let data = {}

        switch(this.allpagefrom.cbdLevel) {
          case 1:
            data = {
              ...baseData.levelOneSumVO,
              rawMaterial: { records: [] },
              makeCost: { records: [] },
              discardCost: [],
              manageFee: [],
              otherFee: [],
              profit: []
            }
            break
          case 2:
            data = {
              ...baseData.levelTwoSumVO,
              rawMaterial: baseData.levelTwoSumVO.rawMaterial ? baseData.levelTwoSumVO.rawMaterial : { records: [] },
              makeCost: baseData.levelTwoSumVO.makeCost ? baseData.levelTwoSumVO.makeCost : { records: [] },
              discardCost: 
                Array.isArray(baseData.levelTwoSumVO.discardCost) && baseData.levelTwoSumVO.discardCost.length > 0 ?
                baseData.levelTwoSumVO.discardCost : 
                [
                  {
                    cbdId: baseData.levelTwoSumVO.cbdId,
                    amount: "0",
                    ratio: "0"
                  }
                ],
              manageFee: 
                Array.isArray(baseData.levelTwoSumVO.manageFee) && baseData.levelTwoSumVO.manageFee.length > 0 ?
                baseData.levelTwoSumVO.manageFee : 
                [
                  {
                    cbdId: baseData.levelTwoSumVO.cbdId,
                    typeName: "原材料与散件（不含SVW指定散件）管理费",
                    amount: "0",
                    ratio: "0"
                  },
                  {
                    cbdId: baseData.levelTwoSumVO.cbdId,
                    typeName: "制造管理费",
                    amount: "0",
                    ratio: "0"
                  }
                ],
              otherFee: 
                Array.isArray(baseData.levelTwoSumVO.otherFee) && baseData.levelTwoSumVO.otherFee.length > 0 ?
                baseData.levelTwoSumVO.otherFee : 
                [
                  // {
                  //   cbdId: baseData.levelTwoSumVO.cbdId,
                  //   itemType: 1,
                  //   shareAmount: "0",
                  //   shareQuantity: "0",
                  //   shareTotal: "0",
                  //   totalPrice: "0"
                  // },
                  // {
                  //   cbdId: baseData.levelTwoSumVO.cbdId,
                  //   itemType: 0,
                  //   shareAmount: "0",
                  //   shareQuantity: "0",
                  //   shareTotal: "0",
                  //   totalPrice: "0"
                  // }
                ],
              profit: 
                Array.isArray(baseData.levelTwoSumVO.profit) && baseData.levelTwoSumVO.profit.length > 0 ?
                baseData.levelTwoSumVO.profit : 
                [
                  {
                    cbdId: baseData.levelTwoSumVO.cbdId,
                    amount: "0",
                    ratio: "0"
                  },
                  // {
                  //   cbdId: baseData.levelTwoSumVO.cbdId,
                  //   amount: "0",
                  //   ratio: "0"
                  // }
                ],
            }

            if(data['discardCost']){
              data['discardCost'].forEach(element => {
                //element['ztbfcb'] = "整体报废成本"
                element['ztbfcb'] = 'Scrap Cost'
              });
            }
            if(data['otherFee']){
              data['otherFee'].forEach(element => {
                element['itemName'] = element['itemType']?"Development Cost":"Tooling Cost"
              });
            }
            if(data['profit']){
              data['profit'].forEach(element => {
                element['lr'] = "Profit(SVW Specific excl.)"
              });
            }
            break
          case 3:
            data = {
              ...baseData.levelThreeSumVO,
              rawMaterial: baseData.levelThreeSumVO.rawMaterial ? baseData.levelThreeSumVO.rawMaterial : { records: [] },
              makeCost: baseData.levelThreeSumVO.makeCost ? baseData.levelThreeSumVO.makeCost : { records: [] },
              discardCost: 
                Array.isArray(baseData.levelThreeSumVO.discardCost) && baseData.levelThreeSumVO.discardCost.length > 0 ?
                baseData.levelThreeSumVO.discardCost : 
                [
                  {
                    cbdId: baseData.levelThreeSumVO.cbdId,
                    amount: "0",
                    ratio: "0"
                  }
                ],
              manageFee: 
                Array.isArray(baseData.levelThreeSumVO.manageFee) && baseData.levelThreeSumVO.manageFee.length > 0 ?
                baseData.levelThreeSumVO.manageFee : 
                [
                  {
                    cbdId: baseData.levelThreeSumVO.cbdId,
                    typeName: "材料管理和销售费用",
                    amount: "0",
                    blockAmount: "0",
                    ratio: "0"
                  },
                  {
                    cbdId: baseData.levelThreeSumVO.cbdId,
                    typeName: "制造管理和销售费用",
                    amount: "0",
                    blockAmount: "0",
                    ratio: "0"
                  }
                ],
              otherFee: 
                Array.isArray(baseData.levelThreeSumVO.otherFee) && baseData.levelThreeSumVO.otherFee.length > 0 ?
                baseData.levelThreeSumVO.otherFee : 
                [
                  // {
                  //   cbdId: baseData.levelThreeSumVO.cbdId,
                  //   itemType: 0,
                  //   shareAmount: "0",
                  //   shareQuantity: "0",
                  //   shareTotal: "0",
                  //   totalPrice: "0"
                  // },
                  // {
                  //   cbdId: baseData.levelThreeSumVO.cbdId,
                  //   itemType: 1,
                  //   shareAmount: "0",
                  //   shareQuantity: "0",
                  //   shareTotal: "0",
                  //   totalPrice: "0"
                  // }
                ],
              profit: 
                Array.isArray(baseData.levelThreeSumVO.profit) && baseData.levelThreeSumVO.profit.length > 0 ?
                baseData.levelThreeSumVO.profit : 
                [
                  {
                    cbdId: baseData.levelThreeSumVO.cbdId,
                    typeName: "材料利润",
                    amount: "0",
                    blockAmount: "0",
                    ratio: "0"
                  },
                  {
                    cbdId: baseData.levelThreeSumVO.cbdId,
                    typeName: "制造利润",
                    amount: "0",
                    blockAmount: "0",
                    ratio: "0"
                  }
                ],
            }

            if(data['discardCost']){
              data['discardCost'].forEach(element => {
                //element['ztbfcb'] = "整体报废成本"
                element['ztbfcb'] = 'Scrap Cost'
              });
            }

            break
          default:
        }

        data['level'] = this.allTableData && this.allTableData.level?this.allTableData.level:this.partInfo.currentCbdLevel
        // eslint-disable-next-line no-undef
        data['startProductDate'] = baseData.startProductDate?moment(new Date(baseData.startProductDate)).format('YYYY-MM-DD HH:mm:ss'):''
        return data
      } catch (error) {
        console.warn(error)
      }
    },
    /**
     * @description: 组装头部数据，显示第一个表格 
     * @param {*} a object b object
     * @return {*}
     */    
    translateDataTopData(a,b){
      try {
        const data = {tableData:[],persent:[]}
        this.needContactData.forEach(items=>{
          a[items] = b[items]
        })

        data['tableData'].push(a)
        if (!this.isSteel && !this.roundIsOnlineBidding) { //钢材和onlinebidding是默认展示的totalPrice 不需要计算
          const total = getAallPrice(this.Aprice,a)
          // data['tableData'][0]['totalPrice'] = total
          data['persent'] = getPersent(total,this.Aprice,a)

          if (!this.Aprice.some(key => data['tableData'][0][key] || data['tableData'][0][key] === 0)) {
            this.$set(data['tableData'][0], "totalPrice", this.sourceResponseData.aprice)

            if (['packageCost','transportCost','operateCost'].some(key => b[key] || b[key] === 0)) {
              this.$set(data['tableData'][0], "totalPriceBprice", this.sourceResponseData.bprice)
            }
          }
        } else {
          data['persent'] = getPersent(data['tableData'][0]['totalPrice'],this.Aprice,a)
        }

        console.log("data", data)
        return data
      } catch (error) {
        return {
            persent:[{},{},{},{},{},{}],
            tableData:[]
          }
      }
    },
    /**
     * @description: 获取cbd附件问题
     * @param {*}
     * @return {*} 返回一个promise填充组件中的分页参数。
     */    
    findFiles(pageSize=10,currPage=1){
      return new Promise((r)=>{
          getFiles({
            hostId:this.partInfo.quotationId,
            fileType:this.allTableData.level - 1,
            page:pageSize,
            currPage:currPage
          }).then(res=>{
            if(res.data){
              this.tableDataCbd = res.data
              this.tableDataCbdModel = res
              r(res.data)
            }
        }).catch(err=>{
          console.warn(err)
        })
      })
    },
    /**
     * @description: 向外暴露save方法。
     * @param {*}
     * @return {*}
     */    
    save(type) {
      if (this.isSkd) {
        return this.$refs.skdCostSummary.save()
        .then(res => {
          if (res.code == 200) {
            if (type !== "submit") {
              iMessage.success(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
              this.init()
            }
          } else {
            iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
          }
        })
      }

      if (this.partInfo.partProjectType === partProjTypes.PEIJIAN || this.partInfo.partProjectType === partProjTypes.FUJIAN) {
        return Promise.all([this.postCostSummary(), this.saveBzfreeAndYunshuFree()])
          .then(([res1, res2]) => {
            let flag = true
            if (res1.code == 200) {
              flag = true
              this.updateCbdLevel(this.allTableData.level)
              this.init()
            } else {
              iMessage.error(this.$i18n.locale === "zh" ? res1.desZh : res1.desEn)
            }

            if (res2.code == 200) {
              flag = true
              if (res1.code != 200) this.init()
            } else {
              iMessage.error(this.$i18n.locale === "zh" ? res1.desZh : res1.desEn)
            }

            if (flag) {
              if (type !== "submit") {
                iMessage.success(this.$i18n.locale === "zh" ? (res1 ? res1.desZh : res2.desZh) : (res1 ? res1.desEn : res2.desEn)) 
              }
            } else throw [res1, res2]
          })
      } else if (this.partInfo.partProjectType === partProjTypes.DBYICHIXINGCAIGOU || this.partInfo.partProjectType === partProjTypes.DBLINGJIAN || this. partInfo.priceStatus == 'DB'){
        return this.updateCostSummaryDB().then(res => {
          if (res?.result) {
            if (type !== "submit") {
              iMessage.success(this.$i18n.locale === "zh" ? res.desZh : res.desEn) 
            }
            this.init()
          } else {
            iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
          }
        }).catch(err=>{
          iMessage.error(err.desZh)
        })
      } else {
        if (this.isSkdLc) {
          if (+moment(this.$refs.skdCostSummary.skdStartProductDate) > +moment(this.allTableData.startProductDate)) throw iMessage.warn(this.language("LCQIBUSHENGCHANRIQIBUNENGXIAOYUSKDQIBUSHENGCHANRIQI", "LC起步生产日期不能小于SKD起步生产日期"))
          if (!moment(this.allTableData.startProductDate).isAfter(moment(this.$refs.skdCostSummary.skdStartProductDate), "month")) throw iMessage.warn(this.language("SKDAFTERLCNOTMONTH", "LC起步生产日期必须是SKD起步生产日期所在月份之后的日期"))

          return Promise.all([
            this.$refs.skdCostSummary.save(),
            this.postCostSummary()
          ])
          .then(([res1, res2]) => {
            if (res1 && res1.code == 200 && res2 && res2.code == 200) {
              if (type !== "submit") {
                iMessage.success(this.$i18n.locale === "zh" ? res1.desZh : res1.desEn)
                this.init()
              }

              this.updateCbdLevel(this.allTableData.level)
            } else {
              iMessage.error(this.language("CAOZUOSHIBAI", "操作失败"))
            }
          })
        }

        return this.postCostSummary().then(res => {
          if (res.code == 200) {
            this.updateCbdLevel(this.allTableData.level)
            this.init()
            if (type !== "submit") {
              iMessage.success(this.$i18n.locale === "zh" ? res.desZh : res.desEn) 
            }
          } else {
            iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
          }
        })
      }
    },
    getCostSummaryDB() {
      //this.partInfo.quotationId
      return new Promise((r)=>{
        getCostSummaryDB({quotationId:this.partInfo.quotationId}).then(res => {
          if (res?.result) {
            this.dbDetailList = res.data.map(item => {
              return {
                ...item,
                seaPrice: item.sortOrder == 14 ? item.capacity : item.sortOrder == 13 ? item.sopDate : item.sortOrder == 11 ? item.isReduce : item.seaPrice,
                noairPrice: item.sortOrder == 13 || item.sortOrder == 11,
                allRow: item.sortOrder == 14,
                type: item.sortOrder == 13 ? 'date' : item.sortOrder == 11 ? 'select' : 'input',
                remarkDisabled: item.sortOrder == 10
              }
            })
          } else {
            iMessage.error(this.$i18n.locale === 'zh' ? res.desZh : res.desEn)
          }
        })
      })
    },
    updateCostSummaryDB() {
      const params = this.dbDetailList.map(item => {
        return {
          ...item,
          capacity: item.sortOrder == 14 ? item.seaPrice : item.capacity,
          sopDate: item.sortOrder == 13 ? item.seaPrice : item.sopDate,
          isAutoCal: item.sortOrder == 13 ? item.isAutoCal : undefined,
          isReduce: item.sortOrder == 11 ? item.seaPrice : item.isReduce,
          seaPrice: item.sortOrder == 14 || item.sortOrder == 13 || item.sortOrder == 11 ? null : item.seaPrice,
        }
      })

      return updateCostSummaryDB(params)
    },

    handleSelectionChangeByRawMaterial(list) {
      this.multipleSelectionByRawMaterial = list
    }, 
    // 添加行ByRawMaterial
    handleAddByRawMaterial() {
      this.allTableData.rawMaterial.records.push({
        cbdId: this.allTableData.cbdId
      })
    },
    // 删除行ByRawMaterial
    handleDelByRawMaterial() {
      this.allTableData.rawMaterial.records = this.allTableData.rawMaterial.records.filter(item => !this.multipleSelectionByRawMaterial.includes(item))
    },

    handleSelectionChangeByMakeCost(list) {
      this.multipleSelectionByMakeCost = list
    },
    // 添加行ByMakeCost
    handleAddByMakeCost() {
      this.allTableData.makeCost.records.push({
        cbdId: this.allTableData.cbdId
      })
    },
    // 删除行ByMakeCost
    handleDelByMakeCost() {
      this.allTableData.makeCost.records = this.allTableData.makeCost.records.filter(item => !this.multipleSelectionByMakeCost.includes(item))
    },

    // L2计算
    handleInputByRawMaterialL2(value, row) {
      this.$set(row, "indirectMaterialCost", math.evaluate(`${ row.unitPrice || 0 } * ${ row.quantity || 0 }`).toFixed(2))
      this.$set(row, "materialManageCost", math.evaluate(`${ row.indirectMaterialCost || 0 } * (${ row.materialManageCostRate || 0 } / 100)`).toFixed(2))
      this.$set(row, "materialCost", math.evaluate(`${ row.indirectMaterialCost || 0 } + ${ row.materialManageCost || 0 }`).toFixed(2))

      this.materialSummaryL2 = 0 // 头表原材料/散件
      this.materialSummaryL2ByFalse = 0 // 原材料/散件 by SVW指定价格散件为否

      this.allTableData.rawMaterial.records.forEach(item => {
        this.materialSummaryL2 = math.add(this.materialSummaryL2, math.bignumber(item.materialCost || 0)) // 计算头表原材料/散件
        this.materialSummaryL2ByFalse = item.isSvwAssignPriceParts ? this.materialSummaryL2ByFalse : math.add(this.materialSummaryL2ByFalse, math.bignumber(item.materialCost || 0))
      })

      this.$set(this.topTableData.tableData[0], "materialSummary", this.materialSummaryL2.toFixed(2))

      this.handleInputByDiscardCostL2("", this.allTableData.discardCost[0])
      this.handleInputByManageFeeL2()
      this.handleInputByProfitL2("", this.allTableData.profit[0])
    },

    handleInputByMakeCostL2(value, row) {
      this.$set(row, "indirectManufacturingAmount", math.evaluate(`(${ row.deviceRate || 0 } + ${ row.directLaborRate || 0 } * ${ row.directLaborQuantity || 0 }) * ${ row.taktTime || 0 } / 3600 / ${ row.taktTimeNumber ? row.taktTimeNumber : 1 } * (${ row.indirectManufacturingRate || 0 } / 100)`).toFixed(2))
      this.$set(row, "laborCost", math.evaluate(`${ row.directLaborRate || 0 } * ${ row.directLaborQuantity || 0 } * ${ row.taktTime || 0 } / 3600 / ${ row.taktTimeNumber ? row.taktTimeNumber : 1 } * (1 + (${ row.indirectManufacturingRate || 0 } / 100))`).toFixed(2))
      this.$set(row, "deviceCost", math.evaluate(`${ row.deviceRate || 0 } * ${ row.taktTime || 0 } / 3600 / ${ row.taktTimeNumber ? row.taktTimeNumber : 1 } * (1 + (${ row.indirectManufacturingRate || 0 } / 100))`).toFixed(2))
    
      this.laborCostSummaryL2 = 0 // 人工成本
      this.deviceCostSummaryL2 = 0 // 设备成本

      this.allTableData.makeCost.records.forEach(item => {
        this.laborCostSummaryL2 = math.add(this.laborCostSummaryL2, math.bignumber(item.laborCost || 0)) // 计算人工成本
        this.deviceCostSummaryL2 = math.add(this.deviceCostSummaryL2, math.bignumber(item.deviceCost || 0)) // 计算设备成本
      })

      this.$set(this.topTableData.tableData[0], "productionSummary", math.add(this.laborCostSummaryL2, this.deviceCostSummaryL2).toFixed(2))

      this.handleInputByDiscardCostL2("", this.allTableData.discardCost[0])
      this.handleInputByManageFeeL2()
      this.handleInputByProfitL2("", this.allTableData.profit[0])
    },

    handleInputByDiscardCostL2(value, row) {
      this.$set(row, "amount", math.evaluate(`(${ this.materialSummaryL2 || 0 } + ${ this.laborCostSummaryL2 || 0 } + ${ this.deviceCostSummaryL2 || 0 }) / (1 - (${ row.ratio || 0 } / 100)) - (${ this.materialSummaryL2 || 0 } + ${ this.laborCostSummaryL2 || 0 } + ${ this.deviceCostSummaryL2 || 0 })`).toFixed(2))
    
      this.scrapSummaryL2 = 0 // 报废成本

      this.allTableData.discardCost.forEach(item => {
        this.scrapSummaryL2 = math.add(this.scrapSummaryL2, math.bignumber(item.amount || 0)) // 计算报废成本
      })

      this.$set(this.topTableData.tableData[0], "scrapSummary", this.scrapSummaryL2.toFixed(2))
    },

    handleInputByManageFeeL2(value, row) {
      this.$set(this.allTableData.manageFee[0], "amount", math.evaluate(`${ this.materialSummaryL2ByFalse || 0 } * (${ this.allTableData.manageFee[0].ratio || 0 } / 100)`).toFixed(2))
      this.$set(this.allTableData.manageFee[1], "amount", math.evaluate(`(${ math.add(this.laborCostSummaryL2, this.deviceCostSummaryL2) || 0 }) * (${ this.allTableData.manageFee[1].ratio || 0 } / 100)`).toFixed(2))
    
      this.$set(this.topTableData.tableData[0], "manageSummary", math.add(math.bignumber(this.allTableData.manageFee[0].amount || 0), math.bignumber(this.allTableData.manageFee[1].amount || 0)).toFixed(2))
    },

    handleInputByProfitL2(value, row) {
      this.$set(row, "amount", math.evaluate(`(${ row.ratio || 0 } / 100) * (${ math.add(this.laborCostSummaryL2, this.deviceCostSummaryL2) || 0 } + ${ this.materialSummaryL2ByFalse || 0 })`).toFixed(2))
    
      this.$set(this.topTableData.tableData[0], "profitSummary", math.add(math.bignumber(this.allTableData.profit[0].amount || 0), 0).toFixed(2))
    },

    // L3计算
    handleInputByRawMaterialL3(value, row) {
      this.$set(row, "directMaterialCost", math.evaluate(`(${ row.unitPrice || 0 } * ${ row.roughWeight || 0 }) - (${ row.roughWeight || 0 } - ${ row.suttleWeight || 0 }) * ${ row.recycleUnitPrice || 0 }`).toFixed(2))
      this.$set(row, "lossCost", math.evaluate(`${ row.directMaterialCost || 0 } / (1 - ${ row.lossCostRate || 0 } / 100) - ${ row.directMaterialCost || 0 }`).toFixed(2))
      this.$set(row, "indirectMaterialCost", math.evaluate(`${ row.indirectMaterialCostRatio || 0 } / 100 * (${ row.unitPrice || 0 } * ${ row.roughWeight || 0 } + ${ row.lossCost || 0 })`).toFixed(2))
      this.$set(row, "materialCost", math.evaluate(`${ row.directMaterialCost || 0 } + ${ row.lossCost || 0 } + ${ row.earlierLogisticsCost || 0 } + ${ row.indirectMaterialCost || 0 }`).toFixed(2))

      let materialSummary = 0 // 头表原材料/散件
      let scrapSummary = 0 // 报废成本

      this.allTableData.rawMaterial.records.forEach(item => {
        materialSummary = math.add(materialSummary, math.bignumber(item.materialCost || 0)) // 计算头表原材料/散件
        scrapSummary = math.add(scrapSummary, math.bignumber(item.lossCost || 0)) // 计算报废成本
      })

      let materialScrapSummary = scrapSummary
      this.allTableData.makeCost.records.forEach(item => {
        scrapSummary = math.add(scrapSummary, math.bignumber(item.lossCost || 0)) // 计算报废成本
      })

      this.summaryData.materialSummary = materialSummary.toFixed(2)
      this.$set(this.topTableData.tableData[0], "materialSummary", math.subtract(materialSummary, materialScrapSummary).toFixed(2))
      this.$set(this.allTableData.discardCost[0], "amount", scrapSummary.toFixed(2))
      this.$set(this.topTableData.tableData[0], "scrapSummary", scrapSummary.toFixed(2))

      // 计算报废率
      if (math.evaluate(`${ this.summaryData.materialSummary || 0 } + ${ this.topTableData.tableData[0].productionSummary || 0 }`) === "0") {
        this.$set(this.allTableData.discardCost[0], "ratio", 0)
      } else {
        this.$set(this.allTableData.discardCost[0], "ratio", math.evaluate(`${ this.allTableData.discardCost[0].amount } / (${ this.summaryData.materialSummary || 0 } + ${ this.topTableData.tableData[0].productionSummary || 0 })`).toFixed(2))
      }

      this.$set(this.allTableData.manageFee[0], "amount", math.evaluate(`${ this.summaryData.materialSummary } * (${ this.allTableData.manageFee[0].ratio } / 100)`).toFixed(2))
      this.$set(this.allTableData.manageFee[0], "blockAmount", math.evaluate(`${ this.allTableData.manageFee[0].amount } * 1`).toFixed(2))

      this.$set(this.allTableData.profit[0], "amount", math.evaluate(`${ this.summaryData.materialSummary } * (${ this.allTableData.profit[0].ratio } / 100)`).toFixed(2))
      this.$set(this.allTableData.profit[0], "blockAmount", math.evaluate(`${ this.allTableData.profit[0].amount } * 1`).toFixed(2))
    
      const manageSummary = this.allTableData.manageFee.reduce((acc, cur) => {
        return math.add(acc, math.bignumber(cur.amount || 0))
      }, 0)
      this.$set(this.topTableData.tableData[0], "manageSummary", manageSummary.toFixed(2))

      const profitSummary = this.allTableData.profit.reduce((acc, cur) => {
        return math.add(acc, math.bignumber(cur.amount || 0))
      }, 0)
      this.$set(this.topTableData.tableData[0], "profitSummary", profitSummary.toFixed(2))
    },

    handleInputByMakeCostL3(value, row) {
      this.$set(row, "directProduceCost", math.evaluate(`(${ row.perHourMachineCost || 0 } + ${ row.perHourLaborCost || 0 } * ${ row.workerCount || 0 }) * ${ row.perProduceTime } / 3600 / ${ row.perCycleCount ? row.perCycleCount : 1 }`).toFixed(2))
      this.$set(row, "lossCost", math.evaluate(`${ row.directProduceCost || 0 } / (1 - ${ row.lossCostRate || 0 } / 100) - ${ row.directProduceCost || 0 }`).toFixed(2))
      this.$set(row, "indirectProduceCost", math.evaluate(`(${ row.directProduceCost || 0 } + ${ row.lossCost || 0 } + ${ row.produceSwitchCost || 0 }) * (${ row.indirectProduceCostRate || 0 } / 100)`).toFixed(2))
      this.$set(row, "totalCost", math.evaluate(`${ row.directProduceCost || 0 } + ${ row.lossCost || 0 } + ${ row.produceSwitchCost || 0 } + ${ row.indirectProduceCost || 0 }`).toFixed(2))
    
      let productionSummary = 0 // 头表制造成本
      let scrapSummary = 0 // 报废成本

      this.allTableData.makeCost.records.forEach(item => {
        productionSummary = math.add(productionSummary, math.bignumber(item.totalCost || 0)) // 计算头表制造成本
        scrapSummary = math.add(scrapSummary, math.bignumber(item.lossCost || 0)) // 计算报废成本
      })
      let productionScrapSummary = scrapSummary
      this.allTableData.rawMaterial.records.forEach(item => {
        scrapSummary = math.add(scrapSummary, math.bignumber(item.lossCost || 0)) // 计算报废成本
      })

      this.summaryData.productionSummary = productionSummary.toFixed(2)
      this.$set(this.topTableData.tableData[0], "productionSummary", math.subtract(productionSummary, productionScrapSummary).toFixed(2))
      this.$set(this.allTableData.discardCost[0], "amount", scrapSummary.toFixed(2))
      this.$set(this.topTableData.tableData[0], "scrapSummary", scrapSummary.toFixed(2))

      // 计算报废率
      if (math.evaluate(`${ this.summaryData.materialSummary || 0 } + ${ this.summaryData.productionSummary || 0 }`) === "0") {
        this.$set(this.allTableData.discardCost[0], "ratio", 0)
      } else {
        this.$set(this.allTableData.discardCost[0], "ratio", math.evaluate(`${ this.allTableData.discardCost[0].amount } / (${ this.summaryData.materialSummary || 0 } + ${ this.summaryData.productionSummary || 0 })`).toFixed(2))
      }

      this.$set(this.allTableData.manageFee[1], "amount", math.evaluate(`${ this.summaryData.productionSummary } * (${ this.allTableData.manageFee[1].ratio } / 100)`).toFixed(2))
      this.$set(this.allTableData.manageFee[1], "blockAmount", math.evaluate(`${ this.allTableData.manageFee[1].amount } * 1`).toFixed(2))

      this.$set(this.allTableData.profit[1], "amount", math.evaluate(`${ this.summaryData.materialSummary } * (${ this.allTableData.profit[1].ratio } / 100)`).toFixed(2))
      this.$set(this.allTableData.profit[1], "blockAmount", math.evaluate(`${ this.allTableData.profit[1].amount } * 1`).toFixed(2))
    
      const manageSummary = this.allTableData.manageFee.reduce((acc, cur) => {
        return math.add(acc, math.bignumber(cur.amount || 0))
      }, 0)
      this.$set(this.topTableData.tableData[0], "manageSummary", manageSummary.toFixed(2))

      const profitSummary = this.allTableData.profit.reduce((acc, cur) => {
        return math.add(acc, math.bignumber(cur.amount || 0))
      }, 0)
      this.$set(this.topTableData.tableData[0], "profitSummary", profitSummary.toFixed(2))
    },

    handleInputByManageFeeL3(value, row) {
      this.$set(row, "amount", math.evaluate(`${ this.summaryData.productionSummary } * (${ row.ratio || 0 } / 100)`).toFixed(2))
      this.$set(row, "blockAmount", math.evaluate(`${ row.amount || 0 } * 1`).toFixed(2))

      const manageSummary = this.allTableData.manageFee.reduce((acc, cur) => {
        return math.add(acc, math.bignumber(cur.amount || 0))
      }, 0)
      this.$set(this.topTableData.tableData[0], "manageSummary", manageSummary.toFixed(2))
    },

    handleInputByProfitL3(value, row) {
      this.$set(row, "amount", math.evaluate(`${ this.summaryData.productionSummary } * (${ row.ratio || 0 } / 100)`).toFixed(2))
      this.$set(row, "blockAmount", math.evaluate(`${ row.amount || 0 } * 1`).toFixed(2))

      const profitSummary = this.allTableData.profit.reduce((acc, cur) => {
        return math.add(acc, math.bignumber(cur.amount || 0))
      }, 0)
      this.$set(this.topTableData.tableData[0], "profitSummary", profitSummary.toFixed(2))
    },

    itemTypeFilter(value) {
      return value === 1 ? "分摊开发费" : "分摊模具费"
    },

    // 获取原材料/散件描述下拉列表
    getCategoryDetail(code) {
      getCategoryDetail({
        code,
        quotationId: this.partInfo.quotationId
      })
      .then(res => {
        if (res.code == 200) {
          switch(code) {
            case "MATERIAL": // 原材料
              this.materialDescribeOptions = Array.isArray(res.data) ? res.data.map(item => ({ value: item.describe, unitCode: item.unitCode })) : []
              
              if (Array.isArray(this.allTableData.rawMaterial.records)) {
                this.allTableData.rawMaterial.records.forEach(item => {
                  if (item.partName === "MATERIAL") this.$set(item, "autocompleteFn", (value, cb) => cb(this.materialDescribeOptions))
                })
              }
              break
            case "COMPONENT": // 散件
              this.componentDescribeOptions = Array.isArray(res.data) ? res.data.map(item => ({ value: item.describe, unitCode: item.unitCode })) : []
              
              if (Array.isArray(this.allTableData.rawMaterial.records)) {
                this.allTableData.rawMaterial.records.forEach(item => {
                  if (item.partName === "COMPONENT") this.$set(item, "autocompleteFn", (value, cb) => cb(this.componentDescribeOptions))
                })
              }
              break
            case "PRODUCTION_PROCESS": // 制造成本
              const productionProcessDescribeOptions = Array.isArray(res.data) ? res.data.map(item => ({ value: item.describe })) : []
              if (Array.isArray(this.titleCbzz)) this.$set(this.titleCbzz[0], "autocompleteFn", (value, cb) => cb(productionProcessDescribeOptions))
              if (Array.isArray(this.titleCbzzByL3)) this.$set(this.titleCbzzByL3[0], "autocompleteFn", (value, cb) => cb(productionProcessDescribeOptions))
              break
            default:
              break
          }
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      })
    },
    handleSelectChangeByRawMaterial(value, row, key) {
      console.log(value, key)

      switch(key) {
        case "partName":
          if (value === "MATERIAL") this.$set(row, "autocompleteFn", (value, cb) => cb(this.materialDescribeOptions))
          else if (value === "COMPONENT") this.$set(row, "autocompleteFn", (value, cb) => cb(this.componentDescribeOptions))
          break
        default:
          break
      }
    },
    // 原材料/散件 autocomplete选择事件
    async handleAutocompleteSelectByRawMaterial(value, row, key) {
      switch(key) {
        case "partNumber":
          this.$set(row, "quantityUnit", value.unitCode)
          break
        default:
          break
      }
    }
  }
}
</script>
<style lang='scss' scoped>
  .row{
    .col{
      &:nth-child(2n-1){
         padding-right: 10px;
      }
      &:nth-child(2n){
         padding-left: 10px;
      }
    }
  }
</style>
