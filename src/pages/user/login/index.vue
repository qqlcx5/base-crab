<template>
    <view v-show="finish_" class="home-login-content">
        <view class="login-hd ca-flex-column ca-align-center">
            <ca-image size="120" radius="60" src="/static/download/bg.png" err-src="common/shop-map-error.png" />
            <view class="ca-bold ca-fs-36 ca-mt-24 ca-ellipsis ca-width-full ca-plr-24 ca-tc">店铺名称</view>
        </view>
        <swiper class="login-bd" :current="pageIndex" :duration="300">
            <swiper-item class="login-item" @touchmove.stop="stopTouchMove">
                <view class="login-item-box">
                    <view class="ca-mb-32">
                        <template v-if="wechatType === 'login'">
                            <ca-button size="large" type="primary" @click="handleUserInfo(false, false, true)">
                                微信授权一键登录
                            </ca-button>
                        </template>

                        <template v-else>
                            <ca-button
                                :open-type="wechatType" size="large" type="primary"
                                @getphonenumberencry="handlePhoneNumber" @getuserinfoencry="handleUserInfo">
                                微信授权一键登录
                            </ca-button>
                        </template>
                    </view>
                    <ca-mask
                        v-if="!agreeCheck" position="absolute" z-index="10" show bg-color="rgba(255, 255, 255, 0)"
                        @click="handleAgree" />
                </view>
                <view class="ca-mb-32">
                    <ca-button size="large" plain @click="jump('sms-login')">
                        手机号码登录/注册
                    </ca-button>
                </view>
                <view class="copyright ca-fs-24 ca-gray">
                    <ca-checkbox-group active-color="#329AFF" @change="handleChange">
                        <view class="ca-flex ca-align-center ca-flex-wrap">
                            <ca-checkbox label-size="24" name="1" :checked="agreeCheck">
                                请先阅读并同意
                            </ca-checkbox>
                        </view>
                    </ca-checkbox-group>
                </view>
            </swiper-item>
            <swiper-item class="login-item" @touchmove.stop="stopTouchMove">
                <!-- #ifdef MP -->
                <ca-colors :pro="['bgc', 'c']" :theme="['#04C063', '#fff']" radius="16">
                    <ca-button
                        :open-type="bizCode === 1029 ? 'getPhoneNumber' : 'getUserInfo'" size="large"
                        @getuserinfoencry="handleBindWechat" @getphonenumberencry="handlePhoneNumber">
                        一键同步
                    </ca-button>
                </ca-colors>
                <!-- #endif -->
            </swiper-item>
        </swiper>
    </view>
</template>

<script>
// import loginMainMixins from '@/common/mixins/login'
export default {
    // mixins: [loginMainMixins],
    data() {
        return {
            shopInfo_: {},
            finish_: true,
            agreeCheck: true
        }
    },
    onLoad() {
        console.log(new Date(), 'onLoad')
    }
}
</script>

<style lang="scss">
.home-login-content {
    padding: 100rpx 0 40rpx;

    .login-hd {
        position: relative;
    }

    .login-bd {
        margin-top: 170rpx;
        height: 400rpx;
        width: 100%;

        .login-item {
            padding: 0 48rpx;
            position: relative;

            &-box {
                position: relative;
            }
        }
    }

    // .login-text {
    //     @include abs(null, 0, -130rpx, 0);
    // }
    .copyright {
        // font-size: 24rpx;
        color: #999999;

        &-link {
            color: #116cff;
        }

        // /deep/ .c-checkbox__label {
        //     margin-right: 0;
        // }
    }

    // /deep/ .c-input-box {
    //     margin: 0 40rpx;
    //     background-color: #f5f5f5;
    //     border-radius: 16rpx;
    //     .c-underline::after {
    //         display: none;
    //     }
    // }
}
</style>
