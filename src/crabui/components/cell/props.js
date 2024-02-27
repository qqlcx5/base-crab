/*
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-12-21 09:54:46
 */
function sizeValidator(value) {
    return ['large', 'normal'].includes(value)
}
export default {
    cellStyle: {
        type: [Object, String],
        default: ''
    },
    // 左侧标题
    title: {
        type: String,
        default: ''
    },
    // 标题下方的描述信息
    label: {
        type: String,
        default: ''
    },
    // 右侧内容
    value: {
        type: String,
        default: ''
    },
    // 可选值 large | medium
    size: {
        type: String,
        default: null,
        validator: sizeValidator
    },
    // 左侧图标名称，或者图片链接(本地文件建议使用绝对地址)
    icon: {
        type: String,
        default: ''
    },
    iconSize: {
        type: [String, Number],
        default: ''
    },
    // 右侧图标名称，或者图片链接(本地文件建议使用绝对地址)
    rightIcon: {
        type: String,
        default: ''
    },
    arrow: {
        type: Boolean,
        default: null
    },
    border: {
        type: Boolean,
        default: true
    },
    // 水波特效
    ripple: {
        type: Boolean,
        default: true
    },
    to: {
        type: [String, Object],
        default: ''
    }
}
