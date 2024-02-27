<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-12-10 17:18:01
-->
<template>
    <ca-transition
        :show="visible"
        @change="handleChange"
        @click="handleClick"
    >
        <view
            v-if="removeAlert"
            class="ca-alert"
            :class="[
                `ca-alert--${type}`,
                `is-${effect}`
            ]"
            :style="[alertStyle_]"
        >
            <view
                v-if="showIcon"
                class="ca-alert-hd"
            >
                <ca-icon
                    :name="iconClass_"
                    :size="iconSize_"
                />
            </view>
            <view class="ca-alert-bd ca-flex-1">
                <view
                    v-if="title || cmptSlots.title"
                    class="ca-alert__title"
                    :class="[titleClass_]"
                >
                    <template v-if="title">
                        {{ title }}
                    </template>
                    <template v-else>
                        <slot name="title" />
                    </template>
                </view>
                <view
                    v-if="description || cmptSlots.default"
                    class="ca-alert__description"
                    :class="{'ca-mt-12': title || cmptSlots.title}"
                >
                    <template v-if="description">
                        {{ description }}
                    </template>
                    <template v-else>
                        <slot />
                    </template>
                </view>
            </view>
            <view
                v-if="closable"
                class="ca-alert-ft"
                @click.stop="handleClose"
            >
                <template v-if="closeText">{{ closeText }}</template>
                <ca-icon
                    v-else
                    :name="closeIcon"
                />
            </view>
        </view>
    </ca-transition>
</template>

<script>
import originProps from './props'
import { defineComponent, ref, computed } from 'vue'
import crabUIMixin from '../../libs/mixins/crabui.js'
export default defineComponent({
    name: 'CaAlert',
    mixins: [crabUIMixin],
    props: originProps,
    emits: ['click', 'change', 'close'],
    setup(props, { slots }) {
        const cmptSlots = slots
        const visible = ref(true)
        const removeAlert = ref(false)
        // 注册事件句柄
        const emitEvent = uni.$ca.useEmit()
        const TYPE_CLASSES_MAP = {
            success: 'ca-success',
            warning: 'ca-warning',
            danger: 'ca-danger'
        }
        const iconClass_ = computed(() => {
            return props.icon || TYPE_CLASSES_MAP[props.type] || 'ca-info'
        })
        const titleClass_ = computed(() => {
            return props.description ? 'ca-bold' : ''
        })
        const iconSize_ = computed(() => {
            return props.iconSize || (props.description ? '40' : '32')
        })
        const alertStyle_ = computed(() => {
            return props.center
                ? {
                    alignItems: 'center'
                }
                : {}
        })
        // 点击关闭按钮
        function handleClose(e) {
            if (!props.closable) return
            visible.value = false
            emitEvent('close', e, false)
        }
        // 点击alert
        function handleClick(e) {
            emitEvent('click', e, false)
        }
        // 动画完成
        function handleChange(e) {
            removeAlert.value = e.detail
            emitEvent('change', e)
        }
        return {
            cmptSlots,
            visible,
            removeAlert,
            iconClass_,
            titleClass_,
            iconSize_,
            alertStyle_,
            handleClick,
            handleClose,
            handleChange
        }
    }
})
</script>

<style lang="scss" scoped>
.ca-alert {
    @include flex(row);
    flex: 1;
    padding: $spacing-col-base $spacing-row-base;
    border-radius: $alert-radius;
    &__title {
        font-size: 28rpx;
        color: inherit;
    }
    &__description {
        font-size: 24rpx;
        color: inherit;
    }
    &-bd {
        @include flex(column);
        padding: 0 $spacing-row-base;
    }
    &-ft {
        font-size: 28rpx;
        align-self: flex-start;
    }
    $theme-array: success, warning, info, danger;
    $alert-color-map: (
        success: $alert-success-color,
        warning: $alert-warning-color,
        info: $alert-info-color,
        danger: $alert-danger-color,
    );
    $alert-color-light-map: (
        success: $alert-success-light-color,
        warning: $alert-warning-light-color,
        info: $alert-info-light-color,
        danger: $alert-danger-light-color,
    );

    @each $theme in $theme-array {
        &--#{$theme} {
            &.is-light {
                background-color: map-get($alert-color-light-map, $theme);
                .ca-alert {
                    &-bd,
                    &-hd {
                        color: map-get($alert-color-map, $theme);
                    }
                }
            }
            &.is-dark {
                background-color: map-get($alert-color-map, $theme);
                .ca-alert {
                    &-bd,
                    &-hd {
                        color: #fff;
                    }
                }
            }
        }
    }
    &.is-light {
        .ca-alert {
            &-ft {
                color: #c0c4cc;
            }
        }
    }
    &.is-dark {
        .ca-alert {
            &-ft {
                color: #fff;
            }
        }
    }
}
</style>
