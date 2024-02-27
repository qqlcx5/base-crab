<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-11-25 18:12:44
-->
<template>
    <view class="ca-empty" :style="[customStyle]">
        <ca-icon v-if="showImg" class="ca-mb-24" :color="iconColor" :name="icon" :size="size" />
        <text class="ca-empty__text" :style="[{ color: color }, textStyle]">
            {{ text }}
        </text>
        <slot />
    </view>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
    props: {
        icon: {
            type: String,
            default: 'ca-empty'
        },
        iconColor: {
            type: String,
            default: '#eee'
        },
        showImg: {
            type: Boolean,
            default: false
        },
        size: {
            type: [String, Number],
            default: 250
        },
        text: {
            type: [String, Boolean],
            default: '暂无数据'
        },
        color: {
            type: String,
            default: '#eee'
        },
        textStyle: {
            type: [Object, String],
            default: ''
        },
        customStyle: {
            type: [Object, String],
            default: ''
        }
    }
})
</script>

<style lang="scss" scoped>
    .ca-empty {
        padding: $spacing-col-base $spacing-row-base;
        text-align: center;
        @include flex(column);
        align-items: center;

        &__text {
            font-size: $font-base;
            color: #999;
            line-height: 64rpx;
            // margin-top: 20rpx;
        }
    }
</style>
