<!--
 * @Author: sanshui
 * @Date: 2022-06-23 16:59:39
 * @LastEditors: sanshui
 * @LastEditTime: 2022-06-24 17:00:38
 * @Description: For better maintenance, please fill in the document description carefully, thank you ~
-->
<template>
    <view
        class="ca-badge"
        :class="{'ca-badge--dot': dot}"
    >
        <template v-if="!dot">
            {{ value }}
        </template>
    </view>
</template>

<script>
import { defineComponent } from 'vue'
import crabUIMixin from '../../libs/mixins/crabui.js'

export default defineComponent({
    name: 'CaBadge',
    mixins: [crabUIMixin],
    props: {
        dot: {
            type: Boolean,
            default: false
        },
        value: {
            type: [Number, String],
            default: 0
        }
    }
})
</script>

<style lang="scss">
.ca-badge {
    @include abs(0, 0);
    transform: translate(50%, -50%);
    line-height: 1.2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: $badge-dot-color;
    min-width: calc(1.2 * $badge-dot-font-size);
    padding: $badge-dot-padding;
    font-size: $badge-dot-font-size;
    background-color: $badge-dot-background-color;
    border-radius: calc(1.5 * $badge-dot-font-size);
    &--dot {
        border-radius: 50%;
        width: $badge-dot-size;
        height: $badge-dot-size;
        padding: 0;
        min-width: 0;
    }
}
</style>
