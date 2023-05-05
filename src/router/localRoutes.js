import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
// 有面包屑、有padding、有背景 的父级盒子
import PageView from '@/layouts/PageView'
// 无面包屑、无padding、无背景 的父级盒子 
import NoBreadcrumb from '@/layouts/NoBreadcrumb'
const view = {
  tabs: () => import('@/layouts/tabs'),
  blank: () => import('@/layouts/BlankView'),
  page: () => import('@/layouts/PageView')
}
import config from '@/router/config'
export const localRoutes = [
  ...(config.routes || [])
]
function recursionRoutesToMap(routes, resMap = {}){
  routes.forEach(item => {
    if (resMap[item.path]) {
      console.warn(`存在重复的路由路径 ${item.path} 被覆盖, 请修改.`)
    }
    resMap[item.path] = {
      ...item
    }
    if (item.children && item.children.length > 0) {
      recursionRoutesToMap(item.children, resMap)
    }
  })
  return resMap
}
export const localRoutesMap = recursionRoutesToMap(localRoutes)
