<!--
 * @Author: yuszhou
 * @Date: 2021-04-23 15:34:10
 * @LastEditTime: 2021-06-14 14:20:46
 * @LastEditors: ldh
 * @Description: 报价成本汇总界面          
                  1）对于用户来说，在报价详情页通用的功能键包括“保存”、“下载”和“上传报价”
                  2）用户点击“保存”按钮，则保存当前页面已经编辑和输入的所有信息
                  3）若用户在未点击“保存”的情况下点击“下载”按钮，则将报价模板下载到本地；若用户在点击了“保存”之后再点击“下载”按钮，则最后一次保存后的信息内容会随着模板一起下载到本地
                  4）若用户点击“上传报价”按钮，则是将使用模板在本地填写的报价信息上传到系统，系统界面中的信息刷新成本地填写的相关报价信息
                  5）若采购员想帮助供应商进行代报价，则需要先点击“代供应商报价”按钮，才可以对页面进行编辑操作
 * @FilePath: \front-modules\web\quotationdetail\components\costsummary\index.vue
-->

<template>
  <div class="cost">
    <!--------------------------------------------------------->
    <!----------------------百分比模块-------------------------->
    <!--------------------------------------------------------->
    <persentComponents ref='components' :cbdlist='cbdlist' :quotationId='partInfo.quotationId' :tableData='topTableData' :disabled='disabled' :allTableData='allTableData' :partType="partInfo.partType" :partProjectType="partInfo.partProjectType"></persentComponents>
    <!--------------------------------------------------------->
    <!----------------------2.1 原材料/散件--------------------->
    <!--------------------------------------------------------->
    <tableTemlate v-show='allTableData.level > 1' :index='true' pageNationReq='queryRawMaterialDTO' pageNationRes='rawMaterial' :notEdit='disabled' :tableData='allTableData.rawMaterial.records' class="margin-top20" :title="`${allTableData.level}.1 ${$t('LK_YUANCLSJ')}`" :tableTile='titleYcl' :iPagination='disabled' tableIndexString='C'></tableTemlate>
    <!-- <tableTemlate 
      index
      v-if='allTableData.level == 3' 
      :title="`${ allTableData.level }.1 ${$t('LK_YUANCLSJCB')}`" 
      :tableTile='titleYclByL3' /> -->
    <!--------------------------------------------------------->
    <!----------------------2.2 制造成本--------------------->
    <!--------------------------------------------------------->
    <tableTemlate v-show='allTableData.level > 1' :index='true' pageNationReq='queryMakeCostDTO' pageNationRes='makeCost' :notEdit='disabled' :tableData='allTableData.makeCost.records'  class="margin-top20" :title="`${allTableData.level}.2 ${$t('LK_ZHIZHAOCB')}`" :tableTile='titleCbzz' :iPagination='disabled' tableIndexString='P'></tableTemlate>
    <!--------------------------------------------------------->
    <!-------2.2 报废成本 管理费 其他费用 利润--------------------->
    <!--------------------------------------------------------->
    <el-row class="row" v-show='allTableData.level > 1'>
      <el-col class="col" :span='12'>
        <tableTemlate :notEdit='disabled' :tableData='allTableData.discardCost' class="margin-top20" :index='true' :title="`${allTableData.level}.3 ${$t('LK_BAOFEICHENGBEN')}`" :tableTile='titlebfcb' tableIndexString='S'></tableTemlate>
      </el-col>
      <el-col class="col" :span='12'>
        <tableTemlate :notEdit='disabled' :tableData='allTableData.manageFee' class="margin-top20" :index='true' :title="`${allTableData.level}.4 ${$t('LK_GUANLIFEI')}`" :tableTile='titleglf' tableIndexString='O'></tableTemlate>
      </el-col>
    </el-row>
    <el-row class="row" v-show='allTableData.level > 1'>
      <el-col class="col" :span='12'>
        <tableTemlate :notEdit='disabled' :tableData='allTableData.otherFee' class="margin-top20" :index='true' :title="`${allTableData.level}.5 ${$t('LK_QITAFEIYONG')}`" :tableTile='titleqtfy' tableIndexString='A'></tableTemlate>
      </el-col>
      <el-col class="col" :span='12'>
        <tableTemlate :notEdit='disabled' :tableData='allTableData.profit' class="margin-top20" :index='true' :title="`${allTableData.level}.6 ${$t('LK_LIRUN')}`" :tableTile='titlelr' tableIndexString='P'></tableTemlate>
      </el-col>
    </el-row>
    <!--------------------------------------------------------->
    <!----------------------2.2 制造成本------------------------>
    <!--------------------------------------------------------->
    <tableTemlate class="margin-top20" :cbdSelect='cbdSelect' pageNationReq='cbd' pageNationRes='cbd' title="CBD" selection :tableData='tableDataCbd' :tableTile='titleCBD' iPagination>
      <iButton @click="downLoadFile">{{$t('LK_XIAZAI')}}</iButton>
      <iButton v-if='!disabled' @click="disabel">{{$t('delete')}}</iButton>
    </tableTemlate>
  </div>
