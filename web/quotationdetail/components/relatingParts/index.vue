<!--
 * @Descripttion: US: SP2-T01-E13-023 供应商报价界面-报价页面-模具和开发费用-供应商视角-关联零件
 * @Author: Luoshuang
 * @Date: 2021-04-25 11:20:02
 * @LastEditTime: 2021-06-28 20:30:05
-->

<template>
  <iDialog
    :visible.sync="dialogVisible"
    width="90%"
    @close="clearDialog"
    custom-class="parts-dialog"
  >
    <div slot="title" class="dialog-header">
      <span class="title">{{ $t('LK_CHAKANGUANLIANLINGJIAN') }}</span>
      <!---------弹窗按钮--------->
      <div class="head-btn">
        <iButton @click="handleEditCancel">{{ $t('LK_QUXIAO') }}</iButton>
        <iButton @click="handleEditSave">{{ $t('LK_BAOCUN') }}</iButton>
      </div>
    </div>
    <!-------------------------------------------------->
    <!----------------关联零件列表----------------------->
    <!----------*表示该模具已经使用对应零件--------------->
    <!----------灰色对勾表示该模具还未关联对应零件，------->
    <!----------点击可将模具与对应零件关联即变成蓝色对勾---->
    <!-------------------------------------------------->
    <tableList v-update :tableTitle="tableTitle" :tableData="tableData" :tableLoading="tableLoading" :selection="false" @changeStatus="changeStatus"></tableList>
    <iPagination
      v-update
      @size-change="handleSizeChange($event, getTableList)"
      @current-change="handleCurrentChange($event, getTableList)"
      background
      :page-sizes="page.pageSizes"
      :page-size="page.pageSize"
      :layout="page.layout"
      :current-page="page.currPage"
      :total="page.totalCount"
      class="padding-bottom30 margin-top20"
    />
  </iDialog>
</template>

<script>
import { iDialog, iPagination, iButton, iMessage } from 'rise'
import { relatingPartsTableTitle } from './data'
import tableList from './tableList'
import { pageMixins } from "@/utils/pageMixins"
import { getMouldPartList, saveMouldPartList } from '@/api/rfqManageMent/quotationdetail'

export default {
  components: {
    iDialog,
    tableList,
    iPagination,
    iButton
  },
  mixins: [pageMixins],
  props: {
    dialogVisible: {type: Boolean, default: false},
    partInfo: {type: Object},
    disabled: {type: Boolean},
    supplierId:{type: String, default:''}
  },
  data() {
    return {
      tableTitle: relatingPartsTableTitle,
      tableData: [],
      tableLoading: false,
    }
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.getTableList()
      }
    }
  },
  methods: {
    // 切换零件关联状态方法
    changeStatus(props, row, status) {
      if (this.disabled) {
        return
      }
      this.tableData = this.tableData.map(item => {
        if (item.modelId === row.modelId) {
          return {...item, partList:item.partList.map(item => {return {...item, isRelationModel: item.fsnrGsnrNum === props ? status : item.isRelationModel}})}
        }
        return item
      })
      console.log(this.tableData)
    },
    // 关闭弹窗
    clearDialog() {
      // this.tableData = []
      this.$emit('changeVisible', false)
    },
    // 获取表格数据
    getTableList() {
      const { pageSize, currPage } = this.pageParmars()
      const params = {
        round: this.partInfo.currentRounds || this.partInfo.round,
        rfqId: this.partInfo.rfqId,
        current: currPage,
        size: pageSize,
        supplierId:this.supplierId
      }
      this.tableLoading = true
      getMouldPartList(params).then(res => {
        if (res && res.result) {
          this.tableData = res.data.records
          this.tableTitle = [
            ...relatingPartsTableTitle,
            ...res.data.records[0]?.partList.map(item => {
              return {props: item.fsnrGsnrNum, name: item.partNum, type: 'icon'}
            })
          ]
          this.page = {
            ...this.page,
            currPage: res.data.current,
            pageSize: res.data.size,
            totalCount: res.data.total
          }
        } else {
          this.tableTitle = [...relatingPartsTableTitle]
          this.tableData = []
          iMessage.error(this.$i18n.locale === 'zh' ? res.desZh : res.desEn)
        }
      }).finally(() => {
        this.tableLoading = false
      })
    },
    // 取消表格编辑内容
    handleEditCancel() {
      this.clearDialog()
    },
    // 保存表格编辑内容
    handleEditSave() {
      const params = {
        rfqId: this.partInfo.rfqId,
        mouldPartList: this.tableData
      }
      this.tableLoading = true
      saveMouldPartList(params).then(res => {
        if (res && res.result) {
          iMessage.success(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
          // this.getTableList()
          this.clearDialog()
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.margin-top20 {
  margin-top: 20px;
}
.padding-bottom30 {
  padding-bottom: 30px;
}
</style>
<style lang="scss">
.el-dialog.parts-dialog {
  .el-dialog__header {
    padding-bottom: 20px;
    padding-top: 30px;
  }
  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      font-size: 18px;
      font-weight: bold;
    }
    .head-btn {
      margin-right: 40px;
      .el-button + .el-button {
        // margin-left: 30px;
      }
    }
  }
}
</style>