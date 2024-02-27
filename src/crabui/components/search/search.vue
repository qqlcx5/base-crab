<template>
    <view class="ca-search">
        <slot
            v-if="showPrepend"
            name="prepend"
        >
            <view class="ca-pl-20 ca-flex ca-align-center">
                <ca-icon
                    name="ca-sousuo"
                    size="32"
                    :color="searchIconColor"
                />
            </view>
        </slot>
        <view
            class="ca-search__input ca-flex-1"
            :style="[searchStyle_]"
        >
            <ca-input
                v-model="keyword"
                :confirm-type="confirmType"
                :disabled="disabled"
                :placeholder="placeholder"
                :placeholder-style="placeholderStyle"
                :clearable="clearable"
                @click="handleClick"
                @confirm="confirmInput"
                @change="handleInput"
            />
        </view>
        <slot name="append" />
    </view>
</template>

<script>
import { defineComponent, computed, onMounted, ref } from 'vue'
import { useVModel, useEmit } from '../../libs/utils/useCore.js'
import crabUIMixin from '../../libs/mixins/crabui.js'
export default defineComponent({
    name: 'CaSearch',
    mixins: [crabUIMixin],
    props: {
        modelValue: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        showPrepend: {
            type: Boolean,
            default: true
        },
        // 可选值 square - 方形 round - 原型
        shape: {
            type: String,
            default: 'round'
        },
        // 如果设置了该属性，点击搜索框会跳转
        to: {
            type: String,
            default: ''
        },
        bgColor: {
            type: String,
            default: '#f5f6f7'
        },
        placeholder: {
            type: String,
            default: '输入搜索关键词'
        },
        placeholderStyle: {
            type: String,
            default: ''
        },
        /**
         * 是否显示清除按钮
         */
        clearable: {
            type: Boolean,
            default: false
        },
        searchIconColor: {
            type: String,
            default: '#999'
        },
        color: {
            type: String,
            default: '#333'
        },
        inputAlign: {
            type: String,
            default: 'left'
        }
    },
    emits: ['confirm', 'change', 'update:modelValue', 'click'],
    setup(props) {
        const keyword = useVModel()
        const confirmType = ref('search')
        // 注册事件句柄
        const emitEvent = useEmit()

        const searchStyle_ = computed(() => {
            return {
                backgroundColor: props.bgColor,
                borderRadius: props.shape === 'round' ? '100px' : '10rpx',
                textAlign: props.inputAlign
            }
        })
        // #ifdef H5
        onMounted(() => {
            // ios系统版本超过15会有搜索框
            if (uni.getSystemInfoSync().system.indexOf('iOS 15') !== -1) { confirmType.value = 'done' }
        })
        // #endif

        function handleClick(e) {
            if (!props.to) {
                emitEvent('click', e, false)
            }
            const pages = getCurrentPages()
            if (pages.length > 1 && props.to.indexOf(pages[pages.length - 2].route) !== -1) {
                // this.$back()
            } else {
                // this.$jump(props.to)
            }
        }
        function confirmInput(e) {
            emitEvent('confirm', keyword)
        }
        function handleInput(e) {
            emitEvent('change', keyword)
        }
        return {
            keyword,
            confirmType,
            searchStyle_,
            handleClick,
            confirmInput,
            handleInput
        }
    }
})
</script>

<style lang="scss">
.ca-search {
    @include flex(row);
    align-items: center;
    flex: 1;
    &__input {
        ::v-deep .c-input-view {
            background-color: transparent;
        }
    }
    &__before {
        padding-left: 16rpx;
    }
    &__after {
        padding-left: 24rpx;
        font-size: 28rpx;
        color: #333333;
    }
    &__before--image {
        width: 32rpx;
        height: 32rpx;
        display: block;
    }
}
</style>
