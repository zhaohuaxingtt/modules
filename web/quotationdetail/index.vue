<!--
 * @Author: ldh
 * @Date: 2021-04-21 15:35:19
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-05-25 16:52:05
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\index.vue
-->
<template> 
  <iPage class="quotation">
    <div class="margin-bottom20 clearFloat">
      <span class="font18 font-weight">{{ $t('LK_QIEHUANLINGJIAN') }}：</span>
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
      <div class="floatright">
        <iButton @click="handleSave" v-if="currentTab != 'infoAndReq' && !disabled" :loading="saveLoading">{{ $t('LK_BAOCUN') }}</iButton>
        <iButton @click="handleSubmit" v-if="!disabled" :loading="submitLoading">{{ $t('LK_TIJIAO') }}</iButton>
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
    <div v-loading="tabLoading">
      <iTabsList class="margin-top20" type="border-card" v-model="currentTab" :before-leave="tabLeaveBefore" @tab-click="tabChange">
        <el-tab-pane v-for="(tab, $tabIndex) in tabs" :key="$tabIndex" :label="$t(tab.key)" :name="tab.name">
          <component :ref="tab.name" :is="component" :partInfo="partInfo" v-for="(component, $componentIndex) in tab.components" :class="$componentIndex !== 0 ? 'margin-top20' : ''" :key="$componentIndex" :disabled="disabled" />
        </el-tab-pane>
      </iTabsList>
    </div>
  </iPage>
</template>

<script>
import { iPage, iButton, iCard, iFormGroup, iFormItem, iText, iTabsList, iSelect, icon, iMessage, iMessageBox } from "rise"
import logButton from "./components/logButton"
import { partInfoItems } from "./components/data"
import infoAndReq from "./components/infoAndReq"
import originAndCapacity from "./components/originAndCapacity"
import mouldAndDevelopmentCost from "./components/mouldAndDevelopmentCost"
import costsummary from './components/costsummary'
import sample from "./components/sample"
import filters from "@/utils/filters"
import packAndShip from "./components/packAndShip"

import { getPartsQuotations, getStates, submitPartsQuotation } from "@/api/rfqManageMent/quotationdetail"
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
    costsummary
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
        // { label: "降价计划", key: "LK_JIANGJIAJIHUA", components: [] },
        // { label: "送样进度", key: "LK_SONGYANGJINDU", components: [] },
        { label: "工装样件", name: "sample", key: "LK_GONGZHUANGYANGJIAN", components: [ "sample" ] },
        // { label: "报价备注与附件", key: "LK_BAOJIABEIZHUYUFUJIAN", components: [] }
      ],

      partInfoLoading: false,
      partInfo: {},

      saveLoading: false,
      submitLoading: false,
      tabLoading: false,
      disabled: true,
      saveStatus: false
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
  },
  created() {
    this.partNum = this.$route.query.partNum
    this.fsNum = this.$route.query.fsNum
    this.getPartsQuotations()
  },
  methods: {
    log() {},
    getPartsQuotations(type) {
      this.partInfoLoading = true

      getPartsQuotations({
        rfqId: this.$route.query.rfqId,
        round: this.$route.query.round,
        supplierId: this.userInfo.supplierId
      })
      .then(res => {
        if (res.code == 200) {
          let currentPart = {}
          this.parts = 
            Array.isArray(res.data) ? 
            res.data.map(item => {
              if (item.fsNum == this.fsNum) currentPart = item

              return {
                ...item,
                label: `${ item.partNum }_${ item.fsNum }_${ item.procureFactoryName }`,
                value: item.fsNum,
                key: item.fsNum
              }
            }) : 
            []

          this.partInfo = cloneDeep(currentPart)

          this.getStates()


          if (type != "save") {
            this.$nextTick(() => {
              // this.tabs.forEach(tab => {
              //   const component = this.$refs[tab.name][0]
              //   if (typeof component.init === "function") component.init()
              // })

              const component = this.$refs[this.currentTab][0]
              if (typeof component.init === "function") component.init()
            })
          }
        } else {
          iMessage.error(this.$i18n.locale === 'zh' ? res.desZh : res.desEn)
          this.parts = []
          this.partInfo = {}
          this.disabled = true
        }

        this.partInfoLoading = false
      })
      .catch(() => {
        this.parts = []
        this.partInfo = {}
        this.partInfoLoading = false
        this.disabled = true
      })
    },
    getStates() {
      this.tabLoading = true
      getStates({
        fsNum: this.partInfo.fsNum,
        quotationId: this.partInfo.quotationId,
        rfqId: this.partInfo.rfqId,
      })
      .then(res => {
        if (res.code == 200) {
          let fsStateDisabled = res.data.fsStateCode != "12"
          let rfqStateDisabled = res.data.rfqStateCode != "01" && res.data.rfqStateCode != "03"
          let quotationStateDisabled = res.data.quotationStateCode == "0" || res.data.quotationStateCode == "2" || res.data.quotationStateCode == "6"
          let rfqRoundStateDisabled = res.data.rfqRoundStateCode != "01"
          let roundDisabled = +this.partInfo.round != +res.data.currentRounds
          this.disabled = fsStateDisabled || rfqStateDisabled || quotationStateDisabled || rfqRoundStateDisabled || roundDisabled

        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }

        this.tabLoading = false
      })
      .catch(() => this.tabLoading = false)
    },
    // 保存
    async handleSave() {
      const component = this.$refs[this.currentTab][0]
      if (typeof component.save === "function") {
        this.saveLoading = true
        try {
          await component.save()
          this.getPartsQuotations("save");
          this.saveStatus = false
        } finally {
          this.saveLoading = false
        }
      }
    },
    handlePartChange(partNum) {
      const part = this.parts.filter(item => item.value === partNum)[0]
      this.partInfo = cloneDeep(part)
      
      this.$nextTick(() => {
        // this.tabs.forEach(tab => {
        //   const component = this.$refs[tab.name][0]
        //   if (typeof component.init === "function") component.init()
        // })

        const component = this.$refs[this.currentTab][0]
        if (typeof component.init === "function") component.init()
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
    tabLeaveBefore(active, old) {
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