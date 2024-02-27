<!--
 * @Author: sanshui
 * @Date: 2022-05-31 13:44:36
 * @LastEditors: sanshui
 * @LastEditTime: 2022-06-02 16:32:19
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
                v-for="(item,index) in hours"
                :key="index"
                class="picker-time__item"
            >
                {{ item }}
            </view>
        </picker-view-column>
        <picker-view-column>
            <view
                v-for="(item,index) in minutes"
                :key="index"
                class="picker-time__item"
            >
                {{ item }}
            </view>
        </picker-view-column>
    </picker-view>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { zeroFill } from '../../libs/utils/tools'
import { useEmit, useVModel } from '../../libs/utils/useCore'
const date = new Date()
const hour = zeroFill(date.getHours())
const minute = zeroFill(date.getMinutes())
const splitSymble = ':'

// 当前时间
const localTime = `${hour}:${minute}`
export default defineComponent({
    props: {
        value: {
            type: String,
            default: localTime,
            validator: function (value) {
                if (!value || value.split(splitSymble).length === 2) {
                    return true
                }
                throw (new Error('hh:mm'))
            }
        },
        modelValue: {
            type: Boolean,
            default: false
        },
        start: {
            type: String,
            default: '00:00'
        },
        end: {
            type: String,
            default: '23:59'
        },
        indicatorStyle: {
            type: String,
            default: 'height: 50px;'
        }
    },
    emits: ['update:value', 'animation', 'change', 'init'],
    setup(props) {
        // 滑动锁
        const hasTouch = ref(false)
        const currentDate = useVModel('value')
        if (currentDate.value === '') {
            currentDate.value = localTime
        }
        const emitEvent = useEmit()
        const hours = getRangeValue(0, 23)
        const minutes = getRangeValue(0, 59)
        // 当前选中的信息
        const pickerInfo = ref({})
        // 边界值
        const boundaryInfo = ref({})
        // 初始化边界
        initBoundary()
        initPicker()
        // 初始化
        function initPicker() {
            // 格式化传入的时间
            formatValue()
            // 将初始值推出去，因为这边可能有一些额外的数据发生，用户又没有选择，无法触发change事件
            emitEvent('init', pickerInfo)
        }
        function formatValue(time) {
            time = time || currentDate.value || localTime
            let value = parseInt(time.replace(splitSymble, ''))
            value = String(Math.min(boundaryInfo.value.max, Math.max(boundaryInfo.value.min, value)))
            currentDate.value = value.replace(/(\d{1,2})(\d{2})/, function (rs, $1, $2) {
                return zeroFill($1) + splitSymble + $2
            })
            const arr = currentDate.value.split(splitSymble)
            pickerInfo.value = {
                hour: arr[0],
                minute: arr[1],
                value: currentDate.value,
                chosen: arr,
                indexs: [parseInt(arr[0]), parseInt(arr[1])]
            }
        }

        function initBoundary() {
            const start = props.start || '00:00'
            const end = props.end || '23:59'
            boundaryInfo.value = {
                min: parseInt(start.replace(splitSymble, '')),
                max: parseInt(end.replace(splitSymble, ''))
            }
        }
        function handleChange(e) {
            const val = e.detail.value
            formatValue(`${hours[val[0]]}:${minutes[val[1]]}`)
            emitEvent('change', pickerInfo)
        }
        function getRangeValue(start, end) {
            const arr = []
            for (let i = start; i <= end; i++) {
                arr.push(zeroFill(i))
            }
            return arr
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
            hours,
            minutes,
            handlePickTouch,
            pickerInfo,
            handleChange,
            initPicker
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
