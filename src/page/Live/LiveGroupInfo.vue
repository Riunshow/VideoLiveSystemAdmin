<template>
	<div class="live-group-info" v-loading="loading">
		<div class="main">
			<!-- header -->
			<div class="header">
				<el-input placeholder="请输入要搜索的主播或房间名" v-model="inputSearch" clearable></el-input>
				<el-button class="searchBtn" @click="searchInfoByName">搜索</el-button>
				<el-button type="success" class="searchBtn" @click="reset">重置</el-button>
				<el-select class="selectCate" v-model="selectVal" @change="getSelectVal" placeholder="请选择">
					<el-option
						v-for="item in selectOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
			</div>
			<div class="card">
				<el-card :body-style="{ padding: '0px' }" shadow="hover"  v-for="(info, index) in liveInfo" :key="index">
					<div class="basicInfo">
						<img :src="info.cover" class="image">
						<div class="info">
							<span>房间id: {{info.roomID}}</span>
							<span>房间名称: {{info.title}}</span>
							<span>主播: {{info.user.nickname}}</span>
							<span class="statusInfo">房间状态: <div class="statusLight" :class="info.status == 0 ? 'error' : 'success'"></div> {{info.status == 0 ? '未直播' : '直播中'}}</span>
							<span>观众人数: {{info.Attendance}}</span>
						</div>
					</div>
					<div class="options">
						<el-button :disabled="info.status == 0">警告直播间</el-button>
						<el-button :disabled="info.status == 0">关闭直播间</el-button>
					</div>
				</el-card>
			</div>
		</div>
		<!-- footer -->
		<div class="footer">
			<!-- <el-pagination
				layout="prev, pager, next"
				:total="50">
			</el-pagination> -->
		</div>		
	</div>
</template>

<script>
import moment from 'moment'

export default {
	data () {
		return {
			loading: false,
			currentDate: '',
			liveInfo: [],
			inputSearch: '',
			selectVal: '1',
			selectOptions: [{
				value: '1',
				label: '默认排序'
			},{
				value: '2',
				label: '按照观众人数由高到低排序'
			}]
		};
	},
	async created () {
		this.currentDate = moment().format('YYYY-MM-DD')
		await this.getLiveGroupInfoById()
	},
	methods: {
		// 通过id获取详细信息
		async getLiveGroupInfoById() {
			this.loading = true
			this.liveInfo = []
			const result = await this.$request('/api/admin/getInfoByGroupId', 'POST', {
				live_group_id: this.$route.params.live_group_id
			})
			if (result.success) {
				this.liveInfo = result.data
			}
			this.loading = false
		},
		// 搜索
		async searchInfoByName() {
			if (!this.inputSearch) {
				this.$message.error('不能为空')
				return
			}
			this.loading = true
			this.liveInfo = []
			const result = await this.$request('/api/admin/findLiveInfoByName', 'POST', {
				name: this.inputSearch,
				live_group_id: this.$route.params.live_group_id
			})
			if (result.success) {
				this.liveInfo = result.data
			}
			this.loading = false
		},
		// 重置
		async reset() {
			this.inputSearch = ''
			this.selectVal = '1'
			await this.getLiveGroupInfoById()
		},
		// 通过id获取详细信息 房间人数降序
		async getInfoByGroupIdDESC() {
			this.loading = true
			this.liveInfo = []
			const result = await this.$request('/api/admin/getInfoByGroupIdDESC', 'POST', {
				live_group_id: this.$route.params.live_group_id
			})
			if (result.success) {
				this.liveInfo = result.data
			}
			this.loading = false
		},

		// 排序
		async getSelectVal(val) {
			switch (val) {
				case '1':
					await this.getLiveGroupInfoById()
					break;
				case '2':
					await this.getInfoByGroupIdDESC()
					break;
				default:
					break;
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.live-group-info {
	min-height: 70vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	.main {
		.header {
			.search-place {
				height:50px;
			}
			.el-input {
				float: left;
				width: 30%;
			}
			.selectCate {
				float: right;
			}
			.searchBtn {
				margin-left: 30px;
			}
		}

		.card {
			display: flex;
			justify-content: flex-start;
			flex-wrap: wrap;
			margin-top: 15px;

			.el-card {
				margin: 0 15px 15px 0;
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

					.statusInfo {
						display: flex;
						align-items: center;

						.statusLight {
							height: 10px;
							width: 10px;
							border-radius: 5px;
							margin: 0 5px;
						}
						.error {
							background-color: #ff0000;
						}
						.success {
							background-color: #009900;
						}
					}
				}
			}

			.options {
				padding: 15px;
				margin-top: 15px;
			}
		}
	}

	.footer {
		margin-top: 15px;
		text-align: center;
	}
}


</style>