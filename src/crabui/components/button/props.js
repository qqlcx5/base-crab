/*
 * @Author: sanshui
 * @Date: 2022-05-18 16:26:22
 * @LastEditors: sanshui
 * @LastEditTime: 2023-08-24 10:22:14
 * @Description: button的props属性 ~
 */
import { typeProp, sizeProp } from '../../config/components'
export default {
    height: {
        type: String,
        default: ''
    },
    width: {
        type: String,
        default: ''
    },
    formType: {
        type: String,
        default: '',
        validator: function (value) {
            return ['submit', 'reset', ''].includes(value)
        }
    },
    openType: {
        type: String,
        default: '',
        validator: function (value) {
            return !value || ['getUserInfo', 'share', 'getPhoneNumber', 'openSetting', 'contact', 'chooseAvatar'].includes(value)
        }
    },
    // 仅在openType为contact时生效
    showMessageCard: {
        type: Boolean,
        default: false
    },
    sendMessagePath: {
        type: String,
        default: ''
    },
    sendMessageTitle: {
        type: String,
        default: ''
    },
    sendMessageImg: {
        type: String,
        default: ''
    },
    ripple: {
        type: Boolean,
        default: true
    },
    icon: {
        type: String,
        default: ''
    },
    iconPosition: {
        type: String,
        default: 'left',
        validator: function (value) {
            return ['left', 'right', ''].includes(value)
        }
    },
    type: typeProp(),
    size: sizeProp(),
    // 是否展示阴影
    shadow: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: false
    },
    // 仅在loading为true时生效
    loadingText: {
        type: String,
        default: ''
    },
    // 是否为圆角按钮
    round: {
        type: Boolean,
        default: false
    },
    // 是否为圆形按钮
    circle: {
        type: Boolean,
        default: false
    },
    plain: {
        type: Boolean,
        default: false
    },
    // 是否为块级按钮
    block: {
        type: Boolean,
        default: false
    }
}
