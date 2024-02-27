<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-11-13 21:02:08
 * @LastEditors: sanshui
 * @LastEditTime: 2022-06-23 14:16:27
-->
<template>
    <form
        class="ca-form"
        :style="[customStyle]"
        @submit="submitFields"
        @reset="resetFields"
    >
        <slot />
    </form>
</template>

<script>
import props from './props'
import { defineComponent, ref } from 'vue'
import { bindEvent, setProperty, removeProperty } from '../../libs/utils/tools.js'
import { useEmit, useVModel } from '../../libs/utils/useCore.js'
import Schema from '../../libs/utils/async-validator.js'
import { CaFormKey } from '../../libs/utils/symbol.js'
export default defineComponent({
    name: 'CaForm',
    props,
    emits: ['submit', 'reset', 'change', 'update:model'],
    setup(props) {
        const emitEvent = useEmit()
        const fieldsFactorValue = useVModel('model')
        // 注册事件句柄
        const eventHandle = bindEvent(CaFormKey)
        // 表单重置
        const resetFields = (e) => {
            eventHandle.$emit('CaFormFactor:reset', () => {
                // console.log('我执行完了表单元素的clear');
            })
        }
        // 表单提交事件
        const submitFields = () => {
            emitEvent('submit', fieldsFactorValue)
        }
        // 表单按钮触发重置
        eventHandle.$on('CaFormFactor:clear', resetFields)
        // 表单元素发生变化
        eventHandle.$on('CaFormFactor:change', (e) => {
            changeEvent(e, e.type === 'change')
        })
        // 把自身的绑定值传下去
        eventHandle.addProvide('modelValue', fieldsFactorValue)
        // 表单元素被摧毁
        eventHandle.$on('CaFormFactor:remove', (e) => {
            removeProperty(fieldsFactorValue, e.detail.name)
        })

        const errorMsgs = ref([])
        const errorFileds = ref({})
        function changeEvent({ detail }, emitChange = true) {
            fieldsFactorValue.value = setProperty(fieldsFactorValue, detail.name, detail.value)
            emitChange && emitEvent('change', fieldsFactorValue)
        }
        // 校验全部数据
        function validate(callBack = () => { }) {
            const errMsgs = []
            const errFileds = {}
            Object.keys(props.rules).forEach((ruleKey) => {
                const current = props.rules[ruleKey]
                // 获取对应的属性，通过类似'a.b.c'的形式
                const propertyVal = uni.$ca.getProperty(
                    fieldsFactorValue.value,
                    ruleKey
                )
                const propertyName = ruleKey.slice(ruleKey.lastIndexOf(',') + 1)
                const rules = [].concat(current)
                for (let i = 0, n = rules.length; i < n; i++) {
                    const validator = new Schema({
                        [propertyName]: rules[i]
                    })
                    validator.validate({
                        [propertyName]: propertyVal
                    }, (errors, fields) => {
                        errMsgs.push(...errors)
                        Object.assign(errFileds, fields)
                    })
                }
            })
            errorMsgs.value = errMsgs
            errorFileds.value = errFileds
            callBack?.(errMsgs.length === 0, errMsgs, errFileds)
        }

        return {
            resetFields,
            submitFields,
            validate,
            changeEvent,
            errorFileds,
            errorMsgs
        }
    }

})
</script>
