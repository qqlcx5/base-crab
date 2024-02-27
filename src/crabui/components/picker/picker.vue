<template>
    <view class="ca-picker ca-flex ca-align-center">
        <view
            class="ca-picker__text ca-flex-1 ca-flex ca-align-center"
            :class="{'ca-placeholder':!pickerValue}"
            @click="handleClick"
        >
            <slot>{{ pickerValue || placeholder }}</slot>
        </view>
        <view
            v-if="clearable_"
            class="ca-input-icon__item"
            @click.stop="handleClear"
        >
            <ca-icon
                name="ca-danger"
                color="#bbb"
                size="32"
            />
        </view>
        <ca-popup
            v-model="showPicker"
            position="bottom"
            :radius="radius"
        >
            <view class="ca-picker-hd ca-flex ca-justify-between ca-fs-34 ca-underline">
                <view
                    class="ca-picker__btn ca-flex-ajcenter ca-plr-40"
                    :style="{color:cancelColor}"
                    @click="handleCancel"
                >
                    取消
                </view>
                <view
                    class="ca-picker__btn ca-flex-ajcenter ca-plr-40"
                    :style="{color:confirmColor}"
                    @click="handleConfirm"
                >
                    确定
                </view>
            </view>
            <picker-date
                v-if="mode === 'date'"
                v-model:value="tempValue"
                :indicator-style="indicatorStyle"
                @init="handleInit"
                @change="handleChange"
                @animation="handleAnimation"
            />
            <picker-time
                v-else-if="mode === 'time'"
                v-model:value="tempValue"
                :range="range"
                :range-key="rangeKey"
                :indicator-style="indicatorStyle"
                @init="handleInit"
                @change="handleChange"
                @animation="handleAnimation"
            />
            <picker-selector
                v-else-if="mode === 'selector'"
                v-model:value="tempValue"
                :range="range"
                :range-key="rangeKey"
                :indicator-style="indicatorStyle"
                @init="handleInit"
                @change="handleChange"
                @animation="handleAnimation"
            />
            <picker-multi-selector
                v-else-if="mode === 'multiSelector'"
                v-model:value="tempValue"
                :range="range"
                :range-key="rangeKey"
                :separator="separator"
                :indicator-style="indicatorStyle"
                @init="handleInit"
                @change="handleChange"
                @animation="handleAnimation"
            />
        </ca-popup>
    </view>
</template>

<script>
import { defineComponent, computed, ref, watch } from 'vue'
import useFormFactor from '../../hooks/useFormFactor'
import { useCmptName, useEmit, useVModel } from '../../libs/utils/useCore'
import dayjs from 'dayjs'
import pickerDate from './picker-date.vue'
import pickerTime from './picker-time.vue'
import pickerSelector from './picker-selector.vue'
import pickerMultiSelector from './picker-multi-selector.vue'

