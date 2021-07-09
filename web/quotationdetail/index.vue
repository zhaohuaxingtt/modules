<!--
 * @Author: ldh
 * @Date: 2021-04-21 15:35:19
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-08 17:54:33
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
      <div class="floatright" v-if='watingSupplier'>
        <iButton @click="agreePrice">接受报价</iButton>
        <iButton @click="rejectPrice">拒绝报价</iButton>
      </div>
      <div class="floatright" v-else>
        
        <iButton v-if="!forceDisabled && disabled" @click="handleAgentQutation">{{ $t("LK_DAIGONGYINGSHANGBAOJIA") }}</iButton>
        <iButton v-if="!forceDisabled && !disabled" @click="handleCancelQutation">{{ $t("LK_QUXIAO") }}</iButton>
        <iButton v-if="!isQuoteBatchPrice && partInfo.partProjectType === 'PT17' && !disabled" :loading="quoteBatchPriceLoading" @click="handleQuoteBatchPrice">{{ $t("LK_YINYONGPILIANGJIAGE") }}</iButton>
        <iButton v-if="isQuoteBatchPrice && partInfo.partProjectType === 'PT17' && !disabled" :loading="cancelQuoteBatchPriceLoading" @click="handleCancelBatchPrice">{{ $t("LK_QUXIAOPILIANGJIAGE") }}</iButton>
        <iButton @click="handleSave" v-if="currentTab != 'infoAndReq' && !disabled" :loading="saveLoading">{{ $t('LK_BAOCUN') }}</iButton>
        <iButton @click="handleSubmit" v-if="!disabled && !partInfo.isOriginprice" :loading="submitLoading">{{ $t('LK_TIJIAO') }}</iButton>
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
          <component :ref="tab.name" :is="component" :partInfo="partInfo" v-for="(component, $componentIndex) in tab.components" :class="$componentIndex !== 0 ? 'margin-top20' : ''" :key="$componentIndex" :disabled="disabled || partInfo.isOriginprice" @changeReduceStatus="changeReduceStatus"/>
        </el-tab-pane>
      </iTabsList>
    </div>
    <icon id="tabTip" symbol name="iconbaojiadan-youfujian" />
    <iDialog
       title="请填写拒绝理由"
       width="400px"
      :visible.sync="dialogVisible"
    >
      <iInput v-model='rejectRason' style="margin-bottom:20px;"></iInput>  
      <span slot="footer" class="dialog-footer">
        <iButton @click="dialogVisible = false">取 消</iButton>
        <iButton @click="sueReject">确 定</iButton>
      </span>
    </iDialog>
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

