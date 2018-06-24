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
            style="width: 75%; margin-top: 20px;"
            stripe
            border
            align="center">
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
                        label="学分"
                        sortable>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="room_name"
                        label="上课地点">
                </el-table-column>
                <el-table-column
                        min-width="300px"
                        align="center"
                        prop="introduction"
                        label="课程简介">
                </el-table-column>
        </el-table>

    </div>
</template>

<script>
    import Axios from 'axios';
    import getApiPath from '../../../../modules/getApiPath';
    import checkLogin from '../../../../modules/checkLogin';

    export default {
        name: "query_course",
        data() {
            return {
                keyword: '',
                results: [ ],
                loading: false
            }
        },
        methods: {
            handleSearch(keyword){
                this.loading = true;

                Axios.get( getApiPath('select/search/' + keyword))
                    .then( (res) => {
                        if( res.status === 200 ){
                            this.results = res.data['results'];

                        }else {
                            this.results = [];
                        }

                        this.loading = false;
                    })
                    .catch( (err) => {
                        this.$message({
                               type: 'error',
                           duration: 1500,
                            message: '查找课程失败，请检查网络连接'
                        });

                        this.loading = false;
                    });
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