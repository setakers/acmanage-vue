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
      <el-menu-item index="41" id="system_name">现代教学服务管理系统</el-menu-item>

      <template v-for="(sys, index) of systems">
          <el-menu-item :index=" index + '' ">{{ sys.name }}</el-menu-item>
      </template>

      <el-menu-item index="42" id="user_setting">
        <el-dropdown id="dropdown">
            <span>
              <img id="user_logo" src="../../assets/mylogo.jpg">
              <a id="user_id">Student1</a>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人设置</el-dropdown-item>
              <el-dropdown-item>修改资料</el-dropdown-item>
              <el-dropdown-item>导航测试</el-dropdown-item>
              <el-dropdown-item disabled>无效测试</el-dropdown-item>
              <el-dropdown-item divided>安全退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
      </el-menu-item>

    </el-menu>
  </div>
</template>

<script>
  import * as sys from '../navigation/navigation';

  export default {
    name: 'Header',
    data: function () {
      //TODO: choose systems according to the account type
      var systems = sys.STU_FUNC;
      return {
        activeIndex: '41',
        systems: systems
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        key = parseInt(key);
        if( key !== 41 && key !== 42 )
          this.$router.push(  '/dashboard/' + this.systems[key].path);
        else if ( key === 41)
          this.$router.push('/dashboard');
      }
    }
  };
</script>

<style scoped>
  #system_name{
    font-size: 1.3em;
  }
  #user_setting{
    position: absolute;
    align-items: center;
    right: 0px;
  }
  #user_logo{
    width: 50px;
    height: 50px;
    border-radius: 100%;
    margin-right: 10px;
    vertical-align: middle;
  }
  #user_id{
    color: white;
    font-size: 1.3em;
  }

</style>
