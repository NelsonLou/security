<template>
<div id="header" :style="'background: url('+ img +') no-repeat center center'">
  <!-- 企业名称 -->
  <div class="logo-info">
    <!-- <img class="logo" src=""> -->
    <div class="name" :style="'background: url('+ imgtext +') no-repeat center center;background-size: contain'"></div>
    <!-- <p class="name"> 网络安全管理系统 <span> www.wangan.com </span> </p> -->
  </div>
  <!-- 登录信息 -->
  <div class="login-info"> 欢迎您,
    <el-dropdown>
      <strong class="user"> {{ userName }} </strong>
      <el-dropdown-menu slot="dropdown">
        <!-- <el-dropdown-item @click.native="modifyPwdVisible = true"> 修改密码 </el-dropdown-item> -->
        <el-dropdown-item @click.native="handleLogout"> 退出系统 </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
  <el-button @click.native="modifyPwdVisible = true" class="changePWD" type='primary' size='mini'>修改密码</el-button>
  <!-- 修改密码 -->
  <wk-modify-pwd :visible="modifyPwdVisible" @close="modifyPwdVisible = false"></wk-modify-pwd>
</div>
</template>
<script>
import img from '@/assets/header.png'
import imgtext from '@/assets/title.png'
import WkModifyPwd from '@/components/ModifyPwd'

export default {
  name: 'header',
  components: {
    WkModifyPwd
  },
  data: () => ({
    img: img,
    imgtext: imgtext,
    userName: '',
    modifyPwdVisible: false
  }),
  mounted() {
    // 获取用户昵称
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      this.userName = user.admin_nick || ''
    }
  },
  methods: {
    // 用户退出
    handleLogout() {
      this.$confirm('您确认退出吗?', '提示', {
        type: 'warning'
      }).then(() => {
        // this.axios.post(this.$api.system.logout).then(res => {
        //   const {
        //     code,
        //     msg
        //   } = res.data
        //   if (code === 1) {
        this.$store.dispatch('handleResetMenu') // 重置菜单
        this.$router.push('/login') // 路由指向登录页
        //   } else {
        //     this.$message.error(msg)
        //   }
        // }).catch(error => {
        //   console.log(error)
        // })
      }).catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
#header {
    overflow: hidden;
    color: #fff;
    //border-bottom: 4px solid #F7BA2A;
    border-bottom: 1px solid #3E92F2;
    // background-color: #324057;
    .changePWD {
        float: right;
        margin-right: 100px;
        margin-top: 19px;
    }
    .logo-info {
        float: left;
        width: 248px;
        height: 64px;
        .logo {
            float: left;
            width: 40px;
            height: 40px;
            margin: 10px 20px;
        }
        .name {
            float: left;
            width: 168px;
            height: 100%;
            margin-left: 20px;
            line-height: 20px;
        }
    }
    .login-info {
        float: right;
        height: 60px;
        padding-right: 20px;
        text-align: right;
        line-height: 60px;
        .user {
            display: block;
            margin: 0 8px;
            cursor: pointer;
            color: #fff;
        }
    }
}
</style>
