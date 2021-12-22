<template>
  <div class="popupContent">
    <notifyDialog v-show="showDialog" :show.sync="showDialog" :detail="detail" />
  </div>
</template>

<script>
import notifyDialog from './notifyDialog.vue'
import { getPopupList ,changeCheckedSta} from '../../api'
import { getgetPopupSocketMessage } from '@/api/mail'
export default {
  name: 'layoutNotify',
  components: {
    notifyDialog
  },
  // props:{
  //   login:{
  //     type:String,
  //     default:''
  //   }
  // },
  data() {
    return {
      showDialog: false,
      detail: {
        title: '',
        content: '',
        picUrl: '',
        linkUrl: ''
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
    this.closePopupSocket()
  },
  created(){
    this.getLatest()
    
  },
  methods: {
    openDialog(index) {
      const data = {
        userId:JSON.parse(sessionStorage.getItem('userInfo')).accountId,
        popupId:this.popupDataList[index].id || JSON.parse(this.popupDataList[index].param).popupId
      }
      changeCheckedSta(data).then((res)=>{
        if(res.code == 200){
          const data = res.data
          const y = data.publishTime.slice(0,4)
          const M = data.publishTime.slice(5,7)
          const d = data.publishTime.slice(8,10)
          const h = data.publishTime.slice(11,13)
          const m = data.publishTime.slice(14,16)
          let time = `${y}年${M}月${d}日 ${h}时${m}分`
          this.detail = {
            title: data.popupName,
            content: data.content,
            picUrl: data.picUrl,
            linkUrl: data.linkUrl,
            popupStyle:data.popupStyle,
            publishTime:time,
            wordAlign:data.wordAlign
          }
          this.showDialog = true
          this.clearNotify()
        }else{
          this.$message.error(res.desZh)
        }
      })
    },
    //防抖
    debounce(delay){
      if(this.timer !== null) clearTimeout(this.timer)
      this.timer = setTimeout(()=>{
        this.iniNotify('pushNew')
      },delay)
      
    },
    getLatest(){

      console.log(this.closeItemList, this.popupDataList, '====')
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
    clearNotify(isLogout){
      console.log('clear',this.closeItemList);
      if(this.closeItemList){
        this.closeItemList.forEach((ele) => {
          if(ele.notify){
            ele.notify.close()
          }
        })
      }
      this.closeItemList = []
      this.popupDataList = []
      if(isLogout != 'logout'){
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
              // console.log('-----');
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
            'times':0
            }
          }
             ,1)
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
