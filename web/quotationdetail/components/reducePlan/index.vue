<!--
 * @Author: wentliao
 * @Date: 2021-05-27 10:00:45
 * @Description: 降价计划
-->
<template>
	<iCard class="reducePlan" v-loading="loading">
		<div class="header margin-bottom20">
			<span class="title">{{ language('LK_JIANGJIAJIHUA', '降价计划') }}</span>
			<span v-if="isSkd">
				<span class="tip margin-left10">{{ language("JIANGJIAJISUANYIJINGWAICHUCHANGJIAWEIZHUN", "降价计算以境外出厂价为准") }}</span>
			</span>
            <span v-else-if="isSkdLc">
				<span class="tip margin-left10">{{ language("SKDBUFENYIJINGWAICHUCHANGJIAWEIZHUN", "SKD部分以境外出厂价为准") }}，{{ language("LCBUFENYIAJIAWEIZHUN", "LC部分以A价为准") }}</span>
			</span>
			<span v-else>
				<span v-if="partInfo.partProjectType === partProjTypes.DBLINGJIAN || partInfo.partProjectType === partProjTypes.DBYICHIXINGCAIGOU || partInfo.priceStatus == 'DB'">
					降价计划以{{basic}}为准
				</span>
				<!-----------配件报价的降价计划可以选择基于A价或B价，---------------------------------------------->
				<span v-else-if="partInfo.partProjectType === partProjTypes.PEIJIAN"  class="tip margin-left15">
					<span class="margin-right15">计算基准：</span>
					<el-radio-group v-model="computedBasic" @change="handleABChange" :disabled="disabled || isOriginprice">
						<el-radio label="01">A价</el-radio>
						<el-radio label="02">B价</el-radio>
					</el-radio-group>
				</span>
				<!-----------附件的降价计划只能基于B价，---------------------------------------------->
				<span v-else-if="partInfo.partProjectType === partProjTypes.FUJIAN" class="tip margin-left10">降价计算以B价为准</span>
				<!-------------正常流程FS零件只基于A价------------------------------------------>
				<span v-else class="tip margin-left10">降价计算以A价为准</span>
			</span>
		</div>
		<tableList :tableTitle="tableTitle" v-if='partInfo.quotationId' :partInfo='partInfo'  :tableData="tableData" :reducePlanedit="!disabled && !isOriginprice" @rateChange="handleRateChange" :lcStartProductDate="lcStartProductDate" />
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
    getLtcPlanSkcLc
 } from '@/api/rfqManageMent/quotationdetail'
 import {partProjTypes} from '@/config'
import moment from 'moment'
import {cloneDeep} from 'lodash'
import { priceStatusMixin } from "../mixins"

