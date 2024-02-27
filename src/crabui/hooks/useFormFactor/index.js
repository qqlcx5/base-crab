/*
 * @Author: sanshui
 * @Date: 2022-05-27 10:27:46
 * @LastEditors: sanshui
 * @LastEditTime: 2022-08-18 11:17:18
 * @Description: For better maintenance, please fill in the document description carefully, thank you ~
 */

import { diffByObj, getVarType, registerEvent } from '../../libs/utils/tools.js'
import { CaFormKey } from '../../libs/utils/symbol.js'
import { watch, isRef, onUnmounted } from 'vue'
import { useEmit } from '../../libs/utils/useCore.js'
/**
 * @description: 表单因子推送
 * @param {String} parmas.name 组件往上推的name值
 * @param {Ref} parmas.vModel 向上推的值x
 * @param {Function} parmas.reset 重置函数
 * @param {Function} parmas.init 初始化函数
 * @return {Object<changeFactor:Function, initFactor:Function, resetFactor: Function>}
 */
export default function useFormFactor(parmas) {
    const { name, vModel, reset, init, change, symbleKey = CaFormKey } = parmas
    // 注册订阅器
    const regEvent = registerEvent(symbleKey)
    const emitEvent = useEmit()
    const that = {
        changeFactor,
        initFactor,
        resetFactor
    }
    if (!name) {
        throw (new Error('请传入该组件的name值'))
    }
    let isReset = false
    if (isRef(vModel)) {
        const vmType = getVarType(vModel.value)
        const resetValue = vModel.value ? (vmType === 'Array' ? [] : vmType === 'Object' ? {} : '') : vModel.value
        onUnmounted(() => {
            regEvent?.$emit?.('CaFormFactor:remove', {
                type: 'remove',
                detail: {
                    name
                }
            })
        })
        init?.(that) || initFactor(vModel)
        watch(vModel, (value) => {
            const isGoing = change?.(that, isReset)
            if (!isGoing) {
                if (isReset) {
                    resetFactor(value)
                } else {
                    emitEvent('change', value)
                    changeFactor(value)
                }
            }
            isReset = false
        }, {
            deep: true
        })
        // 监听清空
        regEvent?.$on?.('CaFormFactor:reset', handleReset)
        function handleReset() {
            diffByObj(vModel.value, resetValue) || (isReset = true)
            reset?.(that) || (!diffByObj(vModel.value, resetValue) && (vModel.value = resetValue))
        }
    }
    function changeFactor(value, type = 'change') {
        regEvent?.$emit?.('CaFormFactor:change', {
            type,
            detail: {
                value: uni.$ca.getProxyData(value),
                name
            }
        })
    }

    function initFactor(value) {
        changeFactor(value, 'init')
    }

    function resetFactor(value) {
        changeFactor(value, 'reset')
    }

    return that
}
