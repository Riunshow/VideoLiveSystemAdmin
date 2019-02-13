<style scoped>
  .search-place {
    height:50px;
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
.options{
    margin: 10px;
}
.uploadExcel input[type=file]
{
    display: none;
}
.blockPage {
    text-align: center;
    margin-top: 20px;
    margin-bottom: -50px;
}
</style>
<!-- 用户管理组件 -->
<template>
  <div class="user-wrap">
    <div class="search-place">
      <el-input placeholder="请输入要搜索用户名" v-model="inputSearch" clearable></el-input>
      <el-button class="searchBtn" @click="searchUser">搜索</el-button>
      <el-button type="success" @click="resetAll" class="searchBtn">重置</el-button>
      <!-- <el-select v-model="selectSearch" placeholder="分类筛选" filterable @change='getSearchRole' class="selectRole">
                <el-option  v-for="item in options" :key="item.value" :label="item.label" :value="item.value" ></el-option>
            </el-select> -->
    </div>
    <el-table :data="tableData" id="out-table" v-loading="loading">
      <template v-for="column in tableColumns">
        <el-table-column :label="column.label" :prop="column.prop">
        </el-table-column>
      </template>
      <el-table-column label="操作" prop="">
        <template slot-scope="scope">
          <!-- 详细信息 -->
          <el-button type="text" @click="getUserInfo(scope.row)">详细信息</el-button>
          <el-button type="text" @click="clickChangeRole(scope.row), dialogFormVisible = true" class="options">修改权限</el-button>
          <el-dialog title="权限管理" :visible.sync="dialogFormVisible">
            <el-form :model="form">
              <el-form-item label="权限选择" :label-width="formLabelWidth">
                <el-select v-model="form.region" placeholder="请选择权限" @change="getChangeRole">
                  <el-option v-for="item in changeRoleoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="changeRole()">确 定</el-button>
            </div>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
    <div class="blockPage">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :total="count">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    // -1为封禁用户,0为普通用户,1为主播,2为管理员
    data() {
      return {
        inputSearch: '',
        selectSearch: '',
        options: [{
          value: -1,
          label: '封禁用户',
        }, {
          value: 0,
          label: '普通用户',
        }, {
          value: 1,
          label: '主播',
        }, {
          value: 2,
          label: '管理员',
        }],
        changeRoleoptions: [{
          value: -1,
          label: '封禁用户',
        }, {
          value: 0,
          label: '普通用户',
        }, {
          value: 1,
          label: '主播',
        }, {
          value: 2,
          label: '管理员',
        }],
        dialogTableVisible: false,
        dialogFormVisible: false,
        dialogVisible: false,
        form: {
          name: '',
          region: '',
          role: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        newRow: {},
        formLabelWidth: '120px',
        tableData: [],
        nowTableData: [],
        tableColumns: [{
            label: 'id',
            prop: 'id'
          },
          {
            label: '用户名',
            prop: 'useraccount'
          },
          {
            label: '姓名',
            prop: 'nickname'
          },
          {
            label: '身份',
            prop: 'rolename'
          }
        ],
        delIndex: '',
        delRows: '',
        searchRole: '',
        selectRole: '', // 修改权限时,选择的 role
        loading: true,
        count: 0,
        currentPageSave: 0,
      };
    },
    created() {
      this.getAllUser()
    },
    mounted() {},
    methods: {
      // 重置
      resetAll() {
        this.inputSearch = ''
        this.selectSearch = ''
        this.getAllUser()
      },
      // 获取所有用户信息
      async getAllUser() {
        const result = await this.$request('/api/admin/userList')
        if (result.success) {
          for (const key of result.data) {
            switch (key.role) {
              case -1:
                key.rolename = '封禁用户'              
                break;
              case 0:
                key.rolename = '普通用户'              
                break;
              case 1:
                key.rolename = '主播'              
                break;
              case 2:
                key.rolename = '管理员'              
                break;
              default:
                break;
            }
          }
          this.count = result.count
          this.tableData = result.data
          this.loading = false
        }
      },
      // 跳转到用户详情页
      getUserInfo(row) {
        this.$router.push({
          path: `userinfo/${row.id}`
        })
      },
      // 分页
      async handleCurrentChange(val) {
        this.currentPageSave = val
        if (val == 0) {
          val += 1
        }
        const result = await this.$request('/api/admin/userList?offset=' + (val - 1))
        if (result.success) {
          for (const key of result.data) {
            switch (key.role) {
              case -1:
                key.rolename = '封禁用户'              
                break;
              case 0:
                key.rolename = '普通用户'              
                break;
              case 1:
                key.rolename = '主播'              
                break;
              case 2:
                key.rolename = '管理员'              
                break;
              default:
                break;
            }
          }
          this.tableData = result.data
          this.nowTableData = this.tableData
        }
      },

      // -----------------------------------------
      clickChangeRole(row) {
        this.newRow = row
      },
      getChangeRole(value) {
        this.selectRole = value;
      },
      changeRole() {
        this.dialogFormVisible = false;
        if (this.form.region == '') {
          this.$message.error('修改失败,所选内容不能为空')

        } else if (this.form.region == '全部') {
          this.$message.error('修改失败')

        } else {
          this.$axios.put('/admin/' + this.newRow.id, {
            role: this.selectRole
          }).then((result) => {
            if (result.data[0] == 1) {
              this.$message('修改成功')
              if (this.selectRole == 3) {
                this.newRow.rolename = '系统管理员'
              } else if (this.selectRole == 2) {
                this.newRow.rolename = '图书管理员'
              } else if (this.selectRole == 1) {
                this.newRow.rolename = '普通用户'
              }
            } else {
              this.$message('修改失败,请刷新重试')
            }
          }).catch((err) => {
            this.$message.error('修改出现问题,请联系管理员')
          })

        }
      },
      addClick() {
        const addInput = document.querySelector('.uploadInput')
        addInput.click();
      },
      getSearchRole(value) {
        this.searchRole = value
        this.tableData = []
        if (value == -1) {
          this.tableData = this.nowTableData
        } else {
          for (const iter of this.nowTableData) {
            if (iter.role == this.searchRole) {
              this.tableData.push(iter)
            }
          }
        }
      },
      searchUser() {
        let options = {}
        this.tableData = []

        if (this.inputSearch == '' && this.selectSearch == '') {
          this.$message.error('请输入要搜索的用户名')
          return;
        }
        this.$axios.get('/admin/search?name=' + this.inputSearch)
          .then((results) => {
            for (const key of results.data.rows) {
              if (key.role == 3) {
                key.rolename = '系统管理员'
              } else if (key.role == 2) {
                key.rolename = '图书管理员'
              } else if (key.role == 1) {
                key.rolename = '普通用户'
              }
            }
            this.tableData = results.data.rows
            this.count = results.data.count

            this.$message('搜索成功')
          })
          .catch((err) => {
            this.$message.error('搜索失败')
          })
      },
    }
  };
</script>