/*
 * @Author: sanshui
 * @Date: 2022-06-22 15:53:56
 * @LastEditors: sanshui
 * @LastEditTime: 2022-06-22 15:54:18
 * @Description: For better maintenance, please fill in the document description carefully, thank you ~
 */
export default {

    // 当没有父级的时候这个属性才生效
    modelValue: {
        type: Boolean,
        default: false
    },
    // checkbox的值，checkbox-group为父级时value才生效
    value: {
        type: [String, Number, Boolean],
        default: ''
    },
    // 形状，square为方形，circle为原型
    shape: {
        type: String,
        default: ''
    },
    // 是否禁用
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
    // 是否禁止点击提示语选中复选框
    labelDisabled: {
        type: Boolean,
        default: false
    },
    // 未选中状态下的颜色，如设置此值，将会覆盖radioGroup的color值
    color: {
        type: String,
        default: ''
    },
    // 同color
    activeColor: {
        type: String,
        default: ''
    },
    // 图标的大小，单位rpx
    iconSize: {
        type: [String, Number],
        default: ''
    },
    // label的字体大小，rpx单位
    labelSize: {
        type: [String, Number],
        default: ''
    },
    // 在表单内提交时的标识符
    name: {
        type: String,
        default: ''
    },
    // 组件的整体大小
    size: {
        type: [String, Number],
        default: ''
    },
    // 是否默认选中
    checked: {
        type: Boolean,
        default: false
    }
}
