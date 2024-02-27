export default {
    namespace: true,
    state: {
        isApp: 0, // 0 未知  1 是  2否
        netConfig: {}
    },
    mutations: {
        SET_IS_APP(state, flag) {
            state.isApp = flag
        },
        SET_NET_CONFIG(state, data) {
            state.netConfig = data
        }
    },
    actions: {
        async getNetConfigUpdate({ commit }) {
            try {
                const data = await uni.$ca.getAppAction({
                    action: 'getRequestInfo'
                })
                commit('SET_IS_APP', 1)
                commit('SET_NET_CONFIG', data)
            } catch (error) {
                commit('SET_IS_APP', 2)
            }
        }
    }
}
