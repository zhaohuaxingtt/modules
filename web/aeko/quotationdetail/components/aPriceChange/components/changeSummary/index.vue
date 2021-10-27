<template>
  <iCard class="changeSummary">
    <template #header>
      <div class="title">
        <span>{{ `${ language("BIANDONGZHI", "变动值") } - ${ language("HUIZONGBIAO", "汇总表") }` }}</span>
        <span class="tip margin-left12">{{ language("DANWEI", "单位") }}：RMB/Pc.</span>
      </div>
      <div class="header-control">
        <el-checkbox v-model="isChange" class="isChangeCheckbox" :class="{ isChangeCheckboxSpace: !isChange && !disabled }" :disabled="changeSummaryDisabled || disabled" @change="handleChangeByIsChange">{{ language("WUBIANDONGZHI", "无变动值") }}</el-checkbox>
				<div v-if="!changeSummaryDisabled && !isChange && !disabled" class="btn">
					<iButton :loading="saveLoading" @click="handleSave">{{ language("BAOCUN", "保存") }}</iButton>
					<iButton @click="handleAdd">{{ language("TIANJIAHANG", "添加行") }}</iButton>
					<iButton @click="handleDelete">{{ language("SHANCHUHANG", "删除行") }}</iButton>
				</div>
      </div>
    </template>
		<div class="body margin-top20">
			<el-table class="table" ref="table" :data="tableListData" v-loading="loading" @selection-change="handleSelectionChange">
				<el-table-column type="selection" align="center" width="55"></el-table-column>
				<el-table-column label="#" type="index" align="center" width="55" ></el-table-column>
				<el-table-column :render-header="h => h('span', { domProps: { innerHTML: `${ language('LEIBIE', '类别') }<span class='require'>*</span>` }})" align="center" width="135">
					<template v-slot="scope">
						<iSelect v-if="!changeSummaryDisabled && !disabled" v-model="scope.row.typeName" class="select-center">
							<el-option
								v-for="item in moduleOptions"
								:key="item.value"
                :label="`${ item.seq } ${ language(item.key, item.label) }`"
                :value="item.value"
							></el-option>
						</iSelect>
						<span v-else>{{ getTypeName(scope.row.typeName) }}</span>
					</template>
				</el-table-column>
        <el-table-column :render-header="h => h('span', { domProps: { innerHTML: `${ language('NEIRONG', '内容') }<span class='require'>*</span>` }})" align="center">
          <template v-slot="scope">
						<el-popover
							placement="top"
							width="200"
							trigger="hover"
							:content="scope.row.newContent"
							:disabled="newContentFoucus || !scope.row.newContent">
							<iInput v-if="!changeSummaryDisabled && !disabled" v-model="scope.row.newContent" slot="reference" class="input-center" @focus="newContentFoucus = true" @blur="newContentFoucus = false" />
							<span v-else slot="reference">{{ scope.row.newContent | contentFilter }}</span>
						</el-popover>
          </template>
        </el-table-column>
				<el-table-column :label="language('YUANLINGJIAN', '原零件')" align="center">
					<el-table-column :render-header="h => h('span', { domProps: { innerHTML: `${ language('YUANLINGJIANHAO', '原零件号') }<span class='require'>*</span>` }})" align="center">
						<template v-slot="scope">
							<iInput v-if="!changeSummaryDisabled && !disabled" v-model="scope.row.originPartNum" class="input-center" />
							<span v-else>{{ scope.row.originPartNum }}</span>
						</template>
					</el-table-column>
					<el-table-column :render-header="h => h('span', { domProps: { innerHTML: `${ language('DANJIA', '单价') }<span class='require'>*</span>` }})" align="center">
						<template v-slot="scope">
							<iInput v-if="!changeSummaryDisabled && !disabled" v-model="scope.row.originUnitPrice" class="input-center" @input="handleInputByNumber($event, 'originUnitPrice', scope.row, 4, updateOriginUnitPrice)" />
							<span v-else>{{ scope.row.originUnitPrice }}</span>
						</template>
					</el-table-column>
					<el-table-column :render-header="h => h('span', { domProps: { innerHTML: `${ language('DANWEI', '单位') }<span class='require'>*</span>` }})" align="center">
						<template v-slot="scope">
							<iInput v-if="!changeSummaryDisabled && !disabled" v-model="scope.row.originUnit" class="input-center" />
							<span v-else>{{ scope.row.originUnit }}</span>
						</template>
					</el-table-column>
					<el-table-column :render-header="h => h('span', { domProps: { innerHTML: `${ language('YONGLIANG', '用量') }<span class='require'>*</span>` }})" align="center">
						<template v-slot="scope">
							<iInput v-if="!changeSummaryDisabled && !disabled" v-model="scope.row.originUseage" class="input-center" @input="handleInputByNumber($event, 'originUseage', scope.row, 4, updateOriginUseage)" />
							<span v-else>{{ scope.row.originUseage }}</span>
						</template>
					</el-table-column>
					<el-table-column :label="language('XIAOJI', '小计')" align="center" prop="originTotalPrice">
						<template slot-scope="scope">
							{{ floatFixNum(scope.row.originTotalPrice) }}
						</template>
					</el-table-column>
				</el-table-column>
				<el-table-column :label="language('XINLINGJIAN', '新零件')" align="center">
					<el-table-column :render-header="h => h('span', { domProps: { innerHTML: `${ language('XINLINGJIANHAO', '新零件号') }<span class='require'>*</span>` }})" align="center">
						<template v-slot="scope">
							<iInput v-if="!changeSummaryDisabled && !disabled" v-model="scope.row.newPartNum" class="input-center" />
							<span v-else>{{ scope.row.newPartNum }}</span>
						</template>
					</el-table-column>
					<el-table-column :render-header="h => h('span', { domProps: { innerHTML: `${ language('DANJIA', '单价') }<span class='require'>*</span>` }})" align="center">
						<template v-slot="scope">
							<iInput v-if="!changeSummaryDisabled && !disabled" v-model="scope.row.newUnitPrice" class="input-center" @input="handleInputByNumber($event, 'newUnitPrice', scope.row, 4, updateNewUnitPrice)" />
							<span v-else>{{ scope.row.newUnitPrice }}</span>
						</template>
					</el-table-column>
					<el-table-column :render-header="h => h('span', { domProps: { innerHTML: `${ language('DANWEI', '单位') }<span class='require'>*</span>` }})" align="center">
						<template v-slot="scope">
							<iInput v-if="!changeSummaryDisabled && !disabled" v-model="scope.row.newUnit" class="input-center" />
							<span v-else>{{ scope.row.newUnit }}</span>
						</template>
					</el-table-column>
					<el-table-column :render-header="h => h('span', { domProps: { innerHTML: `${ language('YONGLIANG', '用量') }<span class='require'>*</span>` }})" align="center">
						<template v-slot="scope">
							<iInput v-if="!changeSummaryDisabled && !disabled" v-model="scope.row.newUseage" class="input-center" @input="handleInputByNumber($event, 'newUseage', scope.row, 4, updateNewUseage)" />
							<span v-else>{{ scope.row.newUseage }}</span>
						</template>
					</el-table-column>
					<el-table-column :label="language('XIAOJI', '小计')" align="center" prop="newTotalPrice">
						<template slot-scope="scope">
							{{ floatFixNum(scope.row.newTotalPrice) }}
						</template>
					</el-table-column>
				</el-table-column>
				<el-table-column :label="language('BIANDONGZHI', '变动值')" align="center" prop="changeValue">
					<template slot-scope="scope">
						{{ floatFixNum(scope.row.changeValue) }}
					</template>
				</el-table-column>
				<template #append>
					<div class="summary">
						<span>TOTAL</span>
						<span>RMB {{ floatFixNum(total) }}</span>
					</div>
				</template>
			</el-table>
		</div>
  </iCard>
