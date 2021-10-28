<!--
 * @Author: ldh
 * @Date: 2021-04-21 15:35:19
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-27 17:39:57
 * @Description: In User Settings Edit
 * @FilePath: \front-modules\web\quotationdetail\index.vue
-->
<template> 
  <iPage class="quotation">
    <div class="margin-bottom20 clearFloat">
      <span v-if="!fix" class="font18 font-weight">{{ $t('LK_QIEHUANLINGJIAN') }}：</span>
      <!---------------------------------------无论任何情况下，就算是查看详情，也可以切换其他零件-------------------->
      <iSelect class="part" popper-class="partSelect" v-model="fsNum" placeholder="" @change="handlePartChange">
        <el-option
          v-for="part in parts"
          :key="part.key"
          :label="part.label"
          :value="part.value">
          <div class="partItem">
            <span>{{ part.label }}</span>
            <icon v-if="part.isSubmited" class="icon" symbol name="iconxialakuang_qiehuanlingjian_yiwancheng" />
          </div>
        </el-option>
      </iSelect> 
      <!-- <span v-else class="font18 font-weight">{{ partInfo && partInfo.label }}</span> -->
      <!-------------采购员界面跳转过来的时候，如果出现当前供应商还未接受报价情况----------------->
      <div class="floatright" v-if='acceptQuotation'>
        <div v-if='!acceptQuotationDisabled'>
          <iButton @click="agreePrice">接受报价</iButton>
          <iButton @click="rejectPrice">拒绝报价</iButton>
        </div>
      </div>
      <div class="floatright" v-else>
        <span v-if="agentQutation" class="margin-right10">
          <iButton v-if="!disabled && !isSteel && agentQutationDisabled" @click="handleAgentQutation">{{ $t("LK_DAIGONGYINGSHANGBAOJIA") }}</iButton>
          <iButton v-if="!disabled && !agentQutationDisabled" @click="handleCancelQutation">{{ $t("LK_QUXIAO") }}</iButton>
        </span>
        <span v-if="!agentQutationDisabled">
          <iButton v-if="!partInfo.isOriginprice && partInfo.partProjectType === partProjTypes.PEIJIAN && !disabled" :loading="quoteBatchPriceLoading" @click="handleQuoteBatchPrice">{{ $t("LK_YINYONGPILIANGJIAGE") }}</iButton>
          <iButton v-if="partInfo.isOriginprice && partInfo.partProjectType === partProjTypes.PEIJIAN && !disabled" :loading="cancelQuoteBatchPriceLoading" @click="handleCancelBatchPrice">{{ $t("LK_QUXIAOPILIANGJIAGE") }}</iButton>
          <iButton @click="handleSave" v-if="currentTab != 'infoAndReq' && !disabled" :loading="saveLoading">{{ $t('LK_BAOCUN') }}</iButton>
          <iButton @click="handleSubmit" v-if="!disabled" :loading="submitLoading">{{ $t('LK_TIJIAO') }}</iButton>
        </span>
        <logButton class="margin-left20" @click="log" />
        <span class="margin-left20">
					<icon symbol name="icondatabaseweixuanzhong" class="font18"></icon>
				</span>
      </div>
    </div>
    <iCard class="info" :title="$t('LK_JICHUXINXI')" collapse v-loading="partInfoLoading">
      <iFormGroup :key="$index" :row="4" inline>
        <iFormItem v-for="item in partInfoItems.slice(0, partInfoItems.length - 1)" :key="item.props" :label="$t(item.key)">
          <iText v-if="item.props === 'submitDate' || item.props === 'currentRoundsEndTime'">{{ partInfo[item.props] | dateFilter }}</iText>
          <iText v-else>{{ partInfo[item.props] }}</iText>
        </iFormItem>
      </iFormGroup>
      <iFormGroup :key="$index" :row="1" inline>
        <iFormItem :key="partInfoItems[partInfoItems.length - 1].props" :label="$t(partInfoItems[partInfoItems.length - 1].key)">
          <iText>{{ partInfo[partInfoItems[partInfoItems.length - 1].props] }}</iText>
        </iFormItem>
      </iFormGroup>
    </iCard>
    <div id="tabList" v-loading="tabLoading">
      <iTabsList class="margin-top20" type="card" v-model="currentTab" :before-leave="tabLeaveBefore" @tab-click="tabChange">
        <el-tab-pane v-for="(tab, $tabIndex) in trueTabs" :key="$tabIndex" :label="$t(tab.key)" :name="tab.name">
          <component :ref="tab.name" :is="component" :partInfo="partInfo" v-for="(component, $componentIndex) in tab.components" :class="$componentIndex !== 0 ? 'margin-top20' : ''" :key="$componentIndex" :disabled="disabled || agentQutationDisabled" :isOriginprice="partInfo.isOriginprice" :isSteel="isSteel" :isDb="isDb" @changeReduceStatus="changeReduceStatus"/>
        </el-tab-pane>
      </iTabsList>
    </div>
    <icon id="tabTip" symbol name="iconbaojiadan-youfujian" />
    <iDialog
       title="请填写拒绝理由"
       width="400px"
      :visible.sync="dialogVisible"
    >
      <iInput v-model="refuseReason" style="margin-bottom:20px;"></iInput>  
      <span slot="footer" class="dialog-footer">
        <iButton @click="dialogVisible = false">取 消</iButton>
        <iButton @click="confrimReject">确 定</iButton>
      </span>
    </iDialog>
    <startProductionDateDialog :visible.sync="startProductionDateDialogVisible" @confirm="confirmQuoteBatchPrice" />
  </iPage>
