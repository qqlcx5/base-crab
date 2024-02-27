/*
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-12-21 09:54:46
 */
export default {
    /**
     * 同image的modem,如果设置宽高为百分比  mode设置会失效变成widthFix
     */
    mode: {
        type: String,
        default: 'scaleToFill'
    },
    // 是否显示加载中
    showLoading: {
        type: [String, Boolean],
        default: false
    },
    // 加载中字号大小
    loadingSize: {
        type: [String, Number],
        default: 50
    },
    // 错误图片地址
    errSrc: {
        type: String,
        default: ''
    },
    // 没有设置width或height就会取size的值
    size: {
        type: [String, Number],
        default: '100%'
    },
    // 图片的宽
    width: {
        type: [String, Number],
        default: 0
    },
    // 图片的高
    height: {
        type: [String, Number],
        default: 0
    },
    // 仅在设置size大小才有效，也就是圆形
    circle: {
        type: Boolean,
        default: false
    },
    // 图片的最大高
    maxHeight: {
        type: [String, Number],
        default: 0
    },
    // 图片地址,支持静态地址,网络地址
    src: {
        type: String,
        default: ''
    },
    // 图片圆角,解决app端问题，如果设置了shape为circle，该属性就失效了
    radius: {
        type: [String, Number],
        default: 0
    },
    bgColor: {
        type: String,
        default: 'transparent'
    },
    // 是否使用过渡效果
    effect: {
        type: Boolean,
        default: false
    },
    // 是否有边框
    border: {
        type: Boolean,
        default: false
    },
    borderColor: {
        type: String,
        default: '#fff'
    },
    // 淡入淡出动画的过渡时间
    duration: {
        type: [Number, String],
        default: 300
    },
    showMenuByLongpress: {
        type: Boolean,
        default: false
    },
    // 可选值有normal/update
    type: {
        type: String,
        default: 'normal'
    }
}
