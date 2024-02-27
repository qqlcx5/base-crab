/*
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-12-21 09:54:46
 */
export default {
    /**
     * 双向绑定的值
     */
    modelValue: {
        type: [String, Number],
        default: ''
    },
    /**
         * 输入类型
         */
    type: {
        type: String,
        default: 'text'
    },
    /**
     * 占位符
     */
    confirmType: {
        type: String,
        default: 'done'
    },
    placeholder: {
        type: String,
        default: ''
    },
    /**
     * 是否显示清除按钮
     */
    clearable: {
        type: Boolean,
        default: false
    },
    /**
     * 是否自动增高，设置auto-height时，style.height不生效  type为textarea时才生效
     */
    autoHeight: {
        type: Boolean,
        default: false
    },
    /**
     * 是否显示密码可见按钮，仅在type为password下有效
     */
    displayable: {
        type: Boolean,
        default: false
    },
    /**
     * 是否显示字数验证
     */
    numVerification: {
        type: Boolean,
        default: false
    },
    minHeight: {
        type: [Number, String],
        default: 200
    },
    arrows: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    maxlength: {
        type: Number,
        default: 140
    },
    cursorSpacing: {
        type: Number,
        default: 0
    },
    /**
     * 自动获取焦点
     */
    focus: {
        type: Boolean,
        default: false
    },
    // 0表示不限制,仅在type为number或digit下生效
    decimal: {
        type: Number,
        default: 0
    },
    // 0表示不限制,仅在type为number或digit下生效
    max: {
        type: Number,
        default: 0
    },
    min: {
        type: Number,
        default: 0
    },
    // prepend宽度，默认auto
    prependWidth: {
        type: [String, Number],
        default: 'auto'
    },
    // append的宽度，默认auto
    appendWidth: {
        type: [String, Number],
        default: 'auto'
    },
    name: {
        type: String,
        default: ''
    },
    label: {
        type: String,
        default: ''
    },
    msgName: {
        type: String,
        default: ''
    },
    prependStyle: {
        type: Object,
        default: () => ({})
    },
    appendStyle: {
        type: Object,
        default: () => ({})
    },
    placeholderClass: {
        type: String,
        default: 'ca-input-placeholder'
    },
    placeholderStyle: {
        type: String,
        default: ''
    },
    innerStyle: {
        type: Object,
        default: () => ({})
    },
    inputStyle: {
        type: Object,
        default: () => ({})
    },
    // 是否使用占位符作为提示
    hint: {
        type: Boolean,
        default: null
    },
    // 边框类型, around-四周边框，bottom-底部边框，none-无边框
    border: {
        type: String,
        default: 'none'
    },
    // 针对border做的动画
    spread: {
        type: Boolean,
        default: false
    },
    formatter: {
        type: Function,
        default: null
    },
    // 格式化函数触发的时机，可选值为 onBlur onChange
    formatTrigger: {
        type: String,
        default: 'onChange'
    },
    cursor: {
        type: Number,
        default: 0
    },
    selectionStart: {
        type: Number,
        default: -1
    },
    selectionEnd: {
        type: Number,
        default: -1
    },
    holdKeyboard: {
        type: Boolean,
        default: false
    }
}
