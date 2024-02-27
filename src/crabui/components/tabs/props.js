/*
 * @Author: sanshui
 * @Date: 2022-06-24 17:01:01
 * @LastEditors: sanshui
 * @LastEditTime: 2022-06-24 17:01:21
 * @Description: For better maintenance, please fill in the document description carefully, thank you ~
 */
export default {
    modelValue: {
        type: [Number, String],
        default: 0
    },
    data: {
        type: Array,
        default: () => []
    },
    background: {
        type: String,
        default: '#fff'
    },
    color: {
        type: String,
        default: '#333'
    },
    activeColor: {
        type: String,
        default: '#e64340'
    },
    fontSize: {
        type: [String, Number],
        default: 26
    },
    // 左右间距
    gutter: {
        type: [Number, String],
        default: 20
    },
    // 滑动线条宽度，auto是自适应，会自动计算
    lineWidth: {
        type: [Number, String],
        default: 'auto'
    },
    lineHeight: {
        type: [Number, String],
        default: 6
    },
    lineColor: {
        type: String,
        default: '#e64340'
    },
    // 是否使用粘性布局
    sticky: {
        type: Boolean,
        default: false
    },
    offsetTop: {
        type: [Number, String],
        default: 0
    },
    itemDirection: {
        type: String,
        default: 'horizontal'
    },
    // 居中动画阈值
    threshold: {
        type: Number,
        default: 2
    },
    // 是否开启左侧收缩布局
    shrink: {
        type: Boolean,
        default: false
    },
    // 层级，开启粘性布局时生效
    zIndex: {
        type: Number,
        default: 10
    }
}
