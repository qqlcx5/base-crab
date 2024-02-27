<template>
    <view
        v-if="popupValue.outer"
        hover-stop-propagation
        class="ca-popup"
        :class="[`is-${position}`,
                 zoom_ ? 'is-zoom' : '', popupValue.inner ? 'is-visible' : '', fixed ? 'is-fixed' : 'is-relative',
                 hasTabbar ? 'has-tabbar' : '', customClass]"
        :style="[modalStyle_]"
    >
        <ca-mask
            v-if="mask && fixed"
            :show="popupValue.inner"
            :z-index="1"
            :maskabled="maskabled"
            :duration="duration * 0.8"
            :bg-color="maskBgColor"
            @click="maskClose"
        />
        <view
            class="ca-popup-bd"
            :style="[childStyle_, wrapperStyle]"
            @click="contentClick"
        >
            <ca-status-bar v-if="custom_ && fixed && showStatusBar" />
            <view
                v-if="showClose"
                class="ca-popup__close"
                :class="[`ca-popup__close--${closePos}`]"
            >
                <ca-icon
                    v-if="showClose"
                    name="pop-guanbi_dankuang"
                    :color="closeColor"
                    :size="closeSize"
                    @click="close"
                />
            </view>
            <view
                v-if="!hasTabbar && clearSafeArea && position === 'top' && fixed"
                class="ca-safe-area inset-bottom"
            />
            <view
                class="ca-popup-bd-body"
                :style="[contentStyle_, contentStyle]"
            >
                <slot />
            </view>
            <view
                v-if="!hasTabbar && clearSafeArea && position === 'bottom' && fixed"
                class="ca-safe-area inset-bottom"
            />
        </view>
    </view>
</template>

<script>
import props from './props'
import { defineComponent, computed, ref, watch, nextTick } from 'vue'
import { addUnit } from '../../libs/utils/tools.js'
import { useVModel, useEmit } from '../../libs/utils/useCore.js'
import crabUIMixin from '../../libs/mixins/crabui.js'
export default defineComponent({
    name: 'CaPopup',
    mixins: [crabUIMixin],
    props,
    emits: ['change', 'opened', 'closed', 'contentClick', 'update:modelValue', 'state'],
    setup(props) {
        let timer = null
        const emitEvent = useEmit()
        const visible = ref(props.modelValue)
        // 双向绑定
        const modelValue = useVModel()

        const popupValue = ref({
            outer: !props.fixed,
            inner: false
        })

        modelValue.value && open()

        watch(modelValue, (value) => {
            emitEvent('state', value ? 'opened' : 'closed')
            value ? open() : close()
            if (value) {
                emitEvent('opened')
                visible.value = true
            } else {
                emitEvent('closed')
            }
        })

        watch(() => popupValue.value.inner, (value) => {
            setTimeout(() => {
                !value && (visible.value = false)
            }, props.duration)
        })

        const modalStyle_ = computed(() => {
            return {
                zIndex: visible.value ? props.zIndex : -1,
                transitionDuration: `${props.duration}ms`
            }
        })

        function open() {
            change('outer', 'inner', true)
        }

        function close() {
            change('inner', 'outer', false)
        }

        // 内容点击
        function contentClick(e) {
            emitEvent('contentClick', e, false)
        }
        // 点击阴影关闭
        function maskClose() {
            if (!props.maskabled) return
            close()
        }
        function change(pro1, pro2, status) {
            popupValue.value[pro1] = status
            if (props.duration <= 0) {
                popupValue.value[pro2] = status
                return
            } else {
                popupValue.value[pro2] = !status
            }
            // 先清空延时函数
            if (timer) {
                clearTimeout(timer)
                timer = null
            }
            if (status) {
                modelValue.value = true
                // #ifdef H5 || MP
                timer = setTimeout(() => {
                    popupValue.value[pro2] = status
                    timer = null
                }, 50)
                // #endif
                // #ifndef H5 || MP
                nextTick(() => {
                    popupValue.value[pro2] = status
                })
                // #endif
            } else {
                timer = setTimeout(() => {
                    props.destroyEle && (popupValue.value[pro2] = status)
                    modelValue.value = false
                    timer = null
                }, props.duration)
            }
        }
        // 各种情况的偏移值
        const translate3dMap = new Map([
            ['top', '0px, -100%, 0px'],
            ['right', '100%, 0px, 0px'],
            ['bottom', '0px, 100%, 0px'],
            ['left', '-100%, 0px, 0px']
        ])

        const custom_ = computed(() => {
            const needClear = ['top', 'left', 'right']
            return !props.hasNav && needClear.includes(props.position)
        })
        const zoom_ = computed(() => {
            return props.zoom && props.position === 'center'
        })
        const contentStyle_ = computed(() => {
            return {
                height: addUnit(props.height)
            }
        })
        const childStyle_ = computed(() => {
            const otherStyle = {}
            !['top', 'bottom', 'cover'].includes(props.position) && (otherStyle.width = addUnit(props.width))
            props.position !== 'center' && props.fixed && (otherStyle.transform = `translate3d(${translate3dMap.get(props.position)})`)
            return {
                backgroundColor: props.bgColor,
                borderRadius: addUnit(props.radius),
                overflow: 'hidden',
                ...otherStyle
            }
        })
        return {
            popupValue,
            modelValue,
            custom_,
            zoom_,
            contentStyle_,
            childStyle_,
            modalStyle_,
            contentClick,
            maskClose,
            close
        }
    }
})
</script>

    <style lang="scss" scoped>
