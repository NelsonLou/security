// 系统配置参数
// const version = 'v1'
// const domain = process.env.NODE_ENV === 'production' ? 'i.weknet.cn' : process.env.NODE_ENV === 'release' ? 'i.t.weknet.cn' : 'i.d.weknet.cn'
const domain = process.env.NODE_ENV === 'production' ? 'sa.d.weknet.cn' : process.env.NODE_ENV === 'release' ? 'sa.d.weknet.cn' : 'sa.d.weknet.cn'
export const config = {
  // headers: {
  //   Accept: `application/vnd.ideabuy.${version}+json`
  // },
  url: `http://${domain}/backend/`, // 接口地址
  limit: 10 // 每页显示条目个数
}
// 系统基础接口映射
export const system = {
  login: 'account-login', // 登录
  modifyPwd: 'account-change-pwd', // 修改密码
  menu: 'permission-left', // 菜单列表
  logManage: 'logManage' // 日志管理
}
// 系统设置
export const setting = {
  // 用户管理
  users: 'account-list', // 用户列表
  usersAll: 'account-list-all', // 用户列表(公文)
  userAdd: 'account-add', // 添加用户
  userDel: 'account-delete', // 删除用户
  userBatchRemove: 'account-delete', // 批量删除用户
  userEdit: 'account-edit', // 编辑用户
  userInfo: 'account-detail', // 用户详情
  roleListAll: 'role-list-all', // 所有角色列表
  // 角色管理
  roleList: 'role-list', // 角色列表
  roleAdd: 'role-add', // 添加角色
  roleDelete: 'role-delete', // 删除角色
  roleEdit: 'role-edit', // 编辑角色
  roleDetail: 'role-detail', // 角色详情
  permissionRoleAdd: 'permission-role-add', // 编辑权限
  permissionRoleDetail: 'permission-role-detail', // 权限详细
  // 权限管理
  PList: 'permission-list', // 权限列表
  PType: 'permission-type', // 权限分类
  PAdd: 'permission-add', // 权限添加
  PEdit: 'permission-edit', // 权限编辑
  PDetail: 'permission-detail' // 权限详细
}

// 公文流转
export const file = {
  allReport: 'report-list', // 所有公文列表
  allDetail: 'report-detail', // 所有公文列表
  allDetailYw: 'report-detail-yw',
  reportAdd: 'report-add', // 公文添加
  reportEdit: 'report-edit', // 公文编辑
  reportDetail: '',
  reportDelete: '',
  uploadFiles: 'file-upload',
  receiptAdd: 'receipt-add', // 添加回执
  receiptEdit: 'receipt-edit', // 修改回执
  listRead: 'reporttimerefresh', // 判断列表时
  receiptRead: 'receipt-read', // 更新回执
  reportDeal: 'report-success', // 审核建议
  reportVerifyList: 'reportlist-examine', // 公文审核列表
  reportRelease: 'reportexamine-edit', // 民警审核发布公文
  reportEditByexamine: 'reportedit-byexamine' // 民警修改公文
}

// 值班概况
export const onDuty = {
  SWeekList: 'schedule-week-list', // 周排班列表
  Slist: 'schedule-list', // 总排班列表
  SNow: 'schedule-now', // 当前值班
  SAdd: 'schedule-add', // 批量增加排班
  weekSAdd: 'week-schedule-add', // 初始化周排班
  SAddSingle: 'schedule-add-single', // 添加单挑
  SEdit: 'schedule-edit', // 班次修改
  SDelete: 'schedule-delete', // 班次删除
  usersAll: 'account-list-all' // 用户下拉框
}

// 日志
export const log = {
  logList: 'log-list', // 日志列表
  logDetail: 'log-detail' // 日志详情
}
