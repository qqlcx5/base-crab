/*
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-12-09 09:15:28
 */

import {
    nextTick,
    reactive,
    getCurrentInstance
} from 'vue'
import { getRect, debounce } from '../../libs/utils/tools'

export const useRipple = (targetClass) => {
    const { proxy } = getCurrentInstance()

    const rippleInfo = reactive({
        top: 0, // 水波纹的起点Y坐标到按钮上边界的距离
        left: 0, // 水波纹起点X坐标到按钮左边界的距离
        width: 0, // 波纹按钮节点信息 - 宽
        height: 0, // 波纹按钮节点信息 - 高
        waveActive: false // 激活水波纹
    })

    const perform = (e) => {
        rippleInfo.waveActive = false
        debounce(() => {
            getWaveQuery(e)
        }, 80, true)
    }

    // 查询按钮的节点信息
    const getWaveQuery = (e) => {
        getRect(targetClass, {}, proxy).then((res) => {
            if (!res || !res.width || !res.width) return
            res.targetWidth = Math.ceil(Math.max(res.height, res.width))
            rippleInfo.width = `${res.targetWidth}px`
            rippleInfo.height = `${res.targetWidth}px`
            if (e.center) {
                rippleInfo.top = 0
                rippleInfo.left = 0
            } else {
                const touchesX = e.touches[0].clientX
                const touchesY = e.touches[0].clientY
                rippleInfo.top = `${touchesY - res.top - res.targetWidth / 2}px`
                rippleInfo.left = `${touchesX - res.left - res.targetWidth / 2}px`
            };
            nextTick(() => {
                rippleInfo.waveActive = true
            })
        })
    }

    return {
        rippleInfo,
        perform
    }
}
