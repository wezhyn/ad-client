<template>
  <div class="activity-container">
    <el-form ref="postForm" :model="postForm" :rules="rules">
      <sticky :z-index="10" class-name="sub-navbar">
        <el-button v-loading="loading" size="mini" type="success" @click="submitForm">发布</el-button>
        <el-button v-loading="loading" size="mini" type="warning" @click="draftForm">草稿</el-button>
      </sticky>

      <div class="activity-main-container">
        <el-form-item prop="title">
          <MDinput v-model="postForm.title" :maxlength="100" name="name" required>标题</MDinput>
        </el-form-item>

        <el-form-item prop="content">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
import Tinymce from '@/components/Tinymce'
import Sticky from '@/components/Sticky'
import { getActivityById, createActivity, editActivity } from '@/api/activity'

const defaultForm = {
  status: 'draft',
  title: '',
  content: '',
  id: undefined
}

export default {
  name: 'ActivityDetail',
  components: { MDinput, Sticky, Tinymce },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }]
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
  },
  methods: {
    fetchData(id) {
      getActivityById(id).then(response => {
        this.postForm = response.data.to
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setPageTitle() {
      const title = 'Edit News'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            editActivity(this.postForm).then(() => {
              this.$notify({
                title: '成功',
                message: '编辑活动成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            createActivity(this.postForm).then(() => {
              this.$notify({
                title: '成功',
                message: '发布活动成功',
                type: 'success',
                duration: 2000
              })
            })
          }
          this.postForm.publish = true
          this.loading = false
        } else {
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      if (this.isEdit) {
        editActivity(this.postForm).then(() => {
          this.$notify({
            title: '成功',
            message: '编辑草稿成功',
            type: 'success',
            duration: 2000
          })
        })
      } else {
        createActivity(this.postForm).then(() => {
          this.$notify({
            title: '成功',
            message: '保存草稿成功',
            type: 'success',
            duration: 2000
          })
        })
      }
      this.postForm.publish = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.activity-container {
  position: relative;
  .activity-main-container {
    padding: 40px 45px 20px 50px;
    .image {
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      position: absolute;
    }
  }
}
</style>

<style lang="scss">
.el-form-item__label {
  text-align: left;
}
.el-form-item__content {
  line-height: 0px !important;
}
.sub-navbar {
  height: 50px;
  line-height: 50px;
  position: relative;
  width: 100%;
  text-align: right;
  padding-right: 20px;
  transition: 600ms ease position;
  background: #eee;
  .subtitle {
    font-size: 20px;
    color: #fff;
  }
}
</style>
