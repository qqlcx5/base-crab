<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-12-28 15:41:09
-->
<template>
    <view
        class="ca-keyboard-box"
        :class="[mask_ ? '' : 'ca-keyboard-box--through']"
    >
        <ca-popup
            v-model="popupValue"
            bg-color="transparent"
            position="bottom"
            :mask="mask_"
            :content-style="contentStyle_"
        >
            <view
                class="ca-keyboard"
                :class="[
                    `ca-keyboard--${mode}`,
                    `ca-keyboard--size${keyLength_}`,
                    isSimple_ ? 'ca-keyboard--simple' : '',
                ]"
            >
                <view
                    class="ca-keyboard-clipboard ca-flex ca-align-center ca-justify-center"
                    :class="[
                        clipboardData.length ? 'ca-keyboard-clipboard--active' : ''
                    ]"
                    @click="handleClickClipboard"
                >
                    {{ clipboardData }}
                </view>
                <view class="ca-keyboard-hd ca-flex">
                    <view
                        class="ca-keyboard-hd__left ca-flex ca-align-center"
                        @click="handleClick($event, 'cancel')"
                    >
                        <slot name="cancel" />
                        <text
                            v-if="!$slots.cancel && showCancel"
                            class="ca-ellipsis-1"
                            :style="{
                                color: cancelColor
                            }"
                        >
                            {{ cancelText }}
                        </text>
                    </view>
                    <view
                        class="ca-keyboard-hd__middle ca-flex ca-flex-1 ca-align-center ca-justify-center"
                        :style="hdMiddleStyle_"
                    >
                        <template v-if="showCodeInput">
                            <ca-code-input
                                v-model="codeInputValue"
                                :disabled="codeInputProps_.disabled"
                                :mode="codeInputProps_.mode"
                                :border="codeInputProps_.border"
                                :maxlength="codeInputProps_.maxlength"
                                :dotted="codeInputProps_.dotted"
                                :focus="codeInputProps_.focus"
                                :color="codeInputProps_.color"
                                :font-size="codeInputProps_.fontSize"
                                :size="codeInputProps_.size"
                                :bold="codeInputProps_.bold"
                                :border-color="codeInputProps_.borderColor"
                                :border-active-color="codeInputProps_.borderActiveColor"
                                :space="codeInputProps_.space"
                                :radius="codeInputProps_.radius"
                                animation="shine"
                                :animation-color="codeInputProps_.animationColor"
                                @cursor="handleCursor"
                            />
                        </template>
                        <ca-icon
                            v-else
                            name="ca-arrow-right"
                            size="36"
                            color="#acafb6"
                            rotate="90deg"
                            @click="handleClick($event, 'close')"
                        />
                    </view>
                    <view
                        class="ca-keyboard-hd__right ca-flex ca-align-center ca-justify-end"
                        @click="handleClick($event, 'submit')"
                    >
                        <slot name="submit" />
                        <text
                            v-if="!$slots.submit && showSubmit"
                            class="ca-ellipsis-1"
                            :style="{
                                color: submitColor
                            }"
                        >
                            {{ submitText }}
                        </text>
                    </view>
                </view>
                <view class="ca-keyboard-bd ca-flex">
                    <view
                        v-if="!isSimple_ && keyboardKeys.left && keyboardKeys.left.length"
                        class="ca-keyboard-bd__left"
                    />
                    <view
                        v-if="middle_"
                        class="ca-keyboard-bd__middle ca-flex ca-flex-wrap"
                    >
                        <template v-if="['idcard', 'number'].includes(mode)">
                            <view
                                v-for="(item, index) in middle_"
                                :key="index"
                                class="ca-keyboard-bd__item"
                            >
                                <keyboard-number
                                    :config="item"
                                    @choose="handleKeyClick"
                                />
                            </view>
                        </template>
                        <template v-if="mode === 'car'">
                            <view
                                v-for="(item, index) in middle_"
                                :key="index"
                                class="ca-keyboard-bd__item"
                                :class="[
                                    `ca-keyboard-bd__item--${item.type}`
                                ]"
                            >
                                <keyboard-car
                                    :active="keyboardTabIndex"
                                    :config="item"
                                    @choose="handleKeyClick"
                                />
                            </view>
                        </template>
                    </view>
                    <view
                        v-if="!isSimple_ && keyboardKeys.right && keyboardKeys.right.length"
                        class="ca-keyboard-bd__right"
                    >
                        <view
                            v-for="(item, index) in keyboardKeys.right"
                            :key="index"
                            class="ca-keyboard-bd__item"
                        >
                            <keyboard-number
                                :config="item"
                                @choose="handleKeyClick"
                            />
                        </view>
                    </view>
                </view>
            </view>
        </ca-popup>
    </view>
