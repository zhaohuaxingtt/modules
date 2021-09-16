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
                        <iInput v-if="titleItem.type == 'iInput'" type="number" oninput="if(value>100){value=100}if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}" v-model="item[titleItem.key]" @input="val=>$emit('rateChange',val,titleIndex)"/>
                        <iDatePicker 
                            v-else-if="titleItem.type == 'iDatePicker'" 
                            v-model="item[titleItem.key]"
                            value-format="yyyy-MM"
                            type="month"
                            :clearable="false"
                            :picker-options="{
                                disabledDate(time){
                                    const pickDate = +moment(time)
                                    const afterDate = +(moment(tableData[index+1] ? new Date(tableData[index+1][titleItem.key]) : null).startOf('month'))
                                    const beforeDate = +(moment((index-1)>-1 ? new Date(tableData[index-1][titleItem.key]) : null).endOf('month'))
                                    if (afterDate && beforeDate) {
                                        return pickDate <= beforeDate || pickDate >= afterDate
                                    }
                                    if (afterDate) {
                                        return pickDate >= afterDate
                                    }
                                    if (beforeDate) {
                                        return pickDate <= beforeDate
                                    }
                                    return false
                                }}"
                            
                        />
                        <span v-else>{{item[titleItem.key]}}</span>
                    </template>
                    <span v-else>{{item[titleItem.key]}}</span>
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
        }

    },
    data(){
        return{
            moment:moment,
        }
    }
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
                    min-width: 170px;
                    text-align:center;
                    font-size: 14px;
                    height: 50px;
                    line-height: 50px;
                    background: rgba($color: #F7FAFF, $alpha: .5);
                    padding: 0 24px;
                    margin-bottom: 2px;
                    margin-left: 2px;
                }
            }
        }
    }

</style>
