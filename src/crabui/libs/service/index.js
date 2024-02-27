import http from './request.js'
import {
    deepClone,
    getVarType,
    sessionCatch
} from '../utils/tools.js'
import { showModal, showToast, hideLoading } from '../utils/message.js'

let curPage = {}
const needCatchList = {}
const currentPath = ''
const successKeyAndCode = {
    key: 'code',
    code: 0
}

export function setKeyAndCode({ key, code }) {
    if (key !== undefined) {
        successKeyAndCode.key = key
    }
    if (code !== undefined) {
        successKeyAndCode.code = code
    }
}

// 设置请求列表
export function setRequestList(reqList) {
    for (const key in reqList) {
        const item = reqList[key]
        item.persistence = item.persistence ?? true
        item.catchBefore = item.catchBefore ?? false
        item.showErr = item.showErr ?? true
        item.showModal = item.showModal ?? false
        item.modalBack = item.modalBack ?? true
        item.source = item.source ?? 'any'
        item.abort = item.abort ?? true
        item.type = item.type ?? 'post'
        needCatchList[key] = item
    }
}
/**
 * @description 请求前统一拦截
 * @param {String} name 请求地址值key，具体看配置文件@/api/config.js
 * @param {Object} query 请求参数列表
 * @param {String} modifyObj 修改请求配置
 * @param {String} type 请求类型：get | post | upload,默认post
 * @param {Boolean} reLoad 是否是重发请求类型：get | post,默认post
 * @return {Promise} 返回是一个promise
 */
export default function requestBefore(name, query = {}, modifyObj = {}, type) {
    const pages = getCurrentPages()
    const tempCurPage = pages.length ? pages[pages.length - 1] : {}
    if (currentPath !== tempCurPage.route) {
        if (tempCurPage.route) {
            // #ifdef H5
            curPage = tempCurPage
            // #endif
            // #ifndef H5
            curPage = tempCurPage.$vm
            // #endif
        }
    }
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        const catchObj = getRequestconfig(name)
        if (modifyObj) {
            for (const i in modifyObj) {
                if (typeof modifyObj[i] === 'object' && typeof catchObj[i] === 'object') {
                    Object.assign(catchObj[i], modifyObj[i])
                } else {
                    catchObj[i] = modifyObj[i]
                }
            }
        }
        if (!catchObj.url) { // 请求地址不能为空
            // showToast('请求地址错误');
            // #ifdef H5
            console.error('[fatal error] 请求地址错误，『' + name + '』不存在请求配置文件中')
            // #endif
            // #ifndef H5
            console.log('[fatal error] 请求地址错误，『' + name + '』不存在请求配置文件中')
            // #endif
            return reject(new Error('请求地址不能为空'))
        }

        if (catchObj.catchName && !catchObj.update && catchObj.abort) { // 说明需要存缓存，先去去缓存，强制更新他人的  必须请求
            const storage = catchObj.persistence ? uni.getStorageSync : sessionCatch.get
            const catchName = getCatchName(catchObj.catchName, query)
            const catchStorage = storage(catchName)
            if (catchStorage) {
                return resolve({
                    code: 0,
                    msg: '读取缓存成功',
                    data: catchObj.catchBefore ? await catchObj.catchBefore(catchStorage, query) : catchStorage
                })
            }
            if (catchObj.source === 'catch') { // 如果缓存没有则返回空，一般是object类型
                return resolve({
                    code: 0,
                    msg: '缓存中没有相应数据',
                    data: {}
                })
            }
        }
        type = (type || catchObj.type || 'POST').toLocaleLowerCase()
        catchObj.url += (getVarType(query) === 'String' ? ('/' + query) : '')
        let taskFn = null
        if (getVarType(query) === 'Object') {
            taskFn = query.getTask
            delete query.getTask
        }

        // catchObj.loading && showLoading(String(catchObj.loading) === 'true' ? '' : catchObj.loading)
        http[type](
            catchObj.url,
            type !== 'get' && type !== 'download'
                ? {
                    ...query,
                    getTask: (task, options) => {
                        task.onProgressUpdate((res) => {
                            taskFn?.(res)
                        })
                    }
                }
                : {
                    params: query
                }
        ).then(async res => {
            catchObj.loading && hideLoading()
            // 如果是刷新token过程中有偷溜的要禁止返回
            await responseSuccess(res, catchObj, query)
            if (res.code === 0) {
                resolve(res)
            } else {
                reject(res)
            }
        }).catch(err => {
            catchObj.loading && hideLoading()
            responseFail(err, catchObj)
            reject(err)
        })
    })
}

// 判断请求地址是否在配置好的地址表中,如果没有直接转换成跟地址表一样的格式
export function getRequestconfig(name) {
    const hasFullAddress = String(name).indexOf('/') !== -1
    const requestName = Object.keys(needCatchList).find(o => needCatchList[o].url === name)
    return deepClone((hasFullAddress ? requestName ? needCatchList[requestName] : false : needCatchList[name]) || (hasFullAddress ? { url: name } : {}))
}

export function resendRefreshRequest() {
    return requestBefore('shuaxinWxApp', null, {
        abort: false
    })
}

export function resendChangeDomainRequest() {
    return requestBefore('shopInfo', null, {
        abort: false
    })
}

function responseFail(res, catchObj = {}) {
    if (catchObj.toast && res.code) {
        uni.getNetworkType({
            success: (res) => {
                if (res.networkType === 'none' || res.networkType === 'unknown') {
                    showToast(res.msg || '您的网络不佳')
                } else {
                    showToast(res.msg || '系统繁忙')
                }
            }
        })
    }
}

