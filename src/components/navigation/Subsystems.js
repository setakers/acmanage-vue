import * as funcs from './Functions';

const personal = {
    student: [ funcs.personal_info, funcs.change_info, funcs.change_personal_passwd ],
    teacher: [ funcs.personal_info, funcs.change_info, funcs.change_personal_passwd ]
};
const select = {
    student: [ funcs.stu_select, funcs.query_course, funcs.personal_table ],
    teacher: [],
    admin: []
};
const score = {
    student: [ funcs.deal_publicity, funcs.stu_query_score, funcs.query_exam ],
    teacher: [ funcs.deal_publicity, funcs.teach_query_score, funcs.input_score, funcs.apply_score_change ],
    admin: [ funcs.deal_publicity, funcs.admin_query_score, funcs.deal_score_change ]
};
const resource = {
    teacher: [ funcs.apply_course ],
    admin: [ funcs.add_edit_course, funcs.add_edit_class, funcs.deal_apply]
};
const account = {
    admin: [ funcs.add_del_account, funcs.change_role, funcs.query_account ]
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