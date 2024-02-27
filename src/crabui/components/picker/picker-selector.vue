<!--
 * @Author: sanshui
 * @Date: 2022-05-31 13:44:36
 * @LastEditors: sanshui
 * @LastEditTime: 2022-06-02 16:31:18
 * @Description: For better maintenance, please fill in the document description carefully, thank you ~
-->
<template>
    <picker-view
        :indicator-style="indicatorStyle"
        :value="pickerInfo.indexs"
        class="picker-time"
        @change="handleChange"
        @pickstart="handlePickTouch('start')"
        @pickend="handlePickTouch('end')"
    >
        <picker-view-column>
            <view
                v-for="(item,index) in range"
                :key="index"
                class="picker-time__item"
            >
                {{ rangeKey ? item[rangeKey] : item }}
            </view>
        </picker-view-column>
    </picker-view>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { getVarType } from '../../libs/utils/tools'
import { useEmit, useVModel } from '../../libs/utils/useCore'
export default defineComponent({
    name: 'CaPickerSelector',
    props: {
        value: {
            type: Number,
            default: 0
        },
        range: {
            type: Array,
            default: () => [],
            validator: function (value) {
                if (value.length === 0 || ['Object', 'String'].includes(getVarType(value[0]))) {
                    return true
                }
                throw (new Error('range值只能是Array<String> / Array<Object>'))
            }
        },
        rangeKey: {
            type: String,
            default: ''
        },
        modelValue: {
            type: Boolean,
            default: false
        },
        indicatorStyle: {
            type: String,
            default: ''
        }
    },
    emits: ['update:value', 'animation', 'change', 'init'],
    setup(props) {
        // 滑动锁
        const hasTouch = ref(false)
        const currentDate = useVModel('value')
        if (!currentDate.value) {
            currentDate.value = 0
        }
        const emitEvent = useEmit()
        // 当前选中的信息
        const pickerInfo = ref({})
        // 初始化
        initPicker()

        // 初始化
        function initPicker() {
            formatValue()
            // 将初始值推出去，因为这边可能有一些额外的数据发生，用户又没有选择，无法触发change事件
            emitEvent('init', pickerInfo)
        }
        function formatValue(value) {
            if (value !== undefined) {
                currentDate.value = value[0]
            }
            pickerInfo.value = {
                chosen: props.range[currentDate.value],
                value: currentDate.value,
                indexs: [currentDate.value]
            }
        }
        function handleChange(e) {
            const value = e.detail.value
            formatValue(value)
            emitEvent('change', pickerInfo)
        }

        // 滑动锁
        function handlePickTouch(action) {
            if (action === 'start') {
                hasTouch.value = true
            } else {
                hasTouch.value = false
            }
            emitEvent('animation', hasTouch.value)
        }
        return {
            currentDate,
            handlePickTouch,
            pickerInfo,
            handleChange
        }
    }
})
</script>

<style lang="scss">
.picker-time {
    height: 500rpx;
    &__item {
        height: 50px;
        align-items: center;
        justify-content: center;
        display: flex;
    }
}
</style>
