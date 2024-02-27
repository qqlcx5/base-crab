/*
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-12-09 09:15:39
 */

import { provide, inject, isRef, isProxy, toRaw, nextTick } from 'vue'

import { publishAndSubscribe } from './symbol.js'
// #ifdef APP-NVUE
const dom = uni.requireNativePlugin('dom')
// #endif
// 在APP-NVUE环境下selecter是一个refs的id值，其他环境下是class或者id
/**
 * @description:
 * @param {String} selecter 要查询节点的id或者class名称，可用逗号隔开传入多个，nvue下，传入的是ref的值
 * @param {Object} fields 需要查询返回的额外节点信息
 * @param {Vue实例} proxy 传入当前vue实例，相当于vue2中的this
 * @return {Promise} 返回需要查询的节点信息
 */
export function getRect(selecter, fields = {}, proxy) {
    const isSelectAll = selecter.lastIndexOf(',') !== -1 || selecter.lastIndexOf('.') !== -1
    function formatReturn(data) {
        return getVarType(data) === 'Array' ? (data.length > 1 ? data : data[0]) : data
    }
    return new Promise((resolve, reject) => {
        nextTick(() => {
            // #ifndef APP-NVUE
            if (!proxy?.$el) return reject(new Error('节点获取失败')) // 不存在节点信息就中断
            const querySelect = uni.createSelectorQuery()
            // #ifndef MP-ALIPAY
            querySelect.in(proxy)
            // #endif
            querySelect[isSelectAll ? 'selectAll' : 'select'](selecter)
                .fields(
                    {
                        size: true,
                        rect: true,
                        ...fields
                    },
                    data => {
                        resolve(formatReturn(data))
                    }
                )
                .exec()
            // #endif
            // #ifdef APP-NVUE
            // nvue下，使用dom模块查询元素高度
            // 返回一个promise，让调用此方法的主体能使用then回调
            dom.getComponentRect(proxy.$refs[selecter], res => {
                resolve(formatReturn(res))
            })
            // #endif
        })
    })
}

/**
 * @description:
 * @param {any} val 需要判断的值
 * @return {Boolean} 是否是空值
 */
export const isEmpty = (val) => {
    if (val instanceof Array) {
        if (val.length === 0) return true
    } else if (val instanceof Object) {
        if (!Object.keys(val).length) return true
    } else {
        if (val === 'null' || val === null || val === 'undefined' || val === undefined || val === '' || isNaN(val)) return true
    }
    return false
}

/**
 * 复制到粘贴板
 * @parmas {String} content 拷贝的字符
 * @parmas {Function} success 成功回调
 * @parmas {Function} error 失败回调
 */
export function copyText({
    content,
    showToast = true,
    success = title => {
        uni.showToast({ title, icon: 'none', duration: 2000 })
    },
    error = () => { }
}) {
    if (!content) return error('复制的内容不能为空 !')
    content = typeof content === 'string' ? content : content.toString() // 复制内容，必须字符串，数字需要转换为字符串
    /**
     * 小程序端 和 app端的复制逻辑
     */
    // #ifndef H5
    uni.setClipboardData({
        data: content,
        showToast,
        success: function () {
            success('复制成功~')
            // this.$toast('复制成功~')
        },
        fail: function () {
            error('复制失败~')
            // this.$toast('复制失败~')
        }
    })
    // #endif

    /**
     * H5端的复制逻辑
     */
    // #ifdef H5
    if (!document.queryCommandSupported('copy')) {
        // 为了兼容有些浏览器 queryCommandSupported 的判断
        // 不支持
        error('浏览器不支持')
    }
    const textarea = document.createElement('textarea')
    textarea.value = content
    textarea.readOnly = 'readOnly'
    document.body.appendChild(textarea)
    textarea.select() // 选择对象
    textarea.setSelectionRange(0, content.length) // 核心
    const result = document.execCommand('copy') // 执行浏览器复制命令
    if (result) {
        success('复制成功~')
    } else {
        error('复制失败，请检查h5中调用该方法的方式，是不是用户点击的方式调用的，如果不是请改为用户点击的方式触发该方法，因为h5中安全性，不能js直接调用！')
    }
    textarea.remove()
    // #endif
}

