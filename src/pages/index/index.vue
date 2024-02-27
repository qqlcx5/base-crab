<template>
    <view class="ca-height-full ca-flex-ajcenter">
        <text class="ca-fs-60 ca-primary">欢迎来到CrabUI</text>
        <ca-button @click="handleTo">111</ca-button>
    </view>
</template>
<script setup>
const handleTo = () => {
    uni.navigateTo({
        url: '/pages/mine/index'
    });
};
</script>
<style>
page {
    height: 100vh;
}
</style>
