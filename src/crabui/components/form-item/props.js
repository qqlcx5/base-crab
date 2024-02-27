/*
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-12-21 09:54:46
 */
export default {
    // 上下对其方式
    alignItem: {
        type: String,
        default: ''
    },
    // 文本内容
    label: {
        type: String,
        default: ''
    },
    // 表单域标签的宽度，例如 '100rpx'、'100'单位默认rpx。作为 Form 直接子元素的 form-item 会继承该值。支持 auto。
    labelWidth: {
        type: [Number, String],
        default: ''
    },
    // 表单域标签的位置，可选值 left/top
    labelPosition: {
        type: String,
        default: ''
    },
    // 表单域标签的对齐方式
    labelAlign: {
        type: String,
        default: ''
    },
    // 表单域标签的样式，对象形式
    labelStyle: {
        type: Object,
        default: () => ({})
    },
    // 是否显示下边框
    border: {
        type: Boolean,
        default: false
    },
    // 是否必填，如不设置，则会根据校验规则自动生成
    required: {
        type: Boolean,
        default: false
    },
    prop: {
        type: String,
        default: ''
    }
}
