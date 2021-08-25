<!--
 * @Author: Luoshuang
 * @Date: 2021-05-27 15:56:15
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-12 19:30:08
 * @Description: 报价备注与附件
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\remarksAndAttachment\index.vue
-->

<template>
  <div>
    <iCard :title="$t('LK_BAOJIABEIZHU')" v-loading="remarkLoading">
      <iEditor :showMenus="false" v-model="remark" :height="120" :disabled="disabled" autoHeight/>
      <!-- <iInput type="textarea" :rows="6" resize="none" :placeholder="$t('LK_QINGSHURUBEIZHU')"></iInput> -->
    </iCard>
    <iCard class="sampleDelivery margin-top20">
      <div class="header margin-bottom20">
        <span class="title">{{ $t('LK_BAOJIAFUJIAN') }}</span>
        <span class="margin-left10">
          <span class="tip">{{$t('LK_SHANGCHUANSHIXUANZHUANZHIZHENGCHANGFANGXIANG')}}</span>
        </span>
        <div class="floatright" >
          <el-upload
            v-if="!disabled"
            class="uploadBtn" 
            multiple
            ref="upload"
            name="multipartFile"
            :http-request="upload"
            :show-file-list="false" 
            :before-upload="beforeUpload"
            accept=".jpg,.jpge,.png,.xls,.xlsx,.ppt,.pptx,.doc,.docx">
              <iButton :loading="uploadLoading">{{$t('LK_SHANGCHUANFUJIAN')}}</iButton>
            </el-upload>
          <iButton @click="handleDownload">{{$t('LK_XIAZAI')}}</iButton>
          <iButton v-if="!disabled" :loading="deleteLoading" @click="handleDelete">{{$t('LK_SHANCHU')}}</iButton>
        </div>
      </div>
      <tableList selection :tableTitle="tableTitle" :tableData="tableData" :tableLoading="fileLoading" @handleSelectionChange="handleSelectionChange">
        <template #fileName="scope">
          <span class="link-underline" @click="download(scope.row)">{{ scope.row.fileName }}</span>
        </template>
        <template #uploadDate="scope">
          <span>{{ scope.row.uploadDate | dateFilter("YYYY-MM-DD") }}</span>
        </template>
      </tableList>
      <iPagination
        v-update
        @size-change="handleSizeChange($event, getFileHistory)"
        @current-change="handleCurrentChange($event, getFileHistory)"
        background
        :page-sizes="page.pageSizes"
        :page-size="page.pageSize"
        :layout="page.layout"
        :current-page="page.currPage"
        :total="page.totalCount"
        :isEdit="!disabled"
      />
    </iCard>
  </div>
</template>

<script>
import { iCard, iButton, iEditor, iMessage, iPagination } from 'rise'
import { tableTitle } from './data'
import tableList from "../tableList"
import { pageMixins } from "@/utils/pageMixins"
import filters from "@/utils/filters"
import { getComments, saveComments, getFileHistory, uploadFileList, deleteFiles } from "@/api/rfqManageMent/quotationdetail"
import { downloadFile, downloadUdFile } from "@/api/file"
import { uploadFile, uploadUdFile } from "@/api/file/upload"

