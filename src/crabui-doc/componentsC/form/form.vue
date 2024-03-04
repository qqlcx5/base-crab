<template>
    <view class="u-page">
        <u-navbar title="表单" safe-area-inset-top fixed placeholder @left-click="navigateBack" />
        <view class="u-demo-block">
            <text class="u-demo-block__title">基础使用</text>
            <view class="u-demo-block__content">
                <!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
                <ca-form ref="form1" label-position="left" :model="model1">
                    <ca-form-item ref="item1" label="姓名" prop="userInfo.name" border-bottom>
                        <ca-input v-model="model1.userInfo.name" border="none" placeholder="姓名,只能为中文" />
                    </ca-form-item>
                    <ca-form-item
                        ref="item1" label="性别" prop="userInfo.sex" border-bottom @click="
                            showSex = true;
                            hideKeyboard();
                        ">
                        <ca-input
                            v-model="model1.userInfo.sex" placeholder="请选择性别"
                            border="none" />
                        <template #right>
                            <ca-icon name="ca-sousuo" />
                        </template>
                    </ca-form-item>
                    <ca-form-item ref="item2" label="水果" prop="radiovalue1" border-bottom>
                        {{ model1.radiovalue1 }}
                        <ca-radio-group v-model="model1.radiovalue1">
                            <ca-radio
                                v-for="(item, index) in radiolist1" :key="index"
                                :custom-style="{ marginRight: '16px' }" :name="item.name">
                                {{ item.name }}
                            </ca-radio>
                        </ca-radio-group>
                    </ca-form-item>
                    <ca-form-item ref="item3" label="兴趣爱好" prop="checkboxValue1" border-bottom label-width="80">
                        <u-checkbox-group v-model="model1.checkboxValue1" shape="square" @change="change">
                            <u-checkbox
                                v-for="(item, index) in checkboxList1" :key="index"
                                :custom-style="{ marginRight: '16px' }" :label="item.name" :name="item.name" />
                        </u-checkbox-group>
                    </ca-form-item>
                    <ca-form-item ref="item3" label="简介" prop="intro" border-bottom>
                        <u--textarea v-model="model1.intro" placeholder="不低于3个字" count />
                    </ca-form-item>
                    <ca-form-item
                        label="住店时间" prop="hotel" label-width="80" border-bottom @click="
                            showCalendar = true;
                            hideKeyboard();
                        ">
                        <ca-input
                            v-model="model1.hotel" disabled disabled-color="#ffffff" placeholder="请选择住店和离店时间"
                            border="none" />

                        <template #right>
                            <u-icon name="arrow-right" />
                        </template>
                    </ca-form-item>
                    <ca-form-item label="验证码" prop="code" label-width="80" border-bottom>
                        <ca-input v-model="model1.code" border="none" placeholder="请填写验证码" />

                        <template #right>
                            <u-button :text="tips" type="success" size="mini" :disabled="disabled1" @tap="getCode" />
                        </template>
                    </ca-form-item>
                    <ca-form-item
                        ref="item1" label="生日" prop="userInfo.birthday" border-bottom @click="
                            showBirthday = true;
                            hideKeyboard();
                        ">
                        <ca-input
                            v-model="model1.userInfo.birthday" disabled disabled-color="#ffffff"
                            placeholder="请选择生日" border="none" />

                        <template #right>
                            <u-icon name="arrow-right" />
                        </template>
                    </ca-form-item>
                </ca-form>
                <u-button type="primary" text="提交" custom-style="margin-top: 50px" @click="submit" />
                <u-button type="error" text="重置" custom-style="margin-top: 10px" @click="reset" />
                <u-action-sheet
                    :show="showSex" :actions="actions" title="请选择性别" description="如果选择保密会报错"
                    @close="showSex = false" @select="sexSelect" />
                <u-calendar
                    :show="showCalendar" mode="range" start-text="住店" end-text="离店"
                    confirm-disabled-text="请选择离店日期" :formatter="formatter" @confirm="calendarConfirm"
                    @close="calendarClose" />
                <u-code
                    ref="uCode" seconds="20" @change="codeChange" @start="disabled1 = true"
                    @end="disabled1 = false" />
                <u-datetime-picker
                    :show="showBirthday" :value="birthday" mode="date" close-on-click-overlay
                    @confirm="birthdayConfirm" @cancel="birthdayClose" @close="birthdayClose" />
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            fileList1: [],
            disabled1: false,
            tips: '',
            value: '',
            showCalendar: false,
            showBirthday: false,
            model1: {
                userInfo: {
                    name: '楼兰',
                    sex: '',
                    birthday: ''
                },
                radiovalue1: '苹果',
                checkboxValue1: [],
                intro: '',
                code: ''
            },
            showSex: false,
            birthday: Number(new Date()),
            actions: [
                {
                    name: '男'
                },
                {
                    name: '女'
                },
                {
                    name: '保密'
                }
            ],
            rules: {
                'userInfo.name': [
                    {
                        type: 'string',
                        required: true,
                        message: '请填写姓名',
                        trigger: ['blur', 'change']
                    },
                    {
                        // 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
                        validator: (rule, value, callback) => {
                            // 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
                            return uni.$u.test.chinese(value)
                        },
                        message: '姓名必须为中文',
                        // 触发器可以同时用blur和change，二者之间用英文逗号隔开
                        trigger: ['change', 'blur']
                    }
                ],
                code: {
                    type: 'string',
                    required: true,
                    len: 4,
                    message: '请填写4位验证码',
                    trigger: ['blur']
                },
                'userInfo.sex': {
                    type: 'string',
                    max: 1,
                    required: true,
                    message: '请选择男或女',
                    trigger: ['blur', 'change']
                },
                radiovalue1: {
                    type: 'string',
                    min: 1,
                    max: 2,
                    message: '橙子有毒',
                    trigger: ['change']
                },
                checkboxValue1: {
                    type: 'array',
                    min: 2,
                    required: true,
                    message: '不能太宅，至少选两项',
                    trigger: ['change']
                },
                intro: {
                    type: 'string',
                    min: 3,
                    required: true,
                    message: '不低于3个字',
                    trigger: ['change']
                },
                hotel: {
                    type: 'string',
                    min: 2,
                    required: true,
                    message: '请选择住店时间',
                    trigger: ['change']
                },
                'userInfo.birthday': {
                    type: 'string',
                    required: true,
                    message: '请选择生日',
                    trigger: ['change']
                }
            },
            radiolist1: [
                {
                    name: '苹果',
                    disabled: false
                },
                {
                    name: '香蕉',
                    disabled: false
                },
                {
                    name: '毒橙子',
                    disabled: false
                }
            ],
            checkboxList1: [
                {
                    name: '羽毛球',
                    disabled: false
                },
                {
                    name: '跑步',
                    disabled: false
                },
                {
                    name: '爬山',
                    disabled: false
                }
            ]
        }
    },
    onReady() {
        // 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则
        // this.$refs.form1?.setRules(this.rules)
    },
    methods: {
        afterRead(event) {
            this.fileList1.push({
                url: event.file,
                status: 'uploading',
                message: '上传中'
            })
        },
        groupChange(n) {
            // console.log('groupChange', n);
        },
        radioChange(n) {
            // console.log('radioChange', n);
        },
        navigateBack() {
            uni.navigateBack()
        },
        sexSelect(e) {
            this.model1.userInfo.sex = e.name
            this.$refs.form1.validateField('userInfo.sex')
        },
        change(e) {
            // console.log(e);
        },
        formatter(day) {
            const d = new Date()
            const month = d.getMonth() + 1
            const date = d.getDate()
            if (day.month === month && day.day === date + 3) {
                day.bottomInfo = '有优惠'
                day.dot = true
            }
            return day
        },
        calendarConfirm(e) {
            this.showCalendar = false
            this.model1.hotel = `${e[0]} / ${e[e.length - 1]}`
            this.$refs.form1.validateField('hotel')
        },
        codeChange(text) {
            this.tips = text
        },
        getCode() {
            if (this.$refs.uCode.canGetCode) {
                // 模拟向后端请求验证码
                uni.showLoading({
                    title: '正在获取验证码'
                })
                setTimeout(() => {
                    uni.hideLoading()
                    // 这里此提示会被this.start()方法中的提示覆盖
                    uni.$u.toast('验证码已发送')
                    // 通知验证码组件内部开始倒计时
                    this.$refs.uCode.start()
                }, 2000)
            } else {
                uni.$u.toast('倒计时结束后再发送')
            }
        },
        calendarClose() {
            this.showCalendar = false
            this.$refs.form1.validateField('hotel')
        },
        birthdayClose() {
            this.showBirthday = false
            this.$refs.form1.validateField('userInfo.birthday')
        },
        birthdayConfirm(e) {
            this.showBirthday = false
            this.model1.userInfo.birthday = uni.$u.timeFormat(e.value, 'yyyy-mm-dd')
            this.$refs.form1.validateField('userInfo.birthday')
        },
        submit() {
            // 如果有错误，会在catch中返回报错信息数组，校验通过则在then中返回true
            this.$refs.form1
                .validate()
                .then(res => {
                    uni.$u.toast('校验通过')
                })
                .catch(errors => {
                    uni.$u.toast('校验失败')
                })
        },
        reset() {
            const validateList = ['userInfo.name', 'userInfo.sex', 'radiovalue1', 'checkboxValue1', 'intro', 'hotel', 'code', 'userInfo.birthday']
            this.$refs.form1.resetFields()
            this.$refs.form1.clearValidate()
            setTimeout(() => {
                this.$refs.form1?.clearValidate(validateList)
                // 或者使用 this.$refs.form1.clearValidate()
            }, 10)
        },
        hideKeyboard() {
            uni.hideKeyboard()
        }
    }
}
</script>
