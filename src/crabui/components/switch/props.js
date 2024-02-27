export default {
    // 双向绑定的值
    modelValue: {
        type: [String, Number, Boolean],
        default: false
    },
    space: {
        type: [Number, String],
        default: 4
    },
    // 开关尺寸,默认单位是rpx
    size: {
        type: [Number, String],
        default: 56
    },
    textSize: {
        type: [String, Number],
        default: 26
    },
    // 选中的值
    onVal: {
        type: [String, Number, Boolean],
        default: true
    },
    // 未选中的值
    offVal: {
        type: [String, Number, Boolean],
        default: false
    },
    // 开启展示的值
    onText: {
        type: String,
        default: ''
    },
    // 关闭展示的值
    offText: {
        type: String,
        default: ''
    },
    textStyle: {
        type: [String, Object],
        default: ''
    },
    // 字体颜色
    textColor: {
        type: String,
        default: '#666'
    },
    // 选中时字体颜色
    textSelColor: {
        type: String,
        default: '#fff'
    },
    // 文字常显
    textDisplay: {
        type: Boolean,
        default: false
    },
    // 滑槽阴影,同css的box-shadow
    chuteShadow: {
        type: String,
        default: '-2rpx 2rpx 4rpx 0 rgba(0,0,0,.25)'
    },
    // 开关底座颜色（可以是渐变色）, 球的轨道
    chuteColor: {
        type: String,
        default: '#eee'
    },
    // 开关底座选中颜色, 球的轨道
    chuteSelColor: {
        type: String,
        default: '#007aff'
    },
    // 只读
    readonly: {
        type: Boolean,
        default: false
    },
    // 禁止滑动
    disabled: {
        type: Boolean,
        default: false
    },
    // 禁止滑动的提示
    disabledText: {
        type: String,
        default: ''
    },
    // 滑动球颜色
    slideColor: {
        type: String,
        default: '#fff'
    },
    // 开关开启后滑动球颜色
    slideSelColor: {
        type: String,
        default: '#fff'
    },
    // 形状
    shape: {
        type: String,
        values: ['circle', 'square'],
        default: 'circle'
    },
    // 异步关闭
    async: {
        type: Boolean,
        default: false
    },
    // loading大小，默认单位rpx
    loadingSize: {
        type: [String, Number],
        default: 40
    },
    // 加载状态
    loading: {
        type: Boolean,
        default: false
    },
    // loading转圈颜色
    loadingColor: {
        type: String,
        default: ''
    }
}