export default {
  components: { iCard, tableList, iButton, iEditor, iPagination },
  mixins: [pageMixins, filters],
  props: {
    partInfo: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      radio: 'LC',
      tableTitle: tableTitle,
      tableData: [],
      multipleSelection: [],
      remarkLoading: false,
      remark: "",
      uploadLoading: false,
      deleteLoading: false,
      fileLoading: false,
      fileList: []
    }
  },
  methods: {
    // 获取备注
    getComments() {
      this.remarkLoading = true

      getComments({
        quotationId: this.partInfo.quotationId,
      })
      .then(res => {
        if (res.code == 200) {
          this.remark = res.data.remark
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }

        this.remarkLoading = false
      })
      .catch(() => this.remarkLoading = false)
    },
    // 保存备注
    saveComments(type) {
      saveComments({
        quotationId: this.partInfo.quotationId,
        remark: this.remark
      })
      .then(res => {
        const message = this.$i18n.locale === "zh" ? res.desZh : res.desEn

        if (res.code == 200) {
          if (type !== "submit") iMessage.success(message)
        } else {
          iMessage.error(message)
        }
      })
    },
    handleSelectionChange(list) {
      this.multipleSelection = list
    },
    upload(content) {
      // const formData = new FormData()
      // formData.append("multipartFile", content.file)
      // formData.append("applicationName", "rise")
      uploadUdFile({ multifile: content.file })
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
      if (res.code != 200) {
        iMessage.error(`${ this.$i18n.locale === 'zh' ? res.desZh : res.desEn }`)
      } else {
        clearTimeout(this.timer)
        iMessage.success(`${ file.name } ${ this.$t('LK_SHANGCHUANCHENGGONG') }`)
        this.fileList.push({ id: res.data[0].id, fileName: res.data[0].name, filePath: res.data[0].path, fileSize: file.size })
        this.timer = setTimeout(() => {
          this.uploadFileList()
          clearTimeout(this.timer)
        }, 700)
      }
    },
    uploadError(err) {
      this.uploadLoading = false
      iMessage.error(this.$i18n.locale === "zh" ? err.desZh : err.desEn)
    },
    // 获取附件列表
    getFileHistory() {
      this.fileLoading = true

      getFileHistory({
        fileType: "4",
        partPrjCode: this.partInfo.fsNum,
        quotationId: this.partInfo.quotationId,
        rfqId: this.partInfo.rfqId,
        round: this.partInfo.currentRounds || this.partInfo.round,
        current: this.page.currPage,
        size: this.page.pageSize
      })
      .then(res => {
        if (res.code == 200) {
          this.tableData = Array.isArray(res.data) ? res.data : []
          this.page.totalCount = res.total || 0
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }

        this.fileLoading = false
      })
      .catch(() => this.fileLoading = false)
    },
    // 关联附件
    uploadFileList() {
      uploadFileList(
        this.fileList.map(item => ({
          uploadId: item.id,
          fileName: item.fileName,
          filePath: item.filePath,
          fileSize: item.fileSize,
          fileType: "4",
          hostId: this.partInfo.quotationId,
        }))
      )
      .then(res => {
        const message = this.$i18n.locale === "zh" ? res.desZh : res.desEn

        if (res.code == 200) {
          iMessage.success(message)
          this.getFileHistory()
          this.fileList = []
        } else {
          iMessage.error(message)
        }

        this.uploadLoading = false
      })
      .catch(() => this.uploadLoading = false)
    },
    // 删除
    handleDelete() {
      if (this.multipleSelection.length < 1) return iMessage.warn(this.$t("LK_QINGXUANZHEXUYAOSHANCHUYOUJIAN"))
      this.deleteLoading = true
      deleteFiles(
        this.multipleSelection.map(item => item.id)
      )
      .then(res => {
        const message = this.$i18n.locale === "zh" ? res.desZh : res.desEn

        if (res.code == 200) {
          iMessage.success(message)
          this.getFileHistory()
        } else {
          iMessage.error(message)
        }

        this.deleteLoading = false
      })
      .catch(() => this.deleteLoading = false)
    },
    // 多选下载
    handleDownload() {
      if (this.multipleSelection.length < 1) return iMessage.warn(this.$t("LK_QINGXUANZHEXUYAOXIAZHAIWENJIAN"))

      // downloadFile({
      //   applicationName: "rise",
      //   fileList: this.multipleSelection.map(item => item.fileName)
      // })
      downloadUdFile(this.multipleSelection.map(item => item.uploadId))
    },
    // 单个文件下载
    download(row) {
      // downloadFile({
      //   applicationName: "rise",
      //   fileList: row.fileName
      // })
      downloadUdFile(row.uploadId)
    },
    init() {
      this.getComments()
      this.getFileHistory()
    },
    save(type) {
      return Promise.all([
        this.saveComments(type), 
      ])
    }
  }
}
</script>

<style lang="scss" scoped>
.sampleDelivery{
    .header {
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
    }

    .uploadBtn {
    display: inline;
    margin-left: 10px;

    & + .el-button {
      margin-left: 10px;
    }
  }
}
</style>