</template>

<script>
import { defineComponent, computed, getCurrentInstance, ref, watch } from 'vue'
import { useVModel, useEmit } from '../../libs/utils/useCore.js'
import keyboardKeyMaps, { deleteKey, getKeyItem } from './keyboardKeyMaps.js'
import { scrambleArray, getVarType, getParentFirstCarbUI, registerEvent, bindEvent, addUnit, throttle, deepClone } from '../../libs/utils/tools.js'

import keyboardNumber from './keyboard-number.vue'
import keyboardCar from './keyboard-car.vue'

export default defineComponent({
    name: 'CrabKeyboard',
    components: { keyboardNumber, keyboardCar },
    props: {
        mode: {
            type: String,
            default: 'number'
        },
        modelValue: {
            type: Boolean,
            default: false
        },
        // 是否显示取消
        showCancel: {
            type: Boolean,
            default: true
        },
        // 取消文字，最多4个字符
        cancelText: {
            type: String,
            default: '取消'
        },
        cancelColor: {
            type: String,
            default: '#acafb6'
        },
        showSubmit: {
            type: Boolean,
            default: true
        },
        submitText: {
            type: String,
            default: '确定'
        },
        submitColor: {
            type: String,
            default: '#4fa5e1'
        },
        // 是否显示"."按键，只在mode=number时有效
        showDotted: {
            type: Boolean,
            default: true
        },
        // 开启水波特效
        ripple: {
            type: Boolean,
            default: true
        },
        // 是否打乱键盘按键的顺序，开启了打乱顺序，simple属性失效
        random: {
            type: Boolean,
            default: false
        },
        // 简单模式,键盘上没有清空跟提交按钮,mode = car模式下建议设置为true，不然会很挤
        simple: {
            type: Boolean,
            default: true
        },
        // 蒙层，去掉蒙层，键盘以上的区域会穿透点击
        mask: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        // 键盘的键帽
        const keyboardKeys = ref({})
        // 获取最近的一个crab组件，用于跟CodeInput做关联
        const { proxy } = getCurrentInstance()
        const firstCarbUIParent = getParentFirstCarbUI(proxy)
        // 时间句柄
        const emitEvent = useEmit()
        // 键盘的中英切换的值
        const keyboardTabIndex = ref(0)
        // 键盘的输出值
        const codeInputValue = ref('')
        // 剪切板内容
        const clipboardData = ref('')
        // 键盘高度
        const height = addUnit(580)
        // 这边要继承上游CodeInput的初始值，保证内外设置一样
        const codeInputProps_ = computed(() => {
            return firstCarbUIParent?.$props || {}
        })
        // 监听输入框变化，这边要对应修改
        watch(codeInputProps_, (val) => {
            codeInputValue.value = val.modelValue
        }, {
            deep: true,
            immediate: true
        })
        // 键盘上是否要显示CodeInput
        const showCodeInput = computed(() => {
            return firstCarbUIParent?.$options?.name === 'CrabCodeInput' && codeInputProps_.value.linkage
        })
        // 展示区域做缩放，以确保所有的值都能被看见
        const hdMiddleStyle_ = computed(() => {
            const maxlength = codeInputProps_.value.maxlength
            const scale = parseInt((maxlength <= 6 ? 1 : 6 / maxlength) * 100) / 100
            return {
                transform: `scale(${scale})`
            }
        })
        // 是否显示蒙层
        const mask_ = computed(() => {
            return showCodeInput.value || props.mask
        })
        // 是否是简单模式
        const isSimple_ = computed(() => {
            return props.simple
        })
        // 键盘的弹窗显示与隐藏
        const popupValue = useVModel('modelValue', (value) => {
            emitEvent('keyboardheightchange', {
                height: value ? height.value : 0
            })
            if (value) {
                keyboardKeys.value = getKeyboardKey()
                // #ifndef H5
                uni.getClipboardData({
                    success: (res) => {
                        // 格式一致才会设置剪切板的值
                        if (res.data && uni.$ca.validate(props.mode, res.data).validate) {
                            throttle(() => {
                                clipboardData.value = res.data
                                throttle(clearClipboardData, 5000)
                            }, 1000)
                        }
                    }
                })
                // #endif
            } else {
                clearClipboardData()
            }
        })
        // 键盘的背景颜色
        const contentStyle_ = computed(() => {
            const contentStyle = {
                backgroundColor: '#e2e3e7'
            }
            if (clipboardData.value.length) {
                contentStyle.marginTop = '100rpx'
            }
            return contentStyle
        })

        // 上下游即指CrabCodeInput  上游 -  键盘外  下游 - 键盘内
        // 注册订阅器
        const regEvent = registerEvent()
        // 注册发布器
        const eventHandle = bindEvent()
        // 下游改变了下标，这边要随手转发给上游
        eventHandle && eventHandle.$on('CrabCodeInput:cursor', (e) => {
            setTimeout(() => {
                regEvent && regEvent.$emit('CrabKeyboard:cursor', e)
            }, 30)
        })
        // 接收到上游的变化，这边要随手转发给下游
        regEvent && regEvent.$on('CrabCodeInput:cursor', (e) => {
            setTimeout(() => {
                eventHandle && eventHandle.$emit('CrabKeyboard:cursor', e)
            }, 30)
        })

        const keyboardTabs_ = computed(() => {
            if (props.mode === 'car') {
                return Object.keys(keyboardKeys.value.middle || {})
            } else {
                return []
            }
        })
        // 键盘的一些插入操作
        const middle_ = computed(() => {
            const middle = deepClone(keyboardTabs_.value.length ? keyboardKeys.value.middle[keyboardTabs_.value[keyboardTabIndex.value]] : keyboardKeys.value.middle || [])
            if (props.mode === 'car') {
                middle.splice(-(middle.length % 10), 0, getKeyItem(keyboardTabs_.value, 'tabs', 'switchTab'))
                middle.push(deleteKey)
            } else if (['number', 'idcard'].includes(props.mode)) {
                if (props.mode === 'number' && !props.showDotted) {
                    middle.forEach(o => {
                        if (o.type === 'symbol') {
                            o.operation = 'empty'
                        }
                    })
                }
                if (isSimple_.value) {
                    middle.push(deleteKey)
                }
            }
            return middle
        })

        const keyLength_ = computed(() => {
            return middle_.value.length
        })

        const handleKeyClick = ({ detail }) => {
            switch (detail.operation) {
                case 'switchTab':
                    keyboardTabIndex.value = 1 ^ keyboardTabIndex.value
                    break
                default:
                    emitEvent(detail.operation, detail.value)
                    break
            }
        }

        // 点击了验证码
        const handleClickClipboard = () => {
            const clipboardDataArr = String(clipboardData.value).split('')
            clipboardDataArr.forEach((o, i) => {
                setTimeout(() => {
                    emitEvent('change', o)
                }, 200 * i)
            })
            throttle(clearClipboardData, clipboardDataArr.length * 200)
        }

        // 清空裁剪版的内容
        function clearClipboardData() {
            clipboardData.value = ''
        }

        function handleClick(e, event) {
            popupValue.value = false
            emitEvent(event, {
                ...e,
                detail: {
                    value: codeInputValue.value
                }
            }, false)
        }

        const handleCursor = (e) => {
            emitEvent('cursor', e, false)
        }
        // 获取键帽
        function getKeyboardKey() {
            const keys = deepClone(keyboardKeyMaps.get(props.mode))
            if (props.random) {
                if (getVarType(keys.middle) === 'Array') {
                    keys.middle = scrambleArray(keys.middle)
                } else if (getVarType(keys.middle) === 'Object') {
                    Object.keys(keys.middle).forEach(o => {
                        keys.middle[o] = getVarType(keys.middle[o]) === 'Array' ? scrambleArray(keys.middle[o]) : o
                    })
                }
            }
            return keys
        }

        return {
            codeInputValue,
            mask_,
            showCodeInput,
            codeInputProps_,
            popupValue,
            keyboardKeys,
            keyboardTabIndex,
            height,
            middle_,
            keyLength_,
            isSimple_,
            hdMiddleStyle_,
            contentStyle_,
            clipboardData,
            handleKeyClick,
            handleClick,
            handleClickClipboard,
            handleCursor
        }
    }
})
</script>

