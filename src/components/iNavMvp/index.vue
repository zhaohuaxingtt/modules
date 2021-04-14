<!--
* @author:shujie
* @Date: 2021-2-25 16:13:25
 * @LastEditors: Please set LastEditors
* @Description: mvp顶部导航栏
 -->
<template>
	<div class="nav flex-align-center" :class="[center && 'justify-center',right && 'justify-right']">
		<div v-for="(item,index) in list" :key="index" @click="change(item,index)">
			<span class="name" :class="index==activeIndex && 'active'">{{$t(item.key)}}</span>
			<!-- <span class="circle" v-show="item.message>0">{{item.message}}</span> -->
			<el-badge class="badge" :max="99" :hidden="!item.message" :value="item.message"></el-badge>
		</div>
	</div>
</template>
<script>
	export default {
		name:'iNavMvp',
		props: {
			routerPage:Boolean,
			center: {
				type: Boolean,
				default: false
			},
			right: {
				type: Boolean,
				default: false
			},
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
			// 切换nav
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
</style>
