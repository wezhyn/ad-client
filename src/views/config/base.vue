<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="5">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>价目表设置</span>
          </div>
          <div class="price-form">
            <el-input v-for="(item, i) in timeList" :key="i" v-model="priceList[i]" placeholder="请输入价格" class="price-input">
              <template slot="prepend">{{ item[0]+' - '+item[1] }}</template>
            </el-input>
          </div>
          <el-button type="primary" size="mini" @click="submitPrice">保存</el-button>
          <el-button size="mini" @click="getPrice">重置</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getPrice, postPrice } from '@/api/order'

export default {
  name: 'ConfigBase',
  data() {
    return {
      priceList: [],
      timeList: [
        ['00:00', '06:59'],
        ['07:00', '09:59'],
        ['10:00', '15:59'],
        ['16:00', '16:59'],
        ['17:00', '19:59'],
        ['20:00', '20:59'],
        ['21:00', '23:59']
      ]
    }
  },
  created() {
    this.getPrice()
  },
  methods: {
    getPrice() {
      getPrice().then(res => {
        this.priceList = res.data.revenue
      })
    },
    submitPrice() {
      this.priceList = this.priceList.map(Number)
      postPrice(this.priceList).then(() => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      })
    }
  }
}
</script>

<style lang="scss">
.price-form {
  .price-input {
    margin-bottom: 10px;
  }
}
</style>
