/*
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-06-21 15:52:38
 */
import Request from 'luch-request' // 下载的插件

import requestBefore, { resendChangeDomainRequest, getRequestconfig } from './index'

import Refresh from './refreshToken'

import { getVuex } from '../../index.js'

const curApiCatchKey = 'CURRENT_API'
// 传入的api配置
let crabRequestConfig = {
    apiCatchTime: 3660 * 24 * 1000, // 域名缓存时间
    domainList: [], // 备用域名列表
    header: {} // 请求头
}

/**
 * 修改全局配置示例
 **/
const http = new Request({
    header: {
        'Content-Type': 'application/json; charset=utf-8'
    },
    validateStatus: (statusCode) => { // statusCode 必存在。此处示例为全局默认配置
        return statusCode >= 200 && statusCode < 300
    }
})
const refreshToken = Refresh.initRefreshToken()
/* 请求之前拦截器。可以使用async await 做异步操作 */
http.interceptors.request.use(async (config) => {
    const crabRequestConfigHeader = {}
    // 设置请求头
    Object.keys(crabRequestConfig.header).forEach(key => {
        const item = crabRequestConfig.header[key]
        const itemType = typeof item
        crabRequestConfigHeader[key] = itemType === 'function' ? item() : item
    })
    config.header = {
        ...config.header,
        ...crabRequestConfigHeader
    }
    // 如果请求头有ticket这个参数，要去掉webapi
    if (config.header.ticket) {
        config.url = config.url.replace('/webapi', '')
    }
    console.log(config)
    return config
}, (err) => {
    return err
})

/**
 * 1.正在刷新跳过
 * 20200 token无效
 */
http.interceptors.response.use((response) => {
    const refreshConfig = getRequestconfig(crabRequestConfig.refreshAPI)
    // token过期
    if (response.data.errCode === 'uni-id-token-expired' && response.config.url !== refreshConfig.url) {
        // 刷新token状态中
        if (!refreshToken.isRefresh) {
            refreshToken.setRefreshType(true)
            // 刷新token
            return requestBefore(crabRequestConfig.refreshAPI, null, {
                abort: false
            }).then((res) => {
                refreshToken.notifyTaskReload()
                refreshToken.setRefreshType(false)
                // 重新對本地请求重新發送
                return http.request(response.config)
            }).catch(async (err) => {
                // 说明token已经失效无法刷新了
                if (err?.errCode) {
                    // 去自动登录下
                    await requestBefore(crabRequestConfig.loginAPI, null, {
                        abort: false
                    })
                    refreshToken.notifyTaskReload()
                    refreshToken.setRefreshType(false)
                    // 重新對本地请求重新發送
                    return http.request(response.config)
                } else {
                    refreshToken.clearTask()
                    refreshToken.setRefreshType(false)
                    return response.data
                }
            })
        }
        return new Promise((resolve, reject) => {
            // 将需要重新请求的接口添加到队列中
            refreshToken.addTask((isError) => {
                if (isError) {
                    resolve(response)
                } else {
                    http.request(response.config).then(resolve).catch(reject)
                }
            })
        })
    } else {
        return response.data
    }
}, response => {
    // 接口请求不通是不存在statusCode状态码，所以只要根据statusCode判断切域名
    const { statusCode = 0 } = response
    if (!statusCode) {
        if (crabRequestConfig.domainList.length > 1) {
            console.log('域名不存在或已宕机，正在切换域名')
            // 正在切换域名
            if (!refreshToken.isChangeDomain) {
                saveAPIConfig(true)
                refreshToken.setDomainType(true)
                // 刷新token
                return resendChangeDomainRequest().then((res) => {
                    console.log('域名切换成功，正在重发请求', res)
                    refreshToken.notifyTaskReload()
                    refreshToken.setDomainType(false)
                    return http.request(response.config)
                }).catch((e) => {
                    console.log('切换之后还是失败了', e)
                    refreshToken.clearTask()
                    refreshToken.setDomainType(false)
                    return response
                })
            }
            return new Promise((resolve, reject) => {
                // 将需要重新请求的接口添加到队列中
                refreshToken.addTask((isError) => {
                    if (isError) {
                        resolve(response)
                    } else {
                        http.request(response.config).then(resolve).catch(reject)
                    }
                })
            })
        }
        return response
    } else {
        return response
    }
})

export function setHttpConfig({ apiConfig, header = {} }) {
    const newConfig = {
        ...apiConfig,
        header
    }
    crabRequestConfig = Object.assign({}, crabRequestConfig, newConfig)
    if (!apiConfig.domainList || !apiConfig.domainList.length) {
        console.error('-----------至少设置一个baseURL地址(domainList)---------')
        return
    }
    uni.removeStorageSync(curApiCatchKey)
    saveAPIConfig(false)
}

/**
 * 切换域名
 * force {boolean} 暴力切换
*/
function saveAPIConfig(force = false) {
    const newTime = +new Date()
    let apiCatch = uni.getStorageSync(curApiCatchKey)
    // #ifdef MP-WEIXIN
    // 切换的域名有效
    if (apiCatch) {
        // 时间超过缓存时间 要切回来
        if (apiCatch.saveTime < newTime - crabRequestConfig.apiCatchTime || force || !apiCatch.url) {
            console.log('-----------请求域名缓存超时了---------')
            apiCatch = {
                saveTime: newTime,
                url: crabRequestConfig.domainList.find(o => o !== apiCatch.url)
            }
            uni.setStorageSync(curApiCatchKey, apiCatch)
        }
    } else {
        apiCatch = {
            saveTime: newTime,
            url: crabRequestConfig.domainList[0] || ''
        }
        uni.setStorageSync(curApiCatchKey, apiCatch)
    }
    // #endif
    // #ifdef H5
    apiCatch = {
        saveTime: newTime,
        url: process.env.NODE_ENV === 'production' ? crabRequestConfig.domainList[0] : crabRequestConfig.proxyName
    }
    // #endif
    // #ifndef MP-WEIXIN || H5
    apiCatch = {
        saveTime: newTime,
        url: crabRequestConfig.domainList[0] || ''
    }
    // #endif
    http && http.setConfig(_config => {
        return { ..._config, baseURL: apiCatch.url }
    })
    // 这边要对代理的地址做下处理
    const saveAPI = {
        ...apiCatch,
        // #ifdef H5
        url: crabRequestConfig.domainList[0]
        // #endif
    }
    try {
        getVuex().commit('zzspui/SET_CUR_DOMAIN', saveAPI)
    } catch (error) {
        console.log('这边没有注入保存当前请求域名的store')
    }
    return apiCatch
}

export default http
