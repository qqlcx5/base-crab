/*
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-12-30 22:41:05
 */
export default {
    // #ifdef MP-WEIXIN
    // 将自定义节点设置成虚拟的，更加接近Vue组件的表现，能更好的使用flex属性
    options: {
        virtualHost: true,
        styleIsolation: 'shared'
    },
    // #endif
    props: {
        // 每个组件都有的父组件传递的样式，可以为字符串或者对象形式
        customStyle: {
            type: [Object, String],
            default: () => ({})
        },
        customClass: {
            type: String,
            default: ''
        },
        // 是否注入主题，祖先节点一定要有ca-theme才能够生效
        theme: {
            type: Boolean,
            default: true
        }
    }
}
