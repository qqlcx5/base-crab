<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-12-14 22:09:52
 * @LastEditors: sanshui
 * @LastEditTime: 2022-05-30 10:55:43
-->
<template>
    <view
        class="ca-cell-group"
        :style="[groupStyle]"
        :class="[customClass,`ca-cell-group--${size}`]"
    >
        <slot name="title">
            <view
                v-if="title"
                class="ca-cell-group__title"
                :style="[titleStyle]"
            >
                {{ title }}
            </view>
        </slot>
        <view
            class="ca-cell-group__content"
            :style="[contentStyle]"
        >
            <slot />
        </view>
    </view>
</template>

<script>
import { defineComponent } from 'vue'
import props from './props'
import { useCaChildren } from '../../libs/utils/useCore.js'
import crabUIMixin from '../../libs/mixins/crabui.js'

export default defineComponent({
    name: 'CaCellGroup',
    mixins: [crabUIMixin],
    props,
    setup(props) {
        const { caChildren } = useCaChildren()
        return {
            caChildren
        }
    }
})
</script>

<style lang="scss">
.ca-cell-group {
    overflow: hidden;
    &__title {
        padding: $cell-padding;
        color: rgb(136, 136, 136);
        font-size: $font-base;
    }
    &__content {
        @include flex(column);
        background-color: #fff;
        overflow: hidden;
    }
    &--large {
        .ca-cell-group {
            &__title {
                padding: $cell-padding-lg;
                font-size: $font-lg;
            }
        }
    }
}
</style>
