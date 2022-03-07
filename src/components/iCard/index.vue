/* 
 * @Author: ldh  
 * @Date: 2021-02-22 11:32:08  
 * @Last Modified by: ldh
 * @Last Modified time: 2021-03-10 15:45:25
 */
<template>
  <div class="card">
    <div class="cardHeader" :class="{ default: !$slots.default }" v-if="$slots.header || header">
      <slot name="header">{{ header }}</slot>
    </div>
    <div 
      class="cardHeader"
      :class="{ defaultPadding: !$slots.default }"
      :style="{ justifyContent: title ? 'space-between' : 'flex-end' }" 
      v-else-if="title || $slots['header-control'] || headerControl"
      >
        <span v-if="title" class="title">
          <span v-html='title' class="title_content" @click="emitTile()"></span>  
          <span v-if="isRequired" class="required">*</span>  
          <slot name="subInfo"></slot>
        </span>
        
        <div>
          <div v-if="$slots['header-control'] || headerControl" class="control">
            <slot name="header-control">{{ headerControl }}</slot>
          </div>
          <i @click="handleCollapse" v-if='collapse' class="el-icon-arrow-up collapse margin-left20 cursor" :class="{ rotate: !collapseValue }"></i>
        </div>
    </div>
    <!-- body不折叠部分 -->
    <div class="bodyShow" v-if="title">
      <slot name="body"></slot>
    </div>
    <el-collapse-transition>
      <div v-show="collapseValue" v-if="$slots.default">
        <div class="cardBody" :style="{ paddingTop: !($slots.header || header || title || $slots['header-control'] || headerControl) || 0 }">
          <slot></slot>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
/**
 * @example ./README.me
 */
export default {
  name:'iCard',
  props: {
    /** 标题 */
    title: { type: String },
    /** slot:header */
    header: {},
    /** slot:header-control header右侧按钮区 */
    headerControl: {},
    /** 是否启用折叠 */
    collapse: {
      type: Boolean,
      default: false
    },
    /** 是否默认打开或关闭 */
    defalutCollVal:{
      type:Boolean,
      default:true
    },
    isRequired: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      collapseValue: this.defalutCollVal
    }
  },
  methods: {
    emitTile(){
      this.$emit('handleTitle',this)
    },
    handleCollapse() {
      this.collapseValue = !this.collapseValue
      this.$emit('handleCollapse', this.collapseValue)
    }
  }
};
</script>

<style lang='scss' scoped>
.card {
  box-shadow: $btn-box-shadow;
  border-radius: 6px;
  background: $color-white;
  .defaultPadding {
    padding: 30px 40px;
  }

  .cardHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30px 40px;

    .title {
			font-size: 18px;
			color: #131523;
			font-weight: bold;
		}

    div,
    span {
      font-size: 20px;
    }

    .control {
      display: inline-block;
    }

    .el-icon-arrow-up {
      transition: all 0.5s;
    }

    .rotate {
      transform: rotate(180deg);
      color: $color-blue;
    }

    .collapse {
      font-size: 20px;
      color:#D3D3DB;

      &:hover {
        color:$color-blue;
      }
    }
  }

  .cardBody {
    height: 100%;
    padding: 30px 40px;
  }
  
  .bodyShow {
    padding: 0px 40px;
  }
}

.tabCard {
  .cardHeader {
    padding: 30px 40px 25px;

    .title {
      color: $color-font;
      font-size: 18px;
      font-weight: bold;
      line-height: 25px;
    }
  }
}
.required {
  color:#E30B0D;
  font-size:18px;
  font-weight: normal;
}
</style>