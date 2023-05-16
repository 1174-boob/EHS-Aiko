import { hasAuthority } from '@/utils/authority-utils'
import { loginIgnore } from '@/router/index'
import NProgress from 'nprogress'
import store from '@/store'
import { isEmpty, reject } from 'lodash'
import { getMenuTree } from '@/services/api'
import { loadRoutes } from '@/utils/routerUtil'
import { getQueryVariable, rmUrlParam } from "@/utils/util.js";
import reLogin from "@/utils/reLogin";
import { getloginUserDataAuth } from '@/services/api'
// import { setInterval } from 'core-js/es5'

// vuex设置本地全部路由path
if (store.state.guard.allPathArr.length == 0) {
  store.dispatch('guard/setAllPathArr')
}

NProgress.configure({ showSpinner: false })
// 显示进度条 start progress bar
function nProgresShow(from, to) {
  if (!NProgress.isStarted()) {
    if (from.name != 'blankPage') {
      NProgress.start()
    }
  }
}

/**
 * 进度条开始
 * @param to
 * @param form
 * @param next
 */
const progressStart = (to, from, next, options) => {
  const { store, message, router } = options
  // 当前有的path
  let currentPathArr = router.getRoutes().map(item => {
    return item.path
  })
  let { name, path } = to
  if (store.state.setting.isBeginGuardBtnRoute && path != '/404' && path != '/403') {
    if (currentPathArr.includes(path)) {
      nProgresShow(from, to)
      next()
    } else if (store.state.guard.allPathArr.includes(path)) {
      if (sessionStorage.getItem('console_isRefresh')) {
        next('/403')
      }
      message.warning(`暂无权限，请联系管理员开通权限后再操作！`)
    } else {
      nProgresShow(from, to)
      next('/404')
    }
    if (sessionStorage.getItem('console_isRefresh')) {
      sessionStorage.removeItem('console_isRefresh')
    }
  } else {
    nProgresShow(from, to)
    next()
  }
  // next()
}

/**
 * 登录守卫
 * @param to
 * @param form
 * @param next
 * @param options
 */
const loginGuard = (to, from, next, options) => {
  // 获取token和用户信息
  let userInfo = sessionStorage.getItem('zconsole_userInfo');
  if (process.env.NODE_ENV == "development") {
    // 开发环境是否存在用户信息
    if (!userInfo) {
      if (!loginIgnore.includes(to)) {
        sessionStorage.clear();
        next({ path: '/login' })
      } else {
        next()
      }
    } else {
      // next()
      // token存在验证是否有效
      if (store.state.setting.hasRightToken) {
        next()
      } else {
        next()
      }
    }
  }
  if (process.env.NODE_ENV == "production") {
    // 生产环境是否存在用户信息
    if (userInfo) {
      if (store.state.setting.hasRightToken) {
        // token存在验证是否有效，区分pro和dev
        store.dispatch('setting/checkToken').then(resData => {
          if (resData.code == 20000) {
            store.commit('setting/setCheckToken', false)
            next()
          } else {
            sessionStorage.clear();
            next({ path: '/login' })
            // window.location.href = process.env.VUE_APP_LOGIN_URL + 'client_id=' + process.env.VUE_APP_CLIENTID + '&response_type=' + process.env.VUE_APP_RESPONSE_TYPE + '&redirect_uri=' + process.env.VUE_APP_REDIRECT_URI + '&isLogout=true';
          }
        }).catch(err => {
          sessionStorage.clear();
          next({ path: '/login' })
          // window.location.href = process.env.VUE_APP_LOGIN_URL + 'client_id=' + process.env.VUE_APP_CLIENTID + '&response_type=' + process.env.VUE_APP_RESPONSE_TYPE + '&redirect_uri=' + process.env.VUE_APP_REDIRECT_URI + '&isLogout=true';
        })
      } else {
        next()
      }
    } else {
      // 根据code获取token
      store.dispatch('setting/getDevTokenData').then(res => {
        // 根据token获取用户信息
        store.dispatch('setting/getUserInfoData', res).then(resData => {
          Promise.all([store.dispatch('setting/getMenuAuthList'), store.dispatch('setting/getMenuTree')]).then(() => {
            if (!(store.getters["setting/getRouterList"] && store.getters["setting/getRouterList"].length > 0)) {
              reLogin(() => {
                location.reload();
              });
            } else {
              getloginUserDataAuth({ routerList: store.getters["setting/getRouterList"] }).then(res => {
                sessionStorage.setItem("hasGetloginUserDataAuth", true);
                next();
              }).catch((err) => {
                // 退出登录
                reLogin(() => {
                  location.reload();
                });
              })
            }
          }).catch((err) => {
            // 退出登录
            reLogin(() => {
              location.reload();
            });
          })
          // store.dispatch('setting/getMenuTree').then(treeData => {
          //   console.log(1);
          //   console.log(treeData)
          //   next();
          // })
        })
      })

    }
  }
  const { message } = options
}

