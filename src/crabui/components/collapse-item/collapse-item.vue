<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2022-02-17 16:21:27
-->
<template>
    <view class="ca-collapse-item">
        <view
            class="ca-collapse-item-hd ca-flex ca-justify-between"
            @click="handleClick"
        >
            <view class="ca-flex-1 ca-ellipsis-1">{{ title }}</view>
            <ca-icon
                name="ca-arrow-right"
                :rotate="visible ? 90 : 0"
            />
        </view>
        <view
            ref="animation"
            class="ca-collapse-item-bd"
            :animation="animationData"
        >
            <view
                :id="uid"
                :ref="uid"
                class="ca-collapse-item-bd__wraper"
            >
                <slot v-if="$slots.default" />
                <text v-else>{{ description }}</text>
            </view>
        </view>
        <view
            v-if="border_"
            class="ca-line"
        />
    </view>
</template>

<script>
import { defineComponent, ref, computed, onBeforeUnmount, onMounted, watch, getCurrentInstance, nextTick } from 'vue'
import { useParent, useEmit, useProps } from '../../libs/utils/useCore.js'
import { getRect, registerEvent } from '../../libs/utils/tools.js'

// #ifdef APP-NVUE
const animationPlugin = uni.requireNativePlugin('animation')
// #endif
export default defineComponent({
    name: 'CaCollapseItem',
    props: {
        title: {
            type: String,
            default: ''
        },
        description: {
            type: String,
            default: ''
        },
        border: {
            type: Boolean,
            default: true
        }
    },
    setup() {
        const getProps = useProps('CrabCellGroup')
        const collapseItemIndex = ref(-1)
        const uid = uni.$ca.guuid()
        const border_ = computed(() => {
            return getProps('border', true)
        })
        // 把自身绑定给上级
        const parent = useParent('CrabCollapse')
        if (parent) {
            parent.collapseItems = [...parent.collapseItems, {
                uid,
                setIndex
            }]
            // 组件卸载的话 要移除collapseItems
            onBeforeUnmount(() => {
                parent.collapseItems = parent.collapseItems.filter(o => o.uid !== uid)
            })
        }
        // 子节点是否可见
        const visible = computed(() => {
            return parent.collapseValue === collapseItemIndex.value
        })
        const { proxy } = getCurrentInstance()
        const animationData = ref({})
        let animating = false
        onMounted(() => {
            watch(visible, (val) => {
                nextTick(() => {
                    setTimeout(() => {
                        startAnimate()
                    }, 40)
                })
            }, {
                immediate: true
            })
        })
        async function startAnimate() {
            const show = visible.value
            let height = 0
            if (show) {
                let selecter = `#${uid}`
                // #ifdef APP-NVUE
                selecter = uid
                // #endif
                const rect = await getRect(selecter, {}, proxy)
                height = rect.height
            }
            animating = true
            // #ifdef APP-NVUE
            const ref = proxy.$refs.animation.ref

            animationPlugin.transition(ref, {
                styles: {
                    height: `${height}px`
                },
                duration: 300,
                // 必须设置为true，否则会到面板收起或展开时，页面其他元素不会随之调整它们的布局
                needLayout: true,
                timingFunction: 'ease-in-out'
            }, () => {
                animating = false
            })
            // #endif

            // #ifndef APP-NVUE
            const animation = uni.createAnimation({
                timingFunction: 'ease-in-out'
            })
            animation
                .height(height)
                .step({
                    duration: 300
                })
                .step()
            // 导出动画数据给面板的animationData值
            animationData.value = animation.export()
            // 标识动画结束
            uni.$ca.sleep(300).then(() => {
                animating = false
            })
            // #endif
        }
        function setIndex(index) {
            collapseItemIndex.value = index
        }
        // 注册订阅器
        const regEvent = registerEvent()
        // 注册事件句柄
        const emitEvent = useEmit()
        function handleClick() {
            if (animating) return
            regEvent && regEvent.$emit('CrabCollapseItem:click', {
                type: 'click',
                detail: {
                    value: collapseItemIndex.value
                }
            })
            emitEvent('click', collapseItemIndex)
        }
        function handleChange(e) {
            console.log(e)
        }
        return {
            uid,
            visible,
            border_,
            handleChange,
            handleClick,
            animationData
        }
    }
})
</script>

<style lang="scss">
.ca-collapse-item {
    overflow: hidden;
    &-hd {
        padding: $collapse-item-padding;
    }
    &-bd {
        will-change: height;
        overflow: hidden;
        &__wraper {
            padding-bottom: $spacing-row-lg;
        }
    }
}
</style>
