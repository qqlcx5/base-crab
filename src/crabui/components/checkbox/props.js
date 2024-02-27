/*
 * @Author: sanshui
 * @Date: 2022-05-27 10:37:13
 * @LastEditors: sanshui
 * @LastEditTime: 2022-06-23 10:05:38
 * @Description: For better maintenance, please fill in the document description carefully, thank you ~
 */
export default {
    // 当没有父级(checkbox-group)的时候这个属性才生效,如果有父级，请使用checked进行选中
    modelValue: {
        type: Boolean,
        default: () => false
    },
    // checkbox的值，checkbox-group为父级时生效
    value: {
        type: [String, Number, Boolean],
        default: () => undefined
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
    // 未选中状态下的颜色，如设置此值，将会覆盖checkboxGroup的color值
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
    // 是否默认选中,checkbox-group为父级时生效
    checked: {
        type: Boolean,
        default: false
    }
}
