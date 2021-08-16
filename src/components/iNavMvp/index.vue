<!--
* @author:shujie
* @Date: 2021-2-25 16:13:25
 * @LastEditors: Please set LastEditors
* @Description: mvp顶部导航栏
 -->
<template>
	<div class="nav flex-align-center" :class="[center && 'justify-center',right && 'justify-right',{lev1:lev == 1, lev2:lev == 2}]">
		<div v-for="(item,index) in navList" :key="index" @click="change(item,index)">
			<span class="name" :class="index==activeIndex && 'active'">{{ lang ? language(item.key, item.name) : $t(item.key) }}</span>
			<!-- <span class="circle" v-show="item.message>0">{{item.message}}</span> -->
			<el-badge class="badge" :max="99" v-if="item.message" :value="item.message" @click.native="clickMessage(item, $event)"></el-badge>
		</div>
	</div>
</template>
<script>
	/**
	 * @example ./README.me
	*/
	import { cloneDeep } from "lodash"

	export default {
		name:'iNavMvp',
		props: {
			/**
			 * 当前导航等级，处于第几级
			*/
			lev:{
				type:Number,
				default: 0
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
					url:'/sourcing/partsign',
					activePath: "/partsign",
					key:"LK_LINGJIANQIANSHOU"
				}, {
					value: 2,
					name: "采购项目建立",
					message: 0,
					url:'/sourcing/partsprocure',
					activePath: "/partsprocure",
					key:"LK_CAIGOUXIANGMUJIANLI"
				}, {
					value: 3,
					name: "RFQ管理",
					message: 0,
					url:'/sourcing/partsrfq',
					activePath: "/partsrfq",
					key:"LK_RFQGUANLI"
				}]
			},
			/**
			 * 界面跳转参数
			*/
			query:{
				type:Object,
				default:()=>{}
			},
			lang: {
				type: Boolean,
				default: false
			},
			routerParam: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				activeIndex: 0,
				navList: []
			}
		},
		created() {
			this.navList = cloneDeep(this.list)

			//由于当前组件存在于业务组件中，他的选中只需要在加载的时候去路由上取值和当前的list对比即可
			if(this.routerPage){
				for (let i = 0, item; (item = this.list[i++]); ) {
					if (this.$route.path.indexOf(item.activePath) > -1) {
						this.activeIndex = --i
						break
					}
				}
			}
		},
		watch: {
			"$route.path"(nv) {
				if(this.routerPage) {
					for (let i = 0, item; (item = this.navList[i++]); ) {
						if (nv.indexOf(item.activePath) > -1) {
							this.activeIndex = --i
							break
						}
					}
				}
			},
			list: {
				handler(value) {
					this.navList = cloneDeep(value)
				},
				deep: true
			}
		},
		methods: {
			/**
			 * @parmars
			*/
			change(item,index) {
				if(this.activeIndex!=index){
					let oldIndex = this.activeIndex
					this.$emit('change',item)
					this.activeIndex = item.value - 1

					if (this.routerParam) {
						this.navList[oldIndex].query = this.$route.query
					}

					if(this.routerPage){
						this.$router.push({
							path:item.url,
							query: this.navList[this.activeIndex].query ? this.navList[this.activeIndex].query : this.query
						})
					}
				}
			},
			clickMessage(item, e) {
				this.$emit('message', item)
				e.stopPropagation()
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
				// position: absolute;
				position: relative;
				right: -10px;
				top: -12px;

				::v-deep .el-badge__content {
					padding: 0 4px;
					height: 18px;
					line-height: 18px;
				}
			}
		}

		.placeholder {
			visibility: hidden;
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
				font-size: 18px!important;
				position: relative;
				padding: 0px!important;
				margin-right: 50px;
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
				font-size: 18px!important;
				box-shadow: initial!important;
				color:#000000!important;
				background-color: none!important;;
				background: transparent!important;
					&::after{
						opacity: 1;
						width: 100%;
				}
			}
		}

	.lev2 {
		& > div {
			font-size: 0;
			margin-left: 0!important;
			text-align: center!important;
			padding: 4px 25px;
			// line-height: 25px!important;
		
			&:first-of-type {
				padding-left: 0!important;
			}

			&:last-of-type {
				padding-right: 0!important;

				.badge {
					margin-right: 2px!important;
				}
			}

			&:not(&:first-of-type, &:last-of-type) {
				min-width: 122px!important;
			}

			& + div {
				margin-left: 1px!important;
				position: relative;

				&::after {
					content: "";
					position: absolute;
					top: 50%;
					left: -1px;
					transform: translate(0, -50%);
					width: 1px;
					height: 16px;
					background: #909091;
					opacity: 0.58;
				}
			}
		}

		.name {
			font-size: 18px!important;
			color: #909091!important;
			line-height: 25px!important;
			padding: 0!important;
			// vertical-align: middle;
		}

		.active {
			box-shadow: initial!important;
			font-size: 18px!important;
			color: #1660F1!important;
			background: transparent!important;
		}

		.badge {
			position: relative!important;
			margin-left: 0!important;
			margin-right: -4px!important;
			left: 2px!important;
			right: initial!important;
			top: -22px!important;
			font-size: 12px!important;
			vertical-align: middle;
			height: 0;

			::v-deep .el-badge__content {
				font-size: 12px!important;
				box-sizing: border-box;
				height: 18px!important;
				line-height: 18px!important;
				min-width: 18px!important;
				font-family: "Arial", "Microsoft YaHei";
			}
		}
	}
</style>
