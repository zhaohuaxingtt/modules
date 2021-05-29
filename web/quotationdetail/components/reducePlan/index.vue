<!--
 * @Author: wentliao
 * @Date: 2021-05-27 10:00:45
 * @Description: 降价计划
-->
<template>
    <iCard class="reducePlan" v-loading="loading">
        <div class="header margin-bottom20">
            <span class="title">{{ $t('LK_JIANGJIAJIHUA') }}</span>
            <!-----------配件报价的降价计划可以选择基于A价或B价，参数暂定，之后以实际接口返回为准---------------------------------------------->
            <span v-if="partInfo.partType === '1'"  class="tip margin-left15">
                <span class="margin-right15">计算基准：</span>
                <el-radio-group v-model="computedBasic">
                    <el-radio label="A">A价</el-radio>
                    <el-radio label="B">B价</el-radio>
                </el-radio-group>
            </span>
            <!-----------附件的降价计划只能基于B价，参数暂定，之后以实际接口返回为准---------------------------------------------->
            <span v-else-if="partInfo.partType === '2'" class="tip margin-left10">降价计算以B价为准</span>
            <!-------------正常流程FS零件------------------------------------------>
            <span v-else class="tip margin-left10">降价计算以A价为准</span>
        </div>
        <tableList :tableTitle="tableTitle" :tableData="tableData" :reducePlanedit="reducePlanedit"/>
    </iCard>
</template>

<script>
import {
 iCard,
}from 'rise';
import tableList from './components/tableList';
export default {
    name:'reducePlan',
    components:{
        tableList,
        iCard,
    },
    props:{
        reducePlanedit:{
            type:Boolean,
            default:false,
        },
        partInfo:{
            type:Object,
            default:()=>{
                return {
                    partType:'1',
                }
            }
        },
        disabled: {type: Boolean}
    },
    data(){
        return{
            loading:false,
            tableTitle:[
                {key:'date',name:'年/月',type:'iDatePicker'},
                {key:'extent',name:'降价幅度(%)',type:'iInput'},
                {key:'reducePrice',name:'降价后价格'},
            ],
            tableData:[
                {date:'2023-01',extent:'0',reducePrice:'0.55'},
                {date:'2022-01',extent:'0',reducePrice:'0.55'},
                {date:'2021-01',extent:'0',reducePrice:'0.55'},
                {date:'2021-01',extent:'0',reducePrice:'0.55'},
                {date:'2021-01',extent:'0',reducePrice:'0.55'},
                {date:'2021-01',extent:'0',reducePrice:'0.55'},
            ],
            computedBasic: 'A'
        }                
    },
    methods: {
        /**
         * @Description: 页面初始化函数，每次tab页切换到当前页面时会调用
         * @Author: Luoshuang
         * @param {*}
         * @return {*}
         */        
        init() {

        }
    }
}
</script>

<style lang="scss" scoped>
.reducePlan{
    .header {
        .title {
            height: 25px;
            line-height: 25px;
            font-size: 18px;
            font-weight: bold;
            color: #131523;
        }

        .tip {
            height: 20px;
            line-height: 20px;
            font-size: 14px;
            color: #86878e;
        }
    }
}
</style>