/*
 * @Author: sanshui
 * @Date: 2022-05-09 10:11:46
 * @LastEditors: sanshui
 * @LastEditTime: 2023-08-15 15:37:06
 * @Description: For better maintenance, please fill in the document description carefully, thank you ~
 */
import { computed, inject, getCurrentInstance, unref, provide } from 'vue'
import { themeKey } from '../../libs/utils/symbol'
import { addUnit } from '../../libs/utils/tools'
import { sizeEnum } from '../../config/components'
export const useStylePicker = (source) => {
    // 自动注入的规则
    const themeMapKey = ['background', 'backgroundColor', 'color', 'width', 'height', 'fontSize', 'size', 'borderColor', 'boxShadow', 'borderRadius', 'radius', 'padding', 'margin']
    const unSource = {}
    Object.keys(unref(source)).forEach(key => {
        const formatKey = key.replace(/-(\w)/g, (all, letter) => {
            return letter.toUpperCase()
        })
        if (key === 'size') {
            // size 会从转成宽高
            if (!sizeEnum.includes(source[key])) {
                unSource.width || (unSource.width = addUnit(source[key]))
                unSource.height || (unSource.height = addUnit(source[key]))
            }
        } else if (key === 'radius') {
            unSource.borderRadius = addUnit(source[key])
        } else {
            unSource[formatKey] = source[key]
        }
        if (['width', 'height', 'fontSize'].includes(formatKey)) {
            if (!unSource[formatKey]) return
            unSource[formatKey] = addUnit(unSource[formatKey])
        }
    })
    const result = {}
    for (const styleKey of themeMapKey) {
        if (unSource[styleKey]) {
            result[styleKey] = unSource[styleKey]
        }
    }
    return result
}

// 皮肤注入
export const useTheme = () => {
    const { props, proxy } = getCurrentInstance()
    // 获取自己的自定义样式
    const customStyle = useStylePicker(Object.assign({}, proxy.$attrs, props))
    // 获取父级注入的样式
    const injectStyle = props.theme ? useInjectTheme() : {}
    return computed(() => {
        const resStyle = Object.assign({}, unref(injectStyle), unref(customStyle))
        if (props.plain) {
            resStyle.color = resStyle.color || resStyle.background
            resStyle.borderColor = resStyle.borderColor || resStyle.background || resStyle.color
            delete resStyle.background
        }
        return resStyle
    })
}

export const useInjectTheme = () => {
    return inject(themeKey, {})
}

export const useProvideTheme = () => {
    provide(themeKey, useTheme())
}

export const isbitColor = (color) => color.startsWith('#')

export const tintColor = (color, tint) => {
    color = color.replace('#', '')
    let red = parseInt(color.slice(0, 2), 16)
    let green = parseInt(color.slice(2, 4), 16)
    let blue = parseInt(color.slice(4, 6), 16)

    red += Math.round(tint * (255 - red))
    green += Math.round(tint * (255 - green))
    blue += Math.round(tint * (255 - blue))

    red = red.toString(16)
    green = green.toString(16)
    blue = blue.toString(16)

    return `#${red}${green}${blue}`
}
