<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column label="标题" align="center">
        <template slot-scope="{row}">
          <router-link :to="'/activity/edit/'+row.id" class="link-type">
            <span>{{ row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column align="center" label="发布日期">
        <template slot-scope="scope">
          <span>{{ scope.row.publishTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="作者">
        <template slot-scope="scope">
          <span>{{ scope.row.admin }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" align="center" label="状态">
        <template slot-scope="{row}">
          <el-tag size="small" :type="row.publish ? 'success' : 'warning'">
            {{ row.publish ? '发布' : '草稿' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <router-link :to="'/activity/edit/'+scope.row.id">
            <el-button type="primary" size="mini">
              编辑
            </el-button>
          </router-link>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { getActivityList, deleteActivity } from '@/api/activity'
import Pagination from '@/components/Pagination'

export default {
  name: 'ActivityList',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getActivityList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleDelete(row) {
      this.$confirm('是否删除该活动？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.list.indexOf(row)
        this.activity = Object.assign({}, row)
        deleteActivity(this.activity.id).then(() => {
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
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.image {
  height: 80px !important;
}
</style>
