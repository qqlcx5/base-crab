<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-12-28 15:41:09
-->
<template>
    <view
        class="ca-keyboard-number"
        :class="[
            `ca-keyboard-number--${config_.operation}`,
            `ca-keyboard-number--${randomName}`
        ]"
        @click.stop="handleClick($event)"
    >
        <template v-if="config_.type === 'text' || (config_.type === 'symbol' && config_.operation !== 'empty')">
            {{ config_.value }}
        </template>
        <template v-else-if="config_.type === 'icon'">
            <ca-icon
                size="40"
                :name="config_.value"
            />
        </template>
        <ca-ripple
            v-if="ripple && config_.operation !== 'empty'"
            :ripple="rippleInfo"
        />
    </view>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useProps, useEmit } from '../../libs/utils/useCore.js'
import { useRipple } from '../ripple/useRipple'
export default defineComponent({
    name: 'CaKeyboardNumber',
    props: {
        config: {
            type: Object,
            default: () => ({})
        },
        showDotted: {
            type: Boolean,
            default: null
        },
        // 开启水波特效
        ripple: {
            type: Boolean,
            default: true
        }
    },
    setup(props) {
        const getProps = useProps('CrabKeyboard')
        const randomName = `${Math.random().toString(32).substr(2)}`

        const emitEvent = useEmit()

        // 这边判断是否要屏蔽掉点
        const config_ = computed(() => {
            const showDotted_ = computed(() => getProps('showDotted'))
            return {
                ...props.config,
                operation: props.config.type === 'symbol' && !showDotted_.value ? 'empty' : props.config.operation
            }
        })

        const { perform, ripple: rippleInfo } = useRipple(`.ca-keyboard-number--${randomName}`)

        const handleClick = (e) => {
            // 是否开启水波纹效果  等添加了节流这里加需要加;
            if (props.ripple) {
                perform(e)
            }
            emitEvent('choose', config_)
        }
        return {
            randomName,
            rippleInfo,
            config_,
            handleClick
        }
    }
})
</script>

<style lang="scss">
.ca-keyboard-number {
    @include flex(row);
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    background-color: #ffffff;
    border-radius: $keyboard-border-radius;
    box-shadow: $keyboard-box-shadow;
    border-bottom: 1px solid $keyboard-border;
    font-weight: bold;
    height: 106rpx;
    font-size: 40rpx;
    &--empty {
        background-color: rgba(255, 255, 255, 0.5);
    }
    &--confirm {
        height: calc(212rpx + $keyboard-spacing-base);
    }
    &--reset {
        font-size: 32rpx;
        font-weight: 400;
    }
    &--delete,
    &--confirm,
    &--reset {
        background-color: #c2c6cf;
        color: #fff;
    }
}
</style>
