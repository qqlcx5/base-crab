<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-12-10 17:18:01
-->
<template>
    <ca-transition
        :show="visible"
        :block="block"
        @change="handleChange"
    >
        <view
            v-if="removeAlert"
            class="ca-tag"
            :class="[
                `ca-tag--${type}`,
                `ca-tag--${size}`,
                `is-${effect}`,
                block ? 'is-block': ''
            ]"
            :style="[tagStyle_, caTheme]"
        >
            <view
                v-if="icon || $slots.prepend"
                class="ca-tag-hd"
                :style="[ prependStyle ]"
            >
                <slot name="prepend">
                    <ca-icon
                        :name="icon"
                        :size="iconSize_"
                    />
                </slot>
            </view>
            <view
                v-if="text || $slots.default"
                class="ca-tag-bd ca-flex-1"
            >
                <slot>{{ text }}</slot>
            </view>
            <view
                v-if="$slots.append || closable"
                class="ca-tag-ft"
                :style="[ appendStyle ]"
            >
                <slot name="append">
                    <ca-icon
                        v-if="closable"
                        name="ca-close"
                        :size="closeSize_"
                        @click="handleClose"
                    />
                </slot>
            </view>
        </view>
    </ca-transition>
</template>

<script>
import props from './props'
import { defineComponent, ref, computed, watch, onMounted } from 'vue'
import { useRect, useEmit } from '../../libs/utils/useCore.js'
import { useTheme } from '../theme/useTheme'

export default defineComponent({
    name: 'CaTag',
    props,
    setup(props) {
        const visible = ref(true)
        const removeAlert = ref(true)
        // 通用的事件句柄
        const emitEvent = useEmit()
        // 注入颜色
        const caTheme = useTheme()
        const iconSize_ = computed(() => {
            const iconSizes = {
                mini: 24,
                medium: 32,
                large: 40
            }
            return props.iconSize ? props.iconSize : iconSizes[props.size]
        })
        const closeSize_ = computed(() => {
            const iconSizes = {
                mini: 20,
                medium: 24,
                large: 28
            }
            return iconSizes[props.size]
        })
        const border_ = ref(0)
        onMounted(() => {
            const tagRect = useRect('.ca-tag')
            watch(tagRect, (val) => {
                const height = Math.ceil(val.height)
                let border = 0
                const tempSmallBorder = `${(height * 0.125 || 4)}px`
                const tempBorder = `${(height * 0.5 || '50%')}px`
                switch (props.shape) {
                    case 'square':
                        border = tempSmallBorder
                        break
                    case 'circle':
                        border = height ? tempBorder : '50%'
                        break
                    case 'lcircle':
                        border = `${tempBorder} 0 0 ${tempBorder}`
                        break
                    case 'rcircle':
                        border = `0 ${tempBorder} ${tempBorder} 0`
                        break
                    case 'leaf':
                        border = `0 ${tempBorder} 0 ${tempBorder}`
                        break
                    case 'rleaf':
                        border = `${tempBorder} 0 ${tempBorder} 0`
                        break
                    case 'bubble':
                        border = `${tempBorder} ${tempBorder} ${tempBorder} 0`
                        break
                    default:
                        break
                }
                border_.value = border
            })
        })

        const tagStyle_ = computed(() => {
            const tagSytle = {
                opacity: border_.value ? 1 : 0,
                borderRadius: border_.value
            }
            return tagSytle
        })
        // 点击关闭按钮
        function handleClose(e) {
            if (!props.closable) return
            visible.value = false
            emitEvent('close', e, false)
        }
        // 动画完成
        function handleChange(e) {
            removeAlert.value = e.detail
            emitEvent('change', e, false)
        }
        return {
            visible,
            removeAlert,
            closeSize_,
            iconSize_,
            tagStyle_,
            caTheme,
            handleClose,
            handleChange
        }
    }
})
</script>

<style lang="scss">
.ca-tag {
    flex: 1;
    padding: $spacing-col-sm $spacing-row-sm;
    border-radius: $alert-radius;
    border: 1px solid transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    &--mini {
        padding: $tag-padding-mn;
        .ca-tag {
            &-bd {
                font-size: $font-mn;
            }
        }
    }
    &--small {
        padding: $tag-padding-sm;
        .ca-tag {
            &-bd {
                font-size: $font-sm;
            }
            &-ft {
                margin-left: $spacing-row-mn;
            }
        }
    }
    &--normal {
        padding: $tag-padding-base;
        .ca-tag {
            &-bd {
                font-size: $font-base;
            }
            &-ft {
                margin-left: $spacing-row-sm;
            }
        }
    }
    &--large {
        padding: $tag-padding-lg;
        .ca-tag {
            &-bd {
                font-size: $font-lg;
            }
            &-ft {
                margin-left: $spacing-row-base;
            }
        }
    }
    &-hd {
        @include flex;
        align-items: center;
    }
    &-bd {
        @include flex;
        align-items: center;
        justify-content: center;
    }
    &-ft {
        font-size: 24rpx;
        @include flex;
        align-items: center;
    }
    $theme-array: primary, success, warning, info, danger;
    $alert-color-map: (
        primary: $alert-primary-color,
        success: $alert-success-color,
        warning: $alert-warning-color,
        info: $alert-info-color,
        danger: $alert-danger-color,
    );
    $alert-color-light-map: (
        primary: $alert-primary-light-color,
        success: $alert-success-light-color,
        warning: $alert-warning-light-color,
        info: $alert-info-light-color,
        danger: $alert-danger-light-color,
    );

    @each $theme in $theme-array {
        &--#{$theme} {
            &.is-light {
                background-color: map-get($alert-color-light-map, $theme);
                border-color: map-get($alert-color-map, $theme);
                .ca-tag {
                    &-bd,
                    &-hd,
                    &-ft {
                        color: map-get($alert-color-map, $theme);
                    }
                }
            }
            &.is-dark {
                background-color: map-get($alert-color-map, $theme);
                border-color: map-get($alert-color-map, $theme);
                .ca-tag {
                    &-bd,
                    &-hd {
                        color: #fff;
                    }
                    &-ft {
                        color: #fff;
                    }
                }
            }
            &.is-plain {
                border-color: map-get($alert-color-map, $theme);
                .ca-tag {
                    &-bd,
                    &-hd {
                        color: map-get($alert-color-map, $theme);
                    }
                    &-ft {
                        color: map-get($alert-color-map, $theme);
                    }
                }
            }
        }
    }
    &.is-block {
        display: flex;
    }
}
</style>
