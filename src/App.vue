<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  //TODO: store the informations of the account in the Vue
export default {
  name: 'App'
}

</script>

<style>
#app {
  font-family: Roboto, Raleway, 'Segoe UI', -apple-system, BlinkMacSystemFont, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', Helvetica, Arial, 'Hiragino Sans GB', 'Noto Sans CJK SC', '思源黑体', 'Source Han Sans SC', '等线', '方正等线', 'Dengxian', 'Microsoft YaHei', 'Wenquanyi Micro Hei', 'WenQuanYi Micro Hei Mono', 'WenQuanYi Zen Hei', 'WenQuanYi Zen Hei', 'Apple LiGothic Medium', 'SimHei', 'ST Heiti', 'WenQuanYi Zen Hei Sharp', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

/*eliminate white border*/
body {
   margin: 0;
   padding: 0;
}

.el-table .warning-row {
    background: #fdf6ec;
}

.el-table .success-row {
    background: #f0f9eb;
}
.el-table .danger-row {
    background: #fef0f0
}
.is-active{
  background-color: #ecf5ff;
}
</style>
