/*
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-11-13 14:35:10
 */
import App from './App'

import { createSSRApp } from 'vue'
import store from '@/store'
import router from '@/router'
import crabUI from '@/crabui'
import apiList from './service'
import { createI18n } from 'vue-i18n'

// 国际化 json 文件，文件内容详见下面的示例
import messages from './locale'// v9.x

const envObj = {
    development: 'https://api-test.cikelink.com/',
    test: 'https://api-test.cikelink.com/',
    production: 'https://api.cikelink.com/'
}
const env = import.meta.env.MODE || 'development'

const i18n = createI18n({
    locale: uni.getLocale('lang') || 'zh-Hans', // 获取已设置的语言
    legacy: false,
    messages
})

export function createApp() {
    const app = createSSRApp(App)
    app.use(store).use(i18n).use(crabUI, {
        // 请求相关的配置
        http: {
            // 请求头字段配置（baseURL无效），设置请求地址请在下面的apiConfig里面进行配置
            header: {
            },
            apiConfig: {
                // 代理名称
                proxyName: '',
                // 备用域名配置,至少配置一个,这边会自动设置baseUrl，至少传入一个域名，H5本地调试会自己代理到proxyName
                domainList: [
                    envObj[env]
                ]
            },
            // 所有的api列表
            apiList
        }
    })
    return {
        app,
        i18n,
        router
    }
}
