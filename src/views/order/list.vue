<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        type="danger"
        size="small"
        icon="el-icon-edit"
        @click="handleQueryDelete"
      >批量删除</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @selection-change="handleSelection"
    >
      <el-table-column align="center" type="selection" width="40" />

      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="内容" width="300">
        <template slot-scope="scope">
          <p v-for="(item, index) in scope.row.valueList" :key="index">{{ item }}</p>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户名" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="总数" width="100" prop="num" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.num }} 条</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="单价" width="100" prop="price" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.price }} 元/条</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="位置">
        <template slot-scope="scope">
          <span
            @click="handleMap(scope.row)"
          >({{ scope.row.latitude }}, {{ scope.row.longitude }}, {{ scope.row.scope }}km)</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="投放日期" prop="startDate" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.startDate | parseTime('{y}-{m}-{d}') }} 至 {{ scope.row.endDate | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="投放时段" prop="startTime" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.startTime }} 至 {{ scope.row.endTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="审核" width="80">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.verify | verifyFilter"
            size="small"
          >{{ scope.row.verify | verifyStatus }}</el-tag>
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

    <el-dialog :visible.sync="mapVisible" title="投放位置">
      <baidu-map
        class="map"
        :ak="map.ak"
        :center="{lat:map.latitude, lng:map.longitude}"
        :zoom="map.zoom"
        @ready="handler"
      >
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" />
        <bm-marker
          :position="{lat:map.latitude, lng:map.longitude}"
          :icon="{url: require(`@/assets/images/car.png`), size: {width: 32, height: 32}}"
        />
        <bm-circle
          :center="{lat:map.latitude, lng:map.longitude}"
          :radius="map.scope * 1000"
          stroke-color="red"
          :stroke-opacity="0.5"
          :stroke-weight="2"
        />
      </baidu-map>
    </el-dialog>

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
      <el-form ref="verifyForm" :model="order" label-width="100px">
        <el-form-item label="审核状态">
          <el-radio-group v-model="order.verify">
            <el-radio label="wait">待审核</el-radio>
            <el-radio label="pass">通过</el-radio>
            <el-radio label="fail">不通过</el-radio>
            <el-radio label="modify">待修改</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="反馈信息">
          <el-input v-model="order.feedback" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="verifyVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="verifyOrder()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOrderList,
  deleteOrder,
  verifyOrder,
  queryDeleteOrder
} from '@/api/order'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
import { verifyStatus } from '@/filters'
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import BmMarker from 'vue-baidu-map/components/overlays/Marker.vue'
import BmCircle from 'vue-baidu-map/components/overlays/Circle.vue'
import BmNavigation from 'vue-baidu-map/components/controls/Navigation.vue'

export default {
  name: 'OrderList',
  components: { Pagination, BaiduMap, BmMarker, BmCircle, BmNavigation },
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
      order: {},
      mapVisible: false,
      select: [],
      selectId: [],
      map: {
        latitude: null,
        longitude: null,
        scope: null,
        ak: 'lWb3xrcXrplVmfqQff11jI5gytw1UVXA',
        zoom: 14
      }
    }
  },
  created() {
    this.getList()
    this.env = process.env
  },
  methods: {
    handler({ BMap, map }) {},
    handleDetail(row) {
      this.detailList = [
        { key: 'ID', value: row.id },
        { key: '用户名', value: row.username },
        { key: '总数', value: row.num + ' 条' },
        { key: '单价', value: row.price + ' 元/条' },
        { key: '播放频率', value: row.rate + ' 条/分钟' },
        {
          key: '经纬度',
          value: '(' + row.latitude + ', ' + row.longitude + ')'
        },
        { key: '范围', value: row.scope + ' km' },
        {
          key: '投放日期',
          value:
            parseTime(row.startDate, '{y}-{m}-{d}') +
            ' 至 ' +
            parseTime(row.endDate, '{y}-{m}-{d}')
        },
        {
          key: '投放时段',
          value:
            row.startTime +
            ' 至 ' +
            row.endTime
        },
        { key: '审核', value: row.verify ? verifyStatus(row.verify) : '' }
      ]
      this.detailVisible = true
    },
    getList() {
      this.listLoading = true
      getOrderList(this.listQuery).then(res => {
        this.list = res.data.items
        this.total = res.data.total
        this.listLoading = false
      })
    },
    handleQueryDelete() {
      this.$confirm('是否批量删除选中订单？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.selectId = []
          for (const i of this.select) {
            this.selectId.push(i.id)
            const index = this.list.indexOf(i)
            this.list.splice(index, 1)
          }
          queryDeleteOrder(this.selectId).then(() => {
            this.$message({
              type: 'success',
              message: '批量删除成功'
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
    handleMap(row) {
      this.map.latitude = row.latitude
      this.map.longitude = row.longitude
      this.map.scope = row.scope
      this.mapVisible = true
    },
    handleVerify(row) {
      this.order = row
      this.verifyVisible = true
    },
    verifyOrder() {
      verifyOrder(this.order).then(() => {
        this.$notify({
          title: '成功',
          message: '提交成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleSelection(val) {
      this.select = val
    },
    handleDelete(row) {
      this.$confirm('是否删除该订单？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const index = this.list.indexOf(row)
          this.order = Object.assign({}, row)
          deleteOrder(this.order.id).then(() => {
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

<style lang="scss">
p {
  margin: 0;
}
.map {
  width: 100%;
  height: 500px;
  /deep/ .anchorBL {
    display: none;
  }
  .info-content {
    font-size: 12px;
  }
}
</style>
