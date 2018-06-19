<template>
  <div id="container">

    <div class="sidebar" v-if=" selected !== 'welcome_sys' ">
      <el-menu :default-active="active_key"
               class="el-menu-vertical-demo"
               unique-opened
               @select="handleSelect">
        <template v-for=" (funcs, index) in subsys[selected][role]">
            <el-menu-item  :id=" 'sub' + index" :index="index + '' ">
              <i :class="funcs.icon"></i>
              {{ funcs.title }}
            </el-menu-item>
        </template>
      </el-menu>
    </div>

    <div class="content" v-if=" selected !== 'welcome_sys' ">
      <personal_info v-if=" func_path === 'person_info' "></personal_info>
      <deal_publicity v-if=" func_path === 'deal_publicity' "></deal_publicity>
      <stu_query_score v-if=" func_path === 'stu_query_score' "></stu_query_score>
      <query_exam v-if=" func_path === 'query_exam' "></query_exam>
    </div>

    <template v-if=" selected === 'welcome_sys' ">
      <welcome></welcome>
    </template>

  </div>
</template>

<script>
    import subsys from '../navigation/Subsystems'
    import Personal_info from "./personal_info";
    import Welcome from "./Welcome";
    import Deal_publicity from "./deal_publicity";
    import Stu_query_score from "./stu_query_score";
    import Query_exam from "./query_exam";

    export default {
      name: "Container",
        components: {Query_exam, Stu_query_score, Deal_publicity, Welcome, Personal_info},
        props: ['selected'],
      data: function(){
          // var role = localStorage.roles;
          let role = 'student';

          return {
            subsys: subsys,
              role: role,
         func_path: '',
        active_key: '0'
          };
      },
      methods:{
          handleSelect(key){
                this.active_key = key;
          }
      },
      watch: {
          selected: function(){
              this.active_key = '0';
              let key = parseInt(this.active_key);
              this.func_path = subsys[this.selected][this.role][key].path;
          },
          active_key: function(){
              let key = parseInt(this.active_key);
              this.func_path = subsys[this.selected][this.role][key].path;
          }
      },
      mounted(){
          let key = parseInt(this.active_key);
          this.func_path = subsys[this.selected][this.role][key].path;
      }

    }
</script>

<style scoped>
  .content{
    background: none repeat scroll 0 0 #F6F6F6;
    position: absolute;
    left: 200px;
    right: 0;
    top: 60px;
    bottom: 0;
    width: auto;
    padding: 40px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow-y: scroll;
  }
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
