<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-12-09 09:15:28
-->
<template>
    <view
        class="ca-ripple"
        :class="{'ca-ripple--active': rippleInfo.waveActive}"
        :style="[rippleInfo, {backgroundColor: color}]"
    />
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'CaRipple',
    props: {
        rippleInfo: {
            type: Object,
            default: () => ({})
        },
        color: {
            type: String,
            default: 'rgba(0,0,0,0.05)'
        }
    }
})
</script>

<style lang="scss" scoped>
.ca-ripple {
    z-index: 0;
    position: absolute;
    border-radius: 100%;
    background-clip: padding-box;
    pointer-events: none;
    user-select: none;
    transform: scale(0);
    opacity: 1;
    transform-origin: center;
    &--active {
        opacity: 0;
        transform: scale(2);
        transition: opacity 0.6s linear, transform 0.3s linear;
    }
}
</style>
