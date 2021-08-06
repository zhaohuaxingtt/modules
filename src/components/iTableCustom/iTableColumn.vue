<script>
import icon from '../icon/index.vue'
export default {
  name: 'TableColumn',
  components: { icon },
  functional: true,
  props: {
    scope: {
      type: Object,
      required: true
    },
    column: {
      type: Object
    },
    customRender: {
      type: Function
    },
    extraData: {
      type: Object,
      default: function() {
        return {}
      }
    },
    prop: {
      type: String
    },
    childNumVisible: {
      type: Boolean,
      default: false
    }
  },
  render(h, context) {
    const { props } = context
    const { scope, customRender, column, extraData, prop, childNumVisible } = props
    if (column.type && column.type === 'expanded') {
      const { uniqueId, expanded, childNum, isLeaf } = scope.row
      const paddingLeft = (uniqueId.split('-').length - 1) * 20
      const iconClass = expanded ? 'arrow-icon el-icon-caret-top' : 'arrow-icon el-icon-caret-bottom'

      const showChildNum = childNumVisible && childNum > 0
      return (
        <div class="cursor-pointer row-expand" style={{ paddingLeft: paddingLeft + 'px' }} data-id={uniqueId}>
          {showChildNum && (
            <div class="child-nums">
              <icon symbol class="icon" name="iconshu-fuji" />
              <span>{childNum}</span>
            </div>
          )}
          {customRender ? customRender(h, scope, column, extraData) : scope.row[prop]}
          {!isLeaf && <i class={iconClass}></i>}
        </div>
      )
    }
    return (
      <span class="custom-render">{customRender ? customRender(h, scope, column, extraData) : scope.row[prop]}</span>
    )
  }
}
</script>

<style lang="scss" scoped>
.link-text,
.open-link-text {
  color: $color-blue;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
.arrow-icon {
  color: $color-blue;
  margin-left: 5px;
}
.cursor-pointer {
  cursor: pointer;
}
.child-nums {
  display: inline-block;
  color: #fff;
  font-size: 12px;
  position: relative;
  margin-right: 5px;
  > span {
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
  }
}
// .child-nums {
//   display: inline-block;
//   width: 20px;
//   height: 24px;
//   background: url(~@/assets/images/file-nums-bg.png) center center no-repeat;
//   background-size: contain;
//   color: #fff;
//   text-align: center;
//   font-size: 12px;
//   margin-right: 5px;
// }
</style>
