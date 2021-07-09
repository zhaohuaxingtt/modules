<!--
 * @Author: your name
 * @Date: 2021-04-23 15:38:31
 * @LastEditTime: 2021-06-19 13:59:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\costsummary\components\timeAndlevTabel.vue
-->
<template>
  <iCard class="topcontent" v-loading='copeData'>
    <!--------------------------------------------------------->
    <!----------------------搜索区域  -------------------------->
    <!--------------------------------------------------------->        
    <iFormGroup row='4' class="tscss">
      <i-form-item :label="$t('LK_COPE_BAOJIA')" v-if='!disabled'>
        <iSelect :placeholder='$t("partsprocure.CHOOSE")' v-model="selectedList" multiple collapse-tags @visible-change='changeDataCope'>
          <el-option v-for="items in selectList" :key='items.fsNum' :value='items.fsNum' :label="`${ items.partNum }_${ items.fsNum }`"></el-option>
        </iSelect>
      </i-form-item>
      <i-form-item :label="$t('LK_STARTTIME')">
        <iText v-if='disabled'>{{allTableData.startProductDate}}</iText> 
        <iDatePicker v-else v-model="allTableData.startProductDate"></iDatePicker>
      </i-form-item>
      <i-form-item :label="$t('LK_CBDLINEKEY')">
        <iText v-if='disabled'>L{{allTableData.level}}</iText> 
        <iSelect v-else @change='changeCbdLev' :value='allTableData.level'>
          <el-option :value='items.value' :label="items.label" v-for="(items,index) in cbdlist" :key='index'></el-option>
        </iSelect>
      </i-form-item>
      <i-form-item class="rightFloat">
        <el-checkbox v-if='!disabled' v-model="allTableData.editFlag" v-show="allTableData.level > 1">{{$t('LK_SHOUDONGSHURU')}}</el-checkbox>
        <iButton @click="downloadFile" :loading='downLoadLoding'>{{$t('LK_XIAZAICBD')}}</iButton>
        <el-upload
          v-if='!disabled' 
          class="floatright margin-left10"
          :action="uploadUrl + '/cbd-files/uploadPartCbd'"
          :data='{
          "cbdLevel":allTableData.level,
          "quotationId":quotationId}'
          accept='.xlsx'
          style="display:inline-block;"
          :show-file-list='false'
          :on-progress='()=>{uploadLoading=true}'
          :on-error='()=>{uploadLoading=false;iMessage.error("上传失败！")}'
          :on-success='fileSuccess'
        >
          <iButton :loading='uploadLoading'>{{$t('LK_UPLOADBJ')}}</iButton>
        </el-upload>
      </i-form-item>
    </iFormGroup>
    <div class="textAlingRight">{{$t('LK_DANWEI')}}：RMB/Pc.</div>
    <!--------------------------------------------------------->
    <!----------------------表格百分比-------------------------->
    <!--------------------------------------------------------->    
    <tableList :tableTitle='tableTilel1' :notEdit='allTableData.level == 1?false:(!allTableData.editFlag && !disabled)' :tableData='tableData.tableData' class="margin-top10"></tableList>
    <persent v-if='!tableData.persent.every(items=>items == 0)' :persentList='tableData.persent' :realDataList='tableData.tableData'></persent>
  </iCard>
