<!--
 * @Author: ldh
 * @Date: 2021-04-22 12:10:17
 * @LastEditors: ldh
 * @LastEditTime: 2021-04-29 16:03:30
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\infoAndReq\components\aggregate\index.vue
-->
<template>
  <div class="aggregate">
		<iCard>
			<outputPlan :data="data.outputPlanVO" />
			<i class="cut margin-top10" />
			<svwContact class="margin-top30" :data="data.contactPerson"/>
			<i class="cut margin-top10" />
			<projectSchedule class="margin-top30" :data="data.projectProgress" />
		</iCard>
	</div>
</template>

<script>
import { iCard } from "rise"
import outputPlan from "./components/outputPlan"
import svwContact from "./components/svwContact"
import projectSchedule from "./components/projectSchedule"

export default {
	components: {
		iCard,
		outputPlan,
		svwContact,
		projectSchedule
	},
	props: {
		data: {
			type: Object,
			default: () => ({
				outputPlanVO: {},
				contactPerson: [],
				projectProgress: {}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.aggregate {
	.cut {
		display: block;
		height: 1px;
		background: #E3E3E3;
	}
}
</style>