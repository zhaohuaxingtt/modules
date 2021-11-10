<!--
 * @Author: ldh
 * @Date: 2021-04-22 15:49:47
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-12 19:25:01
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\originAndCapacity\components\capacity.vue
-->
<template>
  <div class="capacity" v-loading="loading">
    <iCard>
      <template #header>
        <div class="header">
          <div>
            <span class="title">{{ language('LK_SHENGCHANNENGLI', '生产能力') }}</span>
            <span class="tip margin-left10">{{ language('LK_SHENGCHANNENGLITIPS', '上汽大众产能信息: 供应商针对此次询价车型承诺给上汽大众的产能') }}</span>
          </div>
          <div v-if="!disabled" class="control">
            <iButton @click="handleAdd">{{ language('LK_TIANJIAHANG', '添加行') }}</iButton>
            <iButton @click="handleDel">{{ languaget('LK_SHANCHUHANG', '删除行') }}</iButton>
          </div>
        </div>
      </template>
      <div>
        <tableList lang class="table" index :tableData="tableListData" :tableTitle="tableTitle" @handleSelectionChange="handleSelectionChange">
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
          <p>1. {{ language('LK_CAPACITYTIPS_1', '提前准备周期：以周为单位，是从当前加工工厂的能力水平出发，要提高到周最大产能所需要的时间(包括物料准备、人员准备等)。如果能力随时可以立即达到最大能力则此处填0；') }}</p>
          <p>2. {{ language('LK_CAPACITYTIPS_2', '每周工作天数：是指周正常产能条件下，每周的工作日，一般为5天；') }}</p>
          <p>3. {{ language('LK_CAPACITYTIPS_3', '每周班数：是指周正常产能条件下，基于每周工作天数的每天班数；') }}</p>
          <p>4. {{ language('LK_CAPACITYTIPS_4', '周正常产能：正常工作班数和正常工作天数条件下，每周生产的零件数量，单位为件，请不要填写日能力或者年能力。要求周正常产能50周应不小于询价峰值年产量；') }}</p>
          <p>5. {{ language('LK_CAPACITYTIPS_5', '周最大产能：通过增加班数或者每周工作日天数等措施，每周最大生产的零件数量，单位为件，请不要填写日能力或者年能力，周最大产能要求至少达到周正常产能+15%；') }}</p>
          <p>6. {{ language('LK_CAPACITYTIPS_6', '年最大工作天数：是指最大产能条件下，每年的最大工作天数，单位为天；') }}</p>
          <p>7. {{ language('LK_CAPACITYTIPS_7', '起始周：从何年何周起具备所填写的产能，可根据情况填写多条产能数据，但各条产能数据的时间需要连续，输入时间的时间格式必须为“yyyyww”六位，比如“201101”；') }}</p>
          <p>8. {{ language('LK_CAPACITYTIPS_8', '截止周：到何年何周为止具备所填写的产能。最后一条产能数据的截至周必须为空。输入的时间格式必须为“yyyyww”六位，比如“201101”；') }}</p>
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
        if (!item.leadTime) throw this.language("LK_TIQIANZHUNBEIQIZHOUBUNENGWEIKONG", "提前准备期(周)不能为空")
        if (!item.workDayWeek) throw this.language("LK_MEIZHOUGONGZUOTIANSHUBUNENGWEIKONG", "每周工作天数不能为空")
        if (!item.weekDailyShift) throw this.language("LK_MEITIANBANSHUBUNENGWEIKONG", "每天班数不能为空")
        if (!item.weekManufactureCapability) throw this.language("LK_ZHOUZHENGCHANGCHANNENGBUNENGWEIKONG", "周正常产能不能为空")
        if (!item.maxWeekManufactureCapability) throw this.language("LK_ZHOUZUIDACHANNENGBUNENGWEIKONG", "周最大产能不能为空")
        if (!item.maxWorkDayYear) throw this.language("LK_NIANZUIDAGONGZUOTIANSHUBUNENGWEIKONG", "年最大工作天数不能为空")
        if (!item.startWeek) throw this.language("LK_QISHIZHOUBUNENGWEIKONG", "起始周不能为空")

        if (index !== this.tableListData.length - 1 && !item.endWeek) {
          throw this.language("LK_FEIZUIHOUYIHANGJIEZHIZHOUBUNENGWEIKONG", "非最后一行截止周不能为空")
        }
        
        if (index === this.tableListData.length - 1 && item.endWeek) {
          throw this.language("LK_ZUIHOUYITIAOCHANNENGSHUJUDEJIEZHIZHOUBIXUWEIKONG", "最后一条产能数据的截至周必须为空")
        }
        
        if (item.endWeek) {
          // eslint-disable-next-line no-undef
          if (+moment(item.endWeek) < +moment(item.startWeek)) throw this.language("LK_JIEZHIZHOUBUNENGXIAOYUQISHIZHOU", "截止周不能小于起始周")
        }

        if (index !== 0) {
          if (+moment(item.startWeek) < +moment(this.tableListData[index - 1].endWeek)) {
            if (this.$i18n.locale === "zh") {
              throw `第${ index + 1 }行 ${ this.language("LK_QISHIZHOU", "起始周") }${ this.language("LK_BUNENGXIAOYU", "不能小于") } 第${ index }行 ${ this.language("LK_JIEZHIZHOU", "截止周") }`
            } else {
              throw `Line: ${ index + 1 } ${ this.language("LK_QISHIZHOU", "起始周") }${ this.language("LK_BUNENGXIAOYU", "不能小于") } Line: ${ index } ${ this.language("LK_JIEZHIZHOU", "截止周") }`
            }
          }
        }
      })
    },
    async saveSupplierPlantCap(type) {
      try {
        await this.validateForm()

        return saveSupplierPlantCap({
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
