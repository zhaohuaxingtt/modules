<template>
  <div class="popupContent">
    <notifyDialog v-show="showDialog" :show.sync="showDialog" :detail="detail" />
  </div>
</template>

<script>
import notifyDialog from './notifyDialog.vue'
import { getPopupList ,changeCheckedSta} from '@/api/popupWindowMgmt'
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
        title: '',
        content: '',
        picUrl: '',
        linkUrl: ''
      },
      popupDataList: [],
      closeItemList: [],
      closePopupSocket: null,
      handelClick:[],
      iniTimes:0,//0
      showItems:0,//5
      detaliData:{}
    }
  },
  mounted() {
    this.closePopupSocket = getgetPopupSocketMessage((res) => {
      let _this = this
      const data = res.msgTxt
      this.popupDataList.push(data) 
      console.log(this.showItems,'this.showItems');
      if(this.showItems < 5){
        this.showItems++
      }else{
        while(this.handelClick.includes(this.iniTimes)){
          // do{
            this.iniTimes++
          // }while(!this.handelClick.includes(this.iniTimes))
        }
          // console.log('水水水水水水');
          this.closeItemList[this.iniTimes].type ='automatic' 
          // console.log(this.closeItemList[this.iniTimes],'this.closeItemList[this.iniTimes]');
          this.closeItemList[this.iniTimes].close()
          this.iniTimes++
      }
      if (data.type ==4  && data.subType == 5) {
        const index = _this.closeItemList.length 
          this.closeItemList.push ( this.$notify({
            duration: 0,
            dangerouslyUseHTMLString: true,
            message: `<div style='display: flex;justify-content: space-between;cursor:pointer;'>
                              <div class="popupLeft" style='width:50px;height:50px; '>
                                  <img src="${
                                   JSON.parse(data.param).picUrl || '/portal/static/img/popupPic.f3ff87ac.png'
                                  }" style='width:100%;height:100%; border-radius: 50%;'>
                              </div>
                              <div class="popupRight" style='position:relative;margin-left:20px'>
                                  <p class='${data.linkUrl && 'linkTitle'}'
                                  style='overflow:hidden;white-space:nowrap;text-overflow:ellipsis;height:100%
                                  width:100px;font-weight:bolder;font-size:16px;position:absolute;color: #0D2451;;'
                                  >
                                  ${data.title}
                                  </p>
                                  <p style='overflow: hidden;white-space:nowrap;text-overflow:ellipsis;width:150px;position:absolute;top:30px;color: #4B5C7D;'
                                  >${data.content}</p>
                              </div>
                              </div>`,
            position: 'bottom-right',
            onClick() {
              _this.openDialog(index)
            },
            onClose(isautomatic){
              _this.handelClick.push(index)
              console.log('PLPL',isautomatic);
                if(isautomatic.type == 'automatic'){
                  console.log('automatic');
                  _this.showItems > 5 ? _this.showItems-- : ''
                }else{
                  _this.showItems--
                }
            }
          }))
      }
    })
  },
  beforeDestroy() {
    this.closePopupSocket()
  },
  created(){
    const accountId = JSON.parse(sessionStorage.getItem('userInfo')).accountId
      getPopupList(accountId).then((res) => {
        if (res.code == 200) {
          let popupDataList = res.data
          this.popupDataList = popupDataList
          let _this = this
          if(popupDataList.length > 5){
            popupDataList = popupDataList.slice(0,5)
          }
          popupDataList.reverse()
          this.showItems = popupDataList.length
          popupDataList.forEach((ele, index) => {
            window.setTimeout(()=>
              this.closeItemList[index] =  this.$notify({
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
              onClose(isautomatic){
                _this.handelClick.push(index)
                console.log('PP',isautomatic);
                if(isautomatic.type == 'automatic'){
                  _this.showItems > 5 ? _this.showItems-- : ''
                }else{
                  _this.showItems--
                }
              },
            }),1)
          })
        } else {
          this.$message.error(res.desZh)
        }
      })
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
          let time = `${y}年   ${M}月${d}日${h}时${m}分`
          this.detail = {
            title: data.popupName,
            content: data.content,
            picUrl: data.picUrl,
            linkUrl: data.linkUrl,
            popupStyle:data.popupStyle,
            publishTime:time
          }
          this.showDialog = true
          this.closeItemList[index].close()
        }else{
          this.$message.error(res.desZh)
        }
      })
      
      
    },
  }
}
</script>

<style lang="scss" >
.popupContent {
  width: 600px;
  height: 100%;
  background-color: red;
}
.notifyHandel{
  margin: 0px; 
}

</style>
