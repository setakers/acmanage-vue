<template>
    <div class="teach-query-score">
        <el-card>
            <h2>您当前一共有&nbsp;{{ courses.length }}&nbsp;个教学班</h2>
            <el-collapse v-model="activeName" accordion>
                <template v-for="(course, index) of courses">
                    <el-collapse-item :name="course.course_id">
                        <template slot="title">
                            <a class="header-name">{{ course.course_name }}</a>
                            <el-tag
                                    style="margin-left: 20px"
                                    :type="'success'"
                                    disable-transitions>课程编号：{{ course.course_id }}
                            </el-tag>
                            <el-tag
                                    :type="'primary'"
                                    disable-transitions>学分：{{ course.credit }}
                            </el-tag>
                        </template>
                        <template>
                            <div style="margin: 10px;">
                                 {{ course.introduction }}
                            </div>
                        </template>
                    </el-collapse-item>
                </template>
            </el-collapse>
        </el-card>
    </div>
</template>

<script>
    import checkLogin from '../../../../modules/checkLogin';
    import Axios from 'axios';
    import getApiPath from '../../../../modules/getApiPath';

    export default {
        name: "teach_courses",
        data() {
            return {
                activeName: '-1',
                courses: [{
                    course_id: 456,
                    course_name: 'xxx学',
                    credit: 3.5,
                    introduction: '该门课程是关于xxx，将对xxx进行教学',
                }]
            };
        },
        beforeMount: function(){
            checkLogin(this);
            Axios.get(getApiPath('score/teach_courses/' + localStorage.getItem('teacher_id')))
                .then((res) => {
                    if(res.status !== 200)
                        this.$message({
                            type: 'error',
                            duration: 1500,
                            message: '获取教学班信息失败，请检查网络连接'
                        });
                    else {
                        this.courses = res.data['courses'];
                    }
                })
                .catch((err) => {
                    this.$message({
                        type: 'error',
                        duration: 1500,
                        message: '获取教学班信息失败，请检查网络连接'
                    });
                });
        }
    }
</script>

<style scoped>
    .teach-query-score{
        text-align: left;
    }
    .header-name{
        font-size: 2em;
    }

</style>