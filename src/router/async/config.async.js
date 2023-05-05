import routerMap from './router.map'
import { parseRoutes } from '@/utils/routerUtil'

// 异步路由配置
const routesConfig = [
  'root',
  {
    authority: '*',
    router: 'login',
    path: '/login',
    name: '登录',
    component: resolve => require(['@/pages/login'], resolve),
  },
  {
    router: 'blankPage',
    path: '*',
    name: 'blankPage'
  },
  {
    router: 'exp404',
    path: '/404',
    name: '404'
  },
  {
    router: 'exp403',
    path: '/403',
    name: '403'
  }
]

const options = {
  routes: parseRoutes(routesConfig, routerMap)
}

export default options
