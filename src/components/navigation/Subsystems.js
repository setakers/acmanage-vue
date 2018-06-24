import * as funcs from './Functions';

const personal = {
    student: [ funcs.personal_info, funcs.change_info, funcs.change_passwd ],
    teacher: [ funcs.personal_info, funcs.change_info, funcs.change_passwd ]
};
const select = {
    student: [ funcs.stu_select, funcs.select_status, funcs.query_course, funcs.personal_table ],
    teacher: [ funcs.teach_courses, funcs.course_students, funcs.apply_course, funcs.open_course_status],
    admin: [ funcs.deal_select, funcs.deal_course_apply]
};
const score = {
    student: [ funcs.deal_publicity, funcs.stu_query_score, funcs.query_exam ],
    teacher: [ funcs.deal_publicity, funcs.teach_query_score, funcs.input_score, funcs.apply_score_change ],
    admin: [ funcs.deal_publicity, funcs.deal_score_change ]
};
const resource = {
    student: [ funcs.rent_course_publicity, funcs.rent_course ],
    teacher: [ funcs.rent_course_publicity, funcs.rent_course ],
    admin: [ funcs.rent_course_publicity, funcs.manage_courses, funcs.manage_classrooms, funcs.deal_course_rent]
};
const account = {
    admin: [ funcs.manage_accounts, funcs.change_role, funcs.query_account]
};

//保持结构完整
const useless = {
  title: '',
  path: '',
  icon: ''
};
const welcome = {
  student: [ useless ],
  teacher: [ useless ],
  admin: [ useless ]
};

const functions = {
  welcome_sys: welcome,
  personal_sys: personal,
  select_sys: select,
  score_sys: score,
  resource_sys: resource,
  account_sys: account
};

export default functions;