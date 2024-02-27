<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2022-03-04 11:15:25
-->
<template>
    <view
        class="ca-checkbox"
        :class="{
            'ca-checkbox--disabled': disabled_
        }"
        :style="[checkboxStyle,customStyle]"
        @tap="handleLabelClick"
    >
        <view
            class="ca-checkbox__wrapper"
            @tap.stop="toggleClick"
        >
            <ca-icon
                :name="iconType"
                :size="iconSize_"
                :color="iconColor"
            />
        </view>
        <view
            v-if="$slots.default"
            class="ca-checkbox__label"
            :style="{ fontSize: labelSize_,flex: wrap ? 1 : 'auto' }"
        >
            <slot />
        </view>
    </view>
</template>

<script>
import { defineComponent, computed, watch, ref, toRaw } from 'vue'
import { addUnit, getProperty, getVarType, registerEvent, setProperty } from '../../libs/utils/tools.js'
import { useProps, useCmptName, useParent, useEmit } from '../../libs/utils/useCore.js'
import { CaFormKey, checkboxGroupKey } from '../../libs/utils/symbol.js'
import useFormFactor from '../../hooks/useFormFactor/index'
import crabUIMixin from '../../libs/mixins/crabui.js'
import props from './props'
export default defineComponent({
    name: 'CaCheckbox',
    mixins: [crabUIMixin],
    props,
    emits: ['disabled-click', 'update:modelValue', 'change'],
    setup(props) {
        const cmptName = useCmptName()
        const getProps = useProps('CaCheckboxGroup')
        // 选中最大值
        const isLimitExceeded = ref(false)
        // 注册事件句柄
        const emitEvent = useEmit()
        // 查询是否有上级
        const checkboxGroup = useParent('CaCheckboxGroup')
        // 注册订阅器
        const regEvent = registerEvent(checkboxGroup ? checkboxGroupKey : CaFormKey)
        // 选中值
        const trueValue = computed(() => checkboxGroup ? props.value : true)
        // 未选中值
        const falseValue = computed(() => {
            const valueType = getVarType(trueValue.value)
            return valueType === 'Boolean' ? false : (valueType === 'String' ? '' : 0)
        })
        // 当前是否选中
        const selfModel = ref((checkboxGroup ? props.checked : props.modelValue) ? trueValue.value : falseValue.value)
        const checkboxVModel = computed({
            get() {
                return regEvent ? regEvent.extraData.modelValue.value : (props.modelValue ?? selfModel.value)
            },
            set(val) {
                const valType = getVarType(val)
                if (checkboxGroup && valType === 'Array') {
                    // 通知CaCheckboxGroup值发生变化
                    selfModel.value = val.includes(trueValue.value) ? trueValue.value : falseValue.value
                } else {
                    const emitValue = valType === 'Object' ? getProperty(val, cmptName) : val
                    selfModel.value = emitValue
                }
            }
        })
        // 当前是否选中
        const isChecked = computed(() => {
            if (checkboxGroup) {
                return checkboxVModel.value.includes(trueValue.value)
            } else {
                return selfModel.value === trueValue.value
            }
        })
        useFormFactor({
            name: cmptName,
            vModel: selfModel,
            symbleKey: checkboxGroup ? checkboxGroupKey : CaFormKey,
            change: ({ changeFactor, resetFactor }, isReset) => {
                !checkboxGroup && emitEvent('modelValue', selfModel)
                if (isReset) {
                    resetFactor(selfModel)
                } else {
                    emitEvent('change', selfModel)
                    changeFactor(selfModel)
                }
                return true
            },
            reset: () => {
                if (isChecked.value) {
                    setValue()
                }
            },
            init: ({ initFactor }) => {
                if (checkboxGroup) {
                    selfModel.value === trueValue.value && initFactor(selfModel)
                } else {
                    initFactor(selfModel)
                }
                return true
            }
        })
        // 监听本身的checked值
        watch(() => props.checked, (value) => {
            if (value === isChecked.value) return
            setValue()
        })
        // 是否禁止点击
        const disabled_ = computed(() => {
            return getProps('disabled', false)
        })
        // 是否禁用label点击
        const labelDisabled_ = computed(() => {
            return getProps('labelDisabled', false)
        })
        // 组件的勾选图标的尺寸，默认20
        const iconSize_ = computed(() => {
            return addUnit(getProps('iconSize', 42))
        })
        // 组件未激活时的颜色
        const color_ = computed(() => {
            return getProps('color', '#e0e0e0')
        })
        // 组件选中激活时的颜色
        const activeColor_ = computed(() => {
            return getProps('activeColor', '#3c9cff')
        })
        // 组件的形状
        const elShape = computed(() => {
            return getProps('shape', 'square')
        })
        // label大小
        const labelSize_ = computed(() => {
            return addUnit(getProps('labelSize', 28))
        })
        // checkbox内部的勾选图标，如果选中状态，为白色，否则为透明色即可
        const iconColor = computed(() => {
            return isChecked.value ? activeColor_.value : color_.value
        })
        // checkbox内部的勾选图标，如果选中状态，为白色，否则为透明色即可
        const iconType = computed(() => {
            const types = {
                square: {
                    icon: 'ca-checkbox',
                    activeIcon: 'ca-checkbox-checked'
                },
                circle: {
                    icon: 'ca-radio',
                    activeIcon: 'ca-radio-checked'
                }
            }
            return isChecked.value ? getProps('activeIcon') || types[elShape.value].activeIcon : getProps('icon') || types[elShape.value].icon
        })
        const wrap = computed(() => {
            return getProps('wrap', false)
        })
        const checkboxStyle = computed(() => {
            const style = {}
            const witth = getProps('width', 'auto')
            if (witth !== 'auto') {
                style.width = addUnit(witth)
                style.flex = `0 0 ${style.width}`
            }
            if (wrap.value) {
                style.width = '100%'
                style.flex = '0 0 100%'
            }
            return { ...style }
        })

        // 是否禁用，如果父组件checkbox-group禁用的话，将会忽略子组件的配置
        function handleLabelClick() {
            if (!labelDisabled_.value) {
                toggleClick()
            }
        }
        function toggleClick() {
            if (!disabled_.value) {
                setValue()
            } else {
                emitEvent('disabled-click')
            }
        }
        // 设置input的值，这里通过input事件，设置通过v-model绑定的组件的值
        function setValue() {
            if (isLimitExceeded.value && !isChecked.value) return
            const value = toRaw(checkboxVModel.value)
            const valType = getVarType(value)
            if (valType === 'Array') {
                if (isChecked.value) {
                    selfModel.value = falseValue.value
                } else {
                    selfModel.value = trueValue.value
                }
            } else if (valType === 'Object') {
                checkboxVModel.value = setProperty(checkboxVModel, cmptName, isChecked.value ? falseValue.value : trueValue.value)
            } else {
                checkboxVModel.value = isChecked.value ? falseValue.value : trueValue.value
            }
        }
        return {
            checkboxVModel,
            checkboxStyle,
            wrap,
            labelSize_,
            iconSize_,
            iconType,
            isChecked,
            toggleClick,
            iconColor,
            disabled_,
            handleLabelClick
        }
    }
})
</script>

<style lang="scss" scoped>
.ca-checkbox {
    /* #ifndef APP-NVUE */
    display: inline-flex;
    /* #endif */
    align-items: center;
    overflow: hidden;
    user-select: none;
    line-height: 1.8;
    &__wrapper {
        color: $sub-text-color;
        @include flex(row);
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        justify-content: center;
        align-items: center;
        transition-property: color, border-color, background-color;
        font-size: 20rpx;
        transition-duration: 0.2s;
        position: relative;

        &--disabled {
            background-color: #ebedf0;
            border-color: #c8c9cc;
        }

        &--disabled--checked {
            color: #c8c9cc !important;
        }
    }

    &__label {
        word-wrap: break-word;
        margin-left: 10rpx;
        margin-right: 24rpx;
        color: $sub-text-color;
        font-size: 30rpx;

        &--disabled {
            color: #c8c9cc;
        }
    }
}
</style>