async function responseSuccess(res, catchObj, query) {
    if (res.code === 0) {
        res.data = catchObj.catchBefore ? await catchObj.catchBefore(res.data, query) : res.data
        if (catchObj.catchName || catchObj.update) { // 表示要进行缓存或者强制更新
            catchHandle(catchObj, res, query)
        }
        if (catchObj.removeName) {
            const removeObj = needCatchList[catchObj.removeName]
            const removeName = getCatchName(removeObj.name)
            if (removeObj.persistence) {
                uni.removeStorageSync(removeName)
            } else {
                sessionCatch.remove(removeName)
            }
        }
        catchObj.toast && showToast(getVarType(catchObj.toast) === 'Boolean' ? res.msg : catchObj.toast, 1)
    } else {
        if (res.code === 20200 || (res.code === 20202 && catchObj.url === 'WxApp/shuaxin')) { // token错误，需要登录，可能未登录
            showLoginModal(catchObj, res.data ? res.data.msg : res.msg)
        } else if (res.code !== 20202) {
            catchObj.showErr && showToast(res.msg)
            catchObj.showModal && showLoginModal(catchObj, res.msg, false, '错误提示', '我知道了')
        }
    }
}

export function showLoginModal(catchObj, content = '您还未登录或登录已过期，请登录后操作', showCancel = true, title = '温馨提示', confirmText = '确定') {
    // 第一次进来,一般是在中转页
    if (!curPage) return
    if (curPage.$config && curPage.$config.forceLoginWhite.includes(curPage.$Route.name)) return
    removeUserInfo()
    if (!getApp().globalData.errModalFlag) {
        getApp().globalData.errModalFlag = true
        showModal({
            title,
            // content: `${content}(${catchObj.url})`,
            content: `${content}`,
            cancelText: catchObj.modalBack ? '返回' : '取消',
            showCancel,
            confirmText,
            success: res => {
                getApp().globalData.errModalFlag = false
                if (res.confirm) {
                    console.log('这边做点啥')
                } else {
                    catchObj.modalBack && uni.$ca.back()
                }
            }
        })
    }
}

export function removeUserInfo() {
    needCatchList.userInfo && removeStorageSync([needCatchList.userInfo])
    needCatchList.shuaxinWxApp && removeStorageSync([needCatchList.shuaxinWxApp])
    uni.removeStorageSync('prveTokenSession')
}

/**
 * @description 缓存统一设置或删除管理
 * @param {Object} catchObj 缓存对象
 * @param {type} queryObj 请求参数
 */

function catchHandle(catchObj = {}, resObj = {}, queryObj = {}) {
    const catchName = getCatchName(catchObj.catchName, queryObj)
    if (catchName === 'jscode2session' && resObj.result) {
        const prevToken = uni.getStorageSync(catchName)
        if (prevToken.token) {
            setStorageSync('prveToken', {}, prevToken.token)
        }
    }
    catchObj.catchName && setStorageSync(catchName, catchObj, resObj.data)
}

/**
 * @description 获取缓存名称
 * @param {Object} catchObj 缓存项
 * @return {String}
 */
const getCatchName = (nameObj, queryObj = {}) => {
    let catchName = ''
    if (getVarType(nameObj) === 'Object') {
        catchName = nameObj.value
        if (nameObj.position) {
            let extraName = ''
            if (getVarType(nameObj.storage) === 'Function') {
                (async () => {
                    nameObj.storage = await nameObj.storage()
                })()
            }
            const nameStorage = nameObj.storage ? nameObj.storage : false
            if (nameStorage) {
                extraName = nameStorage[extraName] || ''
            } else if (getVarType(queryObj) === 'Object') {
                const _key = nameObj.key || ''
                extraName = queryObj[_key] || _key
            } else {
                extraName = queryObj
            }
            catchName = nameObj.position === 'after' ? (catchName + extraName) : (extraName + catchName)
        }
    } else {
        catchName = nameObj
    }
    return catchName
}
// 设置缓存
function setStorageSync(name, catchObj, data) {
    if (getVarType(data) === 'Object' && JSON.stringify(data) === '{}') return
    if (getVarType(data) === 'Array' && data.length === 0) return
    const {
        persistence
    } = catchObj
    if (persistence) {
        uni.setStorageSync(name, data)
    } else {
        sessionCatch.set(name, data)
    }
}
/**
 * @param {Array} list 需要清空缓存的数组
 * @param {String} list 键值
 * @return {Void} 无返回值
 */
function removeStorageSync(list) {
    list.forEach(o => {
        if (o) {
            let catchName
            const storage = o.persistence
                ? {
                    get: uni.getStorageSync,
                    remove: uni.removeStorageSync
                }
                : {
                    get: sessionCatch.get,
                    remove: sessionCatch.remove
                }
            const catchNameType = getVarType(o.catchName) === 'Object'
            if (catchNameType) {
                catchName = o.catchName.value
            } else {
                catchName = o.catchName
            }
            const _position = catchNameType ? o.catchName.position : false
            if (_position) { // 这种情况都是做持久化的，获取名字匹配的直接删除
                const allCatch = uni.getStorageInfoSync().keys || []
                allCatch.forEach(o1 => {
                    if (_position === 'before') { // 加载前缀
                        const item = o1.split('').reverse().join('')
                        if (item.indexOf(catchName.split('').reverse().join('')) === 0) {
                            console.warn('模糊删除前缀为：' + catchName + '的缓存')
                            storage.remove(o1)
                        }
                    } else {
                        if (o1.indexOf(catchName) === 0) {
                            console.warn('模糊删除后缀为：' + catchName + '的缓存')
                            storage.remove(o1)
                        }
                    }
                })
            } else {
                console.warn('删除缓存：' + catchName)
                storage.remove(catchName)
            }
        }
    })
}
