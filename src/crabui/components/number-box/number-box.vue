<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2022-03-17 21:37:55
-->
<template>
    <view class="ca-number-box">
        <view
            class="ca-number-box__icon ca-flex-ajcenter"
            :class="{'is-disabled': disabled || numberVModel === 1}"
            @click.stop="handleCalc(-1)"
        >
            <ca-icon
                name="qq-reduce"
                size="18"
            />
        </view>
        <view class="ca-number-box__input ca-flex">
            <ca-input
                v-model="numberVModel"
                type="number"
                :max="max"
                :name="name"
                :disabled="disabled"
                :min="1"
            />
        </view>
        <view
            class="ca-number-box__icon ca-flex-ajcenter"
            :class="{'is-disabled': disabled || max <= numberVModel}"
            @click.stop="handleCalc(1)"
        >
            <ca-icon
                name="qq-add"
                size="18"
            />
        </view>
    </view>
</template>

<script>
import { defineComponent } from 'vue'
import crabUIMixin from '../../libs/mixins/crabui.js'
import { useVModel } from '../../libs/utils/useCore.js'
export default defineComponent({
    name: 'CaNumberBox',
    mixins: [crabUIMixin],
    props: {
        modelValue: {
            type: [Number, String],
            default: 1
        },
        max: {
            type: Number,
            default: undefined
        },
        min: {
            type: Number,
            default: 1
        },
        name: {
            type: String,
            default: undefined
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        const numberVModel = useVModel()
        function handleCalc(val) {
            console.log('val', val)
            if (val.disabled) return
            if (numberVModel.value <= props.min && val < 0) return
            if (props.max !== undefined && numberVModel.value >= props.max && val > 0) return
            numberVModel.value = Number(numberVModel.value) + val
        }
        return {
            numberVModel,
            handleCalc
        }
    }
})
</script>

<style lang="scss" scoped>
.ca-number-box {
    display: inline-flex;
    align-items: center;
    &__input {
        width: 50rpx;
        text-align: center;
        :deep(.ca-input) {
            .ca-input__input {
                height: 32rpx;
                line-height: 32rpx;
                font-size: 24rpx;
            }
        }
    }
    &__icon {
        width: 32rpx;
        height: 32rpx;
        border-radius: 50%;
        color: #000000;
        font-size: 0;
        background-color: #fff;
        box-shadow: 0 0 0 1px #666;
        &.is-disabled {
            opacity: 0.75;
        }
    }
}
</style>
