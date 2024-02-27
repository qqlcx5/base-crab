<template>
    <view
        class="ca-icon"
        :class="[classPrefix_, name]"
        :style="[iconStyle_]"
        @click="handleClick"
    >
        {{ icon_ }}
        <ca-badge
            v-if="dot || badge"
            :dot="dot"
            :value="badge"
        />
    </view>
</template>
<script>
import { addUnit } from '../../libs/utils/tools.js'
import icons from './icons'
import { useEmit } from '../../libs/utils/useCore.js'
import { defineComponent, computed } from 'vue'
import crabUIMixin from '../../libs/mixins/crabui.js'
// #ifdef APP-NVUE
// nvue通过weex的dom模块引入字体，相关文档地址如下：
// https://weex.apache.org/zh/docs/modules/dom.html#addrule
const fontUrl = 'https://at.alicdn.com/t/font_2303975_b3pbg3omh8r.ttf'
const domModule = weex.requireModule('dom')
domModule.addRule('fontFace', {
    fontFamily: 'crabUI',
    src: `url('${fontUrl}')`
})
// #endif

export default defineComponent({
    name: 'CaIcon',
    mixins: [crabUIMixin],
    props: {
        name: {
            type: String,
            default: ''
        },
        // 颜色
        color: {
            type: [String, Boolean],
            default: 'inherit'
        },
        // 是否显示图标右上角小红点
        dot: {
            type: Boolean,
            default: false
        },
        // icon 大小
        size: {
            type: [Number, String],
            default: 32
        },
        // 偏转角度
        rotate: {
            type: Number,
            default: 0
        },
        // 旋转
        spin: {
            type: Boolean,
            default: false
        },
        // 旋转间隔
        spinGap: {
            type: Number,
            default: 1500
        },
        badge: {
            type: [Number, String],
            default: ''
        }
    },
    emits: ['click'],
    setup(props) {
        // 通用的事件句柄
        const emitEvent = useEmit()
        const handleClick = (e) => {
            emitEvent('click', e, false)
        }
        const classPrefix_ = computed(() => {
            const prevName = props.name.split('-')[0]
            const specialPrev = {
                ca: 'crabUI',
                icon: 'iconfont'
            }
            return specialPrev[prevName] || prevName
        })

        const iconStyle_ = computed(() => {
            const fontSize = addUnit(props.size)
            // 组件样式
            const obj = {
                fontSize,
                width: fontSize,
                height: fontSize,
                color: props.color
            }
            // 组件动画
            obj.transform = `rotate(${props.rotate}deg)`
            if (props.spin) {
                obj.animation = `ca-spin ${props.spinGap}ms linear infinite`
            }
            return obj
        })
        // 通过图标名，查找对应的图标
        const icon_ = computed(() => {
            // 如果内置的图标中找不到对应的图标，就直接返回name值，因为用户可能传入的是unicode代码
            return icons[props.name] || ''
        })

        return {
            iconStyle_,
            classPrefix_,
            handleClick,
            icon_
        }
    }
})
</script>
<style lang="scss" scoped>
@import './font.css';
.ca-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: inherit;
    // 浏览器渲染引擎如何渲染字体。浏览器会在速度、清晰度、几何精度之间进行权衡。
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    position: relative;
    vertical-align: middle;
    @include tst;
}
</style>
