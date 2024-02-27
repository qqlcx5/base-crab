/*
 * @Author: sanshui
 * @Date: 2022-05-10 16:30:08
 * @LastEditors: sanshui
 * @LastEditTime: 2022-05-23 14:47:07
 * @Description: For better maintenance, please fill in the document description carefully, thank you ~
 */
// 组件大小
export const sizeEnum = ['mini', 'small', 'normal', 'large']
export const sizeProp = function (config = {}) {
    let { value, enums, validator } = config
    const enumArr = enums || sizeEnum
    validator || (validator = function (value) {
        return enumArr.includes(value)
    })
    return {
        type: String,
        default: value !== undefined ? value : 'normal',
        validator
    }
}
// 组件类型
export const typeEnum = ['default', 'primary', 'success', 'info', 'warning', 'danger']

export const typeProp = function (config = {}) {
    let { value, enums, validator } = config
    const enumArr = enums || typeEnum
    validator || (validator = function (value) {
        return enumArr.includes(value)
    })
    return {
        type: String,
        default: value !== undefined ? value : 'default',
        validator
    }
}
