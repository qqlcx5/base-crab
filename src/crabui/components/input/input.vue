<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-12-17 09:00:10
-->
<template>
    <view
        class="ca-input"
        :class="[
            'ca-input--' + type,
            'ca-input--' + vilidateType,
            hint_ ? 'ca-input--hint' : '',
            disabled_ ? 'ca-input--disabled' : '',
            finishInput && (isFocus || vilidateType !== 'primary') ? 'ca-input--focus' : ''
        ]"
    >
        <view
            class="ca-input-bd ca-flex  ca-align-center"
            :style="[inputStyle]"
            @click="onClick"
        >
            <view
                v-if="$slots.prepend"
                class="ca-input-bd__left"
                :style="[prependStyle_]"
            >
                <slot name="prepend" />
            </view>
            <view
                class="ca-input-bd__middle"
                :style="[innerStyle]"
            >
                <template v-if="showInput">
                    <input
                        v-if="type !== 'textarea'"
                        ref="input"
                        class="ca-input__input"
                        :disabled="disabled_"
                        :confirm-type="confirmType"
                        :maxlength="maxlength_"
                        :hold-Keyboard="holdKeyboard"
                        :focus="isFocus"
                        :type="inputType_"
                        :value="inputValue"
                        :cursor="cursor"
                        :placeholder="placeholder_"
                        :cursor-spacing="cursorSpacing"
                        :password="password_"
                        :placeholder-class="placeholderClass"
                        :placeholder-style="placeholderStyle"
                        :selection-start="selectionStart"
                        :selection-end="selectionEnd"
                        @input="onInput"
                        @focus="onFocus"
                        @blur="onBlur"
                        @confirm="onConfirm"
                        @keyboardheightchange="onKeyboardheightchange"
                    >
                    <textarea
                        v-if="type === 'textarea'"
                        class="ca-input__textarea"
                        :style="{ 'min-height': minHeight + 'rpx' }"
                        :auto-height="autoHeight"
                        :hold-Keyboard="holdKeyboard"
                        :disabled="disabled_"
                        :confirm-type="confirmType"
                        :maxlength="maxlength_"
                        :focus="isFocus"
                        :type="inputType_"
                        :cursor="cursor"
                        :value="inputValue"
                        :placeholder="placeholder_"
                        :cursor-spacing="cursorSpacing"
                        :placeholder-class="placeholderClass"
                        :placeholder-style="placeholderStyle"
                        :selection-start="selectionStart"
                        :selection-end="selectionEnd"
                        @input="onInput"
                        @focus="onFocus"
                        @blur="onBlur"
                        @confirm="onConfirm"
                        @keyboardheightchange="onKeyboardheightchange"
                    />
                </template>
                <text
                    v-if="hint_"
                    class="ca-input__placeholder"
                    :class="{ 'ca-input__placeholder--hint': placeholderHint_ }"
                >
                    {{ placeholder }}
                </text>
                <cover-view
                    v-if="numVerification"
                    class="c-numVerification"
                >
                    {{ value.length || 0 }} /{{ maxlength_ }}
                </cover-view>
            </view>
            <view class="ca-input-bd__right">
                <view
                    class="ca-input-icon"
                    :class="[
                        type === 'select' ? 'ca-input-icon__arrows' : ''
                    ]"
                >
                    <view
                        v-if="displayable_"
                        class="ca-input-icon__item"
                        @click.stop="handleDisplay"
                    >
                        <ca-icon
                            size="32"
                            :name="showPassword ? 'ca-yanjing' : 'ca-biyan'"
                            :color="showPassword ? '#333' : '#bbb'"
                        />
                    </view>
                    <view
                        v-if="clearable_"
                        class="ca-input-icon__item"
                        @click.stop="handleClear"
                    >
                        <ca-icon
                            name="ca-danger"
                            color="#bbb"
                            size="32"
                        />
                    </view>
                    <view
                        v-if="type === 'select'"
                        class="ca-input-icon__item"
                        @click.stop="handleDisplay"
                    >
                        <ca-icon
                            size="32"
                            name="ca-arrow-right"
                            color="#bbb"
                        />
                    </view>
                </view>
                <view
                    v-if="$slots.append"
                    class="flex  ca-align-center"
                    :style="[appendStyle_]"
                >
                    <slot name="append" />
                </view>
            </view>
        </view>
        <view
            v-if="border"
            class="ca-input__line"
            :class="[
                `ca-input__line--${border}`,
                spread ? 'ca-input__line--animated' : ''
            ]"
        >
            <view class="ca-input__line--inner" />
        </view>
    </view>