export default {
    name:'reducePlan',
    mixins: [ priceStatusMixin ],
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
        bprice: { type: Number || String, default: 0 },
        isOriginprice: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return{
            // 零件项目类型
            partProjTypes,
            loading:false,
            tableTitle:[
                {key:'yearMonths',name:'年/月',type:'iDatePicker'},
                {key:'priceReduceRate',name:'降价幅度(%)',type:'iInput'},
                {key:'reducedPriceShow',name:'降价后价格'},
            ],
            tableData:[],
            computedBasic: '01',
            skdAPrice: "0",
            lcAPrice: "0",
            lcStartProductDate: ""
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
            if (this.isSkdLc) {
                this.tableData = this.computeSkdLc(this.skdAPrice, this.lcAPrice, this.tableData)
            } else {
                this.tableData = this.computeReducePrice(this.computedBasic === '01' ? this.aprice : this.bprice, this.tableData)
            }
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

            if (!this.isSkdLc) {
                const res = await getLtcPlan(this.partInfo.quotationId)
                if (res?.result) {
                    if (!res.data.priceType) {
                        // 如果返回结果没有priceType，则配件默认为A价
                        this.computedBasic = this.partInfo.partProjectType === partProjTypes.PEIJIAN ? '01' : this.partInfo.partProjectType === partProjTypes.FUJIAN ? '02' : (this.partInfo.partProjectType === partProjTypes.DBLINGJIAN || this.partInfo.partProjectType === partProjTypes.DBYICHIXINGCAIGOU || this.partInfo.priceStatus == 'DB') ? '3' : '01'
                    } else {
                        this.computedBasic = res.data.priceType
                    }
                    this.aprice = res.data.aprice || 0
                    this.bprice = res.data.bprice || 0
                    if (this.computedBasic === '01' && (!res.data.aprice || res.data.aprice == 0)) {
                        iMessage.error('A价不存在或为0')
                    }
                    if (this.computedBasic === '02' && (!res.data.bprice || res.data.bprice == 0)) {
                        iMessage.error('B价不存在或为0')
                    }
                    if (['3','4','5','6','7'].includes(this.computedBasic) && (!res.data.bprice || res.data.bprice == 0)) {
                        iMessage.error(this.basic+this.language('BUCUNZAIHUOWEIO','不存在或为0'))
                    }
                    this.tableData = this.computeReducePrice(this.computedBasic === '01' ? this.aprice : this.bprice, res.data.pricePlanInfoVOS)
                } else {
                    iMessage.error(this.$i18n.locale === "zh" ? res?.desZh : res?.desEn)
                }
            } else {
                const res = await getLtcPlanSkcLc(this.partInfo.quotationId)
                if (res.code == 200) {
                    if (!res.data.lcAPrice || !res.data.skdAPrice) await iMessage.error(`${ this.language("AJIABUCUNZAIHUOWEILING", "A价不存在或为0") }`)
                    if (!res.data.lcStartProductDate) await iMessage.error(this.language("LCQIBUSHENGCHANRIQIWEIKONG", "LC起步生产日期为空"))
                    this.computedBasic = '01'
                    this.lcStartProductDate = res.data.lcStartProductDate
                    this.skdAPrice = res.data.skdAPrice || "0"
                    this.lcAPrice = res.data.lcAPrice || "0"

                    this.tableData = this.computeSkdLc(this.skdAPrice, this.lcAPrice, res.data.pricePlanInfoVOS)
                } else {
                    iMessage.error(this.$i18n.locale === "zh" ? res?.desZh : res?.desEn)
                }
            }
            
            this.loading = false   
        },
        computeSkdLc(baseSkdAprice, baseLcAprice, data) {
            let aprice = 0
            const lcStartProductDate = this.lcStartProductDate ? +moment(this.lcStartProductDate).startOf("month") : -1
            
            if (Array.isArray(data)) {
                if (+moment(data[0].yearMonths).startOf("month") > lcStartProductDate) {
                    aprice = baseLcAprice
                } else {
                    aprice = baseSkdAprice
                }

                return data.reduce((acc, cur) => {
                    const currentMoth = +moment(cur.yearMonths).startOf("month")

                    if (currentMoth < lcStartProductDate || currentMoth > lcStartProductDate) {
                        if ((currentMoth > lcStartProductDate) && acc.length && (+moment(acc.slice(-1)[0].yearMonths).startOf("month") <= lcStartProductDate)) {
                            aprice = baseLcAprice // 如果跨过LC起步生产日期，则跨过的首个日期节点以LC A价为基价进行计算
                        } else {
                            aprice = acc.length ? acc.slice(-1)[0].reducedPrice : aprice
                        }

                        cur.reducedPrice = math.multiply(
                            math.bignumber(aprice || 0),
                            math.subtract(
                                math.bignumber(1), 
                                math.divide(math.bignumber(cur.priceReduceRate || 0), 100).toFixed(4)
                            )
                        ).toFixed(2)
                    } else {
                        cur.reducedPrice = math.bignumber(baseLcAprice).toFixed(2)
                        cur.priceReduceRate = math.chain(math.bignumber((acc.length ? acc.slice(-1)[0].reducedPrice : aprice) || 0))
                            .subtract(math.bignumber(cur.reducedPrice || 0))
                            .divide(math.bignumber((acc.length ? acc.slice(-1)[0].reducedPrice : aprice) || 0))
                            .multiply(100)
                            .done()
                            .toFixed(4)
                    }

                    cur.reducedPriceShow = cur.reducedPrice

                    return [ ...acc, cur ]
                }, [])
            } else {
                return []
            }
        },
        // 保存
        save(type){
            const { computedBasic,tableData,partInfo } = this;

            if (this.isSkdLc && tableData.every(item => +moment(item.yearMonths).startOf("month") !== (this.lcStartProductDate ? +moment(this.lcStartProductDate).startOf("month") : -1))) throw iMessage.warn(this.language("JIANGJIAJIHUABIXUXUANZEQIBUSHENGCHANRIQI", "降级计划必须选择LC起步生产日期"))

            return new Promise((r,j)=>{
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