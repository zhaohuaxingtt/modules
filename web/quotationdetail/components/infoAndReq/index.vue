<!--
 * @Author: ldh
 * @Date: 2021-04-27 14:19:47
 * @LastEditors: ldh
 * @LastEditTime: 2021-05-08 14:21:39
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\infoAndReq\index.vue
-->
<template>
  <div class="infoAndReq" v-loading="loading">
    <info ref="info" :data="partInfoGroup.partInfo" />
    <aggregate class="margin-top20" ref="aggregate" :data="partInfoGroup.aggregate" />
    <bnkAttachmentByProject class="margin-top20" ref="bnkAttachmentByProject" :partInfo="partInfo" :data="partInfoGroup.purchaseBnkList" />
    <bnkAttachmentByLogistics class="margin-top20" ref="bnkAttachmentByLogistics" :partInfo="partInfo" :data="partInfoGroup.logisticsBnkList" />
  </div>
</template>

<script>
import { iMessage } from "rise"
import info from "./components/info"
import aggregate from "./components/aggregate"
import bnkAttachmentByProject from "./components/bnkAttachmentByProject"
import bnkAttachmentByLogistics from "./components/bnkAttachmentByLogistics"
import { getInfoRequirement } from "@/api/rfqManageMent/quotationdetail"

export default {
  components: {
    info,
    aggregate,
    bnkAttachmentByProject,
    bnkAttachmentByLogistics
  },
  props: {
    partInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: false,
      partInfoGroup: {
        partInfo: {},
        aggregate: {
          outputPlanVO: {},
          contactPerson: [],
          projectProgress: {}
        },
        purchaseBnkList: [],
        logisticsBnkList: []
      }
    }
  },
  methods: {
    init() {
      this.loading = true

      getInfoRequirement({
        partPrjCode: this.partInfo.fsNum,
        rfqId: this.partInfo.rfqId,
      })
      .then(res => {
        if (res.code == 200) {
          this.partInfoGroup = {
            partInfo: res.data.partInfo || {},
            aggregate: {
              outputPlanVO: res.data.outputPlanVO || {},
              contactPerson: Array.isArray(res.data.contactPerson) ? res.data.contactPerson : [],
              projectProgress: res.data.projectProgress || {},
            },
            purchaseBnkList: Array.isArray(res.data.purchaseBnkList) ? res.data.purchaseBnkList : [],
            logisticsBnkList: Array.isArray(res.data.logisticsBnkList) ? res.data.logisticsBnkList : []
          }
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }

        this.loading = false
      })
      .catch(() => this.loading = false)

      this.$refs.bnkAttachmentByProject.getBnkFiles()
      this.$refs.bnkAttachmentByLogistics.getBnkFiles()
    }
  }
}
</script>

<style lang="scss" scoped>
.infoAndReq {}
</style>