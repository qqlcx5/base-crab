<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-12-24 21:01:24
-->
<template>
    <view>
        <view
            class="ca-code-input"
            :style="[outStyle_]"
        >
            <view class="ca-code-input-hd">
                <view :style="[inputStyle_]">
                    <!-- input组件若不想弹出软键盘，可设置为disabled -->
                    <ca-input
                        v-model="vmodelValue"
                        class="ca-code-input__input"
                        :type="inputType"
                        :focus="inputFocus"
                        :disabled="disabled_"
                        :cursor="curCursor"
                        :maxlength="maxlength"
                        @keyboardheightchange="handleKeyboardheightchange"
                    />
                </view>
            </view>
            <!-- v-model:focus="inputFocus"
                v-model:cursor="curCursor" -->
            <view class="ca-code-input-bd">
                <view
                    v-for="(item, index) in numArr_"
                    :key="index"
                    class="ca-code-input__num"
                    :class="[
                        `ca-code-input__num--${item === '.' ? 'dotted' : 'text'}`
                    ]"
                    :style="[numStyle_(item)]"
                    @click="handleNumClick(item)"
                >
                    <template v-if="item === '.'">
                        <text
                            :style="[dottedStyle_]"
                            class="ca-code-input__dotted"
                        />
                    </template>
                    <template v-else>
                        <template v-if="vmodelValue.length > item">
                            <text
                                v-if="dotted"
                                :style="[dottedStyle_]"
                                class="ca-code-input__dotted"
                            />
                            <text
                                v-else
                                :style="[textStyle_]"
                            >
                                {{ splitNum_[item] }}
                            </text>
                        </template>
                        <text
                            v-if="border === 'bottom'"
                            class="ca-code-input__line"
                            :style="[lineStyle_(item)]"
                        />
                        <text
                            v-if="animation === 'twinkle' && inputFocus && specifyIndex === item"
                            class="ca-code-input__twinkle"
                            :style="[twinkleStyle_]"
                        />
                    </template>
                </view>
            </view>
        </view>
        <ca-keyboard
            v-if="!systemKeyboard && !disabled"
            v-model="inputFocus"
            :mode="mode === 'car' ? 'car' : 'number' "
            :show-dotted="false"
            @change="handleKeyboardChange"
            @delete="handleKeyboardDelete"
            @reset="handleKeyboardReset"
            @confirm="handleKeyboardSubmit"
            @keyboardheightchange="handleKeyboardheightchange"
        />
    </view>
</template>

<script>

import { defineComponent, ref, computed, watch, getCurrentInstance } from 'vue'
import { addUnit, registerEvent, bindEvent, getParent } from '../../libs/utils/tools.js'
import { useVModel, useEmit } from '../../libs/utils/useCore.js'

