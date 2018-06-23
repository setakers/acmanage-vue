<template>
    <div class="teach-query-score">
        <el-card>
            <h2>您当前一共有&nbsp;{{ courses.length }}&nbsp;个教学班</h2>
            <el-collapse v-model="activeName" accordion @change="handleChange">
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
                            <el-tag
                                    :type="'info'"
                                    disable-transitions>课程简介：{{ course.introduction }}
                            </el-tag>
                        </template>
                        <template v-if=" tableData[course.course_id].length !== 0 ">
                            <el-pagination
                                    style="text-align: center; padding: 20px 0;"
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"
                                    :current-page="currentPage"
                                    :page-sizes="[15, 25, 35, 50]"
                                    :page-size="pagesize"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="tableData[course.course_id].length">
                            </el-pagination>
                            <el-table
                                    align="center"
                                    :data="tableData[course.course_id].slice((currentPage-1)*pagesize,currentPage*pagesize)"
                                    style="width: 100%; font-size: 1.2em"
                                    border
                                    stripe
                            >
                                <el-table-column width="250px" align="center" type="index"></el-table-column>
                                <el-table-column
                                        align="center"
                                        prop="student_id"
                                        label="学号">
                                </el-table-column>
                                <el-table-column
                                        align="center"
                                        prop="student_name"
                                        label="学生姓名">
                                </el-table-column>
                            </el-table>
                        </template>
                        <template v-else>
                            <br /><em>该门课程暂时没有选定的学生</em>
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
        name: "course_students",
        data() {
            return {
                pagesize: 15,
                currentPage: 1,
                activeName: '-1',
                courses: [{
                    course_id: 456,
                    course_name: 'xxx学',
                    credit: 3.5,
                    introduction: '该门课程是关于xxx，将对xxx进行教学',
                }],
                tableData: {
                    456: [{
                        student_id: 123,
                        student_name: 'xxx',
                        score: 95,
                    },{
                        student_id: 456,
                        student_name: 'xxx',
                        score: 85,
                    },
                        {
                            student_id: 789,
                            student_name: 'xxx',
                            score: 61,
                        }]
                }
            };
        },
        methods: {
            //used for paging
            handleSizeChange: function (size) {
                this.pagesize = size;
            },
            handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
            },
            handleChange(course_id) {
                if(this.tableData[course_id])
                    return;
                if(course_id === '')
                    return;

                this.pagesize = 15;
                this.currentPage = 1;

                Axios.get(getApiPath('score/stu_of_course/' + course_id))
                    .then((res) => {
                        if(res.status !== 200)
                            this.$message({
                                type: 'error',
                                duration: 1500,
                                message: '获取教学班信息失败，请检查网络连接'
                            });
                        else {
                            this.tableData[course_id] = res.data['students'];
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