/*
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-12-21 09:54:46
 */
export default {
    /**
    * 是否显示modal框
    */
    modelValue: {
        type: Boolean,
        default: false
    },
    // 自定义class
    customClass: {
        type: String,
        default: ''
    },
    // 是否销毁弹窗
    destroyEle: {
        type: Boolean,
        default: false
    },
    // 默认使用fixed模式，否则是relative
    fixed: {
        type: Boolean,
        default: true
    },
    /**
     * 参数说明（定位）
     * top  right bottom left center
     */
    position: {
        type: String,
        default: 'center'
    },
    /**
     * 是否显示关闭按钮
     */
    showClose: Boolean,
    /**
     * 关闭按钮位置  可选值 top-right | top-left | bottom-right | bottom-left
     */
    closePos: {
        type: String,
        default: 'top-right'
    },
    /**
     * 关闭按钮颜色
     */
    closeColor: {
        type: String,
        default: '#D8D8D8'
    },
    /**
     * mode = top | center | bottom时有效
     * 弹窗内容的高度
     */
    height: {
        type: [Number, String],
        default: 'auto'
    },
    /**
     * 弹窗内容的宽度, 仅在mode = left | center | right 时有效
     */
    width: {
        type: [Number, String],
        default: '80%'
    },
    /**
     * 关闭按钮大小
     */
    closeSize: {
        type: [Number, String],
        default: 28
    },
    /**
     * 是否显示蒙板
     */
    mask: {
        type: Boolean,
        default: true
    },
    /**
     * 点击蒙板是否关闭,默认true关闭
     */
    maskabled: {
        type: Boolean,
        default: true
    },
    /**
     * 模态框背景颜色
     */
    bgColor: {
        type: String,
        default: '#fff'
    },
    maskBgColor: {
        type: String,
        default: 'rgba(0, 0, 0, 0.55)'
    },
    /**
     * 模态框圆角,支持css写法
     */
    radius: {
        type: [String, Number],
        default: 0
    },
    // 仅在mode 为 center时有效
    zoom: {
        type: Boolean,
        default: true
    },
    // 动画时长 单位ms  200ms = 0.2s
    duration: {
        type: Number,
        default: 300
    },
    // 默认999 比系统高1
    zIndex: {
        type: [String, Number],
        default: 999
    },
    showStatusBar: {
        type: Boolean,
        default: true
    },
    // 是否开启沉浸式导航,会帮你清空顶部电池栏
    hasNav: Boolean,
    /**
     * 是否含有tabbar
     */
    hasTabbar: {
        type: Boolean,
        default: false
    },
    // 外层容器样式
    wrapperStyle: {
        type: [Object, String],
        default: ''
    },
    // 内容体额外样式
    contentStyle: {
        type: [Object, String],
        default: () => ''
    },
    clearSafeArea: {
        type: Boolean,
        default: true
    }
}
