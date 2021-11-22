<template>
  <iPage class="quotationdetail" v-permission.auto="AEKO_QUOTATION_DETAIL|报价单">
    <div class="margin-bottom20 clearFloat">
      <span class="font18 font-weight">{{ language("AEKOHAO", "AEKO号") }}：{{ basicInfo.aekoCode }}</span>
      <div class="floatright" v-if="!loading">
        <iButton v-permission.auto="AEKO_QUOTATION_DETAIL_BUTTON_TIJIAO|提交" v-if="!disabled && !editDisabled"
                 :loading="submitLoading" @click="handleSubmit">{{ language("TIJIAO", "提交") }}
        </iButton>
        <!-- <logButton class="margin-left20" @click="log" v-permission.auto="AEKO_QUOTATION_DETAIL_BUTTON_RIZHI|日志"/> -->
        <span class="margin-left20">
					<icon symbol name="icondatabaseweixuanzhong" class="font18"/>
				</span>
      </div>
    </div>

    <iCard class="info" v-loading="loading" :title="language('JICHUXINXI', '基础信息')"
           v-permission.auto="AEKO_QUOTATION_DETAIL_VIEW_JICHUXINXI|基础信息">
      <iFormGroup :key="$index" :row="4" inline>
        <iFormItem v-for="item in infoItems" :key="item.props" :label="language(item.key, item.name)"
                   v-permission.dynamic.auto="item.permissionKey">
          <iText>{{ partInfo[item.props] || '-' }}</iText>
        </iFormItem>
      </iFormGroup>
    </iCard>

    <iCard class="margin-top20" v-permission.auto="AEKO_QUOTATION_DETAIL_VIEW_HUIZONG|报价汇总">
      <tableList
          :tableLoading="tableLoading || loading"
          lang
          class="table"
          :selection="false"
          :tableTitle="tableTitle"
          :tableData="tableListData">
        <template #originalAPrice="scope">
          <el-popover
              placement="top"
              trigger="hover">
            <template>
              <p style="text-align:center">{{ scope.row.source }}</p>
            </template>
            <template #reference>
              <span>{{ floatFixNum(scope.row.originalAPrice) }}</span>
            </template>
          </el-popover>
        </template>
        <template #apriceChange="scope"><a class="link-underline" @click="linkTabChange('aPriceChange')">{{ floatFixNum(scope.row.apriceChange) }}</a></template>
        <template #aprice="scope">{{ floatFixNum(scope.row.aprice) }}</template>
        <template #originBnkFee="scope">{{ floatFixNum(scope.row.originBnkFee) }}</template>
        <template #toolingCost="scope"><a class="link-underline" @click="linkTabChange('mouldInvestmentChange')">{{ floatFixNum(scope.row.toolingCost) }}</a></template>
        <template #developmentCost="scope"><a class="link-underline" @click="linkTabChange('developmentFee')">{{ floatFixNum(scope.row.developmentCost) }}</a></template>
        <template #terminationPrice="scope"><a class="link-underline" @click="linkTabChange('damages')" >{{ floatFixNum(scope.row.terminationPrice) }}</a></template>
        <template #sampleCost="scope"><a class="link-underline" @click="linkTabChange('sampleFee')" >{{ floatFixNum(scope.row.sampleCost) }}</a></template>
        <template #bnkFee="scope">
          <el-popover
              placement="top"
              trigger="hover"
              :disabled="scope.row.bnkFee == scope.row.originBnkFee">
            <template>
              <p>{{ language("YUANCHENGYUNFANGSHI", "原承运方式") }}：{{ language("ZIYUN", "自运") }}（{{
                  language("HUO", "或")
                }}{{ language("CHENGYUN", "承运") }}）</p>
              <p>{{ language("XINCHENGYUNFANGSHI", "新承运方式") }}：{{
                  language("CHENGYUN", "承运")
                }}（{{ language("HUOZHE", "或者") }}{{ language("ZIYUN", "自运") }}）</p>
            </template>
            <template #reference>
              <!-- 针对供应商报价可跳转 -->
              <div>
                <span
                    :class="`margin-right5 ${userInfo &&userInfo.userType&&userInfo.userType == 2 ? 'link-underline' : ''}`"
                    @click="goToBNK">{{ floatFixNum(scope.row.bnkFee) }}</span>
                <icon v-if="scope.row.bnkFee != scope.row.originBnkFee" symbol name="iconzengjiacailiaochengben_lan"
                      class="font15 rotate180"/>
              </div>
            </template>
          </el-popover>
        </template>

      </tableList>
    </iCard>

    <iTabsList class="margin-top20" type="card" v-model="currentTab" :before-leave="tabLeaveBefore"
               @tab-click="tabChange">
      <el-tab-pane v-for="(tab, $tabIndex) in tabs" :key="$tabIndex" :label="language(tab.key, tab.label)"
                   :name="tab.name" v-permission.dynamic.auto="tab.permissionKey">
        <template v-if="tab.name == currentTab">
          <component :ref="tab.name" :is="component" v-for="(component, $componentIndex) in tab.components"
                     :class="$componentIndex !== 0 ? 'margin-top20' : ''" :key="$componentIndex" :partInfo="partInfo"
                     :basicInfo="basicInfo" :disabled="disabled" :editDisabled="editDisabled"
                     @getBasicInfo="getBasicInfo" @updateApriceChange="updateApriceChange"/>
        </template>
      </el-tab-pane>
    </iTabsList>
  </iPage>
