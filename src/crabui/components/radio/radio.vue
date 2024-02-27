<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2022-03-04 11:15:25
-->
<template>
    <view
        class="ca-radio"
        :style="[checkboxStyle,customStyle]"
        @tap="handleLabelClick"
    >
        <view
            class="ca-radio__wrapper"
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
            class="ca-radio__label"
            :style="{ fontSize: labelSize_,flex: wrap ? 1 : 'auto' }"
        >
            <slot />
        </view>
    </view>
</template>

<script>
import { defineComponent, computed, ref, toRaw, watch } from 'vue'
import { addUnit, getProperty, getVarType, registerEvent, setProperty } from '../../libs/utils/tools.js'
import { useProps, useCmptName, useParent, useEmit } from '../../libs/utils/useCore.js'
import crabUIMixin from '../../libs/mixins/crabui.js'
import useFormFactor from '../../hooks/useFormFactor/index'
import { CaFormKey } from '../../libs/utils/symbol.js'
import props from './props'
export default defineComponent({
    name: 'CaRadio',
    mixins: [crabUIMixin],
    props,
    setup(props) {
        const cmptName = useCmptName()
        // 注册订阅器
        const regEvent = registerEvent(CaFormKey)
        const getProps = useProps('CrabCrabRadioGroup')
        // 注册事件句柄
        const emitEvent = useEmit()
        // 查询是否有上级
        const radioGroup = useParent('CrabCrabRadioGroup')
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
            return getProps('shape', 'circle')
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

        // 选中值
        const trueValue = computed(() => radioGroup ? props.value : true)
        // 未选中值
        const falseValue = computed(() => {
            const valueType = getVarType(trueValue.value)
            return valueType === 'Boolean' ? false : (valueType === 'String' ? '' : 0)
        })
        // 当前是否选中
        const selfModel = ref(radioGroup ? falseValue.value : props.modelValue)
        // 当前是否选中
        const isChecked = computed(() => selfModel.value === trueValue.value)
        const radioVModel = computed({
            get() {
                if (regEvent) {
                    return regEvent.extraData.modelValue.value
                } else {
                    return props.modelValue
                }
            },
            set(val) {
                const valType = getVarType(val)
                const emitValue = valType === 'Object' ? getProperty(val, cmptName) : val
                selfModel.value = emitValue
            }
        })
        if (regEvent) {
            watch(regEvent.extraData.modelValue, (value) => {
                selfModel.value = value
            })
        }
        useFormFactor({
            name: cmptName,
            vModel: selfModel,
            change: ({ changeFactor, resetFactor }, isReset) => {
                !radioGroup && emitEvent('modelValue', isChecked)
                if (isReset) {
                    resetFactor(selfModel)
                } else {
                    emitEvent('change', isChecked)
                    isChecked.value && changeFactor(trueValue)
                }
                return true
            },
            reset: () => {
                if (isChecked.value) {
                    setValue()
                }
            },
            init: ({ initFactor }) => {
                if (radioGroup) {
                    // 如果上级不是表单，则有数据才需要推
                    isChecked.value && initFactor(selfModel)
                } else {
                    // 如果是推给表单，不管有没有值都要推送
                    initFactor(selfModel)
                }
                return true
            }
        })
        watch(() => props.checked, (value) => {
            if (value === isChecked.value) return
            setValue()
        })
        const checkboxStyle = computed(() => {
            const style = {}
            const witth = getProps('width', 'auto')
            if (witth !== 'auto') {
                style.width = addUnit(witth)
                // #ifdef MP
                // 各家小程序因为它们特殊的编译结构，使用float布局
                style.float = 'left'
                // #endif
                // #ifndef MP
                // H5和APP使用flex布局
                style.flex = `0 0 ${addUnit(witth)}`
                // #endif
            }
            if (wrap.value) {
                style.width = '100%'
                // #ifndef MP
                // H5和APP使用flex布局，将宽度设置100%，即可自动换行
                style.flex = '0 0 100%'
                // #endif
            }
            return { ...style }
        })

        // 是否禁用，如果父组件checkbox-group禁用的话，将会忽略子组件的配置

        function handleLabelClick() {
            if (!labelDisabled_.value) {
                setValue()
            }
        }
        function toggleClick() {
            if (!disabled_.value) {
                setValue()
            }
        }
        // 设置input的值，这里通过input事件，设置通过v-model绑定的组件的值
        function setValue() {
            if (isChecked.value) return
            const value = toRaw(radioVModel.value)
            const valType = getVarType(value)
            if (valType === 'Object') {
                radioVModel.value = setProperty(radioVModel, cmptName, isChecked.value ? falseValue.value : trueValue.value)
            } else {
                radioVModel.value = radioVModel.value === trueValue.value ? falseValue.value : trueValue.value
            }
        }
        return {
            checkboxStyle,
            wrap,
            labelSize_,
            iconSize_,
            iconType,
            toggleClick,
            iconColor,
            isChecked,
            handleLabelClick
        }
    },
    data() {
        return {
            parentDisabled: false,
            newParams: {}
        }
    }
})
</script>

<style lang="scss" scoped>
.ca-radio {
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
