<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2022-02-17 16:21:27
-->
<template>
    <view class="ca-timeline">
        <slot v-if="$slots.default" />
        <template v-else>
            <ca-collapse-item
                v-for="(item, index) in data"
                :key="index"
                :title="item.title"
                :description="item.description"
            />
        </template>
    </view>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import { bindEvent } from '../../libs/utils/tools.js'

export default defineComponent({
    name: 'CaCollapse',
    props: {
        /**
        * 当前选中的值
        */
        modelValue: {
            type: Number,
            default: 0
        },
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
        },
        border: {
            type: Boolean,
            default: true
        }
    },
    setup() {
        const collapseItems = ref([])
        const collapseValue = uni.$ca.useVModel()
        watch(collapseItems, () => {
            collapseItems.value.forEach((instance, index) => {
                instance.setIndex(index)
            })
        })
        // 注册事件句柄
        const eventHandle = bindEvent()
        eventHandle && eventHandle.$on('CrabCollapseItem:click', ({ detail }) => {
            collapseValue.value = collapseValue.value === detail.value ? -1 : detail.value
            // bindEvent.$emit('CrabCollapseItem:change', {
            //     type: 'change',
            //     detail: {
            //         value: collapseValue.value
            //     }
            // })
        })
        return {
            collapseItems,
            collapseValue
        }
    }
})
</script>
