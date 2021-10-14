export const priceTypeMixin = {
  computed: {
    isSkd() {
      return this.partInfo && this.partInfo.priceStatus == "SKD"
    },
    isSkdLc() {
      return this.partInfo && this.partInfo.priceStatus == "SKDLC"
    }
  }
}