import Mock from 'mockjs'

// Mock 数据模拟
const bootstrap = () => {
  // 登录
  // Mock.mock(/\/login/, {
  //   'code': 1,
  //   'msg': '登录成功',
  //   'data': {
  //     'user_info': {
  //       'user_id': 1,
  //       'real_name': '火云邪神'
  //     }
  //   }
  // })

  // 获取菜单
  Mock.mock(/\/menu/, {
    'code': 1,
    'msg': '获取菜单成功',
    'data': {
      menu: [
        {
          name: '修改密码',
          path: '/changePwd'
        }, {
          name: '值班概况',
          path: '/onDuty/onDuty'
        }, {
          name: '业主情况',
          path: '/owner',
          children: [
            {
              name: '业主概况',
              path: '/owner/overview'
            }, {
              name: '业主统计',
              path: '/owner/statistics'
            }
          ]
        }, {
          name: '待办事务',
          path: '/todo',
          children: [
            {
              name: '全部事务',
              path: '/todo/list'
            }
          ]
        }, {
          name: '公文流转',
          path: '/file',
          children: [
            {
              name: '全部公文',
              path: '/file/all'
            }, {
              name: '已通过公文',
              path: '/file/passed'
            }, {
              name: '未通过公文',
              path: '/file/fail'
            }
          ]
        }, {
          name: '网络预警',
          path: '/network',
          children: [
            {
              name: '最新预警',
              path: '/network/new'
            }, {
              name: '往期预警',
              path: '/network/past'
            }
          ]
        }, {
          name: '日志管理',
          path: '/log',
          children: [
            {
              name: '日志',
              path: '/log/log'
            }
          ]
        }, {
          name: '权限管理',
          path: '/rbac',
          children: [
            {
              name: '用户管理',
              path: '/rbac/users'
            }, {
              name: '角色管理',
              path: '/rbac/role'
            }, {
              name: '权限管理',
              path: '/rbac/permission'
            }
          ]
        }
      ]
    }
  })

  // 用户管理
  // Mock.mock(/\/users/, {
  //   'code': 1,
  //   'data': {
  //     'admin_list': [
  //       {
  //         'admin_birthday': '2017-10-30',
  //         'admin_id': 1,
  //         'admin_name': 'admin',
  //         'admin_nick': 'admin',
  //         'admin_sex': 1,
  //         'created_at': '2017-10-30 11:30:00'
  //       }
  //     ],
  //     'pages': 1,
  //     'total': 1
  //   }
  // })

  // 日志管理
  // Mock.mock(/\/fileLog/, {
  //   'code': 1,
  //   'data': {
  //     'file_list': [
  //       {
  //         'admin_name': 'admin',
  //         'login_time': '2017-10-30 17:48:04',
  //         'download_ip': '172.10.10.62',
  //         'upload_ip': '172.10.10.62',
  //         'act_state': 1,
  //         'upload_time': '2017-10-30 17:48:04',
  //         'download_time': '2017-10-30 17:48:04',
  //         'file_format': '.PDF',
  //         'act_type': '上传公文'
  //       }, {
  //         'account_id': 'admin',
  //         'login_time': '2017-10-30 17:48:04',
  //         'download_ip': '172.10.10.62',
  //         'upload_ip': '172.10.10.62',
  //         'act_state': 1,
  //         'download_time': '2017-10-30 17:48:04',
  //         'file_format': '.PDF',
  //         'act_type': '上传公文'
  //       }, {
  //         'account_id': 'admin',
  //         'login_time': '2017-10-30 17:48:04',
  //         'download_ip': '172.10.10.62',
  //         'upload_ip': '172.10.10.62',
  //         'act_state': 1,
  //         'download_time': '2017-10-30 17:48:04',
  //         'file_format': '.PDF',
  //         'act_type': '上传公文'
  //       }, {
  //         'account_id': 'admin',
  //         'login_time': '2017-10-30 17:48:04',
  //         'download_ip': '172.10.10.62',
  //         'upload_ip': '172.10.10.62',
  //         'act_state': 1,
  //         'download_time': '2017-10-30 17:48:04',
  //         'file_format': '.PDF',
  //         'act_type': '上传公文'
  //       }
  //     ],
  //     'pages': 1,
  //     'total': 1
  //   }
  // })

  // 修改密码
  // Mock.mock(/\/modifyPwd/, {
  //   'code': 1,
  //   'msg': '密码修改成功'
  // })

  // 退出
  // Mock.mock(/\/logout/, {
  //   'code': 1,
  //   'msg': '登出成功'
  // })
}

export default {
  bootstrap
}
