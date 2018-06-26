<template>
  <div class="bg">
      <div id="welcome" class="page" :class="bg">
        <h1>{{greeting}}{{user_name}}</h1>
        <p>欢迎使用现代教学服务管理系统</p>
        <el-button round @click="logout()" style="float:right">退出</el-button>
      </div>
      <div class="page">
        <div class="userbox">
            <span class="username">{{user_name}}</span>
            <div style="display:inline-block;margin:0 10px;">
                <div style="font-size:10pt;color:#999">
                    <span class="male" v-if="userGender">男</span>
                    <span class="female" v-else>女</span>
                </div>
                <div style="font-size:10pt;color:#999">
                    <span v-if="userCharacter!==0">学号：</span>
                    <span v-else>工号：</span>
                    {{userCharacter===0?teacherId:studentId}}
                </div>
            </div>
        </div>
        <p style="text-align:left"><div class="entry">Email</div>{{userEmail}}</p>
        <p style="text-align:left"><div class="entry">电话号码</div>{{userPhone}}</p>
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
                bg: 'morning'
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
        },
        computed: {
            greeting() {
                var hour = new Date().getHours();
                if(hour >= 5 && hour < 11) {
                    this.bg = 'morning';
                    return '早上好！';
                } else if(hour >= 11 && hour < 14) {
                    this.bg = 'noon';
                    return '午安，'
                } else if(hour >= 14 && hour < 19) {
                    this.bg = 'evening';
                    return '下午好，'
                } else if(hour >= 19 && hour < 24) {
                    this.bg = 'evening';
                    return '晚上好，';
                } else {
                    this.bg = 'night';
                    return '晚安，';
                }
            }
        }
    }
</script>

<style scoped>
.bg {
    background: #f5f5f5;
    position: fixed;
    width: 100%;
    height: 100vh;
    text-align: center;
}

#welcome {
    height: 200px;
}

.bg .morning {
    background-image: url('../../assets/morning.jpg');
    background-size: cover;
}

.bg .noon {
    background-image: url('../../assets/noon.jpg');
    background-size: cover;
}

.bg .evening {
    background-image: url('../../assets/evening.png');
    background-size: cover;
}

.bg .night {
    background-image: url('../../assets/night.jpg');
    background-size: cover;
}

#welcome h1, #welcome p {
    color: white;
    text-shadow: 0px 0px 8px rgba(0,0,0,0.4);
}

.page {
    width: 80%;
    max-width: 640px;
    padding: 20px 40px;
    height: fit-content;
    background: white;
    margin: 10px auto;
    box-shadow: 1px 2px 4px rgba(0,0,0,0.2);
    text-align: left;
    transition: 0.4s;
}

.page:hover {
    box-shadow: 1px 4px 16px rgba(0,0,0,0.3);
}

.userbox .username {
    display: inline-block;
    font-size: 25pt;
    font-weight: bold;
}

.male {
    border-width: 1px;
    border-style: solid;
    border-color: #00BCD4;
    background: #4DD0E1;
    color: white;
    padding: 2px 3px;
    border-radius: 5px;
}

.female {
    border-width: 1px;
    border-style: solid;
    border-color: #E91E63;
    background: #F06292;
    color: white;
    padding: 2px 3px;
    border-radius: 5px;
}

.entry {
    display: inline-block;
    width: 100px;
    font-weight: bold;
}
</style>
