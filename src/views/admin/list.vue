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

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" class="user-table">

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

      <el-table-column align="center" label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" style="width: 70%" class="avatar">
        </template>
      </el-table-column>

      <el-table-column align="center" label="角色">
        <template slot-scope="scope">
          <el-tag :type="scope.row.roles | roleFilter" size="small">{{ scope.row.roles | adminRoleStatus }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="授权时间" prop="authTime" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.authTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :visible.sync="adminVisible" :title="textMap[dialogStatus]">
      <el-form ref="adminForm" :model="admin" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="admin.username" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="admin.nickname" />
        </el-form-item>
        <el-form-item label="角色">
          <el-radio-group v-model="admin.roles">
            <el-radio label="developer">开发</el-radio>
            <el-radio label="customer">客服</el-radio>
            <el-radio label="finance">财务</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="adminVisible = false">取消</el-button>
        <el-button
          size="small"
          type="primary"
          @click="dialogStatus==='create'?createData():editData()"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAdminList, deleteAdmin, updateAdmin, createAdmin } from '@/api/admin'
import Pagination from '@/components/Pagination'

export default {
  name: 'AdminList',
  components: { Pagination },
  filters: {
    roleFilter(status) {
      const statusMap = {
        customer: '',
        developer: 'warning',
        finance: 'success'
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
      admin: {
        username: '',
        nickname: '',
        avatar: '',
        roles: ''
      },
      dialogStatus: '',
      adminVisible: false,
      textMap: {
        edit: '编辑',
        create: '添加'
      },
      avatarUrl: ''
    }
  },
  created() {
    this.getList()
    this.env = process.env
  },
  methods: {
    getList() {
      this.listLoading = true
      getAdminList(this.listQuery).then(res => {
        this.list = res.data.items
        this.total = res.data.total
        this.listLoading = false
      })
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.resetAdmin()
      this.adminVisible = true
    },
    handleEdit(row) {
      this.dialogStatus = 'edit'
      this.admin = row
      this.adminVisible = true
    },
    resetAdmin() {
      this.admin = {
        username: '',
        nickname: '',
        avatar: '',
        roles: ''
      }
    },
    handleDelete(row) {
      this.$confirm('是否删除该管理员？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.list.indexOf(row)
        this.admin = Object.assign({}, row)
        deleteAdmin(this.admin.username).then(() => {
          this.list.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    createData() {
      createAdmin(this.admin).then((res) => {
        this.list.unshift(this.admin)
        this.adminVisible = false
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    editData() {
      const tempData = Object.assign({}, this.admin)
      updateAdmin(tempData).then(() => {
        for (const v of this.list) {
          if (v._id === this.admin._id) {
            const index = this.list.indexOf(v)
            this.list.splice(index, 1, this.admin)
            break
          }
        }
        this.adminVisible = false
        this.$notify({
          title: '成功',
          message: '编辑成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleAvatarSuccess(res, file) {
      this.avatarUrl = URL.createObjectURL(file.raw)
      this.admin.avatar = res.data.address
      this.$notify({
        title: '成功',
        message: '头像上传成功',
        type: 'success',
        duration: 2000
      })
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
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
  border-color: #409EFF;
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
