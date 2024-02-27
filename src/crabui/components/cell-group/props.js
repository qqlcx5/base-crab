/*
 * @Author: sanshui
 * @Date: 2022-05-20 17:53:27
 * @LastEditors: sanshui
 * @LastEditTime: 2022-05-20 17:55:33
 * @Description: For better maintenance, please fill in the document description carefully, thank you ~
 */
function sizeValidator(value) {
    return ['large', 'normal'].includes(value)
}

export default {

    // 左侧标题
    title: {
        type: String,
        default: ''
    },
    groupStyle: {
        type: [Object, String],
        default: ''
    },
    titleStyle: {
        type: [Object, String],
        default: ''
    },
    contentStyle: {
        type: [Object, String],
        default: ''
    },
    cellStyle: {
        type: [Object, String],
        default: ''
    },
    border: {
        type: Boolean,
        default: true
    },
    // 可选值 large | normal
    size: {
        type: String,
        default: 'normal',
        validator: sizeValidator
    },
    arrow: Boolean,
    iconSize: {
        type: [String, Number],
        default: 32
    },
    iconStyle: {
        type: [String, Object],
        default: ''
    },
    rightIcon: {
        type: String,
        default: 'ca-arrow-right'
    }
}
