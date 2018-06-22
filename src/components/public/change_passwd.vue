<template>
    <div class=" personal_info " style="text-align: left; width: 30%" >
        <el-form ref="form" status-icon :model="form" :rules="checkRules" label-width="80px">
            <el-form-item label="旧密码" prop="old_passwd">
                <el-input type="password" v-model="form.old_passwd"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="new_passwd1">
                <el-input type="password" v-model="form.new_passwd1"></el-input>
            </el-form-item>
            <el-form-item label="再次输入" prop="new_passwd2">
                <el-input type="password" v-model="form.new_passwd2"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">立即修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>

    import checkLogin from '../../modules/checkLogin';
    import getApiPath from '../../modules/getApiPath';
    import Axios from 'axios';

    export default {
        name: "change_passwd",
        data() {
            var validatePasswd = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入旧密码'));
                } else {
                    var userinfo = btoa(JSON.stringify({
                         user_id:   localStorage.getItem('user_id'),
                        password:   this.form.old_passwd
                    }));

                    Axios.post(getApiPath('info/userinfo'), {userinfo})
                        .then((res) => {
                            if (res.status === 200) {
                                return true;
                            }else
                                callback( new Error('旧密码不正确'));
                        }).catch( (err) => {
                           callback( new Error('网络连接错误'));
                           return false;
                    });
                }
            };
            var validateNew1 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新密码'));
                    return false;
                }else {
                    return true;
                }
            };
            var validateNew2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入新密码'));
                    return false;
                } else if( this.form.new_passwd1 !== this.form.new_passwd2 ) {
                    this.$notify({
                           title: '警告',
                         message: '两次输入的新密码不一致',
                        duration: 2500,
                            type: 'warning',
                        position: 'top-left'
                    });
                    return false;

                } else{
                    return true;
                }
            };
            return {
                form: {
                     old_passwd: '',
                    new_passwd1: '',
                    new_passwd2: ''
                },
                checkRules: {
                    old_passwd: [{ validator: validatePasswd, trigger: 'blur' }],
                    new_passwd1: [{ validator: validateNew1,  trigger: 'blur' }],
                    new_passwd2: [{ validator: validateNew2,  trigger: 'blur' }]
                }
            }
        },
        methods: {
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var info = JSON.stringify({
                            user_id: localStorage.getItem('user_id'),
                           password: this.form.new_passwd1
                        });
                        Axios.put(getApiPath('info/changePasswd'), info)
                            .then((res) => {
                                if( res.status === 200)
                                    this.$message({
                                         type: 'success',
                                     duration: 1500,
                                      message: '修改密码成功'
                                    })
                            })
                            .catch( (err) => {
                                this.$message({
                                      type: 'error',
                                  duration: 1500,
                                   message: '网络连接出错'
                                })
                            });
                        return true;
                    } else {
                        return false;
                    }
                });
            }
        },
        beforeMount: function() {
            checkLogin(this);
        }
    }
</script>

<style scoped>

</style>