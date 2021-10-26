<script>
import persent from "rise/web/quotationdetail/components/costsummary/components/persent"
import { skdPercentageTemplate, getPercentage } from "../data"

export default {
  extends: persent,
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  methods:{
    persentTitel() {
      return getPercentage(this.data, skdPercentageTemplate)
    }
  }
}
</script>