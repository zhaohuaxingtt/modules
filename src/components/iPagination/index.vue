<template>
  <div class="i-pagination clearFloat">
    <div class="page-info-box">
      <p class="page-info" v-if="showPageInfo">{{ language('LK_XIANSHI', '显示') }}<span class="item">{{ total > 0 ? (currentPage - 1) * pageSize + 1 : 0 }}</span>{{ language('LK_TIAODI', '条到第') }}<span class="item">{{ total > 0 ? (currentPage * pageSize > total ? (currentPage * pageSize - (currentPage * pageSize - total)) : currentPage * pageSize) : 0 }}</span>{{ language('LK_TIAOJILU', '条记录') }}，{{ language('LK_GONG', '共') }}<span class="item">{{ $props.total }}</span>{{ language('LK_TIAOJILU', '条记录') }}</p>
      <iButton size="mini" v-if="showBtn" @click="excelExport">{{language('导出当页')}}</iButton>
    </div>
    <el-pagination 
      class="pagination" 
      v-bind="$props" 
      v-on="$listeners" 
      :current-page="currentPageNum" 
      :page-size="pageSizeNum"
      :total="totalNum"
      :page-count="pageCountNum"
      :pager-count="pagerCountNum">
      <slot></slot>
    </el-pagination>
  </div>
</template>

<script>
import iButton from "../iButton";
import { Pagination } from 'element-ui'
import { excelExport } from "/utils/filedowLoad"
/**
 * @example ./README.me
*/
export default {
  name:'iPagination',
  props: {
    ...Pagination.props,
    showPageInfo: { type: Boolean, default: true },
    showBtn: { type: Boolean, default: false },
    tableData: {
      type: Array, 
      default:()=>[]
    },
    tableTitle: {
      type: Array, 
      default:()=>[]
    },
    fileName: {
      type: String,
      default: 'download'
    }
  },
  components:{
    iButton
  },
  computed: {
    currentPageNum() {
      return +this.currentPage
    },
    pageSizeNum() {
      return +this.pageSize
    },
    totalNum() {
      return +this.total
    },
    pageCountNum() {
      return +this.pageCount
    },
    pagerCountNum() {
      return +this.pagerCount
    }
  },
  methods:{
    // 
    excelExport(){
      let filterList = ['selection']  // 过滤复选框
      let tableTitle = this.tableTitle.filter(item=>(item.prop||item.props)&&!filterList.includes(item.prop||item.props))
      console.log(tableTitle);
      excelExport(this.tableData,tableTitle,this.fileName)
    }
  }
}
</script>

<style lang="scss" scoped>
.i-pagination {
  margin-top: 15px;
  display: flex;
  .page-info-box{
    flex: 1;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
  }
  .page-info {
    float: left;
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    font-family: Arial;
    font-weight: 400;
    color: #8C98AC;
    opacity: 1;

    .item {
      padding: 0 2.5px;
    }
  }

  ::v-deep .pagination {
    padding: 0;
    // margin-top: 15px;
    margin-top: 0;

    .el-pager {
      .more {
        box-shadow: none!important;
        margin: 0 5px!important;
        padding: 0!important;
        min-width: 1em!important;
        width: 1em!important;
        background: transparent!important;
      }

      .el-icon-more::before {
        content: "..."!important;
      }
    }

    .btn-prev,
    .btn-next {
      min-width: 35px;
      height: 35px;
      line-height: 35px;
      background: $color-white;
      border-radius: 5px;

      span {
        height: 35px;
        line-height: 35px;
        padding: 0 18px;
      }

      &:not([disabled]):hover {
        color: #1663F6;
      }
    }

    .el-pager {
      li {
        min-width: 35px;
        height: 35px;
        line-height: 35px;
        border-radius: 5px;
      }

      li.number {
        font-weight: 100;
        font-size: 14px
      }

      li {
        background: $color-white;
      }

      li:not(.disabled).active {
        background: #1663F6;
        color: $color-white;

        &:hover {
          color: $color-white;
        }
      }

      li:not(.disabled):hover {
        color: #1663F6;
      }
    }

    .el-pagination__jump {
      height: 35px;
      line-height: 35px;
      margin-left: 12px;

      .el-input {
        width: 35px;
        height: 35px;
        margin: 0 10px;

        input {
          width: 35px;
          height: 35px;
          line-height: 35px;
          border: 0;
          background: $color-white;
          border-radius: 5px;
          box-shadow: 0px 0px 8px rgba(124, 124, 124, 0.16);
        }
      }
    }

    .el-pagination__sizes {
      height: 35px;

      .el-select {
        .el-input {
          height: 35px;
          margin: 0 10px;

          input {
            height: 35px;
            line-height: 35px;
            border: 0;
            background: $color-white;
            border-radius: 5px;
            box-shadow: 0px 0px 8px rgba(124, 124, 124, 0.16);
          }
        }
      }
    }

    &.is-background {
      .btn-prev,
      .btn-next {
        box-shadow: 0px 0px 8px rgba(124, 124, 124, 0.16);
      }

      .el-pager {
        li {
          box-shadow: 0px 0px 8px rgba(124, 124, 124, 0.16);
        }
      }
    }
  }
}
</style>