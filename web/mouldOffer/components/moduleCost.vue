<!--
 * @Author: ldh
 * @Date: 2021-04-23 15:20:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-06-14 14:19:06
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\mouldOffer\components\moduleCost.vue
-->
<template>
  <iCard :class="{moduleCost:useCardSlot,moduleCost_web:!useCardSlot}" :title="useCardSlot?'':$t(titleKey)" :collapse='!useCardSlot' @handleCollapse='$emit("handleCollapse")'>
    <template #header  v-if='useCardSlot'>
      <div class="header">
        <div>
          <span class="title">{{ $t('LK_MUJUFEIYONG') }}</span>
          <span class="tip margin-left10">({{ $t('LK_DANWEI') }}：{{ $t('LK_YUAN') }})</span>
        </div>
        <div class="control">
          <iButton @click="changeRelatingPartsVisible(true)">{{ $t('LK_GUANLIANLINGJIAN') }}</iButton>
          <iButton @click="handleDownload">{{ $t('LK_XIAZAIMUJUCBD') }}</iButton>
            <el-upload 
            class="uploadBtn" 
            multiple
            ref="upload"
            name="multipartFile"
            :http-request="upload"
            :show-file-list="false" 
            :before-upload="beforeUpload"
            accept=".xlsx">
              <iButton :loading="uploadLoading">{{ $t('LK_SHANGCHUANBAOJIA') }}</iButton>
          </el-upload>
          <iButton @click="handleAdd">{{ $t('LK_TIANJIAHANG') }}</iButton>
          <iButton @click="handleDel">{{ $t('LK_SHANCHUHANG') }}</iButton>
          <iButton @click="handleSave" :loading="saveLoading">{{ $t('LK_BAOCUN') }}</iButton>
          <!-- <iButton>提交</iButton> -->
        </div>
      </div>
    </template>
    <div class="table">
       <template v-if='!useCardSlot'>
        <div class="header">
          <div v-if='hasSupplierComponets' class="supplier">
            <span>供应商：</span>
            <iSelect v-model="supplierId" @change='getFee'>
              <el-option :value="item.supplierId" :label="item.supplierName" v-for='(item,index) in supplierList' :key='index'></el-option>
            </iSelect>
          </div>
          <div class="control">
            <iButton @click="changeRelatingPartsVisible(true)">{{ $t('LK_GUANLIANLINGJIAN') }}</iButton>
            <iButton @click="handleDownload">{{ $t('LK_XIAZAIMUJUCBD') }}</iButton>
            <template v-if='dgysBj'>
            <el-upload 
              class="uploadBtn" 
              multiple
              ref="upload"
              name="multipartFile"
              :http-request="upload"
              :show-file-list="false" 
              :before-upload="beforeUpload"
              accept=".xlsx">
                <iButton :loading="uploadLoading">{{ $t('LK_SHANGCHUANBAOJIA') }}</iButton>
            </el-upload>
            <iButton @click="handleAdd">{{ $t('LK_TIANJIAHANG') }}</iButton>
            <iButton @click="handleDel">{{ $t('LK_SHANCHUHANG') }}</iButton>
            <iButton @click="handleSave" :loading="saveLoading">{{ $t('LK_BAOCUN') }}</iButton>
            </template>
            <!-- <iButton>提交</iButton> -->
            <template v-else>
              <iButton @click="dgysBj=true">代供应商报价</iButton>
            </template>
          </div>
        </div>
      </template>
      <tableList height="100%" class="table" :tableData="tableListData" :tableTitle="tableTitle" @handleSelectionChange="handleSelectionChange">
        <template #stuffType="scope">
          <iInput v-if="!disabled" v-model="scope.row.stuffType" />
          <span v-else>{{ scope.row.stuffType }}</span>
        </template>
        <template #mouldType="scope">
          <iInput v-if="!disabled" v-model="scope.row.mouldType" @input="handleInputByMouldType($event, scope.row)" />
          <span v-else>{{ scope.row.mouldType }}</span>
        </template>
        <template #assetTypeCode="scope">
          <iSelect v-if="!disabled" v-model="scope.row.assetTypeCode">
            <el-option v-for="assetType in assetTypeCodeOptions" :key="assetType.value" :label="assetType.label" :value="assetType.value"></el-option>
          </iSelect>
          <span v-else>{{ scope.row.assetTypeCode }}</span>
        </template>
        <template #assembledPartName="scope">
          <iInput v-if="!disabled" v-model="scope.row.assembledPartName" @input="handleInputByAssembledPartName($event, scope.row)" />
          <span v-else>{{ scope.row.assembledPartName }}</span>
        </template>
        <template #assembledPartCode="scope">
          <iSelect v-if="!disabled" v-model="scope.row.assembledPartCode" @change="handleChangeByAssembledPartCode($event, scope.row)">
            <el-option v-for="partNumObj in partNums" :key="partNumObj.value" :label="partNumObj.label" :value="partNumObj.value"></el-option>
          </iSelect>
          <span v-else>{{ scope.row.assembledPartCode }}</span>
        </template>
        <template #modeTotalLife="scope">
          <iInput v-if="!disabled" v-model="scope.row.modeTotalLife" @input="handleInputByModeTotalLife($event, scope.row)"/>
          <span v-else>{{ scope.row.modeTotalLife }}</span>
        </template>
        <template #assembledPartPrjCode="scope">
          <iSelect v-if="!disabled" v-model="scope.row.assembledPartPrjCode" @change="handleChangeByAssembledPartPrjCode($event, scope.row)">
            <el-option v-for="fsNumObj in scope.row.assembledPartCode ? partNumMap[scope.row.assembledPartCode] : fsNums" :key="fsNumObj.value" :label="fsNumObj.label" :value="fsNumObj.value"></el-option>
          </iSelect>
          <span v-else>{{ scope.row.assembledPartPrjCode }}</span>
        </template>
        <template #supplierPartNameList="scope">
          <iInput v-if="!disabled" v-model="scope.row.supplierPartNameList" @input="handleInputBySupplierPartNameList($event, scope.row)" />
          <span v-else>{{ scope.row.supplierPartNameList }}</span>
        </template>
        <template #supplierPartCodeList="scope">
          <iInput v-if="!disabled" v-model="scope.row.supplierPartCodeList" />
          <span v-else>{{ scope.row.supplierPartCodeList }}</span>
        </template>
        <template #quantity="scope">
          <iInput v-if="!disabled" v-model="scope.row.quantity" @input="handleInputByQuantity($event, scope.row)" />
          <span v-else>{{ scope.row.quantity }}</span>
        </template>
        <template #assetUnitPrice="scope">
          <iInput v-if="!disabled" v-model="scope.row.assetUnitPrice" @input="handleInputByAssetUnitPrice($event, scope.row)" />
          <span v-else>{{ scope.row.assetUnitPrice }}</span>
        </template>
        <template #isShared="scope">
          <iSelect v-if="!disabled" v-model="scope.row.isShared" @change="updateTotal">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </iSelect>
          <span v-else>{{ scope.row.isShared | numberStatusFilter }}</span>
        </template>
      </tableList>
      <div v-if="!disabled" class="totalCount margin-top30">{{ $t('LK_XIANSHI') }}<span class="count">{{ Array.isArray(tableListData) ? (tableListData.length > 0 ? 1 : 0) : 0 }}</span>{{ $t('LK_TIAODI') }}<span class="count">{{ Array.isArray(tableListData) ? tableListData.length : 0 }}</span>{{ $t('LK_TIAOJILU') }}，{{ $t('LK_GONG') }}<span class="count">{{ Array.isArray(tableListData) ? tableListData.length : 0 }}</span>{{ $t("LK_TIAOJILU") }}</div>
      <iPagination
        v-else
        v-update
        class="pagination margin-top30"
        @size-change="handleSizeChange($event, getData)"
        @current-change="handleCurrentChange($event, getData)"
        background
        :current-page="page.currPage"
        :page-sizes="page.pageSizes"
        :page-size="page.pageSize"
        :layout="page.layout"
        :total="page.totalCount" />
    </div>
    <relatingParts :supplierId='supplierId' :dialogVisible="relatingPartsVisible" @changeVisible="changeRelatingPartsVisible" :partInfo="partInfo" :disabled="disabled" />
  </iCard>
