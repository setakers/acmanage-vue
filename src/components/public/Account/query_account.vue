<template>
    <div class="query_course">
        <el-input
                placeholder="输入要查找的内容，模糊搜索"
                v-model="keyword"
                style="width: 50%;"
                prefix-icon="el-icon-search"
                clearable
                @change="handleSearch"
        >
        </el-input>

        <el-table
                v-loading="loading"
                element-loading-text="查找中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                :data="results"
                style="margin-top: 20px;"
                stripe
                border
                align="center">
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
                    prop="character"
                    label="角色"
                    sortable>
                <template slot-scope="scope">
                    <el-tag :type="roleTag(scope.row.character)" style="font-size: 1.2em">{{ handleRole(scope.row.character) }}</el-tag>
                </template>
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
                    min-width="300px"
                    align="center"
                    prop="email"
                    label="邮箱">
            </el-table-column>
            <el-table-column
                    min-width="300px"
                    align="center"
                    prop="phone"
                    label="手机号">
            </el-table-column>
        </el-table>

    </div>
</template>

<script>
    import Axios from 'axios';
    import getApiPath from '../../../modules/getApiPath';
    import checkLogin from '../../../modules/checkLogin';

    export default {
        name: "query_account",
        data() {
            return {
                keyword: '',
                results: [ ],
                loading: false
            }
        },
        methods: {
            handleSearch(keyword){
                if(keyword === ''){
                    this.$notify({
                        type: 'warning',
                        duration: 1500,
                        message: '要搜索的内容不能为空',
                        position: 'top-left'
                    });
                    return;
                }
                this.loading = true;

                Axios.get( getApiPath('account/query_account/' + keyword))
                    .then( (res) => {
                        if( res.status === 200 ){
                            this.results = res.data['results'];

                        }else {
                            this.results = [];
                        }

                        this.loading = false;
                    })
                    .catch( () => {
                        this.$message({
                            type: 'error',
                            duration: 1500,
                            message: '查找账户失败，请检查网络连接'
                        });

                        this.loading = false;
                    });
            },
            handleRole(character){
              if(character === 0)
                  return '学生';
              else if( character === 1)
                  return '教师';
              else
                  return '管理员';
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
                    return 'primary';
                else if ( gender_num === 1)
                    return 'danger';
                else
                    return 'info';
            },
            roleTag(character){
                if(character === 0)
                    return 'primary';
                else if( character === 1)
                    return 'danger';
                else
                    return 'success';
            }
        },
        beforeMount: function() {
            checkLogin(this);
        }
    }
</script>

<style scoped>
    .query_course{
        text-align: left;
        margin-bottom: 20px;
    }
</style>