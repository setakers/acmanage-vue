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
                        prop="classroom_id"
                        label="教室编号">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="room_name"
                        label="教室名">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="capacity"
                        label="容量">
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
            <el-dialog title="编辑教室" :visible.sync="dialogFormVisible">
                <el-form :model="form" ref="form" :rules="checkRules" status-icon>
                    <el-form-item label="教室编号" prop="classroom_id">
                        <el-input v-model="form.classroom_id" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="教室名" prop="room_name">
                        <el-input  v-model="form.room_name"></el-input>
                    </el-form-item>
                    <el-form-item label="容量" prop="capacity">
                        <el-input v-model="form.capacity" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="handleCancle('form')">取 消</el-button>
                    <el-button type="primary" @click="submitEdit('form')">确 定</el-button>
                </div>
            </el-dialog>

            <el-dialog title="添加教室" :visible.sync="dialogAddVisible">
                <el-form :model="form" ref="addForm" :rules="checkRules" status-icon>
                    <el-form-item label="教室名" prop="room_name">
                        <el-input  v-model="form.room_name"></el-input>
                    </el-form-item>
                    <el-form-item label="容量" prop="capacity">
                        <el-input v-model="form.capacity" auto-complete="off"></el-input>
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
        name: 'manage_classrooms',
        data: function () {
            const validateRoomName = (rule, value, callback) => {
                if(value === '' || value === null || value === undefined)
                    callback(new Error('请输入教室名'));
                else{
                    Axios.get(getApiPath('resource/valid_classroom/' + value))
                        .then( (res) => {
                            if( res.status  === 200)
                                callback();
                            else
                                callback( new Error('该教室已存在'));
                        })
                        .catch( () =>{
                            callback(new Error('网络连接失败'));
                        });
                }
            };
            const validateCapacity = ( rule, value, callback ) => {
                if( value === '' || value === null || value === undefined)
                    callback(new Error('请输入教室容量'));
                else{
                    var reg = /^\d+$/;
                    if( !reg.test(value) )
                        callback(new Error('请输入有效数字'));
                    else
                        callback();
                }
            };
            return {
                page_size: 10,
                currentPage: 1,
                tableData: [],
                dialogFormVisible: false,
                dialogAddVisible: false,
                loading: false,
                form: {
                    classroom_id: '',
                    room_name: '',
                    capacity: '',
                },
                checkRules: {
                    room_name: [{validator: validateRoomName, trigger: 'blur'}],
                    capacity: [{validator: validateCapacity, trigger: 'blur'}],
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
                        Axios.put(getApiPath('resource/classrooms'), this.form)
                            .then((res) => {
                                if(res.status === 200) {
                                    this.$message(
                                        {
                                            type: 'success',
                                            duration: 1500,
                                            message: '教室信息修改成功'
                                        }
                                    );
                                    this.$refs[formName].resetFields();
                                    this.dialogFormVisible = false;

                                    this.loading = true;
                                    Axios.get(getApiPath('resource/classrooms'))
                                        .then((res) => {
                                            if(res.status !== 200) {
                                                this.$message({
                                                    type: 'error',
                                                    duration: 1500,
                                                    message: '获取所有教室信息失败，请检查网络连接'
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
                                                message: '获取所有教室信息失败，请检查网络连接'
                                            });
                                            this.loading = false;
                                        });

                                } else {
                                    this.$message(
                                        {
                                            type: 'error',
                                            duration: 1500,
                                            message: '教室信息修改失败'
                                        }
                                    );
                                    this.dialogFormVisible = false;
                                    return false;
                                }
                            });
                        return true;
                    } else {
                        return false;
                    }
                });
            },
            submitCreate(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Axios.post(getApiPath('resource/classrooms'), this.form)
                            .then((res) => {
                                if(res.status === 200) {
                                    this.$message(
                                        {
                                            type: 'success',
                                            duration: 1500,
                                            message: '新教室创建成功'
                                        }
                                    );
                                    this.$refs[formName].resetFields();
                                    this.dialogAddVisible = false;

                                    this.loading = true;
                                    Axios.get(getApiPath('resource/classrooms'))
                                        .then((res) => {
                                            if(res.status !== 200) {
                                                this.$message({
                                                    type: 'error',
                                                    duration: 1500,
                                                    message: '获取所有教室信息失败，请检查网络连接'
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
                                                message: '获取所有教室信息失败，请检查网络连接'
                                            });
                                            this.loading = false;
                                        });

                                } else {
                                    this.$message(
                                        {
                                            type: 'error',
                                            duration: 1500,
                                            message: '新教室创建失败'
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
            }
        },
        beforeMount(){
            checkLogin(this);
            this.loading = true;
            Axios.get(getApiPath('resource/classrooms'))
                .then((res) => {
                    if(res.status !== 200) {
                        this.$message({
                            type: 'error',
                            duration: 1500,
                            message: '获取所有教室信息失败，请检查网络连接'
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
                        message: '获取所有教室信息失败，请检查网络连接'
                    });
                    this.loading = false;
                });
        }
    }
</script>

<style scoped>

</style>