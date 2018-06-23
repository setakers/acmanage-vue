<template>
  <div class=" personal_info ">
    <template>
      <el-table
              :data="tableData"
              style="width: 50%;"
              border
              stripe
              :show-header="false"
      >
        <el-table-column
                prop="key"
                label="属性"
                width="350"
                align="center">
          <template slot-scope="scope">
            <em style="font-size: 1.2em">{{ title(scope.row.key) }}</em>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                prop="value"
                label="值"
                style="font-size: 2em">
          <template slot-scope="scope2">
            <el-tag type="info" style="font-size: 1.2em">{{ countValue(scope2.row.key, scope2.row.value) }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>
<script>

    import checkLogin from '../../modules/checkLogin';
    import Axios from 'axios';
    import getApiPath from '../../modules/getApiPath';

    export default {
        name: "person_info",
        data() {
            return {
                personal_info: {
                    user_name: localStorage.getItem('user_name'),
                    gender: localStorage.getItem('gender'),
                    character: localStorage.getItem('character'),
                    email: localStorage.getItem('email'),
                    phone: localStorage.getItem('phone'),
                    class: localStorage.getItem('class'),
                    admission_date: localStorage.getItem('admission_date'),
                    college: localStorage.getItem('college'),
                    major: localStorage.getItem('major'),
                    num_of_courses:null
                },
                tableData: []
            }
        },
        methods: {
            gender(gender_id) {
                if (gender_id === '0')
                    return "男";
                else if (gender_id === '1')
                    return "女";
                else
                    return "中性";
            },
            role(character) {
                if (character === "0")
                    return "学生";
                else
                    return "教师";
            },
            title(key) {
                switch (key) {
                    case 'user_name':
                        return "用户名";
                    case 'gender':
                        return "性别";
                    case 'character':
                        return "身份";
                    case 'email':
                        return "邮箱地址";
                    case 'phone':
                        return "联系电话";
                    case 'class':
                        return "班级";
                    case 'admission_date':
                        return "注册日期";
                    case 'college':
                        return "学院";
                    case 'major':
                        return "专业";
                    case 'num_of_courses':
                        if (this.personal_info.character === '0')
                            return "所选的课程数";
                        else
                            return "任课课程数";
                    default:
                        return "未知";
                }
            },
            countValue(key, value) {
                if (key === 'gender')
                    return this.gender(value);
                else if (key === 'character')
                    return this.role(value);
                else
                    return value;
            }
        },
        beforeMount: function () {
            checkLogin(this);
            if (localStorage.getItem('student_id')!=='null') {
                console.log('123');
                Axios.get(getApiPath('info/stu/' + localStorage.getItem('student_id')))
                    .then((res) => {
                        if (res.status === 200) {
                            for (let prop in res.data) {
                                console.log(prop+" : "+res.data[prop]);
                                this.personal_info[prop] = res.data[prop];
                            }

                            for (var key in this.personal_info) {
                                if (localStorage.getItem('character') === '1') {
                                    if (key === 'major' || key === 'admission_date' || key === 'class')
                                        continue;
                                }
                                this.tableData.push(
                                    {
                                        'key': key,
                                        'value': this.personal_info[key]
                                    }
                                );
                            }
                        }
                    })
                    .catch((err) => {
                        this.$message({
                            type: 'error',
                            duration: 1500,
                            message: '获取部分个人信息失败'
                        });
                    });

            } else {
                console.log(456);
                Axios.get(getApiPath('info/teacher/' + localStorage.getItem('teacher_id')))
                    .then((res) => {
                        if (res.status === 200) {
                            for (let prop in res.data)
                                this.personal_info[prop] = res.data[prop];
                        }

                        for (var key in this.personal_info) {
                            if (localStorage.getItem('character') === '1') {
                                if (key === 'major' || key === 'admission_date' || key === 'class')
                                    continue;
                            }
                            this.tableData.push(
                                {
                                    'key': key,
                                    'value': this.personal_info[key]
                                }
                            );
                        }
                    }).catch((err) => {
                    this.$message({
                        type: 'error',
                        duration: 1500,
                        message: '获取部分个人信息失败'
                    });
                });
            }


        }
    }
</script>

<style scoped>
  .el-table th {
    font-size: 2em;
  }
</style>