<template>
    <div class=" personal_info " style="text-align: left; width: 30%" >
        <el-form ref="form" :model="form" :rules="checkRules" label-width="80px">
            <el-form-item label="用户名" prop="user_name">
                <el-input v-model="form.user_name"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
                <el-select v-model="form.gender" placeholder="请选择性别">
                    <el-option label="男" value='0'></el-option>
                    <el-option label="女" value='1'></el-option>
                    <el-option label="双性" value='2'></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="email" prop="email">
                <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item label="phone" prop="phone">
                <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">立即修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>

    import checkLogin from '../../../modules/checkLogin';
    import getApiPath from '../../../modules/getApiPath';
    import Axios from 'axios';

    export default {
        name: "change_info",
        data() {
            var validateUser = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入用户名'));
                } else {
                    // this should be implemented with a query
                    Axios.get(getApiPath('login/userquery/' + value))
                        .then((res) => {
                            if(res.status !== 200) callback(new Error('请输入正确的工号或学号'));
                            else callback();
                        })
                        .catch((err) => {
                            callback(new Error('无法连接到服务器'));
                        });
                }
            };
            var validateEmail = (rule, value, callback) => {
                if( value === '')
                    callback();
                else{
                    let reg=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/;
                    if( !reg.test(value) ) {
                        callback(new Error("邮箱格式不正确"));
                    }
                    else
                        callback();
                }
            };
            var validatePhone = (rule, value, callback) => {
                if( value === '')
                    callback();
                else{
                    let reg=/^1(3|4|5|7|8)\d{9}$/;
                    if( !reg.test(value) ) {
                        callback(new Error("手机号不正确"));
                    }
                    else
                        callback();
                }
            };
            return {
                form: {
                    user_name: localStorage.getItem('user_name'),
                    gender: localStorage.getItem('gender'),
                    email: localStorage.getItem('email'),
                    phone: localStorage.getItem('phone')
                },
                checkRules: {
                    user_name: [{validator: validateUser, trigger: 'blur'}],
                    email: [{validator: validateEmail, trigger: 'blur'}],
                    phone: [{validator: validatePhone, trigger: 'blur'}],
                },
            }
        },
        methods: {
            onSubmit(formName) {
                // console.log(this.form.user_name);
                // console.log(typeof this.form.gender);
                // console.log(this.form.email);
                // console.log(this.form.phone);

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var info = {
                            user_id: localStorage.getItem('user_id'),
                            user_name: this.form.user_name,
                            gender: parseInt(this.form.gender),
                            email: this.form.email,
                            phone: this.form.phone
                        };

                        Axios.put(getApiPath('info/userinfo'), info)
                            .then((res) => {
                                if(res.status === 200) {
                                    for( prop in this.form)
                                        localStorage.setItem(prop, this.form[prop]);
                                    this.$message(
                                        {
                                              type: 'success',
                                          duration: 1500,
                                           message: '个人信息修改成功'
                                        }
                                    );
                                } else {
                                    this.$message(
                                        {
                                            type: 'error',
                                            duration: 1500,
                                            message: '个人信息修改失败'
                                        }
                                    );
                                    return false;
                                }
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