</template>

<script>
import { defineComponent, computed, watch, ref, onBeforeUnmount, onMounted, nextTick } from 'vue'
import { addUnit, registerEvent } from '../../libs/utils/tools.js'
import { useVModel, useEmit, useProps, useCmptName } from '../../libs/utils/useCore.js'
import { CaFormKey } from '../../libs/utils/symbol.js'
import useFormFactor from '../../hooks/useFormFactor/index'
import props from './props'
import crabUIMixin from '../../libs/mixins/crabui.js'

export default defineComponent({
    name: 'CaInput',
    mixins: [crabUIMixin],
    props,
    emits: ['clear', 'blur', 'select', 'focus', 'update:cursor', 'update:focus', 'update:modelValue', 'change', 'cainput', 'keyboardheightchange'],
    setup(props) {
        const showPassword = ref(false)
        const showInput = ref(true)
        const vilidateType = ref('primary')
        const getProps = useProps('CaForm')
        // 兼容小程序端会触发一次下划线的动画
        const finishInput = ref(false)
        onMounted(() => {
            finishInput.value = true
        })
        const cmptName = useCmptName()
        // 注册订阅器
        const regEvent = registerEvent(CaFormKey)
        // 注册事件句柄
        const emitEvent = useEmit()

        // 双向绑定
        const inputValue = useVModel()
        // 成为表单因子，会主动推动inputValue给表单
        useFormFactor({
            name: cmptName,
            vModel: inputValue
        })

        const isFocus = useVModel('focus')
        const curCursor = useVModel('cursor', null, (e) => {
            if (e === -1) return
            isFocus.value = false
        })

        // 前一个图标的样式
        const prependStyle_ = computed(() => {
            return {
                width: addUnit(props.prependWidth),
                ...props.prependStyle
            }
        })
        // 后一个图标的样式
        const appendStyle_ = computed(() => {
            return {
                width: addUnit(props.appendWidth),
                ...props.appendStyle
            }
        })
        // 最大长度
        const maxlength_ = computed(() => formatInt(props.maxlength, 140))
        const max_ = computed(() => reservedDecimal(props.max, decimal_.value))
        // 最小值
        const min_ = computed(() => reservedDecimal(props.min, decimal_.value))
        // 输入框类型
        const inputType_ = computed(() => {
            const inputType = (props.type === 'password' ? 'text' : props.type).toLocaleLowerCase()
            return ['text', 'number', 'idcard', 'digit', 'tel', 'nickname'].includes(inputType) ? inputType : 'text'
        })
        // 小数点保留位数
        const decimal_ = computed(() => inputType_.value === 'tel' ? 0 : formatInt(props.decimal, 0))
        // 最大值
        // 清空input
        const clearable_ = computed(() => props.clearable && String(inputValue.value).length)
        // 密码可见
        const displayable_ = computed(() => props.displayable && String(inputValue.value).length)
        // 是否禁用
        const disabled_ = computed(() => props.disabled || props.type === 'select')
        // 是否是密码类型
        const password_ = computed(() => props.type === 'password' && !showPassword.value)
        // 是否使用占位符作为提示
        const hint_ = computed(() => getProps('hint', false))
        // 提示语转化
        const placeholder_ = computed(() => hint_.value ? '' : props.placeholder)
        // hint模式下置顶
        const placeholderHint_ = computed(() => hint_.value && !!(isFocus.value || String(inputValue.value).length))
        // 数据格式修改，这边要走一下校验
        watch(inputType_, () => {
            // #ifdef H5
            showInput.value = false
            // #endif
            nextTick(() => {
                // #ifdef H5
                showInput.value = true
                // #endif
                onInput({
                    detail: {
                        value: inputValue.value
                    },
                    type: 'blur'
                }, true)
            })
        })

        // 清空当前值
        function handleClear() {
            inputValue.value = ''
            emitEvent('clear')
        }

        // 卸载自身 --- 通知表单
        onBeforeUnmount(() => {
            regEvent?.$emit?.('CaFormFactor:remove', {
                detail: {
                    name: cmptName
                }
            })
        })

        function onClick(e) {
            if (e.type === 'select') {
                emitEvent('select', {
                    ...e,
                    type: 'select'
                }, false)
            }
        }

        // 密码显隐
        function handleDisplay() {
            showPassword.value = !showPassword.value
        }
        // 聚焦
        function onFocus(e) {
            isFocus.value = true
            emitEvent('focus', e, false)
        }
        // 失焦
        function onBlur(e) {
            isFocus.value = false
            onInput(e)
        }
        // 确认提交
        function onConfirm(e) {
            emitEvent('confirm', e, false)
        }
        function onKeyboardheightchange(e) {
            emitEvent('keyboardheightchange', e, false)
        }
        function onInput(e) {
            const eventType = e.type
            let { value, cursor } = e.detail
            if (cursor !== undefined) {
                curCursor.value = cursor
            }
            inputValue.value = value
            if (['number', 'digit', 'tel'].includes(inputType_.value)) {
                const valIndexOf = value.indexOf('.') + 1
                // 用户输入小数点(针对ios，安卓不会出现该问题)
                if (valIndexOf === value.length && value.length) {
                    if (decimal_.value === 0) {
                        value = parseInt(value)
                    }
                    if (eventType === 'onBlur') {
                        value = Number(value)
                    }
                } else {
                    value = /\d+(?:\.)?(?:\d*)?/.exec(value)
                    value = value ? value[0] : ''
                    // 说明有小数点
                    if (valIndexOf > 0) {
                        value !== '' && (value = reservedDecimal(value, decimal_.value))
                    }
                    if (eventType === 'onBlur') {
                        // if (Number(value) === 0) {
                        //   value = ''
                        // } else {
                        value = Number(value)
                        // }
                    }
                }
                value = isNaN(value) ? '' : value
                if (value && max_.value) {
                    value = value > max_.value ? max_.value : value
                }
                if (eventType === 'onBlur' && value) {
                    value = Math.max(value, min_.value)
                }
                if (inputType_.value === 'tel') {
                    value = String(value)
                }
            }
            nextTick(() => {
                inputValue.value = value
                emitEvent('cainput', value)
                setTimeout(() => {
                    eventType === 'onBlur' && emitEvent('blur', value)
                }, 50)
            })
        }

        function formatInt(value, defaultValue) {
            const newVal = parseInt(value)
            return isNaN(newVal) ? defaultValue : newVal
        }

        function reservedDecimal(num, fixed = 1) {
            if (!num) return 0
            num = String(num)
            const splitNum = num.split('.')
            const firstNum = splitNum[0]
            const lastNum = splitNum[1] ? String(splitNum[1]) : (new Array(fixed + 1)).join('0')
            let toFixedNum = (lastNum && lastNum.length) || 0
            toFixedNum = toFixedNum > fixed ? fixed : toFixedNum
            // toFixed会进行四舍五入 所以我们用裁剪
            return Number(firstNum + (toFixedNum > 0 ? '.' : '') + lastNum.substr(0, toFixedNum))
        }

        return {
            showPassword,
            cmptName,
            inputValue,
            showInput,
            isFocus,
            vilidateType,
            finishInput,
            // 计算属性
            inputType_,
            placeholder_,
            prependStyle_,
            appendStyle_,
            maxlength_,
            decimal_,
            max_,
            min_,
            clearable_,
            displayable_,
            disabled_,
            password_,
            placeholderHint_,
            hint_,
            // 方法
            onClick,
            handleClear,
            handleDisplay,
            onFocus,
            onBlur,
            onConfirm,
            curCursor,
            onKeyboardheightchange,
            onInput
        }
    }
})
</script>

  <style lang="scss" scoped>
