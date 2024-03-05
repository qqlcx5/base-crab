<template>
    <view
        v-if="formData.login_type !== 'success'"
        class="home-sms-login-content c-white-bg"
    >
        <view class="home-sms-login-hd">
            <view class="home-sms-login__title c-fs-56 c-bold c-text">绑定手机号</view>
        </view>
        <view class="home-sms-login-bd c-mt-40">
            <c-cell-group :group-style="{ borderRadius: '16rpx', padding: '0 0 24rpx' }">
                <c-cell
                    border
                    :cell-style="cellStyle"
                    :line-style="lineStyle"
                >
                    <view class="c-pt-24">
                        <c-input
                            v-model="formData[formList[0].prop]"
                            type="number"
                            :placeholder="formList[0].placeholder"
                            maxlength="11"
                            @input="handleInputMobile"
                        />
                    </view>
                </c-cell>
                <c-cell
                    border
                    :cell-style="cellStyle"
                    :line-style="lineStyle"
                >
                    <view class="c-pt-24">
                        <c-input
                            v-model="formData[formList[1].prop]"
                            type="text"
                            :placeholder="formList[1].placeholder"
                        >
                            <c-send-sms-code
                                phone-key="mobile"
                                :ajax-name="ajaxName_"
                                :ajax-params="ajaxParams_"
                                text-color="#116CFF"
                                @success="sendSmsCodeSuccess"
                            />
                        </c-input>
                    </view>
                </c-cell>
                <c-cell
                    v-if="showInviteInput && needInvitationCode_"
                    border
                    :cell-style="cellStyle"
                    :line-style="lineStyle"
                >
                    <c-input
                        v-model="formData[formList[2].prop]"
                        :type="formList[2].type"
                        :maxlength="formList[2].maxlength"
                        :placeholder="formList[2].placeholder"
                        @confirm="handleSubmit"
                    />
                </c-cell>
                <c-cell
                    :cell-style="cellStyle"
                    :line-style="lineStyle"
                >
                    <view class="c-pt-24">
                        <c-colors
                            :pro="['bgc', 'c']"
                            :theme="['#329AFF', '#fff']"
                            type="button"
                        >
                            <c-button
                                radius="16"
                                size="large"
                                :disabled="disabled_"
                                @click="submit"
                            >绑定</c-button>
                        </c-colors>
                    </view>
                </c-cell>
            </c-cell-group>
        </view>
    </view>
</template>
<script>
import loginMainMixins from '@/common/mixins/login'
export default {
    mixins: [loginMainMixins],
    data() {
        return {
            cellStyle: { minHeight: '118rpx', padding: '0' },
            lineStyle: { left: 0, right: 0 },
            formData: {
                mobile: '',
                login_type: '',
                key: '',
                relate_type: '',
                sms_code: ''
            },
            formList: [
                { prop: 'mobile', placeholder: '请输入手机号', type: 'number', maxlength: 11 },
                { prop: 'sms_code', placeholder: '验证码', child: 'settime', disabled: false, type: 'number' },
                { prop: 'invite_code', placeholder: '业务员邀请码', type: 'text', maxlength: 15 }
            ],
            options: {},
            time: 0,
            lock: false
        }
    },
    computed: {
        disabled_() {
            return !this.formData.mobile || String(this.formData.mobile).length < 11 || !this.formData.sms_code || String(this.formData.sms_code).length < 4
        },
        ajaxParams_() {
            const { mobile, key, type } = this.formData
            return { mobile, key, type: 4 }
        },
        ajaxName_() {
            return this.formData.type == 4 ? 'h5mobileRegisterSendSmsCode' : 'h5RegisterSendSmsCode'
        }
    },
    onLoad() {
        const options = this.$Route.query
        this.options = options
        this.formData.key = options.key
        if (!this.formData.key) {
            this.$toast('没有授权信息请重新授权')
            setTimeout(() => {
                this.$jump('login')
            }, 500)
            return
        }
        // #ifdef H5
        this.formData.login_type = options.login_type
        const relate_type = options.relate_type || (this.$Route.meta ? this.$Route.meta : {}).relate_type || 99
        const parent_id = uni.getStorageSync(this.$config.shareParentName)
        const invite_code = uni.getStorageSync(this.$config.invitationCodeCatchName)
        this.formData.relate_type = relate_type
        this.formData.parent_id = parent_id
        this.formData.invite_code = invite_code
        // #endif
        // #ifdef APP-PLUS
        this.formData.type = options.type
        // #endif
        if (options.login_type === 'success') {
            this.submit()
        }
    },
    methods: {
        async submit() { // 绑定
            if (this.lock) return
            const postData = { ...this.formData }
            const success = postData.login_type === 'success'
            if (!postData.key) return this.$toast('没有授权信息请重新授权')
            if (!postData.mobile && !success) return this.$toast('请填写手机号')
            if (!postData.sms_code && !success) return this.$toast('请填写短信验证码')
            this.lock = true
            // #ifdef APP-PLUS
            if (postData.type == 4) {
                return this.wxAppRegister(postData)
            }
            // #endif
            try {
                await this.$http('h5LoginSuccess', postData, { abort: false })
                this.backRef()
            } catch (error) {
                this.$toast('网络异常请重试')
                console.log(error, '网络异常请重试')
            }
            this.lock = false
        },
        // #ifdef APP-PLUS
        async wxAppRegister(postData) { // app注册登录
            try {
                await this.$http('wxAppRegister', postData, { abort: false })
                this.backRef()
            } catch (error) {
                this.lock = false
            }
            this.lock = false
        },
        // #endif
        sendSmsCodeSuccess({ bizCode }) {
            if (bizCode === 1002 || bizCode === 1016) {
                this.$toast('发送成功！')
            }
        },
        async backRef() {
            await this.$http('userInfo', {}, { abort: false })
            const query = uni.getStorageSync('loginQuery') || this.$Route.query
            this.$backRef(null, query, true)
        }
    }
}
</script>
<style lang="scss">
page {
    height: 100%;
}
</style>
<style lang="scss" scoped>
.home-sms-login {
    &-content {
        padding: 100rpx 48rpx 40rpx;
        // #ifdef MP
        padding-top: 180rpx;
        // #endif
        height: 100%;
        // background-color: #fff;
        // .copyright {
        //     font-size: 24rpx;
        //     color: #999999;
        //     line-height: 1.5;
        //     &-link {
        //         color: #116cff;
        //     }
        //     /deep/ .c-checkbox__label {
        //         margin-right: 0;
        //     }
        // }
        /deep/ .c-input-bd {
            padding-left: 0 !important;
            padding-right: 0 !important;
        }
        .c-btn-sms /deep/ .c-btn {
            padding: 0;
        }
    }
    &__title {
        // font-size: 56rpx;
        // font-weight: bold;
        // color: $color-text;
        line-height: 78rpx;
    }
}
</style>
