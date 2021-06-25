<template>
  <div>
    <iDialog title="日志" :visible.sync="isShow" width="70%">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <iFormGroup :row="2">
              <iFormItem>
                <iLabel :label="'操作用户'" slot="label"></iLabel>
                <iText>{{ props.row.operator }}</iText>
              </iFormItem>
              <iFormItem>
                <iLabel :label="'操作类型'" slot="label"></iLabel>
                <iText>{{ props.row.type }}</iText>
              </iFormItem>
              <iFormItem>
                <iLabel :label="'请求时间'" slot="label"></iLabel>
                <iText>{{ props.row.time }}</iText>
              </iFormItem>
              <iFormItem>
                <iLabel :label="'回应时间'" slot="label"></iLabel>
                <iText>{{ props.row.time }}</iText>
              </iFormItem>
              <iFormItem>
                <iLabel :label="'所属模块'" slot="label"></iLabel>
                <iText>pms-->总仓订购</iText>
              </iFormItem>
              <iFormItem>
                <iLabel :label="'结果'" slot="label"></iLabel>
                <iText>{{ props.row.result }}</iText>
              </iFormItem>
              <iFormItem>
                <iLabel :label="'业务主键'" slot="label"></iLabel>
                <iText>122222323435435</iText>
              </iFormItem>
              <iFormItem>
                <iLabel :label="'执行主机'" slot="label"></iLabel>
                <iText>PEKEKR</iText>
              </iFormItem>
            </iFormGroup>
            <iFormGroup :row="1">
              <iFormItem>
                <iLabel :label="'返回结果'" slot="label"></iLabel>
                <iText>[{fieldId: '123123123', errorMsg:'sdfjskdjflsjflk'}]</iText>
              </iFormItem>
              <iFormItem>
                <iLabel :label="'错误信息'" slot="label"></iLabel>
                <iText>无</iText>
              </iFormItem>
            </iFormGroup>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="operation"></el-table-column>
        <el-table-column label="操作时间" prop="time"></el-table-column>
        <el-table-column label="操作人" prop="operator"></el-table-column>
        <el-table-column label="操作类型" prop="type"></el-table-column>
        <el-table-column label="所属菜单" prop="menu"></el-table-column>
        <el-table-column label="结果" prop="result"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取消</el-button>
        <el-button type="primary" @click="isShow = false">确定</el-button>
      </span>
    </iDialog>
  </div>
</template>

<script>
import iDialog from '../iDialog'
import iFormGroup from '../iPageItemsGroup/iFormGroup'
import iFormItem from '../iPageItemsGroup/iFormItem'
import iLabel from '../iPageItemsGroup/iLabel'
import iText from '../iPageItemsGroup/iText'

export default {
  components: { iDialog, iFormGroup, iFormItem, iLabel, iText },
  props: {
    bizId: {
      type: Number,
      default: 0
    },
    show: [Boolean]
  },
  data() {
    return {
      tableData: [
        {
          id: '12987122',
          operation: '值八则选统实总质那保明技',
          time: '1998-36-28 02:36:58',
          operator: '文敏',
          type: '了路',
          menu: '月算需条',
          result: '步光运验米委改给员带好把我细统从交值'
        },
        {
          id: '12987123',
          operation: '立行值战周约年图政相品',
          time: '1997-06-18 03:06:13',
          operator: '卢秀兰',
          type: '此王',
          menu: '适组公',
          result: '名记眼清组你自些道向族可再所北当资'
        }
      ]
    }
  },
  computed: {
    isShow: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit('update:show', val)
      }
    }
  },
  mounted() {
    console.log('bizId', this.bizId)
  }
}
</script>
