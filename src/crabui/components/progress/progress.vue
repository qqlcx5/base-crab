<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2022-01-16 15:45:51
-->
<template>
  <view
    class="ca-progress"
    :style="[strokeParentStyle_]"
  >
    <view
      class="ca-progress-bar"
      :style="[strokeStyle_]"
    >
      <template v-if="showText">{{ percent }}%</template>
      <slot />
    </view>
  </view>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { addUnit } from '../../libs/utils/tools.js'

export default defineComponent({
    props: {
        type: {
            type: String,
            default: 'line'
        },
        // 进度线条的宽度
        strokeWidth: {
            type: Number,
            default: 24
        },
        // 显示的进度数字颜色
        color: {
            type: String,
            default: '#fff'
        },
        // 进度线条的颜色 - 渐变色仅支持线型：line
        strokeColor: {
            type: String,
            default: '#e9ecef'
        },
        // 进度线条的颜色 - 渐变色仅支持线型：line
        strokeActiveColor: {
            type: String,
            default: '#0d6efd'
        },
        // 用于绘制线条两端的样式 - 可选值 round - 向线条的两端添加半圆形线帽、square - 向线条的两端添加正方形线帽
        strokeShape: {
            type: String,
            default: 'round'
        },
        percent: {
            type: Number,
            default: 0
        },
        showText: {
            type: Boolean,
            default: true
        },
        // 文字显示位置，可选值：left - 左侧  center - 居中展示 right - 右侧展示
        textAlign: {
            type: String,
            default: 'center'
        }
    },
    setup(props) {
        const strokeStyle_ = computed(() => {
            return {
                borderRadius: props.strokeShape === 'round' ? `calc(${addUnit(props.strokeWidth)} / 2)` : 0,
                height: addUnit(props.strokeWidth),
                width: `${Math.floor(props.percent)}%`,
                backgroundColor: props.strokeActiveColor,
                color: props.color,
                justifyContent: props.textAlign === 'left' ? 'flex-star' : props.textAlign === 'right' ? 'flex-end' : props.textAlign
            }
        })
        const strokeParentStyle_ = computed(() => {
            return {
                borderRadius: strokeStyle_.value.borderRadius,
                height: addUnit(props.strokeWidth),
                backgroundColor: props.strokeColor
            }
        })
        return {
            strokeStyle_,
            strokeParentStyle_
        }
    }
})
</script>

<style lang="scss">
.ca-progress {
    @include flex;
    flex: 1;
    &-bar {
        @include tst(width, 0.6s, ease);
        @include flex(row);
        align-items: center;
        overflow: hidden;
        white-space: nowrap;
    }
}
</style>
