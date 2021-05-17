<template>
  <div class="app-container">

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" class="bill-table">

      <el-table-column align="center" label="订单ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.orderId }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="成交额 (元)" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.totalAmount }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="买家ID">
        <template slot-scope="scope">
          <span>{{ scope.row.buyerId }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="卖家ID">
        <template slot-scope="scope">
          <span>{{ scope.row.sellerId }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtCreate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单完成时间">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtPayment | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleDetail(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { getBillList } from '@/api/bill'
import Pagination from '@/components/Pagination'

export default {
  name: 'BillList',
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
      getBillList(this.listQuery).then(res => {
        this.list = res.data.items
        this.total = res.data.total
        this.listLoading = false
      })
    }
  }
}
</script>
