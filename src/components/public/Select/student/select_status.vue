<template>
    <div class="select_status">
        <div class="tags">
            <el-tag
                    :type="'waring'"
                    class="mytag"
                    disable-transitions>Pending
            </el-tag>
            <el-tag
                    :type="'success'"
                    class="mytag"
                    disable-transitions>Succeed
            </el-tag>
            <el-tag
                    :type="'danger'"
                    class="mytag"
                    disable-transitions>Refused
            </el-tag>
        </div>
        <div v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 15, 25, 50]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="selected.length">
        </el-pagination>
            <el-table
                :row-class-name="tableRowClassName"
                align="center"
                :data="selected.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                style="width: 100%"
        >
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
                    label="课程介绍"
                    min-width="150px">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="state"
                    label="处理状态"
                    :filters="[{ text: 'refused', value: 0 }, { text: 'accept', value: 1 }, { text: 'pending', value: 2 }]"
                    :filter-method="filterState"
                    filter-placement="bottom-end">
                <template slot-scope="scope">
                    <el-tag
                            :type="handleState(scope.row.state)"
                            disable-transitions>{{ formatter(scope.row.state) }}
                    </el-tag>
                </template>
            </el-table-column>
        </el-table>
        </div>
    </div>
</template>

<script>
    import checkLogin from '../../../../modules/checkLogin';
    import Axios from 'axios';
    import getApiPath from '../../../../modules/getApiPath';

    export default {
        name: 'select_status',
        data() {
            return {
                pagesize: 10,
                currentPage: 1,
                selected: [ ],
                loading: false
            }
        },
        methods: {
            tableRowClassName({row, rowIndex}) {
                if(row.state === 0)
                    return 'danger-row';
                else if(row.state === 1)
                    return 'success-row';
                else
                    return 'warning-row';
            },
            formatter(value) {
                if(value === 0)
                    return 'Refused';
                else if(value === 1)
                    return 'Accepted';
                else
                    return 'Pending';
            },
            filterState(value, row) {
                return row.state === value;
            },
            handleState(value){
                if(value === 0)
                    return 'danger';
                else if(value === 1)
                    return 'success';
                else
                    return 'warning';
            },

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
            Axios.get(getApiPath('select/selected_status/' + localStorage.getItem('student_id')))
                .then((res) => {
                    if(res.status !== 200)
                        this.$message({
                            type: 'error',
                            duration: 1500,
                            message: '获取选课情况失败，请检查网络连接'
                        });
                    else {
                        this.selected = res.data['status'];
                    }

                    this.loading = false;
                })
                .catch(() => {
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
    .tags{
        margin-bottom: 20px;
    }
    .mytag{
        margin: 0 10px;
    }
</style>