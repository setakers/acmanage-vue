<template>
  <div class="sidebar">
    <el-menu :default-active="$route.path"
             class="el-menu-vertical-demo"
             unique-opened
             router
    >
      <template v-for="bitem in billitem">
        <template v-if="bitem.sublist">
          <el-submenu  :index="bitem.index">
            <template slot="title"><i  :class="bitem.icon"></i>{{ bitem.title }}</template>
            <el-menu-item  v-for="(subitem, index) in bitem.sublist" :index=" url + subitem.path " :key="index"  >
              {{ subitem.title }}
            </el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item  :index=" url + bitem.path">
            <i :class="bitem.icon"></i>
            {{bitem.title}}
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
  import * as subsys from '../navigation/subsystems'

  export default {
    name: 'Sidebar',
    data: function () {
      return {
        billitem: subsys.BILLITEM,
        personal: subsys.PERSONAL,
        //TODO: change the url
        url: '/dashboard/score_sys'
      }
    },
    computed: {
      // onRoutes: function () {
      //   return this.$route.path.replace('/','');  //$route.path表示当前路由，:index能直接跳转路由
      // }
    }
  }
</script>

<style scoped>
  .sidebar{
    position: absolute;
    display: block;
    width: 200px;
    top: 60px;
    left: 0;
    bottom: 0;
  }
  .sidebar > ul {
    height:100%;
  }
</style>
