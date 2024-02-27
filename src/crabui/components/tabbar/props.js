/*
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2022-01-15 16:55:52
 */
export default {
    bgColor: {
        type: String,
        default: '#fff'
    },
    color: {
        type: String,
        default: '#666'
    },
    list: {
        type: Array,
        default: () => []
    },
    modelValue: {
        type: Boolean,
        default: true
    },
    selColor: {
        type: String,
        default: 't'
    }
}
