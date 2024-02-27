<template>
    <view class="ca-calendar">
        <ca-popup
            v-model="calendarValue"
            :mask="popup"
            :fixed="popup"
            :radius="radius"
            :position="position"
        >
            <view class="ca-calendar__content">
                <!-- 当前日期 -->
                <view class="ca-calendar-hd ca-flex ca-justify-center ca-align-center">
                    <view
                        class="ca-p-24"
                        @click.stop="prev('year')"
                    >
                        <ca-icon
                            name="ca-towards-the-right"
                            size="36"
                            rotate="180"
                        />
                    </view>
                    <view
                        class="ca-p-24"
                        @click.stop="prev('month')"
                    >
                        <ca-icon
                            name="ca-arrow-right"
                            size="36"
                            rotate="180"
                        />
                    </view>
                    <picker
                        class="ca-p-24"
                        mode="date"
                        :value="date"
                        fields="month"
                        @change="bindDateChange"
                    >
                        <text class="ca-fs-32 ca-text-color">{{ `${nowDate.year ? nowDate.year + '年' : ''}${nowDate.month ? nowDate.month + '月' : ''}` }}</text>
                    </picker>
                    <view
                        class="ca-p-24"
                        @click.stop="next('month')"
                    >
                        <ca-icon
                            name="ca-arrow-right"
                            size="36"
                        />
                    </view>
                    <view
                        class="ca-p-24"
                        @click.stop="next('year')"
                    >
                        <ca-icon
                            name="ca-towards-the-right"
                            size="36"
                        />
                    </view>
                    <text
                        v-if="backtoday && !hasExitToday"
                        class="ca-calendar__backtoday ca-flex ca-align-center"
                        @click="backToToday"
                    >
                        今天
                    </text>
                </view>
                <view class="ca-calendar-bd">
                    <!-- 周日 - 周一 -->
                    <view class="ca-flex ca-justify-around ca-p-24 ca-underline">
                        <view
                            v-for="week in weekTexts"
                            :key="week"
                            class="ca-grey ca-fs-24"
                        >
                            {{ week }}
                        </view>
                    </view>
                    <!-- 所有日期列表 -->
                    <view class="ca-calendar-box">
                        <!-- 是否显示当前日期 -->
                        <view
                            v-if="showMonth"
                            class="ca-calendar__month"
                            :class="{'ca-calendar__month--active': isExpand}"
                        >
                            <text class="ca-calendar__month-text">{{ Number(nowDate.month) }}</text>
                        </view>
                        <view
                            v-for="(week,weekIndex) in weeks"
                            :key="weekIndex"
                            class="ca-calendar-list ca-flex ca-justify-around ca-plr-24"
                            :class="[
                                isExpand || expandIndex === weekIndex ? 'ca-calendar-list--expand ca-ptb-8' : ''
                            ]"
                        >
                            <template
                                v-for="(day,dayIndex) in week"
                                :key="dayIndex"
                            >
                                <view
                                    class="ca-calendar-item"
                                    :class="[{
                                                 'is-disable':day.type === 'disabled',
                                                 'is-grey':day.isGrey,
                                                 'is-today': day.isDay,
                                                 'is-checked': day.checked,
                                                 'in-range': day.range,
                                             },
                                             day.type && day.type !== 'disabled' ? `is-checked--${day.type}` : ''
                                    ]"
                                    :style="{
                                        backgroundColor: day.range ? rangeColor : (day.checked ? color : null)
                                    }"
                                    @click="choiceDate(day)"
                                >
                                    <!-- 'start-date':day.beforeRange,
                                            'end-date':day.afterRange, -->
                                    <!-- 有额外信息，则添加小圆点 -->
                                    <text
                                        v-if="day.extraInfo"
                                        class="ca-calendar-item__circle"
                                        :style="{
                                            backgroundColor: day.extraInfo.circleColor || circleColor
                                        }"
                                    />
                                    <!-- 当前日期 -->
                                    <text
                                        class="ca-calendar-item__text"
                                        :style="{
                                            color: day.range || day.isDay ? (day.isDay && day.checked ? '#fff' : color) : (day.checked ? '#fff' : null)
                                        }"
                                    >
                                        {{ day.text || day.date }}
                                    </text>
                                    <!-- 额外信息 -->
                                    <text
                                        v-if="day.topText"
                                        class="ca-calendar-item__top-text"
                                        :style="{
                                            color: day.range || day.isDay ? color : (day.checked ? '#fff' : null)
                                        }"
                                    >
                                        {{ day.topText }}
                                    </text>
                                    <!-- 额外信息 -->
                                    <text
                                        class="ca-calendar-item__lunar-text"
                                        :style="{
                                            color: day.range || day.isDay ? color : (day.checked ? '#fff' : null)
                                        }"
                                    >
                                        {{ day.bottomText || (day.extraInfo ? day.extraInfo.text : day.isDay ? '今天' : lunar ? (day.lunar.IDayCn === '初一' ? day.lunar.IMonthCn : day.lunar.IDayCn) : '') }}
                                    </text>
                                </view>
                            </template>
                        </view>
                    </view>
                </view>
                <view
                    v-if="!popup && showExpand"
                    class="ca-flex ca-justify-center ca-ptb-24"
                    @click="handleSlideToggle"
                >
                    <ca-icon
                        name="ca-arrow-right"
                        :rotate="isExpand ? -90 : 90"
                    />
                </view>
                <!-- 底部按钮 -->
                <view
                    v-if="popup && showConfirm"
                    class="ca-calendar-ft ca-p-24"
                >
                    <ca-button
                        block
                        size="large"
                        round
                        :disabled="btnDisabled"
                        :background="btnBgColor"
                        color="#fff"
                        @click="confirm"
                    >
                        {{ confirmText }}
                    </ca-button>
                </view>
                <slot name="footer" />
            </view>
        </ca-popup>
    </view>
