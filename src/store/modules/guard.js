import { cloneDeep } from 'lodash'
// 引入全局路由
import allRouteObj from '@/router/config.js'
import { getAllButtonCodeList } from '@/services/api'
import Vue from 'vue';

let allRoute = cloneDeep(allRouteObj)
// 处理所有path前面的 '/'
function changeRoutes(routes) {
  routes.forEach(item => {
    if (item.children && item.children.length) {
      if (item.path && item.path[0] == '/') {
        item.path = item.path.slice(1)
      }
      changeRoutes(item.children)
    } else {
      if (item.path && item.path[0] == '/') {
        item.path = item.path.slice(1)
      }
    }
  })
}
let tarRoute = allRoute.routes.filter(item => {
  return item.path == '/'
})[0].children
changeRoutes(tarRoute)

export default {
  namespaced: true,
  state: {
    // 所有按钮权限
    allButtonCodeList: null,
    // 全部path集合
    allPathArr: [],
  },
  mutations: {
    // 设置所有按钮权限
    setAllButtonCodeList(state, allButtonCodeList) {
      state.allButtonCodeList = allButtonCodeList
    },
    // 设置 全部path集合
    setAllPathArr(state, allPathArr) {
      let defaultPathArr = ['/404', '/403']
      state.allPathArr = [...allPathArr, ...defaultPathArr]
    },
  },
  actions: {
    // 设置 全部path集合
    setAllPathArr({ commit }) {
      let allPathArr = []
      function getAllPathArr(tarRoute, addPath) {
        tarRoute.forEach(item => {
          if (item.children && item.children.length) {
            let parentPath = addPath + item.path
            if (item.meta && item.meta.isPage) {
              allPathArr.push(parentPath)
            }

            parentPath = parentPath + '/'
            getAllPathArr(item.children, parentPath)
          } else {
            if (item.meta && item.meta.isPage && item.path) {
              let path = addPath + item.path
              allPathArr.push(path)
            }
          }
        })
      }
      getAllPathArr(tarRoute, '/')
      commit('setAllPathArr', allPathArr)
    },
    // 获取所有按钮权限
    getAllButtonCodeListFn({ commit }) {
      return getAllButtonCodeList()
        .then(res => {
          let allButtonCodeList = res.data ? res.data : []
          allButtonCodeList = allButtonCodeList.filter(item => {
            return item
          })
          commit('setAllButtonCodeList', allButtonCodeList)
        })
        .catch(err => {
          commit('setAllButtonCodeList', [])
        })
    },
  }
}
