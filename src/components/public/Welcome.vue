<template>
  <div>
      <div class="page">
        <p>This is the user panel!</p>
        <p style="text-align:left"><b>User_name:</b> {{user_name}}</p>
        <p style="text-align:left"><b>User user_id:</b> {{userId}}</p>
        <p style="text-align:left"><b>User character:</b> {{userCharacter}}</p>
        <p style="text-align:left"><b>User gender:</b> {{userGender}}</p>
        <p style="text-align:left"><b>User email:</b> {{userEmail}}</p>
        <p style="text-align:left"><b>User phone:</b> {{userPhone}}</p>
        <p style="text-align:left"><b>studentid:</b> {{studentId}}</p>
        <p style="text-align:left"><b>teacherid:</b> {{teacherId}}</p>
        <p style="word-break:break-all;text-align:left"><b>Access token</b>: {{accessToken}}</p>
        <el-button type="primary" round @click="logout()">退出</el-button>
      </div>
  </div>
</template>

<script>
    import Axios from 'axios';
    import getApiPath from '../../modules/getApiPath';
    import checkLogin from '../../modules/checkLogin';

    export default {
        name: "Welcome",
        data() {
            return {
                user_name: localStorage.user_name,
                userId: localStorage.user_id,
                userCharacter: localStorage.character,
                userGender: localStorage.gender,
                userEmail: localStorage.email,
                userPhone: localStorage.phone,
                studentId: localStorage.student_id,
                teacherId: localStorage.teacher_id,

                accessToken: localStorage.accessToken,
            }
        },
        methods: {
            logout() {
                localStorage.clear();
                this.$router.push({name: 'Login'});
            }
        },
        beforeMount: function () {
            checkLogin(this);
        }
    }
</script>

<style scoped>
.page {
    
}
</style>
