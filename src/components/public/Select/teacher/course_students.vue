<template>
    <div class="teach-query-score">
        <el-card
                v-loading="loadingCard"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading">
            <h2>您当前一共有&nbsp;{{ handleLength(courses) }}&nbsp;个教学班</h2>
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
                        <template v-if=" handleLength(tableData[course.course_id]) !== 0 ">
                            <div     v-loading="loading"
                                     element-loading-text="拼命加载中"
                                     element-loading-spinner="el-icon-loading">
                                <el-pagination
                                        style="text-align: center; padding: 20px 0;"
                                        @size-change="handleSizeChange"
                                        @current-change="handleCurrentChange"
                                        :current-page="currentPage"
                                        :page-sizes="[15, 25, 35, 50]"
                                        :page-size="page_size"
                                        layout="total, sizes, prev, pager, next, jumper"
                                        :total="handleLength(tableData[course.course_id])">
                                </el-pagination>
                                <el-table
                                        align="center"
                                        :data="tableData[course.course_id].slice((currentPage-1)*page_size,currentPage*page_size)"
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
                            </div>
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
                page_size: 15,
                currentPage: 1,
                activeName: '-1',
                courses: [ ],
                tableData: { },
                loading: false,
                loadingCard: false
            };
        },
        methods: {
            //used for paging
            handleSizeChange: function (size) {
                this.page_size = size;
            },
            handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
            },
            handleChange(course_id) {
                if(this.tableData[course_id])
                    return;
                if(course_id === '')
                    return;

                this.loading = true;
                this.page_size = 15;
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
                            this.$set(this.tableData, course_id, res.data['students']);
                        }

                        this.loading = false;
                    })
                    .catch((err) => {
                        this.$message({
                            type: 'error',
                            duration: 1500,
                            message: '获取教学班信息失败，请检查网络连接'
                        });
                        this.loading = false;
                    });
            },
            handleLength( array ){
                if( array === undefined || array === null)
                    return 0;
                else
                    return array.length;
            }
        },
        beforeMount: function(){
            checkLogin(this);
            this.loadingCard = true;
            Axios.get(getApiPath('score/teach_courses/' + localStorage.getItem('teacher_id')))
                .then((res) => {
                    if(res.status !== 200)
                        this.$message({
                            type: 'error',
                            duration: 1500,
                            message: '获取教学班信息失败，请检查网络连接'
                        });
                    else {
                        this.courses = res.data['tableData'];
                    }

                    this.loadingCard = false;
                })
                .catch((err) => {
                    this.$message({
                        type: 'error',
                        duration: 1500,
                        message: '获取教学班信息失败，请检查网络连接'
                    });
                    this.loadingCard = false;
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