</template>

<script>
import { iPage, iButton,iDialog, iCard,iInput, iFormGroup, iFormItem, iText, iTabsList, iSelect, icon, iMessage, iMessageBox } from "rise"
import logButton from "./components/logButton"
import { partInfoItems } from "./components/data"
import infoAndReq from "./components/infoAndReq"
import originAndCapacity from "./components/originAndCapacity"
import mouldAndDevelopmentCost from "./components/mouldAndDevelopmentCost"
import costsummary from './components/costsummary'
import sample from "./components/sample"
import filters from "@/utils/filters"
import packAndShip from "./components/packAndShip"
import reducePlan from "./components/reducePlan"
import sampleDeliveryProgress from './components/sampleDeliveryProgress'
import remarksAndAttachment from './components/remarksAndAttachment'
import startProductionDateDialog from "./components/startProductionDateDialog"

import { getPartsQuotations, getStates, submitPartsQuotation, quoteBatchPrice, cancelQuoteBatchPrice, quotations, getNoticeStatus } from "@/api/rfqManageMent/quotationdetail"
import { cloneDeep } from "lodash"
import {partProjTypes} from '@/config'
import { getEnumValue as $enum } from "rise/web/config"
import { getNominateDisabled } from "rise/web/common"
import { priceStatusMixin } from "./components/mixins"