</template>

<script>
import { defineComponent, ref, watch, computed, reactive, toRaw } from 'vue'
import props from './props.js'
import { useVModel, useEmit } from '../../libs/utils/useCore.js'
import Calendar from './util.js'
import crabUIMixin from '../../libs/mixins/crabui.js'
import colorTools from '../../libs/utils/colorGradient.js'
export default defineComponent({
    name: 'CrabCalendar',
    mixins: [crabUIMixin],
    props,
    emits: ['confirm', 'change', 'monthChange', 'update:modelValue'],
    setup(props) {
        // 注册事件句柄
        const emitEvent = useEmit()
        const cale = reactive(new Calendar({
            selected: props.selected,
            startDate: props.startDate,
            endDate: props.endDate,
            type: props.type,
            formatter: props.formatter
        }))
        // 周
        const weeks = ref([])
        // 当前日历面板
        const nowDate = ref({})
        // 选中日历面板
        const calendar = ref({})
        // 是否展开
        const isExpand = ref(true)
        // 一周
        const weekTexts = cale.weekTexts

        const calendarValue = useVModel('modelValue', () => { }, (value) => {
            // 如果是弹窗模式，并且需要清空数据
            if (value) {
                if (props.popup && props.clearDate) {
                    cale.resetRangeStatus()
                    init(props.date)
                }
            }
        })

        // 按钮禁止点击
        const btnDisabled = computed(() => {
            if (props.type === 'single') {
                return !calendar.value.fullDate
            }
            return cale.multipleStatus.dates.length === 0
        })

        const rangeColor = computed(() => {
            return colorTools.colorToRgba(props.color, 0.1)
        })

        // 初始化数据
        init(props.date)

        watch(() => props.date, (val) => {
            init(val)
        })

        // 设置区间选择
        watch(() => [props.type, props.formatter], (val) => {
            cale.setProp('type', val[0])
            cale.setProp('formatter', val[1])
            init(props.date)
        })

        watch(() => props.startDate, (val) => {
            cale.setSatrtDate(val)
            cale.setDate(nowDate.value.fullDate)
            weeks.value = cale.weeks
        })

        watch(() => props.endDate, (val) => {
            cale.setEndDate(val)
            cale.setDate(nowDate.value.fullDate)
            weeks.value = cale.weeks
        })

        watch(() => props.selected, (val) => {
            cale.setSelectInfo(nowDate.value.fullDate, val)
            weeks.value = cale.weeks
        })
        // 按钮颜色
        const btnBgColor = computed(() => props.confirmColor || props.color)

        const expandIndex = computed(() => {
            const fullDate = toRaw(nowDate.value).fullDate
            const index = Object.values(weeks.value).findIndex(week => week.filter(o => o.fullDate === fullDate).length)
            return index === -1 ? 0 : index
        })

        // 当前时间是否包含今天
        const hasExitToday = computed(() => {
            return Object.values(weeks.value).filter(week => week.filter(o => o.isDay).length).length > 0
        })

        /**
         * 初始化日期显示
         * @param {Object} date
         */
        function init(date) {
            setDate(date)
            date && (calendar.value = cale.getInfo(date))
        }

        function bindDateChange(e) {
            const value = e.detail.value + '-1'
            cale.getDate(value)
            setDate(value)
        }

        /**
         * 确认按钮
         */
        function confirm() {
            setEmit('confirm')
            calendarValue.value = false
        }

        /**
         * 变化触发
         */
        function change() {
            // 如果是范围选择，并且有区间了才能触发change
            if (props.type === 'range' && cale.multipleStatus.dates.length === 0) return
            setEmit('change')
            !props.showConfirm && confirm()
        }

        /**
         * 选择月份触发
         */
        function monthSwitch() {
            const {
                year,
                month
            } = nowDate.value
            emitEvent('monthChange', {
                year,
                month: Number(month)
            })
        }

        /**
         * 选择天触发
         * @param {Object} weeks
         */
        function choiceDate(day) {
            if (day.type === 'disabled') return
            if (props.type === 'single') {
                // 如果当天的时间跟上一次选中的实践一致的话，不予处理
                if (day.fullDate === calendar.value.fullDate) return
                init(day.fullDate)
            } else {
                if (props.type === 'range') {
                    // 如果当天的时间跟两端的节点值一样，则不做操作
                    if ([cale.multipleStatus.before, cale.multipleStatus.after].includes(day.fullDate)) return
                    const oldDate = day.fullDate
                    // 要判断最大可选个数
                    if (props.maxRange !== -1 && cale.multipleStatus.before && !cale.multipleStatus.after) {
                        // 当前时间比较小
                        const maxRange = props.maxRange - 1
                        if (cale.dateCompare(day.fullDate, cale.multipleStatus.before)) {
                            const minTime = cale.getDate(cale.multipleStatus.before, -maxRange).fullDate
                            day.fullDate = cale.dateCompare(minTime, day.fullDate) ? day.fullDate : minTime
                        } else {
                            const maxTime = cale.getDate(cale.multipleStatus.before, maxRange).fullDate
                            day.fullDate = cale.dateCompare(maxTime, day.fullDate) ? maxTime : day.fullDate
                        }
                    }
                    if (oldDate !== day.fullDate) {
                        uni.$ca.toast(`最多选择${props.maxRange}天`)
                    }
                    // 设置范围
                    cale.setRange(day.fullDate)
                } else {
                    if (props.maxRange !== -1 && !cale.multipleStatus.dates.includes(day.fullDate) && cale.multipleStatus.dates.length >= props.maxRange) {
                        uni.$ca.toast(`最多选择${props.maxRange}天`)
                        return
                    }
                    // 设置多选
                    cale.setMultiple(day.fullDate)
                }
                weeks.value = cale.weeks
            }
            change()
        }

        /**
         * 回到今天
         */
        function backToToday() {
            const date = cale.getDate(new Date()).fullDate
            setDate(date)
            change()
        }

        /**
         * 上个月
         */
        function prev(str = 'month') {
            const preDate = cale.getDate(nowDate.value.fullDate, -1, str).fullDate
            setDate(preDate)
            monthSwitch()
        }

        /**
         * 下个月
         */
        function next(str = 'month') {
            const nextDate = cale.getDate(nowDate.value.fullDate, +1, str).fullDate
            setDate(nextDate)
            monthSwitch()
        }

        /**
         * @description: 设置日期
         * @param {Object} date
         * @return Void
         */
        function setDate(date) {
            cale.setDate(date)
            weeks.value = cale.weeks
            nowDate.value = cale.getInfo(date)
        }

        /**
         * @description: 日历伸缩
         * @return Void
         */
        function handleSlideToggle() {
            isExpand.value = !isExpand.value
        }

        /**
         * 派发事件
         * @param {Object} name
         */
        function setEmit(name) {
            const {
                year,
                month,
                date,
                fullDate,
                lunar,
                extraInfo
            } = calendar.value
            emitEvent(name, props.type !== 'single'
                ? {
                    extraInfo,
                    ...cale.multipleStatus
                }
                : {
                    year,
                    month,
                    date,
                    fullDate,
                    lunar,
                    extraInfo
                })
        }

        return {
            weekTexts,
            calendarValue,
            weeks,
            nowDate,
            calendar,
            hasExitToday,
            expandIndex,
            isExpand,
            bindDateChange,
            choiceDate,
            next,
            prev,
            btnBgColor,
            backToToday,
            confirm,
            handleSlideToggle,
            btnDisabled,
            rangeColor
        }
    }
})
</script>

