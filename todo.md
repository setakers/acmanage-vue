# TODOs
##注意，所有涉及时间的除了time_slot，数据库中其他均以TIMESTAMP存储，插入时若前端未指明，则后端用CURRENT_TIMESTAMP处理
<br />

## 用户登陆

- [] localstorage保存内容
由于数据库与最初测试的数据结构不一致，localstorage中保存的内容要有所改
登录后保存第一张表的值，以及student_id 或者 teacher_id
需要一个updateAccessToken的接口，或者直接修改会话限制时间为900s(15min)



## 考试与成绩
- [ ] `GET /api/score/publicity`
成功状态码：200
失败状态码：204
需求：获取score_query表中所有的数据，最终获取到的数据是一个数组，该数组如下, 数组成员每个属性的键名请与下面的范例一样，最后将该数组命名为tableData后返回 后端debug完
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
需求：依据不同的student_id获取其所有课程的成绩，返回数组命名为tableData 后端debug完
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
需求：依据不同的student_id获取其所有的考试信息，返回数组命名为tableData 后端debug完毕
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

- [ ] `GET /api/info/stu/:student_id` 后端debug通过
成功状态码：200
失败状态码：204
需求：依据不同的student_id获取其个人信息，需要的信息如下
```javascript
{
             class: 'xx班',
    admission_date: 'xxxxxx',
           college: 'xxxxx学院',
             major: '专业',
    num_of_courses:  5   //所上的课程数
}
```

- [ ] `GET /api/info/teacher/:teacher_id`
成功状态码：200
失败状态码：204
需求：依据不同的teacher_id获取其个人信息，需要的信息如下
```javascript
{
           college: 'xxxxx学院',
    num_of_courses:  5   //所教的课程数
}
```

- [ ] `PUT /api/info/userinfo`
成功状态码：200
失败状态码：204
需求：修改user表中的值
注意：下列的数据最外层可能还嵌套了一层，收到数据后先用console.log看一下，如果不是下列的格式请联系前端
```javascript
{
     user_id:  '',
   user_name:  '',
      gender:  2 (可能是string类型),
       email:  ''(可能是null),
       phone:  ''(可能是null)
}
```

- [ ] `POST /api/info/userinfo`
成功状态码：200
失败状态码：204
需求：所给的数据如下，请参考登录部分代码如何使用
```javascript
 var userinfo = btoa(JSON.stringify({
                         user_id:   localStorage.getItem('user_id'),
                        password:   this.form.old_passwd
                    }));
```


- [ ] `GET /api/info/userinfo`
成功状态码：200
失败状态码：204
需求：检测该密码是否是旧密码，所给的数据如下，请参考登录部分代码如何使用，在mysql中时请使用PASSWORD函数处理
```javascript
 var userinfo = btoa(JSON.stringify({
                         user_id:   localStorage.getItem('user_id'),
                        password:   this.form.old_passwd
                    }));
```

- [ ] `PUT /api/info/changePasswd`
成功状态码：200
失败状态码：204
需求：修改给定的user_id的密码，所给的数据如下，请参考登录部分代码如何使用，插入mysql中时请使用PASSWORD函数处理
```javascript
var info = JSON.stringify({
                            user_id: localStorage.getItem('user_id'),
                           password: this.form.new_passwd1
                        });
```

- [ ]  `GET select/query_courses`
成功状态码：200
失败状态码：204
需求：返回所有课程, 返回的数组命名为courses
```javascript
courses: [
                    {
                    course_id: 456,
                    course_name: 'xxx学',
                    room_name: 'xxx',
                    credit: 3.5,
                    introduction: '该门课程是关于xxx，将对xxx进行教学',
                    },
                    {
                        course_id: 123,
                        course_name: 'xxx学',
                        room_name: 'xxx',
                        credit: 3.5,
                        introduction: '该门课程是关于xxx，将对xxx进行教学',
                    }
                ],
```


- [ ]  `GET select/selected/:student_id`
成功状态码：200
失败状态码：204
需求：从attend表中返回该学生选择的所有课程, 返回的数组命名为'selected'
```javascript
selected: [
                    {
                    course_id: 456,
                    course_name: 'xxx学',
                    room_name: 'xxx',
                    credit: 3.5,
                    introduction: '该门课程是关于xxx，将对xxx进行教学',
                    },
                    {
                        course_id: 123,
                        course_name: 'xxx学',
                        room_name: 'xxx',
                        credit: 3.5,
                        introduction: '该门课程是关于xxx，将对xxx进行教学',
                    }
                ],

```


- [ ]  `GET select/selected_status/:student_id`
成功状态码：200
失败状态码：204
需求：从select_course表中返回该生所有选择的课程,返回的数组命名为'status'
```javascript
status: [
                    {
                    course_id: 456,
                    course_name: 'xxx学',
                    room_name: 'xxx',
                    credit: 3.5,
                    introduction: '该门课程是关于xxx，将对xxx进行教学',
                    state: 1
                    },
                    {
                        course_id: 123,
                        course_name: 'xxx学',
                        room_name: 'xxx',
                        credit: 3.5,
                        introduction: '该门课程是关于xxx，将对xxx进行教学',
                        state: 0
                    }
                ],
```


