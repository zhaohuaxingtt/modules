<template>
  <iPage class="relatingParts">
    <div class="header clearFloat">
      <div class="title">{{ language("CHAKANGUANLIANLINGJIAN", "查看关联零件") }}</div>
      <div class="control">
        <iButton @click="handleBack">{{ language("FANHUI", "返回") }}</iButton>
        <iButton v-if="!disabled" @click="handleAdd">{{ language("XINZENGLINGJIAN", "新增零件") }}</iButton>
        <iButton v-if="!disabled" @click="handleDelete">{{ language("SHANCHULINGJIAN", "删除零件") }}</iButton>
        <iButton v-if="!disabled" :loading="saveLoading" @click="handleSave">{{ language("BAOCUN", "保存") }}</iButton>
      </div>
    </div>
    <iCard class="margin-top20">
      <tableList 
        lang
        index
        class="table"
        v-loading="loading"
        :tableTitle="tableTitle"
        :tableData="tableListData"
        @handleSelectionChange="handleSelectionChange">
        <template #partNum="scope">
          <iInput v-model="scope.row.partNum"></iInput>
        </template>
        <template v-for="item in moulds" #[item.mouldId]="scope">
          <div :key="item.mouldId">
            <icon v-if="scope.row.selected.includes(item.mouldId)" symbol name="iconguanlianlingjian-xuanzhong" class="cursor" @click.native="changeStatus(false, item.mouldId, scope.row)"></icon>
            <icon v-else symbol name="iconguanlianlingjian-moren" class="cursor" @click.native="changeStatus(true, item.mouldId, scope.row)"></icon>
          </div>
        </template>
      </tableList>
    </iCard>
  </iPage>
</template>

<script>
import { iPage, iButton, iCard, iInput, icon, iMessage, iMessageBox } from "rise"
import tableList from "rise/web/quotationdetail/components/tableList"
import { tableTitle } from "./components/data"
import { getMoulds, getMouldParts, saveMouldParts } from "@/api/aeko/quotationdetail"

export default {
  components: { iPage, iButton, iCard, iInput, icon, tableList },
  // props: {
  //   disabled: {
  //     type: Boolean,
  //     default: false
  //   }
  // },
  data() {
    return {
      disabled: false,
      loading: false,
      saveLoading: false,
      tableTitle,
      moulds: [],
      tableListData: [],
      multipleSelection: []
    }
  },
  created() {
    this.disabled = this.$route.query.disabled ? (this.$route.query.disabled === "false" ? false : true) : true

    if (this.$route.query.quotationId) {
      this.getMoulds()
      this.getMouldParts()
    }
  },
  methods: {
    getMoulds() {
      getMoulds({
        quotationId: this.$route.query.quotationId
      })
      .then(res => {
        if (res.code == 200) {
          this.tableTitle = tableTitle
          this.moulds = Array.isArray(res.data.mouldCbdEntityList) ? res.data.mouldCbdEntityList : []

          const title = 
            Array.isArray(res.data.mouldCbdEntityList) ? 
            res.data.mouldCbdEntityList.map(item => ({
              props: item.mouldId, 
              width: "400",
              renderHeader: () => (<div><span>{ item.mouldId }</span><br/><span>{ item.fixedAssetsName }</span></div>)
            })) : 
            []

          this.tableTitle = this.tableTitle.concat(title)
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      })
    },
    getMouldParts() {
      this.loading = true

      getMouldParts({
        quotationId: this.$route.query.quotationId
      })
      .then(res => {
        if (res.code == 200) {
          const list = Array.isArray(res.data) ? res.data : []
          list.forEach(item => {
            this.$set(item, "selected", [])

            if (Array.isArray(item.mouldInfoList)) {
              item.mouldInfoList.forEach(mould => {
                item.selected.push(mould.modelId)
              })
            }
          })

          this.tableListData = list
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      })
      .finally(() => this.loading = false)
    },
    handleBack() {
      this.$router.go(-1)
    },
    handleAdd() {
      this.tableListData.push({
        selected: []
      })
    },
    async handleDelete() {
      if (this.multipleSelection.length) {
        await iMessageBox(
          this.language("SHIFOUSHANCHUXUANZHONGNEIRONG", "是否删除选中内容？"),
          { confirmButtonText: this.language("SHI", "是"), cancelButtonText: this.language("FOU", "否") }
        )
      }

      this.tableListData = this.tableListData.filter(item => !this.multipleSelection.includes(item))
    },
    handleSave() {
      const list = this.tableListData.map(item => ({
        partNum: item.partNum,
        mouldInfoList: item.selected.map(mouldId => {
          const current = this.moulds.find(mould => mould.mouldId === mouldId)
          return {
            modelId: mouldId,
            assetName: current.fixedAssetsName
          }
        })
      }))

      this.saveLoading = true
      saveMouldParts({
        quotationId: this.$route.query.quotationId,
        list
      })
      .then(res => {
        if (res.code == 200) {
          iMessage.success(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
          this.getMoulds()
          this.getMouldParts()
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      })
      .finally(() => this.saveLoading = false)
    },
    handleSelectionChange(list) {
      this.multipleSelection = list
    },
    changeStatus(value, key, row) {
      if (this.disabled) return

      if (value) {
        row.selected.push(key)
      } else {
        this.$set(row, "selected", row.selected.filter(item => item != key))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.relatingParts {
  .header {
    position: relative;

    .title {
      font-size: 20px;
      font-weight: bold;
      color: #000;
      height: 28px;
      line-height: 28px;
    }

    .control {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translate(0, -50%);
      display: flex;
      align-items: center;
      height: 30px;
    }
  }

  ::v-deep .icon {
    width: 22px;
    height: 22px;
  }
}
</style>