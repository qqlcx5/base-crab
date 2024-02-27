<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2022-02-14 09:57:51
-->
<template>
    <view
        class="ca-step"
        :class="{
            'ca-flex-1': !isLast || alignCenter,
            'ca-step--vertical': direction === 'vertical',
            'ca-flex': direction === 'vertical',
            'ca-step--center': alignCenter
        }"
        :style="[stepStyle]"
    >
        <view
            class="ca-step-hd"
            :class="{
                'ca-flex ca-justify-center': alignCenter && direction === 'horizontal'
            }"
        >
            <slot
                v-if="$slots.icon"
                name="icon"
            />
            <ca-icon
                v-else-if="icon"
                :name="icon"
                :color="color_"
                :size="iconSize_"
            />
            <text
                v-else
                class="ca-step__text"
                :style="[textStyle]"
            >
                {{ stepIndex }}
            </text>
            <text
                v-if="!isLast"
                :style="[lineStyle]"
                class="ca-step__line"
            />
        </view>
        <view
            v-if="title || description"
            class="ca-step-bd"
            :class="{
                'ca-flex-column ca-align-center': alignCenter && direction === 'horizontal'
            }"
        >
            <slot v-if="$slots.default" />
            <template v-else>
                <view
                    class="ca-step__title"
                    :style="[textStyle]"
                >
                    {{ title }}
                </view>
                <view
                    class="ca-step__description"
                    :style="[textStyle]"
                >
                    {{ description }}
                </view>
            </template>
        </view>
    </view>
</template>

<script>
import { defineComponent, onBeforeUnmount, ref, computed, toRaw } from 'vue'
import { addUnit } from '../../libs/utils/tools.js'
import { useParent, useProps } from '../../libs/utils/useCore.js'

export default defineComponent({
    name: 'CaStep',
    props: {
        // icon名称
        icon: {
            type: String,
            default: ''
        },
        // 标题
        title: {
            type: String,
            default: ''
        },
        // 描述文字
        description: {
            type: String,
            default: ''
        },
        // 字体颜色
        color: {
            type: String,
            default: ''
        },
        // icon大小
        iconSize: {
            type: [Number, String],
            default: ''
        },
        // 此参数仅在ca-steps设置了direction为horizontal时生效
        space: {
            type: [Number, String],
            default: ''
        }
    },
    setup(props) {
        const getProps = useProps('CrabSteps')
        const stepIndex = ref(-1)
        const uid = uni.$ca.guuid()
        const parent = useParent('CrabSteps')
        const active = computed(() => getProps('active', -1))
        const iconSize_ = computed(() => addUnit(getProps('iconSize', 40), 'rpx'))
        const direction = computed(() => getProps('direction', 'horizontal'))
        const space_ = computed(() => addUnit(getProps('space', 0)))
        const isLast = computed(() => {
            return (parent.steps[parent.steps.length - 1] || {}).uid === uid
        })
        const color_ = computed(() => {
            const index = stepIndex.value - 1
            return props.color || (active.value > index ? getProps('finishColor', '#409eff') : active.value === index ? getProps('activeColor', '#3c9cff') : getProps('inactiveColor', '#969799'))
        })
        const alignCenter = computed(() => {
            return getProps('alignCenter', 'false')
        })

        if (parent) {
            // 推给上级内容
            parent.steps = [...parent.steps, {
                uid,
                setIndex
            }]
            // 组件卸载的话 要移除steps
            onBeforeUnmount(() => {
                parent.steps = parent.steps.filter(o => o.uid !== uid)
            })
        }
        // 外层样式，控制最大宽度
        const stepStyle = computed(() => {
            const len = parent?.steps?.length || 0
            const paddingBottom = direction.value === 'vertical' && !isLast.value ? space_.value : '0rpx'
            return len > 0 && isLast.value
                ? {
                    maxWidth: `${(100 / len).toFixed(4)}%`,
                    paddingBottom
                }
                : {
                    paddingBottom
                }
        })
        const textStyle = computed(() => {
            return {
                color: color_.value,
                borderColor: color_.value
            }
        })
        const lineStyle = computed(() => {
            const iconSize = toRaw(iconSize_.value)
            const lineStyle = active.value > stepIndex.value - 1
                ? {
                    backgroundColor: color_.value
                }
                : {}
            // 水平
            if (direction.value === 'horizontal') {
                lineStyle.top = '50%'
                lineStyle.left = iconSize
                lineStyle.width = `calc(100% - ${iconSize})`
                lineStyle.transform = `translateY(-50%) ${alignCenter.value ? ' translateX(50%)' : ''}`
            } else {
                // 垂直
                lineStyle.top = iconSize
                lineStyle.height = `calc(100% - ${iconSize} + ${space_.value})`
                lineStyle.left = `calc(${iconSize} / 2)`
            }
            return lineStyle
        })
        function setIndex(index) {
            stepIndex.value = index
        }
        return {
            stepIndex,
            active,
            color_,
            textStyle,
            direction,
            lineStyle,
            stepStyle,
            isLast,
            iconSize_,
            alignCenter
        }
    }
})
</script>

<style lang="scss">
.ca-step {
    &__text {
        width: 40rpx;
        height: 40rpx;
        font-size: $font-sm;
        @include flex(row);
        align-items: center;
        justify-content: center;
        border-radius: 100%;
        border: 1px solid #bbb;
    }
    &__line {
        height: 1px;
        background-color: #bbb;
        position: absolute;
    }
    &-hd {
        position: relative;
    }
    &__title {
        margin-top: $spacing-col-sm;
        color: $text-color;
        font-size: $font-base;
    }
    &__description {
        font-size: $font-sm;
        margin-top: $spacing-col-sm;
    }
    &--vertical {
        .ca-step {
            &-bd {
                padding-left: $spacing-row-base;
            }
            &__line {
                width: 1px;
            }
        }
    }
    &--center {
        &.ca-step--horizontal {
            .ca-step {
                &-bd {
                    padding: 0 $spacing-row-base;
                    text-align: center;
                }
            }
        }
    }
}
</style>