</template>

<script>
import {iPage, iButton, icon, iCard, iFormGroup, iFormItem, iText, iTabsList, iMessage} from "rise"
import logButton from "rise/web/quotationdetail/components/logButton"
import tableList from "rise/web/quotationdetail/components/tableList"
import aPriceChange from "./components/aPriceChange"
import mouldInvestmentChange from "./components/mouldInvestmentChange"
import developmentFee from "./components/developmentFee"
import damages from "./components/damages"
import sampleFee from "./components/sampleFee"
import {infoItems, tableTitle, floatFixNum} from "./components/data"
import {
  bnkSupplierToken,
  getQuotationInfo,
  submitAekoQuotation,
} from '@/api/aeko/quotationdetail'
import {getStates} from "@/api/rfqManageMent/quotationdetail"
import {getEnumValue as $enum} from "rise/web/config"

export default {
  components: {
    iPage,
    iButton,
    icon,
    iCard,
    iFormGroup,
    iFormItem,
    iText,
    iTabsList,
    logButton,
    tableList,
    aPriceChange,
    mouldInvestmentChange,
    developmentFee,
    damages,
    sampleFee
  },
  data() {
    return {
      submitLoading: false,
      infoItems,
      tableTitle,
      tableListData: [],
      currentTab: "aPriceChange",
      tabs: [
        {
          label: "A价变动(含分摊)",
          name: "aPriceChange",
          key: "AJIABIANDONGHANFENTAN",
          components: ["aPriceChange"],
          permissionKey: "AEKO_QUOTATION_CBD_TAB_BIANDONGZHICBD|变动值CBD"
        },
        {
          label: "模具投资变动",
          name: "mouldInvestmentChange",
          key: "MUJUTOUZIBIANDONG",
          components: ["mouldInvestmentChange"],
          permissionKey: "AEKO_QUOTATION_CBD_TAB_MUJUTOUZIBIANDONG|模具投资变动"
        },
        {
          label: "开发费",
          name: "developmentFee",
          key: "KAIFAFEI",
          components: ["developmentFee"],
          permissionKey: "AEKO_QUOTATION_CBD_TAB_KAIFAFEI|开发费"
        },
        {
          label: "终⽌费",
          name: "damages",
          key: "ZHONGZHIFEI",
          components: ["damages"],
          permissionKey: "AEKO_QUOTATION_CBD_TAB_ZHONGZHIFEI|终⽌费"
        },
        {
          label: "样件费",
          name: "sampleFee",
          key: "YANGJIANFEI",
          components: ["sampleFee"],
          permissionKey: "AEKO_QUOTATION_CBD_TAB_YANGJIANFEI|样件费"
        },
      ],
      aekoCode: '',
      partInfo: {},
      basicInfo: {},
      tableLoading: false,
      disabled: false,
      aprice: 0,
      loading: false,
      // showDialog:false
    }
  },
  created() {
    this.getBasicInfo();
  },
  computed: {
    // 是否显示编辑功能
    editDisabled() {
      return this.$route.query.editDisabled == 'true' ? true : false
    },
    //eslint-disable-next-line no-undef
    ...Vuex.mapState({
      userInfo: state => state.permission.userInfo,
    }),
  },
  provide() {
    return {
      getBasicInfo: this.getBasicInfo,
      allSummaryData: () => this.tableListData
    }
  },
  methods: {
    // 保留千分位
    floatFixNum,
    // 日志
    log() {
      // this.bizId = +this.$route.query.requirementAekoId
      // if(this.bizId)
      // this.showDialog = true
    },
    tabLeaveBefore(active) {
      // if (this.saveStatus) {
      //   iMessageBox("当前内容暂未保存，您是否要离开？")
      //   .then(() => {
      //     this.saveStatus = false
      //     this.currentTab = active
      //   })

      //   return false
      // }
    },
    // 页签切换
    tabChange() {
      this.$nextTick(() => {
        const component = this.$refs[this.currentTab][0]
        if (typeof component.init === "function") component.init()
      })
    },

    linkTabChange(tabName){
      this.currentTab = tabName
      this.tabChange()
    },
    // 获取基础信息
    async getBasicInfo(doNext = true) {
      const {query, path} = this.$route;
      const {quotationId = '', aekoCode = ""} = query;
      this.aekoCode = aekoCode;

      this.loading = true
      await getQuotationInfo(quotationId).then(async (res) => {
        const {code,  data = {}} = res;
        if (code == 200) {
          const {
            aekoPartInfo = {},
            quotationPriceSummaryInfo = {},
            supplierId = '',
            rfqId = '',
            fsnrGsnrNum = '',
            source = '',
            round,
            objectAekoId
          } = data;
          let {supplierCode = ''} = aekoPartInfo
          this.partInfo = {
            ...aekoPartInfo,
            quotationId,
            rfqId,
            fsNum: fsnrGsnrNum,
            round,
            objectAekoId
          };
          this.tableListData = [{...quotationPriceSummaryInfo, source}];
          this.basicInfo = data;
          if (supplierId) {
            this.$router.push({
              path,
              query: {
                ...query,
                supplierId,
                supplierCode
              }
            })
          }

          await this.getStates()

          this.$nextTick(() => {
            const component = this.$refs[this.currentTab][0]
            if (typeof component.init === "function" && doNext) component.init()
          })
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      }).catch((err) => {
      }).finally(() => this.loading = false);
    },

    async getStates() {
      return getStates({
        fsNum: this.partInfo.fsNum,
        quotationId: this.partInfo.quotationId,
        rfqId: this.partInfo.rfqId,
      })
          .then(res => {
            if (res.code == 200) {
              let fsStateDisabled = res.data.fsStateCode != $enum("PURCHASE_PROJECT_STATE_ENUM.HAS_RFQ") && res.data.fsStateCode != $enum("PURCHASE_PROJECT_STATE_ENUM.APPLICATION_DESIGNAT")
              let rfqStateDisabled = res.data.rfqStateCode != $enum("RFQ_STATE_ENUM.INQUIRY_ING") && res.data.rfqStateCode != $enum("RFQ_STATE_ENUM.NEGOTIATE_ING")
              let quotationStateDisabled = res.data.quotationStateCode == $enum("PART_QUOTATION_STATE_ENUM.NOT_QUOTED") || res.data.quotationStateCode == $enum("PART_QUOTATION_STATE_ENUM.REFUSE") || res.data.quotationStateCode == $enum("PART_QUOTATION_STATE_ENUM.DELEGATE_REFUSE")
              let rfqRoundStateDisabled = res.data.rfqRoundStateCode != $enum("RFQ_ROUNDS_STATE_ENUM.RUNNING")
              let roundDisabled = +this.partInfo.round != +res.data.currentRounds
              this.disabled = fsStateDisabled || rfqStateDisabled || quotationStateDisabled || rfqRoundStateDisabled || roundDisabled
            } else {
              iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
            }
          })
          .catch(() => {
          })
    },

    // 跳转至BNK相关页面
    async goToBNK() {
      const {userInfo = {}} = this;
      const {userType = null} = userInfo;
      if (userType == 1) return;

      const {basicInfo = {}} = this;
      const {aekoPartInfo = {}, rfqId, supplierId} = basicInfo;


      // partProjId：零件采购项目ID
      // tmRfqId：当前报价单对应的RFQ_ID;
      // ppSupplierId：供应商id
      // ppSupplierUserId：当前登录的供应商用户id
      // token：由后端提供

      const data = {
        partProjId: aekoPartInfo.partProjectId,
        tmRfqId: rfqId,
        ppSupplierId: supplierId,
        ppSupplierUserId: userInfo.id
      }
      let paramsStr = '';
      for (var i in data) {
        paramsStr += `${i}=${data[i]}&`
      }

      this.tableLoading = true;
      // partProjId    零件采购项目Id String
      // rfqId           rfqId  String
      await bnkSupplierToken({
        partProjId: aekoPartInfo.partProjectId,
        rfqId,
      }).then((res) => {
        this.tableLoading = false;
        if (res.code == 200) {
          const link = `http://svmwt038/sol-bnk/pages/rise/quotes/lsp-view.jsf?${paramsStr}token=${res.data}`;
          window.open(link, '_blank');
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      }).catch((err) => {
        this.tableLoading = false;
      });

    },

    async handleSubmit() {
      this.submitLoading = true

      const component = this.$refs[this.currentTab][0]
      if (typeof component.save === "function") {
        const res = await component.save().catch((e)=>{ this.submitLoading = false })
        if(!res){
          this.submitLoading = false
          return
        }
        if (res?.code != 200) {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
          this.submitLoading = false
          return
        }
      }

      submitAekoQuotation({
        quotationId: this.$route.query.quotationId,
        objectAekoId: this.partInfo.objectAekoId
      })
          .then(res => {
            this.submitLoading = false
            if (res.code == 200) {
              iMessage.success(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
              this.getBasicInfo()
            } else {
              iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
            }
          })
          .catch(() => this.submitLoading = false)
          .finally(()=> this.submitLoading = false)
    },

    updateApriceChange(apriceChange) {
      // A价变动为空时，不显示新A价
      this.$set(this.tableListData[0], "apriceChange", apriceChange)
      let aprice = null
      if(apriceChange||apriceChange===0){
        aprice = math.add(math.bignumber(this.tableListData[0].originalAPrice || 0), math.bignumber(apriceChange || 0)).toFixed(2)
      }
      this.$set(this.tableListData[0], "aprice", aprice)
      this.aprice = aprice
    }
  }
}
</script>

<style lang="scss" scoped>
.quotationdetail {
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

  ::v-deep .el-table {
    .el-table__body-wrapper {
      min-height: initial !important;
    }

    &::before {
      background: transparent;
    }
  }

  .rotate180 {
    transform: rotate(180deg);
  }
}
</style>