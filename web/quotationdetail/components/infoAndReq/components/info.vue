<!--
 * @Author: ldh
 * @Date: 2021-04-22 11:44:23
 * @LastEditors: ldh
 * @LastEditTime: 2021-05-08 21:17:50
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\infoAndReq\components\info.vue
-->
<template>
	<div class="info">
		<iCard :title="$t('LK_LINGJIANJIBENXINXI')" collapse>
			<iFormGroup :key="$index" :row="4" inline>
				<iFormItem v-for="item in infos" :key="item.props" :label="$t(item.key)">
					<iText v-if="item.props === 'drawingDate'">{{ data[item.props] | dateFilter }}</iText>
					<iText v-else-if="item.props === 'isNew' || item.props === 'isInherit' || item.props === 'isUpdate'">{{ data[item.props] | numberStatusFilter }}</iText>
					<iText v-else>{{ data[item.props] }}</iText>
				</iFormItem>
			</iFormGroup>
		</iCard>
	</div>
</template>

<script>
import { iCard, iFormGroup, iFormItem, iText } from "rise"
import { infos } from "./data"
import filters from "@/utils/filters"

export default {
	components: { iCard, iFormGroup, iFormItem, iText },
	mixins: [ filters ],
	props: {
		data: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
    return {
      infos
    }
	}
}
</script>

<style lang="scss" scoped>
.info {
	::v-deep .el-form-item__label {
		width: 140px;
		font-size: 16px;
	}

	::v-deep .cardHeader {
		.title {
			font-size: 18px;
			color: #131523;
			font-weight: bold;
		}
	}

	::v-deep .cardBody {
		padding: 0 40px;
	}
}
</style>