// 系统业务所需的接口
/**
 * 权限守卫
 * @param to
 * @param form
 * @param next
 * @param options
 */
const authorityGuard = (to, from, next, options) => {
  const { store, message } = options
  const permissions = store.getters['account/permissions']
  const roles = store.getters['account/roles']
  if (to.name != 'blankPage') {
    var x = !hasAuthority(to, permissions, roles);
  } else {
    var x = false;
  }
  if (x) {
    message.warning(`对不起，您无权访问页面: ${to.fullPath}，请联系管理员`)
    next({ path: '/403' })
    // NProgress.done()
  } else {
    // 判断字典或地址是否存在
    if (to.path !== '/login') {
      if (process.env.NODE_ENV == "production") {
        if (isEmpty(store.state.setting.dictionaryData) || !store.state.userInfo.userInfo || store.state.guard.allButtonCodeList === null) {
          if (store.state.setting.menuData && store.state.setting.menuData.length > 0) {
            Promise.all([
              store.dispatch('setting/getDictionaryData'),
              store.dispatch('setting/getDictConfigList'),
              store.dispatch('setting/getDictTree'),
              store.dispatch('userInfo/getUserInfoFromLoc'),
              store.dispatch('guard/getAllButtonCodeListFn'),
              // store.dispatch('setting/getCorporationList'),
              // store.dispatch('setting/getCorporationTree'),
              store.dispatch('setting/getLoginCorporation'),
              store.dispatch('setting/getDeptCache'),
              store.dispatch('setting/getMenuAuthList'),
            ]).finally(() => {
              next(to);
            })
          } else {
            Promise.all([
              store.dispatch('setting/getMenuTree'),
              store.dispatch('setting/getDictionaryData'),
              store.dispatch('setting/getDictConfigList'),
              store.dispatch('setting/getDictTree'),
              store.dispatch('userInfo/getUserInfoFromLoc'),
              store.dispatch('guard/getAllButtonCodeListFn'),
              // store.dispatch('setting/getCorporationList'),
              // store.dispatch('setting/getCorporationTree'),
              store.dispatch('setting/getLoginCorporation'),
              store.dispatch('setting/getDeptCache'),
              store.dispatch('setting/getMenuAuthList'),
            ]).finally(() => {
              next(to);
            })
          }
        } else {
          next();
        }
      } else {
        if (store.state.setting.menuData && store.state.setting.menuData.length > 0) {
          Promise.all([store.dispatch('setting/getMenuAuthList')]).then(() => {
            if (!(store.getters["setting/getRouterList"] && store.getters["setting/getRouterList"].length > 0)) {
              // 退出登录
              reLogin(() => {
                location.reload();
              });
            }
            getloginUserDataAuth({ routerList: store.getters["setting/getRouterList"] }).then(res => {
              sessionStorage.setItem("hasGetloginUserDataAuth", true);
              if (isEmpty(store.state.setting.dictionaryData) || !store.state.userInfo.userInfo || store.state.guard.allButtonCodeList === null) {
                Promise.all([
                  store.dispatch('setting/getDictionaryData'),
                  store.dispatch('setting/getDictConfigList'),
                  store.dispatch('setting/getDictTree'),
                  store.dispatch('userInfo/getUserInfoFromLoc'),
                  store.dispatch('guard/getAllButtonCodeListFn'),
                  // store.dispatch('setting/getCorporationList'),
                  // store.dispatch('setting/getCorporationTree'),
                  store.dispatch('setting/getLoginCorporation'),
                  store.dispatch('setting/getDeptCache'),
                  store.dispatch('setting/getMenuAuthList'),
                ]).finally(() => {
                  next();
                })
              } else {
                next();
              }
            }).catch((err) => {
              // 退出登录
              reLogin(() => {
                location.reload();
              });
            })
          }).catch(() => {
            next();
          })
        } else {
          Promise.all([store.dispatch('setting/getMenuAuthList'), store.dispatch('setting/getMenuTree')]).then(() => {
            if (!(store.getters["setting/getRouterList"] && store.getters["setting/getRouterList"].length > 0)) {
              // 退出登录
              reLogin(() => {
                location.reload();
              });
            }
            getloginUserDataAuth({ routerList: store.getters["setting/getRouterList"] }).then(res => {
              sessionStorage.setItem("hasGetloginUserDataAuth", true);
              if (isEmpty(store.state.setting.dictionaryData) || !store.state.userInfo.userInfo || store.state.guard.allButtonCodeList === null) {
                Promise.all([
                  store.dispatch('setting/getDictionaryData'),
                  store.dispatch('setting/getDictConfigList'),
                  store.dispatch('setting/getDictTree'),
                  store.dispatch('userInfo/getUserInfoFromLoc'),
                  store.dispatch('guard/getAllButtonCodeListFn'),
                  // store.dispatch('setting/getCorporationList'),
                  // store.dispatch('setting/getCorporationTree'),
                  store.dispatch('setting/getLoginCorporation'),
                  store.dispatch('setting/getDeptCache'),
                  store.dispatch('setting/getMenuAuthList'),
                ]).finally(() => {
                  next(to);
                })
              } else {
                next();
              }
            }).catch((err) => {
              // 退出登录
              reLogin(() => {
                location.reload();
              });
            })
          }).catch(() => {
            next();
          })
        }
      }
      // // Promise.all([store.dispatch('setting/getMenuAuthList')]).then(() => {
      //   // return;
      //   if (!(store.getters["setting/getRouterList"] && store.getters["setting/getRouterList"].length > 0)) {
      //     // 退出登录
      //     console.log(222);
      //     // reLogin(() => {
      //     //   location.reload();
      //     // });
      //     // return
      //   }
      //   // getloginUserDataAuth({ routerList: store.getters["setting/getRouterList"] }).then(res => {
      //   //   sessionStorage.setItem("hasGetloginUserDataAuth", true);
      //     if (isEmpty(store.state.setting.dictionaryData) || !store.state.userInfo.userInfo || store.state.guard.allButtonCodeList === null) {
      //       Promise.all([
      //         store.dispatch('setting/getMenuTree'),
      //         store.dispatch('setting/getDictionaryData'),
      //         store.dispatch('setting/getDictTree'),
      //         store.dispatch('userInfo/getUserInfoFromLoc'),
      //         store.dispatch('guard/getAllButtonCodeListFn'),
      //         store.dispatch('setting/getCorporationList'),
      //         store.dispatch('setting/getCorporationTree'),
      //         store.dispatch('setting/getLoginCorporation'),
      //         store.dispatch('setting/getDeptCache'),
      //         store.dispatch('setting/getMenuAuthList'),
      //       ]).finally(() => {
      //         next();
      //       })
      //     } else {
      //       next();
      //     }
      //   // }).catch((err) => {
      //   //   // 退出登录
      //   //   reLogin(() => {
      //   //     location.reload();
      //   //   });
      //   // })
      // // }).catch(() => {
      // //   next();
      // // })
    } else {
      setTimeout(() => {
        store.commit('userInfo/setUser', undefined)
        sessionStorage.removeItem('clx_breadcrumbLast')
      }, 500);
      next()
    }
  }
}