</template>
<script>
import {iCard,iFormGroup,iFormItem,iText,iDatePicker,iSelect,iButton,iMessageBox,iMessage} from 'rise';
import tableList from '../../../../workingRfq/components/tableList'
import {tableTilel1Fn} from './data'
import persent from './persent'
import {partsQuotations,copyPartsQuotation,downPartCbdLoadFile} from '@/api/rfqManageMent/quotationdetail'
export default{
  components:{iCard,iFormGroup,iFormItem,iText,tableList,persent,iDatePicker,iSelect,iButton},
  props:{
    tableData:{
      type:Object,
      default:()=>{
        return {
           persent:[0,0,0,0,0,0],
           tableData:[]
        }
      }
    },
    allTableData:{
      type:Object,
      default:()=>{}
    },
    quotationId:String,
    disabled:Boolean,
    cbdlist:{
      type:Array,
      default:()=> []
    },
    partType: {
      type: String,
      default: '3'
    },
    partProjectType:{
      type:String,
      default:'',
    }
  },
  inject:['vm'],
  data(){
    return {
      uploadUrl:process.env.VUE_APP_SUPPLIER_CBHUIZ,
      tableTilel1:[],
      selectList:[],
      selectedList:[],
      downLoadLoding:false,
      uploadLoading:false,
      copeData:false
    }
  },
  methods:{
    fileSuccess(res){
      if(res.code == 200){
        this.vm.init()
        this.uploadLoading=false;
        iMessage.success("上传成功！")
      }else{
        this.uploadLoading = false;
        iMessage.error(res.desZh)
      }
    },
    /**
     * @description: 转换表格表头，出现不同cbd的时候。需要提示除不同的表头信息 列如 L1:1.1 1.2  1.3 1.4/ L2:2.1 2.2 2.3 .....
     * @param {*} tableTile
     * @return {*}
     */    
    translateTableTileData(lev){
      this.tableTilel1 = tableTilel1Fn(lev, this.partType,this.partProjectType)
    },
    /**
     * @description: 1.变换cbd层级。变换界面展示，影响界面：L1 除了汇总，只留cbd。 L2 替换表头展示的2.x L3:暂时没提供模板。
     *               2.重新获取零件列表数据
     * @param {*} lv
     * @return {*}
     */    
    changeCbdLev(lv){
      this.vm.allTableData.level = lv
      this.vm.init()
      //this.partsQuotationss(this.vm.partInfo.rfqId,this.vm.allpagefrom.quotationId,this.vm.allTableData.level)
    },
    iMessage(content,type){
      if(type) {iMessage.success(content);this.vm.init();return false} 
      return iMessage.error(content)
    },
    copyPartsQuotation(){
      this.copeData = true
      const sendParmars = {partNums:this.selectedList,quotationId:this.quotationId || 123}
      copyPartsQuotation(sendParmars).then(res=>{
        if(res.code == 200){
          this.copeData = false
          this.selectedList = []
          iMessage.success('操作成功！')
        }else{
          this.copeData = false
          this.selectedList = []
          iMessage.error(res.desZh);
        }
      }).catch(err=>{
        this.copeData = false
        this.selectedList = []
        iMessage.error(err.desZh)
      })
    },
    /**
     * @description: 当用户选择零件后，需要将本个报价单复制到这些选择的零件。
     * @param {*} res
     * @return {*}
     */    
    changeDataCope(res){
      if(!res && this.selectedList.length > 0){
        iMessageBox(`您确定要将报价单复制到选中的零件中吗？`).then(() => {
          this.copyPartsQuotation()
        }).catch(() => {
          this.selectedList = []
        })
      }
    },
    /**
     * @description: 获取当前需要复制的零件清单,当前接口在外部调用
     * @param {*}
     * @return {*}
     */    
    partsQuotationss(rfqId,supplierId,lv,lever){
      this.translateTableTileData(lever)
      partsQuotations(rfqId,lv,supplierId).then(res=>{
        if(res.data){
          this.selectList = res.data || []
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    downloadFile(){
      this.downLoadLoding = true
      const sendData ={"cbdLevel": this.allTableData.level,"quotationId": this.quotationId,rfqId:this.vm.partInfo.rfqId,round:this.vm.partInfo.round,fsnrGsnrNum:this.vm.partInfo.fsNum, partNum: this.vm.partInfo.partNum}
      downPartCbdLoadFile(sendData).then(res=>{
        this.downLoadLoding = false
        if(res.code == 200){
          iMessage.success('操作成功！')
        }else{
          iMessage.error(res.desZh)
        }
      }).catch(err=>{
        this.downLoadLoding = false
        iMessage.error(err.desZh)
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.rightFloat{
  float: right!important;
  text-align: right;
  margin-right: 0px;
  .el-checkbox{
    margin-right: 20px;
  }
}
.tscss{
  height: 45px;
  overflow: hidden;
}
.topcontent{
    ::v-deep .el-form-item__label{
    width: 8.75rem;
  }
}
.textAlingRight{
  text-align: right;
  color: #485465;
  font-size: 12px;
}
</style>