.ca-input {
    position: relative;
    flex: 1;
    width: 100%;

    &--primary {
        color: $color-primary;
    }

    &--info {
        color: $color-info;
    }

    &--success {
        color: $color-success;
    }

    &--warning {
        color: $color-warning;
    }

    &--danger {
        color: $color-danger;
    }

    &--select {
        .ca-input-bd__right {
            width: 40rpx;
        }

        .ca-input-icon__arrows {
            @include abs(0, 0, 0, 0);
            z-index: 2;
            @include flex(row);
            align-items: center;
            justify-content: flex-end;
            width: 100%;
            height: auto;
        }
    }

    &__line {
        color: inherit;
        @include abs(null, 0, 0, 0);

        &--inner {
            @include tst;
        }

        &--bottom {
            background-color: $input-line-color;
            height: $input-line-size;

            .ca-input__line--inner {
                color: inherit;
                height: $input-line-inner-size;
                background-color: currentColor;
                width: 100%;
                transform: scale(0);
            }
        }

        &--around {
            z-index: 0;
            height: 100%;
            background-color: transparent;
            top: 0;
            border: $input-line-size solid $input-line-color;

            &:before,
            &:after {
                content: '';
                position: absolute;
                top: 0;
                right: 0;
                width: 0;
                height: $input-line-inner-size;
                background-color: currentColor;
                @include tst(all, 0.2s, 0.2s);
            }

            &:after {
                top: auto;
                bottom: 0;
                right: auto;
                left: 0;
                transition-delay: 0.2s;
            }

            .ca-input__line--inner {
                &:before,
                &:after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: $input-line-inner-size;
                    height: 0;
                    background-color: currentColor;
                    @include tst(all, 0.2s);
                }

                &:after {
                    left: auto;
                    right: 0;
                    top: auto;
                    bottom: 0;
                    transition-delay: 0.4s;
                }
            }
        }
    }

    &--focus {
        .ca-input {
            &__line {
                &--animated {
                    &.ca-input__line--bottom {
                        .ca-input__line--inner {
                            transform: scale(1);
                        }
                    }

                    &.ca-input__line--around {
                        &:before,
                        &:after {
                            width: 100%;
                        }

                        .ca-input__line--inner {
                            &:before,
                            &:after {
                                height: 100%;
                            }
                        }
                    }
                }
            }
        }
    }

    &-bd {
        position: relative;
        z-index: 1;
        flex: 1;

        &__left,
        &__right {
            @include flex(row);
            align-items: center;
        }

        &__middle {
            height: 100%;
            flex: 1;
            @include flex(row);
            align-items: center;
        }

        .c-numVerification {
            text-align: right;
        }

        .ca-input-placeholder {
            color: #d0cccc;
        }
    }

    &__input,
    &__textarea {
        flex: 1;
        width: 100%;
        height: 100%;
        // height: $input-height;
        // line-height: $input-height;
        font-size: $input-size;
        color: #333;
        min-height: 0;
        background-color: transparent;
    }

    &__textarea {
        height: auto;
    }

    &-icon {
        height: $input-height;
        line-height: 1;
        @include flex(row);
        align-items: center;
        position: relative;
        z-index: 3;
        cursor: pointer;

        &__item {
            & + .ca-input-icon__item {
                margin-left: $spacing-row-base;
            }
        }

        &__select {
            padding-right: $spacing-row-base;
        }
    }

    &--textarea {
        .ca-input {
            &-bd {
                &__middle {
                    height: auto;
                    min-height: $input-height;
                }
            }
        }
    }

    &--disabled {
        background-color: $input-disabled-bg;

        .ca-input {
            &__input,
            &__textarea {
                color: $input-disabled-color;
            }
        }
    }

    &--hint {
        padding-top: $input-placeholder-size;

        .ca-input {
            &__input {
                padding: 0;
            }

            &-bd {
                &__middle {
                    height: $input-hint-height;
                }
            }
        }

        &.ca-input--textarea {
            .ca-input {
                &-bd {
                    &__middle {
                        height: auto;
                    }
                }

                &__placeholder {
                    top: $input-placeholder-size;

                    &--hint {
                        top: 0;
                    }
                }
            }
        }
    }

    &__placeholder {
        padding: inherit;
        pointer-events: none;
        @include abs(50%, 0, null, 0);
        font-size: $input-placeholder-size;
        color: $input-placeholder-color;
        transform-origin: 0 0;
        transform: translateY(-50%) scale(1);
        @include tst('transform,top', 0.2s);

        &--hint {
            top: 0;
            transform: translateY(-$input-placeholder-size) scale(0.85);
        }
    }
}
</style>
