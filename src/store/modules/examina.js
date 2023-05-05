
export default {
  namespaced: true,
  state: {
    examinaObj:''
  },
  mutations: {
    setExaminaObj(state, addNodeType) {
      state.examinaObj = addNodeType
    },
  },
  actions: {
    getExaminaObj({ commit }, responseData) {
      if (responseData) {
        commit('setExaminaObj', responseData)
      }
    }
  }
}
