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
                border
        >
            <el-table-column align="center" type="index"></el-table-column>
            <el-table-column
                    align="center"
                    prop="teacher_name"
                    label="教师">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="student_name"
                    label="学生">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="course_name"
                    label="课程">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="old_score"
                    label="旧成绩"
                    width="80px">
                <template slot-scope="scope">
                    <el-tag
                            :type="'primary'"
                            disable-transitions>{{ scope.row.old_score }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="new_score"
                    label="新成绩"
                    width="80px">
                <template slot-scope="scope">
                    <el-tag
                            :type="'success'"
                            disable-transitions>{{ scope.row.new_score }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="reason"
                    label="修改理由"
                    min-width="150px">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="query_time"
                    label="申请时间"
                    sortable>
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
        name: 'deal_score_change',
        data() {
            return {
                pagesize: 10,
                currentPage: 1,
                tableData: [ ]
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
                this.$confirm( operation === 1 ? '此操作将接受该修改申请, 是否继续?':'此操作将拒绝该修改申请, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const which = (this.currentPage - 1 ) * this.pagesize + index;
                    const change = {
                        query_id: query.query_id,
                        state: operation,
                        deal_time: (new Date()).valueOf()
                    };
                    Axios.put(getApiPath('score/handle_query'), change )
                        .then( (res) => {
                            if(res.status !== 200) {
                                this.$message({
                                    type: 'error',
                                    duration: 1500,
                                    message: '处理成绩修改申请失败，请检查网络连接'
                                });
                            }
                            else {
                                this.$message({
                                    type: 'success',
                                    duration: 1500,
                                    message: '处理成绩修改申请成功'
                                });
                                this.tableData.splice(which, 1);
                            }
                        })
                        .catch( () => {
                            this.$message({
                                type: 'error',
                                duration: 1500,
                                message: '处理成绩修改申请失败，请检查网络连接'
                            });
                        });
                }).catch(() => {
                    return;
                });
            }
        },
        beforeMount: function(){
            checkLogin(this);
            Axios.get(getApiPath('score/score_change_query'))
                .then((res) => {
                    if(res.status !== 200)
                        this.$message({
                            type: 'error',
                            duration: 1500,
                            message: '获取成绩修改申请失败，请检查网络连接'
                        });
                    else {
                        this.tableData = res.data['tableData'];
                    }
                })
                .catch(() => {
                    this.$message({
                        type: 'error',
                        duration: 1500,
                        message: '获取成绩修改申请失败，请检查网络连接'
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