<template>
    <div class="deal_score_change">
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.length">
        </el-pagination>
        <el-table
                align="center"
                :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                style="width: 100%"
                stripe
                border>
            <el-table-column align="center" type="index"></el-table-column>
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
                    prop="course_id"
                    label="课程编号">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="course_name"
                    label="课程名">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="teacher_name"
                    label="任课老师">
            </el-table-column>
            <el-table-column
                    align="center"
                    label="操作"
                    width="150px"
            >
                <template slot-scope="scope">
                    <el-button size="small" @click="handle(1, scope.row, scope.$index)"  type="success" plain>同意</el-button>
                    <el-button size="small" @click="handle(0, scope.row, scope.$index)"  type="danger" plain>拒绝</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import checkLogin from '../../../../modules/checkLogin';
    import Axios from 'axios';
    import getApiPath from '../../../../modules/getApiPath';

    export default {
        name: 'deal_select',
        data() {
            return {
                pagesize: 10,
                currentPage: 1,
                tableData: [
                    {
                        query_id: 'xx',
                        student_id: 'xx',
                        student_name: '王小虎',
                        course_id: 'xx',
                        course_name: '上海市普陀区金沙江路 1518 弄',
                        teacher_name: 'xx'
                    },
                    {
                        query_id: 'xx',
                        student_id: 'xx',
                        student_name: '王小虎',
                        course_id: 'xx',
                        course_name: '上海市普陀区金沙江路 1518 弄',
                        teacher_name: 'xx'
                    }
                ]
            }
        },
        methods: {
            //used for paging
            handleSizeChange: function (size) {
                this.pagesize = size;
            },
            handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
            },

            handle(operation, query, index) {
                this.$confirm( operation === 1 ? '此操作将接受该选课申请, 是否继续?':'此操作将拒绝该选课申请, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var which = (this.currentPage - 1 ) * this.pagesize + index;

                    var deal_select = JSON.stringify({
                        query_id: query.query_id,
                        course_id: query.course_id,
                        student_id: query.student_id,
                        state: operation
                    });
                    Axios.put(getApiPath('select/deal_select'), deal_select )
                        .then( (res) => {
                            if(res.status !== 200) {
                                this.$message({
                                    type: 'error',
                                    duration: 1500,
                                    message: '处理选课申请失败，请检查网络连接'
                                });
                            }
                            else {
                                this.$message({
                                    type: 'success',
                                    duration: 1500,
                                    message: '处理选课申请成功'
                                });
                                this.tableData.splice(which, 1);
                            }
                        })
                        .catch( (err) => {
                            this.$message({
                                type: 'error',
                                duration: 1500,
                                message: '处理选课申请失败，请检查网络连接'
                            });
                        });
                }).catch(() => {
                    return;
                });
            }
        },
        beforeMount: function(){
            checkLogin(this);
            Axios.get(getApiPath('select/all_select_courses'))
                .then((res) => {
                    if(res.status !== 200)
                        this.$message({
                            type: 'error',
                            duration: 1500,
                            message: '获取所有选课申请失败，请检查网络连接'
                        });
                    else {
                        this.tableData = res.data['tableData'];
                    }
                })
                .catch((err) => {
                    this.$message({
                        type: 'error',
                        duration: 1500,
                        message: '获取所有选课申请失败，请检查网络连接'
                    });
                });
        }
    }
</script>

<style scoped>
    .deal_score_change{
        margin-bottom: 20px;
    }
</style>