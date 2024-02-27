/*
 * @Descripttion: store主入口
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-07-07 08:50:35
 */
import { createStore } from 'vuex'
import { getModules } from '@/crabui/libs/file/index.js'
const files = import.meta.globEager('./modules/*.js')
const store = createStore({
    modules: getModules({
        files,
        modules: true
    })
})

export default store

export function useStore() {
    return store
}
