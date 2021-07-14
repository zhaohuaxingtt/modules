<!--
 * @Author: yuszhou
 * @Date: 2021-04-23 15:34:10
 * @LastEditTime: 2021-07-14 18:48:56
 * @LastEditors: Luoshuang
 * @Description: 报价成本汇总界面          
                  1）对于用户来说，在报价详情页通用的功能键包括“保存”、“下载”和“上传报价”
                  2）用户点击“保存”按钮，则保存当前页面已经编辑和输入的所有信息
                  3）若用户在未点击“保存”的情况下点击“下载”按钮，则将报价模板下载到本地；若用户在点击了“保存”之后再点击“下载”按钮，则最后一次保存后的信息内容会随着模板一起下载到本地
                  4）若用户点击“上传报价”按钮，则是将使用模板在本地填写的报价信息上传到系统，系统界面中的信息刷新成本地填写的相关报价信息
                  5）若采购员想帮助供应商进行代报价，则需要先点击“代供应商报价”按钮，才可以对页面进行编辑操作
 * @FilePath: \front-modules\web\quotationdetail\components\costsummary\index.vue
-->

<template>
  <!---partInfo.partProjectType === partProjTypes.DBLINGJIAN || partInfo.partProjectType === partProjTypes.DBYICHIXINGCAIGOU----->
  <div v-if="partInfo.partProjectType === partProjTypes.DBLINGJIAN || partInfo.partProjectType === partProjTypes.DBYICHIXINGCAIGOU">
    <quotationAnalysis :disabled="disabled" :dbDetailList="dbDetailList" />
  </div>
  <div class="cost" v-else>
    <!--------------------------------------------------------->
    <!----------------------百分比模块-------------------------->
    <!--------------------------------------------------------->
    <persentComponents ref='components' :cbdlist='cbdlist' :quotationId='partInfo.quotationId' :tableData='topTableData' :disabled='disabled' :allTableData='allTableData' :partType="partInfo.partType" :partProjectType="partInfo.partProjectType"></persentComponents>
    <!--------------------------------------------------------->
    <!----------------------2.1 原材料/散件--------------------->
    <!--------------------------------------------------------->
    <tableTemlate 
      v-show='allTableData.level == 2' 
      :selection="!disabled" 
      :index='true' 
      pageNationReq='queryRawMaterialDTO' 
      pageNationRes='rawMaterial' 
      :notEdit='disabled' 
      :tableData='allTableData.rawMaterial.records' 
      class="margin-top20" 
      :title="`${allTableData.level}.1 ${$t('LK_YUANCLSJ')}`" 
      :tableTile='titleYcl' 
      :iPagination='disabled' 
      tableIndexString='C'
      @handleSelectionChange="handleSelectionChangeByRawMaterial">
      <template #header-control>
        <div v-if="!disabled">
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
      :selection="!disabled" 
      :index='true'
      pageNationReq='queryRawMaterialDTO' 
      pageNationRes='rawMaterial' 
      :notEdit='disabled'
      :title="`${ allTableData.level }.1 ${$t('LK_YUANCLSJ')}`" 
      class="margin-top20"
      :tableTile='titleYclByL3'
      :tableData='allTableData.rawMaterial.records'
      tableIndexString='C'
      @handleSelectionChange="handleSelectionChangeByRawMaterial"
      @handleInput="handleInputByRawMaterial">
      <template #header-control>
        <div v-if="!disabled">
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
      :selection="!disabled"
      :index='true' 
      pageNationReq='queryMakeCostDTO' 
      pageNationRes='makeCost' 
      :notEdit='disabled' 
      :tableData='allTableData.makeCost.records' 
      class="margin-top20"
      :title="`${allTableData.level}.2 ${$t('LK_ZHIZHAOCB')}`" 
      :tableTile='titleCbzz' 
      :iPagination='disabled' 
      tableIndexString='P'
      @handleSelectionChange="handleSelectionChangeByMakeCost">
      <template #header-control>
        <div v-if="!disabled">
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
      :selection="!disabled" 
      :index='true'
      pageNationReq='queryMakeCostDTO' 
      pageNationRes='makeCost'
      :notEdit='disabled'
      :title="`${ allTableData.level }.2 ${$t('LK_ZHIZHAOCB')}`" 
      class="margin-top20"
      :tableTile='titleCbzzByL3'
      :tableData='allTableData.makeCost.records'
      tableIndexString='P'
      @handleSelectionChange="handleSelectionChangeByMakeCost"
      @handleInput="handleInputByMakeCost">
      <template #header-control>
        <div v-if="!disabled">
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
        <tableTemlate :notEdit='disabled' :tableData='allTableData.discardCost' class="margin-top20" :index='true' :title="`${allTableData.level}.3 ${$t('LK_BAOFEICHENGBEN')}`" :tableTile='titlebfcb' tableIndexString='S'></tableTemlate>
      </el-col>
      <el-col class="col" :span='12'>
        <tableTemlate :notEdit='disabled' :tableData='allTableData.manageFee' class="margin-top20" :index='true' :title="`${allTableData.level}.4 ${$t('LK_GUANLIFEI')}`" :tableTile='titleglf' tableIndexString='O'></tableTemlate>
      </el-col>
    </el-row>
    <el-row class="row" v-show='allTableData.level == 2'>
      <el-col class="col" :span='12'>
        <tableTemlate :notEdit='disabled' :tableData='allTableData.otherFee' class="margin-top20" :index='true' :title="`${allTableData.level}.5 ${$t('LK_QITAFEIYONG')}`" :tableTile='titleqtfy' tableIndexString='A'></tableTemlate>
      </el-col>
      <el-col class="col" :span='12'>
        <tableTemlate :notEdit='disabled' :tableData='allTableData.profit' class="margin-top20" :index='true' :title="`${allTableData.level}.6 ${$t('LK_LIRUN')}`" :tableTile='titlelr' tableIndexString='P'></tableTemlate>
      </el-col>
    </el-row>
    <!--------------------------------------------------------->
    <!-------3.3 报废成本 管理费 其他费用 利润--------------------->
    <!--------------------------------------------------------->
    <el-row class="row" v-show='allTableData.level == 3'>
      <el-col class="col" :span='12'>
        <tableTemlate :notEdit='disabled' :tableData='allTableData.discardCost' class="margin-top20" :index='true' :title="`${allTableData.level}.3 ${$t('LK_BAOFEICHENGBEN')}`" :tableTile='titlebfcbByL3' tableIndexString='S'></tableTemlate>
      </el-col>
      <el-col class="col" :span='12'>
        <tableTemlate :notEdit='disabled' :tableData='allTableData.manageFee' class="margin-top20" :index='true' :title="`${allTableData.level}.4 ${$t('LK_GUANLIFEI')}`" :tableTile='titleglfByL3' tableIndexString='O' @handleInput="handleInputByManageFee"></tableTemlate>
      </el-col>
    </el-row>
    <el-row class="row" v-show='allTableData.level == 3'>
      <el-col class="col" :span='12'>
        <tableTemlate :notEdit='disabled' :tableData='allTableData.otherFee' class="margin-top20" :index='true' :title="`${allTableData.level}.5 ${$t('LK_QITAFEIYONG')}`" :tableTile='titleqtfyByL3' tableIndexString='A'></tableTemlate>
      </el-col>
      <el-col class="col" :span='12'>
        <tableTemlate :notEdit='disabled' :tableData='allTableData.profit' class="margin-top20" :index='true' :title="`${allTableData.level}.6 ${$t('LK_LIRUN')}`" :tableTile='titlelrByL3' tableIndexString='P' @handleInput="handleInputByProfit"></tableTemlate>
      </el-col>
    </el-row>
    <!--------------------------------------------------------->
    <!----------------------2.2 制造成本------------------------>
    <!--------------------------------------------------------->
    <tableTemlate class="margin-top20" :cbdSelect='cbdSelect' pageNationReq='cbd' pageNationRes='cbd' title="CBD" selection :tableData='tableDataCbd' :tableTile='titleCBD' iPagination>
      <template #header-control>
        <iButton @click="downLoadFile">{{$t('LK_XIAZAI')}}</iButton>
        <iButton v-if='!disabled' @click="disabel">{{$t('delete')}}</iButton>
      </template>
    </tableTemlate>
  </div>
