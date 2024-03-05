/*
* @Descripttion:
* @version: 1.0
* @Author: sanhui
* @Date: 2021-05-31 21:51:44
*/
import { mapState } from 'vuex'
export default {
    data() {
        return {
            loginRes: {},
            wechatType: 'getPhoneNumber',
            registerMobile: '', // 已经注册过的的电话号码
            agreement: {}, // 用户协议
            privacy: {}, // 隐私协议
            agreeCheck: true, // 默认勾选隐私协议
            firstIntPage: {}, // 第一次进来的页面
            invitationCode: '', // 邀请码
            bindType: 0, // 绑定类型  0正常 1用户绑定微信
            invitationFlag: false, // 邀请码弹窗
            finish: false, // 是否加载完成
            bizCode: '', // 授权状态码
            parentId: '', // 上级id
            relate: {}, // 注册来源实体
            pageIndex: 0, // 当前页面下标
            loginKey: '', // 登录加密的key值
            authMobile: '', // 正在校验中的电话号码
            showInviteInput: false,// 是否显示邀请码输入框
            modalFlag: false
        }
    },
    computed: {
        ...mapState({
            shopInfo_: state => state.config.shopInfo || {}
        }),
        /**
         * register_type 登录是否需要邀请码
         * 1 不需要绑定邀请码就可以注册
         * 2 需要绑定邀请码就可以注册
        */
        needInvitationCode_() {
            return this.shopInfo_.register_type === 2 && !this.invitationCode && !this.parentId
        },
        // 商家是否开启公众号
        wechatAuth_() {
            let wechatAuth = true
            // #ifdef H5
            wechatAuth = this.shopInfo_.wechat_auth && this.$isWechatBrowser
            // #endif
            return wechatAuth
        },
        finish_() {
            let finish = Object.keys(this.shopInfo_).length
            // #ifdef MP
            finish = finish && this.bizCode
            // #endif
            return finish
        },
        is6800Version_() {
            return [1031, 1028].includes(this.bizCode)
        },
        showCopyright_() {
            let showCopyright = true
            // #ifdef H5
            showCopyright = this.$isWechatBrowser
            // #endif
            return showCopyright
        }
    },
    watch: {
        // 这边控制页面操作状态
        finish_: {
            handler(val) {
                this.finish = val
                // 默认弹出邀请码
                // if (this.needInvitationCode_ && !this.invitationCode && !this.parentId) {
                //     if (![1006, 1028].includes(this.bizCode)) return
                //     this.invitationFlag = true
                // }
            },
            immediate: true
        },
        // 这边控制页面的loading状态
        finish(val) {
            val ? this.$hideLoading() : this.$loading()
        }
    },
    onLoad() {
        this.pageIndex = this.$Route.query.pageIndex || 0

        this.getStorage()
        // 绑定微信不需要输入邀请码， 0是正常的注册
        if (this.bindType === 0) {
            // #ifdef MP-WEIXIN
            this.verifyCode() // 验证code 是否授权
            // #endif
        }
    },
    methods: {
        stopTouchMove() {
            return true
        },
        getStorage() {
            // 获取分享的上级
            this.parentId = uni.getStorageSync(this.$config.shareParentName)
            // 获取已经填过的邀请码
            this.invitationCode = uni.getStorageSync(this.$config.invitationCodeCatchName) || ''

            // 获取第一次进入的页面 start
            const firstIntPageCatch = uni.getStorageSync(this.$config.firstIntPageCatchName) || this.$Route
            this.firstIntPage = Object.assign({}, this.$Route, firstIntPageCatch)
            // 获取第一次进入的页面 end

            // 获取来源页面的类型
            this.relate = {
                // 类型来源
                relate_type: this.firstIntPage.query?.relate_type || this.firstIntPage.meta?.relate_type || 99,
                relate_id: this.firstIntPage.query?.detailId ?? '',

                // 页面来源-海报
                source_type: this.firstIntPage.query?.source_type,
                source_id: this.firstIntPage.query?.source_id ?? ''
            }
        },
        // 没有勾选协议弹窗
        handleAgree() {
            const toast = []
            if (this.agreement.status === 1) {
                toast.push(this.agreement.title)
            }
            if (this.privacy.status === 1) {
                toast.push['和']
                toast.push(this.privacy.title)
            }
            if (toast.length) toast.unshift('未勾选')
            if (toast.length) {
                return this.$toast(toast.join(''))
            }
            if (this.needInvitationCode_ && !this.formData.invite_code) {
                this.invitationFlag = true
            }
        },
        handleChange(e) {
            this.agreeCheck = e.detail.value.length > 0
        },
        async handleSubmitInvitedCode(e) {
            const isRight = await this.submitInviteCode(e)
            if (isRight) {
                if (this.wechatType === 'getUserInfo') {
                    this.bindUserInfo({
                        key: this.loginKey
                    }, 'getuserinfo')
                } else {
                    this.bindPhoneNumber({
                        key: this.loginKey
                    })
                }
            }
        },
        // 校验邀请码正确性
        async submitInviteCode({ detail: { value } }) {
            if (!value) {
                this.clearModalLoading()
                return this.$toast('请输入邀请码')
            }
            try {
                await this.$http('inviteCodeVerify', {
                    invite_code: value
                })
                this.invitationCode = value
                uni.setStorageSync(this.$config.invitationCodeCatchName, value)
                this.invitationFlag = false
                this.clearModalLoading()
                return true
            } catch (error) {
                console.log(error)
                this.clearModalLoading()
                return false
            }
        },
        // 清空邀请码的loading状态
        clearModalLoading() {
            console.log(this.$refs)
            this.$refs.invitationModal && this.$refs.invitationModal.clearLoading()
        },
        jump(url, query = {}, method = 'replace') {
            query = query || {}
            this.$jump(url, {
                ...query,
                ...this.$Route.query
            }, method)
        },
        // #ifdef MP
        // 判断用户的授权情况进度
        async verifyCode() { // 验证code 是否授权 微信小程序专用
            console.log(new Date(), '开始请求')
            this.$loading()
            const { code } = await this.getCode('weixin')
            const {
                bizCode, msg
            } = await this.$http('mobileByCode', {
                code
            })
            this.bizCode = bizCode
            switch (bizCode) {
                case 1006: // 未注册
                    this.wechatType = 'getPhoneNumber'
                    break
                case 1028: // 未绑定微信(6800版本用户未注册)
                case 1008: // 未绑定微信
                    this.wechatType = 'getUserInfo'
                    break
                case 1024: // 已注册, 已授权
                case 1031: // 已注册, 已授权(6800版本已经注册，已经微信授权 可以直接授权登录)
                    this.wechatType = 'login'
                    break
                default:
                    this.$toast(msg)
                    break
            }
            this.$hideLoading()
        },
        /**
         * 获取手机号码
         * data[Object] 授权返回的encryptedData和iv
         * showToast[Boolean]是否提示吐司提示
         * jumpCheck[Boolean]是否跳过授权信息校验
        */
        async handlePhoneNumber(data, showToast = true, jumpCheck = false) {
            const { detail = {}, type } = data || {}
            console.log(data, detail, 'data,detail')
            if (!detail.encryptedData && !jumpCheck) return
            this.$loading()
            const { code } = await this.getCode('weixin')
            // 这边要判断手机号码是否已经注册过，没注册过就要判断是否要邀请码
            if (this.needInvitationCode_) {
                try {
                    // 把登录的秘钥换成key
                    const { data: loginData } = await this.$http('getDecryptMobileOrUser', {
                        ...detail,
                        code
                    })
                    this.loginKey = loginData.key
                    const isRegister = await this.isRegisterByKey(1)
                    if (!isRegister) {
                        this.$hideLoading()
                        this.invitationFlag = true
                        return
                    } else {
                        this.bindPhoneNumber({
                            key: this.loginKey
                        }, type)
                    }
                } catch (error) {
                    this.$hideLoading()
                }
            } else {
                this.bindPhoneNumber({
                    code,
                    ...detail
                }, type)
            }
        },
        // 微信获取的手机号注册
        async bindPhoneNumber(params, type) {
            try {
                const postData = { ...params, parent_id: this.parentId, ...this.relate, invite_code: this.invitationCode }
                const { bizCode, msg } = await this.$http(this.bizCode === 1029 ? 'usersBindMobile' : 'getwxmobile', postData, { abort: false })
                this.bizCode !== 1029 && (this.bizCode = bizCode)
                switch (bizCode) {
                    // 去微信授权
                    case 1007:// 注册成功
                        this.switchBindWechatPage()
                        break
                    case 1008:// 登录成功
                        if (type === 'getuserinfo') {
                            await this.handleBindWechat({
                                detail: postData
                            })
                        } else {
                            this.switchBindWechatPage()
                        }
                        break
                    case 1015:// 登录成功
                    case 1025:// 6800版本，手机号已被使用，也跳转首页（手机号被其他微信号占用）
                    case 1026:// 6800版本，绑定手机号成功，跳转首页
                    case 1027:// 6800版本，绑定手机号失败，跳转首页
                        this.backPage()
                        break
                    default:
                        this.$toast(msg)
                        break
                }
            } catch (error) {
                this.$hideLoading()
            }
        },
        /**
         * 获取用户信息
         * data[Object] 授权返回的encryptedData和iv
         * showToast[Boolean]是否提示吐司提示
         * jumpCheck[Boolean]是否跳过授权信息校验
        */
        async handleUserInfo(data, showToast = true, jumpCheck = false) {
            const { detail = {}, type } = data || {}
            if (!detail.encryptedData && !jumpCheck) {
                !this.is6800Version_ && showToast && this.$toast('您还可以选择手机登录')
                return
            }

            this.$loading()
            const { code } = await this.getCode('weixin')

            if (jumpCheck) {
                this.bindUserInfo({ code })
                return
            }
            // 这边要判断手机号码是否已经注册过，没注册过就要判断是否要邀请码
            if (this.needInvitationCode_ && this.bizCode !== 1008) {
                try {
                    // 把登录的秘钥换成key
                    const { data: loginData } = await this.$http('getDecryptMobileOrUser', {
                        ...detail,
                        code
                    })
                    this.loginKey = loginData.key
                    const isRegister = await this.isRegisterByKey(2)
                    if (!isRegister) {
                        this.$hideLoading()
                        this.invitationFlag = true
                        return
                    } else {
                        this.bindUserInfo({
                            key: this.loginKey
                        }, type)
                    }
                } catch (error) {
                    console.log('error', error)
                    this.$hideLoading()
                }
            } else {
                this.bindUserInfo({
                    code,
                    ...detail
                }, type)
            }
        },
        async bindUserInfo(params, type) {
            // 已经登录不应该传入iv跟encryptedData
            try {
                // 已经登录过不需要传入type  不然会导致失败
                const postData = { ...(type === 'getuserinfo' && [1028, 1031].includes(this.bizCode) ? params : {}), parent_id: this.parentId, ...this.relate, invite_code: this.invitationCode }
                params.code && (postData.code = params.code)
                const { bizCode, msg } = await this.$http([1028, 1031].includes(this.bizCode) ? 'wxappAuth' : 'getwxmobile', postData, { abort: false })
                // 只要是已经成为系统用户，那么一定要拿到用户信息存起来，不然用户可以点击上面的小房子返回到首页，这样子获客就会产生影响
                const oldBizCode = this.bizCode
                bizCode !== 1030 && (this.bizCode = bizCode)
                const hasExitUser = [1007, 1008, 1015, 1029].includes(bizCode)
                hasExitUser && this.getUserInfo(false)
                switch (bizCode) {
                    case 1007:// 注册成功，去微信授权
                        this.switchBindWechatPage()
                        break
                    case 1008:
                        // 登录成功，去微信授权
                        // 说明用户已经手机号码注册了，可以在第一步直接去绑定微信
                        if (type === 'getuserinfo') {
                            await this.handleBindWechat({
                                detail: params
                            })
                        } else {
                            this.switchBindWechatPage()
                        }
                        break
                    case 1029: // 6800版本用户注册成功，跳转绑定手机号
                        this.switchBindWechatPage()
                        break
                    case 1030:// 6800版本
                    case 1015: // 普通版本
                        // 登录成功，跳回来源页
                        this.backPage()
                        break
                    default:
                        this.bizCode = oldBizCode
                        this.$toast(msg)
                        break
                }
                bizCode !== 1008 && type !== 'getuserinfo' && this.$hideLoading()
            } catch (error) {
                console.log('error', error)
                this.$hideLoading()
            }
        },
        switchBindWechatPage() {
            this.$hideLoading()
            if (this.$Route.name !== 'login') {
                this.jump('login', { pageIndex: 1 }, 'replaceAll')
            } else {
                this.pageIndex = 1
            }
        },
        /**
         * 绑定微信
         * data {iv, encryptedData}授权信息iv跟encryptedData
         * cancelCallback 取消成功回调
        */
        async handleBindWechat(data, cancelCallback = false) {
            const { detail } = data
            if (!detail.encryptedData) {
                return this.getUserInfo(false)
            }
            cancelCallback && this.$loading()
            try {
                const { code } = await this.getCode('weixin')
                const { bizCode, msg } = await this.$http('usersbindwechat', { ...detail, code })
                if (cancelCallback) {
                    this.$hideLoading()
                    this.$toast(msg)
                    this.$emit('getuserinfo', {
                        type: 'getUserInfo',
                        detail: {}
                    })
                } else {
                    switch (bizCode) {
                        case 1011: // 绑定成功
                        case 1015: // 登陆成功
                            this.backPage()
                            break
                        case 1012: // 绑定失败
                            // 如果是第一步，说明之前已经获取过手机号码了，这边绑定失败也可以正常使用
                            if (this.pageIndex === 0) {
                                this.backPage()
                            } else {
                                this.$toast(msg)
                            }
                            break
                        default:
                            this.$toast(msg)
                            break
                    }
                }
            } catch (error) {
                cancelCallback && this.$hideLoading()
            }
        },
        getLoginCode(provider) {
            return new Promise((r, s) => {
                uni.login({
                    provider,
                    success: (loginRes) => {
                        this.loginRes = loginRes
                        r(loginRes)
                    },
                    fail: (res) => {
                        console.log('??? login error', res)
                        s(res)
                        this.$toast(res.errMsg)
                    }
                })
            })
        },
        getCode(provider) { // 获取登录code
            return new Promise((r, s) => {
                uni.checkSession({
                    success: () => {
                        this.getLoginCode(provider).then(r)
                    },
                    fail: () => {
                        this.getLoginCode(provider).then(r).catch(s)
                    }
                })
            })
        },
        // #endif
        // #ifdef H5
        /**
         * H5获取微信授权
         * bind_type：绑定类型
         * 0正常 1用户绑定微信
        */
        async getWxUrl(target) { // 获取微信
            target = target || 'user/login/bind-mobile'
            const baseUrl = window.location.origin + this.$Router.$route.options.base
            uni.setStorageSync(this.$config.loginQueryCatchName, this.$Route.query)
            const h5Redirect = encodeURIComponent(baseUrl + target)
            const query = {
                h5_redirect: h5Redirect,
                ...this.relate,
                parent_id: this.parentId
            }
            window.location.replace(`${this.curDomain_}/WxApp/getWxUrl${this.$c.parse(query)}`)
        },
        // #endif
        // 商家是否开启协议
        async getAgreementStatus() {
            const { data: agreement } = await this.$http('agreementStatus', { type: 1 }) // 1 用户协议 2会员购买协议 3会员资料协议4商家套餐升级协议 6 隐私协议
            this.agreement = agreement
            const { data: privacy } = await this.$http('agreementStatus', { type: 6 }) // 1 用户协议 2会员购买协议 3会员资料协议4商家套餐升级协议 6 隐私协议
            this.privacy = privacy
        },
        async getUserInfo(abort = true) {
            const { data } = await this.$http('userInfo', {}, { abort })
            // 处理工作台/我的不同页面首次登陆跳转问题
            await this.$store.dispatch('config/setShopConfig')
            // 是默认头像, 且不是审核模式时 
            // is_auth_nick_name 1 需要头像昵称授权 2不需要
            if (!this.shopInfo_.app_review && this.shopInfo_.is_auth_nick_name !== 2 && (data.is_empty_user_picture === 1 || !data.nick_name)) {
                return { modalFlag: true }
            }
            return data
        },
        async backPage(abort = true) {
            const { modalFlag = false } = await this.getUserInfo(abort)
            if (modalFlag) return (this.modalFlag = modalFlag)

            /* 下面代码只针对装修时代版本 s */
            const { data: { role = false } } = await this.$http('isCheckedRole')
            // 如果需要选择身份
            if (!role) {
                // 直接跳转首页
                this.$jump('home', {}, 'replaceAll')
                return
            }
            /* 下面代码只针对装修时代版本 e */

            this.$backRef(null, this.$Route.query, true)
        },
        // 通过key值判断用户是否注册过
        async isRegisterByKey(type) {
            let isRegister = false
            try {
                await this.$http('isRegisterByKey', { key: this.loginKey, type })
                isRegister = true
            } catch (error) {
                isRegister = false
            }
            return isRegister
        },
        // 校验手机是否登录
        handleInputMobile(mobile) {
            if (!mobile || !this.$c.validate('mobile', mobile)) return
            // 获取分享的上级
            this.getStorage()
            let timer = 0
            // #ifdef H5
            timer = 100
            // #endif
            setTimeout(async () => {
                // 需要填入二维码才需要去查询手机号是否已经注册
                if (this.needInvitationCode_ && String(this.registerMobile) !== String(mobile)) {
                    try {
                        await this.$http('isRegisterByMobile', { mobile })
                        // 如果走到这边表示用户已经注册
                        this.showInviteInput = false
                        if (!this.registerMobile) {
                            this.registerMobile = mobile
                        }
                    } catch (error) {
                        this.showInviteInput = true
                    }
                }
                // #ifdef MP-WEIXIN
                // 校验手机号是否已经绑定授权
                if (String(this.authMobile) === String(mobile)) return
                const { bizCode } = await this.$http('mobileisauth', { mobile })
                this.isAuto = bizCode === 1001
                if (!this.authMobile) {
                    this.authMobile = mobile
                }
                // #endif
            }, timer)
        },
        finishAuthorize() {
            this.backPage(false)
        }
    }
}
