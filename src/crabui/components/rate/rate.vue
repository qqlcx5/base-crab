
<template>
    <view
        class="ca-rate"
        :class="{
            'ca-rate--disabled': disabled
        }"
        @touchmove="handleMove"
    >
        <view
            v-for="(item, index) in list"
            :key="index"
            class="ca-rate__item ca-flex-ajcenter"
            :style="{marginLeft: index !== 0 ? gutter_ : 0}"
            @click="handleClick($event, index)"
        >
            <ca-icon
                :name="item.status === 'full' ? activeIcon : icon"
                :color="item.status === 'full' ? activeColor_ : color"
                :size="size_"
            />
            <view
                class="ca-rate__decimal"
                :style="{width: `${item.value * 100}%`}"
            >
                <ca-icon
                    v-if="allowHalf && item.status === 'half'"
                    :name="activeIcon"
                    :color="activeColor_"
                    :size="size_"
                />
            </view>
        </view>
    </view>
</template>

<script>
import { defineComponent, computed, onMounted, watch, ref } from 'vue'
import { addUnit, throttle } from '../../libs/utils/tools'
import { useEmit, useRect, useVModel } from '../../libs/utils/useCore'

export default defineComponent({
    name: 'CaRate',
    props: {
        // 当前分值
        modelValue: {
            type: Number,
            default: 2
        },
        // 图标总数
        count: {
            type: Number,
            default: 5
        },
        // 图标大小，默认单位为
        size: {
            type: [Number, String],
            default: 32
        },
        // 图标间距，默认单位为4
        gutter: {
            type: [Number, String],
            default: 4
        },
        // 是否为只读状态，只读状态下无法修改评分
        readonly: {
            type: Boolean,
            default: false
        },
        // 是否禁用评分
        disabled: {
            type: Boolean,
            default: false
        },
        // 未选中颜色
        color: {
            type: String,
            default: '#c8c9cc'
        },
        // 选中颜色
        activeColor: {
            type: String,
            default: '#ee0a24'
        },
        // 禁止状态下的选中颜色
        disabledColor: {
            type: String,
            default: '#c8c9cc'
        },
        // 选中时的图标名称或图片链接
        activeIcon: {
            type: String,
            default: 'ca-star'
        },
        // 未选中时的图标名称或图片链接
        icon: {
            type: String,
            default: 'ca-star-o'
        },
        // 是否允许半选，可以展示任意小数结果
        allowHalf: {
            type: Boolean,
            default: false
        },
        // 是否可以通过滑动手势选择评分
        touchable: {
            type: Boolean,
            default: true
        }
    },
    emits: ['change', 'update:modelValue'],
    setup(props) {
        const rateValue = useVModel()
        const emitEvent = useEmit()
        watch(rateValue, val => {
            emitEvent('change', val)
        })
        const list = computed(() =>
            Array(props.count)
                .fill('')
                .map((_, i) =>
                    getRateStatus(
                        i + 1
                    )
                )
        )
        const gutter_ = computed(() => addUnit(props.gutter, 'rpx', 'px'))
        const size_ = computed(() => addUnit(props.size, 'rpx', 'px'))
        const activeColor_ = computed(() => props.disabled ? props.disabledColor : props.activeColor)
        const rateItemWidth = ref(0)
        const rateWidth = computed(() => props.count * (rateItemWidth.value + parseInt(gutter_.value)))
        onMounted(() => {
            const rateRate = useRect('.ca-rate__item')
            watch(rateRate, (val) => {
                rateItemWidth.value = val[0]?.width || parseInt(size_)
            }, {
                deep: true
            })
        })
        function handleClick(e, index) {
            if (props.disabled || props.readonly) return
            const value = (e.currentTarget.offsetLeft + rateItemWidth.value / 2) < e.detail.x || !props.allowHalf ? index + 1 : index + 0.5
            rateValue.value = value
        }
        function handleMove(e) {
            if (!props.touchable || props.disabled || props.readonly) return
            throttle(() => {
                let value = parseInt((e.touches[0].clientX - e.currentTarget.offsetLeft + parseInt(gutter_.value)) / rateWidth.value * props.count * 10) / 10
                !props.allowHalf && value++
                rateValue.value = Math.min(value, props.count)
            }, 50)
        }

        function getRateStatus(index) {
            const cardinal = 10 ** 10
            if (rateValue.value >= index) {
                return { status: 'full', value: 1 }
            }
            if (props.allowHalf) {
                return { status: 'half', value: Math.max(parseInt((rateValue.value - index + 1) * cardinal) / cardinal, 0) }
            }

            return { status: 'void', value: 0 }
        }
        return {
            list,
            size_,
            gutter_,
            activeColor_,
            rateWidth,
            rateValue,
            handleMove,
            handleClick
        }
    }
})
</script>
<style lang="scss">
.ca-rate {
    display: inline-flex;
    cursor: pointer;
    user-select: none;
    flex-wrap: wrap;
    &--disabled {
        cursor: not-allowed;
    }
    &--readonly {
        cursor: default;
    }
    &__item {
        position: relative;
    }
    &__decimal {
        @include abs(0, null, 0, 0);
        overflow: hidden;
        @include tst;
        font-size: 0;
    }
}
</style>
