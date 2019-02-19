<template>
	<div>
		<div class="card" v-for="(info, index) in liveInfo" :key="index">
			<el-card :body-style="{ padding: '0px' }" shadow="hover">
				<div class="basicInfo">
					<img :src="info.cover" class="image">
					<div class="info">
						<span>房间id: {{info.roomID}}</span>
						<span>房间名称: {{info.title}}</span>
						<span>房间状态: {{info.status == 0 ? '未直播' : '正在直播'}}</span>
						<span>房间热度: {{info.hot}}</span>
						<span>观众人数: {{info.Attendance}}</span>
					</div>
				</div>
				<div class="options">
					<el-button>警告直播间</el-button>
					<el-button>关闭直播间</el-button>
				</div>
			</el-card>
		</div>
	</div>
</template>

<script>
import moment from 'moment'

export default {
	data () {
		return {
			currentDate: '',
			liveInfo: []
		};
	},
	async created () {
		this.currentDate = moment().format('YYYY-MM-DD')
		await this.getLiveGroupInfoById()
	},
	methods: {
		// 通过id获取详细信息
		async getLiveGroupInfoById() {
			const result = await this.$request('/api/admin/getInfoByGroupId', 'POST', {
				live_group_id: this.$route.params.live_group_id
			})
			if (result.success) {
				this.liveInfo = result.data
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.card {
	display: flex;
}

.basicInfo {
	display: flex;
	border-bottom: 1px solid #e5e5e5;
	padding: 15px;

	.image {
		width: 150px;
		height: 150px;
		display: block;
	}
	.info {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		max-width: 300px;
		margin-left: 30px;
	}

}

.options {
	padding: 15px;
	margin-top: 15px;
}
</style>