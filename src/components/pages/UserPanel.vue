<template>
  <div id="Dashboard">
      <Header @selected="handleSelect"></Header>
      <container :selected="selected"></container>
  </div>
</template>

<script>
  import Header from "../public/Header";
  import Container from "../public/Container";
  export default {
    name: 'Dashboard',
    data: function(){
        return {
            selected: 'welcome_sys'
        }
    },
    components: {Container, Header},
      methods: {
          handleSelect: function (selected) {
              this.selected = selected;
          }
      }
  }
</script>

<style scoped>
</style>
