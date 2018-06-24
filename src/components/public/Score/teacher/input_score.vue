<template>
    <div class="teach-query-score">
        <el-card>
            <h2>您当前一共有&nbsp;{{ handleLength(courses) }}&nbsp;个教学班</h2>
            <el-collapse v-model="activeName" accordion @change="handleChange">
                <template v-for="(course, index) of courses">
                    <el-collapse-item :name="course.course_id">
                        <template slot="title">
                            <a style="display: inline-block" class="header-name">{{ course.course_name }}</a>
                            <el-tag
                                    style="margin-left: 20px"
                                    :type="'success'"
                                    disable-transitions>课程编号：{{ course.course_id }}
                            </el-tag>
                            <el-tag
                                    :type="'primary'"
                                    disable-transitions>学分：{{ course.credit }}
                            </el-tag>
                            <el-progress
                                    style="margin-left:20px; width: 50%; display: inline-block"
                                    :stroke-width="18"
                                    :percentage="countProgress(course)"
                                    :status="handleStatus(course)">
                            </el-progress>
                        </template>
                        <template v-if=" handleLength(tableData[course.course_id]) ">
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
                                <div style="text-align: right">
                                    <el-button @click=" dialogVisible = true;" type="primary" plain>提交成绩</el-button>
                                </div>
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
                                        <el-input style="width: 50%" :id=" 'input-' + scope.$index " @blur="handleInput(course.course_id, scope.$index, index)" placeholder="输入成绩"></el-input>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                        <template v-else>
                            <br /><em>该门课程没有未录入成绩的学生</em>
                        </template>
                    </el-collapse-item>
                </template>
            </el-collapse>
        </el-card>
        <el-dialog
                title=""
                :visible.sync="dialogVisible"
                width="30%">
            <span>确定提交输入的成绩信息？</span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handlePost">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
    import checkLogin from '../../../../modules/checkLogin';
    import Axios from 'axios';
    import getApiPath from '../../../../modules/getApiPath';

    export default {
        name: "input_score",
        data() {
            return {
                dialogVisible: false,
                pagesize: 15,
                currentPage: 1,
                activeName: '-1',
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
                            this.$set(this.tableData, course_id, res.data['students'].filter( (student) => student.score === null) );
                        }
                    })
                    .catch(() => {
                        this.$message({
                            type: 'error',
                            duration: 1500,
                            message: '获取教学班信息失败，请检查网络连接'
                        });
                    });
            },
            countProgress: function(course){
                console.log(course);
                console.log('here');
                var temp = course.total_students - course.unmarked_stu;
                return Math.round((temp / course.total_students) *100);
            },
            handleStatus(course){
                var temp = course.total_students - course.unmarked_stu;
                temp = Math.round((temp / course.total_students) *100);
                if(temp !== 100)
                    return '';
                else
                    return 'success';
            },
            handleInput(course_id, table_index, course_index){
                var targetValue = document.getElementById('input-' + table_index).value;
                var parse = parseInt(targetValue);

                if( isNaN(parse) ) {
                    if(targetValue !== '') {
                        this.$notify({
                            title: '提示',
                            message: targetValue + ' 不是一个数字',
                            duration: 1500,
                            type: 'info'
                        });
                    }
                    this.$set(this.tableData[course_id][(this.currentPage - 1) * this.pagesize + table_index], 'score', null);
                }
                else if( parse < 0 || parse >100){
                    this.$notify({
                        title: '提示',
                        message: '请输入一个介于0-100的数字',
                        duration: 1500,
                        type: 'info'
                    });
                    this.$set(this.tableData[course_id][(this.currentPage - 1) * this.pagesize + table_index], 'score', null);
                }
                else
                    this.$set(this.tableData[course_id][(this.currentPage - 1) * this.pagesize + table_index], 'score', parse);

                this.$set(this.courses[course_index], 'unmarked_stu', this.tableData[course_id].filter((item) => item.score === null).length);

                //Note: table_index会随页数的改变而改变
            },
            handleLength( array ){
              if( array === undefined || array === null )
                  return 0;
              else
                  return array.length;
            },
            handlePost() {
                this.dialogVisible = false;
                var count = this.tableData[this.activeName].filter( (item) => item.score !== null).length;
                if(count === 0){
                    this.$notify({
                        title: '警告',
                        message: '当前课程暂未有录入的成绩',
                        duration: 1500,
                        type: 'warning'
                    });
                    return;
                }

                var input_score = {
                    course_id: parseInt(this.activeName),
                    scores: this.tableData[this.activeName].filter((item) => item.score !== null)
                };
                Axios.put(getApiPath('score/input_score'), input_score)
                    .then((res) => {
                        if(res.status === 200) {
                            this.$message({
                                type: 'success',
                                duration: 1500,
                                message: '成绩录入成功'
                            });
                            this.$set(this.tableData, this.activeName, this.tableData[this.activeName].filter( (item) => item.score === null ));
                            for( let index in this.courses ){
                                if( parseInt(this.activeName) === this.courses[index].course_id){
                                    this.$set(this.courses[index], 'unmarked_stu', this.tableData[this.activeName].length);
                                    return;
                                }
                            }

                        } else {
                            this.$message({
                                type: 'error',
                                duration: 1500,
                                message: '服务器错误，成绩录入失败'
                            });
                        }
                    })
                    .catch( (err) => {
                        this.$message({
                            type: 'error',
                            duration: 1500,
                            message: '成绩录入失败，请检查网络连接'
                        });
                    });
            }
        },
        beforeMount: function(){
            checkLogin(this);
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
                })
                .catch(() => {
                    this.$message({
                        type: 'error',
                        duration: 1500,
                        message: '获取教学班信息失败，请检查网络连接'
                    });
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