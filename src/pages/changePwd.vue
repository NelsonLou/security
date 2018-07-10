<template>
<div class="changePwd" id='changePwd' :style="'background: url(' + bgpic + ') no-repeat center center;background-size: cover;height: 100%'">
  <div class="maincontent">
    <el-dialog :close-on-click-modal='false' :close-on-press-escape='false' :show-close='false' title='修改密码' class="card" :visible.sync="My">
      <el-form :model='formData' ref='formData' class='form' label-width="80px">
        <el-form-item label="新密码:" class="form-item">
          <el-input type="password" v-model='formData.admin_password_change' placeholder='请输入新密码'></el-input>
          <span class="tips">密码需要含有大小写字母,数字,特殊字符!@#$%^&:</span>
        </el-form-item>
        <el-form-item>
          <el-button @click='changePwd()' type='primary'>确定</el-button>
          <el-button @click='resetform("formData")'>重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</div>
</div>
</template>
<script>
import bgpic from '@/assets/bgc-pic.jpg'
export default {
  name: 'changePwd',
  data: () => ({
    My: true,
    bgpic: bgpic,
    formData: {
      admin_password: 'dR131^f8',
      admin_password_change: ''
    }
  }),
  methods: {
    changePwd() {
      var bool = this.matchPwd(this.formData.admin_password_change)
      console.log(bool)
      if (bool) {
        this.axios.post(this.$api.system.modifyPwd, {
          admin_password: this.formData.admin_password,
          admin_password_change: this.formData.admin_password_change
        }).then(res => {
          console.log(res)
          this.$message.success(res.data.msg)
          this.$store.state.app.is_first = '3'
          localStorage.setItem('is_first', '3')
          this.$router.push('/guide') // 路由指向引导页
        }).catch(error => {
          console.log(error)
        })
      } else {
        this.$message.error('密码需要8~20位并含有大小写字母,数字,特殊字符!@#$%^&:')
      }
    },
    // 验证
    matchPwd(data) {
      /* eslint-disable */
      if (data.length > 7 && data.length < 21) {
        var regex = /\/|\~|\!|\@|\#|\\$|\%|\^|\&|\*|\(|\)|\_|\+|\{|\}|\:|\<|\>|\?|\[|\]|\,|\.|\/|\;|\'|\`|\-|\=|\\\|\|/
        var str = data.replace(regex, '')
        var xx = /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]/
        if (str !== data) {
          if (xx.test(str)) {
            return true
          }
        }
      }
      return false
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.formData = {
        admin_password: 'dR131^f8',
        admin_password_change: ''
      }
    }
  },
  components: {},
  mounted() {
    const menu = JSON.parse(localStorage.getItem('menu'))
    if (!menu) {
      this.$store.dispatch('handleMenu')
    }
  }
}
</script>
<style lang='scss'>
html {
    height: 100%;
}
body {
    min-height: 100%;
    height: 100%;
}
#app {
    height: 100%;
}
#changePwd {
    border-top: 1px solid white;
    color: white;
    .form {
        background-color: white;
        margin: 0 auto;
    }
    .card {
        margin-top: 200px;
    }
    .tips {
        font-size: 12px;
        color: #777;
    }
}
</style>
