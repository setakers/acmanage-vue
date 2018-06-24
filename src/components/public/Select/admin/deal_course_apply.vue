<template>
    <div class="deal_score_change">
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="page_size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.length">
        </el-pagination>
        <el-table
                align="center"
                :data="tableData.slice((currentPage-1)*page_size,currentPage*page_size)"
                style="width: 100%"
                stripe
                border>
            <el-table-column align="center" type="index"></el-table-column>
            <el-table-column
                    align="center"
                    prop="teacher_id"
                    label="教师号">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="teacher_name"
                    label="学生姓名">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="course_name"
                    label="课程名">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="credit"
                    label="学分">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="introduction"
                    label="课程简介">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="room_name"
                    label="上课地点">
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
        name: 'deal_score_apply',
        data() {
            return {
                page_size: 10,
                currentPage: 1,
                tableData: [
                    {
                        open_id: 'xxx',
                        teacher_id: 'xxx',
                        teacher_name: 'xxx',
                        course_name: 'xx',
                        credit: 3.5,
                        introduction: 'xxx',
                        classroom_id: 'xxx',
                        room_name: 'xxx'
                    },
                    {
                        open_id: 'xxx',
                        teacher_id: 'xxx',
                        teacher_name: 'xxx',
                        course_name: 'xx',
                        credit: 3.5,
                        introduction: 'xxx',
                        classroom_id: 'xxx',
                        room_name: 'xxx'
                    }
                ]
            }
        },
        methods: {
            //used for paging
            handleSizeChange: function (size) {
                this.page_size = size;
            },
            handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
            },

            handle(operation, query, index) {
                this.$confirm( operation === 1 ? '此操作将接受该开课申请, 是否继续?':'此操作将拒绝该开课申请, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var which = (this.currentPage - 1 ) * this.page_size + index;

                    var deal_open = {
                             open_id: query.open_id,
                          teacher_id: query.teacher_id,
                         course_name: query.course_name,
                              credit: query.credit,
                        introduction: query.introduction,
                        classroom_id: query.classroom_id,
                               state: operation
                    };
                    Axios.put(getApiPath('select/deal_open_course'), deal_open )
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
                        .catch( () => {
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
            Axios.get(getApiPath('select/all_open_course'))
                .then((res) => {
                    if(res.status !== 200)
                        this.$message({
                            type: 'error',
                            duration: 1500,
                            message: '获取所有开课申请失败，请检查网络连接'
                        });
                    else {
                        this.tableData = res.data['tableData'];
                    }
                })
                .catch(() => {
                    this.$message({
                        type: 'error',
                        duration: 1500,
                        message: '获取所有开课申请失败，请检查网络连接'
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