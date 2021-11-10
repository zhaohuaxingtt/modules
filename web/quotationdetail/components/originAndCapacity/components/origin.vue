<!--
 * @Author: ldh
 * @Date: 2021-04-22 15:11:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-12 19:46:27
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\originAndCapacity\components\origin.vue
-->
<template>
  <div class="origin">
    <iCard :title="language('LK_GONGYINGSHANGSHENGCHANDI', '供应商生产地')">
      <template v-if="!disabled" #header-control>
        <iButton @click="selectOrigin">{{ language('LK_XUANZESHENGCHANGONGCHANG', '选择生产工厂') }}</iButton>
      </template>
      <div>
        <tableList class="table" :selection="false" index :tableData="tableListData" :tableTitle="tableTitle">
          <template #isNominate="scope">
            <span>{{ scope.row.isNominate | boolFilter }}</span>
          </template>
          <template #effectFlag="scope">
            <span>{{ scope.row.effectFlag | boolFilter }}</span>
          </template>
        </tableList>
      </div>
    </iCard>
    <originDialog :visible.sync="visible" :quotationId="partInfo.quotationId" @confirm="updateOrigin" />                   
  </div>
</template>

<script>
import { iCard, iButton, iMessage } from "rise"
import originDialog from "./originDialog"
import tableList from "../../tableList"
import { originTableTitle as tableTitle } from "./data"
import { getSupplierPartLocation, saveSupplierPartAddLocation } from "@/api/rfqManageMent/quotationdetail"
import filters from "@/utils/filters";

export default {
  components: {
		iCard,
    iButton,
    originDialog,
    tableList
	},
  mixins: [ filters ],
  props: {
    partInfo: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    // eslint-disable-next-line no-undef
    ...Vuex.mapState({
      userInfo: state => state.permission.userInfo,
    }),
  },
  data() {
    return {
      visible: false,
      tableTitle,
      tableListData: []
    }
  },
  methods: {
    getSupplierPartLocation() {
      this.loading = true

      getSupplierPartLocation({
        quotationId: this.partInfo.quotationId
      })
      .then(res => {
        if (res.code == 200) {
          this.tableListData = [{
            ...res.data,
            ...res.data.addressInfoVo,
            id: res.data.id
          }]
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      })
      .catch(() => this.loading = false)
    },
    selectOrigin() {
      this.visible = true
    },
    updateOrigin(data) {
      this.tableListData = [{ ...data, factoryAbbrName: data.factoryShortname, effectFlag: data.isActive }]
    },
    saveSupplierPartAddLocation(type) {
      if (!this.tableListData[0]) return

      return saveSupplierPartAddLocation({
        quotationId: this.partInfo.quotationId,
        supplierPlantId: this.tableListData[0].id,
        userId: this.userInfo.id
      })
      // .then(res => {
      //   if (res.code == 200) {
      //     if (type !== "submit") iMessage.success(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
      //     this.getSupplierPartLocation()
      //   } else {
      //     iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
      //   }
      // })
      // .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.origin {
  ::v-deep .cardHeader {
		.title {
			font-size: 18px;
			color: #131523;
			font-weight: bold;
		}
	}

  .table {
    &::before {
      display: none;
    }
  }
}
</style>
