<template>
    <view>
        <ca-cell-group
            v-for="(item, index) in pageList" :key="index" :icon-style="{
                color: '#07c160',
                fontSize: '48rpx'
            }" :title="item.groupName">
            <ca-cell
                v-for="(item1, index1) in item.list" :key="index1"
                :title="item1.title" :to="item1.path" :icon="item1.icon"
                arrow
            />
        </ca-cell-group>
    </view>
</template>

<script setup>
import { ref } from 'vue'
import list from './index.config.js'
const pageList = ref(list)
</script>