</template>
<script>
import persentComponents from './components/timeAndlevTabel'
import tableTemlate from './components/tableTemlate'
import {persentDatalist,titleYcl,titleCbzz,titlebfcb,titleglf,titleqtfy,titlelr,titleCBD,allpagefrom,needContactData,Aprice,getAallPrice,getPersent,cbdlist} from './components/data'
// titleYclByL3
import {iButton,iMessage} from 'rise'
import {getCostSummary,packageTransport} from '@/api/rfqManageMent/rfqDetail'
import {findFiles,postCostSummary,deleteFile,savePackageTransport} from '@/api/rfqManageMent/quotationdetail'
import {downloadFile} from '@/api/file'
import {selectDictByKeyss} from '@/api/dictionary'
export default{
  components:{persentComponents,tableTemlate,iButton},
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
      // titleYclByL3
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
    }
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
  methods:{    
    translateDicKeyCodeToName(list){
      if(!list) return
      list.forEach((items,index)=>{
        items.code = items.name
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
        }else{
          this.titleYcl = titleYcl()
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
      const fileList = {
        applicationName:'rise/quotation',
        fileList:[]
      }
      this.cbdSelect.list.forEach(res=>{
        fileList.fileList.push(res.fileName)
      })
      if(this.cbdSelect.list.length == 0) return iMessage.warn('请选择cbd文件')
      downloadFile(fileList).then(res=>{
        if(res.code == 200){
          iMessage.success('操作成功！')
        }else{
          iMessage.error(res.desZh)
        }
      }).catch(err=>{
        iMessage.error(err.desZh)
      })
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
          data[i].forEach(items=>{
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
    /**
     * @description: 提交接口save
     * @param {*}
     * @return {*}
     */    
    postCostSummary(){
      const sendData = JSON.parse(JSON.stringify(this.allTableData))
      sendData.makeCost = sendData.makeCost.records
      sendData.rawMaterial = sendData.rawMaterial.records
      sendData['sumDTO'] = this.topTableData.tableData[0]
      sendData['quotationId'] = this.partInfo.quotationId
      sendData['cbdLevel'] = this.allTableData.level
      sendData['sumVO'] = undefined
      sendData['level'] = undefined
      sendData.partType = this.partInfo.partType
      sendData.partProjectType = this.partInfo.partProjectType
      return postCostSummary(this.translateDataForServerce(sendData)).then(res=>{
        if(res.code == 200){
          iMessage.success('操作成功')
          this.updateCbdLevel(this.allTableData.level)
        }else{
          iMessage.error(res.desZh)
        }
      }).catch(err=>{
        iMessage.error(err.desZh)
      })
    },
    /**
     * @description: 初始化界面方法,父界面会在存在参数的情况下来调用
     * @param {*}
     * @return {*}
     */    
    init(){
      this.cbdlist = []
      this.allTableData.level = this.allTableData.level?this.allTableData.level:this.partInfo.currentCbdLevel
      this.allpagefrom.rfqId = this.partInfo.rfqId
      this.allpagefrom.quotationId = this.partInfo.quotationId
      this.allpagefrom['cbdLevel'] = this.allTableData.level?this.allTableData.level:this.partInfo.currentCbdLevel
      this.translateCbdList(this.partInfo.cbdLevel)
      this.getCostSummary()
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
            this.topTableData = this.translateDataTopData(this.allTableData.sumVO, data)
            this.$refs.components.partsQuotationss(this.partInfo.rfqId,this.allpagefrom.quotationId,this.partInfo.round,this.allTableData.level)
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
        }).catch(err=>{
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
    translateDataForRender(data){
      try {
        if(data.currentCbdLevel){
          this.tableData.level = data.currentCbdLevel
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
        data['level'] = this.allTableData.level?this.allTableData.level:this.partInfo.currentCbdLevel
        // eslint-disable-next-line no-undef
        data['startProductDate'] = data.startProductDate?moment(new Date(data.startProductDate)).format('YYYY-MM-DD HH:mm:ss'):''
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
        return data
      } catch (error) {
        return {
            persent:['0','0','0','0','0','0'],
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
    save(){
      if (this.partInfo.partProjectType === 'PT17' || this.partInfo.partProjectType === 'PT18') {
        return Promise.all(this.postCostSummary(), this.saveBzfreeAndYunshuFree())
      } else {
        return this.postCostSummary()
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
