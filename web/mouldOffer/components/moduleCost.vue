<!--
 * @Author: ldh
 * @Date: 2021-04-23 15:20:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-12-29 20:43:28
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\mouldOffer\components\moduleCost.vue
-->
<template>
  <iCard :class="{moduleCost:useCardSlot,moduleCost_web:!useCardSlot}" :title="useCardSlot?'':$t(titleKey)" :collapse='!useCardSlot' @handleCollapse='$emit("handleCollapse")'>
    <template #header  v-if='useCardSlot'>
      <div class="header">
        <div>
          <span class="title">{{ language('LK_MUJUFEIYONG', '模具费用') }}</span>
          <span class="tip margin-left10">({{ language('LK_DANWEI', '单位') }}：{{ language('LK_YUAN', '元') }})</span>
        </div>
        <div class="control">
          <iButton @click="changeRelatingPartsVisible(true)">{{ language('LK_GUANLIANLINGJIAN', '关联零件') }}</iButton>
          <iButton @click="handleDownload">{{ language('LK_XIAZAIMUJUCBD', '下载模具CBD') }}</iButton>
            <el-upload 
            class="uploadBtn" 
            multiple
            ref="upload"
            name="multipartFile"
            :http-request="upload"
            :show-file-list="false" 
            :before-upload="beforeUpload"
            accept=".xlsx">
              <iButton :loading="uploadLoading">{{ language('LK_SHANGCHUANBAOJIA', '上传报价') }}</iButton>
          </el-upload>
          <iButton @click="handleAdd">{{ language('LK_TIANJIAHANG', '添加行') }}</iButton>
          <iButton @click="handleDel">{{ language('LK_SHANCHUHANG', '删除行') }}</iButton>
          <iButton @click="handleSave" :loading="saveLoading">{{ language('LK_BAOCUN', '保存') }}</iButton>
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
            <iButton @click="changeRelatingPartsVisible(true)">{{ language('LK_GUANLIANLINGJIAN', '关联零件') }}</iButton>
            <iButton @click="handleDownload">{{ language('LK_XIAZAIMUJUCBD', '下载模具CBD') }}</iButton>
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
                <iButton :loading="uploadLoading">{{ language('LK_SHANGCHUANBAOJIA', '上传报价') }}</iButton>
            </el-upload>
            <iButton @click="handleAdd">{{ language('LK_TIANJIAHANG', '添加行') }}</iButton>
            <iButton @click="handleDel">{{ language('LK_SHANCHUHANG', '删除行') }}</iButton>
            <iButton @click="handleCancel">{{ language('QUXIAO', '取消') }}</iButton>
            <iButton @click="handleSave" :loading="saveLoading">{{ language('LK_BAOCUN', '保存') }}</iButton>
            </template>
            <!-- <iButton>提交</iButton> -->
            <template v-else>
              <iButton @click="dgysBj=true" v-if='hastateSupplierBj && !disabled'>代供应商报价</iButton>
            </template>
          </div>
        </div>
      </template>
      <tableList :lang="true" height="100%" class="table" :tableData="tableListData" :tableTitle="tableTitle" @handleSelectionChange="handleSelectionChange">
        <template #priceType="scope">
          <span v-if="(disabled && !dgysBj) || !isSkdLc(scope.row)">{{ scope.row.priceType }}</span>
          <iSelect v-else v-model="scope.row.priceType" @change="handleChangeByPriceType($event, scope.row)">
            <el-option label="LC" value="LC"></el-option>
            <el-option label="SKD" value="SKD"></el-option>
          </iSelect>
        </template>
        <template #stuffType="scope">
          <iInput v-if="!disabled && dgysBj" v-model="scope.row.stuffType" />
          <span v-else>{{ scope.row.stuffType }}</span>
        </template>
        <template #mouldType="scope">
          <iInput v-if="!disabled && dgysBj" v-model="scope.row.mouldType" @input="handleInputByMouldType($event, scope.row)" />
          <span v-else>{{ scope.row.mouldType }}</span>
        </template>
        <template #assetTypeCode="scope">
          <iSelect v-if="!disabled && dgysBj" v-model="scope.row.assetTypeCode">
            <el-option v-for="assetType in assetTypeCodeOptions" :key="assetType.value" :label="assetType.label" :value="assetType.value"></el-option>
          </iSelect>
          <span v-else>{{ scope.row.assetTypeCode }}</span>
        </template>
        <template #assembledPartName="scope">
          <iInput v-if="!disabled && dgysBj" v-model="scope.row.assembledPartName" @input="handleInputByAssembledPartName($event, scope.row)" />
          <span v-else>{{ scope.row.assembledPartName }}</span>
        </template>
        <template #assembledPartCode="scope">
          <iSelect v-if="!disabled && dgysBj" v-model="scope.row.assembledPartCode" @change="handleChangeByAssembledPartCode($event, scope.row)">
            <el-option v-for="partNumObj in partNums" :key="partNumObj.value" :label="partNumObj.label" :value="partNumObj.value"></el-option>
          </iSelect>
          <span v-else>{{ scope.row.assembledPartCode }}</span>
        </template>
        <template #modeTotalLife="scope">
          <iInput v-if="!disabled && dgysBj" v-model="scope.row.modeTotalLife" @input="handleInputByModeTotalLife($event, scope.row)"/>
          <span v-else>{{ scope.row.modeTotalLife }}</span>
        </template>
        <template #assembledPartPrjCode="scope">
          <iSelect v-if="!disabled && dgysBj" v-model="scope.row.assembledPartPrjCode" @change="handleChangeByAssembledPartPrjCode($event, scope.row)">
            <el-option v-for="fsNumObj in scope.row.assembledPartCode ? partNumMap[scope.row.assembledPartCode] : fsNums" :key="fsNumObj.value" :label="fsNumObj.label" :value="fsNumObj.value"></el-option>
          </iSelect>
          <span v-else>{{ scope.row.assembledPartPrjCode }}</span>
        </template>
        <template #supplierPartNameList="scope">
          <iInput v-if="!disabled && dgysBj" v-model="scope.row.supplierPartNameList" @input="handleInputBySupplierPartNameList($event, scope.row)" />
          <span v-else>{{ scope.row.supplierPartNameList }}</span>
        </template>
        <template #supplierPartCodeList="scope">
          <iInput v-if="!disabled && dgysBj" v-model="scope.row.supplierPartCodeList" />
          <span v-else>{{ scope.row.supplierPartCodeList }}</span>
        </template>
        <template #quantity="scope">
          <iInput v-if="!disabled && dgysBj" v-model="scope.row.quantity" @input="handleInputByQuantity($event, scope.row)" />
          <span v-else>{{ scope.row.quantity }}</span>
        </template>
        <template #assetUnitPrice="scope">
          <iInput v-if="!disabled && dgysBj" v-model="scope.row.assetUnitPrice" @input="handleInputByAssetUnitPrice($event, scope.row)" />
          <span v-else>{{ scope.row.assetUnitPrice }}</span>
        </template>
        <template #isShared="scope">
          <iSelect v-if="!disabled && dgysBj" v-model="scope.row.isShared" @change="updateTotal">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </iSelect>
          <span v-else>{{ scope.row.isShared | numberStatusFilter }}</span>
        </template>
      </tableList>
      <div v-if="!disabled && dgysBj" class="totalCount margin-top30">{{ language('LK_XIANSHI', '显示') }}<span class="count">{{ Array.isArray(tableListData) ? (tableListData.length > 0 ? 1 : 0) : 0 }}</span>{{ language('LK_TIAODI', '条到第') }}<span class="count">{{ Array.isArray(tableListData) ? tableListData.length : 0 }}</span>{{ language('LK_TIAOJILU', '条记录') }}，{{ language('LK_GONG', '共') }}<span class="count">{{ Array.isArray(tableListData) ? tableListData.length : 0 }}</span>{{ language("LK_TIAOJILU", "条记录") }}</div>
      <iPagination
        v-else
        v-update
        class="pagination margin-top30"
        @size-change="handleSizeChange($event, getAllMouldFee)"
        @current-change="handleCurrentChange($event, getAllMouldFee)"
        background
        :current-page="page.currPage"
        :page-sizes="page.pageSizes"
        :page-size="page.pageSize"
        :layout="page.layout"
        :total="page.totalCount" />
    </div>
    <relatingParts :supplierId='supplierId' :dialogVisible="relatingPartsVisible" @changeVisible="changeRelatingPartsVisible" :partInfo="partInfo" :disabled="disabled || !dgysBj" />
  </iCard>
