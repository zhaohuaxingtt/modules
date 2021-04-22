<!--
* @author:shujie
* @Date: 2021-2-25 16:13:25
 * @LastEditors: Please set LastEditors
* @Description: mvp顶部导航栏
 -->
<template>
	<div class="nav flex-align-center" :class="[center && 'justify-center',right && 'justify-right',{lev1:lev == 1}]">
		<div v-for="(item,index) in list" :key="index" @click="change(item,index)">
			<span class="name" :class="index==activeIndex && 'active'">{{$t(item.key)}}</span>
			<!-- <span class="circle" v-show="item.message>0">{{item.message}}</span> -->
			<el-badge class="badge" :max="99" :hidden="!item.message" :value="item.message"></el-badge>
		</div>
	</div>
</template>
<script>
	/**
	 * @example ./README.me
	*/
	export default {
		name:'iNavMvp',
		props: {
			/**
			 * 当前导航等级，处于第几级
			*/
			lev:{
				type:Number,
				default:2
			},
			/**
			 * 是点击是否切换路由，目标路由为list中的 url
			*/
			routerPage:Boolean,
			/**
			 * 居中对齐
			*/
			center: {
				type: Boolean,
				default: false
			},
			/**
			 * 向右对齐
			*/
			right: {
				type: Boolean,
				default: false
			},
			/**
			 * 列表数据 value：作为tab切换时的标识
			 * 				 name： 当前页签的名字
			 * 				 url：  当前 routerPage 为true时有效
			 * 				 key：  国际化翻译key
			*/
			list: {
				type: Array,
				default: () => [{
					value: 1,
					name: "零件签收",
					message: 0,
					url:'/partsign',
					key:"LK_LINGJIANQIANSHOU"
				}, {
					value: 2,
					name: "采购项目建立",
					message: 0,
					url:'/partsprocure',
					key:"LK_CAIGOUXIANGMUJIANLI"
				}, {
					value: 3,
					name: "RFQ管理",
					message: 0,
					url:'/partsrfq',
					key:"LK_RFQGUANLI"
				}]
			},

		},
		data() {
			return {
				activeIndex: 0,
			}
		},
		created(){
			//由于当前组件存在于业务组件中，他的选中只需要在加载的时候去路由上取值和当前的list对比即可
			if(this.routerPage){
				this.list.forEach((items,index)=>{
					if(items.url == this.$route.path) this.activeIndex = index
				})
			}
		},
		methods: {
			/**
			 * @parmars
			*/
			change(item) {
				this.$emit('change',item)
				this.activeIndex = item.value - 1
				if(this.routerPage){
					this.$router.push({
						path:item.url
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nav {
		min-height: 30px;
		div {
			margin-left: 10px;
			position: relative;
			cursor: pointer;

			.name {
				padding: 4px 10px;
				opacity: 1;
				border-radius: 5px;
				font-size: 16px;
				color: #727272;
			}

			.active {
				color: #1660F1;
				box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08);
				background: #FFFFFF;
				font-weight: bold;
			}

			.badge {
				position: absolute;
				right: -10px;
				top: -12px;

				::v-deep .el-badge__content {
					padding: 0 4px;
					height: 18px;
					line-height: 18px;
				}
			}
		}

	}

	.justify-center {
		justify-content: center;
	}

	.justify-right {
		justify-content: flex-end;
	}
	.lev1{
			.name{
				font-size: 20px!important;
				position: relative;
				padding: 0px!important;
				margin-right: 10px;
				&::after{
					opacity: 0;
					transition: all 0.5s;
					position: absolute;
					left:0px;
					top: 32px;
					content: '';
					background-color: $color-blue;
					height: 3px;
					width: 0px;
				}
			}
			.active{
				font-size: 20px!important;
				box-shadow: initial!important;
				color:#000000!important;
					&::after{
						opacity: 1;
						width: 100%;
				}
			}
		}
</style>