- [ ] `POST /api/select/select_course`
成功状态码：200
失败状态码：204
需求：学生选择一门课程，将下面的数据插入到表select_course中
注意：下列的数据最外层可能还嵌套了一层，收到数据后先用console.log看一下，如果不是下列的格式请联系前端
```javascript
{
    course_id: course_id,
   student_id: localStorage.getItem('student_id'),
        state: 2 //state为2表示待定
}
```

- [ ] `GET /api/select/search/:keyword`
成功状态码：200
失败状态码：204
需求: 根据keyword来对所有课程进行模糊匹配
注意：不为空的时候返回200和数组，为空的时候返回204
```javascript
results: [
                    {
                    course_id: 456,
                    course_name: 'xxx学',
                    room_name: 'xxx',
                    credit: 3.5,
                    introduction: '该门课程是关于xxx，将对xxx进行教学',
                    },
                    {
                        course_id: 123,
                        course_name: 'xxx学',
                        credit: 3.5,
                        room_name: 'xxx',
                        introduction: '该门课程是关于xxx，将对xxx进行教学',
                    }
                ],
```

- [ ] `GET /api/select/freerooms`
成功状态码：200
失败状态码：204
需求: 返回所有空间教室,空闲教室为不被course表中state为1的课程使用（state为1表示正在进行中，为0表示已结课），返回数组命名为rooms
注意: 不为空时返回200和数组, 为空时返回204
```javascript
room: [
                    {
                         classroom_id: 250,
                         room_name: '东3-200',
                         capacity: 100
                    },
                    {
                         classroom_id: 251,
                         room_name: '东3-201',
                         capacity: 200
                    }
                ],
```


- [ ] `POST /api/select/open_course`
成功状态码：200
失败状态码：204
需求: 教师申请开课，将下列数据插入到open_course表中
```javascript
var open_info = JSON.stringify({
                            teacher_id:  localStorage.getItem('teacher_id'),
                            course_name:  this.form.course_name,
                            credit:  this.form.credit,
                            introduction:  this.form.introduction,
                            classroom_id:  this.form.classroom_id,
                            state: 2
                        });
```


- [ ]  `GET select/open_courses_status/:teacher_id`
成功状态码：200
失败状态码：204
需求：从open_course表中返回该教师所有的申请,返回的数组命名为'open_courses'
```javascript
open_courses: [
                    {
                        course_name:  'xxx',
                        credit:  3.5,
                        introduction:  'xxxxxxxxxx',
                        room_name:  'xxx',
                        state: 2
                    },
                    {
                        course_name:  'xxx',
                        credit:  2.0,
                        introduction:  'asd',
                        room_name:  'adg',
                        state: 1
                    },
                ],
```


- [ ]  `GET select/all_select_courses`
成功状态码：200
失败状态码：204
需求：从select_course表中返回所有state为2的申请,返回的数组命名为'tableData'
```javascript
tableData: [
            {
                query_id: 'xx',
                student_id: 'xx',
                student_name: '王小虎',
                course_id: 'xx',
                course_name: '上海市普陀区金沙江路 1518 弄',
                teacher_name: 'xx'
            }
            ,
            {
                query_id: 'xx',
                student_id: 'xx',
                student_name: '王小虎',
                course_id: 'xx',
                course_name: '上海市普陀区金沙江路 1518 弄',
                teacher_name: 'xx'
            }
        ]
```



- [ ]  `PUT select/deal_select`
成功状态码：200
失败状态码：204
需求：根据下面query_id修改其state，如果state为1（即同意选课）则再将course_id和student_id插入到选课中(attend)
```javascript
var deal_select = JSON.stringify({
                          query_id: query.query_id,
                         course_id: query.course_id,
                        student_id: query.student_id,
                             state: operation
                    });

```



- [ ]  `GET select/all_open_course`
成功状态码：200
失败状态码：204
需求：从open_course表中返回所有state为2的申请,返回的数组命名为'tableData'
```javascript
tableData: [
            {
                       open_id: 'xxx',
                    teacher_id: 'xxx',
                  teacher_name: 'xxx',
                   course_name: 'xx',
                        credit: 3.5,
                  introduction: 'xxx',
                  classroom_id: 'xxx',
                     room_name: 'xxx'
            }
        ]
```



- [ ]  `PUT select/deal_open_course`
成功状态码：200
失败状态码：204
需求：根据下面open_id修改其state，如果state为1（即同意开课），则先将值插入到course表中（即先建立一个新的course），然后在
teach表中插入teacher_id和新生成的course_id

```javascript
var deal_open = JSON.stringify({
                             open_id: query.open_id,
                          teacher_id: query.teacher_id,
                         course_name: query.course_name,
                              credit: query.credit,
                        introduction: query.introduction,
                        classroom_id: query.classroom_id,
                               state: operation
                    });
```