</template>

<script>
/* eslint-disable no-undef */

import { iCard, iButton, iInput, iSelect, iMessage, iPagination,iMessageBox } from "rise"
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
      titleKey:'',
      sourceTableListData: []
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
    },
    hastateSupplierBj:()=>true
  },
  watch: {
    disabled() {
      this.getAllMouldFee()
    }
  },
  methods: {
    getAllMouldFee() {
      this.loading = true

      getAllMouldFee({
        rfqId: this.partInfo.rfqId,
        round: this.partInfo.currentRounds,
        current: this.page.currPage,
        size: this.disabled || !this.dgysBj ? this.page.pageSize : 999999,
        supplierId:this.supplierId
      })
      .then(res => {
        if (res.code == 200) {
          if (res.data.mouldCbdEntityList) {
            if (Array.isArray(res.data.mouldCbdEntityList.records)) {
              this.tableListData = Array.isArray(res.data.mouldCbdEntityList.records) ? res.data.mouldCbdEntityList.records : []
              this.sourceTableListData = _.cloneDeep(this.tableListData)
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
        rfqId: this.partInfo.rfqId,
        supplierId: this.supplierId
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
                fsNumObj.label = fsNumObj.fsnrGsnrNum
                fsNumObj.value = fsNumObj.fsnrGsnrNum

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
      formData.append('rfqId',this.partInfo.rfqId)
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
    uploadSuccess(res) {
      this.uploadLoading = false
      if (res.code == 200) {
        iMessage.success(this.language("LK_SHANGCHUANCHENGGONG", "上传成功"))
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
    uploadError(err) {
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
        // mouldId: `${ this.partInfo.rfqId }_${ this.userInfo.supplierId }_${ this.partInfo.fsNum }_T${ index }`,
        mouldId: "",
        fixedAssetsName: "",
        assembledPartPrjCode: this.partInfo.fsNum,
        carModeCode: this.partInfo.carTypeNames,
        priceType: ""
      })
    },
    handleDel() {
      if (this.multipleSelection.length < 1) {
        iMessage.warn(this.language('LK_QINGXUANZEXUYAOSHANCHUDEHANG', '请选择需要删除的行'))
        return
      }
      this.tableListData = this.tableListData.filter(item => !this.multipleSelection.includes(item))
    },
    handleSave() {
      iMessageBox(this.language('XIUGAIMUJUFEIYONGSFJX','修改模具费用会使对应零件的报价状态再次变为草稿，请问是否继续？')).then(r=>{
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
              this.getAllMouldFee()
              iMessage.success(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
            } else {
              iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
            }
            this.saveLoading = false
          })
          .catch(() => this.saveLoading = false)
      })
    },
    handleCancel() {
      if (!_.isEqual(this.sourceTableListData, this.tableListData)) {
        iMessageBox(this.language("DISCARDCHANGE", "内容已经发生变化，是否确定要放弃修改？"))
        .then(() => {
          this.dgysBj = false
          this.tableListData = _.cloneDeep(this.sourceTableListData)
        })
      } else {
        this.dgysBj = false
      }
    },
    // 零件号选择
    handleChangeByAssembledPartCode(partNum, row) {
      this.$set(row, "assembledPartPrjCode", "")
      const fsObj = this.partNumMap[partNum][0]
      if (fsObj) {
        this.$set(row, "assembledPartName", fsObj.partName)
        this.handleInputByAssembledPartName(fsObj.partName, row)
      }

      this.$set(row, "mouldId", "")

      const mouldIdIndexes = this.tableListData.filter(item => item.priceType === row.priceType).map(item => {
        const list = item.mouldId.split("_")
        return +list[list.length - 1].replace(/\D/g, "") || 0
      })

      mouldIdIndexes.sort((a, b) => b - a)
      const index = mouldIdIndexes[0] ? (mouldIdIndexes[0] >= 10 ? (mouldIdIndexes[0] + 1) + "" : "0" + (mouldIdIndexes[0] + 1)) : "01"
    
      if (row.assembledPartPrjCode && row.priceType) {
        this.$set(row, "mouldId", `${ this.partInfo.rfqId }_${ this.userInfo.supplierId }_${ row.assembledPartPrjCode }_${ row.priceType === "LC" ? "TL" : "TS" }${ index }`)
      }
    },
    handleInputByModeTotalLife(val, row) {
      row.modeTotalLife = numberProcessor(val, 0)
    },
    // fs号选择
    handleChangeByAssembledPartPrjCode(fsNum, row) {
      const fsObj = this.fsNums.filter(item => item.fsnrGsnrNum === fsNum)[0]
      this.$set(row, "quotationId", fsObj.quotationId)

      if (fsObj.priceType === "SKDLC") {
        this.$set(row, "priceType", "LC")
      } else {
        this.$set(row, "priceType", fsObj.priceType)
      }

      if (!row.assembledPartCode) {
        this.$set(row, "assembledPartCode", fsObj.partNum)
        this.$set(row, "assembledPartName", fsObj.partName)
        this.handleInputByAssembledPartName(fsObj.partName, row)

        this.$set(row, "mouldId", "")
        
        const mouldIdIndexes = this.tableListData.filter(item => item.priceType === row.priceType).map(item => {
          const list = item.mouldId.split("_")
          return +list[list.length - 1].replace(/\D/g, "") || 0
        })

        mouldIdIndexes.sort((a, b) => b - a)
        const index = mouldIdIndexes[0] ? (mouldIdIndexes[0] >= 10 ? (mouldIdIndexes[0] + 1) + "" : "0" + (mouldIdIndexes[0] + 1)) : "01"
      
        if (fsNum && row.priceType) {
          this.$set(row, "mouldId", `${ this.partInfo.rfqId }_${ this.userInfo.supplierId }_${ fsNum }_${ row.priceType === "LC" ? "TL" : "TS" }${ index }`)
        }
      }
    },
    // 价格类型选择
    handleChangeByPriceType(priceType, row) {
      this.$set(row, "mouldId", "")

      console.log("priceType", priceType)

      const mouldIdIndexes = this.tableListData.filter(item => item.priceType === priceType).map(item => {
        const list = item.mouldId.split("_")
        return +list[list.length - 1].replace(/\D/g, "") || 0
      })

      mouldIdIndexes.sort((a, b) => b - a)
      const index = mouldIdIndexes[0] ? (mouldIdIndexes[0] >= 10 ? (mouldIdIndexes[0] + 1) + "" : "0" + (mouldIdIndexes[0] + 1)) : "01"

      if (row.assembledPartPrjCode && priceType) {
        this.$set(row, "mouldId", `${ this.partInfo.rfqId }_${ this.userInfo.supplierId }_${ row.assembledPartPrjCode }_${ priceType === "LC" ? "TL" : "TS" }${ index }`)
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
      ).toFixed(2)
    },
    handleInputByAssetUnitPrice(val, row) {
      row.assetUnitPrice = numberProcessor(val, 2)

      row.totalPrice = math.multiply(
        math.bignumber(row.quantity || 0),
        math.bignumber(row.assetUnitPrice || 0),
      ).toFixed(2)
    },
    getFee(){},
    // 判断是否是SKDLC
    isSkdLc(row) {
      if (row.assembledPartPrjCode) {
        const fsObj = this.fsNums.find(item => item.fsnrGsnrNum === row.assembledPartPrjCode)

        if (fsObj) {
          if (fsObj.priceType === "SKDLC") return true

          return false
        }

        return false
      } else {
        return false
      }
    }
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