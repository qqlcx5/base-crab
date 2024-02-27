import { getModules } from '@/crabui/libs/file/index.js'
const files = import.meta.globEager('./*.json')
export default getModules({
    files,
    modules: true
})
