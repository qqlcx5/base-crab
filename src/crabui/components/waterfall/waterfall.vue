<template>
    <view class="ca-waterfall">
        <view
            id="ca-waterfall-left"
            class="ca-waterfall-column"
        >
            <slot
                name="left"
                :list="leftList"
            />
        </view>
        <slot name="middle" />
        <view
            id="ca-waterfall-right"
            class="ca-waterfall-column"
        >
            <slot
                name="right"
                :list="rightList"
            />
        </view>
    </view>
</template>

<script setup>
import { getCurrentInstance, onMounted, ref, watch } from 'vue'
import { deepClone, diffByObj } from '../../libs/utils/tools'

const props = defineProps({
    modelValue: {
        // 瀑布流数据
        type: Array,
        required: true,
        default: function () {
            return []
        }
    },
    // 单位ms
    addTime: {
        type: [Number, String],
        default: 100
    }
})
const leftList = ref([])
const rightList = ref([])
const tempList = ref([])
const copyFlowList = uni.$ca.useVModel()
const { proxy } = getCurrentInstance()
watch(copyFlowList, (nVal, oVal) => {
    // 取差值，即这一次数组变化新增的部分
    let startIndex = Array.isArray(oVal) && oVal.length > 0 ? oVal.length : 0
    // 说明数据清空了
    if (oVal.length > nVal.length || (oVal.length === nVal.length && diffByObj(oVal, nVal))) {
        leftList.value = []
        rightList.value = []
        tempList.value = []
        startIndex = 0
    }
    // 拼接上原有数据
    tempList.value = tempList.value.concat(deepClone(nVal.slice(startIndex)))
    splitData()
})
onMounted(() => {
    tempList.value = deepClone(copyFlowList.value)
    splitData()
})
async function splitData() {
    if (!tempList.value.length) return
    const leftRect = await uni.$ca.getRect('#ca-waterfall-left', {}, proxy)
    const rightRect = await uni.$ca.getRect('#ca-waterfall-right', {}, proxy)
    // 如果左边小于或等于右边，就添加到左边，否则添加到右边
    const item = tempList.value[0]
    // 解决多次快速上拉后，可能数据会乱的问题，因为经过上面的两个await节点查询阻塞一定时间，加上后面的定时器干扰
    // 数组可能变成[]，导致此item值可能为undefined
    if (!item) return
    if (leftRect.height < rightRect.height) {
        leftList.value.push(item)
    } else if (leftRect.height > rightRect.height) {
        rightList.value.push(item)
    } else {
        // 这里是为了保证第一和第二张添加时，左右都能有内容
        // 因为添加第一张，实际队列的高度可能还是0，这时需要根据队列元素长度判断下一个该放哪边
        if (leftList.value.length <= rightList.value.length) {
            leftList.value.push(item)
        } else {
            rightList.value.push(item)
        }
    }
    // 移除临时列表的第一项
    tempList.value.splice(0, 1)
    // 如果临时数组还有数据，继续循环
    if (tempList.value.length) {
        setTimeout(() => {
            splitData()
        }, props.addTime)
    }
}
</script>

<style lang="scss" scoped>
.ca-waterfall {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
}

.ca-waterfall-column {
    flex: 1;
}
</style>
