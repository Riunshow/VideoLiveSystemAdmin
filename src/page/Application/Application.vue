<template>
	<div class="application">
		<div class="search-place">
      <el-input placeholder="请输入要搜索用户id" v-model="inputSearch" clearable></el-input>
      <el-button class="searchBtn" @click="searchApplication">搜索</el-button>
      <el-button type="success" class="searchBtn" @click="getAllRecords">重置</el-button>
    </div>
		<!-- table -->
    <el-table :data="tableData" id="out-table" v-loading="loading">
			<template v-for="column in tableColumns">
        <el-table-column 
					:width="column.label == 'id' ? 80 : ''" 
					align="center" 
					:label="column.label" 
					:prop="column.prop"
				>
				</el-table-column>
      </template>
			<el-table-column label="当前状态" prop="status" align="center" >
        <template slot-scope="scope">
					<div>
						{{ scope.row.status == 1 ? '申请中' : scope.row.status == -1 ? '未通过' : '已通过'}}
					</div>
        </template>
			</el-table-column>
			<!-- option -->
      <el-table-column label="操作" prop="">
        <template slot-scope="scope">
          <!-- 详细信息 - 修改权限 -->
          <el-button type="text" @click="agreeApplication(scope.row)">同意</el-button>
          <el-button type="text" @click="rejectApplication(scope.row)">拒绝</el-button>
        </template>
      </el-table-column>
		</el-table>
	</div>
</template>

<script>
export default {
	data () {
		return {
			loading: true,
			tableData: [],
			inputSearch: '',
			tableColumns: [{
				label: 'id',
				prop: 'wantedId'
			},
			{
				label: '真实姓名',
				prop: 'realName'
			},
			{
				label: '身份证号',
				prop: 'idCardNum'
			},
			{
				label: '关联用户id',
				prop: 'user_id'
			}],
		};
	},
	async created () {
		await this.getAllRecords()
	},
	methods: {
		// 获取所有记录
		async getAllRecords() {
			this.inputSearch = ''
			this.loading = true
			const result = await this.$request('/api/wanted/getAllApplicationRecord')
			if (result.success) {
				this.tableData = result.data
			}
			this.loading = false
		},
		// 同意
		async agreeApplication(row) {
			const result = await this.$request('/api/wanted/setStatusByUserId', 'PUT', {
				user_id: row.user_id, 
				newStatus: 3
			})
			this.$message(result.msg)
			await this.getAllRecords()
			if (result.success) {
				const changeRole = await this.$request('/api/admin/changeUserRole', 'PUT', {
					userID: row.user_id, 
					role: 2
				})
			}
		},
		// 拒绝
		async rejectApplication(row) {
			const result = await this.$request('/api/wanted/setStatusByUserId', 'PUT', {
				user_id: row.user_id, 
				newStatus: -1
			})
			this.$message(result.msg)
			await this.getAllRecords()
			if (result.success) {
				const changeRole = await this.$request('/api/admin/changeUserRole', 'PUT', {
					userID: row.user_id, 
					role: 1
				})
			}
		},
		// 搜索
		async searchApplication() {
			this.loading = true
			const result = await this.$request('/api/wanted/getStatusByUserId', 'POST', {
				user_id: parseInt(this.inputSearch)
			})
			if (result.success) {
				this.tableData = []
				this.tableData.push(result.data)
			}
			this.loading = false
		}
	}
}
</script>

<style lang="css" scoped>
.search-place {
	height:50px;
}
.el-input {
	float: left;
	width: 30%;
}
.searchBtn {
	margin-left: 30px;
}
</style>