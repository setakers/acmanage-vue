//subsystem of personal
export const PERSONAL= [
  {
    title: '个人信息',
    path: '/person_info',
    icon: 'el-icon-info'
  },
  {
    title: '个人课表',
    path: '/person_table',
    icon: 'el-icon-date'
  },
  {
    title: '修改个人信息',
    path: '/change_info',
    icon: 'el-icon-edit'
  }
];


//this is just for test
export const BILLITEM = [
  {
    icon: 'el-icon-star-on',
    title: '所有账单',
    sublist: [
      {
        path: '/Dday',
        title: '账单明细'
      },
      {
        path: '/Tday',
        title: '账单总额'
      }
    ]
  },
  {
    icon: 'el-icon-upload',
    path: 'ctyle',
    title: '表单样式',
    sublist: [
      {
        path: '/Basicfrom',
        title: '基本'
      },
      {
        path: '/Upflie',
        title: '文件上传'
      }
    ]
  },
  {
    icon: 'el-icon-setting',
    title: '图表样式',
    sublist: [
      {
        path: '/Ccurve',
        title: '曲线图'
      },
      {
        path: '/Ccolumn',
        title: '柱状图'
      },
      {
        path: '/Cpie',
        title: '饼状图'
      },
      {
        path: '/Cannular',
        title: '环形图'
      },
      {
        path: '/Cblend',
        title: '地图'
      }
    ]
  },
  {
    icon: 'el-icon-menu',
    path: '/tableplugin',
    title: '数据axios请求'
  },
  {
    icon: 'el-icon-date',
    path: '/drag',
    title: '消费总结'
  }
];