/** *
 * 拆解url地址成为路由跳转参数
 */
export function getUrlInfo(page) {
    const urlArr = String(page).split('?')
    const queryObj = {}
    urlArr[1] &&
        urlArr[1].split('&').forEach(o => {
            const item = o.split('=')
            queryObj[item[0]] = item[1]
        })
    return {
        path: urlArr[0],
        query: queryObj
    }
}

/**
 * 单位转换
 * value [String, Number] 要转换的值
 * unit [String] 默认单位
 * expUnit [String] 期望单位
*/
export function addUnit(value = 0, unit = 'rpx', expUnit = 'px') {
    if (value === '') return value
    value = isNaN(value) ? value : `${value}${unit}`
    if (/upx|rpx/.test(value)) {
        if (expUnit === 'px') {
            // 所有数值（含单位）
            const strArr = value.replace(/\s+/g, ' ').split(' ')
            return strArr.map(o => {
                const matcher = o.match(/^(-?\d+)(.*)/)
                return `${/upx|rpx/.test(matcher[2]) ? uni.upx2px(matcher[1]) : matcher[1]}${expUnit}`
            }).join(' ')
        }
    } else {
        if (expUnit === 'rpx') {
            // 所有数值（含单位）
            const strArr = value.replace(/\s+/g, ' ').split(' ')
            return strArr.map(o => {
                const matcher = o.match(/^(-?\d+)(.*)/)
                return `${/upx|rpx/.test(matcher[2]) ? matcher[1] : matcher[1] * (750 / uni.upx2px(750))}${expUnit}`
            }).join(' ')
        }
    }
    return value
}

// 随机排序
export const scrambleArray = (arr) => {
    return arr.sort(() => Math.random() - 0.5)
}

// 深拷贝
export function deepClone(obj) {
    // 申明一个容器 用于存放科隆的数据
    let warp
    // 读取类型
    const objType = getVarType(obj)
    // 判断读到的类型 并且以符合的存放格式存放数据
    if (objType === 'Object') {
        warp = {}
    } else if (objType === 'Array') {
        warp = []
    } else {
        return obj
    }
    //  循环数据内容
    for (const x in obj) {
        //  得到的数据内容
        const value = obj[x]
        // 判断 已经得到的内容里是否还有Object，Array
        //  因为 数据中可能出现 [1,2,[4,5,4,],47,97] 这种情况
        const valueType = getVarType(value)
        if (valueType === 'Object' || valueType === 'Array') {
            // 当出现上述情况是 使用递归函数进行再次运行
            warp[x] = deepClone(value)
        } else {
            // 如果没有出现上诉情况 直接克隆
            warp[x] = obj[x]
        }
    }
    return warp
}

export function getResponsiveValue(data) {
    const newData = getProxyData(data)
    if (getVarType(newData) === 'Object') {
        const resData = {}
        Object.keys(newData).forEach(key => {
            resData[key] = getProxyData(newData[key])
        })
        return resData
    }
    return newData
}

export function getProxyData(data) {
    return isRef(data) ? toRaw(data.value) : isProxy(data) ? toRaw(data) : data
}

// 获取父组件的参数，因为支付宝小程序不支持provide/inject的写法
// this.$parent在非H5中，可以准确获取到父组件，但是在H5中，需要多次this.$parent.$parent.xxx
// 这里默认值等于undefined有它的含义，因为最顶层元素(组件)的$parent就是undefined，意味着不传name
// 值(默认为undefined)，就是查找最顶层的$parent
export function getParent(name = undefined, proxy) {
    let parent = proxy.$parent
    // 通过while历遍，这里主要是为了H5需要多层解析的问题
    while (parent) {
        // 父组件
        if (parent.$options && parent.$options.name !== name) {
            // 如果组件的name不相等，继续上一级寻找
            parent = parent.$parent
        } else {
            return parent
        }
    }
    return false
}

