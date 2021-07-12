<template>
  <div class="notify">
    <transition-group name="messages" tag="div">
      <template v-for="(message, $index) in messages">
        <card class="card" :id="`card_${ message.remark }`" :key="message.remark" :data="message" @handleClear="handleClear($index)" />
      </template>
    </transition-group>
  </div>
</template>

<script>
import card from './card'

export default {
  components: { card },
  data() {
    return {
      messages: [],
    }
  },
  watch: {
    messages: {
      handler(list) {
        this.redraw(list)
      },
      deep: true
     }
  },
  
  methods: {
    unshift(data) {
      data.timer = setTimeout(() => {
        clearTimeout(data.timer)
        this.messages.splice(this.messages.indexOf(data), 1)
      }, 4000)
      this.messages.unshift(data)
    },
    redraw(list) {
      list.forEach((message, index) => {
        this.$nextTick(() => {
          let top = 0
          for (let i = 0; i < index; i ++) {
            const dom = this.$el.querySelector(`#card_${ this.messages[i].remark }`)
            top += dom.getBoundingClientRect().height
          }

          const currentDom = this.$el.querySelector(`#card_${ message.remark }`)
          currentDom.style.top = `calc(${ top }px + ${ 1.25 * (index + 1) }rem)`
        })
      })
    },
    handleClear(index) {
      clearTimeout(this.messages[index].timer)
      this.messages.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.notify {
  position: absolute;
  width: 340px;
  height: 0;
  top: 61px;
  right: 20px;

  .card {
    width: 340px;
    position: absolute;
    top: 0;
    left: 0;
    box-shadow: 0px 0px 16px rgba(147, 147, 147, 0.16);
    transition: top .4s ease-out;
  }

  .messages-enter {
    transition: all .4s ease-out;
  }
 
  .messages-leave-to {
    transition: all .4s ease-out;
    transform: translateX(500px);
  }
}
</style>