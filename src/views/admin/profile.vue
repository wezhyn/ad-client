<template>
  <div class="app-container">
    <el-tabs>
      <el-tab-pane label="个人资料">
        <el-card>
          <el-form ref="adminForm" label-width="80px">
            <el-form-item label="用户名">
              <el-input v-model="user.username" />
            </el-form-item>
            <el-form-item label="昵称">
              <el-input v-model="user.nickname" />
            </el-form-item>
            <el-form-item label="头像">
              <el-upload
                class="avatar-uploader"
                :action="env.VUE_APP_BASE_API+'/file/avatar'"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                name="img"
                :headers="{'X-Token': token}"
              >
                <img v-if="avatarUrl" :src="avatarUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
              <el-input v-show="false" v-model="user.avatar" />
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="handleProfile()">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="修改密码">
        <el-card>
          <el-form ref="verifyForm" label-width="80px">
            <el-form-item label="旧密码">
              <el-input v-model="verify.oldPwd" name="oldpwd" type="password" />
            </el-form-item>
            <el-form-item label="新密码">
              <el-input v-model="verify.newPwd" name="newpwd" type="password" />
            </el-form-item>
            <el-form-item label="再次输入">
              <el-input v-model="verify.againPwd" name="againpwd" type="password" />
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="handleVerify()">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { updateAdmin, updatePassword } from '@/api/admin'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'

export default {
  name: 'AdminProfile',
  data() {
    return {
      avatarUrl: '',
      env: '',
      verify: {
        oldPwd: '',
        newPwd: '',
        againPwd: '',
        username: ''
      },
      token: getToken()
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created() {
    this.env = process.env
  },
  methods: {
    handleVerify() {
      if (this.verify.newpwd !== this.verify.againpwd) {
        this.$notify({
          title: '修改失败',
          message: '两次输入的密码不同',
          type: 'error',
          duration: 2000
        })
      } else {
        this.verify.username = this.user.username
        updatePassword(this.verify).then(() => {
          this.$notify({
            title: '修改成功',
            message: '修改密码成功',
            type: 'success',
            duration: 2000
          })
        })
      }
    },
    handleAvatarSuccess(res, file) {
      this.avatarUrl = URL.createObjectURL(file.raw)
      this.user.avatar = res.data.address
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
    },
    handleProfile() {
      updateAdmin(this.user).then(() => {
        this.$notify({
          title: '成功',
          message: '编辑成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>

<style lang="scss">
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
