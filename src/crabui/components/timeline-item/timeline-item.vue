<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2022-01-20 11:06:39
-->
<template>
    <view class="ca-timeline-item">
        <view class="ca-timeline-item__line" />
        <view class="ca-timeline-item__node">
            <slot name="dot" />
        </view>
        <view
            class="ca-timeline-item__wrapper ca-flex-column"
            :class="{'ca-column-reverse': placement_ === 'top'}"
        >
            <slot v-if="$slots.default" />
            <view
                v-if="timestamp"
                class="ca-timeline-item__timestamp ca-grey ca-fs-22"
            >
                {{ timestamp }}
            </view>
        </view>
    </view>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useProps } from '../../libs/utils/useCore.js'
import { addUnit } from '../../libs/utils/tools.js'

export default defineComponent({
    name: 'CaTimelineItem',
    props: {
        hideTimestamp: {
            type: Boolean,
            default: false
        },
        timestamp: {
            type: String,
            default: null
        },
        // 时间位置，可选值：top/bottom
        placement: {
            type: String,
            default: 'bottom'
        }
    },
    setup() {
        const getProps = useProps('CrabTimeline')
        // label宽度
        const placement_ = computed(() => {
            return addUnit(getProps('placement', 'bottom'))
        })
        return {
            placement_
        }
    }
})
</script>
<style lang="scss">
.ca-timeline {
    &-item {
        position: relative;
        padding-left: 50rpx;
        padding-bottom: 20rpx;
        &__timestamp {
            margin-top: 8rpx;
        }
        &__wrapper {
            position: relative;
            top: -6rpx;
            &.ca-column-reverse {
                .ca-timeline-item__timestamp {
                    margin-top: 0;
                    margin-bottom: 8rpx;
                }
            }
        }
        &__line {
            @include abs(0, null, null, 10rpx);
            height: 100%;
            background-color: #e4e7ed;
            width: 4rpx;
        }
        &__node {
            position: absolute;
            background-color: #e4e7ed;
            border-radius: 50%;
            @include abs(0, null, null, 0);
            width: 24rpx;
            height: 24rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2;
        }
        &:last-child {
            .ca-timeline-item__line {
                display: none;
            }
        }
    }
}
</style>
