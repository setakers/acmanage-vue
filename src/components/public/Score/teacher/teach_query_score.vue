<template>
    <div class="teach-query-score">
        <el-card
                v-loading="loadingCard"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)">
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
                            <div v-loading="loading"
                                 element-loading-text="拼命加载中"
                                 element-loading-spinner="el-icon-loading">
                                <el-pagination
                                    style="text-align: center; padding: 20px 0;"
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"
                                    :current-page="currentPage"
                                    :page-sizes="[15, 25, 35, 50]"
                                    :page-size="pagesize"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="handleLength(tableData[course.course_id])">
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
                                <el-table-column
                                        align="center"
                                        prop="score"
                                        sortable
                                        label="成绩">
                                    <template slot-scope="scope">
                                        <el-tag
                                                style="font-size: 1.2em"
                                                :type="handleScore(scope.row.score)"
                                                disable-transitions>{{ scope.row.score }}
                                        </el-tag>
                                    </template>
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
        name: "teach_query_score",
        data() {
            return {
                pagesize: 15,
                currentPage: 1,
                activeName: '-1',
                loading: false,
                loadingCard: false,
                courses: [ ],
                tableData: { }
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
                this.loading = true;

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
                            this.$set(this.tableData, course_id, res.data['students']);
                        }

                        this.loading = false;
                    })
                    .catch(() => {
                        this.$message({
                            type: 'error',
                            duration: 1500,
                            message: '获取教学班信息失败，请检查网络连接'
                        });
                        this.loading = false;
                    });
            },
            handleScore(value){
                if(value >= 90)
                    return 'success';
                else if(value >= 80)
                    return 'primary';
                else if(value >= 70)
                    return 'warning';
                else if(value >= 60)
                    return 'info';
                else
                    return 'danger';
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
                .catch(() => {
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