/**
 * 试卷管理守卫
 * @param to
 * @param form
 * @param next
 * @param options
 */
const examina = (to, from, next, options) => {
  let exam = sessionStorage.getItem('examinaObj_xt')
  if (from.path == '/educationmanagement/examinationAOCOne' && to.path !== '/educationmanagement/examinationAOCTwo') {
    if (exam) {
      sessionStorage.removeItem('examinaObj_xt')
    }
    next()
  } else if (from.path == '/educationmanagement/examinationAOCTwo/' && to.path !== '/educationmanagement/examinationAOCOne') {
    if (exam) {
      sessionStorage.removeItem('examinaObj_xt')
    }
    next()
  } else {
    next()
  }
  // next()

}

/**
 * 混合导航模式下一级菜单跳转重定向
 * @param to
 * @param from
 * @param next
 * @param options
 * @returns {*}
 */
const redirectGuard = (to, from, next, options) => {
  const { store } = options
  const getFirstChild = (routes) => {
    const route = routes[0]
    if (!route.children || route.children.length === 0) {
      return route
    }
    return getFirstChild(route.children)
  }
  if (store.state.setting.layout === 'mix') {
    const firstMenu = store.getters['setting/firstMenu']
    if (firstMenu.find(item => item.fullPath === to.fullPath)) {
      store.commit('setting/setActivatedFirst', to.fullPath)
      const subMenu = store.getters['setting/subMenu']
      if (subMenu.length > 0) {
        const redirect = getFirstChild(subMenu)
        return next({ path: redirect.fullPath })
      }
    }
  }
  next()
}

