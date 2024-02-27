<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-12-14 22:47:16
 * @LastEditors: sanshui
 * @LastEditTime: 2022-05-30 10:56:37
-->
<template>
    <view
        class="ca-cell"
        :class="[`ca-cell--${size_}`]"
        @click="handleClick"
    >
        <view
            class="ca-cell-bd ca-flex ca-align-center"
            :style="[cellStyle_]"
        >
            <view
                v-if="icon"
                class="ca-cell-bd__left ca-flex ca-align-center"
            >
                <ca-image
                    v-if="isImg_"
                    :style="[iconStyle_]"
                    :size="iconSize_"
                    :src="icon"
                />
                <ca-icon
                    v-else
                    :style="[iconStyle_]"
                    :size="iconSize_"
                    :name="icon"
                />
            </view>
            <view
                v-if="title || $slots.title || label || $slots.label"
                class="ca-cell-bd__middle"
            >
                <slot name="title">
                    <view
                        v-if="title"
                        class="ca-cell__title ca-ellipsis-1"
                    >
                        {{ title }}
                    </view>
                </slot>
                <slot name="label">
                    <view
                        v-if="label"
                        class="ca-cell__label"
                    >
                        {{ label }}
                    </view>
                </slot>
            </view>
            <view
                v-if="value || $slots.value"
                class="ca-cell-bd__right"
            >
                <slot name="value">
                    <view
                        v-if="value"
                        class="ca-cell__value"
                    >
                        {{ value }}
                    </view>
                </slot>
            </view>
            <view
                v-if="arrow_ || $slots['right-icon']"
                class="ca-cell-bd__right-icon ca-flex ca-align-center"
            >
                <slot name="right-icon">
                    <ca-icon :name="rightIcon_" />
                </slot>
            </view>
        </view>
        <view
            v-if="border_"
            class="ca-line"
        />
        <ca-ripple
            v-if="ripple"
            :ripple-info="rippleInfo"
        />
    </view>
</template>

<script>
import props from './props'
import { defineComponent, computed } from 'vue'
import { useProps, useCaParent, useEmit } from '../../libs/utils/useCore.js'
import { useRipple } from '../ripple/useRipple.js'
import { isImg } from '../../libs/utils/tools'
export default defineComponent({
    name: 'CaCell',
    props,
    setup(props) {
        const getProps = useProps('CaCellGroup')
        // 通用的事件句柄
        const emitEvent = useEmit()

        const { isLast } = useCaParent('CaCellGroup')

        const isImg_ = computed(() => isImg(props.icon))
        const border_ = computed(() => {
            return isLast.value ? false : getProps('border', true)
        })

        const rightIcon_ = computed(() => {
            return getProps('rightIcon', '')
        })

        const size_ = computed(() => {
            return getProps('size', 'normal')
        })
        // icon大小
        const iconSize_ = computed(() => {
            return getProps('iconSize', 32)
        })
        // icon大小
        const iconStyle_ = computed(() => {
            return getProps('iconStyle', 32)
        })
        const cellStyle_ = computed(() => {
            return getProps('cellStyle', '')
        })
        // 是否显示箭头
        const arrow_ = computed(() => {
            return getProps('arrow', true)
        })
        const { perform, rippleInfo } = useRipple('.ca-cell')
        function handleClick(e) {
            if (props.ripple) {
                perform(e)
            }
            if (props.to) {
                uni.$ca.jumpPlus(props.to)
            } else {
                emitEvent('click', e)
            }
        }
        return {
            isImg_,
            arrow_,
            border_,
            rightIcon_,
            iconStyle_,
            size_,
            iconSize_,
            cellStyle_,
            isLast,
            rippleInfo,
            handleClick
        }
    }
})
</script>

<style lang="scss">
.ca-cell {
    @include flex(column);
    flex: 1;
    overflow: hidden;
    position: relative;
    &-bd {
        padding: $cell-padding;
        &__left {
            margin-right: $spacing-row-base;
        }
        &__middle {
            flex: 1;
            & + .ca-cell-bd__right {
                margin-left: $spacing-row-base;
            }
        }
        &__right-icon {
            color: $text-color-grey;
            margin-left: $spacing-row-sm;
        }
    }
    &__title {
        font-size: $font-base;
        color: $text-color;
    }
    &__label {
        font-size: $font-sm;
        margin-top: $spacing-col-sm;
        color: $text-color-grey;
    }
    &__value {
        font-size: $font-base;
        color: $text-color-grey;
    }
    &--large {
        .ca-cell {
            &-bd {
                padding: $cell-padding-lg;
                &__left {
                    margin-right: $spacing-row-lg;
                }
                &__right {
                    margin-left: $spacing-row-lg;
                }
                &__right-icon {
                    margin-left: $spacing-row-base;
                }
            }
            &__title {
                font-size: $font-lg;
            }
            &__label {
                font-size: $font-base;
                margin-top: $spacing-col-base;
            }
            &__value {
                font-size: $font-lg;
            }
        }
    }
}
</style>
