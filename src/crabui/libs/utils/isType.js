// 该文件为检查类型

/**
 * 检查'value'是否类似于对象。如果值不是'null'则是类对象的
 * isObjectLike({}) // => true
 *
 * isObjectLike([1, 2, 3]) // => true
 *
 * isObjectLike(Function) // => false
 *
 * isObjectLike(null) // => false
 */
export function isObjectLike(value) {
    return typeof value === 'object' && value !== null
}

/**
 * 检查“value”是否为“null”或“undefined”。运算符 ??
 * isNil(null) // => true
 *
 * isNil(void 0) // => true
 *
 * isNil(NaN) // => false
 */
export function isNil(value) {
    return value == null
}

/**
 * 检查'value'是否被归类为'String'类型。
 *
 * isString('abc') // => true
 *
 * isString(1) // => false
 */

export function isString(value) {
    const type = typeof value
    return type === 'string'
}

/**
 * 检查'value'是否被归类为布尔类型。
 *
 * isBoolean(false) // => true
 *
 * isBoolean(null) // => false
 */

export function isBoolean(value) {
    return value === true || value === false
}
/**
 * 检查“value”是否归类为“Number”类型。
 *
 * isNumber(3) // => true
 *
 * isNumber(Number.MIN_VALUE) // => true
 *
 * isNumber(Infinity) // => true
 *
 * isNumber('3') // => false
 */
export function isNumber(value) {
    return typeof value === 'number'
}

/**
 * 检查value是否为Object的值。(例如数组，函数，对象，正则表达式等)
 *
 * isObject({}) // => true
 *
 * isObject([1, 2, 3]) // => true
 *
 * isObject(Function) // => true
 *
 * isObject(null) // => false
 */
export function isObject(value) {
    const type = typeof value
    return value != null && (type === 'object' || type === 'function')
}

// 检查' value '是否被归类为' Function '对象。
export function isFunction(value) {
    return typeof value === 'function'
}

/**
 * 检查value是否为数值。
 *
 * isNumeric('1.2') //true
 * isNumeric('1..2') //false
 * isNumeric('1b2') //false
 */
export const isNumeric = val => typeof val === 'number' || /^\d+(\.\d+)?$/.test(val)

// 检查value是否为iphone手机。
export const isIOS = () => (inBrowser ? /ios|iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()) : false)

// 检查value是否为手机号
export function isMobile(value) {
    value = value.replace(/[^-|\d]/g, '')
    return /^((\+86)|(86))?(1)\d{10}$/.test(value) || /^0[0-9-]{10,13}$/.test(value)
}
