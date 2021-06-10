<!--
 * @Author: yuszhou
 * @Date: 2021-03-01 17:17:17
 * @LastEditTime: 2021-06-10 13:21:58
 * @LastEditors: Please set LastEditors
 * @Description: 为不同的宽度item做出UI还原
 * @FilePath: \rise\src\components\iFromItem\index.vue
-->
<template>
  <div class="el-form-item" :class="[{
      'el-form-item--feedback': elForm && elForm.statusIcon,
      'is-error': validateState === 'error',
      'is-validating': validateState === 'validating',
      'is-success': validateState === 'success',
      'is-required': isRequired || required,
      'is-no-asterisk': elForm && elForm.hideRequiredAsterisk
    },
    sizeClass ? 'el-form-item--' + sizeClass : '',
	elForm.row?'row'+elForm.row:''
  ]">
    <label-wrap
      :is-auto-width="labelStyle && labelStyle.width === 'auto'"
      :update-all="form.labelWidth === 'auto'">
      <label :for="labelFor" class="el-form-item__label" :style="labelStyle" v-if="label || $slots.label">
        <slot name="label">{{label + form.labelSuffix}}</slot>
      </label>
    </label-wrap>
    <div class="el-form-item__content" :style="contentStyle">
      <slot></slot>
      <transition name="el-zoom-in-top">
        <slot
          v-if="validateState === 'error' && showMessage && form.showMessage"
          name="error"
          :error="validateMessage">
          <div
            class="el-form-item__error"
            :class="{
              'el-form-item__error--inline': typeof inlineMessage === 'boolean'
                ? inlineMessage
                : (elForm && elForm.inlineMessage || false)
            }"
          >
            {{validateMessage}}
          </div>
        </slot>
      </transition>
    </div>
  </div>
</template>
<script>
	import {
		FormItem
	} from 'element-ui'
	/**
 * @example ./README.me
*/
	export default {
		name:'FormItem',
		extends: FormItem,
	}
</script>
<style lang='scss' scoped>
	.row4 {
		margin-bottom: 25px;
		margin-right: 60px;
		width: calc((100% - 3*60px) / 4);
		display: flex;
		float: left;

		&:nth-child(4n) {
			margin-right: 0px;
		}

		::v-deep.el-form-item__label {
			width: 200px;
			text-align: left;
			font-size: 16px;
			color: #4B4B4C;
		}

		::v-deep.el-form-item__content {
			text-align: right;
			flex: 1;
			min-width: 0;
		}
	}

	.row3 {
		margin-bottom: 25px;
		margin-right: 100px;
		width: calc((100% - 2*100px) / 3);
		margin-bottom: 25px;
		display: flex;
		float: left;

		&:nth-child(3n) {
			margin-right: 0px;
		}

		::v-deep.el-form-item__label {
			width: 200px;
			text-align: left;
			font-size: 16px;
			color: #4B4B4C;
		}

		::v-deep.el-form-item__content {
			flex: 1;
			min-width: 0px;
		}
	}

	.row2 {
		margin-bottom: 25px;
		margin-right: 100px;
		width: calc((100% - 1*100px) / 2);
		margin-bottom: 25px;
		display: flex;
		float: left;

		&:nth-child(2n) {
			margin-right: 0px;
		}

		::v-deep.el-form-item__label {
			width: 200px;
			text-align: left;
			font-size: 16px;
			color: #4B4B4C;
		}

		::v-deep.el-form-item__content {
			flex: 1;
			min-width: 0px;
		}
	}

	.row1 {
		margin-bottom: 25px;
		margin-right: 100px;
		width: calc((100% - 0*100px) / 1);
		margin-bottom: 25px;
		display: flex;
		float: left;

		&:nth-child(1n) {
			margin-right: 0px;
		}

		::v-deep.el-form-item__label {
			width: 200px;
			text-align: left;
			font-size: 16px;
			color: #4B4B4C;
		}

		::v-deep.el-form-item__content {
			flex: 1;
			min-width: 0px;
		}
	}

	@for $i from 1 through 6 {
		.row_line#{$i} {
			margin-bottom: 25px;
			margin-right: 30px;
			width: calc((100% - (#{$i} - 1) *30px) / #{$i});
			display: flex;
			float: left;

			&:nth-child(#{$i}n) {
				margin-right: 0px;
			}

			::v-deep.el-form-item__label {
				text-align: left;
				font-size: 16px;
				color: #4B4B4C;
				width: 80px;
			}

			::v-deep.el-form-item__content {
				text-align: right;
				flex: 1;
				min-width: 0px;
			}
		}
	}

	.icon_self {
		.el-form-item__label {
			padding-left: 28px;
			position: relative;

			&::before {
				content: "";
				height: 10px;
				width: 10px;
				border-radius: 50%;
				background-color: #1660F1;
				display: inline-block;
				position: absolute;
				left: 0px;
				top: 15px;
				z-index: 2;
			}

			&::after {
				content: "";
				height: 15px;
				width: 15px;
				border-radius: 50%;
				background-color: #DBE5FF;
				display: inline-block;
				position: absolute;
				left: 0px;
				top: 11px;
				z-index: 1;
			}
		}
	}

	/* 更换必填属性 * 号位置 */
	.el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before {
		content: "";
		display: none;
	}
	.el-form-item__error{
		padding-left:15px;
	}
</style>
