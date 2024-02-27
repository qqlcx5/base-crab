/*
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2022-01-18 11:54:59
 */
export default {
    type: {
        type: String,
        default: 'single',
        validator: function (value) {
            return ['single', 'range', 'multiple'].includes(value)
        }
    },
    // 日期最多可选天数，当type 为 range | multiple 时生效，-1表示不受限制
    maxRange: {
        type: Number,
        default: -1,
        validator: function (value) {
            if (value === -1 || value > 1) {
                return true
            } else {
                console.warn('maxRange值必须大于1，不限制则传入-1')
                return false
            }
        }
    },
    /**
    * 是否显示modal框
    */
    modelValue: {
        type: Boolean,
        default: true
    },
    // 自定义当前时间，默认为今天
    date: {
        type: String,
        default: ''
    },
    selected: {
        type: Array,
        default: () => []
    },
    radius: {
        type: String,
        default: ''
    },
    // 选中颜色
    color: {
        type: String,
        default: '#3c9cff'
    },
    // 原点颜色
    circleColor: {
        type: String,
        default: '#e64340'
    },
    // 显示农历
    lunar: {
        type: Boolean,
        default: false
    },
    // 日期有效范围-开始日期
    startDate: {
        type: String,
        default: ''
    },
    // 日期有效范围-结束日期
    endDate: {
        type: String,
        default: ''
    },
    // 是否是弹窗模式。可选值：ture：弹窗模式；false：插入模式；默认为插入模式
    popup: {
        type: Boolean,
        default: true
    },
    // 是否显示月份为背景
    showMonth: {
        type: Boolean,
        default: true
    },
    // 否清空上次选择内容（弹窗模式是下有效）
    clearDate: {
        type: Boolean,
        default: false
    },
    // 展示位置，弹窗模式下生效
    position: {
        type: String,
        default: 'bottom'
    },
    title: {
        type: String,
        default: '日期选择'
    },
    // 显示返回今天
    backtoday: {
        type: Boolean,
        default: true
    },
    // 限制确定按钮,弹窗模式下有效,为false时 满足选中条件会自动触发confirm事件
    showConfirm: {
        type: Boolean,
        default: true
    },
    // 确定按钮文字
    confirmText: {
        type: String,
        default: '确定'
    },
    confirmColor: {
        type: String,
        default: ''
    },
    // 是否要收起功能，仅在popup为false时该属性生效
    showExpand: {
        type: Boolean,
        default: true
    },
    formatter: {
        type: Function,
        default: null
    }
}
