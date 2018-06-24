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
                        prop="user_id"
                        label="用户编号">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="user_name"
                        label="用户名">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="password"
                        label="密码">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="gender"
                        label="性别">
                    <template slot-scope="scope">
                        <el-tag :type="genderTag(scope.row.gender)" style="font-size: 1.2em">{{ gender(scope.row.gender) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="email"
                        label="邮箱">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="phone"
                        label="手机号">
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
            <el-dialog title="编辑账户" :visible.sync="dialogFormVisible">
                <el-form :model="form" ref="form" :rules="checkRules" status-icon>
                    <el-form-item label="用户编号" prop="user_id">
                        <el-input v-model="form.user_id" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="用户名" prop="user_name">
                        <el-input  v-model="form.user_name" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="form.password" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" style="text-align: left" prop="gender">
                        <br />
                        <el-select v-model="form.gender" placeholder="请选择性别">
                            <el-option label="男" value='0'></el-option>
                            <el-option label="女" value='1'></el-option>
                            <el-option label="双性" value='2'></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="form.email" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="phone">
                        <el-input v-model="form.phone" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="handleCancle('form')">取 消</el-button>
                    <el-button type="primary" @click="submitEdit('form')">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="添加账户" :visible.sync="dialogAddVisible">
                <el-form :model="form" ref="addForm" :rules="checkRules2" status-icon>
                    <el-form-item label="用户名" prop="user_name">
                        <el-input  v-model="form.user_name"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="form.password" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" style="text-align: left" prop="gender">
                        <br />
                        <el-select v-model="form.gender" placeholder="请选择性别">
                            <el-option label="男" value='0'></el-option>
                            <el-option label="女" value='1'></el-option>
                            <el-option label="双性" value='2'></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="form.email" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="phone">
                        <el-input v-model="form.phone" auto-complete="off"></el-input>
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
    import getApiPath from '../../../modules/getApiPath';
    import checkLogin from '../../../modules/checkLogin';

    export default {
        name: 'manage_accounts',
        data: function () {
            const validatePassword = (rule, value, callback) => {
                if (value === '' || value === null || value === undefined) {
                    callback(new Error('请输入密码'));
                } else {
                    callback();
                }
            };
            const validateEmail = (rule, value, callback) => {
                if( value === '' || value === null || value === undefined)
                    callback();
                else{
                    let reg=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/;
                    if( !reg.test(value) ) {
                        callback(new Error("邮箱格式不正确"));
                    }
                    else
                        callback();
                }
            };
            const validatePhone = (rule, value, callback) => {
                if( value === '' || value === null || value === undefined)
                    callback();
                else{
                    let reg=/^1(3|4|5|7|8)\d{9}$/;
                    if( !reg.test(value) ) {
                        callback(new Error("手机号不正确"));
                    }
                    else
                        callback();
                }
            };
            const validateGender = (rule, value, callback) => {
                if(value === '' || value === null || value === undefined)
                    callback(new Error('请选择性别'));
                else
                    callback();
            };
            const validateUser = ( rule, value, callback ) => {
                if(value === '' || value === null || value === undefined)
                    callback(new Error('请输入用户名'));
                else{
                    Axios.get(getApiPath('account/valid_account/' + value))
                        .then( (res) => {
                            if( res.status  === 200)
                                callback();
                            else
                                callback( new Error('该账户已存在'));
                        })
                        .catch( () =>{
                           callback(new Error('网络连接失败'));
                        });
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
                    user_id: '',
                    user_name: '',
                    password: '',
                    gender: '',
                    email: '',
                    phone: ''
                },
                checkRules: {
                    password: [{validator: validatePassword, trigger: 'blur'}],
                    email: [{validator: validateEmail, trigger: 'blur'}],
                    phone: [{validator: validatePhone, trigger: 'blur'}],
                    gender: [{validator: validateGender, trigger: 'blur'}]
                },
                checkRules2: {
                    user_name: [{validator: validateUser, trigger: 'blur'}],
                    password: [{validator: validatePassword, trigger: 'blur'}],
                    email: [{validator: validateEmail, trigger: 'blur'}],
                    phone: [{validator: validatePhone, trigger: 'blur'}],
                    gender: [{validator: validateGender, trigger: 'blur'}]
                },
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
                        Axios.put(getApiPath('account/accounts'), this.form)
                            .then((res) => {
                                if(res.status === 200) {
                                    this.$message(
                                        {
                                            type: 'success',
                                            duration: 1500,
                                            message: '账户信息修改成功'
                                        }
                                    );
                                    this.$refs[formName].resetFields();
                                    this.dialogFormVisible = false;

                                    this.loading = true;
                                    Axios.get(getApiPath('account/accounts'))
                                        .then((res) => {
                                            if(res.status !== 200) {
                                                this.$message({
                                                    type: 'error',
                                                    duration: 1500,
                                                    message: '获取所有账户信息失败，请检查网络连接'
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
                                                message: '获取所有账户信息失败，请检查网络连接'
                                            });
                                            this.loading = false;
                                        });

                                } else {
                                    this.$message(
                                        {
                                            type: 'error',
                                            duration: 1500,
                                            message: '账户信息修改失败'
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
                        Axios.post(getApiPath('account/accounts'), this.form)
                            .then((res) => {
                                if(res.status === 200) {
                                    this.$message(
                                        {
                                            type: 'success',
                                            duration: 1500,
                                            message: '新账户创建成功'
                                        }
                                    );
                                    this.$refs[formName].resetFields();
                                    this.dialogAddVisible = false;

                                    this.loading = true;
                                    Axios.get(getApiPath('account/accounts'))
                                        .then((res) => {
                                            if(res.status !== 200) {
                                                this.$message({
                                                    type: 'error',
                                                    duration: 1500,
                                                    message: '获取所有账户信息失败，请检查网络连接'
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
                                                message: '获取所有账户信息失败，请检查网络连接'
                                            });
                                            this.loading = false;
                                        });

                                } else {
                                    this.$message(
                                        {
                                            type: 'error',
                                            duration: 1500,
                                            message: '新账户失败'
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

                this.$set(this.form, 'gender', row.gender + '');
                this.dialogFormVisible = true;
            },
            gender(gender_num){
                if(gender_num === 0 )
                    return '男';
                else if ( gender_num === 1)
                    return '女';
                else
                    return '中性';
            },
            genderTag(gender_num){
                if(gender_num === 0 )
                    return 'success';
                else if ( gender_num === 1)
                    return 'danger';
                else
                    return 'info';
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
            Axios.get(getApiPath('account/accounts'))
                .then((res) => {
                    if(res.status !== 200) {
                        this.$message({
                            type: 'error',
                            duration: 1500,
                            message: '获取所有账户信息失败，请检查网络连接'
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
                        message: '获取所有账户信息失败，请检查网络连接'
                    });
                    this.loading = false;
                });
        }
    }
</script>

<style scoped>

</style>