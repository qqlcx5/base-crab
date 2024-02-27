<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-07-20 14:10:08
-->
<template>
    <view
        class="carb-mask"
        :class="[
            show ? 'carb-mask--visible' : ''
        ]"
        :style="[ parentStyle_ ]"
        @click="handleClick"
        @touchmove.stop.prevent="() => {}"
    />
</template>

<script>
import { defineComponent, computed } from 'vue'
import { addUnit } from '../../libs/utils/tools.js'
export default defineComponent({
    name: 'CaMask',
    props: {
        show: {
            type: Boolean,
            default: true
        },
        /**
        * 点击蒙板是否关闭,默认true关闭
        */
        maskabled: {
            type: Boolean,
            default: true
        },
        // 动画时长 单位ms  250ms = 0.25s
        duration: {
            type: Number,
            default: 250
        },
        fixed: {
            type: Boolean,
            default: true
        },
        zIndex: {
            type: Number,
            default: 1000
        },
        bgColor: {
            type: String,
            default: 'rgba(0, 0, 0, 0.55)'
        },
        stopPrevent: {
            type: [Boolean, String],
            default: true
        },
        radius: {
            type: [String, Number],
            default: 0
        }
    },
    emits: ['click'],
    setup(props, { emit }) {
        const parentStyle_ = computed(() => {
            return {
                position: props.fixed ? 'fixed' : 'absolute',
                zIndex: props.zIndex,
                backgroundColor: props.bgColor,
                borderRadius: addUnit(props.radius),
                transitionDuration: `${props.duration}ms`
            }
        })
        function handleClick() {
            if (!props.maskabled) return
            emit('click')
        }
        return {
            parentStyle_,
            handleClick
        }
    }
})
</script>

<style scoped lang="scss">
// 蒙层
.carb-mask {
    background-color: $mask-bg;
    @include fixed(0, 0, 0, 0);
    transition-delay: 0ms;
    opacity: 0;
    pointer-events: none;
    z-index: 999;
    transition-timing-function: linear;
    transition-property: opacity;
    &--visible {
        opacity: 1;
        pointer-events: auto;
    }
}
</style>
