# TODOs
## 注意，所有涉及时间的除了time_slot，数据库中其他均以TIMESTAMP存储，插入时若前端未指明，则后端用CURRENT_TIMESTAMP处理
<br />

## 用户登陆

- [ ] localstorage保存内容
由于数据库与最初测试的数据结构不一致，localstorage中保存的内容要有所改
需要一个updateAccessToken的接口，或者直接修改会话限制时间为900s(15min)


## 考试与成绩
- [ ] `GET /api/score/publicity`
成功状态码：200
失败状态码：204
需求：获取score_query表中所有的数据，最终获取到的数据是一个数组，该数组如下, 数组成员每个属性的键名请与下面的范例一样，最后将该数组命名为tableData后返回
```javascript
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
```

- [ ] `GET /api/score/stuscore/:student_id`
成功状态码：200
失败状态码：204
需求：依据不同的student_id获取其所有课程的成绩，返回数组命名为tableData
```javascript
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
```

- [ ] `GET /api/score/queryexam/:student_id`
成功状态码：200
失败状态码：204
需求：依据不同的student_id获取其所有的考试信息，返回数组命名为tableData
```javascript
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
```

- [ ] `GET /api/score/teach_courses/:teacher_id`
成功状态码：200
失败状态码：204
需求：依据不同的teacher_id获取其所有的教学班信息，返回数组命名为courses
```javascript
courses: [
               {
                       course_id: 456,
                     course_name: 'xxx学',
                          credit: 3.5,
                    introduction: '该门课程是关于xxx，将对xxx进行教学',
                    total_students: 56,     //表示该课程所有的学生数
                      unmarked_stu: 12      //表示该课程没有成绩的学生数

               },

               {
                    ......
               }
               .......
           ]
```


- [ ] `GET /api/score/stu_of_course/:course_id`
成功状态码：200
失败状态码：204
需求：依据不同的course_id获取其所有的学生信息，返回数组命名为students
```javascript
students: [
               {
                      student_id: 123,
                    student_name: 'xxx',
                           score: 89    //score若为空，请赋值为null
               },

               {
                    ......
               }
               .......
           ]
```


- [ ] `PUT /api/score/input_score`
成功状态码：200
失败状态码：204
需求：将成绩信息录入数据库，传给后端的数据格式类似下面的样例，其中每个score是之前传输来的没有成绩的学生，输入之后有了成绩，可能只录入了部分成绩，并非所有都录入了
注意：下列的数据最外层可能还嵌套了一层，收到数据后先用console.log看一下，如果不是下列的格式请联系前端
```javascript
{
   course_id:  456，
      scores:  [
                    {
                        student_id: 123,
                        student_name: 'xxx',
                        score: 12,
                    },
                    {
                        student_id: 456,
                        student_name: 'xxx',
                        score: 34,
                    },
                    {
                        student_id: 789,
                        student_name: 'xxx',
                        score: 56,
                    }
                ]
}
```

- [ ] `POST /api/score/add_query_score_change`
成功状态码：200
失败状态码：204
需求：新增修改成绩请求，插入到表scope_query中，传给后端的数据格式类似下面的样例
注意：下列的数据最外层可能还嵌套了一层，收到数据后先用console.log看一下，如果不是下列的格式请联系前端
```javascript
{
          query_id: null,
        teacher_id: 123,
        student_id: 456,
         course_id: 789,
         old_score: 56,
         new_score: 65,
            reason: 'lalalala',
             state: 2,
        query_time: null,   //该处插入时直接赋值为null，sql中设置了默认值会自动插入
         deal_time: null,   //该值此时先为null
};
```

- [ ] `GET /api/score/score_change_query`
成功状态码：200
失败状态码：204
需求：获取score_query表中所有的state为2的数据，最终获取到的数据是一个数组，该数组如下, 数组成员每个属性的键名请与下面的范例一样，最后将该数组命名为tableData后返回
```javascript
tableData: [
               {
                     query_id: 123456
                     teacher_id: 12
                     teacher_name: '2016-05-02',
                     student_id: 34
                     student_name: '王小虎',
                     course_id: 56
                     course_name: '上海市普陀区金沙江路 1518 弄',
                     old_score: 12,
                     new_score: 98,
                     reason: '124',
                     state: 2,
                     query_time: 'xxxx-xx-xx',
                     deal_time: null,
               },
               {
                    ......
               }
               .......
           ]
```

- [ ] `PUT /api/score/handle_query`
成功状态码：200
失败状态码：204
需求：修改score_query 表中 query_id对应的请求的state和deal_time
注意：下列的数据最外层可能还嵌套了一层，收到数据后先用console.log看一下，如果不是下列的格式请联系前端
```javascript
{
     query_id: 456,
        state: 1,
    deal_time: 1280977330748
}
```

