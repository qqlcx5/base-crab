/*
 * @Author: sanshui
 * @Date: 2022-06-22 15:51:42
 * @LastEditors: sanshui
 * @LastEditTime: 2022-06-22 15:52:01
 * @Description: For better maintenance, please fill in the document description carefully, thank you ~
 */
export default {
    // 所有选中项的 name
    modelValue: {
        type: [String, Number, Boolean],
        default: null
    },
    // 是否禁用所有复选框
    disabled: {
        type: Boolean,
        default: false
    },
    // 未选中icon
    icon: {
        type: String,
        default: ''
    },
    // 选中icon
    activeIcon: {
        type: String,
        default: ''
    },
    // 在表单内提交时的标识符
    name: {
        type: String,
        default: ''
    },
    // 是否禁止点击提示语选中复选框
    labelDisabled: {
        type: Boolean,
        default: false
    },
    // 形状，square为方形，circle为原型
    shape: {
        type: String,
        default: 'circle'
    },
    color: {
        type: String,
        default: '#e0e0e0'
    },
    // 选中状态下的颜色
    activeColor: {
        type: String,
        default: '#3c9cff'
    },
    // 组件的整体大小
    size: {
        type: [String, Number],
        default: 34
    },
    // 每个checkbox占c-checkbox-group的宽度
    width: {
        type: String,
        default: 'auto'
    },
    // 是否每个checkbox都换行
    wrap: {
        type: Boolean,
        default: false
    },
    // 图标的大小，单位rpx
    iconSize: {
        type: [String, Number],
        default: 42
    }
}