</template>

<script>
/* eslint-disable no-undef */

import { iCard, iButton, iInput, iSelect, iMessage, iPagination } from "rise"
import tableList from "../../quotationdetail/components/tableList"
import { moduleCostTableTitle as tableTitle } from "./data"
import relatingParts from '../../quotationdetail/components/relatingParts'
import { cbdDownloadFile, uploadModuleCbd, getAllMouldFee, saveModuleFee, getAllPartForMould } from "@/api/rfqManageMent/quotationdetail"
import { assetTypeCodeOptions } from "../../quotationdetail/components/mouldAndDevelopmentCost/components/data"
import filters from "@/utils/filters"
import { pageMixins } from "@/utils/pageMixins"
import { numberProcessor } from "@/utils"

export default {
  components: {
    iCard,
    iButton,
    iInput, 
    iSelect,
    iPagination,
    tableList,
    relatingParts
  },
  mixins: [ filters, pageMixins ],
  props: {
    partInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dgysBj:false,
      loading: false,
      assetTypeCodeOptions,
      tableTitle,
      tableListData: [],
      multipleSelection: [],
      uploadLoading: false,
      relatingPartsVisible: false,
      saveLoading: false,
      partNums: [],
      fsNums: [],
      partNumMap: {},
      fromPage:'',
      supplierId:'',
      supplierList:[],
      titleKey:''
    }
  },
  computed: {
    // eslint-disable-next-line no-undef
    ...Vuex.mapState({
      userInfo: state => state.permission.userInfo,
    }),
    disabled() {
      if (!this.partInfo.currentStatus) {
        return true
      } else {
        return this.partInfo.rfqQuotation != '1' || this.partInfo.currentStatus == '09' || this.partInfo.currentStatus == '10'
      }
    }
  },
  watch: {
    disabled(nv) {
      this.getAllMouldFee()
    }
  },
  methods: {
    getAllMouldFee() {
      this.loading = true

      getAllMouldFee({
        rfqId: this.partInfo.rfqId,
        round: this.partInfo.currentRounds,
        currPage: this.page.currPage,
        pageSize: this.disabled ? this.page.pageSize : 999999,
        supplierId:this.supplierId
      })
      .then(res => {
        if (res.code == 200) {
          if (res.data.mouldCbdEntityList) {
            if (Array.isArray(res.data.mouldCbdEntityList.records)) {
              this.tableListData = Array.isArray(res.data.mouldCbdEntityList.records) ? res.data.mouldCbdEntityList.records : []
              this.page.totalCount = res.data.mouldCbdEntityList.total || 0
            }
          }
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }

        this.loading = false
      })
      .catch(() => this.loading = false)
    },
    getAllPartForMould() {
      getAllPartForMould({
        rfqId: this.partInfo.rfqId
      })
      .then(res => {
        if (res.code == 200) {
          this.partNums = []
          this.fsNums = []
          this.partNumMap = res.data

          Object.keys(res.data).forEach(partNum => {
            this.partNums.push({
              label: partNum,
              value: partNum
            })

            if (Array.isArray(res.data[partNum])) {
              res.data[partNum].forEach(fsNumObj => {
                fsNumObj.label = fsNumObj.fsNum
                fsNumObj.value = fsNumObj.fsNum

                this.fsNums.push({ ...fsNumObj })
              })
            }
          })
        
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      })
      .catch(() => {})
    },
    upload(content) {
      const formData = new FormData()
      formData.append("file", content.file)
      formData.append("round", this.partInfo.currentRounds)
      formData.append('supplierId',this.supplierId)
      uploadModuleCbd(formData)
        .then(res => {
          this.uploadSuccess(res, content.file)
        })
        .catch(rej => {
          this.uploadError(rej, content.file)
        })
    },
    beforeUpload() {
      this.uploadLoading = true
    },
    uploadSuccess(res, file) {
      this.uploadLoading = false
      if (res.code == 200) {
        iMessage.success(this.$t("LK_SHANGCHUANCHENGGONG"))
        this.getAllMouldFee()
      } else {
        iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
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
    uploadError(err, file) {
      this.uploadLoading = false
      iMessage.error(this.$i18n.locale === "zh" ? err.desZh : err.desEn)
    },
    changeRelatingPartsVisible(visible) {
      this.relatingPartsVisible = visible
    },
    handleDownload() {
      cbdDownloadFile({
        // partNum: "",
        rfqId: this.partInfo.rfqId,
        round: this.partInfo.currentRounds,
        supplierId:this.supplierId
      })
    },
    handleSelectionChange(list) {
      this.multipleSelection = list
    },
    handleAdd() {
      // const mouldIdIndexes = this.tableListData.map(item => {
      //   const list = item.mouldId.split("_")
      //   return +list[list.length - 1].replace(/\D/g, "") || 0
      // })

      // mouldIdIndexes.sort((a, b) => b - a)
      // const index = mouldIdIndexes[0] ? (mouldIdIndexes[0] >= 10 ? (mouldIdIndexes[0] + 1) + "" : "0" + (mouldIdIndexes[0] + 1)) : "01"

      this.tableListData.push({
        // mouldId: `${ this.partInfo.rfqId }_${ this.userInfo.supplierId }_${ this.partInfo.partNum }_T${ index }`,
        mouldId: "",
        fixedAssetsName: "",
        assembledPartPrjCode: this.partInfo.fsNum,
        carModeCode: this.partInfo.carTypeNames
      })
    },
    handleDel() {
      if (this.multipleSelection.length < 1) {
        iMessage.warn(this.$t('LK_QINGXUANZEXUYAOSHANCHUDEHANG'))
        return
      }
      this.tableListData = this.tableListData.filter(item => !this.multipleSelection.includes(item))
    },
    handleSave() {
      this.saveLoading = true

      saveModuleFee({
        rfqId: this.partInfo.rfqId,
        round: this.partInfo.currentRounds,
        supplierId:this.supplierId,
        mouldCbdBaseDTO: this.tableListData.map(item => ({
          quotationId: item.quotationId,
          mouldCbdBaseDTO: {
            ...item
          }
        }))
      })
      .then(res => {
        if (res.code == 200) {
          iMessage.success(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }

        this.saveLoading = false
      })
      .catch(() => this.saveLoading = false)
    },
    // 零件号选择
    handleChangeByAssembledPartCode(partNum, row) {
      this.$set(row, "assembledPartPrjCode", "")
      const fsObj = this.partNumMap[partNum][0]
      if (fsObj) {
        this.$set(row, "assembledPartName", fsObj.partName)
        this.handleInputByAssembledPartName(fsObj.partName, row)
      }

      const mouldIdIndexes = this.tableListData.map(item => {
        const list = item.mouldId.split("_")
        return +list[list.length - 1].replace(/\D/g, "") || 0
      })

      mouldIdIndexes.sort((a, b) => b - a)
      const index = mouldIdIndexes[0] ? (mouldIdIndexes[0] >= 10 ? (mouldIdIndexes[0] + 1) + "" : "0" + (mouldIdIndexes[0] + 1)) : "01"
    
      this.$set(row, "mouldId", `${ this.partInfo.rfqId }_${ this.userInfo.supplierId }_${ partNum }_T${ index }`)
    },
    handleInputByModeTotalLife(val, row) {
      row.modeTotalLife = numberProcessor(val, 0)
    },
    // fs号选择
    handleChangeByAssembledPartPrjCode(fsNum, row) {
      const fsObj = this.fsNums.filter(item => item.fsNum === fsNum)[0]
      this.$set(row, "quotationId", fsObj.quotationId)
      if (!row.assembledPartCode) {
        this.$set(row, "assembledPartCode", fsObj.partNum)
        this.$set(row, "assembledPartName", fsObj.partName)
        this.handleInputByAssembledPartName(fsObj.partName, row)
        
        const mouldIdIndexes = this.tableListData.map(item => {
          const list = item.mouldId.split("_")
          return +list[list.length - 1].replace(/\D/g, "") || 0
        })

        mouldIdIndexes.sort((a, b) => b - a)
        const index = mouldIdIndexes[0] ? (mouldIdIndexes[0] >= 10 ? (mouldIdIndexes[0] + 1) + "" : "0" + (mouldIdIndexes[0] + 1)) : "01"
      
        this.$set(row, "mouldId", `${ this.partInfo.rfqId }_${ this.userInfo.supplierId }_${ fsObj.partNum }_T${ index }`)
      }
    },
    handleInputByMouldType($event, row) {
      if ($event && row.assembledPartName && row.supplierPartNameList) {
        this.$set(row, "fixedAssetsName", `${ row.assembledPartName }${ row.supplierPartNameList }${ $event }`)
      } else {
        this.$set(row, "fixedAssetsName", "")
      }
    },
    handleInputByAssembledPartName($event, row) {
      if ($event && row.mouldType && row.supplierPartNameList) {
        this.$set(row, "fixedAssetsName", `${ $event }${ row.supplierPartNameList }${ row.mouldType }`)
      } else {
        this.$set(row, "fixedAssetsName", "")
      }
    },
    handleInputBySupplierPartNameList($event, row) {
      if ($event && row.mouldType  && row.assembledPartName) {
        this.$set(row, "fixedAssetsName", `${ row.assembledPartName }${ $event }${ row.mouldType }`)
      } else {
        this.$set(row, "fixedAssetsName", "")
      }
    },
    handleInputByQuantity(val, row) {
      row.quantity = numberProcessor(val, 0)
      
      row.totalPrice = math.multiply(
        math.bignumber(row.quantity || 0),
        math.bignumber(row.assetUnitPrice || 0),
      ).toFixed(4)
    },
    handleInputByAssetUnitPrice(val, row) {
      row.assetUnitPrice = numberProcessor(val, 2)

      row.totalPrice = math.multiply(
        math.bignumber(row.quantity || 0),
        math.bignumber(row.assetUnitPrice || 0),
      ).toFixed(4)
    },
    getFee(){},
  }
}
</script>

<style lang="scss" scoped>
.moduleCost {
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
      color: #86878E;
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

  .table {
    min-height: calc(100vh - 300px);
  }

  .totalCount {
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    font-family: Arial;
    font-weight: 400;
    color: #8C98AC;
    opacity: 1;

    .count {
      padding: 0 2.5px;
    }
  }
}
.moduleCost_web{
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
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
      color: #86878E;
    }

    .control {
      display: inline-block;
    }

    .supplier{
      display: flex;
      span{
        width: 100px;
        line-height: 28px;
      }
    }
  }

  .uploadBtn {
    display: inline;
    margin-left: 10px;

    & + .el-button {
      margin-left: 10px;
    }
  }

  .table {
    min-height: calc(100vh - 300px);
  }

  .totalCount {
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    font-family: Arial;
    font-weight: 400;
    color: #8C98AC;
    opacity: 1;

    .count {
      padding: 0 2.5px;
    }
  }
}

</style>