<!--
* @author:shujie
* @Date: 2021-2-22 13:39:22
 * @LastEditors: Please set LastEditors
* @Description: 标签页
 -->
<script>
import { Tabs } from "element-ui";
/**
 * @example ./README.me
*/
export default {
  extends: Tabs,
  render() {
    let {
      type,
      handleTabClick,
      handleTabRemove,
      handleTabAdd,
      currentName,
      panes,
      editable,
      addable,
      tabPosition,
      stretch,
    } = this;

    const newButton =
      editable || addable ? (
        <span
          class="el-tabs__new-tab"
          on-click={handleTabAdd}
          tabindex="0"
          on-keydown={(ev) => {
            if (ev.keyCode === 13) {
              handleTabAdd();
            }
          }}
        >
          <i class="el-icon-plus"></i>
        </span>
      ) : null;

    const navData = {
      props: {
        currentName,
        onTabClick: handleTabClick,
        onTabRemove: handleTabRemove,
        editable,
        type,
        panes,
        stretch,
      },
      ref: "nav",
    };
    const header = (
      <div class={["el-tabs__header", `is-${tabPosition}`]}>
        {newButton}
        <tab-nav {...navData}></tab-nav>
      </div>
    );
    const panels = <div class="el-tabs__content">{this.$slots.default}</div>;

    return (
      <div
        class={{
          "el-tabs": true,
          "el-tabs--card": type === "card",
          "el-tabs-default": true,
          [`el-tabs--${tabPosition}`]: true,
          "el-tabs--border-card": type === "border-card",
        }}
      >
        {tabPosition !== "bottom" ? [header, panels] : [panels, header]}
      </div>
    );
  },
};
</script>

<style lang="scss" scoped>
// 默认样式
.el-tabs-defaul {
  .el-tabs__nav-wrap::after {
    height: 0;
  }

  ::v-deep .el-tabs__nav-scroll {
    .el-tabs__active-bar {
      width: 70px !important;
      background-color: $color-blue;
    }

    .el-tabs__item {
      // height: 33px;
      // line-height: 33px;
      font-size: 20px;
      color: $color-header-iocn;
    }

    .is-active {
      color: #000000;
    }
  }
}

// type="border-card"
.el-tabs--border-card {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: $btn-box-shadow;
  border: none;
  ::v-deep .el-tabs__nav {
    height: 38px;

    .el-tabs__item {
      height: 38px;
      line-height: 38px;
      font-size: 16px;
      color: $color-header-iocn;
      border: none;
    }

    .is-active {
      color: $color-blue;
      border-radius: 10px 10px 0 0;
      box-shadow: 0px 0px 10px 2px rgba(27, 29, 33, 0.08);
    }
  }

  .el-tabs--border-card > .el-tabs__header {
    border: none;
  }

  .el-tabs__content {
    z-index: 100;
    box-shadow: 0 1px 4px 1px rgb(0 0 0 / 12%);
  }
}

// 如果stretch为false 修改标题栏背景色
// .el-tabs-notauto {
//   ::v-deep .el-tabs__header {
//     background-color: #ffffff;

//     .el-tabs__item {
//       min-width: 200px;
//       text-align: center;
//       background-color: #f5f7fa;
//       //   border-radius: 0px 10px 0 0;
//       box-shadow: 10px 0px 10px 2px rgba(27, 29, 33, 0.08);
//     }

//     .is-active {
//       background-color: #ffffff;
//       box-shadow: 0px 0px 10px 2px rgba(27, 29, 33, 0.08);

//       //   border-radius: 0px 10px 0 0;
//       z-index: 10;
//     }
//   }
// }
</style>
