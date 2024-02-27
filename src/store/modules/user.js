export default {
    namespace: true,
    state: {
        userInfo: {}
    },
    mutations: {
        SET_USERINFO(state, data) {
            state.userInfo = data
        }
    },
    actions: {
        async getUserInfo({ commit }, code) {
            const { data } = await uni.$ca.http('askInfo', {
                code
            }, {
                abort: false
            })
            commit('SET_USERINFO', data)
            return data
        }
    }
}
