<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2022-01-22 18:50:15
-->
<template>
    <view class="c-checkbox-group">
        <slot />
    </view>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { bindEvent } from '../../libs/utils/tools.js'
import { useEmit, useCmptName, useVModel } from '../../libs/utils/useCore.js'
import crabUIMixin from '../../libs/mixins/crabui.js'
import { CaFormKey } from '../../libs/utils/symbol.js'
import props from './props'
import useFormFactor from '../../hooks/useFormFactor/index.js'
export default defineComponent({
    name: 'CrabCrabRadioGroup',
    mixins: [crabUIMixin],
    props,
    setup() {
        const cmptName = useCmptName()
        // 双向绑定过
        const radioGroupVModel = useVModel()
        // 注册事件句柄
        const emitEvent = useEmit()
        // 注册一个provide供下面的子组件使用
        const eventHandle = bindEvent(CaFormKey)
        // 把自身的modelValue传下去
        eventHandle.addProvide('modelValue', radioGroupVModel)
        // 子元素radio发生变化
        const currentState = ref('')
        eventHandle.$on('CaFormFactor:change', (e) => {
            currentState.value = e.type
            radioGroupVModel.value = e.detail.value
            currentState.value === 'change' && emitEvent('change', {
                value: radioGroupVModel.value,
                name: cmptName
            })
        })
        useFormFactor({
            name: cmptName,
            vModel: radioGroupVModel,
            reset: () => {
                eventHandle.$emit('CaFormFactor:reset')
            },
            change: ({ changeFactor, resetFactor, initFactor }, isReset) => {
                if (isReset || currentState.value === 'reset') {
                    resetFactor()
                } else if (currentState.value === 'init') {
                    initFactor(radioGroupVModel)
                } else {
                    changeFactor(radioGroupVModel)
                }
                return true
            }
        })

        return {
            radioGroupVModel
        }
    }
})
</script>

<style lang="scss" scoped>
.c-checkbox-group {
    /* #ifndef MP || APP-NVUE */
    display: flex;
    flex-wrap: wrap;
    /* #endif */
}
</style>
