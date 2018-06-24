<template>
    <div class="query_exam"
         v-loading="loading"
         element-loading-text="拼命加载中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.length">
        </el-pagination>
        <el-table
                align="center"
                :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                style="width: 100%"
        >
            <el-table-column align="center" type="index"></el-table-column>
            <el-table-column
                    align="center"
                    prop="course_name"
                    label="课程名">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="teacher_name"
                    label="任课教师">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="room_name"
                    label="考试地点"
                    sortable>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="time"
                    label="考试时间"
                    sortable>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import checkLogin from '../../../../modules/checkLogin';
    import Axios from 'axios';
    import getApiPath from '../../../../modules/getApiPath';

    export default {
        name: 'query_exam',
        data() {
            return {
                pagesize: 5,
                currentPage: 1,
                tableData: [ ],
                loading: false
            }
        },
        methods: {
            //used for paging
            handleSizeChange: function (size) {
                this.pagesize = size;
            },
            handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
            }
        },
        beforeMount: function(){
            checkLogin(this);
            this.loading = true;
            Axios.get(getApiPath('score/query_exam/' + localStorage.getItem('student_id')))
                .then((res) => {
                    if(res.status !== 200)
                        this.$message({
                            type: 'error',
                            duration: 1500,
                            message: '获取考试失败，请检查网络连接'
                        });
                    else {
                        this.tableData = res.data['tableData'];
                    }

                    this.loading = false;
                })
                .catch(() => {
                    this.$message({
                        type: 'error',
                        duration: 1500,
                        message: '获取考试信息失败，请检查网络连接'
                    });

                    this.loading = false;
                });
        }
    }
</script>

<style scoped>
    .query_exam{
        margin-bottom: 20px;
    }
</style>