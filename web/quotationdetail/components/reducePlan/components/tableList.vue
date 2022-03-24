<!--
 * @Author: wentliao
 * @Date: 2021-05-27 10:43:21
 * @Description: 适用于降价计划页面的tablelist
-->

<template>
    <div class="newTableList flex">
        <div class="table-title ">
            <p v-for="(item,index) in tableTitle" :key="'newTableTitle_'+index">
                <span>{{item.name}}</span>
            </p>
        </div>
        <div :class="tableData.length>5 ? 'table-data flex scroll' : 'table-data flex'">
            <div class="table-data-item"  v-for="(item,index) in tableData" :key="'newTableData_'+index">
                <p v-for="(titleItem,titleIndex) in tableTitle" :key="'newTableitem_'+titleIndex">
                    <template v-if="reducePlanedit" >
                        <iInput :disabled='partInfo.roundsType == "biddingRound"' v-if="titleItem.type == 'iInput' && !getIsLcStartProductDate(item.yearMonths)" v-model="item[titleItem.key]" @input="handleInputByPriceReduceRate($event, titleItem.key, item)"/>
                        <iDatePicker 
                            :disabled='partInfo.roundsType == "biddingRound"'
                            v-else-if="titleItem.type == 'iDatePicker'" 
                            v-model="item[titleItem.key]"
                            value-format="yyyy-MM"
                            type="month"
                            clearable
                            :picker-options="{
                                disabledDate(time){
                                    const pickDate = +moment(time)
                                    const beforeDate = +(moment((index-1)>-1 ? new Date(tableData[index-1][titleItem.key]) : null).endOf('month'))
                                    if (beforeDate) {
                                        return pickDate <= beforeDate
                                    }
                                    return false
                                }}"
                            @change="$emit('yearMonthsChange', $event, titleItem.key, item, index)"
                            @focus="$emit('dateFocus', item[titleItem.key], titleItem.key, item)"
                        />
                        <span v-else :class="{ lcPrice: titleItem.key == 'priceReduceRate' && getIsLcStartProductDate(item.yearMonths) }">{{item[titleItem.key]}}</span>
                    </template>
                    <span v-else>
                        <span v-if="titleItem.key === 'yearMonths'">{{ item[titleItem.key] | ymFormat }}</span>
                        <span v-else>{{item[titleItem.key]}}</span>
                    </span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import {
    iInput,
    iDatePicker,
} from 'rise';
import moment from 'moment'
import { numberProcessor } from '@/utils' 
export default {
    name:'newTableList',
    components:{
        iInput,
        iDatePicker
    },
    props:{
        tableTitle:{
            type:Array,
            default:()=>[]
        },
        tableData:{
            type:Array,
            default:()=>[]
        },
        reducePlanedit:{
            type:Boolean,
            default:false
        },
        lcStartProductDate: {
            type: String,
            default: ""
        },
        partInfo:{
            type:Object,
            default:()=>{}
        }
    },
    data(){
        return{
            moment:moment,
        }
    },
    filters: {
        ymFormat(date) {
            return moment(date).format("YYYY-MM")
        }
    },
    methods: {
        getIsLcStartProductDate(date) {
            if (this.lcStartProductDate) {
                if (+moment(date).startOf("month") === +moment(this.lcStartProductDate).startOf("month")) {
                    return true
                }
            }

            return false
        },
        handleInputByPriceReduceRate(value, key, data) {
            let v = numberProcessor(value, 4)

            if (+value > 100) {
                v = "100"
            }

            this.$set(data, key, v)
            this.$emit('rateChange', v, key, data)
        }
    },
}
</script>

<style  lang="scss" scoped>
    .newTableList{
        .table-title{
            p{
                min-width: 220px;
                background: rgba($color: #D9DEE5, $alpha: .4);
                text-align: left;
                height: 50px;
                line-height: 50px;
                padding-left: 40px;
                margin-bottom: 2px;
                font-weight: bold;
                &:first-child{
                    border-top-left-radius: 10px;
                }

            }
        }
        .table-data{
            flex-wrap: nowrap;
            flex:1;
            &.scroll{
                overflow-x: scroll;
            }
            .table-data-item{
                p{
                    width: 180px;
                    text-align:center;
                    font-size: 14px;
                    height: 50px;
                    line-height: 50px;
                    background: rgba($color: #F7FAFF, $alpha: .5);
                    padding: 0 24px;
                    margin-bottom: 2px;
                    margin-left: 2px;
                    ::v-deep.el-input{
                        width: 100%;
                    }
                }
            }
        }
        .lcPrice {
            color: red
        }
    }

</style>
