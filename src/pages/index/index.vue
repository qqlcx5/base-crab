<template>
    <view class="ca-height-full ca-flex ca-flex-column">
        <text class="ca-fs-60 ca-primary">欢迎来到CrabUI</text>
        <view>
            <ca-cell-group>
                <ca-cell title="Settings" icon="ca-warning" arrow @click="handleTo" />
            </ca-cell-group>
        </view>
    </view>
</template>
<script setup>
const { jump } = uni.$ca.useRouter()
const handleTo = () => {
    console.log('跳转到设置页面')
    jump('cell')
}
</script>
<style>
page {
    height: 100vh;
}
</style>