export function getParentFirstCarbUI(proxy) {
    let parent = proxy.$parent
    // 通过while历遍，这里主要是为了H5需要多层解析的问题
    while (parent) {
        // 父组件
        if (parent.$options && parent.$options.name && parent.$options.name.indexOf('Crab') !== -1) {
            // 如果组件的name不相等，继续上一级寻找
            return parent
        } else {
            parent = parent.$parent
        }
    }
    return false
}

export function getVarType(anything = undefined) {
    return Object.prototype.toString.call(anything).slice(8, -1)
}

// 判断对象是否相等
export function diffByObj(obj1, obj2) {
    const o1 = obj1 instanceof Object
    const o2 = obj2 instanceof Object
    // 判断是不是对象
    if (!o1 || !o2) {
        return obj1 === obj2
    }

    // Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,
    // 例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false
    }
    let isDif = true
    for (const o in obj1) {
        const t1 = obj1[o] instanceof Object
        const t2 = obj2[o] instanceof Object
        if (t1 && t2) {
            isDif = diffByObj(obj1[o], obj2[o])
        } else if (obj1[o] !== obj2[o]) {
            isDif = false
        }
        if (!isDif) break
    }
    return isDif
}

export function bindEvent(provideKey = publishAndSubscribe) {
    const crabParentEventMap = new Map()
    const crabChildrenEventMap = new Map()
    const provideData = {}

    const $on = (eventMap, eventName, callback) => {
        if (eventMap.has(eventName)) {
            eventMap.get(eventName).add(callback)
        } else {
            eventMap.set(eventName, new Set([callback]))
        }
    }

    const $emit = (eventMap, eventName, data) => {
        Array.from(eventMap.get(eventName) || new Set([])).forEach(v => v(data))
        getVarType(data) === 'Function' && data()
    }
    provide(provideKey, {
        $off: (eventName, callback) => {
            crabChildrenEventMap.has(eventName) && crabChildrenEventMap.get(eventName).delete(callback)
        },
        $on: (eventName, callback) => $on(crabChildrenEventMap, eventName, callback),
        $emit: (eventName, data) => $emit(crabParentEventMap, eventName, data),
        extraData: provideData
    })

    return {
        $emit: (eventName, callback) => $emit(crabChildrenEventMap, eventName, callback),
        $on: (eventName, callback) => $on(crabParentEventMap, eventName, callback),
        $off: () => {
            crabParentEventMap.clear()
            crabChildrenEventMap.clear()
        },
        addProvide: (key, value) => {
            provideData[key] = value
        }
    }
}

export function sleep(time = 1000) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, time)
    })
}

export function registerEvent(provideKey) {
    return inject(provideKey || publishAndSubscribe, false)
}

export function zeroFill(num) {
    num = Number(num)
    return num > 9 ? String(num) : ('0' + num)
}

/**
 * 是否是图片
 * @parmas src {String} 地址或者icon值
 * @return {Boolean}
 */
export const isImg = src => {
    if (src == null) {
        return false
    }
    // 这个针对微信或者H5
    if (src.startsWith('data:image') || src.startsWith('wxfile')) return true
    // 远端地址都认为是图片
    if (/(http:\/\/|https:\/\/|bolb:\/\/)((\w|=|\?|\.|\/|&|-)+)/g.test(src)) {
        return true
    }
    return /\.(png|jpg|gif|jpeg|svg|bmp|pic)$/i.test(src)
}

/**
 * 节流(规定的时间才触发)
 * @parmas fn 结束完运行的回调
 * @parmas delay 规定时间
 */
export const throttle = (function () {
    let timeout = null
    return function (func, wait) {
        const context = this
        const args = arguments
        if (!timeout) {
            timeout = setTimeout(() => {
                timeout = null
                func.apply(context, args)
            }, wait)
        }
    }
})()

/**
 * 防抖
 * @parmas fn 回调函数
 * @parmas time 规定时间
 */
export const debounce = (function () {
    let timer
    return function (func, wait = 500, immediate) {
        const context = this
        const args = arguments
        const delayedCall = function () {
            timer = null
            if (!immediate) {
                func.apply(context, args)
            }
        }
        const callNow = immediate && !timer
        clearTimeout(timer)
        timer = setTimeout(delayedCall, wait)
        if (callNow) {
            func.apply(context, args)
        }
    }
})()

