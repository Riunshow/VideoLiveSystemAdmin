<template>
	<div class="live-group">
		<!-- head -->
		<div class="search-place">
      <el-input placeholder="请输入要搜索用户名或昵称" v-model="inputSearch" clearable></el-input>
      <el-button class="searchBtn">搜索</el-button>
      <el-button type="success" class="searchBtn">重置</el-button>
      <el-select v-model="selectSearch" placeholder="身份筛选" filterable :clearable="true" @change="getSearchCate" class="selectCate">
        <el-option  v-for="item in optionsCate" :key="item.value" :label="item.label" :value="item.value" ></el-option>
      </el-select>
    </div>
		<!-- table -->
    <el-table :data="tableData" id="out-table" v-loading="loading">
			<template v-for="column in tableColumns">
        <el-table-column :width="column.label == 'id' ? 80 : ''" align="center" :label="column.label" :prop="column.prop">

				</el-table-column>
      </template>
			<!-- option -->
      <el-table-column label="操作" prop="">
        <template slot-scope="scope">
          <!-- 详细信息 - 修改权限 -->
          <el-button type="text">详细信息</el-button>
          <el-button type="text">修改权限</el-button>
          <el-button type="text">删除</el-button>
        </template>
      </el-table-column>
		</el-table>

	</div>
</template>

<script>
export default {
	data () {
		return {
			loading: false,
			inputSearch: '',
			selectSearch: '',
			optionsCate: [{
				value: 1,
				label: '主机游戏',
			}],
			tableData: [],
			tableColumns: [{
					label: 'id',
					prop: 'id'
				},
				{
					label: '分组名称',
					prop: 'groupName'
				},
				{
					label: '分组背景图',
					prop: 'groupAvatar'
				},
				{
					label: '分组下人数',
					prop: 'peopleCount'
				}
			],
		};
	},
	methods: {
		getSearchCate(val) {

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
</style>