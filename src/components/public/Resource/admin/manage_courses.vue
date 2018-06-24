<template>
    <div class="manage-accounts">
        <div style="margin-bottom: 20px">
            <el-button type="primary" style="width: 150px;" icon="el-icon-plus" @click="create()">添加</el-button>
        </div>
        <div>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[15, 25, 35, 50]"
                    :page-size="page_size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableData.length">
            </el-pagination>
            <el-table
                    v-loading="loading"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    border
                    stripe
                    :data="tableData"
                    style="width: 100%"
            >
                <el-table-column align="center" type="index"></el-table-column>
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
                        prop="classroom_id"
                        label="教室编号">
                    <template slot-scope="scope">
                        {{ getRoomName(scope.row) }}
                    </template>
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
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button
                                plain
                                size="small"
                                type="primary"
                                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div>
            <el-dialog title="编辑课程" :visible.sync="dialogFormVisible">
                <el-form :model="form" ref="form" :rules="checkRules" status-icon>
                    <el-form-item label="课程编号" prop="course_id">
                        <el-input v-model="form.course_id" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="课程名" prop="course_name">
                        <el-input v-model="form.course_name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="教室" prop="classroom_id" style="text-align: left">
                        <el-select v-model="form.classroom_id" placeholder="选择教室">
                            <template v-for=" room in rooms">
                                <el-option :label=" room.room_name + ' ---- 容量:' + room.capacity " :value='room.classroom_id'></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="学分" prop="credit">
                        <el-input  v-model="form.credit"></el-input>
                    </el-form-item>
                    <el-form-item label="课程简介" prop="introduction">
                        <el-input v-model="form.introduction" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="handleCancle('form')">取 消</el-button>
                    <el-button type="primary" @click="submitEdit('form')">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="添加课程" :visible.sync="dialogAddVisible">
                <el-form :model="form" ref="addForm" :rules="checkRules" status-icon>
                    <el-form-item label="课程名" prop="course_name">
                        <el-input v-model="form.course_name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="教室" prop="classroom_id" style="text-align: left">
                        <el-select v-model="form.classroom_id" placeholder="选择教室">
                            <template v-for=" room in rooms">
                                <el-option :label=" room.room_name + ' ---- 容量:' + room.capacity " :value='room.classroom_id'></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="学分" prop="credit">
                        <el-input  v-model="form.credit"></el-input>
                    </el-form-item>
                    <el-form-item label="课程简介" prop="introduction">
                        <el-input v-model="form.introduction" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="handleCancle('addForm')">取 消</el-button>
                    <el-button type="primary" @click="submitCreate('addForm')">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import Axios from 'axios';
    import getApiPath from '../../../../modules/getApiPath';
    import checkLogin from '../../../../modules/checkLogin';

    export default {
        name: 'manage_courses',
        data: function () {
            const validateCourseName = (rule, value, callback) => {
                console.log(value);
                if(value === '' || value === null || value === undefined)
                    callback(new Error('请输入课程名'));
                else
                    callback();
            };
            const validateCredit = (rule, value, callback) => {
                if( value === '' || value === null || value === undefined)
                    callback(new Error('请输入学分'));
                else{
                    var reg = /^\d+(\.\d+)?$/;
                    if( !reg.test(value) )
                        callback(new Error('学分格式不正确'));
                    else
                        callback();
                }
            };
            const validateIntro = (rule, value, callback) => {
                if(value === '' || value === null || value === undefined)
                    callback(new Error('请输入课程简介'));
                else
                    callback();
            };
            const validateClassroom = ( rule, value, callback ) => {
                if(value === '' || value === null || value === undefined)
                    callback(new Error('请选择教室'));
                else
                    callback();
            };
            return {
                page_size: 10,
                currentPage: 1,
                tableData: [],
                dialogFormVisible: false,
                dialogAddVisible: false,
                loading: false,
                form: {
                    course_id: '',
                    course_name: '',
                    classroom_id: '',
                    credit: '',
                    introduction: '',
                    state: ''
                },
                rooms: [],
                checkRules: {
                    course_name: [{validator: validateCourseName, trigger: 'blur'}],
                    introduction: [{validator: validateIntro, trigger: 'blur'}],
                    credit: [{validator: validateCredit, trigger: 'blur'}],
                    classroom_id: [{validator: validateClassroom, trigger: 'blur'}],
                }
            }
        },
        methods:{
            //used for paging
            handleSizeChange: function (size) {
                this.page_size = size;
            },
            handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
            },
            submitEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Axios.put(getApiPath('resource/courses'), this.form)
                            .then((res) => {
                                if(res.status === 200) {
                                    this.$message(
                                        {
                                            type: 'success',
                                            duration: 1500,
                                            message: '课程信息修改成功'
                                        }
                                    );
                                    this.$refs[formName].resetFields();
                                    this.dialogFormVisible = false;

                                    this.loading = true;
                                    Axios.get(getApiPath('resource/courses'))
                                        .then((res) => {
                                            if(res.status !== 200) {
                                                this.$message({
                                                    type: 'error',
                                                    duration: 1500,
                                                    message: '获取所有课程信息失败，请检查网络连接'
                                                });
                                                this.loading = false;

                                            } else {
                                                this.tableData = res.data['tableData'];
                                                this.loading = false;

                                            }
                                        })
                                        .catch(() => {
                                            this.$message({
                                                type: 'error',
                                                duration: 1500,
                                                message: '获取所有课程信息失败，请检查网络连接'
                                            });
                                            this.loading = false;
                                        });

                                } else {
                                    this.$message(
                                        {
                                            type: 'error',
                                            duration: 1500,
                                            message: '课程信息修改失败'
                                        }
                                    );
                                    this.dialogFormVisible = false;
                                    return false;
                                }
                            });
                        return true;
                    }
                    else {
                        return false;
                    }
                });
            },
            submitCreate(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Axios.post(getApiPath('resource/courses'), this.form)
                            .then((res) => {
                                if(res.status === 200) {
                                    this.$message(
                                        {
                                            type: 'success',
                                            duration: 1500,
                                            message: '新课程创建成功'
                                        }
                                    );
                                    this.$refs[formName].resetFields();
                                    this.dialogAddVisible = false;

                                    this.loading = true;
                                    Axios.get(getApiPath('resource/courses'))
                                        .then((res) => {
                                            if(res.status !== 200) {
                                                this.$message({
                                                    type: 'error',
                                                    duration: 1500,
                                                    message: '获取所有课程信息失败，请检查网络连接'
                                                });
                                                this.loading = false;

                                            } else {
                                                this.tableData = res.data['tableData'];
                                                this.loading = false;

                                            }
                                        })
                                        .catch(() => {
                                            this.$message({
                                                type: 'error',
                                                duration: 1500,
                                                message: '获取所有课程信息失败，请检查网络连接'
                                            });
                                            this.loading = false;
                                        });

                                } else {
                                    this.$message(
                                        {
                                            type: 'error',
                                            duration: 1500,
                                            message: '新课程创建失败'
                                        }
                                    );
                                    this.dialogAddVisible = false;
                                    return false;
                                }
                            });
                        return true;
                    } else {
                        return false;
                    }
                });
            },
            create(){
                this.dialogAddVisible = true;
            },
            handleEdit: function (index, row) { //编辑数据
                this.form = row;
                this.dialogFormVisible = true;
            },
            handleCancle(formName){
                this.dialogFormVisible = false;
                this.dialogAddVisible = false;
                this.$refs[formName].resetFields();
            },
            getRoomName(row){
                if(row.classroom_id === undefined || row.classroom_id === null)
                    return '';

                for( let room of this.rooms){
                    if(room.classroom_id === row.classroom_id) {
                        return room.room_name + ' ---- 容量:' + room.capacity
                    }
                }
                return '';
            }
        },
        beforeMount(){
            checkLogin(this);
            this.loading = true;
            Axios.get(getApiPath('resource/courses'))
                .then((res) => {
                    if(res.status !== 200) {
                        this.$message({
                            type: 'error',
                            duration: 1500,
                            message: '获取所有课程信息失败，请检查网络连接'
                        });
                        this.loading = false;

                    } else {
                        this.tableData = res.data['tableData'];
                        this.loading = false;

                        Axios.get(getApiPath('resource/classrooms'))
                            .then((res) => {
                                if(res.status !== 200) {
                                    this.$message({
                                        type: 'error',
                                        duration: 1500,
                                        message: '获取所有教室信息失败，请检查网络连接'
                                    });

                                } else {
                                    this.rooms = res.data['tableData'];
                                }
                            })
                            .catch(() => {
                                this.$message({
                                    type: 'error',
                                    duration: 1500,
                                    message: '获取所有教室信息失败，请检查网络连接'
                                });
                            });
                    }
                })
                .catch(() => {
                    this.$message({
                        type: 'error',
                        duration: 1500,
                        message: '获取所有课程信息失败，请检查网络连接'
                    });
                    this.loading = false;
                });
        }
    }
</script>

<style scoped>

</style>