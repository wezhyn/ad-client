<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="编号">
        <template slot-scope="scope">
          <span>{{ scope.row.key }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status?'success':'warning'"
            size="small"
          >{{ scope.row.status | equipmentStatus }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="审核">
        <template slot-scope="scope">
          <el-tag :type="scope.row.verify | verifyFilter" size="small">{{ scope.row.verify | verifyStatus }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleDetail(scope.row)">查看</el-button>
          <el-button type="success" size="mini" @click="handleVerify(scope.row)">审核</el-button>
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

    <el-dialog :visible.sync="verifyVisible" title="设备审核">
      <el-form ref="verifyForm" :model="equipment" label-width="100px">
        <el-form-item label="审核状态">
          <el-radio-group v-model="equipment.verify">
            <el-radio label="wait">待审核</el-radio>
            <el-radio label="pass">通过</el-radio>
            <el-radio label="fail">不通过</el-radio>
            <el-radio label="modify">待修改</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="反馈信息">
          <el-input v-model="equipment.feedback" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="verifyVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="verifyEquipment()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getEquipmentList,
  deleteEquipment,
  verifyEquipment
} from '@/api/equipment'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
import { verifyStatus } from '@/filters'

export default {
  name: 'EquipmentList',
  components: { Pagination },
  filters: {
    verifyFilter(verify) {
      const verifyMap = {
        fail: 'danger',
        wait: 'primary',
        modify: 'warning',
        pass: 'success'
      }
      return verifyMap[verify]
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
      detailVisible: false,
      verifyVisible: false,
      detailList: [],
      equipment: {}
    }
  },
  created() {
    this.getList()
    this.env = process.env
  },
  methods: {
    handleDetail(row) {
      this.detailList = [
        { key: 'ID', value: row.id },
        { key: '用户名', value: row.username },
        { key: '名称', value: row.name },
        { key: '编号', value: row.key },
        { key: '介绍', value: row.intro },
        {
          key: '添加时间',
          value: row.createTime
            ? parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}')
            : ''
        },
        {
          key: '开启时间',
          value: row.startTime ? parseTime(row.startTime, '{y}-{m}-{d}') : ''
        },
        {
          key: '关闭时间',
          value: row.endTime ? parseTime(row.endTime, '{y}-{m}-{d}') : ''
        },
        { key: '审核', value: row.verify ? verifyStatus(row.verify) : '' },
        { key: '状态', value: row.status ? '运行中' : '已关闭' }
      ]
      this.detailVisible = true
    },
    getList() {
      this.listLoading = true
      getEquipmentList(this.listQuery).then(res => {
        this.list = res.data.items
        this.total = res.data.total
        this.listLoading = false
      })
    },
    handleVerify(row) {
      this.equipment = row
      this.verifyVisible = true
    },
    verifyEquipment() {
      verifyEquipment(this.equipment).then(() => {
        this.$notify({
          title: '成功',
          message: '提交成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDelete(row) {
      this.$confirm('是否删除该设备？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const index = this.list.indexOf(row)
          this.equipment = Object.assign({}, row)
          deleteEquipment(this.equipment.id).then(() => {
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
    }
  }
}
</script>
