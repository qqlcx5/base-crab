<template>
    <ca-popup v-model="showPop" position="cover" bg-color="transparent">
        <view class="dark" @click="darkClick">
            <view class="dark-title ca-primary">点击右上角 选择在浏览器中打开</view>
            <view class="dark-img">
                <ca-image :src="arrow" width="240" mode="widthFix" />
            </view>
        </view>
    </ca-popup>
</template>

<script setup>
import arrow from '@/static/share/arrows.png'
defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})
const showPop = uni.$ca.useVModel()

const darkClick = () => {
    showPop.value = false
}
</script>

<style lang="scss" scoped>
.dark {
    height: 100vh;
  &-title {
    @include abs(86px, 112px);
  }
  &-img {
    @include abs(0, 0);
  }
}
</style>
