<template>
	<div class="live-group">
		<!-- head -->
		<div class="search-place">
      <el-input placeholder="请输入要搜索用户名或昵称" v-model="inputSearch" clearable></el-input>
      <el-button class="searchBtn">搜索</el-button>
      <el-button type="success" class="searchBtn">重置</el-button>
      <el-select v-model="selectSearch" placeholder="分组名称筛选" filterable :clearable="true" @change="getSearchCate" class="selectCate">
        <el-option v-for="item in optionsCate" :key="item.value" :label="item.label" :value="item.value" ></el-option>
      </el-select>
      <el-button type="primary" class="add" @click="dialogFormVisible = true">添加</el-button>
			<!-- 添加的弹框 -->
			<el-dialog title="用户信息" :visible.sync="dialogFormVisible">
				<el-form :model="groupForm">
					<el-form-item label="分组头像" :label-width="formLabelWidth">
						<upload 
							v-on:getImgUrl="getImgUrl"
						/>
					</el-form-item>
					<el-form-item label="分组名称" :label-width="formLabelWidth">
						<el-input v-model="groupForm.groupName" auto-complete="off"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取 消</el-button>
					<el-button v-if="canClick" type="primary" @click="addNewGroup">确 定</el-button>
					<el-button v-else disabled>确 定</el-button>
				</div>
			</el-dialog>
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
			<el-table-column label="分组背景图" prop="groupAvatar">
        <template slot-scope="scope">
					<img class="groupAvatar" :src="scope.row.groupAvatar" alt="">
        </template>
			</el-table-column>
			<!-- option -->
      <el-table-column label="操作" prop="">
        <template slot-scope="scope">
          <!-- 详细信息 - 修改权限 -->
          <el-button type="text" @click="getLiveGroupInfo(scope.row)">详细信息</el-button>
          <el-button type="text">删除</el-button>
        </template>
      </el-table-column>
		</el-table>

	</div>
</template>

<script>
import Upload from './../../components/Upload'
export default {
	components: {
		Upload
	},
	data () {
		return {
			loading: false,
			dialogFormVisible: false,
			inputSearch: '',
			selectSearch: '',
			optionsCate: [{
				value: 1,
				label: '主机游戏',
			}],
			tableData: [],
			tableColumns: [{
					label: 'id',
					prop: 'liveGroupId'
				},
				{
					label: '分组名称',
					prop: 'groupName'
				},
				{
					label: '直播间数量',
					prop: 'peopleCount'
				}
			],
			canClick: false,
			formLabelWidth: '100px',
			groupForm: {
				groupAvatar: '',
				groupName: ''
			},
		};
	},
	async created () {
		this.canClick = false
		await this.getAllCateInfo()
	},
	methods: {
		// 获取选择的分类
		getSearchCate(val) {
			console.log(val);
		},
		// 获取所有直播间分类信息
		async getAllCateInfo(page = 1) {
			this.loading = true
			const result = await this.$request('/api/admin/getLiveGroupList?offset=' + (page - 1))
			if (result.success) {
				result.data.map(x => x.peopleCount = x.lives.length)
				this.tableData = result.data
				this.loading = false
			}
		},
		// 添加一个新分类
		async addNewGroup() {
			const result = await this.$request('/api/admin/addNewLiveGroup', 'POST', {
				groupName: this.groupForm.groupName, 
				groupAvatar: this.groupForm.groupAvatar
			})
			if (result.success) {
				this.$message(result.msg)
				this.dialogFormVisible = false
				this.groupForm = {
					groupAvatar: '',
					groupName: ''
				}
			}
		},
		// 获取选择的图片
		getImgUrl(imgUrl) {
			this.groupForm.groupAvatar = imgUrl
			this.canClick = true
		},
		// 获取信息
		getLiveGroupInfo(row) {
			this.$store.commit('save_detail_liveGroupInfo', row)
			this.$router.push({
				path: `liveGroupInfo/${row.liveGroupId}`
			})
		}
	}
}
</script>

<style scoped>
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
.add {
	float: right;
	margin-right: 30px;
}
.groupAvatar {
	height: 50px;
	width: 50px;
}
</style>