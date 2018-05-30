<template>
  <div class="login-box">
    <div>
      <p class="big-head">SE Takers 教务管理系统</p>
    </div>
    <div class="login-form">
      <el-form :model="userInfo" status-icon :rules="checkRules" ref="loginForm" label-width="75px">
        <el-form-item label="ID" prop="id">
          <el-input v-model="userInfo.id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input v-model="userInfo.pass" type="password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary button submit" @click="submitForm('loginForm')">登录</el-button>
          <el-button type="secondary" @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// This is a function. The function returns the API URL
import getApiPath   from '../modules/getApiPath';
// This function returns a timestamp
import getTimestamp from '../modules/getTimestamp';
import Axios from 'axios';
export default {
  name: "Login",
  data() {
    var validateUser = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入工号或学号'));
      } else {
        // this should be implemented with a query
        Axios.get(getApiPath('login/userquery/' + value))
        .then((res) => {
          if(res.status !== 200) callback(new Error('请输入正确的工号或学号'));
          else callback();
        })
        .catch((err) => {
          callback(new Error('无法连接到服务器'));
        });
      }
    };
    return {
      userInfo: {
        id: '',
        pass: ''
      },
      checkRules: {
        id: [ { validator: validateUser, trigger: 'blur' }]
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.userInfo.pass === '') {
            this.$message({
              message:  '请输入密码',
              type:     'warning'});
            return false;
          }
          // First, POST the username and password
          var userinfo = btoa(JSON.stringify({
            username:   this.userInfo.id,
            password:   this.userInfo.pass,
            timestamp:  getTimestamp()
          }));
          Axios.post(getApiPath('login/userinfo'), {userinfo})
            .then((res) => {
              // Next,
              // Login success
              if(res.status === 200) {
                // Store the JWT and role to the local storage
                for(let prop in res.data) {
                  localStorage.setItem(prop, res.data[prop]);
                }
                localStorage.setItem('username', this.userInfo.id);
                // Set the authorization header
                Axios.defaults.headers.common['authorization']
                  = localStorage['accessToken'];
                // Jump to the control panel
                this.$router.push({ name: 'UserPanel'});
              } else { // Login failure
                this.$message.error('密码错误');
                return false;
              }
            });
            return true;
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
  beforeCreate() {
    var gotoPanel = () => {
      this.$router.push({ name: 'UserPanel' });
    }
    var cleanUp = () => {
      localStorage.clear();
      delete Axios.defaults.headers.common['authorization'];
    }
    // Default navigation behavior
    if(localStorage.getItem('accessToken')) {
      // Set the authorization
      Axios.defaults.headers.common['authorization']
        = localStorage['accessToken'];
      Axios.get(getApiPath('login/auth'))
        .then((res) => {
          if(res.status === 200) gotoPanel();
          else cleanUp();
        });
    } else cleanUp();
  }
};
</script>

<style scoped>
.big-head {
  font-size: 20pt;
}
.login-box {
  width: 100%;
}
.login-form {
  width: 500px;
  margin-left: auto;
  margin-right: auto;
}
</style>
