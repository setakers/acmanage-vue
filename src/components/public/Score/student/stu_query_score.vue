<template>
    <div class="stu_query_score">
        <div class="stu_score_table">
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
                    stripe
                    align="center"
                    :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
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
        <!--<div class="drawtable">-->
            <!--<div class="chart-error" v-else><h2>没有数据所以统计图表也没得显示啦~</h2></div>-->
        <!--</div>-->
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
                pagesize: 5,
                currentPage: 1,
                tableData: [],
                chartData: {
                    columns: ['分数段', '数量'],
                    rows: [
                        {'分数段': '95-100', '数量': 0},
                        {'分数段': '85-94', '数量': 1},
                        {'分数段': '75-84', '数量': 2},
                        {'分数段': '60-74', '数量': 3},
                        {'分数段': '0-59-100', '数量': 4},
                    ]
                }
            }
        },
        computed: {
            count_95(){
                this.tableData.filter((item) => item.score >= 95).length;
            },
            count_85(){
                this.tableData.filter((item) => item.score >= 85 && item.score < 95).length;
            },
            count_75(){
                this.tableData.filter((item) => item.score >= 75 && item.score < 85).length;
            },
            count_60(){
                this.tableData.filter((item) => item.score >= 60 && item.score < 75).length;
            },
            count_gg(){
                this.tableData.filter((item) => item.score < 60).length;
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
    .myChart{
        position: relative;
        float: left;
        left: -75%;
    }
    .chart-error{
        position: relative;
        float: left;
        left: -50%;
        top: 50%;
    }
    .drawtable{
        position: absolute;
        float: left;
        left: 75%;
    }
    .stu_query_score{
        padding: 20px;
    }
    #pie-chart-container {
        position: absolute;
        width: 300px;
        right: 0;
    }
</style>