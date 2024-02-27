<!--
 * @Author: sanshui
 * @Date: 2022-05-09 10:11:46
 * @LastEditors: sanshui
 * @LastEditTime: 2023-09-01 18:17:15
 * @Description: Tab 标签页
-->
<template>
    <view class="ca-tabs" :class="{ 'is-sticky': sticky }" :style="tabsStyle">
        <slot name="prepend" />
        <scroll-view
            class="ca-tabs-scroll" :scroll-x="true" :show-scrollbar="false" :scroll-with-animation="true"
            :scroll-into-view="scrollIntoView">
            <view class="ca-tabs-wrapper" :style="wrapperStyle">
                <view
                    v-for="(tab, index) in data" :id="`${uuid}_${index}`" :key="tab.value" class="ca-tabs__item"
                    :class="{ 'is-active': tabsValue === index }" :style="itemStyle(index)"
                    @click="handleClick(index)">
                    <view class="ca-tabs__label">
                        {{ tab.label }}
                    </view>
                    <view class="ca-tabs__line" :style="lineStyle" />
                </view>
            </view>
        </scroll-view>
        <slot name="append" />
    </view>
</template>

<script>
import { computed, watch, defineComponent } from 'vue'
import { useEmit, useRect, useVModel } from '../../libs/utils/useCore'
import { addUnit, guuid } from '../../libs/utils/tools'
import props from './props'
export default defineComponent({
    props,
    emits: ['update:modelValue', 'change', 'tab-click'],
    setup(props) {
        const tabsValue = useVModel()
        const emitEvent = useEmit()
        const uuid = guuid()
        watch(tabsValue, (val) => {
            emitEvent('change', val)
        })
        const gutterPx = computed(() => addUnit(props.gutter, 'rpx', 'px'))
        const tabsRect = useRect('.ca-tabs')
        const tabItemsRect = useRect('.ca-tabs__item')
        const tabsLabelRect = useRect('.ca-tabs__label')
        const tabsStyle = computed(() => {
            return props.sticky
                ? {
                    top: addUnit(props.stickyTop),
                    zIndex: props.zIndex,
                    backgroundColor: props.bgColor
                }
                : { backgroundColor: props.bgColor }
        })
        const wrapperStyle = computed(() => {
            const alignKeys = {
                left: 'flex-start',
                right: 'flex-end',
                center: 'center'
            }
            return {
                justifyContent: alignKeys[props.align]
            }
        })
        const scrollIntoView = computed(() => `${uuid}_${Math.max(tabsValue.value - props.threshold, 0)}`)
        // 由于获取出来的偏移量有问题，所以我们自己造数据（问题在于我们是动态的边距）
        const isFull = computed(() =>
            props.shrink
                ? true
                : tabsRect.value?.width <
                tabItemTotalWidth.value + props.data.length * 2 * parseInt(gutterPx.value)
        )
        const tabItemTotalWidth = computed(() => {
            return tabsLabelRect.value?.reduce((a, b) => a + b.width, 0)
        })
        const itemStyle = computed(() => {
            return (index) => {
                return {
                    flex: isFull.value ? '1 1 0' : '0 0 auto',
                    padding: `0 ${gutterPx.value}`,
                    fontSize: addUnit(props.fontSize),
                    color: tabsValue.value === index ? props.activeColor : props.color
                }
            }
        })
        const minWidth = computed(() => {
            return Math.min.apply(
                null,
                tabsLabelRect.value?.map((o) => o.width)
            )
        })
        const lineStyle = computed(() => {
            const lineWidth = addUnit(props.lineWidth)
            const lineHeight = addUnit(props.lineHeight)
            if (!tabItemsRect.value) return {}
            const width = lineWidth === 'auto' ? `${minWidth.value}px` : lineWidth
            return {
                width,
                height: lineHeight,
                backgroundColor: props.lineColor
            }
        })
        function handleClick(index) {
            tabsValue.value = index
            emitEvent('tab-click', index)
        }
        return {
            uuid,
            tabsValue,
            itemStyle,
            tabsStyle,
            lineStyle,
            wrapperStyle,
            scrollIntoView,
            handleClick
        }
    }
})

</script>

<style lang="scss">
    .ca-tabs {
        height: 88rpx;
        display: flex;
        align-items: center;
        position: relative;

        &.is-sticky {
            position: sticky;
            top: 0;
        }

        &-scroll {
            height: 100%;
            flex: 1;
            min-width: 0;
            white-space: nowrap;
        }

        &-wrapper {
            display: flex;
            height: 100%;
        }

        &__item {
            @include ellipsis;

            display: inline-flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-width: 0;
            position: relative;

            &.is-active {
                .ca-tabs {
                    &__line {
                        opacity: 1;
                        transform: translate(50%, 0);
                    }
                }
            }
        }

        &__label {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            white-space: nowrap;
        }

        &__line {
            @include abs(null, 50%, 4rpx);
            @include tst;

            transform: translate(50%, 200%);
            border-radius: 10rpx;
            opacity: 0;
        }
    }
</style>
