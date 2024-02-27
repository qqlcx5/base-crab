<template>
    <view
        class="c-send-sms-code"
        :style="[ parentStyle_ ]"
        @click="getSmsCode"
    >
        <ca-button
            v-if="mode === 'button'"
            :width="wudth"
            :height="height"
            :plain="plain_"
        >
            <text :style="[ textStyle_ ]">{{ btnText_ }}</text>
        </ca-button>
        <text
            v-else
            :style="[ textStyle_ ]"
        >
            {{ btnText_ }}
        </text>
        <slot />
    </view>
</template>
<script>
import { defineComponent, computed, ref, onBeforeUnmount } from 'vue'
import { addUnit } from '../../libs/utils/tools.js'
import { useEmit } from '../../libs/utils/useCore.js'
export default defineComponent({
    /**
     * 发送短信验证码组件
     * */
    name: 'CSendSmsCode',
    props: {
        /**
         * 是否是按钮形式
         * 可选值：text  button  static
         * static 表示没有任何请求状态只做倒计时
         * */
        mode: {
            type: String,
            default: 'text'
        },
        // 按钮镂空，仅在mode 为 button 才生效
        plain: {
            type: Boolean,
            default: false
        },
        // 按钮圆角，仅在mode 为 button 才生效
        radius: {
            type: [String, Number],
            default: 8
        },
        // 默认文字提示
        text: {
            type: String,
            default: '获取验证码'
        },
        // 再次获取验证码提示
        againText: {
            type: String,
            default: '重新获取($t)'
        },
        // 再次获取验证码提示
        loadText: {
            type: String,
            default: '正在发送'
        },
        width: {
            type: [String, Number],
            default: ''
        },
        height: {
            type: [String, Number],
            default: ''
        },
        // 总秒数
        countDown: {
            type: Number,
            default: 60
        },
        fontSize: {
            type: [String, Number],
            default: 28
        },
        // 接口请求名称
        ajaxName: {
            type: String,
            default: ''
        },
        // 接口请求的额外参数
        ajaxParams: {
            type: Object,
            default: () => {
                return {}
            }
        },
        // 字体颜色
        color: {
            type: String,
            default: '#3a7afe'
        },
        // 获取验证码的手机号字段key值，也会被用于校验发送前的空值
        phoneKey: {
            type: String,
            default: 'mobile'
        },
        showToast: Boolean,
        // 倒计时区间再次点击时，是否提示时间
        toast: {
            type: String,
            default: '$t秒后重新获取'
        }
    },
    emits: ['success', 'error'],
    setup(props, { emit }) {
        // 定时器
        const count = ref(0) // 请求拦截
        let smsTime = null
        let busy = false // 请求拦截
        let smsNum = 0 // 请求拦截
        const emitEvent = useEmit()
        const isSend_ = computed(() => {
            return count.value < props.countDown && count.value > 0
        })

        // 文字内容
        const btnText_ = computed(() => {
            if (busy) return props.loadText
            if (isSend_.value) return props.againText.replace(/\$t/, count.value)
            return smsNum <= 0 ? props.text : props.againText
        })

        // 文字区域大小
        const parentStyle_ = computed(() => {
            const parentStyle = {}
            props.width && (parentStyle.width = addUnit(props.width))
            props.height && (parentStyle.height = addUnit(props.height))
            return parentStyle
        })

        // 文字大小
        const textStyle_ = computed(() => {
            return {
                fontSize: addUnit(props.fontSize),
                color: props.color,
                opacity: isSend_.value ? 0.5 : 1
            }
        })

        // 发送短信接口
        async function getSmsCode(abort = true) {
            if (abort && props.mode === 'static') return
            const tel = props.ajaxParams[props.phoneKey]
            // if (!tel) return props.$toast('手机号码不能为空')
            // if (!$c.validate('moblie', tel)) return $toast('手机号码格式不正确')
            if (busyMsg()) return
            // 发送短信验证码
            if (busy) return
            busy = true
            try {
                const data = true
                // const { data } = await http(props.ajaxName, props.ajaxParams)
                busy = false
                // 发送短信验证码次数+1
                smsNum++
                staticCountDown()
                // 发送成功之后回调
                emitEvent('success', {
                    tel,
                    smsNum,
                    count: count.value,
                    ...data
                })
            } catch (err) {
                busy = false
                emitEvent('error', err)
            }
        }

        function staticCountDown() {
            count.value = props.countDown
            countdown()
        }

        // 倒计时
        function countdown() {
            count.value--
            smsTime = setTimeout(() => {
                if (count.value > 0) {
                    countdown()
                } else {
                    clearTime()
                }
            }, 1000)
        }
        // 清空定时器
        function clearTime() {
            clearTimeout(smsTime)
            smsTime = null
        }
        function busyMsg() {
            if (count.value < props.countDown && count.value > 0) {
                // showToast && throttle(() => {
                // this.$toast(`${count.value}秒后重新获取`);
                // props.toast.replace(/\$t/, count.value)
                // }, 150)
                return true
            }
            return false
        }

        onBeforeUnmount(() => {
            clearTime()
        })

        return {
            btnText_,
            parentStyle_,
            textStyle_,
            getSmsCode
        }
    }
})
</script>

<style lang="scss" scoped>
.c-send-sms-code {
    position: relative;
}
</style>
