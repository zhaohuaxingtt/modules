<template>
  <div>
    <div class="btn-button">
      <div @click.stop="openJira" class="jira-edit margin-bottom10">
        <img :src="jiraEdit" alt="" />
        <p>{{ language("我要提问", "我要提问") }}</p>
      </div>
      <img
        class="img"
        @click.stop="handleShow"
        :src="!contentShowFlag ? popurIcon : activePopurIcon"
        alt=""
      />
    </div>
    <div class="povper-content" v-show="contentShowFlag">
      <div v-for="(list, index) in popoverList" :key="index">
        <div class="item-content" @click="handleClick(list)">
          <div><img :src="list.imageUrl" class="img" /></div>
          <div class="text">{{ list.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { popoverList } from "./data.js";
import popurIcon from "../assets/images/popur.svg";
import activePopurIcon from "../assets/images/active-popur.svg";
import jiraEdit from "../assets/images/jira_edit.png";
export default {
  props: {
    contentShowFlag: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
  },
  data() {
    return {
      popoverList,
      popurIcon,
      activePopurIcon,
      jiraEdit,
    };
  },
  methods: {
    handleClick(list) {
      this.$emit("handleSelect", list);
    },
    handleShow() {
      this.$emit("handleShow", this.contentShowFlag);
    },
    openJira() {
      window.open(
        `http://jira.csvw.com/rest/collectors/1.0/template/form/20772e47?os_authType=none`
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-button {
  position: fixed;
  bottom: 40px;
  right: 50px;
  z-index: 999;
  .jira-edit {
    text-align: center;
    cursor: pointer;
  }
  .img {
    height: 60px;
    width: 60px;
  }
}
.povper-content {
  position: fixed;
  z-index: 99999;
  bottom: 120px;
  right: 50px;
  background-color: #fff;
  border-radius: 10%;
  box-shadow: 10px 10px 5px #e0e4ec;
  display: flex;
  flex-direction: column;
  .item-content {
    display: flex;
    flex-direction: row;
    padding: 20px;
    cursor: pointer;
    .img {
      width: 40px;
      height: 40px;
    }
    .text {
      font-size: 16px;
      color: #5f6f8f;
      margin-left: 20px;
      height: 40px;
      line-height: 40px;
    }
  }
}
</style>
