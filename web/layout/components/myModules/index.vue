<template>
  <div class="my-modules-container">
    <div class="title flex-align-center">
      <div class="margin-right10">My Modules</div>
      <el-tooltip class="item" effect="dark" content="模块卡片可以拖动至主页" placement="top">
        <!-- <el-button type="text"> -->
        <i class="el-icon-warning-outline"></i>
        <!-- </el-button> -->
      </el-tooltip>
    </div>
    <div class="search-container">
      <i-input type="text" v-model="keyword" :placeholder="'Search modules'" />
    </div>
    <el-row
      :gutter="20"
      :class="{
        'card-container': true,
        border: start,
        'empty-container': !filterList.length
      }"
      id="sideModules"
    >
      <template v-if="!filterList.length">
        <div>当前我的模块均已在列表中</div>
      </template>
      <template v-else>
        <el-col :span="12" v-for="card in filterList" :key="card.id">
          <div class="module-card" :id="card.id" :data-id="card.id">
            <!-- <div class="title">
              <div class="move">
                <icon symbol class="icon" name="iconshunxubiaoqian" />
              </div>
            </div> -->
            <div class="avatar">
              <img :src="component2Avatar[card.component]" v-if="component2Avatar[card.component]" />
              <i class="el-icon-picture-outline" v-else></i>
            </div>
          </div>
          <div class="module-name">{{ card.name }}</div>
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script>
import { iInput } from 'rise'
// import Sortable from 'sortablejs'
import { updateBatchModules } from '../../api/index'
export default {
  components: { iInput },
  data() {
    return {
      start: false,
      keyword: '',
      component2Avatar: {
        Task: require('../../assets/images/task.png'),
        Approve: require('../../assets/images/approval.png'),
        Volume: require('../../assets/images/volume.png'),
        Sponser: require('../../assets/images/sponsor.png'),
        Sourcing: require('../../assets/images/sourcing.png'),
        EKL: require('../../assets/images/ekl.png'),
        Delivery: require('../../assets/images/delivery.png')
      }
    }
  },
  // mounted() {
  //   this.$nextTick(() => {
  //     new Sortable(document.getElementById('sideModules'), {
  //       group: {
  //         name: 'myModules',
  //         put: false // Do not allow items to be put into this list
  //       },
  //       animation: 150,
  //       ghostClass:
  //         'my-modules-drop-ghost,el-col-24,el-col-xs-24,el-col-sm-12,el-col-md-8,el-col-lg-6,el-col-xl-6',
  //       onStart: event => this.handleDragStart(event),
  //       onRemove: event => this.handleDragEnd(event)
  //     })
  //   })
  // },
  computed: {
    // eslint-disable-next-line no-undef
    ...Vuex.mapState({
      list: state => state.permission.cardList
    }),
    filterList: function() {
      const arrList = this.list.filter(li => {
        return li.value
      })
      const filterList = this.keyword
        ? arrList.filter(card => {
            return card.name.includes(this.keyword)
          })
        : arrList
      return filterList
    }
  },

  methods: {
    getList() {
      this.$store.dispatch('getModules')
    },
    handleDragStart(event) {
      console.log('onStart', event)

      // this.start = true
    },
    async handleDragEnd(event) {
      console.log('onEnd', event)
      const item = this.filterList[event.oldIndex]
      item.value = false
      const cards = _.cloneDeep(this.list)
      const index = cards.findIndex(e => e.id === item.id)
      cards.splice(index, 1)
      cards.splice(event.newIndex, 0, item)
      const newCards = cards.map((e, i) => {
        e.orderNum = i
        return e
      })
      const res = await updateBatchModules(newCards)
      // const res = await updateModules(item)
      if (res.result) {
        this.getList()
      }

      /* this.start = false
      const obj = document
        .getElementsByClassName('card-container')[0]
        .getBoundingClientRect()
      const xt = obj.x
      const xb = obj.x + obj.width
      const yt = obj.y
      const yb = obj.y + obj.height
      const item = this.list.find(li => {
        return li.id == (e.target.id || e.target.offsetParent.id)
      })
      console.log('item', item)
      if (
        e.clientY < yt ||
        e.clientY > yb ||
        e.clientX < xt ||
        e.clientX > xb
      ) {
        item.value = false
        const res = await updateModules(item)
        if (res.code === '200' && res.data) {
          this.getList()
        }
      } */
    },
    handleInput() {
      const list = _.cloneDeep(this.list)
      console.log(
        'keyword',
        this.keyword,
        list.filter(card => {
          return card.name.includes(this.keyword)
        })
      )
      const filterList = this.keyword
        ? list.filter(card => {
            return card.name.includes(this.keyword)
          })
        : _.cloneDeep(list)
      this.list = _.cloneDeep(filterList)
    }
  }
}
</script>

<style lang="scss" scoped>
.my-modules-container {
  position: relative;
  padding: 0 32px;
  height: 100%;
  > .others {
    position: absolute;
    top: -60px;
    right: 0;
  }
  > .title {
    margin-top: 30px;
    color: #001847;
    font-size: 18px;
    font-weight: bold;
    padding-left: 10px;
    border-left: 3px solid #1763f7;
  }
  > .search-container {
    margin-top: 20px;
    border-radius: 5px;
  }
  .card-container {
    padding: 15px 0;
    margin: 10px 0 0 0;
    min-height: 300px;
    height: 600px;
    overflow: auto;
    > div {
      height: 235px;
    }
    &.empty-container {
      // text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #001847;
      font-size: 14px;
      // border: 1px dashed #909090;
    }
    &.border {
      border: 1px dashed #909090;
    }
    .module-card {
      cursor: move;
      border-radius: 10px;
      background: #ffffff;
      margin-bottom: 5px;
      z-index: 999;
      position: relative;
      box-shadow: 0px 0px 20px rgba(27, 29, 33, 0.08);
      > .title {
        display: flex;
        padding: 5px;
        align-items: center;
        justify-content: flex-end;
      }
      > .avatar {
        text-align: center;
        padding: 5px;
        min-height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        > i {
          font-size: 110px;
          color: #eee;
        }
        > img {
          max-width: 100%;
          width: 150px;
        }
      }
    }
    .module-name {
      text-align: center;
      margin-bottom: 10px;
      font-size: 14px;
    }
  }
}
</style>

<style lang="scss">
#myModules {
  .my-modules-drop-ghost {
    width: 25% !important;
    img {
      max-width: 100%;
    }
    /* box-shadow: 0 0.125rem 0.75rem 0 rgb(0 0 0 / 10%);
  background: #fff;
  border-radius: 10px;
  height: 630px; */
  }
}
</style>
