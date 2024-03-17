<template>
    <view class="home-sms-login-content ca-white-bg">
        <view class="home-sms-login-hd">
            <view class="ca-fs-56 ca-bold ca-text">手机快捷登录</view>
        </view>
        <view class="home-sms-login-bd ca-mt-40">
            <ca-cell-group>
                <ca-cell border :cell-style="cellStyle" :line-style="lineStyle">
                    <ca-input
                        v-model="formData[formList[0].prop]" :type="formList[0].type" :placeholder="formList[0].placeholder"
                        :maxlength="formList[0].maxlength" @input="handleInputMobile">
                        <ca-button class="ca-btn-sms" @click="handleSendSMSCode">
                            <!-- 已经授权过的话  不要调用发送验证码 -->
                            <ca-send-sms-code ref="sendSmsEle" text-color="#116CFF" mode="static" phone-key="mobile" />
                        </ca-button>

                        <!-- #ifdef H5 -->
                        <ca-send-sms-code
                            ref="sendSmsEle" phone-key="mobile" text-color="#116CFF"
                            ajax-name="h5mobileRegisterSendSmsCode" :ajax-params="ajaxParams_" />
                        <!-- #endif -->
                    </ca-input>
                </ca-cell>
                <ca-cell border :cell-style="cellStyle" :line-style="lineStyle">
                    <ca-input
                        v-model="formData[formList[1].prop]" :type="formList[1].type" :maxlength="formList[1].maxlength"
                        :placeholder="formList[1].placeholder" @confirm="handleSubmit" />
                </ca-cell>
                <ca-cell v-if="showInviteInput && needInvitationCode_" border :cell-style="cellStyle" :line-style="lineStyle">
                    <ca-input
                        v-model="formData[formList[2].prop]" :type="formList[2].type" :maxlength="formList[2].maxlength"
                        :placeholder="formList[2].placeholder" @confirm="handleSubmit" />
                </ca-cell>
                <ca-cell :cell-style="cellStyle">
                    <view class="ca-pt-48">
                        <ca-button size="large" @click="handleSubmit">
                            登录
                        </ca-button>
                    </view>
                </ca-cell>
            </ca-cell-group>
        </view>
        <view class="copyright ca-fs-24 ca-gray  ca-mt-32">
            <ca-checkbox-group active-color="#329AFF" @change="handleChange">
                <view class="ca-flex ca-align-center">
                    <ca-checkbox label-size="26" name="1" :checked="agreeCheck">
                        请先阅读并同意
                    </ca-checkbox>
                </view>
            </ca-checkbox-group>
        </view>
        <view class="home-sms-login-fd ca-mt-80">
            <ca-mask
                v-if="!agreeCheck" position="absolute" z-index="10" show bg-color="rgba(255, 255, 255, 0)"
                @click="handleAgree" />
            <view class="ca-flex ca-align-center ca-justify-center">
                <!-- #ifdef H5 -->
                <ca-button v-if="$isWechatBrowser && wechatAuth_" size="large" height="152" @click="getWxUrl(false)">
                    <view class="ca-flex-column ca-align-center">
                        <ca-image src="login/wechat.png" size="88" />
                        <text class="ca-fs-28 ca-text ca-mt-24">微信登录</text>
                    </view>
                </ca-button>
                <!-- #endif -->
                <!-- #ifdef MP -->
                <ca-button
                    v-if="wechatType === 'login'" height="152" size="large"
                    @click="handlePhoneNumber(false, false, true)">
                    <view class="ca-flex-column ca-align-center">
                        <ca-image src="login/wechat.png" size="88" />
                        <text class="ca-fs-28 ca-text ca-mt-24">微信登录</text>
                    </view>
                </ca-button>
                <ca-button
                    v-else height="152" :open-type="wechatType" size="large" @getphonenumberencry="handlePhoneNumber"
                    @getuserinfoencry="handleUserInfo">
                    <view class="ca-flex-column-ajcenter">
                        <ca-image src="login/wechat.png" size="88" />
                        <text class="ca-fs-28 ca-text ca-mt-24">微信登录</text>
                    </view>
                </ca-button>
                <!-- #endif -->
            </view>
        </view>
    </view>
</template>

