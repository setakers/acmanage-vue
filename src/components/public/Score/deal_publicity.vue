<template>
    <div class="publicity">
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
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 15, 25, 50]"
                    :page-size="page_size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableData.length">
            </el-pagination>
            <el-table
                :row-class-name="tableRowClassName"
                align="center"
                :data="tableData.slice((currentPage-1)*page_size,currentPage*page_size)"
                style="width: 100%"
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
                    width="100px">
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
                    width="100px">
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
                    prop="deal_time"
                    label="处理时间"
                    sortable>
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
    import checkLogin from '../../../modules/checkLogin';
    import Axios from 'axios';
    import getApiPath from '../../../modules/getApiPath';

    export default {
        name: 'deal_publicty',
        data() {
            return {
                page_size: 10,
                currentPage: 1,
                tableData: [ ],
                loading: true
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
                this.page_size = size;
            },
            handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
            }
        },
        beforeMount: function(){
            checkLogin(this);
            Axios.get(getApiPath('score/publicity'))
                .then((res) => {
                    if(res.status !== 200) {
                        this.$message({
                            type: 'error',
                            duration: 1500,
                            message: '获取成绩修改公示失败，请检查网络连接'
                        });
                        this.loading = false;

                    } else {
                        this.tableData = res.data['tableData'];
                        this.loading = false;

                    }
                })
                .catch((err) => {
                    this.$message({
                        type: 'error',
                        duration: 1500,
                        message: '获取成绩修改公示失败，请检查网络连接'
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
    .publicity{
        margin-bottom: 20px;
    }
</style>