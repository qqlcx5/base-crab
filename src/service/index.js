/*
 * @Descripttion: store主入口
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-07-07 08:50:35
 */
import { getModules } from '@/crabui/libs/file/index.js'
const files = import.meta.globEager('./modules/*.js')
export default getModules({
    files,
    modules: false
})
