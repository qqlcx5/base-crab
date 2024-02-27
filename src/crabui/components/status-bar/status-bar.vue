<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-12-16 22:33:07
-->
<template>
    <view
        :style="{ height: statusBarHeight }"
        class="uni-status-bar"
    >
        <slot />
    </view>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'UniStatusBar',
    setup() {
        const statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px'
        return {
            statusBarHeight
        }
    }
})
</script>

<style>
.uni-status-bar {
    height: 20px;
    width: 750rpx;
}
</style>
