<script>
import Icon from '../icon/index.vue'
export default {
	name: 'TableColumn',
	functional: true,
	components: { Icon },
	props: {
		scope: {
			type: Object,
			required: true,
		},
		column: {
			type: Object,
		},
		customRender: {
			type: Function,
		},
		extraData: {
			type: Object,
			default: function() {
				return {}
			},
		},
		prop: {
			type: String,
		},
		childNumVisible: {
			type: Boolean,
			default: false,
		},
	},
	render(h, context) {
		const { props } = context
		const {
			scope,
			customRender,
			column,
			extraData,
			prop,
			childNumVisible,
		} = props
		if (column.type && column.type === 'expanded') {
			const { uniqueId, expanded, childNum, isLeaf } = scope.row
			const paddingLeft = uniqueId && (uniqueId.split('-').length - 1) * 20
			const iconClass = expanded
				? 'arrow-icon el-icon-caret-top'
				: 'arrow-icon el-icon-caret-bottom'

			const showChildNum = childNumVisible && childNum > 0
			return (
				<div
					class="cursor-pointer row-expand"
					style={{ paddingLeft: paddingLeft + 'px' }}
					data-id={uniqueId}
				>
					{showChildNum && (
						<div class="child-nums">
							<icon symbol class="icon" name="iconshu-fuji" />
							<span>{childNum}</span>
						</div>
					)}
					{customRender
						? customRender(h, scope, column, extraData)
						: scope.row[prop]}
					{!isLeaf && <i class={iconClass}></i>}
				</div>
			)
		}
		// if (column.openNewPage) {
		//   return (
		//     <div class="custom-render ">
		//       {customRender
		//         ? customRender(h, scope, column, extraData)
		//         : scope.row[prop]}
		//       <div class="showIcon">
		//         <Icon symbol class="show " name="icontiaozhuananniu" />
		//         <Icon
		//           symbol
		//           class="active"
		//           name="icontiaozhuanxuanzhongzhuangtai"
		//         />
		//       </div>
		//     </div>
		//   )
		// }
		return (
			<span class="render">
				{customRender
					? customRender(h, scope, column, extraData)
					: scope.row[prop]}
			</span>
		)
	},
}
</script>

<style lang="scss" scoped>
.link-text,
.open-link-text {
	color: $color-blue;
	cursor: pointer;
	&:hover {
		text-decoration: underline;
	}
}
.arrow-icon {
	color: $color-blue;
	margin-left: 5px;
}
.cursor-pointer {
	cursor: pointer;
}
.child-nums {
	display: inline-block;
	color: #fff;
	font-size: 12px;
	position: relative;
	margin-right: 5px;
	letter-spacing: 0;
	> span {
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		position: absolute;
		width: 100%;
		text-align: center;
		zoom: 0.8;
	}
}
// .custom-render {
//   position: relative;
//   text-align: center;
//   text-overflow: ellipsis;
//   overflow: hidden;
//   padding-right: 20px;
//   /* min-height: 20px; */
//   .showIcon {
//     position: absolute;
//     top: 50%;
//     right: 0px;
//     cursor: pointer;
//     transform: translateY(-50%);
//     .active {
//       display: none;
//     }
//     .show {
//       display: block;
//     }
//     .icon {
//       font-size: 14px;
//       height: 14px;
//       width: 14px;
//     }
//   }
//   .showIcon:hover {
//     cursor: pointer;
//     .show {
//       display: none;
//     }
//     .active {
//       display: block;
//     }
//   }
// }
// .textContent{
//     width: calc(100% - 20px);
//     overflow: hidden;
//     text-overflow: ellipsis;
//   }
</style>
