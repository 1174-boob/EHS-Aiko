
export default {
    namespaced: true,
    state: {
        keepalive: true,
        // 是否点击了浏览器返回
        isBOMPopstate: false,
    },
    mutations: {
        setKeepalive(state, keepalive) {
            state.keepalive = keepalive
        },
        setIsBOMPopstate(state, isBOMPopstate) {
            state.isBOMPopstate = isBOMPopstate
        },
    },
}
