<template>
    <view
        class="ca-fixed-menu"
        :class="[
            `ca-fixed-menu__${position}`,
            hasNav ? 'ca-fixed-menu__hasNav' : '',
            customClass
        ]"
    >
        <view class="ca-fixed-menu__clear">
            <view :style="[parentStyle_]" />
            <ca-status-bar v-if=" !hasNav && position ==='top'" />
            <view
                v-if="!hasTabbar && position === 'bottom'"
                class="ca-safe-area"
                :class="[ `inset-${position}` ]"
            />
        </view>
        <ca-popup
            v-model="fixedModalFlag"
            :mask="false"
            width="750rpx"
            :radius="radius"
            :height="height"
            :position="position"
            :has-nav="hasNav"
            :duration="duration"
            :show-close="showClose"
            :has-tabbar="hasTabbar"
            :z-index="zIndex"
            :bg-color="bgColor"
            :wrapper-style="wrapperStyle"
        >
            <slot />
        </ca-popup>
    </view>
</template>

<script>
import originProps from './props'
import { defineComponent, computed } from 'vue'
import { addUnit } from '../../libs/utils/tools.js'
import { useVModel } from '../../libs/utils/useCore.js'
import crabUIMixin from '../../libs/mixins/crabui.js'
export default defineComponent({
    mixins: [crabUIMixin],
    props: originProps,
    setup(props) {
        const fixedModalFlag = useVModel()

        const zeroList = ['0rpx', '0', '0px', 'null', 'false', 'undefined']

        // 组件浮动高度
        const height_ = computed(() => {
            const height = addUnit(props.height)
            const isZero = zeroList.includes(String(height))
            return isZero ? '0px' : height
        })

        // 清空组件的高度
        const fixedHeight_ = computed(() => {
            const height = props.fixedHeight === 'inherit' ? height_.value : addUnit(props.fixedHeight)
            const isZero = zeroList.includes(String(height))
            return isZero ? '0px' : height
        })
        // 浮动样式
        const parentStyle_ = computed(() => {
            return {
                height: fixedHeight_.value
            }
        })

        return {
            fixedModalFlag,
            parentStyle_
        }
    }
})
</script>

<style lang="scss">
@mixin fixedPadding($duration: top, $h5default: 44px) {
    /* #ifdef H5 */
    @include iosSafeArea(padding-#{$duration}, $h5default, $duration);
    /* #endif */
    /* #ifndef H5 */
    @include iosSafeArea(padding-#{$duration}, 0px, $duration);
    /* #endif */
}
.ca-fixed-menu {
    ::v-deep .ca-popup-hd {
        box-sizing: content-box;
    }
    &__top {
        ::v-deep .ca-popup.is-top {
            bottom: auto !important;
        }
    }
    &__bottom {
        ::v-deep .ca-popup.is-bottom {
            top: auto !important;
        }
    }

    &__hasNav {
        // #ifdef H5
        ::v-deep .ca-popup-bd--top {
            top: 44px !important;
        }
        // #endif
    }

    &--active {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
