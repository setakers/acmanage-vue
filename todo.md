# TODOs
## 用户登陆

- [] localstorage保存内容
由于数据库与最初测试的数据结构不一致，localstorage中保存的内容要有所改变

## 考试与成绩
- [ ] `GET /api/score/publicity`

成功状态码：200
失败状态码：204
需求：获取score_query表中所有的数据，最终获取到的数据是一个数组，该数组如下, 数组成员每个属性的键名请与下面的范例一样，最后将该数组命名为tableData后返回
tableData: [
               {
                     teacher_name: '2016-05-02',
                     student_name: '王小虎',
                     course_name: '上海市普陀区金沙江路 1518 弄',
                     old_score: 12,
                     new_score: 98,
                     reason: '124',
                     state: 1,
                     query_time: 'time1',
                     deal_time: 'time',
               },

               {
                    ......
               }
               .......
           ]

- [ ] `GET /api/score/stuscore/:student_id`
成功状态码：200
失败状态码：204
需求：依据不同的student_id获取其所有课程的成绩，返回数组命名为tableData
tableData: [
               {
                     teacher_name: '王小虎',
                     course_name: 'xx学',
                     score: 100,
               },

               {
                    ......
               }
               .......
           ]

- [ ] `GET /api/score/queryexam/:student_id`
成功状态码：200
失败状态码：204
需求：依据不同的student_id获取其所有的考试信息，返回数组命名为tableData
tableData: [
               {
                     course_name: 'xx学'
                     teacher_name: '王小虎',
                     room_name: '东6-200',
                     time: '2018-07-12',
               },

               {
                    ......
               }
               .......
           ]

