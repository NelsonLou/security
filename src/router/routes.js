// Vue Router 路由配置
import NotFound from '@/pages/NotFound'
import Login from '@/pages/Login'
import Layout from '@/pages/Layout'
import Guide from '@/pages/guide'
// 初始化修改密码
import changePwd from '@/pages/changePwd'

// 值班概况
import OnDuty from '@/pages/onduty/OnDuty'

// 权限管理
import Users from '@/pages/rbac/Users'
import Role from '@/pages/rbac/Role'
import permission from '@/pages/rbac/Permission'

// 业主情况
import Overview from '@/pages/owner/Overview'
import Statistics from '@/pages/owner/Statistics'

// 待办事务
import List from '@/pages/todo/List'

// 公文流转
import AllFile from '@/pages/file/All'
import toBeAnnounced from '@/pages/file/toBeAnnounced'

// 网络预警
import New from '@/pages/network/New'
import Past from '@/pages/network/Past'

// 日志管理
import log from '@/pages/log/log'

// 站内信
import Message from '@/pages/Message'

const routes = [
  {
    path: '*',
    name: '404',
    component: NotFound
  }, {
    path: '/login',
    name: '登录',
    component: Login
  }, {
    path: '/changePwd',
    name: '修改密码',
    component: changePwd
  }, {
    path: '/guide',
    name: '引导页',
    component: Guide
  }, {
    path: '/',
    redirect: '/guide',
    name: '值班概况',
    component: Layout,
    children: [
      {
        path: '/onDuty',
        name: '值班概况',
        component: OnDuty
      },
      {
        path: '/message',
        name: '站内信',
        component: Message
      }
    ]
  }, {
    path: '/owner',
    redirect: '/owner/overview',
    name: '业务情况',
    component: Layout,
    children: [
      {
        path: '/owner/overview',
        name: '业务概况',
        component: Overview
      }, {
        path: '/owner/statistics',
        name: '业务统计',
        component: Statistics
      }
    ]
  }, {
    path: '/todo',
    redirect: '/todo/list',
    name: '待办事务',
    component: Layout,
    children: [
      {
        path: '/todo/list',
        name: '全部事务',
        component: List
      }
    ]
  }, {
    path: '/file',
    name: '公文流转',
    redirect: '/file/all',
    component: Layout,
    children: [
      {
        path: '/file/all',
        name: '全部公文',
        component: AllFile,
        beforeEnter: (to, from, next) => {
          let permission = JSON.parse(localStorage.getItem('permission_list'))
          if (permission) {
            let tempper = permission.reportList.status
            if (tempper) {
              next()
            } else {
              next({'path': '/file/tobeannounced'})
            }
          }
        }
      }, {
        path: '/file/tobeannounced',
        name: '待审核公文',
        component: toBeAnnounced
      }
    ]
  }, {
    path: '/network',
    redirect: '/network/new',
    name: '网络预警',
    component: Layout,
    children: [
      {
        path: '/network/new',
        name: '最新预警',
        component: New
      }, {
        path: '/network/past',
        name: '往期预警',
        component: Past
      }
    ]
  }, {
    path: '/log',
    redirect: '/log/log',
    name: '公文流转日志',
    component: Layout,
    children: [
      {
        path: '/log/log',
        name: '日志',
        component: log
      }
    ]
  }, {
    path: '/rbac',
    redirect: '/rbac/users',
    name: '权限管理',
    component: Layout,
    children: [
      {
        path: '/rbac/users',
        name: '用户管理',
        component: Users
      }, {
        path: '/rbac/role',
        name: '角色管理',
        component: Role
      }, {
        path: '/rbac/permission',
        name: '权限管理',
        component: permission
      }
    ]
  }
]

export default routes
