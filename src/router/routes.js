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
        path: '/pages/user/login',
        name: 'login',
        component: __dynamicImportComponent__('@/pages/user/login/index.vue', {
            pageType: 'top'
        })
    },
    {
        path: '/pages/user/sms-login',
        name: 'smsLogin',
        component: __dynamicImportComponent__('@/pages/user/login/sms-login.vue', {
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
        component: __dynamicImportComponent__('@/crabui-doc/componentsA/button/button.nvue', {
            pageType: 'top'
        })
    },
    // pages/componentsA/image/image
    {
        path: '/pages/componentsA/image/image',
        name: 'image',
        component: __dynamicImportComponent__('@/crabui-doc/componentsA/image/image.nvue', {
            pageType: 'top'
        })
    },
    // pages/componentsA/image/image
    {
        path: '/pages/componentsA/icon/icon',
        name: 'icon',
        component: __dynamicImportComponent__('@/crabui-doc/componentsA/icon/icon.nvue', {
            pageType: 'top'
        })
    },
    {
        path: '/pages/componentsA/loading-icon/loading-icon',
        name: 'loadingIcon',
        component: __dynamicImportComponent__('@/crabui-doc/componentsA/loading-icon/loading-icon.nvue', {
            pageType: 'top'
        })
    },
    {
        path: '/pages/componentsA/loading-page/loading-page',
        name: 'loadingPage',
        component: __dynamicImportComponent__('@/crabui-doc/componentsA/loading-page/loading-page.nvue', {
            pageType: 'top'
        })
    },
    {
        path: '/pages/componentsA/cell/cell',
        name: 'cell',
        component: __dynamicImportComponent__('@/crabui-doc/componentsA/cell/cell.vue', {
            pageType: 'top'
        })
    },
    {
        path: '/pages/componentsA/rate/rate',
        name: 'rate',
        component: __dynamicImportComponent__('@/crabui-doc/componentsA/rate/rate.vue', {
            pageType: 'top'
        })
    },
    {
        path: '/pages/componentsA/checkbox/checkbox',
        name: 'checkbox',
        component: __dynamicImportComponent__('@/crabui-doc/componentsA/checkbox/checkbox.nvue', {
            pageType: 'top'
        })
    },
    {
        path: '/pages/componentsA/radio/radio',
        name: 'radio',
        component: __dynamicImportComponent__('@/crabui-doc/componentsA/radio/radio.nvue', {
            pageType: 'top'
        })
    },

    {
        path: '/pages/componentsB/badge/badge',
        name: 'badge',
        component: __dynamicImportComponent__('@/crabui-doc/componentsB/badge/badge.vue', {
            pageType: 'top'
        })
    },
    {
        path: '/pages/componentsB/tag/tag',
        name: 'tag',
        component: __dynamicImportComponent__('@/crabui-doc/componentsB/tag/tag.nvue', {
            pageType: 'top'
        })
    },
    {
        path: '/pages/componentsC/form/form',
        name: 'form',
        component: __dynamicImportComponent__('@/crabui-doc/componentsC/form/form.vue', {
            pageType: 'top'
        })
    },
    {
        path: '/pages/componentsC/calendar/calendar',
        name: 'calendar',
        component: __dynamicImportComponent__('@/crabui-doc/componentsC/calendar/calendar.vue', {
            pageType: 'top'
        })
    },

    {
        path: '/pages/componentsB/keyboard/keyboard',
        name: 'keyboard',
        component: __dynamicImportComponent__('@/crabui-doc/componentsB/keyboard/keyboard.vue', {
            pageType: 'top'
        })
    },
    {
        path: '/pages/componentsC/picker/picker',
        name: 'picker',
        component: __dynamicImportComponent__('@/crabui-doc/componentsC/picker/picker.vue', {
            pageType: 'top'
        })
    },
    {
        path: '/pages/componentsB/search/search',
        name: 'search',
        component: __dynamicImportComponent__('@/crabui-doc/componentsB/search/search.vue', {
            pageType: 'top'
        })
    },
    {
        path: '/pages/componentsB/numberBox/numberBox',
        name: 'numberBox',
        component: __dynamicImportComponent__('@/crabui-doc/componentsB/numberBox/numberBox.vue', {
            pageType: 'top'
        })
    },
    {
        path: '/pages/componentsB/upload/upload',
        name: 'upload',
        component: __dynamicImportComponent__('@/crabui-doc/componentsB/upload/upload.vue', {
            pageType: 'top'
        })
    },
    {
        path: '/pages/componentsB/code/code',
        name: 'code',
        component: __dynamicImportComponent__('@/crabui-doc/componentsB/code/code.nvue', {
            pageType: 'top'
        })
    },
    {
        path: '/pages/componentsC/input/input',
        name: 'input',
        component: __dynamicImportComponent__('@/crabui-doc/componentsC/input/input.nvue', {
            pageType: 'top'
        })
    },
    {
        path: '/pages/componentsC/textarea/textarea',
        name: 'textarea',
        component: __dynamicImportComponent__('@/crabui-doc/componentsC/textarea/textarea.nvue', {
            pageType: 'top'
        })
    },
    {
        path: '/pages/componentsB/switch/switch',
        name: 'switch',
        component: __dynamicImportComponent__('@/crabui-doc/componentsB/switch/switch.nvue', {
            pageType: 'top'
        })
    },
    {
        path: '/pages/componentsB/progress/progress',
        name: 'progress',
        component: __dynamicImportComponent__('@/crabui-doc/componentsB/progress/progress.nvue', {
            pageType: 'top'
        })
    },
    {
        path: '/pages/componentsB/alert/alert',
        name: 'alert',
        component: __dynamicImportComponent__('@/crabui-doc/componentsB/alert/alert.nvue', {
            pageType: 'top'
        })
    },
    // {
    //     path: '/pages/componentsB/toast/toast',
    //     name: 'toast',
    //     component: __dynamicImportComponent__('@/crabui-doc/componentsB/toast/toast.nvue', {
    //         pageType: 'top'
    //     })
    // }
    {
        path: '/pages/componentsA/popup/popup',
        name: 'popup',
        component: __dynamicImportComponent__('@/crabui-doc/componentsA/popup/popup.nvue', {
            pageType: 'top'
        })
    },
    {
        path: '/pages/componentsC/modal/modal',
        name: 'modal',
        component: __dynamicImportComponent__('@/crabui-doc/componentsC/modal/modal.nvue', {
            pageType: 'top'
        })
    },
    // {
    //     path: '/pages/componentsA/line/line',
    //     name: 'line',
    //     component: __dynamicImportComponent__('@/crabui-doc/componentsA/line/line.nvue', {
    //         pageType: 'top'
    //     })
    // },
    {
        path: '/pages/componentsA/overlay/overlay',
        name: 'overlay',
        component: __dynamicImportComponent__('@/crabui-doc/componentsA/overlay/overlay.nvue', {
            pageType: 'top'
        })
    },
    {
        path: '/pages/componentsB/tabbar/tabbar',
        name: 'tabbar',
        component: __dynamicImportComponent__('@/crabui-doc/componentsB/tabbar/tabbar.nvue', {
            pageType: 'top'
        })
    },
    {
        path: '/pages/componentsC/tabs/tabs',
        name: 'tabs',
        component: __dynamicImportComponent__('@/crabui-doc/componentsC/tabs/tabs.nvue', {
            pageType: 'top'
        })
    },
    {
        path: '/pages/componentsC/steps/steps',
        name: 'steps',
        component: __dynamicImportComponent__('@/crabui-doc/componentsC/steps/steps.vue', {
            pageType: 'top'
        })
    },
    {
        path: '/pages/componentsA/empty/empty',
        name: 'empty',
        component: __dynamicImportComponent__('@/crabui-doc/componentsA/empty/empty.nvue', {
            pageType: 'top'
        })
    },
    {
        path: '/pages/componentsB/parse/parse',
        name: 'parse',
        component: __dynamicImportComponent__('@/crabui-doc/componentsB/parse/parse.nvue', {
            pageType: 'top'
        })
    }

]
