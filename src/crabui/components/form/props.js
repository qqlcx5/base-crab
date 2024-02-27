/*
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-12-21 09:54:46
 */
export default {
    // 每个组件都有的父组件传递的样式，可以为字符串或者对象形式,作用于根节点
    customStyle: {
        type: [Object, String],
        default: () => ({})
    },
    customClass: {
        type: String,
        default: ''
    },
    // 表单数据对象
    model: {
        type: Object,
        default: () => ({})
    },
    // 表单验证规则
    rules: {
        type: Object,
        default: () => ({})
    },
    alignItem: {
        type: String,
        default: ''
    },
    // 表单域标签的宽度，例如 '100rpx'、'100'单位默认rpx。作为 Form 直接子元素的 form-item 会继承该值。支持 auto。
    labelWidth: {
        type: [Number, String],
        default: 'auto'
    },
    // 表单域标签的位置，可选值 left/top
    labelPosition: {
        type: String,
        default: 'left'
    },
    // 表单域标签的对齐方式,仅在labelPosition为 left 时生效
    labelAlign: {
        type: String,
        default: 'right'
    },
    // 表单域标签的样式，对象形式
    labelStyle: {
        type: [Object],
        default: () => {
            return {}
        }
    },
    // 是否使用占位符作为提示
    hint: {
        type: Boolean,
        default: false
    }
}
