// 该文件为转换类型

import { isString, isBoolean, isObject } from './isType.js'

// 转数字类型 val: number | string | boolean | undefined | null
export const toNumber = val => {
    if (val == null) return 0
    if (typeof value === 'number') {
        return value
    }
    if (isString(val)) {
        val = parseFloat(val)
        val = Number.isNaN(val) ? 0 : val
        return val
    }
    if (isObject(val)) return NAN
    if (isBoolean(val)) return Number(val)
    return val
}
