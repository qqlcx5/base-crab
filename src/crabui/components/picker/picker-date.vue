<!--
 * @Author: sanshui
 * @Date: 2022-05-31 13:44:36
 * @LastEditors: sanshui
 * @LastEditTime: 2022-06-07 09:22:09
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
                v-for="(item,index) in years"
                :key="index"
                class="picker-time__item"
            >
                {{ item }}年
            </view>
        </picker-view-column>
        <picker-view-column>
            <view
                v-for="(item,index) in months"
                :key="index"
                class="picker-time__item"
            >
                {{ item }}月
            </view>
        </picker-view-column>
        <picker-view-column>
            <view
                v-for="(item,index) in days"
                :key="index"
                class="picker-time__item"
            >
                {{ item }}日
            </view>
        </picker-view-column>
    </picker-view>
</template>

<script>
import { defineComponent, markRaw, ref } from 'vue'
import { zeroFill } from '../../libs/utils/tools'
import { useEmit, useVModel } from '../../libs/utils/useCore'
const date = new Date()
const year = date.getFullYear()
const month = zeroFill(date.getMonth() + 1)
const day = zeroFill(date.getDate())

// 当前时间
const localDate = `${year}-${month}-${day}`
export default defineComponent({
    props: {
        value: {
            type: String,
            default: localDate,
            validator: function (value) {
                if (!value || String(new Date(value)) !== 'Invalid Date') {
                    return true
                }
                throw (new Error('value格式为"YYYY-MM-DD"或"YYYY/MM/DD"'))
            }
        },
        modelValue: {
            type: Boolean,
            default: false
        },
        start: {
            type: String,
            default: '1970-01-01'
        },
        end: {
            type: String,
            default: '2100-12-31'
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
        const emitEvent = useEmit()
        const startYear = props.start.split('-')[0] || 1970
        const endYear = props.end.split('-')[0] || 2100
        const years = getRangeValue(startYear, endYear)
        const months = getRangeValue(1, 12)
        // 当前选中的信息
        const pickerInfo = ref({})
        // 边界值
        const boundaryInfo = ref({})
        // 初始化边界
        initBoundary()
        // 获取当前的天数
        initPicker()
        const days = ref(getDayArr())
        // 初始化
        function initPicker() {
            // 格式化传入的时间
            formatValue()
            // 将初始值推出去，因为这边可能有一些额外的数据发生，用户又没有选择，无法触发change事件
            emitEvent('init', pickerInfo)
        }
        function formatValue(time) {
            let value = dateToNumber(time || currentDate.value || localDate)
            value = String(Math.min(boundaryInfo.value.max, Math.max(boundaryInfo.value.min, value)))
            currentDate.value = value.replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3')
            const arr = currentDate.value.split('/')
            pickerInfo.value = {
                year: arr[0],
                month: arr[1],
                date: arr[2],
                chosen: arr,
                value: currentDate.value,
                indexs: [years.findIndex(o => o === arr[0]), parseInt(arr[1]) - 1, parseInt(arr[2]) - 1]
            }
        }
        function initBoundary() {
            const start = (props.start || '1970-01-01').replace(/-/g, '/')
            const end = (props.end || '2100-12-31').replace(/-/g, '/')
            boundaryInfo.value = {
                min: dateToNumber(start),
                max: dateToNumber(end)
            }
        }
        function dateToNumber(time) {
            time = time.replace(/-/g, '/')
            return parseInt(time.replace(/(\d{4})\/(\d{1,2})\/(\d{1,2})/g, function (val, $1, $2, $3) {
                return `${$1}${zeroFill($2)}${zeroFill($3)}`
            }))
        }
        function handleChange(e) {
            const oldPickerInfo = markRaw(pickerInfo.value)
            const val = e.detail.value
            formatValue(`${years[val[0]]}/${months[val[1]]}/${days.value[val[2]]}`)
            emitEvent('change', pickerInfo)
            if (oldPickerInfo.year !== pickerInfo.value.year || oldPickerInfo.month !== pickerInfo.value.month) {
                days.value = getDayArr()
            }
        }
        function getDayArr() {
            return getRangeValue(1, getMonthDay(pickerInfo.value.year, pickerInfo.value.month))
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
        // 获取当月有几天
        function getMonthDay(year, month) {
            const days = new Date(year, month, 0).getDate()
            return days
        }
        return {
            currentDate,
            years,
            year,
            months,
            month,
            handlePickTouch,
            days,
            pickerInfo,
            day,
            formatValue,
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
