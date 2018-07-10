<template>
  <div class="bg">
    <div id="login">
      <form :model="loginForm">
        <div class="iconBox">
          <i class="iconIc"></i>
          <input class="loginAdmin" v-model="loginForm.username" @keyup.enter.native="handleLogin" placeholder="请输入用户名"></input>
        </div>
        <div class="iconBox">
          <i class="iconIcTw"></i>
          <input class="loginPass" v-model="loginForm.password" @keyup.enter.native="handleLogin" placeholder="请输入密码" type="password"></input>
        </div>
        <div class="iconBox">
          <i class="iconIcTh"></i>
          <input v-model="inputCode" class="loginPass" placeholder="请输入验证码" type="text"></input>
           <!-- <a id="change"><img :src="codeImg" alt="验证码" title="刷新图片" width="100" height="40" id="c2c98f0de5a04167a9e427d883690ff6" border="0"></a>  -->
          <div class="code" id="checkCode"></div>
          <a id="changeImg" href="#">
            点击获取验证码
          </a>
        </div>

      <div class="passBtn">
        <!-- <el-button style="color: white;" type="text">忘记密码？</el-button>  -->
        <el-checkbox style="color: white;" v-model="checked">记住密码</el-checkbox>
      </div>
      <el-button id="sub" :loading="logining" @click="handleLogin" type="primary" class="submit">登录</el-button>
    </form>
  </div>
</div>
</template>
<script>
export default {
  name: 'login',
  data: () => ({
    logining: false,
    checked: true,
    Verification: '',
    inputCode: '',
    code: '',
    math: '',
    loginForm: {
      username: '',
      password: ''
    },
    codeImg: ''
  }),
  methods: {
    handleLogin() {
      if (this.loginForm.username === '') {
        this.$message.error('用户名不能为空')
        return false
      } else if (this.loginForm.password === '') {
        this.$message.error('用户密码不能为空')
        return false
      } else if (this.inputCode === '') {
        this.$message.error('验证码不能为空')
        return false
      } else if (this.inputCode.toLowerCase() !== this.code.toLowerCase()) {
        this.$message.error('验证码不正确')
      } else if (this.loginForm.username !== '' && this.loginForm.password !== '' && this.inputCode.toLowerCase() === this.code.toLowerCase() && this.inputCode !== '') {
        this.logining = true
        // 请求参数
        const para = {
          admin_name: this.loginForm.username,
          admin_password: this.loginForm.password
        }
        this.axios.post('account-login', para).then(res => {
          this.logining = false
          const {
            code,
            msg,
            data
          } = res.data
          if (code === 1) {
            if (this.checked === true) {
              localStorage.setItem('jzmm', JSON.stringify(this.loginForm))
            }
            // 获取请求返回数据
            localStorage.setItem('user', JSON.stringify(data))
            let permission = JSON.stringify(res.data.permission_list)
            localStorage.setItem('permission_list', permission)
            this.$store.state.app.permission_list = res.data.permission_list
            localStorage.setItem('is_first', data.is_first)
            if (data.is_first) {
              localStorage.setItem('is_first', '2')
              this.$store.state.app.is_first = '2'
            } else {
              localStorage.setItem('is_first', '3')
              this.$store.state.app.is_first = '3'
            }            // 配置默认TOKEN
            this.axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.token
            if (data.is_first) {
              this.$router.push('/changePwd') // 路由指向更改密码
            } else {
              this.$router.push('/guide') // 路由指向引导页
            }
          } else {
            this.$message.error(msg)
          }
        }).catch(error => {
          console.log(this.math)
          console.log(error)
        })
      } else {
        console.log('error submit!!')
        return false
      }
    },
    getCode() {
      this.axios.get('code/' + this.math, {
      }).then(res => {
      })
    }
  },
  mounted() {
    document.onkeydown = function(event) {
      var e = event || window.event
      if (e && e.keyCode === 13) {
        document.getElementById('sub').click()
      }
    }
    if (localStorage.getItem('jzmm')) {
      this.loginForm.username = JSON.parse(localStorage.getItem('jzmm')).username
      this.loginForm.password = JSON.parse(localStorage.getItem('jzmm')).password
    }
    var _this = this
    var code

    function createCode() {
      code = ''
      var codeLength = 4 // 验证码的长度
      var checkCode = document.getElementById('checkCode')
      var codeChars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
      ] // 所有候选组成验证码的字符，当然也可以用中文的
      for (var i = 0; i < codeLength; i++) {
        var charNum = Math.floor(Math.random() * 52)
        code += codeChars[charNum]
      }
      if (checkCode) {
        checkCode.className = 'code'
        checkCode.innerHTML = code
        _this.code = code
      }
    }
    document.getElementById('changeImg').onclick = function() {
      createCode()
    }
    // var lets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'g', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    // var random = Math.round(Math.random() * 25)
    // var a = lets[random]
    // var timestamp = Date.parse(new Date())
    //   _this.math = Math.ceil(Math.random() * 10) + timestamp + a
    // document.getElementById('change').onclick = function() {
    //   var lets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'g', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    //   var random = Math.round(Math.random() * 25)
    //   var a = lets[random]
    //   var timestamp = Date.parse(new Date())
    //   _this.math = Math.ceil(Math.random() * 10) + timestamp + a
    //   var url = 'http://sa.d.weknet.cn/backend/code/'
    //   var urls = url + _this.math
    //   document.getElementById('c2c98f0de5a04167a9e427d883690ff6').src = urls
    // }
    // this.getCode()
  }
}
</script>
<style lang="scss" scoped>
.bg {
    width: 100vw;
    height: 100vh;
    background-image: url("../assets/bg.jpg");
    background-repeat: no-repeat;
}

