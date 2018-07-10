import Vue from 'vue'
import Router from 'vue-router'
import routes from '@/router/routes'
import store from '@/store'

Vue.use(Router)

const router = new Router({
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  let flag = 0
  if (to.path === '/login') {
    localStorage.removeItem('user')
  }
  const user = JSON.parse(localStorage.getItem('user'))
  const menu = JSON.parse(localStorage.getItem('menu'))
  let message = new RegExp('message')
  if (to.path !== '/login') {
    if (to.path !== '/changePwd') {
      if (to.path !== '/notfound') {
        if (store.state.app.is_first === '2') {
            next({path: '/changePwd'})
            return false
        }
      }
    }
  }
  console.log(menu)
  if (menu) {
    let menulist = menu.menu
    for (let i in menulist) {
      let reg = menulist[i].path.replace('/', '')
      let topath = to.path
      if (topath.match(reg)) {
        flag += 1
      }
      if (to.path.match(message)) {
        flag += 1
      }
    }
    if (flag === 0) {
      if (to.path !== '/notfound' && to.path !== '/login' && to.path !== '/guide' && to.path !== '/changePwd') {
        next({ path: '/notfound' })
        return false
      }
    }
  }
  if (!user && to.path !== '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

export default router
