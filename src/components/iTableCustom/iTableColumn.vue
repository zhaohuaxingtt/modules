<script>
export default {
  name: 'TableColumn',
  functional: true,
  props: {
    scope: {
      type: Object,
      required: true,
    },
    column: {
      type: Object,
    },
    customRender: {
      type: Function,
    },
    extraData: {
      type: Object,
      default: function() {
        return {}
      },
    },
    prop: {
      type: String,
    },
  },
  render(h, context) {
    const { props } = context
    const { scope, customRender, column, extraData, prop } = props
    if (column.type && column.type === 'expanded') {
      const paddingLeft = scope.row.uniqueId.split('-').length * 10
      const iconClass = scope.row.expanded
        ? 'el-icon-arrow-down'
        : 'el-icon-arrow-right'
      return (
        <span style={{ paddingLeft: paddingLeft + 'px' }}>
          {customRender
            ? customRender(h, scope, column, extraData)
            : scope.row[prop]}
          {!scope.row.isLeaf && <i class={iconClass}></i>}
        </span>
      )
    }
    return (
      <span class='custom-render'>
        {customRender
          ? customRender(h, scope, column, extraData)
          : scope.row[prop]}
      </span>
    )
  },
}
</script>

<style lang="scss" scoped>
.open-link-text {
  color: $color-blue;
  &:hover {
    text-decoration: underline;
  }
}
</style>
