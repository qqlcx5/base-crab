<!--
 * @Author: sanshui
 * @Date: 2022-05-09 10:11:46
 * @LastEditors: sanshui
 * @LastEditTime: 2022-05-30 11:40:22
 * @Description: For better maintenance, please fill in the document description carefully, thank you ~
-->
<template>
    <view>
        <slot />
    </view>
</template>
<script>
import { defineComponent } from 'vue'
import { useProvideTheme } from './useTheme'
export default defineComponent({
    name: 'CaTheme',
    setup() {
        useProvideTheme()
    }
})
</script>
