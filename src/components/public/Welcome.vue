<template>
    <div>
        <p>This is the user panel!</p>
        <p style="text-align:left"><b>Username:</b> {{username}}</p>
        <p style="text-align:left"><b>User roles:</b> {{userRoles}}</p>
        <p style="word-break:break-all;text-align:left"><b>Access token</b>: {{accessToken}}</p>
        <el-button type="primary" round @click="logout()">退出</el-button>
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
                username      : localStorage.username,
                userRoles     : localStorage.roles,
                accessToken   : localStorage.accessToken,
            }
        },
        methods: {
            logout() {
                localStorage.clear();
                this.$router.push({ name: 'Login' });
            }
        },
        beforeCreate: function(){
            checkLogin(this);
        }
    }
</script>

<style scoped>

</style>