</template>

<script>
/* eslint-disable no-undef */

import { iCard, iButton, iInput, iSelect, iMessage, iMessageBox } from "rise"
import { handleInputByNumber } from "rise/web/quotationdetail/components/data"
import { getAekoCbdPriceSum, saveAekoCbdPriceSum } from "@/api/aeko/quotationdetail"
import { floatFixNum } from "../../../data"

export default {
	components: { iCard, iButton, iInput, iSelect, iMessage },
	props: {
		partInfo: {
			type: Object,
			required: true,
			default: () => ({})
		},
		moduleOptions: {
			type: Array,
			required: true,
			default: () => ([])
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			loading: false,
			changeSummaryDisabled: false,
			isChange: true,
			saveLoading: false,
			tableListData: [],
			multipleSelection: [],
      total: "0.0000",
			validateKeys: [
				"typeName",
				"newContent",
				"originPartNum",
				"originUnitPrice",
				"originUnit",
				"originUseage",
				"newPartNum",
				"newUnitPrice",
				"newUnit",
				"newUseage"
			],
			newContentFoucus: false
		}
	},
	filters: {
		contentFilter(value) {
			const valueStr = value ? value + "" : ""

			return valueStr.length > 20 ? valueStr.substr(0, 20) + "..." : valueStr
		}
	},
	methods: {
		floatFixNum,
		getTypeName(value) {
			const current = this.moduleOptions.find(item => item.code == value)

			return current ? `${ current.seq } ${ this.language(current.key, current.label) }` : value
		},
		getAekoCbdPriceSum() {
			this.loading = true

			getAekoCbdPriceSum({
				quotationId: this.partInfo.quotationId
			})
			.then(res => {
				if (res.code == 200) {
					const data = res.data ? res.data : {}
					this.isChange = !data.isChange
					this.tableListData = Array.isArray(data.priceList) ? data.priceList : []

					this.total = this.tableListData.reduce((acc, cur) => {
						this.$set(cur, "changeValue", math.subtract(math.bignumber(cur.newTotalPrice || 0), math.bignumber(cur.originTotalPrice || 0)).toFixed(4))
						return math.add(math.bignumber(math.bignumber(acc || 0)), math.bignumber(cur.changeValue || 0)).toFixed(4)
					}, 0)
				} else {
					iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
				}
			})
			.finally(() => this.loading = false)
		},
		handleChangeByIsChange() {
			if (this.isChange) {
				if (this.tableListData.length) {
					this.isChange = false
					return iMessage.warn(this.language("QINGXIANSHANCHUHUIZONGBIAOHANGXIANGMU", "请先删除汇总表行项目。"))
				}
			}

			this.$emit("updateIsChange", this.isChange)
		},
    handleInputByNumber,
		handleSelectionChange(list) {
			this.multipleSelection = list
		},
		save() {
      return this.saveAekoCbdPriceSum(
        () => this.saveLoading = true,
        () => this.saveLoading = false
      )
    },
		handleSave() {
			this.save()
      .then(res => {
        if (res.code == 200) {
					iMessage.success(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
					this.$emit("getBasicInfo")
				} else {
					iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
				}
      })
		},
		async saveAekoCbdPriceSum(beforeHook, afterHook) {
			if (!this.tableListData.every(item => this.validateKeys.every(key => item[key] || item[key] === 0))) {
				return iMessage.error(this.language("QINGWEIHUHAOBIANTIANXIANGHOUZAIBAOCUN", "请维护好必填项后，再保存。"))
			}

			if (typeof beforeHook === "function") beforeHook()

			return saveAekoCbdPriceSum({
				isChange: !this.isChange,
				quotationId: this.partInfo.quotationId,
				priceList: this.tableListData
			})
			.finally(() => {
				if (typeof afterHook === "function") afterHook()
			})
		},
		handleAdd() {
			this.tableListData.push({
				originPartNum: this.partInfo.originalPartNum,
        originTotalPrice: "0.0000",
				newPartNum: this.partInfo.partNum,
        newTotalPrice: "0.0000",
        changeValue: "0.0000",
      })
		},
		async handleDelete() {
      if (this.multipleSelection.length) {
        await iMessageBox(
          this.language("QINGQUERENSHIFOUSHANCHU", "请确认是否删除？"),
          { confirmButtonText: this.language("SHI", "是"), cancelButtonText: this.language("FOU", "否") }
        )
      }

			this.tableListData = this.tableListData.filter(item => !this.multipleSelection.includes(item))
      this.computeTotal()
		},
    updateOriginUnitPrice(value, key, row) {
      this.computeOriginTotalPrice(value, key, row)
    },
    updateOriginUseage(value, key, row) {
      this.computeOriginTotalPrice(value, key, row)
    },
    computeOriginTotalPrice(originValue, originKey, row) {
      this.$set(row, "originTotalPrice", math.multiply(math.bignumber(row.originUnitPrice || 0), math.bignumber(row.originUseage || 0)).toFixed(4))

      this.computeChangeValue(originValue, originKey, row)
    },
    updateNewUnitPrice(value, key, row) {
      this.computeNewTotalPrice(value, key, row)
    },
    updateNewUseage(value, key, row) {
      this.computeNewTotalPrice(value, key, row)
    },
    computeNewTotalPrice(originValue, originKey, row) {
      this.$set(row, "newTotalPrice", math.multiply(math.bignumber(row.newUnitPrice || 0), math.bignumber(row.newUseage || 0)).toFixed(4))

      this.computeChangeValue(originValue, originKey, row)
    },
    computeChangeValue(originValue, originKey, row) {
      if (row.newUnitPrice && row.newUseage) {
        this.$set(row, "changeValue", math.subtract(math.bignumber(row.newTotalPrice || 0), math.bignumber(row.originTotalPrice || 0)).toFixed(4))
      } else {
        this.$set(row, "changeValue", "0.0000")
      }

      this.computeTotal(originValue, originKey)
    },
    computeTotal(originValue, originKey) {
      this.total = this.tableListData.reduce((acc, cur) => math.add(math.bignumber(math.bignumber(acc || 0)), math.bignumber(cur.changeValue || 0)).toFixed(4), 0)

			this.$emit("updateTotal", this.total)
    }
	}
};
</script>

<style lang="scss" scoped>
.changeSummary {
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

	.isChangeCheckbox {
		::v-deep .el-checkbox__label {
			padding-left: 10px;
			font-size: 16px;
			font-weight: 400;
			color: #000;
		}

		::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
			color: #1763F7;
		}
	}
	
	.isChangeCheckboxSpace {
		margin-right: 32px;
	}

	.table {
    // .manufacturingMethodColumn {
    //   position: relative;

    //   ::v-deep .iconFont {
    //     width: 30px;
    //     position: absolute;
    //     top: 50%;
    //     left: 0;
    //     transform: translate(0, -50%);

    //     svg {
    //       vertical-align: middle;
    //       float: left;
    //     }
    //   }

    //   & > div:not(.iconFont) {
    //     padding-left: 30px;
    //   }
    // }

    ::v-deep td {
      border-right: 0;
      border-bottom: 1px solid rgba(112, 112, 112, .1);
    }

		::v-deep .require {
			margin-left: 3px;
			color: #E30D0D;
		}

    .summary {
      height: 50px;
      line-height: 50px;
      background: #F7FAFF;
      font-weight: bold;
      display: flex;
      justify-content: space-between;

      span:first-of-type {
        padding-left: 19px;
      }

      span:last-of-type {
        padding-right: 12px;
      }
    }
  }
}
</style>