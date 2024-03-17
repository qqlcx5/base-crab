<template>
    <view class="home-login-content">
        <view class="login-hd ca-flex-column ca-align-center">
            <ca-image size="120" radius="60" src="/static/download/bg.png" />
            <view class="ca-fs-36 ca-mt-40 ca-ellipsis ca-width-full ca-plr-24 ca-tc ca-text">欢迎使用笔记应用</view>
        </view>
        <swiper class="login-bd" :current="pageIndex" :duration="300">
            <swiper-item class="login-item" @touchmove.stop="stopTouchMove">
                <view class="login-item-box">
                    <template v-if="wechatType === 'login'">
                        <ca-button type="success" radius="50" size="large" @click="handleUserInfo(false, false, true)">
                            微信授权一键登录
                        </ca-button>
                    </template>
                    <template v-else>
                        <ca-button
                            :open-type="wechatType" radius="50" size="large" type="success"
                            @getphonenumberencry="handlePhoneNumber" @getuserinfoencry="handleUserInfo">
                            微信授权一键登录
                        </ca-button>
                    </template>
                    <!-- <ca-mask
                        v-if="!agreeCheck" position="absolute" z-index="10" show bg-color="rgba(255, 255, 255, 0)"
                        @click="handleAgree" /> -->
                </view>
                <view class="copyright ca-fs-24 ca-gray">
                    <ca-checkbox-group active-color="#329AFF" @change="handleChange">
                        <view class="ca-flex ca-align-center ca-flex-wrap">
                            <ca-checkbox label-size="24" name="1" :checked="agreeCheck">
                                我已阅读并同意笔记应用用户协议和隐私政策
                            </ca-checkbox>
                        </view>
                    </ca-checkbox-group>
                </view>
            </swiper-item>
            <swiper-item class="login-item" @touchmove.stop="stopTouchMove">
                <ca-button
                    :open-type="bizCode === 1029 ? 'getPhoneNumber' : 'getUserInfo'" size="large"
                    @getuserinfoencry="handleBindWechat" @getphonenumberencry="handlePhoneNumber">
                    一键同步
                </ca-button>
            </swiper-item>
        </swiper>
        <view class="login-other-bottom">
            <view class="ca-underline">
                <view class="ca-other-login">
                    其他方式登录
                </view>
            </view>
            <view class=" ca-mt-68 ca-flex ca-flex-column ca-justify-center ca-align-center">
                <ca-image size="88" radius="60" src="/static/download/bg.png" />
                <view class="ca-text ca-pt-20">
                    手机号登录
                </view>
            </view>
        </view>
    </view>
</template>
<script setup>
import { ref } from 'vue'
const { jump } = uni.$ca.useRouter()
const handleTel = () => {
    jump('smsLogin')
}
const handleAgree = () => {
    agreeCheck.value = !agreeCheck.value
}
const handleChange = (e) => {
    agreeCheck.value = e.detail.value.length > 0
}
const handleUserInfo = (e, isBind, isLogin) => {
    if (isBind) {
        jump('bindWechat')
    } else if (isLogin) {
        uni.$ca.login(e).then((res) => {
            if (res) {
                uni.$ca.showToast('登录成功')
                jump('index')
            }
        })
    } else {
        uni.$ca.login(e).then((res) => {
            if (res) {
                uni.$ca.showToast('登录成功')
                jump('index')
            }
        })
    }
}
const handleBindWechat = (e) => {
    uni.$ca.login(e).then((res) => {
        if (res) {
            uni.$ca.showToast('绑定成功')
            jump('index')
        }
    })
}
const handlePhoneNumber = (e) => {
    uni.$ca.login(e).then((res) => {
        if (res) {
            uni.$ca.showToast('登录成功')
            jump('index')
        }
    })
}
const stopTouchMove = (e) => {
    e.stopPropagation()
}
const pageIndex = ref(0)
const agreeCheck = ref(false)
const finish_ = ref(true)
const wechatType = ref('login')
</script>

<style lang="scss">
.home-login-content {
  padding: 170rpx 0 40rpx;

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

      .ca-button--large {
        width: 100%;
        margin-bottom: 24rpx;
      }

      &-box {
        position: relative;
      }
    }
  }

  .copyright {
    color: #999999;

    &-link {
      color: #116cff;
    }
  }
}
.login-other-bottom {
  @include abs(null, 0, 100rpx, 0);
}
.ca-other-login {
  height: 60rpx;
  line-height: 60rpx;
  padding: 0 20rpx;
  @include siteCenter();
  color: rgba(173, 179, 184, 1);
  background-color: #FAFAFA;
  z-index: 10;
}
</style>
