<template>
    <div class="stu_select"
         v-loading="loading"
         element-loading-text="拼命加载中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-pagination
                style="text-align: center; padding: 20px 0;"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[15, 25, 35, 50]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="courses.length">
        </el-pagination>
        <el-table
                align="center"
                :data="courses.slice((currentPage-1)*pagesize, currentPage*pagesize)"
                style="width: 100%;"
                border
                stripe
        >
            <el-table-column width="100px" align="center" type="index"></el-table-column>
            <el-table-column
                    align="center"
                    prop="course_id"
                    label="课程号">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="course_name"
                    label="课程名称">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="credit"
                    sortable
                    label="学分">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="room_name"
                    label="上课地点">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="introduction"
                    label="课程简介">
            </el-table-column>
            <el-table-column
                    align="center"
                    label="操作">
                <template slot-scope="scope">
                    <el-button :type=" handleSelected(scope.row.course_id) ? 'info' : 'primary'  "
                               :disabled=" handleSelected(scope.row.course_id)"
                               @click="handleClick(scope.row.course_id)"
                               plain> {{ handleSelected(scope.row.course_id)?'已选择':'选课' }}
                    </el-button>
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
        name: "stu_select",
        data() {
            return{
                currentPage: 1,
                pagesize: 15,
                loading: false,
                courses: [ ],
                selected: [ 456 ]
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
            handleSelected( course_id ){
                return this.selected.indexOf( course_id ) !== -1;
            },
            handleClick(course_id){
                const select = {
                    course_id: course_id,
                   student_id: localStorage.getItem('student_id'),
                        state: 2
                };
                Axios.post(getApiPath('select/select_course'), select)
                    .then( (res) => {
                        if(res.status === 200){
                            this.selected.push(course_id);
                            this.$notify({
                                thype: 'success',
                                duration: 1500,
                                message: '提交选课申请成功'
                            })
                        }
                        else{
                            this.$message({
                                type: 'error',
                                duration: 1500,
                                message: '提交选课申请失败'
                            });
                        }
                    })
                    .catch( () => {
                        this.$message({
                              type: 'error',
                          duration: 1500,
                           message: '提交选课申请失败'
                        });
                    })
            }
        },
        beforeMount: function(){
            checkLogin(this);

            this.loading = true;
            Axios.get(getApiPath('select/query_courses'))
                .then((res) => {
                    if(res.status === 200){
                        this.courses = res.data['courses'];
                        Axios.get(getApiPath('select/selected/' + localStorage.getItem('student_id')))
                            .then(  (res) => {
                                if(res.status === 200){
                                    const allSelectd = res.data['selected'];
                                    for( let i =0 ; i < allSelectd.length; i++)
                                        this.selected.push( allSelectd[i].course_id);

                                    Axios.get(getApiPath('select/selected_status/' + localStorage.getItem('student_id')))
                                        .then(  (res) => {
                                            if(res.status === 200){
                                                const status = res.data['status'];
                                                for( let i =0 ; i < status.length; i++) {
                                                    if( status[i].state === 1 && allSelectd.indexOf(status[i]).course_id === -1){
                                                        this.$notify({
                                                            type: 'warning',
                                                          duration: 3000,
                                                          message: '数据库中已选定课程和申请表中的数据不一致'
                                                        });
                                                    }
                                                    if( status[i].state !== 0 && this.selected.indexOf(status[i].course_id) === -1) {
                                                        this.selected.push(status[i].course_id);
                                                    }
                                                }
                                            }
                                            else{
                                                this.$message({
                                                    type: 'error',
                                                    duration: 1500,
                                                    message: '获取已选课程失败，请检查网络连接'
                                                });
                                            }

                                            this.loading = false;

                                        });
                                }
                                else{
                                    this.$message({
                                        type: 'error',
                                        duration: 1500,
                                        message: '获取已选课程失败，请检查网络连接'
                                    });
                                }

                                this.loading = false;

                            })
                            .catch( () => {
                                this.$message({
                                    type: 'error',
                                    duration: 1500,
                                    message: '获取已选课程失败，请检查网络连接'
                                });
                                this.loading = false;

                            });
                    }
                    else {
                        this.$message({
                            type: 'error',
                            duration: 1500,
                            message: '获取课程信息失败，请检查网络连接'
                        });
                    }
                    this.loading = false;
                })
                .catch(() => {
                    this.$message({
                        type: 'error',
                        duration: 1500,
                        message: '获取课程信息失败，请检查网络连接'
                    });
                    this.loading = false;
                });
        }
    }
</script>

<style scoped>

</style>