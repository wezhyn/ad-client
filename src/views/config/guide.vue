<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12" class="iphone">
        <el-carousel class="carousel" height="525px">
          <el-carousel-item v-for="(item, index) in list" :key="index">
            <el-image
              class="image"
              :src="item.value"
              fit="fill"
            />
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <el-col :span="12" class="form">
        <el-form ref="guideForm">
          <el-form-item v-for="(item, index) in list" :key="index">
            <el-input v-model="item.value" placeholder="引导图">
              <el-button slot="append" size="small" icon="el-icon-delete" @click="handleDelete(item.id, index)" />
              <el-upload
                slot="prepend"
                :action="env.VUE_APP_BASE_API+'/file/guide'"
                :before-upload="beforeUpload"
                :show-file-list="false"
                :on-success="(res, file, fileList) => { return uploadSuccess(res, file, fileList, index) }"
                :data="{key: index,token: token}"
                name="img"
              >
                <el-button size="small" icon="el-icon-upload" />
              </el-upload>
            </el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getGuideList, deleteGuide } from '@/api/config'
import { getToken } from '@/utils/auth'
export default {
  name: 'ConfigGuide',
  data() {
    return {
      env: '',
      list: null,
      token: null
    }
  },
  created() {
    this.env = process.env
    this.getList()
    this.token = getToken()
  },
  methods: {
    getList() {
      getGuideList().then(res => {
        this.list = res.data.items
      })
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    uploadSuccess(res, file, fileList, index) {
      this.list[index].value = res.data.address
      this.$notify({
        title: '成功',
        message: '引导图上传成功',
        type: 'success',
        duration: 2000
      })
    },
    handleDelete(id, index) {
      this.$confirm('是否删除该引导图？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGuide(id).then(res => {
          this.list[index].value = ''
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
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

<style lang="scss">
.iphone {
  background: url('../../assets/images/iphone.png') no-repeat;
  width: 375px;
  height: 750px;
  .carousel {
    top: 112px;
    left: 40px;
    width: 296px !important;
    .image {
      width: 296px;
      height: 526px;;
    }
  }
}
.form {
  margin: 35px;
}
</style>
