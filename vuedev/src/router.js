import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'
import axios from 'axios'
import { getQueryString } from '@/assets/js/util'
import { routes, mobileRoutes, modalRoutes, devRoutes } from '@/assets/js/routes'
import WebApp from './views/WebApp.vue'
import MintApp from './views/MintApp.vue'
import ModalApp from './views/ModalApp.vue'

Vue.use(Router)
let routeList = []
// 使用nginx代理到80门户不再需要/Home（框架页面）和/loginProxy（代理设置页面）

routeList.push({
  path: '/',
  moduleName: 'base',
  name: 'webapp',
  component: WebApp,
  children: [],
})
routeList.push({
  path: '/',
  moduleName: 'base',
  name: 'mintapp',
  component: MintApp,
  children: [],
})
routeList.push({
  path: '/',
  moduleName: 'base',
  name: 'modalapp',
  component: ModalApp,
  children: [],
})

let routeArr = []
routeArr = routeArr.concat(routes)
routeList[0].children = routeArr
if (process.env.NODE_ENV === 'development') {
  routeList = routeList.concat(devRoutes)
}
routeList[1].children = mobileRoutes
routeList[2].children = modalRoutes
// console.log(routeList)

//全模式下添加404页面
routeList.push({
  path: '*',
  component: () => import('@/views/Error404.vue'),
})

// console.log(routeList)

const router = new Router({
  mode: 'history',
  routes: routeList,
  // base: process.env.NODE_ENV === 'development'?'':'/pf/vue' //history模式需要增加base 以符合平台菜单配置上的路由
  base: '/pf/vue', //使用nginx代理到80门户时 所有环境模式都要带上'/pf/vue'
})

router.beforeEach((to, from, next) => {
  store.commit('setPathName', to.meta)
  let roleid, menuid = getQueryString('menuid')
  store.commit('setMenuid', menuid)
  if(store.state.pfData){
    roleid = store.state.pfData.svRoleId
  }else{
    console.error(`未能获取到commonData`)
    return
  }
  // if (to.name != 'home' && to.name != 'loginProxy') {
  store.dispatch('setBtnPermissionList', { list: [] })
  if (menuid && roleid) {
    axios
      //8.30代码 85配置
      .get('/crux-appmodule/api/operation?appFunction.id=' + menuid, {
        params: {
          svRoleId: roleid,
        },
      })
      .then((result) => {
        store.dispatch('setBtnPermissionList', { list: result.data })
      })
  }
  if (to.path.indexOf('/gl/rpt') > -1) {
    store.commit('setRptName', to.name)
  }
  else if (to.path.indexOf('/ma/departApply') > -1) {
    store.commit('setMaName', to.name)
  }
  next()
  // } else {
  //   next()
  // }
})

export default router
