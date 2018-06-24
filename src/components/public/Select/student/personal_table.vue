<template>
    <div class="personal_table">
        <el-card class="box-card"
                 v-loading="loading"
                 element-loading-text="拼命加载中"
                 element-loading-spinner="el-icon-loading"
                 element-loading-background="rgba(0, 0, 0, 0.8)">
            <div slot="header" class="clearfix">
                <h2>您当前一共有&nbsp;{{ courses.length }}&nbsp;门课程</h2>
            </div>
            <div class="text item">
                <el-table
                        :data="courses"
                        style="width: 100%;"
                        stripe
                        align="center">
                    <el-table-column align="center" type="index"></el-table-column>
                    <el-table-column
                            align="center"
                            prop="course_id"
                            label="课程号">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="course_name"
                            label="课程名">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="credit"
                            label="学分"
                            sortable>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="room_name"
                            label="上课地点">
                    </el-table-column>
                    <el-table-column
                            min-width="300px"
                            align="center"
                            prop="introduction"
                            label="课程简介">
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
</template>

<script>
    import Axios from 'axios';
    import getApiPath from '../../../../modules/getApiPath';
    import checkLogin from '../../../../modules/checkLogin';

    export default {
        name: "personal_table",
        data(){
            return {
                courses: [ ],
                loading: false
            }
        },
        beforeMount: function(){
            checkLogin(this);
            this.loading = true;
            Axios.get(getApiPath('select/selected/' + localStorage.getItem('student_id')))
                .then((res) => {
                    if(res.status !== 200)
                        this.$message({
                            type: 'error',
                            duration: 1500,
                            message: '获取选课情况失败，请检查网络连接'
                        });
                    else {
                        this.courses = res.data['selected'];
                    }

                    this.loading = false;
                })
                .catch((err) => {
                    this.$message({
                        type: 'error',
                        duration: 1500,
                        message: '获取选课情况失败，请检查网络连接'
                    });
                    this.loading = false;
                });
        }
    }
</script>

<style scoped>
    .personal_table{
        text-align: left;
    }
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 70%;
    }
</style>