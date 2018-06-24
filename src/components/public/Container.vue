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
      <!--personal_info_sys-->
      <personal_info v-if=" func_path === 'person_info' "></personal_info>
      <change_info v-if=" func_path === 'change_info' "></change_info>
      <change_passwd v-if=" func_path === 'change_passwd' "></change_passwd>

      <!--score_sys-->
      <deal_publicity v-if=" func_path === 'deal_publicity' "></deal_publicity>
        <!--student-->
        <query_exam v-if=" func_path === 'query_exam' "></query_exam>
        <stu_query_score v-if=" func_path === 'stu_query_score' "></stu_query_score>
        <!--teacher-->
        <teach_query_score v-if=" func_path === 'teach_query_score' "></teach_query_score>
        <input_score v-if=" func_path === 'input_score' "></input_score>
        <apply_score_change v-if=" func_path === 'apply_score_change' "></apply_score_change>
        <!--admin-->
        <deal_score_change v-if=" func_path === 'deal_score_change' "></deal_score_change>


      <!--select_sys-->
        <!--student-->
        <stu_select v-if="  func_path === 'stu_select'" ></stu_select>
        <select_status v-if=" func_path === 'select_status' "></select_status>
        <query_course v-if="  func_path === 'query_course' "></query_course>
        <personal_table v-if=" func_path === 'personal_table' "></personal_table>
        <!--teacher-->
        <teach_courses v-if=" func_path === 'teach_courses' "></teach_courses>
        <course_students v-if=" func_path === 'course_students' "></course_students>
        <apply_course v-if=" func_path === 'apply_course' "></apply_course>
        <open_course_status v-if=" func_path === 'open_course_status' "></open_course_status>
        <!--admin-->
        <deal_select v-if=" func_path === 'deal_select' "></deal_select>
        <deal_course_apply v-if=" func_path === 'deal_course_apply' "></deal_course_apply>

      <!--resource_sys-->
      <rent_course_publicity v-if=" func_path === 'rent_course_publicity' "></rent_course_publicity>
        <!--stu_teach-->
        <rent_course v-if=" func_path === 'rent_course' "></rent_course>
        <!--admin-->
        <manage_courses v-if=" func_path === 'manage_courses'"></manage_courses>
        <manage_classrooms v-if=" func_path === 'manage_classrooms'"></manage_classrooms>
        <deal_course_rent v-if=" func_path === 'deal_course_rent'"></deal_course_rent>

      <!--account_sys-->
        <manage_accounts v-if=" func_path === 'manage_accounts' "></manage_accounts>
        <change_role v-if=" func_path === 'change_role' "></change_role>
        <query_account v-if=" func_path === 'query_account' "></query_account>

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
    import Teach_courses from "./Select/teacher/teach_courses";
    import Course_students from "./Select/teacher/course_students";
    import Apply_course from "./Select/teacher/apply_course";
    import Open_course_status from "./Select/teacher/open_course_status";
    import Deal_select from "./Select/admin/deal_select";
    import Deal_course_apply from "./Select/admin/deal_course_apply";
    import Manage_accounts from "./Account/manage_accounts";
    import Change_role from "./Account/change_role";
    import Query_account from "./Account/query_account";
    import Rent_course from "./Resource/stu_teach/rent_course";
    import Rent_course_publicity from "./Resource/rent_course_publicity";
    import Manage_courses from "./Resource/admin/manage_courses";
    import Manage_classrooms from "./Resource/admin/manage_classrooms";
    import Deal_course_rent from "./Resource/admin/deal_course_rent";

    export default {
      name: "Container",
        components: {
            Deal_course_rent,
            Manage_classrooms,
            Manage_courses,
            Rent_course_publicity,
            Rent_course,
            Query_account,
            Change_role,
            Manage_accounts,
            Deal_course_apply,
            Deal_select,
            Open_course_status,
            Apply_course,
            Course_students,
            Teach_courses,
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
          // var role = 'admin';
          let map = {0: 'student', 1: 'teacher', 2: 'admin'};
          let role = map[localStorage.getItem('character')];

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
