<template>
  <iCard class="sourcePartCBD">
    <template #header>
      <div class="title">
        <span>{{ language("YUANLINGJIANMUJUCBD", "原零件模具CBD") }}</span>
        <span class="tip margin-left14">({{ language("DANWEI", "单位") }}：{{ language("YUAN", "元") }})</span>
      </div>
      <div class="header-control">
				<div class="btn" v-if="!disabled && !editDisabled">
          <el-popover
            placement="top"
            width="263"
            trigger="hover"
            :content="language('SOURCEPARTCBDQUOTE', '如需修模或减值，请引用如下CBD行项目，并且保留两位小数。')">
            <iButton slot="reference" @click="handleQuote">{{ language("YINYONG", "引用") }} <icon class="icon" name="iconzengjiacailiaochengben_lan" /></iButton>
          </el-popover>
				</div>
      </div>
    </template>
    <div class="body">
      <tableList lang class="table" :tableLoading="loading" :tableTitle="tableTitle" :tableData="tableListData" @handleSelectionChange="handleSelectionChange">
        <template #isShared="scope">
          <span>{{ scope.row.isShared | statesFilter }}</span>
        </template>
        <template #assetPrice="scope">
          <span>{{ floatFixNum( scope.row.assetPrice) }}</span>
        </template>
        <template #assetTotal="scope">
          <span>{{ floatFixNum(scope.row.assetPrice) }}</span>
        </template>
      </tableList>
    </div>
  </iCard>
</template>

<script>
import { iCard, iButton, icon, iMessage } from "rise"
import tableList from "rise/web/quotationdetail/components/tableList"
import { statesFilter } from "rise/web/quotationdetail/components/mouldAndDevelopmentCost/components/data"
import { sourcePartCBDTableTitle as tableTitle } from "../data"
import { floatFixNum } from "../../../data"
import { getMoldCbd } from "@/api/aeko/quotationdetail"

export default {
  components: { iCard, iButton, icon, tableList },
  props: {
    partInfo: {
      type: Object,
      required: true,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    },
    editDisabled: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      loading: false,
      tableTitle,
      tableListData: [],
      multipleSelection: []
    }
  },
  filters: {
    statesFilter
  },
  computed: {
    //eslint-disable-next-line no-undef
    ...Vuex.mapState({
        userInfo: state => state.permission.userInfo,
    })
  },
  methods: {
    floatFixNum,
    handleSelectionChange(list) {
      this.multipleSelection = list
    },
    handleQuote() {
      this.$emit("quote", this.multipleSelection)
    },
    getMoldCbd() {
      this.loading = true
      
      getMoldCbd({
        partsNum: this.partInfo.originalPartNum,
        supplierId: this.userInfo.supplierId || this.$route.query.supplierId
      })
      .then(res => {
        if (res.code === "0") {
          this.tableListData = 
            Array.isArray(res.data) ? 
            res.data.map(item => ({
              ...item,
              isShared: 0
            })) : 
            []
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      })
      .finally(() => this.loading = false)
    }
  }
}
</script>

<style lang="scss" scoped>
.sourcePartCBD {
  ::v-deep .cardHeader {
		padding-bottom: 20px;
	}

  ::v-deep .title {
		.tip {
			font-size: 14px;
			font-weight: 400;
			line-height: 16px;
			color: #485465;
			opacity: 0.7;
		}
  }

	.header-control {
		.btn {
			display: inline-block;
		}
	}

  .icon {
    width: 16px;
    margin-left: 6px;
  }
}
</style>