<script>
// import loginMainMixins from '@/common/mixins/login'
export default {
    // mixins: [loginMainMixins],
    data() {
        return {
            agreement: {
                status: 1,
                title: '用户协议',
                id: 1
            },
            formData: {
                mobile: '', // 手机号码
                sms_code: '', // 短信验证码
                key: '', // 绑定微信用户数据的key
                invite_code: '' // 邀请码
            },
            cellStyle: { minHeight: '118rpx', padding: '0' },
            lineStyle: { left: 0, right: 0 },
            formList: [
                { prop: 'mobile', placeholder: '请输入手机号', type: 'number', maxlength: 11 },
                { prop: 'sms_code', placeholder: '验证码', type: 'number', maxlength: 4 },
                { prop: 'invite_code', placeholder: '业务员邀请码', type: 'text', maxlength: 15 }
            ],
            groupStyle: {
                backgroundColor: '#FFFFFF',
                borderRadius: '16rpx',
                padding: '24rpx'
            },
            isAuto: false, // 是否授权
            ivValue: '' // 已经获取到的iv值
        }
    },
    computed: {
        disabled_() {
            return !this.formData.mobile || String(this.formData.mobile).length < 11 || !this.formData.sms_code || String(this.formData.sms_code).length < 4
        },
        theme_() {
            return this.disabled_ ? ['rgba(17, 108, 255,.3)', '#fff'] : ['#116CFF', '#fff']
        },
        // 是否授权
        hasAuto_() {
            // isAuto为true是已经授权
            return this.isAuto || !!this.ivValue
        },
        ajaxParams_() {
            // 1微信小程序端验证码2公众号端验证码3H5端纯手机验证码
            let type = 1
            // #ifdef H5
            type = this.$isWechatBrowser ? 2 : 3
            // #endif
            // #ifdef APP-PLUS
            type = 4
            // #endif
            return {
                mobile: this.formData.mobile,
                type
            }
        },
        needInvitationCode_() {
            return this.shopInfo_.register_type === 2 && !this.parentId
        }
    },
    onLoad() {
    },
    methods: {
    // 获取用户信息，并发送短信验证码，方便跟手机号一起绑定
    // #ifdef MP-WEIXIN
        async handleSendSMSCode(data = {}) {
            const mobile = this.formData.mobile
            if (!mobile) {
                return this.$toast('请填写手机号')
            }
            if (!this.$c.validate('mobile', mobile)) {
                return this.$toast('请输入正确的手机号')
            }
            // 这里是判断是否在倒计时中
            if (this.$refs.sendSmsEle.busyMsg()) return
            const {
                code
            } = await this.getCode('weixin')
            // wxuserinfo接口,如果有传手机号的话会发送短信验证码
            const { detail = {} } = data
            const postData = { ...detail, code, mobile, parent_id: this.parentId, ...this.relate, invite_code: this.invitationCode }
            const {
                bizCode,
                data: {
                    key
                },
                msg
            } = await this.$http('wxuserinfo', postData, {
                abort: false,
                loading: true
            })
            if ([1002, 1016].includes(bizCode)) {
                this.$toast(msg, 1)
                // 提交短信验证码用到的key
                this.formData.key = key
                this.ivValue = key
                // 这边只能通过refs调用组件的方法来进行倒计时
                this.$nextTick(() => {
                    setTimeout(() => { this.$refs.sendSmsEle.staticCountDown() }, 100)
                })
            } else if (bizCode === -41003) {
                this.$toast(msg)
                this.formData.key = ''
                this.ivValue = ''
            }
        },
        // #endif
        // 手机号登录
        async handleSubmit() {
            if (!this.agreeCheck) return this.handleAgree()
            console.log('账号或密码不全', this.disabled_)
            if (this.disabled_) return
            console.log('账号或密码全')
            /**
       * 1微信小程序端验证码
       * 2公众号端验证码
       * 3H5端纯手机验证码
      */
            let type = 1
            // #ifdef H5
            type = this.$isWechatBrowser ? 2 : 3
            // #endif
            // #ifdef APP-PLUS
            type = 4
            // #endif
            if (!this.formData.mobile) return this.$toast('请填写手机号')
            if (!this.formData.sms_code) return this.$toast('请输入验证码')
            if (this.showInviteInput && this.needInvitationCode_) {
                if (!this.formData.invite_code) {
                    return this.$toast('请输入邀请码')
                }
                const isRight = await this.submitInviteCode({
                    detail: {
                        value: this.formData.invite_code
                    }
                })
                if (!isRight) return
            }
            // #ifdef H5
            this.getStorage()
            // #endif
            const postData = { ...this.formData, parent_id: this.parentId, type, ...this.relate }
            const { bizCode, msg } = await this.$http('smsLogin', postData, { abort: false })
            if (bizCode !== 0) {
                return this.$toast(msg)
            }
            this.backPage()
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
        .copyright {
            // font-size: 24rpx;
            // color: #999999;
            line-height: 1.5;

            &-link {
                color: #116cff;
            }

        }

        // /deep/ .ca-input-bd {
        //     padding-left: 0 !important;
        //     padding-right: 0 !important;
        // }

        // /deep/ .ca-input-box {
        //     margin: 0 40rpx;
        //     background-color: #f5f5f5;
        //     border-radius: 16rpx;

        //     .ca-underline::after {
        //         display: none;
        //     }
        // }
    }

    &-fd {
        // @include fixed(null, 0, 180rpx, 0);
        // margin-top: 80rpx;
        position: relative;

        &__text {
            margin-top: 24rpx;
            font-size: 28rpx;
            line-height: 40rpx;
        }
    }
}
</style>
