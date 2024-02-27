<!--
 * @Author: sanshui
 * @Date: 2022-05-17 16:00:11
 * @LastEditors: sanshui
 * @LastEditTime: 2022-05-26 17:22:33
 * @Description: For better maintenance, please fill in the document description carefully, thank you ~
-->
<template>
    <view
        class="ca-loading"
        :class="[`ca-loading--${type}`]"
        :style="[loadingStyle]"
    >
        <view
            v-for="item in lineNum"
            :key="item"
            class="ca-loading__line"
            :class="[`ca-loading__line--${item}`]"
            :style="[loadingStyle]"
        />
        <slot />
    </view>
</template>
<script>
import { computed, defineComponent } from 'vue'
import { addUnit } from '../../libs/utils/tools'
export default defineComponent({
    name: 'CaLoading',
    props: {
        size: {
            type: [String, Number],
            default: 28
        },
        color: {
            type: String,
            default: 'inherit'
        },
        type: {
            type: String,
            default: 'circular',
            validator: function (value) {
                return ['circular'].includes(value)
            }
        }
    },
    setup(props) {
        const configMap = new Map([
            ['circular', {
                lineNum: 3
            }]
        ])
        const lineNum = computed(() => configMap.get(props.type).lineNum)
        const loadingStyle = computed(() => {
            const size = addUnit(props.size, 'rpx', 'px')
            return {
                width: size,
                height: size,
                borderWidth: `${Math.max(Math.ceil(parseInt(size) * 0.05), 1)}px`
            }
        })
        return {
            lineNum,
            loadingStyle
        }
    }
})
</script>
<style lang="scss" scoped>
.ca-loading {
    display: inline-block;
    position: relative;
    width: 80rpx;
    height: 80rpx;
    &--circular {
        .ca-loading {
            &__line {
                display: block;
                position: absolute;
                width: 64rpx;
                height: 64rpx;
                color: inherit;
                border-style: solid;
                border-color: currentColor transparent transparent transparent;
                border-radius: 50%;
                animation: circular 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
                @for $i from 0 through 2 {
                    &--#{$i} {
                        animation-delay: -#{(3 - $i) * 0.15}s;
                    }
                }
            }
        }
    }
}
@keyframes circular {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
