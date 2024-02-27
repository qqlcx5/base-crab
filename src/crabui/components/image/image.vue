<template>
    <view
        class="ca-image"
        :style="[parentStyle_]"
        @click="onClick"
    >
        <image
            v-if="src"
            :src="src"
            :style="[ style_ ]"
            lazy-load
            class="ca-image__image"
            :mode="mode"
            :show-menu-by-longpress="showMenuByLongpress"
            @load="imgLoaded"
            @error="imgError"
        />
        <text
            v-if="border"
            class="ca-image__border"
            :style="[borderStyle_]"
        />
        <view
            v-if="!loadStatus && showLoading"
            class="ca-image__icon"
        >
            <ca-loading color="#999" />
        </view>
    </view>
</template>

<script>
import { defineComponent, computed, watch, ref } from 'vue'
import { addUnit } from '../../libs/utils/tools.js'
import { useEmit } from '../../libs/utils/useCore.js'
import crabUIMixin from '../../libs/mixins/crabui.js'
import props from './props'
export default defineComponent({
    name: 'CrabImage',
    mixins: [crabUIMixin],
    props,
    setup(props) {
        const emitEvent = useEmit()
        const errorFlag = ref(false)
        const opacity = ref(0)
        const loadStatus = ref(false)
        const time = ref(0)
        const maxHeight_ = computed(() => {
            return props.maxHeight ? addUnit(props.maxHeight) : null
        })
        const size_ = computed(() => {
            return addUnit(props.size, 'rpx', 'px')
        })
        const width_ = computed(() => {
            return props.mode === 'heightFix' ? 'auto' : addUnit(props.width || size_.value, 'rpx')
        })
        const height_ = computed(() => {
            return props.mode === 'widthFix' ? 'auto' : addUnit(props.height || size_.value, 'rpx')
        })
        const style_ = computed(() => {
            let borderRadius = addUnit(props.radius)
            if (size_.value !== '100%' && props.circle) {
                borderRadius = `${Math.ceil(parseInt(size_.value))}px`
            }
            const resStyle = {
                width: width_.value,
                height: height_.value,
                borderRadius
            }
            if (props.mode === 'widthFix') {
                delete resStyle.height
            }
            if (props.mode === 'heightFix') {
                delete resStyle.width
            }
            return resStyle
        })
        const parentStyle_ = computed(() => {
            const parentStyle = {
                maxHeight: maxHeight_.value,
                backgroundColor: props.bgColor,
                height: height_.value,
                width: width_.value
            }
            if (props.isEffect) {
                parentStyle.opacity = opacity.value
                parentStyle.transition = `opacity ${time.value / 1000}s ease-in-out`
            } else {
                parentStyle.opacity = 1
            }
            if (errorFlag.value) {
                parentStyle.height = height_.value
                parentStyle.backgroundColor = props.bgColor
            }
            return parentStyle
        })
        const borderStyle_ = computed(() => {
            const borderStyle = {}
            const borderRadius = style_.value.borderRadius
            if (borderRadius) {
                // 所有边框（含单位）
                const borderArr = String(borderRadius).split(' ')
                // 所有边框转数字（不含单位）
                const borderNumberArr = borderArr.map(o => parseInt(o))
                // 所有边框的单位
                const borderUnit = borderArr.map((o, i) => o.replace(borderNumberArr[i], ''))
                borderStyle.borderRadius = borderArr.map((o, i) => parseInt(o) * 2 + borderUnit[i]).join(' ')
            }
            borderStyle.borderColor = props.borderColor
            return borderStyle
        })
        watch(loadStatus, () => {
            // 如果是不开启过渡效果，直接返回
            if (!props.isEffect) return
            time.value = 0
            // 原来opacity为1(不透明，是为了显示占位图)，改成0(透明，意味着该元素显示的是背景颜色，默认的白色)，再改成1，是为了获得过渡效果
            opacity.value = 0
            // 延时30ms，否则在浏览器H5，过渡效果无效
            setTimeout(() => {
                time.value = props.duration
                opacity.value = 1
            }, 30)
        })
        watch(() => props.src, (val) => {
            if (val && props.errSrc !== val) {
                errorFlag.value = false
                loadStatus.value = false
            }
        }, {
            immediate: true
        })

        function imgLoaded() {
            if (!loadStatus.value) {
                loadStatus.value = true
                emitEvent('load', loadStatus.value)
            }
        }
        // 图片错误一律按404处理，之后可能分清空
        function imgError(e) {
            errorFlag.value = true
            loadStatus.value = false
            setTimeout(() => {
                loadStatus.value = true
            }, 50)
        }

        function onClick(e) {
            emitEvent('click', e, false)
        }
        return {
            loadStatus,
            maxHeight_,
            size_,
            width_,
            height_,
            style_,
            parentStyle_,
            borderStyle_,
            onClick,
            imgLoaded,
            imgError
        }
    }
})
</script>

<style lang="scss" scoped>
.ca-image {
    @include flex(row);
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    opacity: 0;
    /* #ifdef H5 */
    overflow: hidden;
    /* #endif */
    position: relative;

    &__image {
        width: 100%;
        height: 100%;
    }

    &__icon {
        @include siteCenter;
        z-index: 2;
    }

    &__border {
        content: '';
        width: 198.8%;
        height: 198.8%;
        border: 1px solid rgba(0, 0, 0, 0.2);
        transform: scale(0.5, 0.5);
        position: absolute;
        top: 0;
        left: 0;
        transform-origin: 0 0;
        border-radius: 2 * $border-radius-base;
        z-index: 1;
    }
}
</style>
