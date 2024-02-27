<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2022-02-24 09:36:26
-->
<template>
    <view
        class="ca-popover"
        :class="[ popoverClass, customClass ]"
        :style="[ customStyle ]"
    >
        <!-- <ca-mask></ca-mask> -->
        <view
            class="ca-popover__reference"
            @click="handleReferenceClick"
        >
            <slot />
        </view>
        <ca-mask
            :show="inputValue"
            :z-index="zIndex - 1"
            bg-color="transparent"
            @click="handleMaskClick"
        />
        <ca-transition
            :show="inputValue"
            :style="{zIndex: zIndex}"
            :mode-class="modeClass"
        >
            <view
                class="ca-popover__wrapper"
                :style="[customStyle, popoverStyle]"
            >
                <view
                    v-if="title"
                    class="ca-popover__title"
                    :style="[titleStyle]"
                >
                    {{ title }}
                </view>
                <view
                    v-if="content"
                    class="ca-popover__content"
                    :style="[contentStyle]"
                >
                    {{ content }}
                </view>
                <text
                    class="ca-popover__arrow"
                    :style="[arrowStyle]"
                >
                    <text
                        class="ca-popover__arrow--inner"
                        :style="[arrowStyleInner]"
                    />
                </text>
                <slot name="content" />
            </view>
        </ca-transition>
    </view>
</template>

<script>
import { defineComponent, computed, onMounted, watch, ref } from 'vue'
import { addUnit } from '../../libs/utils/tools.js'
import { useRect } from '../../libs/utils/useCore.js'
import crabUIMixin from '../../libs/mixins/crabui.js'

export default defineComponent({
    name: 'CaPopover',
    mixins: [crabUIMixin],
    props: {
        title: {
            type: String,
            default: ''
        },
        modelValue: {
            type: Boolean,
            default: false
        },
        content: {
            type: String,
            default: ''
        },
        modeClass: {
            type: [Array, String],
            default: ''
        },
        placement: {
            type: String,
            default: 'bottom',
            validator: function (value) {
                return ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'right', 'right-start', 'right-end', 'left', 'left-start', 'left-end'].indexOf(value) !== -1
            }
        },
        bgColor: {
            type: String,
            default: '#fff'
        },
        titleStyle: {
            type: [String, Object],
            default: ''
        },
        contentStyle: {
            type: [String, Object],
            default: ''
        },
        zIndex: {
            type: [String, Number],
            default: 10050
        },
        // 单位默认是rpx  只支持px  rpx  %这3种单位
        width: {
            type: [String, Number],
            default: 250
        }
    },
    setup(props) {
        const inputValue = uni.$ca.useVModel()
        const arrowStyle = ref({})
        const arrowStyleInner = ref({})
        const width = addUnit(props.width, 'rpx', 'px')
        const popoverStyle = ref()
        const popoverClass = computed(() => {
            return `ca-popover--${props.placement.split('-')[0]}`
        })
        onMounted(() => {
            const tagRect = useRect('.ca-popover__reference')
            watch([tagRect, () => props.placement], ([rect, placement]) => {
                setPopoverStyle(rect)
            })
        })
        function setPopoverStyle(rect) {
            let widthDigit = parseInt(width)
            if (width.indexOf('%') !== -1) {
                widthDigit = (rect.width * widthDigit / 100).toFixed(4)
            }
            const minWidth = Math.min(Math.min(widthDigit, rect.width) * 0.3, 20)
            let arwStyle = {}
            let ppvStyle = {}
            if (props.placement.indexOf('bottom') !== -1) {
                arwStyle = {
                    borderTopWidth: '0px',
                    top: '-12px',
                    borderBottomColor: '#ebeef5'
                }
                ppvStyle = {
                    bottom: '-10px'
                }
            } else if (props.placement.indexOf('right') !== -1) {
                ppvStyle = {
                    borderRightWidth: '0px',
                    left: `${rect.width + 12}px`,
                    borderleftColor: '#ebeef5'
                }
                arwStyle = {
                    borderLeftWidth: '0px',
                    left: '-12px',
                    borderRightColor: '#ebeef5'
                }
            } else if (props.placement.indexOf('left') !== -1) {
                ppvStyle = {
                    borderLeftWidth: '0px',
                    left: `-${widthDigit + 12}px`,
                    borderRightColor: '#ebeef5'
                }
                arwStyle = {
                    borderRightWidth: '0px',
                    right: '-12px',
                    borderLeftColor: '#ebeef5'
                }
            } else {
                arwStyle = {
                    borderBottomWidth: '0px',
                    bottom: '-12px',
                    borderTopColor: '#ebeef5'
                }
                ppvStyle = {
                    top: '-10px'
                }
            }
            switch (props.placement) {
                case 'top':
                    ppvStyle.left = '50%'
                    ppvStyle.transform = 'translateX(-50%) translateY(-100%)'
                    arwStyle.left = '50%'
                    break
                case 'top-start':
                    ppvStyle.left = '0px'
                    ppvStyle.transform = 'translateY(-100%)'
                    arwStyle.left = `${minWidth}px`
                    break
                case 'top-end':
                    ppvStyle.transform = 'translateY(-100%)'
                    ppvStyle.right = '0rpx'
                    arwStyle.right = '0rpx'
                    break
                case 'bottom':
                    ppvStyle.left = '50%'
                    ppvStyle.transform = 'translateX(-50%) translateY(100%)'
                    arwStyle.left = '50%'
                    break
                case 'bottom-start':
                    ppvStyle.left = '0px'
                    ppvStyle.transform = 'translateY(100%)'
                    arwStyle.left = `${minWidth}px`
                    break
                case 'bottom-end':
                    ppvStyle.transform = 'translateY(100%)'
                    ppvStyle.right = '0rpx'
                    arwStyle.right = '0rpx'
                    break
                case 'right':
                case 'left':
                    ppvStyle.top = '50%'
                    ppvStyle.transform = 'translateY(-50%)'
                    arwStyle.top = '50%'
                    break
                case 'right-start':
                case 'left-start':
                    ppvStyle.top = '0px'
                    arwStyle.top = `${rect.height / 2}px`
                    break
                case 'right-end':
                case 'left-end':
                    ppvStyle.top = '100%'
                    ppvStyle.transform = 'translateY(-100%)'
                    arwStyle.bottom = `calc(-24px + ${rect.height / 2}px)`
                    break
                default:
                    break
            }
            popoverStyle.value = {
                width,
                zIndex: props.zIndex,
                backgroundColor: props.bgColor,
                ...ppvStyle
            }
            arrowStyle.value = {
                ...arwStyle
            }
            const tempInner = {
                ...arrowStyle.value,
                color: props.bgColor,
                left: null,
                right: null,
                top: null,
                bottom: null
            }
            Object.keys(tempInner).forEach(key => {
                if (/border(.*)Color/.test(key)) {
                    tempInner[key] = props.bgColor
                }
            })
            arrowStyleInner.value = tempInner
        }
        function handleReferenceClick() {
            inputValue.value = true
        }
        function handleMaskClick() {
            inputValue.value = false
        }
        return {
            arrowStyle,
            arrowStyleInner,
            popoverStyle,
            popoverClass,
            inputValue,
            handleReferenceClick,
            handleMaskClick
        }
    }
})
</script>

