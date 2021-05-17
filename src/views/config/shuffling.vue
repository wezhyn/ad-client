<template>
  <div class="app-container">
    <el-row>
      <el-col :span="8" class="iphone">
        <el-carousel class="carousel" height="170px" indicator-position="none">
          <el-carousel-item v-for="(item, index) in list" :key="index">
            <el-image
              class="image"
              :src="item.value"
              fit="fill"
            />
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <el-col :span="16" class="form">
        <el-row>
          <el-upload
            class="uploader"
            :action="env.VUE_APP_BASE_API+'/file/shuffing'"
            :show-file-list="false"
            :on-success="uploadSuccess"
            :before-upload="beforeUpload"
            name="img"
            :data="{token: token}"
          >
            <i class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-row>
        <el-row class="list">
          <el-col
            v-for="(item, index) in list"
            :key="index"
            class="item"
          >
            <el-image
              class="image"
              :src="item.value"
              :preview-src-list="previewList"
              fit="fill"
              lazy
            />
            <el-button type="danger" class="btn" icon="el-icon-delete" @click="handleDelete(item.id)" />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getShuffingList, deleteShuffing } from '@/api/config'
import { getToken } from '@/utils/auth'
export default {
  name: 'ConfigShuffing',
  data() {
    return {
      env: '',
      list: null,
      previewList: [],
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
      getShuffingList().then(res => {
        this.list = res.data.items
        for (const item of res.data.items) {
          this.previewList.push(item.value)
        }
      })
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    uploadSuccess(res, file) {
      this.getList()
      this.$notify({
        title: '成功',
        message: '引导图上传成功',
        type: 'success',
        duration: 2000
      })
    },
    handleDelete(id) {
      this.$confirm('是否删除该轮播图？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteShuffing(id).then(res => {
          this.getList()
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
      height: 170px;;
    }
  }
}
.form {
  margin: 35px;
  .list {
    margin-top: 20px;
    .item {
      margin-right: 20px;
      margin-bottom: 20px;
      box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.15);
      width: 150px;
      height: 120px;
      display: block;
      .image {
        width: 100%;
        height: 100px;
      }
      .btn {
        width: 100%;
        height: 20px;
        border-radius: 0;
        background-color: #f56c6c;
      }
    }
  }
}
.uploader .el-upload {
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.uploader .el-upload:hover {
  border-color: #409EFF;
}
</style>

<style lang="scss" scoped>
.uploader {
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
}
</style>
