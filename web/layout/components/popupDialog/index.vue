<template>
  <iDialog
    :visible.sync="show"
    :title="papgeTitle"
    @close="closeDialog"
    width="600px"
    min-height='400px'
  >
      <div class="main">
          <div class="left">
              <img :src="detail.picUrl" alt="" class="left-image">
          </div>
          <div class="right">
              <h2 :class="{'link-text':detail.linkUrl}" @click="toNewPage">{{detail.title}}</h2>
              <div class="content">
                  {{detail.content}}
              </div>
              <iButton @click="closeDialog" class="btn">{{language('确认')}}</iButton>
          </div>
      </div>
  </iDialog>
</template>

<script>
import {iDialog,iButton} from 'rise'
export default {
    name:'detailDialog',
    components:{iDialog,iButton},
    props:{
        detail:{
            title:'',
            content:'',
            picUrl:'',
            linkUrl:''
        },
        show:{
            type:Boolean,
            default:false
        }
    },
    data(){},
    created(){
        console.log('l;l;l;l;l;');
    },
    methods:{
        toNewPage(){
            if(this.detail.linkUrl){
                window.open(this.detail.linkUrl)
            }
        },
        closeDialog(){
            this.$emit('update:show',false)
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header{
    position: relative;
}
.main{
    display: flex;
    justify-content:space-between;
    .left{
        width: 300px;
        height: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
        .left-image{
            width: 100%;
            height: 100%;
            border-radius: 10px;
        }
    }
    .right{
        width: 100%;
        height: 100%;
        margin-left: 330px;
        .content,
        .btn{
            margin-top: 20px;
            margin-bottom: 20px;
        }
        .link-text{
            text-decoration: underline;
            cursor: pointer;
        }
    }
}
</style>