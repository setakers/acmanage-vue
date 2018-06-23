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

      <!--score_sys-->
      <deal_publicity v-if=" func_path === 'deal_publicity' "></deal_publicity>
      <stu_query_score v-if=" func_path === 'stu_query_score' "></stu_query_score>
      <query_exam v-if=" func_path === 'query_exam' "></query_exam>
      <teach_query_score v-if=" func_path === 'teach_query_score' "></teach_query_score>
      <input_score v-if=" func_path === 'input_score' "></input_score>
      <apply_score_change v-if=" func_path === 'apply_score_change' "></apply_score_change>
      <deal_score_change v-if=" func_path === 'deal_score_change' "></deal_score_change>
      <change_info v-if=" func_path === 'change_info' "></change_info>
      <change_passwd v-if=" func_path === 'change_passwd' "></change_passwd>

      <!--select_sys-->
      <stu_select v-if="  func_path === 'stu_select'" ></stu_select>
      <select_status v-if=" func_path === 'select_case' "></select_status>
      <query_course v-if="  func_path === 'query_course' "></query_course>
      <personal_table v-if=" func_path === 'personal_table' "></personal_table>
    </div>

    <template v-if=" selected === 'welcome_sys' ">
      <welcome></welcome>
    </template>

  </div>
</template>

<script>
    import subsys from '../navigation/Subsystems'

    import Welcome from "./Welcome";

    import Deal_publicity from "./score/deal_publicity";
    import Stu_query_score from "./score/student/stu_query_score";
    import Query_exam from "./score/student/query_exam";
    import Teach_query_score from "./score/teacher/teach_query_score";
    import Input_score from "./score/teacher/input_score";
    import Apply_score_change from "./score/teacher/apply_score_change";
    import Deal_score_change from "./score/admin/deal_score_change";

    import Personal_info from "./info/personal_info";
    import Change_info from "./info/change_info";
    import Change_passwd from "./info/change_passwd";
    import Stu_select from "./Select/student/stu_select";
    import Select_status from "./Select/student/select_status";
    import Query_course from "./Select/student/query_course";
    import Personal_table from "./Select/student/personal_table";

    export default {
      name: "Container",
        components: {
            Personal_table,
            Query_course,
            Select_status,
            Stu_select,
            Change_passwd,
            Change_info,
            Deal_score_change,
            Apply_score_change,
            Input_score,
            Teach_query_score, Query_exam, Stu_query_score, Deal_publicity, Welcome, Personal_info},
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
