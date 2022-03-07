export default {
  methods: {
    /******************气泡框 Start****************** */

    customMouseenter($event) {
      const ele = $event.toElement

      const clientWidth = ele.clientWidth
      const scrollWidth = ele.scrollWidth
      if (clientWidth < scrollWidth) {
        this.tooltipContent = ele.innerText || ele.textContent
        const tooltip = this.$refs.customTableTooltip
        tooltip.referenceElm = ele
        tooltip.show()
      }
    },
    customMouseleave() {
      const tooltip = this.$refs.customTableTooltip
      if (tooltip) {
        tooltip.hide()
      }
    }
    /******************气泡框 end****************** */
  }
}
