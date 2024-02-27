<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2022-01-20 11:06:39
-->
<template>
    <view class="ca-timeline">
        <slot v-if="$slots.default" />
        <template v-else>
            <ca-timeline-item
                v-for="(item, index) in newData"
                :key="index"
                :timestamp="item.timestamp"
                :placement="placement"
            >
                {{ item.content }}
            </ca-timeline-item>
        </template>
    </view>
</template>

<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
    name: 'CaTimeline',
    props: {
        data: {
            type: Array,
            default: () => []
        },
        // 无任何插槽的作用下生效
        reverse: {
            type: Boolean,
            default: false
        },
        placement: {
            type: String,
            default: 'bottom'
        }
    },
    setup(props, { slots }) {
        const newData = computed(() => {
            return !slots.default && props.reverse ? [...props.data].reverse() : props.data
        })
        return {
            newData
        }
    }
})
</script>