/**
 * 跳转routeUrl指定地址
 * 何时触发：符合跳转地址栏routeUrl情况时触发
 * 抽离目的：方便在此处进行跳转前的各种判断和情况处理
 */
async function goRouteUrlFn(to, from, next, options, routeUrl) {
  await rmUrlParam(['routeUrl='])
  next(routeUrl)
}
/**
 * 地址栏routeUrl处理,用于判断和跳转routeUrl指定的页面
 * @param to
 * @param from
 * @param next
 * @param options
 */
const routeUrlGuard = (to, from, next, options) => {
  const { store } = options
  if (process.env.NODE_ENV == "production") {   // 仅在线上环境执行, 本地开发不执行
    if (to.name == 'blankPage') {
      next()
    } else {
      let routeUrl = getQueryVariable('routeUrl')
      // 是否指定了要跳转的路由
      if (routeUrl) {
        // 跳转routeUrl指定地址的方法
        goRouteUrlFn(to, from, next, options, routeUrl)
      } else {
        next()
      }
    }
  } else {  // 本地开发时执行
    next()
  }
}


/**
 * @param to
 * @param from
 * @param next
 * @param options
 */
const addRouterCode = (to, from, next, options) => {
  // console.log(to);
  let routerCode = to.meta.routerCode
  routerCode && sessionStorage.setItem('routerCode', routerCode);
  next()
}



// 面包屑
let setBreadcrumbTimer = undefined
function setBreadcrumb(to) {
  if (to.path !== '/login' && to.name !== 'blankPage') {
    let menuData = store.getters['setting/menuData']
    //menuData首次获取不到，所以需要判断是否为空
    if (menuData.length) {
      setBreadcrumbTimer && window.clearTimeout(setBreadcrumbTimer)
      let setBreadcrumbParms = { to, menuData }
      store.commit('breadcrumb/setBreadcrumb', setBreadcrumbParms)
    } else {
      setBreadcrumbTimer = setTimeout(() => {
        setBreadcrumb(to)
      }, 50);
    }
  }
}
/**
 * 进度条结束
 * @param to
 * @param form
 * @param options
 */
const progressDone = (to) => {
  // finish progress bar
  if (to.name != 'blankPage') {
    NProgress.done()
  }
  setBreadcrumb(to)
}

export default {
  beforeEach: [progressStart, loginGuard, authorityGuard, redirectGuard, examina, routeUrlGuard,addRouterCode],
  afterEach: [progressDone]
}
