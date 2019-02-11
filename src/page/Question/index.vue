<template>
  <div class="user-wrap">
    <el-table :data="tableData" id="out-table" v-loading="loading">
      <template v-for="column in tableColumns">
				<el-table-column :label="column.label" :prop="column.prop" v-if="column.prop === 'content'" width="500">
        </el-table-column>
        <el-table-column :label="column.label" :prop="column.prop" v-else>
        </el-table-column>
      </template>
      <el-table-column label="操作" prop="">
        <template slot-scope="scope">
          <!-- 删除 -->
          <el-button type="text" @click="getDelRow(scope.$index, scope.row)">删除</el-button>
          <el-dialog title="提示" :visible.sync="deleteVisible" width="30%">
            <span>确认删除?</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="deleteVisible = false">取 消</el-button>
              <el-button type="danger" @click.native.prevent="deleteRow()">确 定</el-button>
            </span>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
    <div class="blockPage">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :total="count" :current-page="current_page">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
				tableData: [],
				count: 0,
				current_page: 1,
				loading: true,
        deleteVisible: false,						
        tableColumns: [{
            label: 'id',
            prop: 'id'
          },
          {
            label: '反馈标题',
            prop: 'name'
          },
          {
            label: '反馈人邮箱',
            prop: 'email'
          },
          {
            label: '反馈内容',
            prop: 'content'
          }
        ],
      };
    },
    created() {
      this.getData()
    },
    methods: {
      getData() {
        this.$axios
          .get('/problem')
          .then(res => {
            console.log(res.data);
						this.tableData = res.data.rows
						this.loading = false
          })
      },
      // 获取点击的删除行
      getDelRow(index, rows) {
        this.deleteVisible = true
        this.delIndex = index
        this.delRows = rows
      },
      // 删除点击的当前行
      deleteRow() {
        this.deleteVisible = false
        this.tableData.splice(this.delIndex, 1);

        this.$axios.delete('/problem/' + this.delRows.id)
          .then((res) => {
            this.$message('删除成功')
            this.current_page = 1
          })
          .catch((error) => {
            this.$message.error('错了哦，这是一条错误消息');
          })

			},
      // 分页
      handleCurrentChange(val) {
        this.currentPageSave = val
        if (val == 0) {
          val += 1
				}
				if (this.isSearchExist !== '') {
					this.$axios
						.get(`/problem?offset=${(val - 1)}`)
						.then((results) => {
							this.tableData = results.data.rows
						})
				}else {
					this.$axios
						.get('/problem?offset=' + (val - 1))
						.then((results) => {
							this.tableData = results.data.rows
						})
				}


      },
    }
  }

</script>

<style scoped>
  .search-place {
    height: 50px;
  }

  .el-input {
    float: left;
    width: 30%;
  }

  .selectRole {
    float: right;
  }

  .searchBtn {
    margin-left: 30px;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .options {
    margin: 10px;
  }

  .uploadExcel input[type=file] {
    display: none;
  }

  .blockPage {
    text-align: center;
    margin-top: 20px;
    margin-bottom: -50px;
  }

</style>
