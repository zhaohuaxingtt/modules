<!--
 * @Author: ldh
 * @Date: 2021-04-23 00:21:08
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-01-27 22:41:05
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\mouldAndDevelopmentCost\components\mould.vue
-->
<template>
  <div class="mould" v-loading="loading">
    <iCard>
      <template #header>
        <div class="header">
          <div>
            <span class="title">{{
              `${(showMode ? (isSkd ? "SKD" : "LC") : "") + " "}${language(
                "LK_MUJUFEIYONG",
                "模具费用"
              )}`
            }}</span>
            <span class="tip margin-left10"
              >({{ language("LK_DANWEI", "单位") }}：{{
                language("LK_YUAN", "元")
              }}，{{ language("LK_BUHANSUI", "不含税") }})</span
            >
            <iFormGroup class="total margin-left20" :row="1" inline>
              <iFormItem
                class="item"
                :label="`${language(
                  mouldCostInfos[0].key,
                  mouldCostInfos[0].name
                )}`"
              >
                <iText>{{ dataGroup[mouldCostInfos[0].props] }}</iText>
              </iFormItem>
            </iFormGroup>
          </div>
          <div class="control">
            <iButton @click="jump" v-if="whenCourcerLogin && !disabled">{{
              language("LK_TIAOZHUANZHIRFQMUJUBAOJIA", "跳转至RFQ模具报价")
            }}</iButton>
            <iButton
              @click="changeRelatingPartsVisible(true)"
              v-if="!disabled"
              >{{ language("LK_GUANLIANLINGJIAN", "关联零件") }}</iButton
            >
            <!--------------在任何状态下，下载按钮可以被看见，供用户下载---------------->
            <iButton
              v-if="!isSkd"
              @click="handleDownload(isSkd ? 'SKD' : 'LC')"
              >{{ language("LK_XIAZAIMUJUCBD", "下载模具CBD") }}</iButton
            >
            <el-upload
              v-if="!disabled && !isSkd"
              class="uploadBtn"
              multiple
              ref="upload"
              name="multipartFile"
              :http-request="upload"
              :show-file-list="false"
              :before-upload="beforeUpload"
              accept=".xlsx"
            >
              <iButton :loading="uploadLoading">{{
                language("LK_SHANGCHUANBAOJIA", "上传报价")
              }}</iButton>
            </el-upload>
            <iButton @click="handleAdd" v-if="!disabled">{{
              language("LK_TIANJIAHANG", "添加行")
            }}</iButton>
            <iButton @click="handleDel" v-if="!disabled">{{
              language("LK_SHANCHUHANG", "删除行")
            }}</iButton>
          </div>
        </div>
      </template>
      <div>
        <tableList
          lang
          class="table"
          :tableData="tableListData"
          :tableTitle="tableTitle"
          @handleSelectionChange="handleSelectionChange"
        >
          <template #stuffType="scope">
            <iInput v-if="!disabled" v-model="scope.row.stuffType" />
            <span v-else>{{ scope.row.stuffType }}</span>
          </template>
          <template #mouldType="scope">
            <iInput
              v-if="!disabled"
              v-model="scope.row.mouldType"
              @input="handleInputByMouldType($event, scope.row)"
            />
            <span v-else>{{ scope.row.mouldType }}</span>
          </template>
          <template #assetTypeCode="scope">
            <iSelect v-if="!disabled" v-model="scope.row.assetTypeCode">
              <el-option
                v-for="assetType in assetTypeCodeOptions"
                :key="assetType.value"
                :label="assetType.label"
                :value="assetType.value"
              ></el-option>
            </iSelect>
            <span v-else>{{ scope.row.assetTypeCode }}</span>
          </template>
          <template #modeTotalLife="scope">
            <iInput
              v-if="!disabled"
              v-model="scope.row.modeTotalLife"
              @input="handleInputByModeTotalLife($event, scope.row)"
            />
            <span v-else>{{ scope.row.modeTotalLife }}</span>
          </template>
          <template #supplierPartNameList="scope">
            <iInput
              v-if="!disabled"
              v-model="scope.row.supplierPartNameList"
              @input="handleInputBySupplierPartNameList($event, scope.row)"
            />
            <span v-else>{{ scope.row.supplierPartNameList }}</span>
          </template>
          <template #supplierPartCodeList="scope">
            <iInput v-if="!disabled" v-model="scope.row.supplierPartCodeList" />
            <span v-else>{{ scope.row.supplierPartCodeList }}</span>
          </template>
          <template #quantity="scope">
            <iInput
              v-if="!disabled"
              v-model="scope.row.quantity"
              @input="handleInputByQuantity($event, scope.row)"
            />
            <span v-else>{{ scope.row.quantity }}</span>
          </template>
          <template #assetUnitPrice="scope">
            <iInput
              v-if="!disabled"
              v-model="scope.row.assetUnitPrice"
              @input="handleInputByAssetUnitPrice($event, scope.row)"
            />
            <span v-else>{{ scope.row.assetUnitPrice }}</span>
          </template>
          <template #isShared="scope">
            <iSelect
              v-if="!disabled"
              v-model="scope.row.isShared"
              :disabled="partInfo.roundsType == 'biddingRound'"
              @change="updateTotal($event, scope)"
            >
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </iSelect>
            <span v-else>{{ scope.row.isShared | statesFilter }}</span>
          </template>
        </tableList>
        <iFormGroup class="subCost margin-top30" :row="4" inline>
          <template v-for="(info, $index) in subMouldCostInfos">
            <iFormItem
              class="item"
              v-if="info.props === 'totalInvestmentCost'"
              :key="$index"
              :label="`${language(info.key, info.name)}`"
            >
              <iText v-if="dataGroup['biddingTotalCost']">{{
                dataGroup["biddingTotalCost"]
              }}</iText>
              <iText v-else>{{ dataGroup[info.props] }}</iText>
            </iFormItem>
            <iFormItem
              class="item"
              v-else
              :key="$index"
              :label="`${language(info.key, info.name)}`"
            >
              <iInput
                v-if="info.props === 'shareQuantity' && !disabled"
                v-model="dataGroup[info.props]"
                @input="handleInputByShareQuantity"
              />
              <iText v-else>{{ dataGroup[info.props] }}</iText>
            </iFormItem>
          </template>
        </iFormGroup>
      </div>
      <relatingParts
        :dialogVisible="relatingPartsVisible"
        @changeVisible="changeRelatingPartsVisible"
        :partInfo="partInfo"
        :disabled="disabled"
        :isSkd="isSkd"
      />
    </iCard>
  </div>
</template>

<script>
/* eslint-disable no-undef */
import {
  iCard,
  iButton,
  iFormGroup,
  iFormItem,
  iInput,
  iSelect,
  iText,
  iMessage,
} from "rise";
import tableList from "../../tableList";
import {
  mouldCostInfos,
  mouldTableTitle as tableTitle,
  assetTypeCodeOptions,
  statesFilter,
} from "./data";
import { cloneDeep } from "lodash";
import relatingParts from "../../relatingParts";
import {
  cbdDownloadFile,
  uploadModuleCbd,
  getMouldFee,
  getMouldFeeSKD,
} from "@/api/rfqManageMent/quotationdetail";
import { numberProcessor } from "@/utils";

export default {
  inject: ["jjys","refreshPartInfo"],
  components: {
    iCard,
    iButton,
    iFormGroup,
    iFormItem,
    iInput,
    iSelect,
    iText,
    tableList,
    relatingParts,
  },
  props: {
    partInfo: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isSkd: {
      type: Boolean,
      default: false,
    },
    showMode: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...Vuex.mapState({
      userInfo: (state) => state.permission.userInfo,
    }),
    /**
     * @description: 当采购员端跳转过来的时候，需要隐藏此按钮。在soucring报价助手上，已经存在模具报价，此时再通过此按钮跳转无意义。
     * @param {*}
     * @return {*}
     */
    whenCourcerLogin: function () {
      let b = false;
      try {
        if (this.$route.query.sourcing) {
          b = false;
        } else {
          b = true;
        }
      } catch (error) {
        b = true;
      }
      return b;
    },
  },
  filters: {
    statesFilter,
  },
  data() {
    return {
      loading: false,
      mouldCostInfos,
      subMouldCostInfos: cloneDeep(mouldCostInfos).slice(
        1,
        mouldCostInfos.length
      ),
      dataGroup: {},
      tableTitle,
      tableListData: [],
      multipleSelection: [],
      relatingPartsVisible: false,
      uploadLoading: false,
      assetTypeCodeOptions,
    };
  },
  methods: {
    upload(content) {
      const formData = new FormData();
      formData.append("file", content.file);
      formData.append("round", this.partInfo.round);
      formData.append("rfqId", this.partInfo.rfqId);
      formData.append(
        "supplierId",
        this.userInfo.supplierId
          ? this.userInfo.supplierId
          : this.$route.query.supplierId
      );
      uploadModuleCbd(formData)
        .then((res) => {
          this.uploadSuccess(res, content.file);
        })
        .catch((rej) => {
          this.uploadError(rej, content.file);
        });
    },
    beforeUpload() {
      this.uploadLoading = true;
    },
    uploadSuccess(res) {
      this.uploadLoading = false;
      if (res.code == 200) {
        iMessage.success(this.language("LK_SHANGCHUANCHENGGONG", "上传成功"));
        this.refreshPartInfo()
        if (this.isSkd) {
          this.getMouldFeeSKD();
        } else {
          this.getMouldFee();
        }
      } else {
        iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn);
      }
      // if (res.code != 200) {
      //   iMessage.error(`${ this.$i18n.locale === 'zh' ? res.desZh : res.desEn }`)
      // } else {
      //   this.fileList = []
      //   clearTimeout(this.timer)
      //   iMessage.success(`${ file.name } ${ this.$t('LK_SHANGCHUANCHENGGONG') }`)
      //   this.fileList.push({ tpPartAttachmentName: res.data[0].fileName, tpPartAttachmentPath: res.data[0].filePath, size: (file.size / 1024 / 1024).toFixed(3) })
      //   this.timer = setTimeout(() => {
      //     this.patchTpInfoByAttachment()
      //     clearTimeout(this.timer)
      //   }, 700)
      // }
    },
    uploadError(err) {
      this.uploadLoading = false;
      iMessage.error(this.$i18n.locale === "zh" ? err.desZh : err.desEn);
    },
    getMouldFee() {
      this.loading = true;

      getMouldFee({
        fsNum: this.partInfo.fsNum,
        rfqId: this.partInfo.rfqId,
        quotationId: this.partInfo.quotationId,
        cbdLevel: this.partInfo.currentCbdLevel || this.partInfo.cbdLevel,
      })
        .then((res) => {
          if (res.code == 200) {
            this.tableListData = Array.isArray(res.data.mouldCbdEntityList)
              ? res.data.mouldCbdEntityList
              : [];
            this.$set(
              this.dataGroup,
              "rfqMouldFeeTotal",
              res.data.rfqMouldFeeTotal
            );
            this.$set(
              this.dataGroup,
              "shareInvestmentFee",
              res.data.shareInvestmentFee
            );
            this.$set(this.dataGroup, "shareQuantity", res.data.shareQuantity);
            this.$set(
              this.dataGroup,
              "totalInvestmentCost",
              res.data.totalInvestmentCost
            );
            this.$set(
              this.dataGroup,
              "unitInvestmentCost",
              res.data.unitInvestmentCost
            );
            this.$set(
              this.dataGroup,
              "biddingTotalCost",
              res.data.biddingTotalCost
            );
          } else {
            iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn);
          }

          this.loading = false;
        })
        .catch(() => (this.loading = false));
    },
    getMouldFeeSKD() {
      this.loading = true;

      getMouldFeeSKD({
        fsNum: this.partInfo.fsNum,
        rfqId: this.partInfo.rfqId,
        quotationId: this.partInfo.quotationId,
        cbdLevel: this.partInfo.currentCbdLevel || this.partInfo.cbdLevel,
      })
        .then((res) => {
          if (res.code == 200) {
            this.tableListData = Array.isArray(res.data.mouldCbdEntityList)
              ? res.data.mouldCbdEntityList
              : [];
            this.$set(
              this.dataGroup,
              "rfqMouldFeeTotal",
              res.data.rfqMouldFeeTotal
            );
            this.$set(
              this.dataGroup,
              "shareInvestmentFee",
              res.data.shareInvestmentFee
            );
            this.$set(this.dataGroup, "shareQuantity", res.data.shareQuantity);
            this.$set(
              this.dataGroup,
              "totalInvestmentCost",
              res.data.totalInvestmentCost
            );
            this.$set(
              this.dataGroup,
              "unitInvestmentCost",
              res.data.unitInvestmentCost
            );
          } else {
            iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn);
          }
        })
        .finally(() => (this.loading = false));
    },
    handleSelectionChange(list) {
      this.multipleSelection = list;
    },
    handleDownload(priceType) {
      cbdDownloadFile({
        rfqId: this.partInfo.rfqId,
        partNum: this.partInfo.partNum,
        round: this.partInfo.round,
        supplierId: this.userInfo.supplierId
          ? this.userInfo.supplierId
          : this.$route.query.supplierId,
        priceType,
      });
    },
    handleAdd() {
      const mouldIdIndexes = this.tableListData.map((item) => {
        const list = item.mouldId.split("_");
        return +list[list.length - 1].replace(/\D/g, "") || 0;
      });

      mouldIdIndexes.sort((a, b) => b - a);
      const index = mouldIdIndexes[0]
        ? mouldIdIndexes[0] >= 10
          ? mouldIdIndexes[0] + 1 + ""
          : "0" + (mouldIdIndexes[0] + 1)
        : "01";

      const { partInfo = {} } = this;
      this.tableListData.push({
        mouldId: `${this.partInfo.rfqId}_${
          // this.userInfo.supplierId ? this.userInfo.supplierId : this.$route.query.supplierId
          // 依据优先级顺序：供应商SAP号>供应商SVW号>供应商临时号
          partInfo.sapCode || partInfo.svwCode || partInfo.svwTempCode || ""
        }_${this.partInfo.fsNum}_${this.isSkd ? "TS" : "TL"}${index}`,
        fixedAssetsName: "",
        assembledPartPrjCode: this.partInfo.fsNum,
        carModeCode:
          Array.isArray(this.partInfo.cartypes) && this.partInfo.cartypes[0]
            ? this.partInfo.cartypes.map((item) => item.name).join(",")
            : this.partInfo.modelNameZh,
        isShared: this.partInfo.roundsType == "biddingRound" ? 0 : "",
      });
    },
    handleDel() {
      if (this.multipleSelection.length < 1) {
        iMessage.warn(
          this.language("LK_QINGXUANZEXUYAOSHANCHUDEHANG", "请选择需要删除的行")
        );
        return;
      }
      this.tableListData = this.tableListData.filter(
        (item) => !this.multipleSelection.includes(item)
      );

      this.updateTotal();
    },
    handleInputByMouldType($event, row) {
      if ($event && row.supplierPartNameList) {
        this.$set(
          row,
          "fixedAssetsName",
          `${this.partInfo.partNameZh}${row.supplierPartNameList}${$event}`
        );
      } else {
        this.$set(row, "fixedAssetsName", "");
      }
    },
    handleInputBySupplierPartNameList($event, row) {
      if ($event && row.mouldType) {
        this.$set(
          row,
          "fixedAssetsName",
          `${this.partInfo.partNameZh}${$event}${row.mouldType}`
        );
      } else {
        this.$set(row, "fixedAssetsName", "");
      }
    },
    changeRelatingPartsVisible(visible) {
      this.relatingPartsVisible = visible;
    },
    handleInputByModeTotalLife(val, row) {
      row.modeTotalLife = numberProcessor(val, 0);
    },
    handleInputByQuantity(val, row) {
      row.quantity = numberProcessor(val, 0);

      row.totalPrice = math
        .multiply(
          math.bignumber(row.quantity || 0),
          math.bignumber(row.assetUnitPrice || 0)
        )
        .toFixed(2);

      this.updateTotal();
    },
    handleInputByAssetUnitPrice(val, row) {
      row.assetUnitPrice = numberProcessor(val, 2);

      row.totalPrice = math
        .multiply(
          math.bignumber(row.quantity || 0),
          math.bignumber(row.assetUnitPrice || 0)
        )
        .toFixed(2);

      this.updateTotal();
    },
    handleInputByShareQuantity(val) {
      this.dataGroup.shareQuantity = numberProcessor(val, 0);

      this.updateTotal();
    },
    // 更新成本
    updateTotal(e, scope) {
      scope ? (scope.row.isShared = e) : "";
      let totalInvestmentCost = 0;
      let shareInvestmentFee = 0;
      this.tableListData.forEach((item) => {
        totalInvestmentCost = math.add(
          math.bignumber(totalInvestmentCost),
          math.bignumber(item.totalPrice || 0)
        );

        if (item.isShared == 1) {
          shareInvestmentFee = math.add(
            math.bignumber(shareInvestmentFee),
            math.bignumber(item.totalPrice || 0)
          );
        }
      });

      this.$set(
        this.dataGroup,
        "totalInvestmentCost",
        totalInvestmentCost.toFixed(2)
      );
      this.$set(
        this.dataGroup,
        "shareInvestmentFee",
        shareInvestmentFee.toFixed(2)
      );
      this.$set(
        this.dataGroup,
        "unitInvestmentCost",
        +this.dataGroup.shareQuantity
          ? math
              .divide(
                shareInvestmentFee,
                math.bignumber(this.dataGroup.shareQuantity)
              )
              .toFixed(2)
          : "0"
      );
    },
    jump() {
      // 跳转至RFQ模具报价
      const router = this.$router.resolve({
        path: "/supplier/rfqManageMent/mouldOffer",
        query: { rfqId: this.partInfo.rfqId },
      });
      window.open(router.href, "_blank");
    },
  },
};
</script>

<style lang="scss" scoped>
.mould {
  ::v-deep .cardHeader {
    display: block;

    .title {
      font-size: 18px;
      color: #131523;
      font-weight: bold;
    }
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      height: 25px;
      line-height: 25px;
      font-size: 18px;
      font-weight: bold;
      color: #131523;
    }

    .tip {
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      color: #86878e;
    }

    .control {
      display: inline-block;
    }
  }

  .uploadBtn {
    display: inline;
    margin-left: 10px;

    & + .el-button {
      margin-left: 10px;
    }
  }

  .total {
    display: inline-block;
    width: 368px;
    vertical-align: middle;

    ::v-deep .el-form-item__label {
      width: 170px;
    }

    .item {
      margin-bottom: 0;
    }
  }

  .subCost {
    ::v-deep .el-form-item {
      margin-bottom: 0;

      .el-form-item__label {
        width: 140px;
        font-size: 16px;
      }
    }
  }
}
</style>