<style lang="scss">
.ca-popover {
    position: relative;
    display: inline-flex;
    &__reference {
        display: inline-block;
    }
    &__wrapper {
        position: absolute;
        box-shadow: 0 2rpx 12rpx 0 rgb(0 0 0 / 10%);
        border: 1px solid #ebeef5;
        border-radius: 8rpx;
        padding: 12rpx 16rpx;
        background-color: #fff;
    }
    &__title {
        font-size: $font-base;
        color: $text-color;
    }
    &__content {
        font-size: $font-sm;
        color: $sub-text-color;
    }
    &__arrow,
    &__arrow--inner {
        position: absolute;
        width: 0;
        height: 0;
        border: 12px solid transparent;
        filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
    }
    &--bottom,
    &--top {
        .ca-popover {
            &__arrow {
                transform: translateX(-50%) scale(0.5);
            }
            &__arrow--inner {
                left: 50%;
                transform: translateX(-50%);
            }
        }
    }
    &--top {
        .ca-popover {
            &__arrow,
            &__arrow--inner {
                transform-origin: 50% 0;
            }
            &__arrow--inner {
                bottom: 1px;
                border-bottom-color: currentColor;
            }
        }
    }
    &--bottom {
        .ca-popover {
            &__arrow,
            &__arrow--inner {
                transform-origin: 50% 100%;
            }
            &__arrow--inner {
                top: 1px;
                border-bottom-color: currentColor;
            }
        }
    }
    &--left,
    &--right {
        .ca-popover {
            &__arrow {
                transform: translateY(-50%) scale(0.5);
            }
            &__arrow--inner {
                top: -12px;
                transform: translateX(0);
            }
        }
    }
    &--left {
        .ca-popover {
            &__arrow,
            &__arrow--inner {
                transform-origin: 0 50%;
            }
            &__arrow--inner {
                right: 1px;
            }
        }
    }
    &--right {
        .ca-popover {
            &__arrow,
            &__arrow--inner {
                transform-origin: 100% 50%;
            }
            &__arrow--inner {
                left: 1px;
            }
        }
    }
}
</style>
