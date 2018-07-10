import axios from '@/api/axios'
// import * as api from '@/api'
import {Message} from 'element-ui'

const state = {
  is_first: localStorage.getItem('is_first') || 1,
  loading: false,
  menu: JSON.parse(localStorage.getItem('menu')) || [],
  menuActive: localStorage.getItem('menuActive') || '/onDuty',
  menuOpened: localStorage.getItem('menuOpened') || '',
  unreadcount: 0,
  unfinshedcount: 0,
  activeTodo: 'all',
  permission_list: JSON.parse(localStorage.getItem('permission_list')) || [],
  user: JSON.parse(localStorage.getItem('user')) || []
}
const getters = {
  getLoading: state => state.loading,
  getMenu: state => state.menu,
  getMenuActive: state => state.menuActive,
  getMenuOpened: state => state.menuOpened,
  getUnreadcount: state => state.unreadcount,
  getUnfinshedcount: state => state.unfinshedcount
}
const mutations = {
  // 加载状态
  LOADING: (state, status) => {
    state.loading = status
  },
  // 获取菜单
  MENU: (state, data) => {
    state.menu = data
    localStorage.setItem('menu', JSON.stringify(data))
  },
  // 激活菜单
  ACTIVE_MENU: (state, data) => {
    state.menuActive = data
    localStorage.setItem('menuActive', data)
  },
  // 打开子菜单
  OPEN_CHILD_MENU: (state, data) => {
    state.menuOpened = data
    localStorage.setItem('menuOpened', data)
  },
  // 关闭子菜单
  CLOSE_CHILD_MENU: (state) => {
    state.menuOpened = ''
    localStorage.removeItem('menuOpened')
  },
  // 重置菜单
  RESET_MENU: (state) => {
    state.menuActive = ''
    state.menuOpened = ''
    localStorage.removeItem('menu')
    localStorage.removeItem('menuActive')
    localStorage.removeItem('menuOpened')
  },
  // 未读站内信
  UNREAD_COUNT: (state, data) => {
    state.unreadcount = data
  },
  // 待办事务个数
  UNFINSHED_COUNT: (state, data) => {
    state.unfinshedcount = data
  }
}
const actions = {
  // 获取菜单
  handleMenu: ({commit}) => {
    axios.get('permission-left').then(res => {
      const {code, msg, data} = res.data
      if (code === 1) {
        commit('MENU', data)
      } else {
        Message.error(msg)
      }
    }).catch(error => {
      console.log(error)
    })
  },
  // 激活菜单
  handleActiveMenu: ({
    commit
  }, keyPath) => {
    commit('ACTIVE_MENU', keyPath)
  },
  // 打开子菜单
  handleOpenChildMenu: ({
    commit
  }, keyPath) => {
    commit('OPEN_CHILD_MENU', keyPath)
  },
  // 关闭子菜单
  handleCloseChildMenu: ({commit}) => {
    commit('CLOSE_CHILD_MENU')
  },
  // 重置菜单
  handleResetMenu: ({commit}) => {
    commit('RESET_MENU')
  },
  // 获取未读站内信
  getUnreadcount: ({commit}) => {
    axios.get('inmail-unreadcount').then(res => {
      commit('UNREAD_COUNT', res.data.unreadcount)
    })
  },
  // 获取待办事务个数
  getUnfinshedcount: ({commit}) => {
    axios.get('report-unfinishcount').then(res => {
      commit('UNFINSHED_COUNT', res.data.unfinshed_count)
    })
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
