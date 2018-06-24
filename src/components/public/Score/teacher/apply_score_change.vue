<template>
  <div class="teach-query-score">
    <el-card>
      <h2>您当前一共有&nbsp;{{ courses.length }}&nbsp;个教学班</h2>
      <el-collapse v-model="activeName" accordion @change="handleChange">
        <template v-for="(course, index) of courses">
          <el-collapse-item :name="course.course_id">
            <template slot="title">
              <a class="header-name">{{ course.course_name }}</a>
              <el-tag
                      style="margin-left: 20px"
                      :type="'success'"
                      disable-transitions>课程编号：{{ course.course_id }}
              </el-tag>
              <el-tag
                      :type="'primary'"
                      disable-transitions>学分：{{ course.credit }}
              </el-tag>
              <el-tag
                      :type="'info'"
                      disable-transitions>课程简介：{{ course.introduction }}
              </el-tag>
            </template>
            <div    v-loading="loading"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading">
              <template v-if=" handleTotal(course.course_id) !== 0">
              <el-pagination
                      style="text-align: center; padding: 20px 0;"
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="currentPage"
                      :page-sizes="[15, 25, 35, 50]"
                      :page-size="page_size"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="handleTotal(course.course_id)">
              </el-pagination>
              <el-table
                      align="center"
                      :data="tableData[course.course_id].slice((currentPage-1)*page_size,currentPage*page_size)"
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
                    <el-tag
                            style="font-size: 1.2em"
                            :type="handleScore(scope.row.score)"
                            disable-transitions>{{ scope.row.score }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="操作">
                  <template slot-scope="scope">
                    <el-button :type=" scope.row.applied?'info':'primary' "
                               :disabled="scope.row.applied"
                               @click=" dialogVisible = true; formtable.student = scope.row; formtable.index = scope.$index "
                               plain> {{ scope.row.applied?'已申请':'申请修改' }}
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
              <template v-else>
              <br/><em>该门课程暂时没有选定的学生</em>
            </template>
            </div>
          </el-collapse-item>
        </template>
      </el-collapse>
    </el-card>
    <el-dialog
            title="成绩修改申请"
            :visible.sync="dialogVisible"
            width="30%">
      <el-form :model="formtable" :rules="checkRules" ref="formtable" label-width="75px">
        <el-form-item label="旧的分数">
          <el-tag
                  style="font-size: 1.2em"
                  :type="handleScore(formtable.student.score)"
                  disable-transitions>{{ formtable.student.score }}
          </el-tag>
        </el-form-item>
        <el-form-item label="新的分数" prop="new_score">
          <el-input v-model="formtable.new_score" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="申请理由" prop="reason">
          <el-input v-model="formtable.reason" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item style="text-align: right; padding-right: 20px">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handlePost('formtable')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
    import checkLogin from '../../../../modules/checkLogin';
    import Axios from 'axios';
    import getApiPath from '../../../../modules/getApiPath';

    export default {
        name: "apply_score_change",
        data() {
            const validateScore = (rule, value, callback) => {
                let num = parseInt(value);

                if (isNaN(num)) {
                    callback(new Error('分数必须是一个数字'));
                } else if (num < 0 || num > 100) {
                    callback(new Error('请输入在0-100之间的分数'));
                } else
                    callback();
            };
            const validateReason = (rule, value, callback) => {
                if (value === '' || value === null || value === undefined) {
                    callback(new Error('申请理由不能为空'));
                } else {
                    callback();
                }
            };
            return {
                dialogVisible: false,
                loading: false,

                formtable: {
                    reason: '',
                    new_score: null,
                    student: {},
                    index: null
                },
                checkRules: {
                    new_score: [{validator: validateScore, trigger: 'blur'}],
                    reason: [{validator: validateReason, trigger: 'blur'}]
                },

                page_size: 15,
                currentPage: 1,
                activeName: '-1',

                courses: [ ],
                tableData: { },
                publicity: [ ]
            };
        },
        methods: {
            //used for paging
            handleSizeChange: function (size) {
                this.page_size = size;
            },
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
            },
            handleChange(course_id) {
                if (this.tableData[course_id])
                    return;
                if (course_id === '')
                    return;

                this.loading = true;

                this.page_size = 15;
                this.currentPage = 1;

                Axios.get(getApiPath('score/stu_of_course/' + course_id))
                    .then((res) => {
                        if (res.status !== 200) {
                            this.$message({
                                type: 'error',
                                duration: 1500,
                                message: '获取教学班信息失败，请检查网络连接'
                            });

                        } else {
                            this.$set(this.tableData, course_id, res.data['students'].filter((item) => item.score !== undefined));

                            const pending = this.publicity.filter((query) => {
                                return query.state === 2 && query.course_id === course_id;
                            });

                            this.tableData[course_id].forEach((item, index) => {
                                for (let i in pending) {
                                    const query = pending[i];
                                    if (query.student_id === item.student_id) {
                                        this.$set(this.tableData[course_id][index], 'applied', true);
                                        return;
                                    }
                                }
                                this.$set(this.tableData[course_id][index], 'applied', false);
                            });
                        }

                        this.loading = false;
                    })
                    .catch(() => {
                        this.$message({
                            type: 'error',
                            duration: 1500,
                            message: '获取教学班信息失败，请检查网络连接'
                        });
                        this.loading = false;
                    });
            },
            handleScore(value) {
                if (value >= 90)
                    return 'success';
                else if (value >= 80)
                    return 'primary';
                else if (value >= 70)
                    return 'warning';
                else if (value >= 60)
                    return 'info';
                else
                    return 'danger';
            },
            handlePost(scoreForm) {
                this.$refs[scoreForm].validate((valid) => {
                    if (valid) {
                        const query_score = {
                            query_id: null,
                            teacher_id: localStorage.getItem('teacher_id'),
                            student_id: this.formtable.student.student_id,
                            course_id: parseInt(this.activeName),
                            old_score: this.formtable.student.score,
                            new_score: this.formtable.new_score,
                            reason: this.formtable.reason,
                            state: 2,
                            query_time: null,
                            deal_time: null,
                        };
                        Axios.post(getApiPath('score/add_query_score_change'), query_score)
                            .then((res) => {
                                if (res.status === 200) {
                                    const index = (this.currentPage - 1) * this.page_size + this.formtable.index;
                                    this.tableData[this.activeName][index].applied = true;

                                    this.$message({
                                        type: 'success',
                                        duration: 1500,
                                        message: '成绩修改申请成功'
                                    });

                                    this.formtable = {
                                        reason: '',
                                        new_score: null,
                                        student: {},
                                        index: null
                                    };
                                    this.dialogVisible = false;

                                } else {
                                    this.$message({
                                        type: 'error',
                                        duration: 1500,
                                        message: '服务器内部错误，成绩修改申请失败'
                                    });
                                    return false;
                                }
                            }).catch(() => {
                            this.$message({
                                type: 'error',
                                duration: 1500,
                                message: '成绩修改申请失败，请检查网络连接'
                            });
                        });

                        return true;
                    } else {
                        return false;
                    }
                });
            },
            handleTotal(course_id) {
                if (this.tableData[course_id] === undefined)
                    return 0;
                else
                    return this.tableData[course_id].length;
            }
        },
        beforeMount: function () {
            checkLogin(this);
            Axios.get(getApiPath('score/teach_courses/' + localStorage.getItem('teacher_id')))
                .then((res) => {
                    if (res.status !== 200)
                        this.$message({
                            type: 'error',
                            duration: 1500,
                            message: '获取教学班信息失败，请检查网络连接'
                        });
                    else {
                        this.courses = res.data['tableData'];

                        Axios.get(getApiPath('score/publicity'))
                            .then((res) => {
                                if (res.status !== 200)
                                    this.$message({
                                        type: 'error',
                                        duration: 1500,
                                        message: '获取成绩修改公示失败，请检查网络连接'
                                    });
                                else {
                                    this.publicity = res.data['tableData'];
                                }
                            })
                            .catch(() => {
                                this.$message({
                                    type: 'error',
                                    duration: 1500,
                                    message: '获取成绩修改公示失败，请检查网络连接'
                                });
                            });
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
  .teach-query-score {
    text-align: left;
  }

  .header-name {
    font-size: 2em;
  }

</style>