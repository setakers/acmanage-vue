//system for students
const welcome = {
  title: '首页',
  path: 'welcome_sys'
};

const personal = {
  title: '个人信息系统',
  path: 'personal_sys'
};

const select = {
  title: '选课与退课',
  path: 'select_sys'
};

const score = {
  title: '考试与成绩',
  path: 'score_sys'
};

const resource = {
  title: '教学资源管理',
  path: 'resource_sys'
};

const account = {
  title: '用户账户管理',
  path: 'account_sys'
};

const STU_FUNC = [welcome, personal, select, score];
const TEACH_FUNC = [welcome, personal, select, score, resource];
const ADMIN_FUNC = [welcome, select, score, resource, account];

const sys = {
  "student": STU_FUNC,
  "teacher": TEACH_FUNC,
  "admin": ADMIN_FUNC
};

export default sys;
