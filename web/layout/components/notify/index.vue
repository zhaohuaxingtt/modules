<template>
  <div class="popupContent">
    <notifyDialog v-show="showDialog" :show.sync="showDialog" :detail="detail" @is-sure='isSure'/>
  </div>
</template>

<script>
import notifyDialog from './notifyDialog.vue'
import { getPopupList } from '../../api'
import { getgetPopupSocketMessage } from '@/api/mail'
export default {
  name: 'layoutNotify',
  components: {
    notifyDialog
  },
  data() {
    return {
      showDialog: false,
      detail: {
        title:'',
        content:'',
        picUrl:'',
        linkUrl:'',
        publishTime:'',
        popupStyle:'',
        wordAlign:'0',
        popupId:''
      },
      popupDataList: [],
      closeItemList: [],
      closePopupSocket: null,
      timer:null
    }
  },
  mounted() {
    this.closePopupSocket = getgetPopupSocketMessage((res) => {
      this.debounce(3000)
    })
  },
  beforeDestroy() {
    if(this.closeItemList.length > 0){
      this.closeItemList.forEach((ele) => {
        if(ele.notify){
          ele.notify.close()
        }
      })
      this.closeItemList = []
      this.popupDataList = []
    }
    this.closePopupSocket()
  },
  created(){
    this.getLatest()
    
  },
  methods: {
    isSure(val){
      if(val == true){
        this.clearNotify()
      }
    },
    openDialog(index) {
      this.isChecked = false
      const y = this.popupDataList[index].publishTime.slice(0,4)
      const M = this.popupDataList[index].publishTime.slice(5,7)
      const d = this.popupDataList[index].publishTime.slice(8,10)
      const h = this.popupDataList[index].publishTime.slice(11,13)
      const m = this.popupDataList[index].publishTime.slice(14,16)
      const time = `${y}年${M}月${d}日 ${h}时${m}分`
      this.detail={
        title:this.popupDataList[index].popupName,
        content:this.popupDataList[index].content,
        picUrl:this.popupDataList[index].picUrl,
        linkUrl:this.popupDataList[index].linkUrl,
        publishTime:time,
        popupStyle:this.popupDataList[index].popupStyle,
        wordAlign:this.popupDataList[index].wordAlign,
        popupId:this.popupDataList[index].id
      }
      this.showDialog = true
    },
    //防抖
    debounce(delay){
      if(this.timer !== null) clearTimeout(this.timer)
      this.timer = setTimeout(()=>{
        this.iniNotify('pushNew')
      },delay)
    },
    getLatest(){
      const accountId = JSON.parse(sessionStorage.getItem('userInfo')).accountId
      getPopupList(accountId).then((res) => {
        if (res.code == 200) {
          let popupDataList = res.data
          this.popupDataList = popupDataList.reverse()
          this.iniNotify()
        } else {
          this.$message.error(res.desZh)
        }
      })
    },
    clearNotify(val){
      if(this.closeItemList){
        this.closeItemList.forEach((ele) => {
          if(ele.notify){
            ele.notify.close()
          }
        })
      }
      this.closeItemList = []
      this.popupDataList = []
      if(val != 'logout'){
        this.getLatest()
      }
      
    },
    iniNotify(pushNew){
      let _this = this
      if(pushNew == 'pushNew'){
        this.clearNotify()
      } else{
        this.popupDataList.forEach((ele, index) => {
          setTimeout(()=>{
              this.closeItemList[index] = { 
              'notify': this.$notify({
                duration: 0,
                dangerouslyUseHTMLString: true,
                customClass:'notifyHandel',
                message: `<div style='display: flex;justify-content: space-between;cursor:pointer'>
                          <div class="popupLeft" style='width:50px;height:50px; '>
                              <img src="${
                                ele.picUrl ?  ele.picUrl : '/portal/static/img/popupPic.f3ff87ac.png'
                              }" style='width:100%;height:100%; border-radius: 50%;'>
                          </div>
                          <div class="popupRight" style='position:relative;margin-left:20px'>
                              <p class='${
                                ele.linkUrl && 'linkTitle'
                              }'
                              style='overflow:hidden;white-space:nowrap;text-overflow:ellipsis;height:100%;
                              width:100px;font-weight:bolder;font-size:16px;position:absolute;color: #0D2451;'
                              >
                              ${ele.popupName}
                              </p>
                              <p style='overflow: hidden;white-space:nowrap;text-overflow:ellipsis;width:150px;position:absolute;top:30px;color: #4B5C7D;'
                              >${ele.content}</p>
                          </div>
                      </div>`,
                position: 'bottom-right',
                onClick() {
                  _this.openDialog(index)
                },
                onClose(){
                },
              }),
            // 'times':0
            }
          },1)
        })
      }
    }
  }
}
</script>

<style lang="scss" >
.popupContent {
  width: 600px;
  height: 100%;
}
.notifyHandel{
  margin: 0px; 
}

</style>
