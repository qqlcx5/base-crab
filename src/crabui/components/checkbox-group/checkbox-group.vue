<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2022-01-22 18:50:15
-->
<template>
    <view class="ca-checkbox-group">
        <slot />
    </view>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { bindEvent, debounce } from '../../libs/utils/tools.js'
import { useEmit, useCmptName, useVModel } from '../../libs/utils/useCore.js'
import crabUIMixin from '../../libs/mixins/crabui.js'
import { checkboxGroupKey } from '../../libs/utils/symbol.js'
import useFormFactor from '../../hooks/useFormFactor/index.js'
import props from './props'
export default defineComponent({
    name: 'CaCheckboxGroup',
    mixins: [crabUIMixin],
    props,
    setup() {
        const cmptName = useCmptName()
        // 双向绑定过
        const checkboxGroupValue = useVModel()
        const checkboxGroupNames = ref([])
        // 注册事件句柄
        const emitEvent = useEmit()
        // 注册一个provide供下面的子组件使用
        const eventHandle = bindEvent(checkboxGroupKey)
        // 把自身的modelValue传下去
        eventHandle.addProvide('modelValue', checkboxGroupValue)

        // 子元素checkbox发生变化
        eventHandle.$on('CaFormFactor:change', (e) => {
            console.log(e)
            changeEvent(e)
        })
        // 子元素checkbox发生变化
        eventHandle.$on('CaFormFactor:remove', ({ detail }) => {
            const index = checkboxGroupNames.value.findIndex(o => o === detail.name)
            if (index !== -1) {
                checkboxGroupValue.value.splice(index, 1)
                checkboxGroupNames.value.splice(index, 1)
            }
        })
        let curType = ''
        // const { changeFactor, initFactor, resetFactor }
        useFormFactor({
            name: cmptName,
            vModel: checkboxGroupValue,
            reset: () => {
                eventHandle.$emit('CaFormFactor:reset')
            },
            change: ({ changeFactor, resetFactor, initFactor }, isReset) => {
                if (isReset) {
                    resetFactor()
                } else {
                    curType === 'init' ? initFactor(checkboxGroupValue) : changeFactor(checkboxGroupValue)
                }
                if (curType !== 'init') {
                    // 多个值同时修改造成的bug
                    debounce(() => {
                        emitEvent('change', {
                            value: checkboxGroupValue.value,
                            name: cmptName
                        })
                    }, 50)
                }
                return true
            }
        })
        // 初始化数据
        function changeEvent(e) {
            if (!e) return
            const { detail, type } = e
            curType = type
            if (type === 'reset') {
                checkboxGroupValue.value = []
            } else {
                const index = checkboxGroupNames.value.findIndex(o => o === detail.name)
                if (index === -1) {
                    checkboxGroupValue.value.push(detail.value)
                    checkboxGroupNames.value.push(detail.name)
                } else {
                    checkboxGroupValue.value.splice(index, 1)
                    checkboxGroupNames.value.splice(index, 1)
                }
            }
        }

        return {
            changeEvent,
            checkboxGroupValue
        }
    }
})
</script>

<style lang="scss" scoped>
.ca-checkbox-group {
    /* #ifndef MP || APP-NVUE */
    display: flex;
    flex-wrap: wrap;
    /* #endif */
}
</style>
