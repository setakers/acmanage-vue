<template>
  <div class="Header">
    <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
      <el-menu-item index="41" id="system_name" disabled><a>现代教学服务管理系统</a></el-menu-item>

      <template v-for="(sys, index) of systems">
        <el-menu-item :index=" index + '' " class="sys">{{ sys.title }}</el-menu-item>
      </template>

      <el-menu-item index="42" id="user_setting">
        <el-dropdown id="dropdown" @command="handleCommand">
            <span>
              <img id="user_logo" src="../../assets/mylogo.jpg">
              <a id="user_id">{{ user_name }}</a>
            </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item disabled>个人设置</el-dropdown-item>
            <el-dropdown-item disabled>修改资料</el-dropdown-item>
            <el-dropdown-item disabled>暂无移动端</el-dropdown-item>
            <el-dropdown-item divided command="logout">安全退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
    import sys from '../navigation/Navigations';
    import Axios from 'axios';

    export default {
        name: 'Header',
        data: function () {
            //get info from localstorage
            let user_name = localStorage.getItem('user_name');
            var map = {0: 'student', 1: 'teacher', 2: 'admin'};
            let userrole = map[localStorage.getItem('character')];
            // let userrole = 'admin';
            let system = sys[userrole];

            return {
                user_name: user_name,
                userrole: userrole,
                systems: system,
                activeIndex: '0',
            };
        },
        methods: {
            handleSelect(key) {
                key = parseInt(key);
                if (key !== 41 && key !== 42)
                    this.$emit('selected', this.systems[key].path);
            },
            handleCommand(){
              this.gotoLogin();
            },
            gotoLogin(){
                localStorage.clear();
                delete Axios.defaults.headers.common['authorization'];
                this.$message({
                    type: 'warning',
                    duration: 3000,
                    message: '注销成功'
                });
                this.$router.push({ name: 'Login' });
            }
        }
    };
</script>

<style scoped>
  #system_name {
    font-size: 1.3em;
  }

  .el-menu-item.is-disabled {
    opacity: 1.0;
  }

  .el-menu-item.is-disabled a {
    color: rgb(255, 208, 75);
  }

  #user_setting {
    position: absolute;
    align-items: center;
    right: 15px;
  }

  #user_logo {
    width: 50px;
    height: 50px;
    border-radius: 100%;
    margin-right: 10px;
    vertical-align: middle;
  }

  #user_id {
    color: white;
    font-size: 1.3em;
  }

  .sys {
    width: 8%;
  }
</style>
