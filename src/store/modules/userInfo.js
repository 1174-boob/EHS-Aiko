
export default {
  namespaced: true,
  state: {
    userInfo: undefined,
  },
  mutations: {
    setUser(state, userInfo) {
      // console.log('vuex存储了本地zconsole_userInfo数据');
      state.userInfo = userInfo
    },
  },
  actions: {
    // 获取本地用户信息
    getUserInfoFromLoc({ commit }) {
      return new Promise((resolve, reject) => {
        if (sessionStorage.getItem("zconsole_userInfo")) {
          commit('setUser', JSON.parse(sessionStorage.getItem("zconsole_userInfo")))
          resolve(true)
        } else {
          reject(false)
        }
      })
    }
  }
}
