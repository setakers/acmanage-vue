<template>
  <div id="Dashboard">
      <Header></Header>
      <router-view></router-view>
  </div>
</template>

<script>
  import Header from "../public/Header";
  export default {
    name: 'Dashboard',
    components: {Header},
  }
</script>

<style scoped>
</style>