export default defineComponent({
    name: 'CaPicker',
    components: { pickerTime, pickerDate, pickerSelector, pickerMultiSelector },
    props: {
        modelValue: {
            type: [Number, String],
            default: null
        },
        mode: {
            type: String,
            default: 'selector'
        },
        // mode为 selector 或 multiSelector 时，range 有效
        range: {
            type: Array,
            default: () => []
        },
        // mode为 selector 或 multiSelector 时，rangeKey 有效
        rangeKey: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: '请选择'
        },
        // 分隔符，默认是空格,range为multiSelector时有效
        separator: {
            type: String,
            default: ','
        },
        radius: {
            type: [String, Number],
            default: '24rpx 24rpx 0 0'
        },
        cancelColor: {
            type: String,
            default: '#999'
        },
        confirmColor: {
            type: String,
            default: '#3c9cff'
        },
        // 小程序下生效，滑动锁，小程序下 picker-view滑动过快会导致无法正确获取到选中值
        touchLock: {
            type: Boolean,
            default: true
        },
        // mode为 time 或 date 时生效，在 这里 查看[https://day.js.org/docs/en/display/format#list-of-all-available-formats] Day.js 支持的所有格式。
        format: {
            type: String,
            default: ''
        },
        clearable: {
            type: Boolean,
            default: false
        },
        indicatorStyle: {
            type: String,
            default: 'height: 50px;'
        }
    },
    emits: ['columnchange', 'update:modelValue', 'confirm', 'cancel', 'change'],
    setup(props) {
        const cmptName = useCmptName()
        const emitEvent = useEmit()
        // 滑动锁
        const hasTouch = ref(false)
        // 是否点击了确定
        const hasClickConfirm = ref(false)
        const showPicker = ref(false)
        // 双向绑定
        const pickerValue = useVModel()
        // 接收到的change值
        const changeInfo = ref({})

        // 临时中转值
        const tempValue = ref(null)
        watch(() => props.range, (range) => {
            if (!pickerValue.value || range.length === 0) return
            if (props.mode === 'selector') {
                tempValue.value = [findIndex(range, pickerValue.value)]
            } else if (props.mode === 'multiSelector') {
                const value = pickerValue.value.split(props.separator)
                tempValue.value = range.map((o, i) => {
                    return findIndex(o, value[i])
                })
            }
        }, {
            immediate: true,
            deep: true
        })
        // 是否可删除
        const clearable_ = computed(() => {
            return props.clearable && pickerValue.value
        })

        const formatStr = computed(() => {
            if (props.format) return props.format
            if (props.mode === 'time') return 'HH:mm'
            else if (props.mode === 'date') return 'YYYY-MM-DD'
            else return ''
        })

        // 成为表单因子，会主动推v-model的值给表单
        useFormFactor({
            name: cmptName,
            vModel: pickerValue,
            change: ({ changeFactor, resetFactor }, isReset) => {
                if (isReset) {
                    resetFactor()
                } else {
                    emitEvent('change', changeInfo)
                    changeFactor(pickerValue)
                }
                return true
            }
        })

        function findIndex(data, value) {
            return Math.max(0, data.findIndex(o => {
                return (props.rangeKey ? o[props.rangeKey] : o) === value
            }))
        }

        // picker选择改变
        function handleChange(e) {
            if (hasTouch.value) {
                hasClickConfirm.value = true
            }
            emitEvent('columnchange', e, false)
            changeInfo.value = e.detail
        }
        // 小程序下有效，滑动锁
        function handleAnimation(e) {
            hasTouch.value = e.detail.value
            if (hasClickConfirm.value) {
                handleConfirm()
            }
        }
        // 显示picker
        function handleClick(e) {
            showPicker.value = true
        }
        // 初始化
        function handleInit(e) {
            changeInfo.value = e.detail
        }
        // 提交事件
        function handleConfirm(e) {
            if (['time', 'date'].includes(props.mode)) {
                let dateVal = tempValue.value
                if (props.mode === 'time') {
                    dateVal = `${dayjs().format('YYYY-MM-DD')} ${dateVal}`
                }
                pickerValue.value = dayjs(dateVal).format(formatStr.value)
            } else if (props.mode === 'selector') {
                pickerValue.value = props.rangeKey ? props.range[tempValue.value]?.[props.rangeKey] : props.range[tempValue.value]
            } else if (props.mode === 'multiSelector') {
                pickerValue.value = props.range.map((o, i) => {
                    return props.rangeKey ? o[tempValue.value[i]]?.[props.rangeKey] : o[tempValue.value[i]]
                }).join(props.separator)
            }
            showPicker.value = false
        }
        // 取消事件
        function handleCancel(e) {
            showPicker.value = false
            emitEvent('cancel', e)
        }
        // 清空
        function handleClear() {
            pickerValue.value = null
        }

        return {
            showPicker,
            pickerValue,
            handleChange,
            handleClick,
            tempValue,
            clearable_,
            handleInit,
            handleClear,
            handleCancel,
            handleConfirm,
            handleAnimation
        }
    }
})
</script>

<style lang="scss">
.ca-picker {
    &-hd {
        height: 90rpx;
    }
    &__text {
        height: $picker-height;
        font-size: $font-base;
    }
}
</style>
