/*
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-12-21 09:54:46
 */
export default {
    destroyEle: {
        type: Boolean,
        default: false
    },
    // 浮动方向,值为top或者bottom
    position: {
        type: String,
        default: 'top'
    },
    // 清空高度
    fixedHeight: {
        type: [String, Number],
        default: 'inherit'
    },
    // 当fixedHeight为inherit有效，清楚浮动的高度,支持rpx px,不写单位默认为rpx
    height: {
        type: [String, Number],
        default: 88
    },
    modelValue: {
        type: Boolean,
        default: true
    },
    // 外层容器样式
    wrapperStyle: {
        type: [String, Object],
        default: ''
    },
    // 动画时长 单位ms  300ms = 0.3s
    duration: {
        type: Number,
        default: 300
    },
    zIndex: {
        type: Number,
        default: 10
    },
    radius: {
        type: [String, Number],
        default: 0
    },
    showClose: Boolean,
    // 是否有导航栏,仅在H5下生效
    hasNav: {
        type: Boolean,
        default: true
    },
    // 是否有底部菜单栏
    hasTabbar: Boolean,
    bgColor: {
        type: String,
        default: '#fff'
    }
}
