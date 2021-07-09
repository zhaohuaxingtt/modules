<!--
 * @Author: ldh
 * @Date: 2021-04-22 15:49:47
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-06-10 18:19:45
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\originAndCapacity\components\capacity.vue
-->
<template>
  <div class="capacity" v-loading="loading">
    <iCard>
      <template #header>
        <div class="header">
          <div>
            <span class="title">{{ $t('LK_SHENGCHANNENGLI') }}</span>
            <span class="tip margin-left10">{{ $t('LK_SHENGCHANNENGLITIPS') }}</span>
          </div>
          <div v-if="!disabled" class="control">
            <iButton @click="handleAdd">{{ $t('LK_TIANJIAHANG') }}</iButton>
            <iButton @click="handleDel">{{ $t('LK_SHANCHUHANG') }}</iButton>
          </div>
        </div>
      </template>
      <div>
        <tableList class="table" index :tableData="tableListData" :tableTitle="tableTitle" @handleSelectionChange="handleSelectionChange">
          <template #leadTime="scope">
            <el-input v-if="!disabled" v-model="scope.row.leadTime"></el-input>
            <span v-else>{{ scope.row.leadTime }}</span>
          </template>
          <template #workDayWeek="scope">
            <el-input v-if="!disabled" v-model="scope.row.workDayWeek"></el-input>
            <span v-else>{{ scope.row.workDayWeek }}</span>
          </template>
          <template #weekDailyShift="scope">
            <el-input v-if="!disabled" v-model="scope.row.weekDailyShift"></el-input>
            <span v-else>{{ scope.row.weekDailyShift }}</span>
          </template>
          <template #weekManufactureCapability="scope">
            <el-input v-if="!disabled" v-model="scope.row.weekManufactureCapability"></el-input>
            <span v-else>{{ scope.row.weekManufactureCapability }}</span>
          </template>
          <template #maxWeekManufactureCapability="scope">
            <el-input v-if="!disabled" v-model="scope.row.maxWeekManufactureCapability"></el-input>
            <span v-else>{{ scope.row.maxWeekManufactureCapability }}</span>
          </template>
          <template #maxWorkDayYear="scope">
            <el-input v-if="!disabled" v-model="scope.row.maxWorkDayYear"></el-input>
            <span v-else>{{ scope.row.maxWorkDayYear }}</span>
          </template>
          <template #startWeek="scope">
            <iDatePicker
              class="date"
              prefix-icon="icon iconfont iconxuanzeriqi"
              v-model="scope.row.startWeek"
              type="week"
              format="yyyyWW"
              :picker-options="{ firstDayOfWeek: 1 }"
              v-if="!disabled">
            </iDatePicker>
            <span v-else>{{ scope.row.startWeek | weekFilter }}</span>
          </template>
          <template #endWeek="scope">
            <iDatePicker
              class="date"
              ref="datepicker"
              prefix-icon="icon iconfont iconxuanzeriqi"
              v-model="scope.row.endWeek"
              type="week"
              format="yyyyWW"
              :picker-options="{ firstDayOfWeek: 1 }"
              v-if="!disabled">
              <!-- :disabled="scope.$index === tableListData.length - 1" -->
            </iDatePicker>
            <span v-else>{{ scope.row.endWeek | weekFilter }}</span>
          </template>
        </tableList>
        <div class="tip margin-top30">
          <p>1. {{ $t('LK_CAPACITYTIPS_1') }}</p>
          <p>2. {{ $t('LK_CAPACITYTIPS_2') }}</p>
          <p>3. {{ $t('LK_CAPACITYTIPS_3') }}</p>
          <p>4. {{ $t('LK_CAPACITYTIPS_4') }}</p>
          <p>5. {{ $t('LK_CAPACITYTIPS_5') }}</p>
          <p>6. {{ $t('LK_CAPACITYTIPS_6') }}</p>
          <p>7. {{ $t('LK_CAPACITYTIPS_7') }}</p>
          <p>8. {{ $t('LK_CAPACITYTIPS_8') }}</p>
        </div>
      </div>
    </iCard>
  </div>
</template>

<script>
import { iCard, iButton, iMessage, iDatePicker } from "rise"
import tableList from "../../tableList"
import { capacityTableTitle as tableTitle } from "../components/data"
import { getSupplierPlantCaps, saveSupplierPlantCap } from "@/api/rfqManageMent/quotationdetail"
import filters from "@/utils/filters"

