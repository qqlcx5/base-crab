/*
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-12-21 09:54:46
 */
export default {
    // 标题。也可通过 v-slot:title
    title: {
        type: String,
        default: ''
    },
    // 主题。 success/warning/info/danger
    type: {
        type: String,
        default: 'success'
    },
    // 辅助性文字。也可通过默认 slot 传入
    description: {
        type: String,
        default: ''
    },
    // 上下居中
    center: {
        type: Boolean,
        default: false
    },
    // 是否显示图标
    showIcon: {
        type: Boolean,
        default: false
    },
    icon: {
        type: String,
        default: ''
    },
    iconSize: {
        type: [String, Number],
        default: ''
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
    // 关闭按钮自定义文本
    closeText: {
        type: String,
        default: ''
    },
    closeIcon: {
        type: String,
        default: 'ca-close'
    },
    // 选择提供的主题light/dark
    effect: {
        type: String,
        default: 'light',
        validator: function (value) {
            return ['light', 'dark'].includes(value)
        }
    },
    shadow: {
        type: Boolean,
        default: true
    }
}