export default {
  components: { 
    iPage, 
    iButton, 
    iCard, 
    iFormGroup, 
    iFormItem, 
    iText, 
    iTabsList,
    iSelect, 
    icon,
    logButton, 
    infoAndReq,
    originAndCapacity,
    mouldAndDevelopmentCost,
    sample,
    packAndShip,
    costsummary,
    reducePlan,
    sampleDeliveryProgress,
    remarksAndAttachment,
    iInput,
    iDialog,
    startProductionDateDialog
  },
  mixins: [ filters, priceStatusMixin ],
  data() {
    return {
      // 零件项目类型
      partProjTypes,
      fsNum: "",
      partNum: "",
      parts: [],
      partInfoItems,
      currentTab: "infoAndReq",
      tabs: [
        { label: "信息与要求", name: "infoAndReq", key: "LK_XINXIYUYAOQIU", components: [ "infoAndReq" ] },
        { label: "报价成本汇总", name: "costsummary", key: "LK_BAOJIACHENGBENHUIZONG", components: ['costsummary'] },
        { label: "供应商生产地及生产能力", name: "originAndCapacity", key: "LK_GONGYINGSHANGSHENGCHANDIJISHENGCHANNENGLI", components: [ "originAndCapacity" ] },
        { label: "模具和开发费用", name: "mouldAndDevelopmentCost", key: "LK_MUJUHEKAIFAFEIYONG", components: [ "mouldAndDevelopmentCost" ] },
        { label: "包装运输", name: "packAndShip", key: "LK_BAOZHUANGYUNSHU", components: [ "packAndShip" ] },
        { label: "降价计划",name:'reducePlan', key: "LK_JIANGJIAJIHUA", components: ["reducePlan"] },
        { label: "送样进度", name: 'sampleDeliveryProgress', key: "LK_SONGYANGJINDU", components: ['sampleDeliveryProgress'] },
        { label: "工装样件", name: "sample", key: "LK_GONGZHUANGYANGJIAN", components: [ "sample" ] },
        { label: "报价备注与附件", name: 'remarksAndAttachment', key: "LK_BAOJIABEIZHUYUFUJIAN", components: ["remarksAndAttachment"] }
      ],

      partInfoLoading: false,
      partInfo: {},

      saveLoading: false,
      submitLoading: false,
      tabLoading: false,
      disabled: true,
      saveStatus: false,
      quoteBatchPriceLoading: false,
      cancelQuoteBatchPriceLoading: false,
      fix: false,
      supplierId: "",
      watingSupplier:false,
      dialogVisible:false,
      refuseReason: "",
      statusObj: {},
      startProductionDateDialogVisible: false,
      rfqRoundStateDisabled: false,
      roundDisabled: false,
      isDb:false,
      isOriginprice: false,

      acceptQuotation: false, // 等待接收报价
      acceptQuotationDisabled: true, // 是否禁用等待接收报价
      agentQutation: false, // 代报价
      agentQutationDisabled: true, // 是否禁用代报价
    }
  },
  provide: function () {
    return {
      updateCbdLevel: this.updateCbdLevel
    }
  },
  computed: {
    // eslint-disable-next-line no-undef
    ...Vuex.mapState({
      userInfo: state => state.permission.userInfo,
    }),
    trueTabs() {
      // Sprint10新增：供应商配件与附件的包装运输页面移除，报价成本汇总页面能够直接填写[原材料/散件成本][制造成本][报废成本][管理费][利润][包装费][运输费][操作费]，起步生产日期不做默认值，L2层级的[包装费][运输费][操作费]也是直接填写
      if (this.partInfo.partProjectType === partProjTypes.PEIJIAN || this.partInfo.partProjectType === partProjTypes.FUJIAN) {
        return this.tabs.filter(item => item.name !== 'packAndShip')
      }
      // Sprint11新增(US:CRW1-1591)：若某一零件的零件项目类型为[DB零件]，或是[一次性采购]且是DB零件，则在我的报价成本汇总页面，我可以看到DB零件的特殊页面
      // DB的报价单共有7个页签，分别是信息与要求，报价分析，降价计划，包装运输，送样进度，工装样件，报价附件与说明。
      if (this.partInfo.partProjectType === partProjTypes.DBLINGJIAN || this.partInfo.partProjectType === partProjTypes.DBYICHIXINGCAIGOU || this.partInfo.priceStatus == "DB") {
        const tabNames = ['infoAndReq','costsummary','packAndShip','reducePlan','sampleDeliveryProgress','sample','remarksAndAttachment']
        return this.tabs.filter(item => tabNames.includes(item.name))
      }
      return this.tabs
    },
    isSteel() {
      return this.partInfo.partProjectType === partProjTypes.GANGCAIPILIANGCAIGOU || this.partInfo.partProjectType === partProjTypes.GANGCAIYICIXINGCAIGOU
    }
  },
  watch: {
    "statusObj.containCommentsAndFiles"(status) {
      this.$nextTick(() => {
        const tabListDom = this.$el.querySelector("#tabList")
        const tabTipDom = this.$el.querySelector("#tabTip")

        if (status && !this.userInfo.supplierId) {
          if (this.$el && tabListDom) {
            const dom = tabListDom.querySelector("#tab-remarksAndAttachment")
            dom.appendChild(tabTipDom)
            tabTipDom.style.position = "absolute"
            tabTipDom.style.opacity = "1"
          }
        } else {
          tabTipDom.style.position = "fixed"
          tabTipDom.style.opacity = "0"
        }
      })
    },
    isSteel(value) {
      if (value) {
        this.tabs = this.tabs.filter(item => item.name === "infoAndReq" || item.name === "costsummary" || item.name === "remarksAndAttachment")
        this.disabled = true
      }
    }
  },
  created() {
    this.supplierId = this.$route.query.supplierId || this.userInfo.supplierId
    if (this.$route.query.fix) {
      this.fix = true
    }
    this.partNum = this.$route.query.partNum || ''
    this.fsNum = this.$route.query.fsNum || ''
    this.partInfo.partNum = this.$route.query.partNum || ''
    this.partInfo.fsNum = this.$route.query.fsNum || ''
    this.partInfo.quotationId = this.$route.query.quotationId || ''
    //保证初始化状态不被重写 当前方法中 会重写disabel状态
    this.getPartsQuotations()
    // .then(()=>{ if (this.$route.query.agentQutation) {
    //   this.disabled = true
    // }});
  },
  methods: {
    getNoticeStatus() {
      this.agentQutationLoading = true

      return new Promise(resolve => {
        getNoticeStatus({
          supplierId: this.supplierId,
          type: "RFQ" // 该字段必传，但是这个把RFQ和CARBON的状态都返回了，所以这个接口只用调一次
        })
        .then(res => {
          if (res.code == 200) {
            // rfqStatus 询价承诺书状态  carbonStatus 可再生能源使用承诺书状态
            if (!+res.data.rfqStatus) { // 0 拒绝  1同意 
              iMessage.warn(this.language("GONGYINGSHANGWEIQIANSHUXUNJIACHENGNUOSHU", "供应商未签署《询价承诺书》，不可代报价"))
              resolve(false)
            } else {
              resolve(true)
            }
          } else {
            iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
            resolve(false)
          }
        })
        .finally(() => this.agentQutationLoading = false)
      })
    },
    /**
     * @description: 确认拒接按钮 
     * @param {*}
     * @return {*}
     */
    confrimReject() {
      if (!this.refuseReason) {
        return iMessage.warn('拒绝理由不能为空')
      }

      this.updateQuotations(2)
    },
    /**
     * @description: 接受报价按钮 
     * @param {*}
     * @return {*}
     */
    async agreePrice() {
      const status = await this.getNoticeStatus()
      if (!status) return
      
      this.updateQuotations(1)
    },
    async rejectPrice() {
      const status = await this.getNoticeStatus()
      if (!status) return

      this.dialogVisible = true
    },
       /**
     * @description: 签收拒绝 
     * @param {*} type
     * @return {*}
     */    
    updateQuotations(type) {
      const sendData = {
        acceptType:type,
        rfqRoundInfoList:[{rounds:this.$route.query.round,rfqId:this.$route.query.rfqId}],
        supplierId: this.supplierId || this.$route.query.supplierId,
        refuseReason: this.refuseReason
      }

      quotations({ rfqAcceptQuotationScenes: sendData }).then(res=>{
        if(res.code == 200){
          this.getPartsQuotations()
          iMessage.success('操作成功！')
          this.dialogVisible = false
        }else{
          iMessage.error(res.desZh)
          this.dialogVisible = false
        }
      }).catch(err=>{
        iMessage.error(err.desZh)
      })
    },
    log() {},
    getPartsQuotations(type) {
      return new Promise(r=>{
         this.partInfoLoading = true

      getPartsQuotations({
        rfqId: this.$route.query.rfqId,
        round: this.$route.query.round,
        supplierId: this.supplierId
      })
      .then(res => {
        if (res.code == 200) {
          let currentPart = {}
          this.parts = 
            Array.isArray(res.data) ? 
            res.data.map(item => {
              const result = {
                ...item,
                label: `${ item.partNum }_${ item.fsNum }_${ item.procureFactoryName }_${ item.partProjectStatusDesc }`,
                value: item.fsNum,
                key: item.fsNum
              }

              if (result.fsNum == this.fsNum) currentPart = cloneDeep(result)

              return result
            }) : 
            []

          this.partInfo = cloneDeep(currentPart)

          this.getStates().then(()=>{r()})

          if (type != "save") {
            this.$nextTick(() => {
              // this.tabs.forEach(tab => {
              //   const component = this.$refs[tab.name][0]
              //   if (typeof component.init === "function") component.init()
              // })

              const component = this.$refs[this.currentTab][0]
              if (typeof component.init === "function") component.init("redraw")
            })
          }

          if(this.partInfo.partProjectType == partProjTypes.DBLINGJIAN || this.partInfo.priceStatus == "DB"){
            this.isDb = true
          }
        } else {
          r()
          iMessage.error(this.$i18n.locale === 'zh' ? res.desZh : res.desEn)
          this.parts = []
          this.partInfo = {}
        }

        this.partInfoLoading = false
      })
      .catch(() => {
        r()
        this.parts = []
        this.partInfo = {}
        this.partInfoLoading = false
      })
      })
    },
    getStates() {
      return new Promise(r=>{
              this.tabLoading = true
      getStates({
        fsNum: this.partInfo.fsNum,
        quotationId: this.partInfo.quotationId,
        rfqId: this.partInfo.rfqId,
      })
      .then(res => {
        if (res.code == 200) {
          try {
          this.tabLoading = false
          let fsStateDisabled = res.data.fsStateCode != $enum("PURCHASE_PROJECT_STATE_ENUM.HAS_RFQ") && res.data.fsStateCode != $enum("PURCHASE_PROJECT_STATE_ENUM.APPLICATION_DESIGNAT")
          let rfqStateDisabled = res.data.rfqStateCode != $enum("RFQ_STATE_ENUM.INQUIRY_ING") && res.data.rfqStateCode != $enum("RFQ_STATE_ENUM.NEGOTIATE_ING")
          let quotationStateDisabled = res.data.quotationStateCode == $enum("PART_QUOTATION_STATE_ENUM.NOT_QUOTED") || res.data.quotationStateCode == $enum("PART_QUOTATION_STATE_ENUM.REFUSE")
          let rfqRoundStateDisabled = res.data.rfqRoundStateCode != $enum("RFQ_ROUNDS_STATE_ENUM.RUNNING")
          let roundDisabled = +this.partInfo.round != +res.data.currentRounds

          this.fsStateDisabled = fsStateDisabled // 供代供应商报价判断
          this.rfqStateDisabled = rfqStateDisabled
          this.rfqRoundStateDisabled = rfqRoundStateDisabled
          this.roundDisabled = roundDisabled
          this.disabled = fsStateDisabled || rfqStateDisabled || quotationStateDisabled || rfqRoundStateDisabled || roundDisabled
          this.acceptQuotationDisabled = fsStateDisabled || rfqStateDisabled || rfqRoundStateDisabled || roundDisabled // 是否禁用接受报价
          this.agentQutation = false

          // console.log("this.fsStateDisabled", this.fsStateDisabled)
          // console.log("this.rfqStateDisabled", this.rfqStateDisabled)
          // console.log("this.rfqRoundStateDisabled", this.rfqRoundStateDisabled)
          // console.log("this.roundDisabled", this.roundDisabled)

          if (this.$route.query.watingSupplier) { // 代报价
            this.acceptQuotation = res.data.quotationStateCode == $enum("PART_QUOTATION_STATE_ENUM.NOT_QUOTED") // 待接收判断
            this.agentQutation = true
            //当前操作如果是已经提交了报价，（采购员替供应商，则需要主动将按钮自动重置为 '代供应商报价' 按钮状态）
            if(res.data.quotationStateCode == $enum("PART_QUOTATION_STATE_ENUM.DELEGATE_SUBMITTED")){
              this.agentQutationDisabled = true
            }
          } else {
            this.agentQutationDisabled = false
          }

          this.statusObj = res.data

          if (this.fix) { //当存在这个状态的时候 整个界面是一个静态界面 不会存在其他状态
            this.acceptQuotation = false
            this.agentQutation = false
            this.acceptQuotationDisabled = true
            this.agentQutationDisabled = true
            this.disabled = true
          }

          if (getNominateDisabled({ applicationStatus: this.partInfo.applicationStatus, designateType: this.partInfo.nominateProcessType, isPriceConsistent: this.partInfo.isPriceConsistent })) {
            this.acceptQuotation = false
            this.agentQutation = false
            this.acceptQuotationDisabled = true
            this.agentQutationDisabled = true
            this.disabled = true
          }
          r()
          } catch(e) {
            console.log(e)
          }
        } else {
          r()
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      })
      .catch(() => {this.tabLoading = false;r()})
      })
    },
    // 保存
    async handleSave(type) {
      const component = this.$refs[this.currentTab][0]
      if (typeof component.save !== "function") throw ""

      this.saveLoading = true

      try {
        await component.save(type)
        this.getPartsQuotations("save")
      } finally {
        this.saveLoading = false
      }
      
      // try {
      //   const res = await component.save(type)
      //   this.getPartsQuotations("save")
      //   if (this.$route.query.watingSupplier) {
      //     // this.$route.query.watingSupplier = false
      //   }
      //   // this.saveStatus = false

      //   return res
      // } catch(e) {
      //   throw e
      // } finally {
      //   this.saveLoading = false
      // }
    },
    handlePartChange(partNum) {
      const part = this.parts.filter(item => item.value === partNum)[0]
      this.partInfo = cloneDeep(part)
      this.partNum = partNum
      
      this.$nextTick(() => {
        // this.tabs.forEach(tab => {
        //   const component = this.$refs[tab.name][0]
        //   if (typeof component.init === "function") component.init()
        // })

        const component = this.$refs[this.currentTab][0]
        if (typeof component.init === "function") component.init("redraw")
      })
      
      this.getStates()
    },
    // 提交
    async handleSubmit() {
      this.submitLoading = true

      try {
        if (this.$refs[this.currentTab][0] && typeof this.$refs[this.currentTab][0].save === "function") {
          await this.handleSave("submit")
        }
        
        submitPartsQuotation({
          quotationId: this.partInfo.quotationId,
          rfqId: this.partInfo.rfqId,
          cbdLevel: this.partInfo.currentCbdLevel || this.partInfo.cbdLevel,
          isOriginprice: this.partInfo.isOriginprice
        })
        .then(res => {
          if (res.code == 200) {
            iMessage.success(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
            this.getPartsQuotations()
          } else {
            iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
          }
        }).finally(() => this.submitLoading = false)
      } catch(e) {
        this.submitLoading = false
      }
    },
    tabLeaveBefore(active) {
      if (this.saveStatus) {
        iMessageBox("当前内容暂未保存，您是否要离开？")
        .then(() => {
          this.saveStatus = false
          this.currentTab = active
        })

        return false
      }
    },
    saveStatusChange(status) {
      this.saveStatus = status
    },
    tabChange() {
      this.$nextTick(() => {
        const component = this.$refs[this.currentTab][0]
        if (typeof component.init === "function") component.init()
      })
    },
    updateCbdLevel(val) {
      this.$set(this.partInfo, "currentCbdLevel", val)
    },
    // 代供应商报价
    handleAgentQutation() {
      this.agentQutationDisabled = false
    },
    // 取消代供应商报价
    handleCancelQutation() {
      this.agentQutationDisabled = true 
      this.$nextTick(() => {
        const component = this.$refs[this.currentTab][0]
        if (typeof component.init === "function") component.init()
      })
    },
    // 引用批量价格
    handleQuoteBatchPrice() {
      this.startProductionDateDialogVisible = true
    },
    confirmQuoteBatchPrice(date) {
      this.quoteBatchPriceLoading = true

      quoteBatchPrice({
        partNum: this.partInfo.partNum,
        quotationId: this.partInfo.quotationId,
        sopDate: date,
        supplierId: this.supplierId
      })
      .then(res => {
        const message = this.$i18n.locale === "zh" ? res.desZh : res.desEn

        if (res.code == 200) {
          iMessage.success(message)
          this.getPartsQuotations()
        } else {
          iMessage.error(message)
        }
      })
      .finally(() => {
        this.quoteBatchPriceLoading = false
      })
    },
    // 取消引用批量价格
    handleCancelBatchPrice() {
      this.cancelQuoteBatchPriceLoading = true

      cancelQuoteBatchPrice({
        quotationId: this.partInfo.quotationId
      })
      .then(res => {
        const message = this.$i18n.locale === "zh" ? res.desZh : res.desEn

        if (res.code == 200) {
          iMessage.success(message)
          this.getPartsQuotations()
        } else {
          iMessage.error(message)
        }
      })
      .finally(() => this.cancelQuoteBatchPriceLoading = false)
    }
  }
};
</script>

<style lang="scss" scoped>
.quotation {
  .part {
    width: 527px;
    height: 30px;

    ::v-deep input {
      font-weight: bold;
      font-size: 20px;
      height: 30px;
      padding-left: 20px;
    }
  }

  .info {
    ::v-deep .cardHeader {
      padding: 20px 40px;
      justify-content: space-between;

      .title {
        font-size: 18px;
        color: #131523;
        font-weight: bold;
      }
    }

    ::v-deep .cardBody {
      padding: 0 40px;
    }

    ::v-deep .el-form-item__label {
      width: 140px;
      font-size: 16px;
    }
  }

  #tabTip {
    position: fixed;
    opacity: 0;
    top: -5px;
    right: -10px;
    width: 20px;
    height: 20px;
  }
}

.partItem {
  height: 56px;
  font-size: 18.5px;
  padding: 14px 40px 14px 20px;
  position: relative;
  line-height: 28px;

  .icon {
    position: absolute;
    top: 50%;
    right: 16px;
    transform: translate(0, -50%);
  }
}
</style>