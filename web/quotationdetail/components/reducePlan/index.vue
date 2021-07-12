<!--
 * @Author: wentliao
 * @Date: 2021-05-27 10:00:45
 * @Description: 降价计划
-->
<template>
    <iCard class="reducePlan" v-loading="loading">
        <div class="header margin-bottom20">
            <span class="title">{{ $t('LK_JIANGJIAJIHUA') }}</span>
            <span v-if="partInfo.partProjectType === 'PT04' || partInfo.partProjectType === 'PT19'">
                降价计划以{{basic}}为准
            </span>
            <!-----------配件报价的降价计划可以选择基于A价或B价，---------------------------------------------->
            <span v-if="partInfo.partProjectType === 'PT17'"  class="tip margin-left15">
                <span class="margin-right15">计算基准：</span>
                <el-radio-group v-model="computedBasic" @change="handleABChange">
                    <el-radio label="01">A价</el-radio>
                    <el-radio label="02">B价</el-radio>
                </el-radio-group>
            </span>
            <!-----------附件的降价计划只能基于B价，---------------------------------------------->
            <span v-else-if="partInfo.partProjectType === 'PT18'" class="tip margin-left10">降价计算以B价为准</span>
            <!-------------正常流程FS零件只基于A价------------------------------------------>
            <span v-else class="tip margin-left10">降价计算以A价为准</span>
        </div>
        <tableList :tableTitle="tableTitle" :tableData="tableData" :reducePlanedit="!disable" @rateChange="handleRateChange" />
    </iCard>
</template>

<script>
import {
 iCard,
 iMessage,
}from 'rise';
import tableList from './components/tableList';
import { 
    getLtcPlan,
    saveLtcPlan,
 } from '@/api/rfqManageMent/quotationdetail'
import moment from 'moment'
import {cloneDeep} from 'lodash'
export default {
    name:'reducePlan',
    components:{
        tableList,
        iCard,
    },
    props:{
        partInfo:{
            type:Object,
            default:()=>{
                return {
                    partProjectType:'',
                }
            }
        },
        disabled: {type: Boolean},
        aprice: { type: Number || String, default: 0 },
        bprice: { type: Number || String, default: 0 }
    },
    data(){
        return{
            loading:false,
            tableTitle:[
                {key:'yearMonths',name:'年/月',type:'iDatePicker'},
                {key:'priceReduceRate',name:'降价幅度(%)',type:'iInput'},
                {key:'reducedPriceShow',name:'降价后价格'},
            ],
            tableData:[],
            computedBasic: '01',
        }                
    },
    created(){
        // this.init();
    },
    computed: {
        basic() {
            // 报价类型（A价: 01 ，B价: 02 ，Exwor：3，FOB：4，CIF：5，DDU：6，DDP7 
            switch(this.computedBasic) {
                case '3':
                    return '出厂价Exwork'
                case '4':
                    return '离岸价FOB'
                case '5':
                    return '到岸价CIF'
                case '6':
                    return '未完税交货DDU'
                case '7':
                    return '未完税交货DDP'
                default:
                    return ''
            }
        }
    },
    methods: {
        /**
         * @Description: AB价切换时更新tableData
         * @Author: Luoshuang
         * @param {*}
         * @return {*}
         */        
        handleABChange() {
            if (this.computedBasic === '01' && !this.aprice) {
                iMessage.warn('A价不存在，无法根据A价计算降价后的价格')
            }
            if (this.computedBasic === '02' && !this.bprice) {
                iMessage.warn('B价不存在，无法根据B价计算降价后的价格')
            }
            this.tableData = this.computeReducePrice(this.computedBasic === '01' ? this.aprice : this.bprice, this.tableData)
        },
        /**
         * @Description: 计算降价后的价格
         * @Author: Luoshuang
         * @param {*} basicPrice 降价基础价格,A价或B价
         * @param {*} priceList 降价list
         * @return {*}
         */        
        computeReducePrice(basicPrice, priceList) {
            return priceList.reduce((accum, item, index) => {
                    if (!basicPrice) {
                        return [...accum, item]
                    }
                    const reducedPrice = index === 0 ? (basicPrice * (1 - item.priceReduceRate / 100)) : (accum[index - 1].reducedPrice * (1 - item.priceReduceRate / 100))
                    return [...accum, {
                        ...item,
                        reducedPrice: cloneDeep(reducedPrice),
                        reducedPriceShow: cloneDeep(reducedPrice).toFixed(2)
                    }]
                },[])
        },
        /**
         * @Description: 降价幅度变化时
         * @Author: Luoshuang
         * @param {*}
         * @return {*}
         */        
        handleRateChange() {
            this.tableData = this.computeReducePrice(this.computedBasic === '01' ? this.aprice : this.bprice, this.tableData)
        },
        /**
         * @Description: 页面初始化函数，每次tab页切换到当前页面时会调用
         * @Author: Luoshuang
         * @param {*}
         * @return {*}
         */        
        async init() {
            // 258869949
            //this.partInfo.quotationId
            this.loading = true
            const res = await getLtcPlan(this.partInfo.quotationId)
            if (res?.result) {
                if (!res.data.priceType) {
                    // 如果返回结果没有priceType，则配件默认为A价
                    this.computedBasic = this.partInfo.partProjectType === 'PT17' ? '01' : this.partInfo.partProjectType === 'PT18' ? '02' : (this.partInfo.partProjectType === 'PT04' || this.partInfo.partProjectType === 'PT19') ? '3' : '01'
                } else {
                    this.computedBasic = res.data.priceType
                }
                this.aprice = res.data.aprice || 0
                this.bprice = res.data.bprice || 0
                if (this.computedBasic === '01' && !res.data.aprice) {
                    iMessage.warn('A价不存在，无法根据A价计算降价后的价格')
                }
                if (this.computedBasic === '02' && !res.data.bprice) {
                    iMessage.warn('B价不存在，无法根据B价计算降价后的价格')
                }
                if (['3','4','5','6','7'].includes(this.computedBasic) && !res.data.bprice) {
                    iMessage.warn(this.basic+'不存在，无法计算降价后的价格')
                }
                this.tableData = this.computeReducePrice(this.computedBasic === '01' ? this.aprice : this.bprice, res.data.pricePlanInfoVOS)
            } else {
                iMessage.error(this.$i18n.locale === "zh" ? res?.desZh : res?.desEn)
            }
            this.loading = false   
        },
        // 保存
        save(type){
            return new Promise((r,j)=>{
            const { computedBasic,tableData,partInfo } = this;
            const {quotationId} = partInfo; // 258869949
            const data = {
                priceType:computedBasic,
                quotationId,
                priceReducePlanInfoList:tableData.map(item => {
                    return {
                        ...item,
                        yearMonths: moment(item.yearMonths).format('YYYY-MM-DD')
                    }
                })
            }
            this.loading = true
            saveLtcPlan(data).then((res)=>{
                if(res?.result){
                    r()
                    if (type !== "submit") iMessage.success(this.$i18n.locale === "zh" ? res?.desZh : res?.desEn)
                    this.init()
                }else{
                    j()
                    iMessage.error(this.$i18n.locale === "zh" ? res?.desZh : res?.desEn)
                }

            }).finally(() => {
                j()
                this.loading = false
            })
            })
        },
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