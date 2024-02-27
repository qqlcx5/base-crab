<template>
    <view
        class="ca-switch"
        :class="[{ 'is-active': isChecked, 'is-loading': loading, 'is-disabled': disabled }, `is-${shape}`]"
        :style="[switchStyle]" @click="handleClick()">
        <!-- 球的轨道 -->
        <view class="ca-switch__chute" :style="[chuteStyle]">
            <!-- 球 -->
            <view class="ca-switch__slide" :style="[slideStyle]">
                <text v-if="loading" class="ca-switch__loading" :style="[loadingStyle]" />
            </view>
            <!-- 选中文字 -->
            <text v-if="onText" class="ca-switch__text is-on" :style="[textStyle_, trendsTextStyle(true), textStyle]">
                {{ onText }}
            </text>
            <!-- 未选中文字 -->
            <text v-if="offText" class="ca-switch__text is-off" :style="[textStyle_, trendsTextStyle(false), textStyle]">
                {{ offText }}
            </text>
        </view>
    </view>
</template>

<script>
import { defineComponent, computed, watch, ref, getCurrentInstance } from 'vue'
import { addUnit, getRect } from '../../libs/utils/tools'
import props from './props'
import { useVModel } from '../../libs/utils/useCore'

export default defineComponent({
    name: 'CaSwitch',
    props,
    emits: ['click', 'update:modelValue', 'change', 'asyncChange'],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance()
        // 组件宽度
        const switchWidth = ref(0)
        // 球跟轨道之间的间隙
        const spaceSize = parseInt(addUnit(props.space))
        // 滑块大小
        const switchHeight = parseInt(addUnit(props.size))
        // 球大小
        const slideSize = switchHeight - 2 * spaceSize
        // 文本的宽度（要取最大值）
        const textMaxWidth = ref(0)
        // 双向绑定
        const switchValue = useVModel()

        // 是否激活
        const isChecked = computed(() => switchValue.value === props.onVal)
        // 文字颜色（on,off）
        const textStyle_ = computed(() => {
            return {
                fontSize: addUnit(props.textSize),
                minWidth: `${textMaxWidth.value}px`,
                zIndex: `${props.textDisplay ? 3 : 1}`
            }
        })
        // 文字颜色
        const trendsTextStyle = computed(() => {
            return (isOn) => {
                return isOn
                    ? {
                        opacity: props.textDisplay || isChecked.value ? 1 : 0,
                        color: props.textDisplay ? (isChecked.value ? props.textColor : props.textSelColor) : (isChecked.value ? props.textSelColor : props.textColor)
                    }
                    : {
                        opacity: props.textDisplay || !isChecked.value ? 1 : 0,
                        color: props.textDisplay ? (isChecked.value ? props.textSelColor : props.textColor) : (isChecked.value ? props.textSelColor : props.textColor)
                    }
            }
        })
        // switch外层样式
        const switchStyle = computed(() => {
            return {
                width: `${spaceSize > 0 ? switchWidth.value : switchWidth.value - 2 * spaceSize}px`,
                height: `${spaceSize > 0 ? switchHeight.value : switchHeight.value - 2 * spaceSize}px`,
                opacity: switchWidth.value ? props.disabled ? 0.6 : 1 : 0
            }
        })
        // 滑槽样式
        const chuteStyle = computed(() => {
            const chuteColor = isChecked.value ? props.chuteSelColor : props.chuteColor
            const chuteStyle = {
                height: `${switchHeight}px`,
                width: `${switchWidth.value}px`,
                [chuteColor.includes('linear-gradient') ? 'background' : 'backgroundColor']: chuteColor,
                borderRadius: props.shape === 'circle' ? `${switchHeight}px` : '6rpx',
                padding: spaceSize > 0 ? `${spaceSize}px` : 0,
                opacity: switchWidth.value ? 1 : 0
            }
            return chuteStyle
        })

        // 球样式
        const slideStyle = computed(() => {
            const slideStyle = {
                width: `${props.textDisplay ? textMaxWidth.value : slideSize}px`,
                borderRadius: props.shape === 'circle' ? `${Math.ceil(slideSize / 2)}px` : '4rpx',
                height: `${slideSize}px`,
                transform: `translateX(${isChecked.value ? textMaxWidth.value : spaceSize > 0 ? 0 : spaceSize}px)`,
                boxShadow: props.chuteShadow
            }
            return slideStyle
        })
        // 加载样式
        const loadingStyle = computed(() => {
            const size = addUnit(props.loadingSize)
            return {
                width: size,
                height: size,
                color: props.loadingColor || (isChecked.value ? props.chuteSelColor : props.chuteColor)
            }
        })
        // 文字改变要重新触发计算
        watch(() => [props.onText, props.offText], () => {
            getSwitchWidth()
        }, {
            immediate: true
        })
        // 获取switch高度
        async function getSwitchWidth() {
            const slideRect = await getRect('.ca-switch__text', {}, proxy)
            const textInfo = slideRect ? ([].concat(slideRect)).map(o => o.width) : []
            // 文字最小宽度
            textMaxWidth.value = Math.ceil(Math.max(...textInfo, slideSize * 0.8))
            if (props.textDisplay) {
                switchWidth.value = (textMaxWidth.value + spaceSize) * 2
            } else {
                switchWidth.value = slideSize + textMaxWidth.value + spaceSize * 2
            }
        }
        // 状态切换
        async function handleClick() {
            if (props.readonly || props.loading) return
            if (props.disabled) {
                props.disabledText && uni.showToast({ title: props.disabledText })
                return
            }
            const res = isChecked.value ? props.offVal : props.onVal
            if (props.async) {
                emit('asyncChange', res)
                return
            }
            switchValue.value = res
        }
        return {
            chuteStyle,
            isChecked,
            textStyle_,
            slideStyle,
            slideSize,
            switchStyle,
            loadingStyle,
            trendsTextStyle,
            handleClick
        }
    }
})
</script>