<style lang="scss">
.ca-keyboard {
    position: relative;
    &-box {
        &--through {
            ::v-deep .c-modal--bottom {
                top: auto;
            }
        }
        ::v-deep .ca-code-input__num--text {
            background-color: #fff;
        }
    }
    // 剪切板内容
    &-clipboard {
        @include abs(-100rpx, 50%);
        transform: translateX(50%);
        opacity: 0;
        pointer-events: none;
        height: 70rpx;
        min-width: 150rpx;
        border-radius: 40rpx;
        padding: 0 $spacing-row-lg;
        background-color: #fff;
        box-shadow: $keyboard-box-shadow;
        color: $sub-text-color;
        @include tst;
        &--active {
            opacity: 1;
            pointer-events: auto;
        }
    }
    &-hd {
        &__left,
        &__middle,
        &__right {
            font-size: 34rpx;
            height: 80rpx;
            padding: $keyboard-spacing-base $spacing-row-lg 0;
        }
        &__left {
            padding-right: 0;
        }
        &__right {
            padding-left: 0;
        }
        &__middle {
            max-width: calc(100% - 320rpx);
        }
        &__left,
        &__right {
            font-size: 32rpx;
            width: 160rpx;
        }
    }
    &-bd {
        padding: calc($keyboard-spacing-base / 2);
        &__item {
            padding: calc($keyboard-spacing-base / 2);
        }
        &__middle {
            flex: 1;
        }
        &__left,
        &__right {
            width: 110rpx;
            .ca-keyboard-bd__item {
                width: 100% !important;
            }
        }
        &__item {
            width: 33.33333333%;
        }
    }
    &--number,
    &--idcard {
        &.ca-keyboard {
            &--size11 {
                .ca-keyboard {
                    &-bd {
                        &__item {
                            &:nth-last-of-type(1) {
                                width: 66.66666667%;
                            }
                        }
                    }
                }
            }
            &--simple {
                .ca-keyboard {
                    &-bd {
                        &__item {
                            &:nth-last-of-type(1) {
                                width: 33.33333333%;
                            }
                            &:nth-last-of-type(2) {
                                width: 66.66666667%;
                            }
                        }
                    }
                }
            }
            &--size12 {
                .ca-keyboard {
                    &-bd {
                        &__item {
                            &:nth-last-of-type(1),
                            &:nth-last-of-type(2) {
                                width: 33.33333333%;
                            }
                        }
                    }
                }
            }
        }
    }
    &--car {
        .ca-keyboard {
            &-bd {
                &__item {
                    width: 10%;
                    &--tabs,
                    &--icon {
                        width: 20%;
                    }
                }
            }
        }
    }
}
</style>