export default defineComponent({
    name: 'CaCodeInput',
    props: {
        name: {
            type: String,
            default: ''
        },
        // 是否禁止输入
        disabled: {
            type: Boolean,
            default: false
        },
        // 双向绑定的值
        modelValue: {
            type: String,
            default: ''
        },
        // 输入框模式，code - 验证码输入框  car - 车牌号输入框
        mode: {
            type: String,
            default: 'code'
        },
        // 边框类型, around-四周边框，bottom-底部边框，none-无边框
        border: {
            type: String,
            default: 'around'
        },
        // 输入字符个数
        maxlength: {
            type: Number,
            default: 4
        },
        // 使用远点填充，这边没办法自定义字符，因为特殊符号无法解决居中问题，这边扩展插槽自行处理
        dotted: {
            type: Boolean,
            default: false
        },
        // 是否自动获取焦点
        focus: {
            type: Boolean,
            default: false
        },
        // 字体颜色
        color: {
            type: String,
            default: '#333'
        },
        // 字体大小
        fontSize: {
            type: [String, Number],
            default: 32
        },
        // 输入框的大小，宽等于高
        size: {
            type: [String, Number],
            default: 70
        },
        // 字体和输入横线是否加粗
        bold: {
            type: Boolean,
            default: true
        },
        // 边框和线条颜色
        borderColor: {
            type: String,
            default: '#c8c7cc'
        },
        // 边框和线条颜色
        borderActiveColor: {
            type: String,
            default: '#c8c7cc'
        },
        // 字符间的距离
        space: {
            type: [String, Number],
            default: 8
        },
        // 边框圆角
        radius: {
            type: [String, Number],
            default: 8
        },
        // 动画类型 twinkle - 闪烁   shine - 发光(仅在border为around时生效)  none - 无动画
        animation: {
            type: String,
            default: 'twinkle'
        },
        animationColor: {
            type: String,
            default: '#007aff'
        },
        // 是否使用系统键盘，如果您输入后像动态修改某个值的话，可以设置为false，开启crab自带键盘组件
        systemKeyboard: {
            type: Boolean,
            default: true
        },
        // 仅当systemKeyboard为false时失效，输入框会显示在键盘上
        linkage: {
            type: Boolean,
            default: true
        }
    },
    setup(props) {
        const maxLen = ref(String(props.modelValue).length)
        const cursor = maxLen.value > props.maxlength ? props.maxlength : maxLen.value
        const crabCmptName = props.name ? props.name : ('CrabCodeInput' + Math.random().toString(32).substr(2))
        const inputFocus = ref(props.focus)
        const curCursor = ref(cursor - 1)
        const specifyIndex = ref(cursor)
        const parent = getParent('CrabKeyboard', getCurrentInstance().proxy)
        // 注册订阅器
        const regEvent = registerEvent()
        // 注册事件句柄
        const emitEvent = useEmit()
        // 双向绑定
        const vmodelValue = useVModel('modelValue', (value, oldValue) => {
            if (parent?.showCodeInput) return
            regEvent && regEvent.$emit('CrabCodeInput:change', {
                type: 'change',
                detail: {
                    value,
                    name: crabCmptName
                }
            })
            let len = value.length
            const oLen = oldValue ? oldValue.length : 0
            len = len > props.maxlength ? props.maxlength : len
            // 说明是复制验证码进来的，下标要跟长度一样
            const disLen = len - oLen
            if (disLen > 1) {
                specifyIndex.value = len
            } else {
                if (Math.abs(specifyIndex.value - len) === 1 && (specifyIndex.value === len || specifyIndex.value === oLen)) {
                    specifyIndex.value = len
                } else {
                    specifyIndex.value += disLen
                }
            }
        }, (value) => {
            if (value.length >= props.maxlength) {
                value.length > props.maxlength && emitEvent('input', value.substr(0, props.maxlength))
                handleSubmit(value)
            }
        })
        const disabled_ = computed(() => {
            return props.systemKeyboard ? props.disabled : true
        })
        const inputType = computed(() => {
            if (props.mode === 'code') {
                // #ifdef MP
                return 'number'
                // #endif
            }
            return 'text'
        })
        // 外层样式
        const outStyle_ = computed(() => {
            const size = addUnit(props.size)
            return {
                height: size
            }
        })
        // 拆分vmodelValue进行num填充
        const splitNum_ = computed(() => {
            const splitNum = vmodelValue.value.split('')
            if (props.fillText === null) {
                return splitNum.map(o => o.replace(/[0-9]/g, '●'))
            }
            return splitNum
        })
        // 输入框数组，必须转换成数组，部分Hbuilder版本和支付宝循环会从0开始，我们统一同数组代替差异
        const numArr_ = computed(() => {
            const arr = generateArray(0, props.maxlength - 1)
            if (props.mode === 'car') {
                arr.splice(2, 0, '.')
            }
            return arr
        })
        // 输入框样式
        const numStyle_ = computed(() => {
            return (index) => {
                const space = addUnit(props.space)
                const hasSpace = parseInt(space) > 0
                const borderRadius = addUnit(props.radius)
                const numStyle = {
                    width: outStyle_.value.height,
                    height: outStyle_.value.height,
                    color: props.color,
                    marginRight: hasSpace && index !== props.maxlength - 1 ? addUnit(props.space) : 0
                }
                if (props.border === 'around') {
                    numStyle.border = `${props.bold ? '1px' : '0.5px'} solid ${vmodelValue.length > index ? props.borderActiveColor : props.borderColor}`
                    // 输入之间有间隙
                    if (hasSpace) {
                        numStyle.borderRadius = borderRadius
                    } else {
                        if (index !== props.maxlength - 1) {
                            numStyle.borderRight = 'none'
                        }
                        if (index === 0) {
                            numStyle.borderTopLeftRadius = borderRadius
                            numStyle.borderBottomLeftRadius = borderRadius
                        }
                        if (index === props.maxlength - 1) {
                            numStyle.borderTopRightRadius = borderRadius
                            numStyle.borderBottomRightRadius = borderRadius
                        }
                    }
                    if (index === specifyIndex.value && props.animation === 'shine') {
                        numStyle.boxShadow = `0 0 12rpx 0 ${props.animationColor}`
                    }
                }
                if (index === '.') {
                    numStyle.border = 'none'
                    numStyle.width = `calc(${numStyle.width} / 3)`
                }
                return numStyle
            }
        })
        // 输入内容样式
        const textStyle_ = computed(() => {
            return {
                fontSize: addUnit(props.fontSize),
                fontWeight: props.bold ? 'bold' : 'normal'
            }
        })
        // 下边框样式
        const lineStyle_ = computed(() => {
            return (index) => {
                return {
                    width: outStyle_.value.height,
                    backgroundColor: vmodelValue.length > index ? props.borderActiveColor : props.borderColor,
                    borderRadius: addUnit(props.radius),
                    height: props.bold ? '8rpx' : '4rpx'
                }
            }
        })
        // 闪烁的样式
        const twinkleStyle_ = computed(() => {
            return {
                color: props.animationColor,
                height: addUnit(props.fontSize)
            }
        })
        // 验证码隐藏，防止用户界面看到复制的标识
        const inputStyle_ = computed(() => {
            const fontSize = parseInt(addUnit(props.fontSize))
            const transformX = `${fontSize * props.maxlength}rpx`
            return {
                transform: `translateX(-${transformX})`,
                width: `calc(100% + ${transformX})`
            }
        })
        // 填充字符样式
        const dottedStyle_ = computed(() => {
            const size = `${parseInt(addUnit(props.fontSize)) / (props.bold ? 2 : 3)}rpx`
            return {
                color: props.color,
                width: size,
                height: size
            }
        })
        // 验证码输入框点击
        const handleNumClick = (value) => {
            if (props.disabled) return
            const maxLen = vmodelValue.value.length
            value = value >= maxLen ? maxLen : value
            const curIndex = value === maxLen - 1 && maxLen !== props.maxlength ? value + 1 : value
            if (parent?.showCodeInput) {
                specifyIndex.value = curIndex
                return
            }
            // #ifdef MP
            if (props.systemKeyboard) value = props.maxlength
            // #endif
            if (props.systemKeyboard) {
                inputFocus.value = false
                // 重置游标，下次赋值才能生效
                setTimeout(() => {
                    inputFocus.value = true
                })
            } else {
                inputFocus.value = true
            }
            curCursor.value = value + 1
            specifyIndex.value = curIndex
        }
        // 提交
        function handleSubmit(value) {
            emitEvent('submit', value.substr(0, props.maxlength))
        }
        // 生成数组
        function generateArray(start, end) {
            return Array.from(new Array(end + 1).keys()).slice(start)
        }

        /** 键盘相关 start */
        const inputEvent = `${getCurrentInstance().type.name}:focus`

        // 解决多个组件在同一个页面，避免每个组件都弹出键盘 start
        uni.$on(inputEvent, (e) => {
            if (crabCmptName !== e.detail.name) {
                inputFocus.value = false
            }
        })
        // 注册事件句柄
        const eventHandle = bindEvent()
        watch([inputFocus, specifyIndex], ([fValue, sValue]) => {
            if (fValue) {
                uni.$emit(inputEvent, {
                    detail: {
                        name: crabCmptName,
                        value: fValue
                    }
                })
                // 解决多个组件在同一个页面，避免每个组件都弹出键盘 end
                // 监听焦点，向键盘推送当前游标(往下)
                eventHandle && eventHandle.$emit('CrabCodeInput:cursor', {
                    detail: {
                        value: sValue
                    }
                })
            }
            // 监听焦点，向键盘推送当前游标(往上)
            regEvent && regEvent.$emit('CrabCodeInput:cursor', {
                detail: {
                    value: sValue
                }
            })
        }, {
            immediate: !parent?.showCodeInput
        })
        regEvent && regEvent.$on('CrabKeyboard:cursor', ({ detail }) => {
            // console.log('我是来自上游的事件dd', detail.value);
            handleNumClick(detail.value)
        })
        eventHandle && eventHandle.$on('CrabKeyboard:cursor', ({ detail }) => {
            // console.log('我是来自下游的事件', detail.value);
            handleNumClick(detail.value)
        })

        // 按键改变
        const handleKeyboardChange = (e) => {
            if (vmodelValue.value.length >= props.maxlength) return
            const vmodel = vmodelValue.value.split('')
            const insertIndex = vmodel.length > specifyIndex.value ? specifyIndex.value + 1 : specifyIndex.value
            vmodel.splice(insertIndex, 0, e.detail.value)
            vmodelValue.value = vmodel.join('')
        }
        // 按键删除
        const handleKeyboardDelete = () => {
            if (specifyIndex.value === -1) return
            const vmodel = vmodelValue.value.split('')
            if (vmodel.length === 0) return
            if (specifyIndex.value >= vmodel.length) vmodel.pop()
            else vmodel.splice(specifyIndex.value, 1)
            vmodelValue.value = vmodel.join('')
        }
        // 清空内容
        const handleKeyboardReset = () => {
            vmodelValue.value = ''
        }
        // 键盘提交动作
        const handleKeyboardSubmit = () => {
            if (vmodelValue.value.length >= props.maxlength) {
                handleSubmit(vmodelValue.value)
            } else {
                console.log('位数不够')
            }
        }
        // 键盘高度发生变化
        const handleKeyboardheightchange = (e) => {
            // console.log(e);
        }
        /** 键盘相关 end */

        return {
            disabled_,
            inputType,
            curCursor,
            specifyIndex,
            inputFocus,
            vmodelValue,
            splitNum_,
            outStyle_,
            numArr_,
            numStyle_,
            lineStyle_,
            twinkleStyle_,
            textStyle_,
            dottedStyle_,
            inputStyle_,
            handleNumClick,
            handleKeyboardChange,
            handleKeyboardDelete,
            handleKeyboardReset,
            handleKeyboardSubmit,
            handleKeyboardheightchange
        }
    }
})
</script>

<style lang="scss">
.ca-code-input {
    position: relative;
    @include flex(row);
    &-hd {
        @include abs(0, 0, 0, 0);
        overflow: hidden;
        opacity: 0;
    }
    &__input {
        height: 100%;
        padding: 0;
        color: transparent;
        caret-color: transparent;
        font-size: 24rpx;
        user-select: none;
        pointer-events: none;
        z-index: -1;
    }
    &-bd {
        @include flex(row);
    }
    &__num {
        @include flex(row);
        position: relative;
        align-items: center;
        justify-content: center;
    }
    &__line {
        @include abs(null, 0, 0, 0);
    }
    &__twinkle {
        animation: twinkle 1s infinite;
        width: 4rpx;
        @include siteCenter;
        background-color: currentColor;
    }

    &__dotted {
        @include siteCenter;
        border-radius: 100%;
        background-color: currentColor;
    }

    @keyframes twinkle {
        from {
            background-color: currentColor;
        }

        to {
            background-color: transparent;
        }
    }
}
</style>
