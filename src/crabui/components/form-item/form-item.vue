<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-11-14 00:34:27
 * @LastEditors: sanshui
 * @LastEditTime: 2022-06-08 10:06:52
-->
<template>
    <view class="ca-form-item">
        <view
            class="ca-form-item-bd"
            :class="[
                labelPosition_ === 'top' ? 'ca-flex-column' : `ca-flex ${alignItem_}`
            ]"
        >
            <view
                v-if="$slots.label || label"
                class="ca-form-item-bd__left ca-flex-column"
                :style="[labelStyle_]"
            >
                <view
                    v-if="required"
                    class="fs-28 text-danger"
                >
                    *
                </view>
                <slot name="label" />
                <view
                    v-if="!$slots.label"
                    class="ca-form-item__label ca-flex ca-align-center"
                >
                    {{ label }}
                </view>
            </view>
            <view class="ca-form-item-bd__middle ca-flex-1 ca-flex-column">
                <slot />
            </view>
        </view>
        <view
            v-if="border"
            class="ca-line"
        />
    </view>
</template>

<script>
import { defineComponent, computed, watch } from 'vue'
import props from './props'
import { addUnit } from '../../libs/utils/tools.js'
import { useProps, useCmptName, useParent } from '../../libs/utils/useCore.js'

export default defineComponent({
    name: 'CaFormItem',
    props,
    setup(props, { emit }) {
        const cmptName = useCmptName()
        const getProps = useProps('CaForm')
        // label宽度
        const labelWidth_ = computed(() => {
            return addUnit(getProps('labelWidth', 'auto'))
        })
        // label位置
        const labelPosition_ = computed(() => {
            return getProps('labelPosition', 'left')
        })
        const alignItem_ = computed(() => {
            const alignItem = getProps('alignItem', 'center')
            return alignItem === 'top' ? 'ca-align-start' : alignItem === 'bottom' ? 'ca-align-end' : 'ca-align-center'
        })
        // label对其方式
        const labelAlign_ = computed(() => {
            const labelAlignValue = labelPosition_.value === 'top' ? 'stretch' : getProps('labelAlign', 'left')
            return labelAlignValue === 'left' ? 'flex-start' : labelAlignValue === 'right' ? 'flex-end' : labelAlignValue
        })
        const parent = useParent('CaForm')
        if (parent) {
            watch(() => parent.errorFileds, (e) => {
                console.log(1111)
                console.log(e)
            }, {
                deep: true
            })
        }
        // form-item样式
        const labelStyle_ = computed(() => {
            return {
                width: labelPosition_.value !== 'top' ? labelWidth_.value : null,
                flex: labelPosition_.value !== 'top' ? `0 0 ${labelWidth_.value}` : 1,
                alignItems: labelAlign_.value,
                ...getProps('labelStyle', {}, {})
            }
        })

        return {
            labelPosition_,
            labelStyle_,
            alignItem_,
            cmptName
        }
    }
})
</script>

<style lang="scss">
.ca-form-item {
    width: 100%;
    line-height: 50rpx;
    color: $text-color;
    flex: 1;
    @include flex(column);
    &__label {
        flex: 0 0 auto;
        font-size: $font-sm;
        margin-right: $spacing-row-base;
    }
    &-bd {
        padding: $form-item-padding;
    }
}
</style>