<style lang="scss" scoped>
.ca-calendar {
    @include flex;
    flex: 1;
    &__content {
        background-color: #fff;
    }
    &-hd {
        height: 100rpx;
        position: relative;
    }
    &-bd {
        position: relative;
    }
    &__backtoday {
        @include site(null, 0);
        padding: 0 20rpx;
        padding-left: 20rpx;
        height: 50rpx;
        font-size: 24rpx;
        border-radius: 50rpx 0 0 50rpx;
        color: $text-color;
        background-color: $bg-color-hover;
    }
    &__month {
        @include flex;
        justify-content: center;
        align-items: center;
        pointer-events: none;
        opacity: 0;
        @include siteCenter;
        @include tst;
        &--active {
            opacity: 1;
        }
        &-text {
            font-size: 200px;
            font-weight: bold;
            color: rgba($color: $text-color-grey, $alpha: 0.1);
        }
    }
    &-box {
        overflow: hidden;
        position: relative;
    }
    &-list {
        max-height: 0;
        @include tst;
        overflow: hidden;
        &--expand {
            max-height: 150rpx;
        }
    }
    &-item {
        flex: 1;
        @include flex(column);
        justify-content: center;
        align-items: center;
        position: relative;
        height: 110rpx;
        @include tst;
        &__text {
            font-size: $font-base;
            color: $text-color;
        }

        &__lunar-text {
            font-size: 0.8 * $font-sm;
            color: $text-color-grey;
            @include abs(null, 50%, 8rpx);
            transform: translateX(50%);
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        &__top-text {
            @extend .ca-calendar-item__lunar-text;
            bottom: auto;
            top: 8rpx;
        }
        &.is-disable,
        &.is-grey {
            opacity: 0.45;
        }
        &.is-disable {
            cursor: not-allowed;
        }
        &.is-today {
            .ca-calendar-item {
                &__text,
                &__lunar-text {
                    color: $color-primary;
                }
            }
        }
        &.is-checked,
        &.start-date,
        &.end-date {
            opacity: 1;
            background-color: $color-primary;
            color: #fff;
            .ca-calendar-item {
                &__text,
                &__lunar-text {
                    color: #fff;
                }
            }
        }
        &.is-checked {
            border-radius: $border-radius-base;
            &--start {
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
            }
            &--middle {
                border-radius: 0;
            }
            &--end {
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            }
        }
        &.in-range {
            opacity: 1;
            background-color: rgba($color: $color-primary, $alpha: 0.1);
            .ca-calendar-item {
                &__text,
                &__lunar-text {
                    color: $color-primary;
                }
            }
        }
        &__circle {
            @include abs(10rpx, 10rpx);
            width: 16rpx;
            height: 16rpx;
            border-radius: 100%;
            background-color: $color-danger;
        }
    }
}
</style>
