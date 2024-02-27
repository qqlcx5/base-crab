<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2022-02-10 11:31:40
-->
<template>
    <view
        class="ca-steps"
        :class="[
            direction === 'horizontal' ? 'ca-flex' : 'ca-flex-column'
        ]"
    >
        <slot v-if="$slots.default" />
        <template v-else>
            <ca-step
                v-for="(item, index) in data"
                :key="index"
                :title="item.title"
                :icon="item.icon"
                :color="item.color"
                :description="item.description"
            />
        </template>
    </view>
</template>
<script>
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
    name: 'CrabSteps',
    props: {
        data: {
            type: Array,
            default: () => []
        },
        active: {
            type: Number,
            default: 0
        },
        // 可选值 竖向 vertical / 横向 horizontal
        direction: {
            type: String,
            default: 'horizontal'
        },
        // 激活中颜色
        activeColor: {
            type: String,
            default: '#3c9cff'
        },
        // 已完成颜色
        finishColor: {
            type: String,
            default: '#409eff'
        },
        // 未激活颜色
        inactiveColor: {
            type: String,
            default: '#969799'
        },
        // icon图标大小
        iconSize: {
            type: [Number, String],
            default: 40
        },
        // 进行居中对其
        alignCenter: {
            type: Boolean,
            default: false
        },
        // 此参数仅在direction为horizontal时生效
        space: {
            type: [Number, String],
            default: 40
        }
    },
    setup() {
        const steps = ref([])

        watch(steps, () => {
            steps.value.forEach((instance, index) => {
                instance.setIndex(index + 1)
            })
        })
        return {
            steps
        }
    }
})
</script>