import { getPartsQuotations, getStates, submitPartsQuotation, quoteBatchPrice, cancelQuoteBatchPrice } from "@/api/rfqManageMent/quotationdetail"
import { cloneDeep } from "lodash"

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
    iDialog
  },
  mixins: [ filters ],
  data() {
    return {
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
      forceDisabled: true,
      saveStatus: false,
      isQuoteBatchPrice: false,
      quoteBatchPriceLoading: false,
      cancelQuoteBatchPriceLoading: false,
      fix: false,
      supplierId: "",
      watingSupplier:false,
      dialogVisible:false,
      rejectRason:'',
      statusObj: {}
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
      /**
       *  FS("PT05", "FS零件"),
          ONE_TIME_PURCHASE("PT06", "一次性采购"),
          COP("PT07", "COP零件"),
          DB("PT04", "DB零件"),
          DB_CHANGE("PT03", "DB仅零件号更改"),
          CHANGE("PT08", "仅零件号更改"),
          FS_COMMON("PT09", "FS COMMON SOURCING"),
          GS_COMMON("PT10", "GS COMMON SOURCING"),
          GS_PART("PT11", "GS零件"),
          STELL_PATCH("PT12", "钢材批量"),
          STELL_ONE_TIME_PURCHASING("PT13", "钢材一次性采购"),
          SPECIAL("PT01", "SPECIAL零件"),
          OUTSOURCING("PT14", "工序委外"),
          CAPACITY_EXPANSION("PT15", "扩产能"),
          APPRECIATE("PT16", "涨价"),
          FITTING("PT17", "配件"),
          ANNEX("PT18", "附件"),
          AEKO("PT02", "AEKO零件"),
          DB_ONE_TIME_PURCHASE("PT19", "DB一次性采购"),
      */
      // Sprint10新增：供应商配件与附件的包装运输页面移除，报价成本汇总页面能够直接填写[原材料/散件成本][制造成本][报废成本][管理费][利润][包装费][运输费][操作费]，起步生产日期不做默认值，L2层级的[包装费][运输费][操作费]也是直接填写
      if (this.partInfo.partProjectType === 'PT17' || this.partInfo.partProjectType === 'PT18') {
        return this.tabs.filter(item => item.name !== 'packAndShip')
      }
      // Sprint11新增(US:CRW1-1591)：若某一零件的零件项目类型为[DB零件]，或是[一次性采购]且是DB零件，则在我的报价成本汇总页面，我可以看到DB零件的特殊页面
      // DB的报价单共有7个页签，分别是信息与要求，报价分析，降价计划，包装运输，送样进度，工装样件，报价附件与说明。
      if (this.partInfo.partProjectType === 'PT04' || this.partInfo.partProjectType === 'PT19') {
        const tabNames = ['infoAndReq','costsummary','packAndShip','reducePlan','sampleDeliveryProgress','sample','remarksAndAttachment']
        return this.tabs.filter(item => tabNames.includes(item.name))
      }
      return this.tabs
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
    this.getPartsQuotations().then(()=>{ if (this.$route.query.agentQutation) {
      this.disabled = true
      this.forceDisabled = false
    }});
  },
  methods: {
    rejectPrice(){
      this.dialogVisible = true
    },
    /**
     * @description: 确认拒接按钮 
     * @param {*}
     * @return {*}
     */
    sueReject(){},
    /**
     * @description: 接受报价按钮 
     * @param {*}
     * @return {*}
     */
    agreePrice(){},
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
                label: `${ item.partNum }_${ item.fsNum }_${ item.procureFactoryName }`,
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
          this.tabLoading = false
          let fsStateDisabled = res.data.fsStateCode != "12" && res.data.rfqStateCode != "13"
          let rfqStateDisabled = res.data.rfqStateCode != "01" && res.data.rfqStateCode != "03"
          let quotationStateDisabled = res.data.quotationStateCode == "0" || res.data.quotationStateCode == "2" || res.data.quotationStateCode == "6"
          let rfqRoundStateDisabled = res.data.rfqRoundStateCode != "01"
          let roundDisabled = +this.partInfo.round != +res.data.currentRounds
          
          this.disabled = fsStateDisabled || rfqStateDisabled || quotationStateDisabled || rfqRoundStateDisabled || roundDisabled
          if (this.fix) { //当存在这个状态的时候 整个界面是一个静态界面 不会存在其他状态
            this.disabled = true
            this.forceDisabled = true
          }
          if(res.data.quotationStateCode == 0){ //如果采购员是点击横岗过来的 则要看当前报价单的状态
            if(this.$route.query.watingSupplier){
              this.watingSupplier = true
            }
          }else{
            if(this.$route.query.watingSupplier){
              this.watingSupplier = false
              this.forceDisabled = false
              this.disabled = true
            }
          }
          if (res.data.quotationStateCode == "2" || res.data.quotationStateCode == "6") {
            if(this.$route.query.watingSupplier){
              this.fix = true
              this.disabled = true
              this.forceDisabled = true
            } 
          } 
          this.statusObj = res.data
          r()
        } else {
          r()
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      })
      .catch(() => {this.tabLoading = false;r()})
      })
    },
    // 保存
    async handleSave() {
      const component = this.$refs[this.currentTab][0]
      if (typeof component.save === "function") {
        this.saveLoading = true
        try {
          component.save().then(()=>{
            this.getPartsQuotations("save");
          }).catch(()=>{
            this.saveLoading = false
          })          
          this.saveStatus = false
        } finally {
          this.saveLoading = false
        }
      }
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

      await this.handleSave()

      submitPartsQuotation({
        quotationId: this.partInfo.quotationId,
        rfqId: this.partInfo.rfqId,
        cbdLevel: this.partInfo.currentCbdLevel || this.partInfo.cbdLevel
      })
      .then(res => {
        if (res.code == 200) {
          iMessage.success(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
          this.getPartsQuotations()
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }

        this.submitLoading = false
      })
      .catch(() => this.submitLoading = false)
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
      if (this.forceDisabled) return
      this.disabled = false
      this.fix = false
    },
    // 取消代供应商报价
    handleCancelQutation() {
      if (this.forceDisabled) return
      this.disabled = true
      this.$nextTick(() => {
        const component = this.$refs[this.currentTab][0]
        if (typeof component.init === "function") component.init()
      })
    },
    // 引用批量价格
    handleQuoteBatchPrice() {
      this.quoteBatchPriceLoading = true

      quoteBatchPrice({
        partNum: this.partNum,
        quotationId: this.partInfo.quotationId
      })
      .then(res => {
        const message = this.$i18n.locale === "zh" ? res.desZh : res.desEn

        if (res.code == 200) {
          iMessage.success(message)
          this.isQuoteBatchPrice = true
          this.getPartsQuotations()
        } else {
          iMessage.error(message)
        }

        this.quoteBatchPriceLoading = false
      })
      .catch(() => this.quoteBatchPriceLoading = false)
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
          this.isQuoteBatchPrice = false
          this.getPartsQuotations()
        } else {
          iMessage.error(message)
        }

        this.cancelQuoteBatchPriceLoading = false
      })
      .catch(() => this.cancelQuoteBatchPriceLoading = false)
    }
  }
};
</script>

<style lang="scss" scoped>
.quotation {
  .part {
    width: 407px;
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