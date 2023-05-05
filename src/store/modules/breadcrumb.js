
// 获取当前fullPath 当前显示的key集合数组
function recursionOption(targetInfo, resultArr = []) {
  targetInfo.forEach(item => {
    if (item.meta && !item.meta.invisible) {
      resultArr.push(item.fullPath)
    }
    if (item.children && item.children.length) {
      recursionOption(item.children, resultArr)
    }
  })
  return resultArr
}
function findTargetBread(target, list, resArr = []) {
  target = Array.isArray(target) ? target : (target.split('/') || []).filter(item => {
    return item !== '' 
  })
  if (target.length === 0) {
    return resArr
  }
  let targetPath = target.shift()
  let findItem = list.find(item => {
  let path = (item.path).replace('/', '')
    return targetPath === path
  })
  if (findItem) {
    resArr.push(findItem)
  }
  if (findItem && findItem.children) {
    findTargetBread(target, findItem.children, resArr)
  }
  return resArr
}
export default {
  namespaced: true,
  state: {
    breadList: [],
    breadcrumbFirst: [],
    breadcrumbTwo: [],
    breadcrumbLast: [],
    menuDataPathArr: [], //菜单包含的path
    isFrist: true,
  },
  getters: {
    breadcrumb(state) {
      // let breadcrumb = [...state.breadcrumbFirst, ...state.breadcrumbLast]
      // return breadcrumb
      return [...state.breadList]
    }
  },
  mutations: {
    setBreadcrumb(state, setBreadcrumbParms) {
      let { to, menuData } = setBreadcrumbParms

      if (to.name === '404') return
      // console.log('to', to);
      // 第一项
      state.breadList = findTargetBread(to.path, menuData).map(item => {
        return {path: item.fullPath,
        title: item.meta.title,
        isPage: item.meta.isPage,}
      })
      let matchedOne = to.matched[0]
      state.breadcrumbFirst = [
        {
          path: matchedOne.path ? matchedOne.path : '/overview/preview',
          title: matchedOne.meta.title,
          isPage: matchedOne.meta.isPage,
        }
      ]
      // console.log('面包屑首项', state.breadcrumbFirst);
      // 第二项
      if (state.menuDataPathArr.length === 0) {
        state.menuDataPathArr = recursionOption(menuData)
      }
      // 目标页面是否是菜单页面
      if (state.menuDataPathArr.includes(to.path)) state.breadcrumbLast = []
      if (to.matched.length > 2) {
        // 是否是重定向页面
        if (to.matched[1].redirect) {
          state.breadcrumbLast = []
          state.breadcrumbTwo = []
        } else {
          let matchedTwo = to.matched[1]
          state.breadcrumbTwo = [
            {
              title: matchedTwo.meta.title,
              isPage: matchedTwo.meta.isPage,
            }
          ]
        }
      }
      // console.log('面包屑第二项', state.breadcrumbTwo);
      // 剩余项
      if (to.path !== state.breadcrumbFirst[0].path) {
        let breadcrumbLastItem = {
          path: to.path,
          title: to.meta.title,
          isPage: to.meta.isPage,
        }
        if (state.breadcrumbLast.length === 0 && state.isFrist) {
          state.breadcrumbLast = sessionStorage.getItem('clx_breadcrumbLast') ? JSON.parse(sessionStorage.getItem('clx_breadcrumbLast')) : []
        }
        let hasIndex = state.breadcrumbLast.findIndex(item => item.path == to.path)
        // console.log('hasIndex', hasIndex);
        if (hasIndex !== -1) {
          state.breadcrumbLast = state.breadcrumbLast.slice(0, hasIndex + 1)
        } else {
          state.breadcrumbLast.push(breadcrumbLastItem)
        }
        state.isFrist = false
        sessionStorage.setItem('clx_breadcrumbLast', JSON.stringify(state.breadcrumbLast))
        // console.log('面包屑后项', state.breadcrumbLast);
      }
    },
  },

}
