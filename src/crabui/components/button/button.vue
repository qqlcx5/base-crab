<template>
    <button
        class="ca-button"
        :class="[
            `ca-button--${type}`,
            `ca-button--${size}`,
            {
                'is-shadow': shadow,
                'is-disabled': disabled,
                'is-round': round,
                'is-circle': circle,
                'is-plain': plain,
                'is-block': block,
            }]"
        :style="[caTheme, customStyle, otherStyle]"
        :form-type="formType"
        :open-type="newoOpenType"
        :show-message-card="showMessageCard"
        :send-message-path="sendMessagePath"
        :send-message-title="sendMessageTitle"
        :send-message-img="sendMessageImg"
        @click="handleClick"
        @getuserinfo="getUserInfo"
        @getphonenumber="getPhoneNumber"
        @chooseavatar="onChooseavatar"
    >
        <view
            v-if="iconPosition === 'left' && (loading || icon || autoLoading)"
            class="ca-flex-ajcenter"
            :class="{ 'ca-mr-10': hasSlots_ }"
        >
            <ca-loading
                v-if="loading || autoLoading"
                :size="caTheme.fontSize"
            />
            <ca-icon
                v-else
                :size="caTheme.fontSize"
                :name="icon"
            />
        </view>
        <template v-if="loading && loadingText">
            {{ loadingText }}
        </template>
        <template v-else>
            <slot v-if="!circle" />
        </template>
        <view
            v-if="iconPosition === 'right' && (loading || icon || autoLoading)"
            class="ca-flex-ajcenter"
            :class="{ 'ca-ml-10': hasSlots_ }"
        >
            <ca-loading
                v-if="loading || autoLoading"
                :size="caTheme.fontSize"
            />
            <ca-icon
                v-else
                :size="caTheme.fontSize"
                :name="icon"
            />
        </view>
        <ca-ripple
            v-if="ripple"
            :color="rippleColor"
            :ripple-info="rippleInfo"
        />
    </button>
</template>
<script>
import props from './props'
import { defineComponent, onMounted, watch, reactive, computed, ref } from 'vue'
import { useRipple } from '../ripple/useRipple'
import { useTheme } from '../theme/useTheme'
import { registerEvent } from '../../libs/utils/tools.js'
import { useEmit, useRect } from '../../libs/utils/useCore.js'
import crabUIMixin from '../../libs/mixins/crabui.js'
import { CaFormKey } from '../../libs/utils/symbol.js'

export default defineComponent({
    name: 'CaBotton',
    mixins: [crabUIMixin],
    props,
    emits: ['click', 'getuserinfo', 'chooseavatar'],
    setup(props, { slots }) {
        const canIUseGetUserProfile = ref(false)
        const newoOpenType = ref(props.openType)
        if (uni.getUserProfile) {
            canIUseGetUserProfile.value = true
        }
        if (props.openType === 'getUserInfo' && canIUseGetUserProfile.value) {
            newoOpenType.value = ''
        }
        const hasSlots_ = computed(() => slots.default || (props.loading && props.loadingText))
        // 注入颜色
        const caTheme = useTheme()
        // 通用的事件句柄
        const emitEvent = useEmit()

        const autoLoading = ref(false)

        const { perform, rippleInfo } = useRipple('.ca-button')
        // 注册订阅器
        const regEvent = registerEvent(CaFormKey)
        const otherStyle = reactive({})
        onMounted(() => {
            const tagRect = useRect('.ca-button')
            watch(tagRect, (val) => {
                if (props.circle) {
                    const max = `${Math.max(val.width, val.height)}px`
                    otherStyle.width = max
                    otherStyle.height = max
                }
                if (props.round || props.circle) {
                    otherStyle.borderRadius = `${Math.ceil(val.height / 2)}px`
                }
            })
        })

        function getUserProfile() {
            // 推荐使用 wx.getUserProfile 获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
            // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
            wx.getUserProfile({
                desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                success: (res) => {
                    emitEvent('getuserinfo', res)
                },
                compile: () => {
                    autoLoading.value = false
                }
            })
        }

        function handleClick(e) {
            if (canIUseGetUserProfile.value && props.openType === 'getUserInfo') {
                autoLoading.value = true
                getUserProfile()
            }
            if (props.loading || props.disabled) return false
            props.ripple && perform(e)
            emitEvent('click', e, false)
            props.formType && regEvent?.$emit(`CaFormFactor:${props.formType}`)
        }

        function getUserInfo(e) {
            autoLoading.value = false
            emitEvent('getuserinfo', e, false)
        }
        function getPhoneNumber(e) {
            emitEvent('getphonenumber', e, false)
        }
        function onChooseavatar(e) {
            emitEvent('chooseavatar', e, false)
        }
        const rippleColor = computed(() => props.type === 'default' || props.plain ? 'rgba(0,0,0,0.15)' : 'rgba(255, 255, 255, 0.3)')
        return {
            rippleInfo,
            caTheme,
            otherStyle,
            hasSlots_,
            autoLoading,
            rippleColor,
            handleClick,
            getUserInfo,
            newoOpenType,
            getPhoneNumber,
            onChooseavatar
        }
    }
})
</script>
<style lang="scss">
.ca-button {
    &:after {
        display: none;
    }

    text-align: left;
    margin: 0;
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    will-change: box-shadow;
    border: thin solid transparent;
    vertical-align: middle;
    text-align: left;
    // 按钮颜色
    $types: (
        default: $color-default,
        primary: $color-primary,
        success: $color-success,
        info: $color-info,
        warning: $color-warning,
        danger: $color-danger,
    );

    @each $tName, $tColor in $types {
        &--#{$tName} {
            color: #{if($tName == 'default', $text-color, $text-inverse-color)};
            background: $tColor;
            border-color: #{if($tName == 'default', $border-color, $tColor)};

            &.is-plain {
                color: #{if($tName == 'default', $text-color, $tColor)};
                background: rgba($tColor, 0.1);
            }
        }
    }

    // 按钮大小
    $sizes: mini, small, normal, large;

    @each $sName in $sizes {
        $height: #{if(
                $sName == 'mini',
                $button-height-mn,
                if(
                    $sName == 'small',
                    $button-height-sm,
                    if(
                        $sName == 'large',
                        $button-height-lg,
                        $button-height-base
                    )
                )
            )};
        $fontSize: #{if(
                $sName == 'mini',
                $font-mn,
                if(
                    $sName == 'small',
                    $font-sm,
                    if($sName == 'large', $font-lg, $font-base)
                )
            )};
        $padding: #{if(
                $sName == 'mini',
                $spacing-row-mn,
                if(
                    $sName == 'small',
                    $spacing-row-sm,
                    if($sName == 'large', $spacing-row-lg, $spacing-row-base)
                )
            )};
        $borderRadius: #{if(
                $sName == 'mini',
                $border-radius-mn,
                if(
                    $sName == 'small',
                    $border-radius-sm,
                    if(
                        $sName == 'large',
                        $border-radius-lg,
                        $border-radius-base
                    )
                )
            )};

        &--#{$sName} {
            height: $height;
            font-size: $fontSize;
            padding: 0 $padding;
            border-radius: $borderRadius;
        }
    }

    // 阴影按钮
    &.is-disabled {
        cursor: not-allowed;
        opacity: 0.5;
        pointer-events: none;
    }

    &.is-shadow {
        box-shadow: $button-shadow;
    }

    &.is-block {
        display: flex;
        min-width: 0;
        width: 100%;
    }
}
</style>
