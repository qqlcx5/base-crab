<template>
    <view>
        <view class="list-wrap">
            <ca-cell-group v-for="(item, index) in list" :key="index" :title="item.groupName">
                <ca-cell
                    v-for="(item1, index1) in item.list" :key="index1" :icon-style="{ color: '#07c160' }"
                    :title="item1.title" :name="item1.path" :icon="item1.icon" @click="openPage(item1.path)" />
            </ca-cell-group>
        </view>
    </view>
</template>

<script>
import list from './components.config.js'
import { useRouter } from '@/crabui/libs/router'
let router = null
export default {
    data() {
        return {
            list
        }
    },
    methods: {
        openPage(path) {
            router.push({ path })
        }
    },
    onShow() {
        router = useRouter()
    }
}
</script>
