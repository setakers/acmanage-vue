<template>
    <div class="stu_query_score">
        <div class="stu_score_table">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="page_size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableData.length">
            </el-pagination>
            <el-table
                    stripe
                    align="center"
                    :data="tableData.slice((currentPage-1)*page_size,currentPage*page_size)"
                    style="width: 100%">
                <el-table-column align="center" type="index"></el-table-column>
                <el-table-column
                        align="center"
                        prop="course_name"
                        label="课程名">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="teacher_name"
                        sortable
                        label="任课老师">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="score"
                        sortable
                        label="成绩">
                </el-table-column>
            </el-table>
        </div>
        <div id="pie-chart-container">
            <ve-pie id="pie-chart" :data="chartData"></ve-pie>
        </div>
    </div>
</template>

<script>
    import checkLogin from '../../../../modules/checkLogin';
    import Axios from 'axios';
    import getApiPath from '../../../../modules/getApiPath';
    
    export default {
        name: "stu_query_score",
        data () {
            return {
                page_size: 5,
                currentPage: 1,
                tableData: [],
                chartData: {
                    columns: ['分数段', '数量'],
                    rows: [ ]
                }
            }
        },
        methods: {
            count_95(){
                return this.tableData.filter((item) => item.score >= 95).length;
            },
            count_85(){
                return this.tableData.filter((item) => item.score >= 85 && item.score < 95).length;
            },
            count_75(){
                return this.tableData.filter((item) => item.score >= 75 && item.score < 85).length;
            },
            count_60(){
                return this.tableData.filter((item) => item.score >= 60 && item.score < 75).length;
            },
            count_gg(){
                return this.tableData.filter((item) => item.score < 60).length;
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
            Axios.get(getApiPath('score/stuscore/' + localStorage.getItem('student_id')))
                .then((res) => {
                    if(res.status !== 200)
                        this.$message({
                            type: 'error',
                            duration: 1500,
                            message: '获取学生成绩失败，请检查网络连接'
                        });
                    else {
                        this.tableData = res.data['tableData'];

                        const count95 = this.count_95();
                        const count85 = this.count_85();
                        const count75 = this.count_75();
                        const count60 = this.count_60();
                        const countgg = this.count_gg();
                        const array = [
                            {'分数段': '95-100', '数量': count95},
                            {'分数段': '85-94', '数量': count85},
                            {'分数段': '75-84', '数量': count75},
                            {'分数段': '60-74', '数量': count60},
                            {'分数段': '0-59-100', '数量': countgg},
                        ];

                        console.log('here');
                        this.$set(this.chartData, 'rows', array);
                    }
                })
                .catch(() => {
                    this.$message({
                        type: 'error',
                        duration: 1500,
                        message: '获取学生成绩失败，请检查网络连接'
                    });
                });
        }
    }
</script>

<style scoped>
    .stu_score_table{
        position: absolute;
        float: left;
        width: 50%;
        vertical-align: center;
    }
    .stu_query_score{
        margin: 20px;
    }
    #pie-chart-container {
        position: absolute;
        width: 400px;
        right: 0px;
    }
</style>