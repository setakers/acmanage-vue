<template>
    <div class=" personal_info " style="text-align: left; width: 30%" >
        <el-form ref="form" :model="form" :rules="checkRules" label-width="80px">
            <el-form-item label="课程名" prop="course_name">
                <el-input v-model="form.course_name"></el-input>
            </el-form-item>
            <el-form-item label="学分" prop="credit">
                <el-input v-model="form.credit"></el-input>
            </el-form-item>
            <el-form-item label="课程简介" prop="introduction">
                <el-input v-model="form.introduction"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="classroom_id">
                <el-select v-model="form.classroom_id" placeholder="选择教室">
                    <template v-for=" room in rooms">
                        <el-option :label=" room.room_name + ' ---- 容量:' + room.capacity " :value='room.classroom_id'></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">申请开课</el-button>
                <el-button @click="resetForm('form')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>

    import checkLogin from '../../../../modules/checkLogin';
    import getApiPath from '../../../../modules/getApiPath';
    import Axios from 'axios';

    export default {
        name: "apply_course",
        data() {
            var validateName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入课程名'));
                } else {
                    callback();
                }
            };
            var validateCredit = (rule, value, callback) => {
                if( value === '')
                    callback(new Error('请输入学分'));
                else{
                    var reg = /^\d+(\.\d+)?$/;
                    if( !reg.test(value) )
                        callback(new Error('学分格式不正确'));
                    else
                        callback();
                }
            };
            var validateIntro = (rule, value, callback) => {
                if( value === '')
                    callback(new Error('请输入课程简介'));
                else{
                    callback();
                }
            };
            var validateRoom = ( rule, value, callback) => {
                if( value === null || value === '')
                    callback(new Error('请选择教室'));
                else
                    callback();
            };
            return {
                form: {
                    course_name: '',
                    credit: null,
                    introduction: '',
                    classroom_id: null
                },
                checkRules: {
                    course_name: [{validator: validateName, trigger: 'blur'}],
                    credit: [{validator: validateCredit, trigger: 'blur'}],
                    introduction: [{validator: validateIntro, trigger: 'blur'}],
                    classroom_id: [{validator: validateRoom, trigger: 'blur'}]
                },
                rooms: [
                    {
                        classroom_id: 250,
                        room_name: '东3-200',
                        capacity: 100
                    }
                ]
            }
        },
        methods: {
            onSubmit(formName) {
                if(this.rooms.length === 0) {
                    this.$notify({
                        type: 'warning',
                        duration: 2000,
                        message: '当前没有空闲教室，无法开课'
                    });
                    return;
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var open_info = {
                            teacher_id:  localStorage.getItem('teacher_id'),
                            course_name:  this.form.course_name,
                            credit:  this.form.credit,
                            introduction:  this.form.introduction,
                            classroom_id:  this.form.classroom_id,
                            state: 2
                        );

                        Axios.post(getApiPath('select/open_course'), open_info)
                            .then((res) => {
                                if(res.status === 200) {
                                    this.$refs[formName].resetFields();
                                    this.$message(
                                        {
                                            type: 'success',
                                            duration: 1500,
                                            message: '申请开课成功'
                                        }
                                    );
                                } else {
                                    this.$message(
                                        {
                                            type: 'error',
                                            duration: 1500,
                                            message: '申请开课失败'
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
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        },
        beforeMount: function() {
            checkLogin(this);

            Axios.get(getApiPath("select/freerooms"))
                .then(　(res) => {
                    if(res.status === 200)
                        this.rooms = res.data['rooms'];
                    else {
                        this.$notify({
                            type: 'warning',
                            duration: 2000,
                            message: '当前没有空闲教室，无法开课'
                        });
                        this.rooms = [];
                    }
                })
                .catch( (err) => {
                    this.$message({
                        type: 'error',
                        duration: 1500,
                        message: '获取空闲教室列表失败，前检查网络连接'
                    })
                })
        }
    }
</script>

<style scoped>

</style>