<style lang="scss" scoped>
.ca-switch {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s linear;
    will-change: opacity, width, height;

    &__chute {
        transition: opacity 0.3s linear, background-color 0.3s linear;
        will-change: opacity, width, height;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
    }

    &__slide {
        background-color: #fff;
        border-radius: 100%;
        transition: transform 0.2s cubic-bezier(0.65, 0.05, 0.36, 1);
        transform: translateX(0);
        will-change: transform;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
    }

    &__loading {
        color: rgb(41, 121, 255);
        width: 30rpx;
        height: 30rpx;
        border-radius: 100%;
        animation: rotate 1s linear infinite;
        box-sizing: border-box;

        &::after,
        ::before {
            content: '';
            color: inherit;
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            border-radius: 100%;
            border: 2px solid currentColor;
            box-sizing: border-box;
        }
    }

    &::before {
        z-index: 1;
        opacity: 0.15;
    }

    &::after {
        z-index: 2;
        border-color: currentColor transparent transparent;
    }

    &__text {
        font-size: 24rpx;
        color: #ffffff;
        position: absolute;
        z-index: 1;
        opacity: 0;
        top: 0;
        bottom: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.1s linear;
        white-space: nowrap;
        padding: 0 12rpx;
        line-height: 1;
        box-sizing: border-box;

        &.is-on {
            left: 0;
        }

        &.is-off {
            right: 0;
        }
    }

    /* 解决视觉偏差问题 */
    &.is-circle {
        .is-on {
            padding: 0 12rpx 0 18rpx;
        }

        .is-off {
            padding: 0 18rpx 0 12rpx;
        }
    }

    &.is-disabled {
        .ca-switch__chute {
            cursor: no-drop;
            pointer-events: none;
        }
    }

}

@keyframes rotate {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }

    100% {
        -webkit-transform: rotate(1turn);
        transform: rotate(1turn);
    }
}
</style>