export default {
  components: {
		iCard,
    iButton,
    iDatePicker,
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
    }
  },
  watch: {
    // ['refs.datepicker'](nv) {
    //   console.log(nv)
    // }
  },
  data() {
    return {
      loading: false,
      tableTitle,
      tableListData: [],
      multipleSelection: []
    }
  },
  computed: {
    // eslint-disable-next-line no-undef
    ...Vuex.mapState({
      userInfo: state => state.permission.userInfo,
    })
  },
  methods: {
    getSupplierPlantCaps() {
      this.loading = true

      getSupplierPlantCaps({
        quotationId: this.partInfo.quotationId,
      })
      .then(res => {
        if (res.code == 200) {
          this.tableListData = Array.isArray(res.data) ? res.data : []
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }

        this.loading = false
      })
      .catch(() => this.loading = false)
    },
    handleSelectionChange(list) {
      this.multipleSelection = list
    },
    handleAdd() {
      this.tableListData.push({})
    },
    handleDel() {
      this.tableListData = this.tableListData.filter(item => !this.multipleSelection.includes(item))
    },
    async validateForm() {
      this.tableListData.forEach((item, index) => {
        if (!item.leadTime) throw this.$t("LK_TIQIANZHUNBEIQIZHOUBUNENGWEIKONG")
        if (!item.workDayWeek) throw this.$t("LK_MEIZHOUGONGZUOTIANSHUBUNENGWEIKONG")
        if (!item.weekDailyShift) throw this.$t("LK_MEITIANBANSHUBUNENGWEIKONG")
        if (!item.weekManufactureCapability) throw this.$t("LK_ZHOUZHENGCHANGCHANNENGBUNENGWEIKONG")
        if (!item.maxWeekManufactureCapability) throw this.$t("LK_ZHOUZUIDACHANNENGBUNENGWEIKONG")
        if (!item.maxWorkDayYear) throw this.$t("LK_NIANZUIDAGONGZUOTIANSHUBUNENGWEIKONG")
        if (!item.startWeek) throw this.$t("LK_QISHIZHOUBUNENGWEIKONG")
        
        if (index === this.tableListData.length - 1 && item.endWeek) {
          throw this.$t("LK_ZUIHOUYITIAOCHANNENGSHUJUDEJIEZHIZHOUBIXUWEIKONG")
        }
        
        if (item.endWeek) {
          // eslint-disable-next-line no-undef
          if (+moment(item.endWeek) < +moment(item.startWeek)) throw this.$t("LK_JIEZHIZHOUBUNENGXIAOYUQISHIZHOU")
        }
      })
    },
    async saveSupplierPlantCap() {
      try {
        await this.validateForm()

        const res = await saveSupplierPlantCap({
          partNum: this.partInfo.partNum,
          partPrjCode: this.partInfo.fsNum,
          rfqId: this.partInfo.rfqId,
          round: this.partInfo.round,
          // supplierId: this.userInfo.supplierId,
          userId: this.userInfo.id,
          quotationId: this.partInfo.quotationId,
          list: this.tableListData.map(item => ({
            ...item,
            partNum: this.partInfo.partNum,
            partPrjCode: this.partInfo.fsNum,
            rfqId: this.partInfo.rfqId,
            round: this.partInfo.round,
            // supplierId: this.userInfo.supplierId,
            userId: this.userInfo.id
          }))
        })
        
        if (res.code == 200) {
          iMessage.success(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
          this.getSupplierPlantCaps()
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }

        return res
      } catch(e) {
        return iMessage.error(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.capacity {
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

  .tip {
    line-height: 20px;
    font-size: 14px;
    color: #86878E;
  }

  .date {
    width: 100%;
    position: relative;

    // &:hover {
    //   &:after {
    //     display: none;
    //   }
    // }

    // &:after {
    //   position: absolute;
    //   top: 50%;
    //   right: 8px;
    //   transform: translate(0, -50%);
    //   color: #CBCBCB;
    //   font-family: "iconfont" !important;
    //   font-size: 16px;
    //   font-style: normal;
    //   -webkit-font-smoothing: antialiased;
    //   -moz-osx-font-smoothing: grayscale;
    //   content: "\e633";
    // }

    // ::v-deep input {
      // padding-left: 15px;
    // }
    ::v-deep .el-input__prefix {
      position: absolute;
      top: 0;
      left: 8px;

      .icon {
        line-height: 30px;
        font-size: 16px;
        color: #CBCBCB;
      }
    }

    ::v-deep i.el-icon-date {
      display: none;
    }
  }
}
</style>
