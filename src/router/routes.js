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
        path: '/crabui-doc/example',
        name: 'crabuiDoc',
        component: __dynamicImportComponent__('@/crabui-doc/example/components.vue', {
            pageType: 'top'
        })
    },
    {
        path: '/pages/componentsA/button/button',
        name: 'button',
        component: __dynamicImportComponent__('@/crabui-doc/componentsA/button/button.vue', {
            pageType: 'top'
        })
    }
]
