<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        type="primary"
        size="small"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      class="user-table"
    >
      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="昵称">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="最近登录时间" prop="loginTime" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.loginTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="头像" width="80">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" style="width: 70%" class="avatar">
        </template>
      </el-table-column>

      <el-table-column align="center" label="角色" width="80">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.roles | roleFilter"
            size="small"
          >{{ scope.row.roles | userRoleStatus }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" width="80">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status | statusFilter"
            size="small"
          >{{ scope.row.status | userStatus }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleDetail(scope.row)">查看</el-button>
          <el-button type="success" size="mini" @click="handleVerify(scope.row)">实名</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :visible.sync="detailVisible" title="详细信息">
      <el-table :data="detailList" :show-header="false">
        <el-table-column prop="key" label="键" align="center" />
        <el-table-column prop="value" label="值" align="center" />
      </el-table>
    </el-dialog>

    <el-dialog :visible.sync="verifyVisible" title="实名认证">
      <el-form ref="verifyForm" :model="user" label-width="100px">
        <el-form-item label="真实姓名">
          <el-input v-model="user.realname" disabled />
        </el-form-item>
        <el-form-item label="身份证号码">
          <el-input v-model="user.idCard" disabled />
        </el-form-item>
        <el-form-item label="身份证照片">
          <el-image :src="user.idCardPreImg" />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-radio-group v-model="user.status">
            <el-radio label="normal">正常</el-radio>
            <el-radio label="forbid">禁用</el-radio>
            <el-radio label="modify">待修改</el-radio>
            <el-radio label="authentication">待实名</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="verifyVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="verifyUser()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="userVisible" title="添加用户">
      <el-form ref="userForm" :model="user" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="user.username" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="user.nickname" />
        </el-form-item>
        <el-form-item label="初始密码">
          <el-input v-model="user.password" show-password />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="userVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="createData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, deleteUser, createUser } from '@/api/user'
import { userVerify } from '@/api/admin'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
import { genderStatus } from '@/filters'

export default {
  name: 'UserList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        forbed: 'warning',
        normal: 'success',
        authentication: 'danger'
      }
      return statusMap[status]
    },
    roleFilter(status) {
      const statusMap = {
        partner: 'primary',
        user: 'success'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      env: '',
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      user: {
        username: '',
        nickname: '',
        password: '',
        avatar:
          'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
      },
      userVisible: false,
      detailVisible: false,
      detailList: [],
      verifyVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getUserList(this.listQuery).then(res => {
        this.list = res.data.items
        this.total = res.data.total
        this.listLoading = false
      })
    },
    handleVerify(row) {
      this.user = row
      this.verifyVisible = true
    },
    verifyUser() {
      userVerify(this.user).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
      })
    },
    handleDetail(row) {
      this.detailList = [
        { key: '用户名', value: row.username },
        { key: '昵称', value: row.nickname },
        { key: '性别', value: genderStatus(row.gender) },
        { key: '手机号', value: row.mobilePhone },
        { key: '邮箱', value: row.email },
        { key: '微信', value: row.wechat },
        { key: '生日', value: row.birthday },
        { key: '身份证', value: row.idCard },
        { key: '真实姓名', value: row.realname },
        { key: '介绍', value: row.intro },
        {
          key: '注册时间',
          value: parseTime(row.regTime, '{y}-{m}-{d} {h}:{i}')
        },
        {
          key: '最近登录时间',
          value: parseTime(row.loginTime, '{y}-{m}-{d} {h}:{i}')
        },
        { key: '状态', value: row.status === 'normal' ? '正常' : '禁用' }
      ]
      this.detailVisible = true
    },
    handleCreate() {
      this.userVisible = true
    },
    handleDelete(row) {
      this.$confirm('是否删除该用户？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const index = this.list.indexOf(row)
          this.user = Object.assign({}, row)
          deleteUser(this.user.id).then(() => {
            this.list.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除'
          })
        })
    },
    createData() {
      createUser(this.user).then(res => {
        this.list.unshift(this.user)
        this.userVisible = false
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>

<style lang="scss">
.el-tag {
  margin-right: 5px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
</style>

<style lang="scss" scoped>
.user-table {
  .avatar {
    width: 40px !important;
    height: 40px !important;
  }
}
.avatar-uploader {
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .avatar {
    width: 80px;
    height: 80px;
    display: block;
  }
}
</style>