</template>
<script>
/* eslint-disable no-undef */

import persentComponents from './components/timeAndlevTabel'
import tableTemlate from './components/tableTemlate'
import {persentDatalist,titleYcl,titleCbzz,titlebfcb,titleglf,titleqtfy,titlelr,titleCBD,allpagefrom,needContactData,Aprice,getAallPrice,getPersent,cbdlist, titleYclByL3, titleCbzzByL3, titlebfcbByL3, titleglfByL3, titleqtfyByL3, titlelrByL3} from './components/data'
import {iButton,iMessage} from 'rise'
import {getCostSummary,packageTransport} from '@/api/rfqManageMent/rfqDetail'
import {findFiles,postCostSummary,deleteFile,savePackageTransport,getCostSummaryDB,updateCostSummaryDB} from '@/api/rfqManageMent/quotationdetail'
import {downloadFile, downloadUdFile} from '@/api/file'
import {selectDictByKeyss} from '@/api/dictionary'
import quotationAnalysis from './components/quotationAnalysis'
import {partProjTypes} from '@/config'

export default{
  components:{persentComponents,tableTemlate,iButton,quotationAnalysis},
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
      tableDataCbdModel:{},
      cbdSelect:{
        list:[]
      },
      dbDetailList: [],
      titleYclByL3,
      titleYclByL3Status: false,
      titleCbzzByL3,
      titlebfcbByL3,
      titleglfByL3,
      titleqtfyByL3,
      titlelrByL3,

      multipleSelectionByRawMaterial: [],
      multipleSelectionByMakeCost: []
    }
  },
  watch:{
    'topTableData.tableData':{
      handler:function(val){
        try {
          const total = getAallPrice(this.Aprice,val[0])
          this.topTableData.persent = getPersent(total,this.Aprice,val[0])
        } catch (error) {
          this.topTableData.persent = []
        }
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
    }),
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
      selectDictByKeyss('ORIGIN_COUNTRY').then(res=>{
        if(res.code == 200 && res.data && res.data.ORIGIN_COUNTRY){
          this.titleYcl = titleYcl(this.translateDicKeyCodeToName(res.data.ORIGIN_COUNTRY))
          this.titleYclByL3 = titleYclByL3(this.translateDicKeyCodeToName(res.data.ORIGIN_COUNTRY))
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
      const fileIds = []
      this.cbdSelect.list.forEach(res=>{
        fileIds.push(res.id)
      })
      deleteFile({fileIds:fileIds}).then(res=>{
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
    postCostSummary(type){
      return new Promise((r,j)=>{
        const sendData = JSON.parse(JSON.stringify(this.allTableData))

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
          levelOneSumDTO: this.allTableData.level === 1 ? baseSumDTO : undefined,
          levelTwoSumDTO: this.allTableData.level === 2 ? {
            ...baseSumDTO,
            discardCost: sendData.discardCost,
            makeCost: sendData.makeCost.records,
            manageFee: sendData.manageFee,
            otherFee: sendData.otherFee,
            profit: sendData.profit,
            rawMaterial: sendData.rawMaterial.records,
          } : undefined,
          levelThreeSumDTO: this.allTableData.level === 3 ? {
            ...baseSumDTO,
            discardCost: sendData.discardCost,
            makeCost: sendData.makeCost.records,
            manageFee: sendData.manageFee,
            otherFee: sendData.otherFee,
            profit: sendData.profit,
            rawMaterial: sendData.rawMaterial.records,
          } : undefined,
          partType: this.partInfo.partType,
          quotationId: this.partInfo.quotationId,
          startProductDate: sendData.startProductDate,
        }

        if (form.cbdLevel == 2) {
          if (!this.validateByL2(form)) return
        }

        if (form.cbdLevel == 3) {
          if (!this.validateByL3(form)) return
        }

        // console.log("sendData", sendData)
        // sendData.makeCost = sendData.makeCost.records
        // sendData.rawMaterial = sendData.rawMaterial.records
        // sendData['sumDTO'] = this.topTableData.tableData[0]
        // sendData['quotationId'] = this.partInfo.quotationId
        // sendData['cbdLevel'] = this.allTableData.level
        // sendData['sumVO'] = undefined
        // sendData['level'] = undefined
        // sendData.partType = this.partInfo.partType
        // sendData.partProjectType = this.partInfo.partProjectType

        postCostSummary(this.translateDataForServerce(form)).then(res=>{
          if(res.code == 200){
            r()
            if (type !== "submit") iMessage.success('操作成功')
            this.updateCbdLevel(this.allTableData.level)
          }else{
            j(res.desZh)
            iMessage.error(res.desZh)
          }
        }).catch(err=>{
          j(err.desZh)
          iMessage.error(err.desZh)
        })
      })
    },
    /**
     * @description: 初始化界面方法,父界面会在存在参数的情况下来调用
     * @param {*}
     * @return {*}
     */    
    init(type){
      if (this.partInfo.partProjectType === partProjTypes.DBYICHIXINGCAIGOU || this.partInfo.partProjectType === partProjTypes.DBLINGJIAN) {
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
            const data = await this.getBzfreeAndYunshuFree();
            this.packAndShipFee = data
            this.allTableData = this.translateDataForRender(res.data)
            this.topTableData = this.translateDataTopData(this.allTableData, data)
            this.$refs.components.partsQuotationss(this.partInfo.rfqId,this.userInfo.supplierId ? this.userInfo.supplierId : this.$route.query.supplierId,this.partInfo.round,this.allTableData.level)
            // this.allpagefrom.quotationId,
            this.findFiles()
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
        packageCost: this.topTableData.packageCost,
        transportCost: this.topTableData.transportCost,
        operateCost: this.topTableData.operateCost,
      }
      return savePackageTransport(params).then(res => {
        if (res && res.result) {
          iMessage.success(this.$i18n.locale === 'zh' ? res.desZh : res.desEn)
        } else {
          iMessage.error(this.$i18n.locale === 'zh' ? res.desZh : res.desEn)
        }
      })
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
                  {
                    cbdId: baseData.levelTwoSumVO.cbdId,
                    amount: "0",
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
            if(data['otherFee']){
              data['otherFee'].forEach(element => {
                element['itemName'] = element['itemType']?"Development Cost":"Tooling Cost"
              });
            }

            break
          default:
        }

        data['level'] = this.allTableData && this.allTableData.level?this.allTableData.level:this.partInfo.currentCbdLevel
        // eslint-disable-next-line no-undef
        data['startProductDate'] = baseData.startProductDate?moment(new Date(baseData.startProductDate)).format('YYYY-MM-DD HH:mm:ss'):''

        console.log("data", data)

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
        const total = getAallPrice(this.Aprice,a)
        data['tableData'][0]['totalPrice'] = total
        data['persent'] = getPersent(total,this.Aprice,a)
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
          findFiles({
            rfqId:this.partInfo.rfqId,
            round:this.partInfo.round || 1,
            size:pageSize,
            current:currPage,
            fileType:this.allTableData.level - 1,
            partPrjCode:this.partInfo.fsNum || 'FS-21-0000015'
          }).then(res=>{
            if(res.data && res.data.records){
              this.tableDataCbd = res.data.records
              this.tableDataCbdModel = res.data
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
    save(type){
      if (this.partInfo.partProjectType === partProjTypes.PEIJIAN || this.partInfo.partProjectType === partProjTypes.FUJIAN) {
        return Promise.all(this.postCostSummary(), this.saveBzfreeAndYunshuFree())
      } else if (this.partInfo.partProjectType === partProjTypes.DBYICHIXINGCAIGOU || this.partInfo.partProjectType === partProjTypes.DBLINGJIAN){
        return this.updateCostSummaryDB()
      } else {
        return this.postCostSummary(type)
      }
    },
    getCostSummaryDB() {
      //this.partInfo.quotationId
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
    },
    updateCostSummaryDB() {
      const params = this.dbDetailList.map(item => {
        return {
          ...item,
          capacity: item.sortOrder == 14 ? item.seaPrice : item.capacity,
          sopDate: item.sortOrder == 13 ? item.seaPrice : item.sopDate,
          isReduce: item.sortOrder == 11 ? item.seaPrice : item.isReduce,
          seaPrice: item.sortOrder == 14 || item.sortOrder == 13 || item.sortOrder == 11 ? null : item.seaPrice
        }
      })
      updateCostSummaryDB(params).then(res => {
        if (res?.result) {
          iMessage.success(this.$i18n.locale === 'zh' ? res?.desZh : res?.desEn)
        } else {
          iMessage.error(this.$i18n.locale === 'zh' ? res?.desZh : res?.desEn)
        }
      })
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
    handleInputByRawMaterial(value, row) {
      this.$set(row, "directMaterialCost", math.evaluate(`(${ row.unitPrice || 0 } * ${ row.roughWeight || 0 }) - (${ row.roughWeight || 0 } - ${ row.suttleWeight || 0 }) * ${ row.recycleUnitPrice || 0 }`).toFixed(4))
      this.$set(row, "lossCost", math.evaluate(`${ row.directMaterialCost || 0 } / (1 - ${ row.lossCostRate || 0 } / 100) - ${ row.directMaterialCost || 0 }`).toFixed(4))
      this.$set(row, "indirectMaterialCost", math.evaluate(`${ row.indirectMaterialCostRatio || 0 } / 100 * (${ row.unitPrice || 0 } * ${ row.roughWeight || 0 } + ${ row.lossCost || 0 })`).toFixed(4))
      this.$set(row, "materialCost", math.evaluate(`${ row.directMaterialCost || 0 } + ${ row.lossCost || 0 } + ${ row.earlierLogisticsCost || 0 } + ${ row.indirectMaterialCost || 0 }`).toFixed(4))
    
      let materialSummary = 0 // 头表原材料/散件
      let scrapSummary = 0 // 报废成本

      this.allTableData.rawMaterial.records.forEach(item => {
        materialSummary = math.add(materialSummary, math.bignumber(item.materialCost || 0)) // 计算头表原材料/散件
        scrapSummary = math.add(scrapSummary, math.bignumber(item.lossCost || 0)) // 计算报废成本
      })
      this.allTableData.makeCost.records.forEach(item => {
        scrapSummary = math.add(scrapSummary, math.bignumber(item.lossCost || 0)) // 计算报废成本
      })

      this.$set(this.topTableData.tableData[0], "materialSummary", materialSummary.toFixed(4))
      this.$set(this.allTableData.discardCost[0], "amount", scrapSummary.toFixed(4))
      this.$set(this.topTableData.tableData[0], "scrapSummary", scrapSummary.toFixed(4))

      // 计算报废率
      if (math.evaluate(`${ this.topTableData.tableData[0].materialSummary || 0 } + ${ this.topTableData.tableData[0].productionSummary || 0 }`) === "0") {
        this.$set(this.allTableData.discardCost[0], "ratio", 0)
      } else {
        this.$set(this.allTableData.discardCost[0], "ratio", math.evaluate(`${ this.allTableData.discardCost[0].amount } / (${ this.topTableData.tableData[0].materialSummary || 0 } + ${ this.topTableData.tableData[0].productionSummary || 0 })`).toFixed(4))
      }

      this.$set(this.allTableData.manageFee[0], "amount", math.evaluate(`${ this.topTableData.tableData[0].materialSummary } * (${ this.allTableData.manageFee[0].ratio } / 100)`).toFixed(4))
      this.$set(this.allTableData.manageFee[0], "blockAmount", math.evaluate(`${ this.allTableData.manageFee[0].amount } * 1`).toFixed(4))

      this.$set(this.allTableData.profit[0], "amount", math.evaluate(`${ this.topTableData.tableData[0].materialSummary } * (${ this.allTableData.profit[0].ratio } / 100)`).toFixed(4))
      this.$set(this.allTableData.profit[0], "blockAmount", math.evaluate(`${ this.allTableData.profit[0].amount } * 1`).toFixed(4))
    
      const manageSummary = this.allTableData.manageFee.reduce((acc, cur) => {
        return math.add(acc, math.bignumber(cur.amount || 0))
      }, 0)
      this.$set(this.topTableData.tableData[0], "manageSummary", manageSummary.toFixed(4))

      const profitSummary = this.allTableData.profit.reduce((acc, cur) => {
        return math.add(acc, math.bignumber(cur.amount || 0))
      }, 0)
      this.$set(this.topTableData.tableData[0], "profitSummary", profitSummary.toFixed(4))
    },

    handleInputByMakeCost(value, row) {
      this.$set(row, "directProduceCost", math.evaluate(`(${ row.perHourMachineCost || 0 } + ${ row.perHourLaborCost || 0 } * ${ row.workerCount || 0 }) * ${ row.perProduceTime } / 3600 / ${ row.perCycleCount ? row.perCycleCount : 1 }`).toFixed(4))
      this.$set(row, "lossCost", math.evaluate(`${ row.directProduceCost || 0 } / (1 - ${ row.lossCostRate || 0 } / 100) - ${ row.directProduceCost || 0 }`).toFixed(4))
      this.$set(row, "indirectProduceCost", math.evaluate(`(${ row.directProduceCost || 0 } + ${ row.lossCost || 0 } + ${ row.produceSwitchCost || 0 }) * (${ row.indirectProduceCostRate || 0 } / 100)`).toFixed(4))
      this.$set(row, "totalCost", math.evaluate(`${ row.directProduceCost || 0 } + ${ row.lossCost || 0 } + ${ row.produceSwitchCost || 0 } + ${ row.indirectProduceCost || 0 }`).toFixed(4))
    
      let productionSummary = 0 // 头表制造成本
      let scrapSummary = 0 // 报废成本

      this.allTableData.makeCost.records.forEach(item => {
        productionSummary = math.add(productionSummary, math.bignumber(item.totalCost || 0)) // 计算头表制造成本
        scrapSummary = math.add(scrapSummary, math.bignumber(item.lossCost || 0)) // 计算报废成本
      })
      this.allTableData.rawMaterial.records.forEach(item => {
        scrapSummary = math.add(scrapSummary, math.bignumber(item.lossCost || 0)) // 计算报废成本
      })

      this.$set(this.topTableData.tableData[0], "productionSummary", productionSummary.toFixed(4))
      this.$set(this.allTableData.discardCost[0], "amount", scrapSummary.toFixed(4))
      this.$set(this.topTableData.tableData[0], "scrapSummary", scrapSummary.toFixed(4))

      // 计算报废率
      if (math.evaluate(`${ this.topTableData.tableData[0].materialSummary || 0 } + ${ this.topTableData.tableData[0].productionSummary || 0 }`) === "0") {
        this.$set(this.allTableData.discardCost[0], "ratio", 0)
      } else {
        this.$set(this.allTableData.discardCost[0], "ratio", math.evaluate(`${ this.allTableData.discardCost[0].amount } / (${ this.topTableData.tableData[0].materialSummary || 0 } + ${ this.topTableData.tableData[0].productionSummary || 0 })`).toFixed(4))
      }

      this.$set(this.allTableData.manageFee[1], "amount", math.evaluate(`${ this.topTableData.tableData[0].productionSummary } * (${ this.allTableData.manageFee[1].ratio } / 100)`).toFixed(4))
      this.$set(this.allTableData.manageFee[1], "blockAmount", math.evaluate(`${ this.allTableData.manageFee[1].amount } * 1`).toFixed(4))

      this.$set(this.allTableData.profit[1], "amount", math.evaluate(`${ this.topTableData.tableData[0].materialSummary } * (${ this.allTableData.profit[1].ratio } / 100)`).toFixed(4))
      this.$set(this.allTableData.profit[1], "blockAmount", math.evaluate(`${ this.allTableData.profit[1].amount } * 1`).toFixed(4))
    
      const manageSummary = this.allTableData.manageFee.reduce((acc, cur) => {
        return math.add(acc, math.bignumber(cur.amount || 0))
      }, 0)
      this.$set(this.topTableData.tableData[0], "manageSummary", manageSummary.toFixed(4))

      const profitSummary = this.allTableData.profit.reduce((acc, cur) => {
        return math.add(acc, math.bignumber(cur.amount || 0))
      }, 0)
      this.$set(this.topTableData.tableData[0], "profitSummary", profitSummary.toFixed(4))
    },

    handleInputByManageFee(value, row) {
      this.$set(row, "amount", math.evaluate(`${ this.topTableData.tableData[0].productionSummary } * (${ row.ratio || 0 } / 100)`).toFixed(4))
      this.$set(row, "blockAmount", math.evaluate(`${ row.amount || 0 } * 1`).toFixed(4))

      const manageSummary = this.allTableData.manageFee.reduce((acc, cur) => {
        return math.add(acc, math.bignumber(cur.amount || 0))
      }, 0)
      this.$set(this.topTableData.tableData[0], "manageSummary", manageSummary.toFixed(4))
    },

    handleInputByProfit(value, row) {
      this.$set(row, "amount", math.evaluate(`${ this.topTableData.tableData[0].productionSummary } * (${ row.ratio || 0 } / 100)`).toFixed(4))
      this.$set(row, "blockAmount", math.evaluate(`${ row.amount || 0 } * 1`).toFixed(4))

      const profitSummary = this.allTableData.profit.reduce((acc, cur) => {
        return math.add(acc, math.bignumber(cur.amount || 0))
      }, 0)
      this.$set(this.topTableData.tableData[0], "profitSummary", profitSummary.toFixed(4))
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
