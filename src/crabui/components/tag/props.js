/*
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-12-21 09:54:46
 */
import { typeProp, sizeProp } from '../../config/components'
export default {
    // 标题。也可通过 v-slot:text
    text: {
        type: String,
        default: ''
    },
    type: typeProp('primary', ['primary', 'success', 'info', 'warning', 'danger']),
    size: sizeProp({ value: 'mini' }),
    shape: {
        type: String,
        default: 'square',
        validator: function (value) {
            return ['square', 'circle', 'lcircle', 'rcircle', 'leaf', 'rleaf', 'bubble'].includes(value)
        }
    },
    // 是否块级展示
    block: {
        type: Boolean,
        default: false
    },
    icon: {
        type: String,
        default: ''
    },
    iconSize: {
        type: Number,
        default: null
    },
    closable: {
        type: Boolean,
        default: false
    },
    // 关闭动画时长
    duration: {
        type: Number,
        default: 300
    },
    // 选择提供的主题light/dark
    effect: {
        type: String,
        default: 'light',
        validator: function (value) {
            return ['light', 'dark', 'plain'].includes(value)
        }
    },
    prependStyle: {
        type: [String, Object],
        default: () => ''
    },
    plain: {
        type: Boolean,
        default: false
    },
    appendStyle: {
        type: [String, Object],
        default: () => ''
    }
}