/**
 * 一维数组转多维数组
 * @parmas arr { Array } 需要转化的原数组
 * @parmas num { Number } 维度
 * @return { Array }
 */
export const chunk = (arr, count = 1) => {
    const array = deepClone(arr)
    const pages = []
    array.forEach((item, index) => {
        const page = Math.floor(index / count)
        if (!pages[page]) pages[page] = []
        pages[page].push(item)
    })
    return pages
}

//
export const shuffle = ([...arr]) => {
    let m = arr.length
    while (m) {
        const i = Math.floor(Math.random() * m--);
        [arr[m], arr[i]] = [arr[i], arr[m]]
    }
    return arr
}

// 生成随机uid
export function guuid(len = 32, firstU = true, radix = null) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    const uuid = []
    radix = radix || chars.length

    if (len) {
        // 如果指定uuid长度,只是取随机的字符,0|x为位运算,能去掉x的小数位,返回整数位
        for (let i = 0; i < len; i++) {
            uuid[i] = chars[0 | (Math.random() * radix)]
        }
    } else {
        let r
        // rfc4122标准要求返回的uuid中,某些位为固定的字符
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
        uuid[14] = '4'

        for (let i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | (Math.random() * 16)
                uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
            }
        }
    }
    // 移除第一个字符,并用u替代,因为第一个字符为数值时,该uuid不能用作id或者class
    if (firstU) {
        uuid.shift()
        return 'u' + uuid.join('')
    } else {
        return uuid.join('')
    }
}

export function getProperty(data, prop) {
    const modal = getProxyData(data)
    if (!modal || Object.keys(data).length === 0 || getVarType(prop) !== 'String' || !prop) return ''
    return prop.split('.').reduce((a, b) => {
        return getVarType(a) === 'Object' && hasPrototypeProterty(a, b) ? a[b] : ''
    }, modal)
}

export function setProperty(data, prop, val) {
    if (!prop) return
    const newData = isRef(data) ? data.value : data
    const propLink = prop.split('.')
    const maxPropLinkIndex = propLink.length - 1
    propLink.reduce((a, b, index) => {
        // 说明之前存在对象
        if (getVarType(a) === 'Object') {
            if (index === maxPropLinkIndex) {
                a[b] = val
            } else {
                getVarType(a[b]) !== 'Object' && (a[b] = {})
            }
        } else {
            // 之前不存在
            if (index === maxPropLinkIndex) {
                a = { b: val }
            } else {
                a = { b: {} }
            }
        }
        return a[b]
    }, newData)
    return newData
}

export function removeProperty(data, prop) {
    if (!prop) return
    const newData = isRef(data) ? data.value : data
    const propLink = prop.split('.')
    const maxPropLinkIndex = propLink.length - 1
    let temp = newData
    for (let i = 0; i <= maxPropLinkIndex; i++) {
        if (i === maxPropLinkIndex) {
            delete temp[propLink[i]]
        } else {
            temp = temp[propLink[i]]
            if (getVarType(temp) !== 'Object') break
        }
    }
    return newData
}

// 判断属性是否在原型链中
export function hasPrototypeProterty(obj, name) {
    return Object.prototype.hasOwnProperty.call(obj, name)
}

export const sessionCatch = {
    set(key, value) {
        key = `${key}Session`
        // #ifdef H5
        sessionStorage.setItem(key, value)
        // #endif
        // #ifndef H5
        uni.setStorageSync(key, value)
        // #endif
    },
    get(key) {
        key = `${key}Session`
        // #ifdef H5
        sessionStorage.getItem(key)
        // #endif
        // #ifndef H5
        uni.getStorageSync(key)
        // #endif
    },
    remove(key) {
        key = `${key}Session`
        // #ifdef H5
        sessionStorage.removeItem(key)
        // #endif
        // #ifndef H5
        uni.removeStorageSync(key)
        // #endif
    },
    clear(key, value) {
        key = `${key}Session`
        // #ifdef H5
        sessionStorage.clear()
        // #endif
        // #ifndef H5
        uni.clearStorageSync()
        // #endif
    }
}