// 弹窗公用样式
.ca-popup {
    // overflow: hidden;
    flex: 1;
    min-width: 0;

    &.is-relative {
        position: relative;
    }

    &.is-fixed {
        @include fixed(0, 0, 0, 0);
        z-index: -1;
        opacity: 0;
        pointer-events: none;

        & > .ca-popup {
            &-bd {
                position: relative;
                z-index: 10;
                transition-delay: 0ms;
                transition-timing-function: linear;
                transition-duration: 200ms;
                transition-property: transform, opacity, top;

                &-body {
                    @include flex(column);
                }
            }
        }

        &.is-center {
            & > .ca-popup-bd {
                /* #ifndef APP-PLUS-NVUE */
                max-width: 600rpx;
                /* #endif */
            }
        }

        &.is-top {
            @include fixed(0, 0, null, 0);
        }

        &.is-bottom {
            @include fixed(null, 0, 0, 0);

            /* #ifdef H5 */
            &.has-tabbar {
                @include iosSafeArea(bottom, 50px, bottom);
            }
            /* #endif */
        }

        &.is-left {
            @include fixed(0, null, 0, 0);
            @include iosSafeArea(padding, 0px, bottom, bottom);
        }

        &.is-right {
            @include fixed(0, 0, 0, null);
            @include iosSafeArea(padding, 0px, bottom, bottom);
            .ca-popup-bd {
                height: 100%;
                margin-left: auto;
                margin-right: 0;
            }
        }

        &.is-cover {
            @include fixed(0, 0, 0, 0);

            /* #ifdef H5 */
            &.has-tabbar {
                @include iosSafeArea(bottom, 50px, bottom);
            }
            /* #endif */
        }

        &.is-visible {
            opacity: 1;
        }
    }

    &-ft {
        position: relative;
        z-index: 2;
    }

    &.is-visible {
        pointer-events: auto;
        z-index: 999;
    }

    &.is-center {
        @include flex;
        align-items: center;
        justify-content: center;
        @include tst;

        &.is-zoom {
            transform: scale(1.1);
        }

        &.is-visible {
            transform: scale(1) translateZ(0) !important;
        }
    }

    &.is-bottom {
        & > .ca-popup-bd {
            @include abs(null, 0, 0, 0);
        }
    }

    &.is-top {
        & > .ca-popup-bd {
            @include abs(0, 0, null, 0);
        }
    }

    &.is-left,
    &.is-right,
    &.is-bottom,
    &.is-top {
        &.is-visible {
            & > .ca-popup-bd {
                transform: translate3d(0px, 0px, 0px) !important;
            }
        }
    }

    &__close {
        z-index: 2;

        &--top-right {
            @include abs($spacing-col-lg, $spacing-row-base * 2);
        }

        &--top-left {
            @include abs($spacing-col-lg, null, null, $spacing-row-base * 2);
        }

        &--bottom-right {
            @include abs(null, $spacing-col-lg, $spacing-row-base * 2);
        }

        &--bottom-left {
            @include abs(null, null, $spacing-col-lg, $spacing-row-base * 2);
        }
    }
}
</style>