#login {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 392px;
    margin: -160px 0 0 -180px;
    .iconBox {
        position: relative;
        .iconIc {
            position: absolute;
            background-image: url("../assets/admin.png");
            background-repeat: no-repeat;
            width: 20px;
            height: 20px;
            left: 25px;
            top: 50%;
            margin-top: -10px;
        }
        .iconIcTw {
            position: absolute;
            background-image: url("../assets/passWord.png");
            background-repeat: no-repeat;
            width: 20px;
            height: 21px;
            left: 25px;
            top: 50%;
            margin-top: 6px;
        }
        .iconIcTh {
            position: absolute;
            background-image: url("../assets/key.png");
            background-repeat: no-repeat;
            width: 20px;
            height: 26px;
            left: 25px;
            top: 50%;
            margin-top: 4px;
        }
    }
    .loginAdmin {
        width: 392px;
        border: none;
        height: 45px;
        border-radius: 21px;
        background-color: #FFFFFF;
        text-align: center;
        outline: none;
    }
    .loginPass {
        width: 392px;
        border: none;
        height: 45px;
        border-radius: 21px;
        background-color: #FFFFFF;
        text-align: center;
        outline: none;
        margin-top: 35px;
    }
  }
  .loginAdmin {
    width: 392px;
    border: none;
    height: 45px;
    border-radius: 21px;
    background-color: #FFFFFF;
    text-align: center;
    outline: none;
  }
  .loginPass {
    width: 392px;
    border: none;
    height: 45px;
    border-radius: 21px;
    background-color: #FFFFFF;
    text-align: center;
    outline: none;
    margin-top: 35px;
  }
  #checkCode {
    width: 120px;
    height: 35px;
    position: absolute;
    left: 256px;
    top: 41px;
    text-align: center;
    line-height: 35px;
    color: #21E0F1;
  }
  #changeImg {
    position: absolute;
    left: 265px;
    color: #21E0F1;
    font-size: 14px;
  }
  .passBtn {
    width: 392px;
    height: 71px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .submit {
    width: 270px;
    height: 43px;
    background-color: #21E0F1;
    border: none;
    border-radius: 21px;
    display: block;
    margin: 0 auto;
    outline: none;
    cursor: pointer;
  }
  .prompt {
    text-align: center;
    color: #888;
    .span {
      margin: 0 10px;
      color: #ccc;
      font-family: sans-serif;
      font-size: 14px;
    }
}
</style>
