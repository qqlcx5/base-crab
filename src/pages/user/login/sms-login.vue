<template>
    <view class="home-sms-login-content c-white-bg">
        <view class="home-sms-login-hd">
            <view class="c-fs-56 c-bold c-text">手机快捷登录</view>
        </view>
        <view class="home-sms-login-bd c-mt-40">
            <c-cell-group>
                <c-cell
                    border
                    :cell-style="cellStyle"
                    :line-style="lineStyle"
                >
                    <c-input
                        v-model="formData[formList[0].prop]"
                        :type="formList[0].type"
                        :placeholder="formList[0].placeholder"
                        :maxlength="formList[0].maxlength"
                        @input="handleInputMobile"
                    >
                        <!-- #ifdef MP -->
                        <!-- 存在手机号码并且未授权信息才显示 -->
                        <!-- <template v-if="!hasAuto_ && authMobile">  基础库2.21.2后, 前端不在弹出授权框 -->
                        <template v-if="false">
                            <c-button
                                open-type="getUserInfo"
                                class="c-btn-sms"
                                @getuserinfoencry="handleSendSMSCode"
                            >
                                <!-- 已经授权过的话  不要调用发送验证码 -->
                                <c-send-sms-code
                                    ref="sendSmsEle"
                                    text-color="#116CFF"
                                    mode="static"
                                    phone-key="mobile"
                                ></c-send-sms-code>
                            </c-button>
                        </template>
                        <template v-else>
                            <c-button
                                class="c-btn-sms"
                                @click="handleSendSMSCode"
                            >
                                <!-- 已经授权过的话  不要调用发送验证码 -->
                                <c-send-sms-code
                                    ref="sendSmsEle"
                                    text-color="#116CFF"
                                    mode="static"
                                    phone-key="mobile"
                                ></c-send-sms-code>
                            </c-button>
                        </template>
                        <!-- #endif -->
                        <!-- #ifdef H5 -->
                        <c-send-sms-code
                            ref="sendSmsEle"
                            phone-key="mobile"
                            text-color="#116CFF"
                            ajax-name="h5mobileRegisterSendSmsCode"
                            :ajax-params="ajaxParams_"
                        ></c-send-sms-code>
                        <!-- #endif -->
                    </c-input>
                </c-cell>
                <c-cell
                    border
                    :cell-style="cellStyle"
                    :line-style="lineStyle"
                >
                    <c-input
                        v-model="formData[formList[1].prop]"
                        :type="formList[1].type"
                        :maxlength="formList[1].maxlength"
                        :placeholder="formList[1].placeholder"
                        @confirm="handleSubmit"
                    />
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
                <c-cell :cell-style="cellStyle">
                    <view class="c-pt-48">
                        <c-colors
                            :pro="['bgc', 'c']"
                            :theme="theme_"
                            radius="16"
                        >
                            <c-button
                                size="large"
                                @click="handleSubmit"
                            >登录</c-button>
                        </c-colors>
                    </view>
                </c-cell>
            </c-cell-group>
        </view>
        <view
            v-if="agreement.status === 1 || privacy.status === 1"
            class="copyright c-fs-24 c-gray  c-mt-32"
        >
            <c-checkbox-group
                active-color="#329AFF"
                @change="handleChange"
            >
                <view class="c-flex c-align-center">
                    <c-checkbox
                        label-size="26"
                        name="1"
                        :checked="agreeCheck"
                    >请先阅读并同意</c-checkbox>
                    <text
                        v-if="agreement.status === 1"
                        class="copyright-link"
                        @click="$jumpDetail('agreement', agreement.id)"
                    >《{{ agreement.title }}》</text>
                    <text v-if="agreement.status === 1 && privacy.status === 1">和</text>
                    <text
                        v-if="privacy.status === 1"
                        class="copyright-link"
                        @click="$jumpDetail('agreement', privacy.id)"
                    >《{{ privacy.title }}》</text>
                </view>
            </c-checkbox-group>
        </view>
        <view
            v-if="wechatAuth_"
            class="home-sms-login-fd c-mt-80"
        >
            <c-mask
                v-if="!agreeCheck"
                position="absolute"
                z-index="10"
                show
                bg-color="rgba(255, 255, 255, 0)"
                @click="handleAgree"
            ></c-mask>
            <view class="c-flex c-align-center c-justify-center">
                <!-- #ifdef H5 -->
                <c-button
                    v-if="$isWechatBrowser && wechatAuth_"
                    size="large"
                    height="152"
                    @click="getWxUrl(false)"
                >
                    <view class="c-flex-column c-align-center">
                        <c-image
                            src="login/wechat.png"
                            size="88"
                        />
                        <text class="c-fs-28 c-text c-mt-24">微信登录</text>
                    </view>
                </c-button>
                <!-- #endif -->
                <!-- #ifdef MP -->
                <c-button
                    v-if="wechatType === 'login'"
                    height="152"
                    size="large"
                    @click="handlePhoneNumber(false, false, true)"
                >
                    <view class="c-flex-column c-align-center">
                        <c-image
                            src="login/wechat.png"
                            size="88"
                        />
                        <text class="c-fs-28 c-text c-mt-24">微信登录</text>
                    </view>
                </c-button>
                <c-button
                    v-else
                    height="152"
                    :open-type="wechatType"
                    size="large"
                    @getphonenumberencry="handlePhoneNumber"
                    @getuserinfoencry="handleUserInfo"
                >
                    <view class="c-flex-column-ajcenter">
                        <c-image
                            src="login/wechat.png"
                            size="88"
                        />
                        <text class="c-fs-28 c-text c-mt-24">微信登录</text>
                    </view>
                </c-button>
                <!-- #endif -->
            </view>
        </view>

        <!-- 邀请码输入框 -->
        <gc-input-modal
            ref="invitationModal"
            v-model="invitationFlag"
            input-type="text"
            async-close="true"
            title="业务员邀请码"
            show-cancel="false"
            show-close="false"
            @confirm="handleSubmitInvitedCode"
        />
        <gc-avatar-nickname
            v-model="modalFlag"
            @authorize="finishAuthorize"
        />
    </view>
</template>

<script>
import loginMainMixins from '@/common/mixins/login'
export default {
    mixins: [loginMainMixins],
    data() {
        return {
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
        this.getAgreementStatus() // 商家是否开启协议
        this.formData.invite_code = uni.getStorageSync(this.$config.invitationCodeCatchName) || ''
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
            /deep/ .c-checkbox__label {
                margin-right: 0;
            }
        }
        /deep/ .c-input-bd {
            padding-left: 0 !important;
            padding-right: 0 !important;
        }
        .c-btn-sms /deep/ .c-btn {
            padding: 0;
        }
        /deep/ .c-input-box {
            margin: 0 40rpx;
            background-color: #f5f5f5;
            border-radius: 16rpx;
            .c-underline::after {
                display: none;
            }
        }
    }
    // &__title {
    //     font-size: 56rpx;
    //     font-weight: bold;
    //     color: $color-text;
    //     line-height: 78rpx;
    // }
    &-fd {
        // @include fixed(null, 0, 180rpx, 0);
        // margin-top: 80rpx;
        position: relative;
        &__text {
            margin-top: 24rpx;
            font-size: 28rpx;
            color: $color-text;
            line-height: 40rpx;
        }
    }
}
</style>
