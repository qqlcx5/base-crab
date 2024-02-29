/*
 * @Author: sanshui
 * @Date: 2023-08-28 09:18:07
 * @LastEditors: sanshui
 * @Description: For better maintenance, please fill in the document description carefully, thank you ~
 */
// router.js
import { __dynamicImportComponent__ } from '@/crabui/libs/router'
export const hotRefresh = {
    mode: process.env.NODE_ENV
    // to: '/index',
    // navType: 'pushTab'
}
export const routes = [
    {
        path: '/',
        name: 'index',
        component: __dynamicImportComponent__('@/pages/index/index.vue', {
            pageType: 'top'
        })
    },
    {
        path: '/crabui-doc/index',
        name: 'crabuiDoc',
        component: __dynamicImportComponent__('@/pages/crabui-doc/index.vue', {
            pageType: 'top'
        })
    },
    {
        path: '/crabui-doc/button',
        name: 'button',
        component: __dynamicImportComponent__('@/pages/crabui-doc/button.vue', {
            pageType: 'top'
        })
    },
    {
        path: '/crabui-doc/cell',
        name: 'cell',
        component: __dynamicImportComponent__('@/pages/crabui-doc/cell.vue', {
            pageType: 'top'
        })
    }
]
