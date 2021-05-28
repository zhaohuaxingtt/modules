#### 表格控件

```vue
<i-table-custom
  :loading="tableLoading"
  :data="data"
  :columns="columns"
  @go-detail="openPage"
  @handle-selection-change="handleSelectionChange"
/>
```

参数说明

```
/**
 * 自定义表格组件
 * @params data 表格列表数据
 * @params columns 列配置
 * @params loading loading
 * @params height 高度
 * @params extraData 注入的扩展数据
 * @params treeExpand 展开行 { expandKey: 'name', childrenKey: 'children' }
 * @method handleSelectionChange 选择框回调
 * @method handleEmit 点击单元格回调
 *
 * @example columns
   {
      prop: 'attach', // 可选
      label: '附件', // label，i18n 必填一个
      align: 'left', // 可选
      headerAlign: 'center', // 可选
      width: 100, // 可选
      tooltip: false, // 可选
      i18n: '', // label，i18n 必填一个
      type: "", // 类型 "selection/index/expanded"
      emit: "", // emit 名称
      customRender: (h, scope, column, extraData) => {
        return (
          <span class='open-link-text'>
            {scope.row.text}
          </span>
        )
      }
    }
 */
```
