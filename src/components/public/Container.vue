<template>
  <div id="container">
    <Sidebar></Sidebar>
    <div class="allconent">
      <transition name="move" mode="out-in"><router-view></router-view></transition>
    </div>
  </div>
</template>

<script>
    import Sidebar from "./Sidebar";
    export default {
      name: "Container",
      components: {Sidebar}
    }
</script>

<style scoped>
  .allconent{
    background: none repeat scroll 0 0 #F9FAFC;
    position: absolute;
    left: 200px;
    right: 0;
    top: 60px;
    bottom: 0;
    width: auto;
    padding: 20px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow-y: scroll;
  }
</style>
