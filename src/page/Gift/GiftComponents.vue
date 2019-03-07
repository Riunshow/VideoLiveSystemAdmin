<template>
	<div class="giftComp">
		<!-- model -->
		<div class="giftModel">
			<div class="giftImg">
				<img :src="defaultGiftList.giftAvatar" alt="">
			</div>
			<div class="giftInfo">
				<span>{{defaultGiftList.giftName}}</span>
				<span>积分:{{defaultGiftList.price}}</span>
			</div>
		</div>
		<!-- hover -->
		<div class="hoverDelete" @click="deleteGift">
			<div class="options">
				<i class="el-icon-delete"></i>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		defaultGiftList: Object,
	},
	data () {
		return {
		};
	},
	methods: {
		deleteGift() {
			this.$emit('deleteGift', this.defaultGiftList.giftId)
		}
	}
}
</script>

<style lang="scss" scoped>
.giftComp {
	width: 100px;
	height: 150px;
	margin: 0 30px 20px 0;

	.giftModel {
		display: flex;
		flex-direction: column;
		width: 100px;
		height: 150px;
		border: 1px solid #e5e5e5;
		padding: 10px;

		.giftImg {

			img {
				height: 100px;
				width: 100px;
			}
		}

		.giftInfo {
			display: flex;
			flex-direction: column;
		}
	}
	.giftModel:hover ~ .hoverDelete  {
		display: block;
		transition: all .5s;
	}
	.hoverDelete:hover {
		display: block;
	}
	.hoverDelete {
		display: none;
		width: 122px;
		height: 172px;
		background-color: rgba(0, 0, 0, 0.3);
		position: relative;
		top: -172px;

		.options {
			line-height: 150px;
			text-align: center;
			
			i {
				color: #fff;
				font-size: 40px;
			}
		}
	}
}
</style>