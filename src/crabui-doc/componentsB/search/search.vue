<template>
    <view class="ca-page">
        <view class="ca-demo-block">
            <text class="ca-demo-block__title">基础功能</text>
            <view class="ca-demo-block__content">
                <view class="ca-page__tag-item">
                    <ca-search v-model="value1" :show-action="false" @change="change" />
                </view>
            </view>
        </view>
        <view class="ca-demo-block">
            <text class="ca-demo-block__title">设置初始值</text>
            <view class="ca-demo-block__content">
                <view class="ca-page__tag-item">
                    <ca-search v-model="value2" :show-action="false" />
                </view>
            </view>
        </view>
        <view class="ca-demo-block">
            <text class="ca-demo-block__title">搜索框形状</text>
            <view class="ca-demo-block__content">
                <view class="ca-page__tag-item">
                    <ca-search v-model="value3" :show-action="false" shape="round" />
                </view>
            </view>
            <view class="ca-demo-block__content m-t-10">
                <view class="ca-page__tag-item">
                    <ca-search v-model="value4" :show-action="false" shape="square" />
                </view>
            </view>
        </view>
        <view class="ca-demo-block">
            <text class="ca-demo-block__title">右侧控件</text>
            <view class="ca-demo-block__content">
                <view class="ca-page__tag-item">
                    <ca-search v-model="value5" />
                </view>
            </view>
        </view>
        <view class="ca-demo-block">
            <text class="ca-demo-block__title">禁用输入框</text>
            <view class="ca-demo-block__content">
                <view class="ca-page__tag-item">
                    <ca-search placeholder="输入框被禁用,可以监听点击事件进行跳转" disabled :show-action="false" />
                </view>
            </view>
        </view>
        <view class="ca-demo-block">
            <text class="ca-demo-block__title">点击左侧图标</text>
            <view class="ca-demo-block__content">
                <view class="ca-page__tag-item">
                    <ca-search v-model="value6" :show-action="false" @click-icon="clickIcon" />
                </view>
            </view>
        </view>
        <view class="ca-demo-block">
            <text class="ca-demo-block__title">搜索框内容水平对齐</text>
            <view class="ca-demo-block__content">
                <view class="ca-page__tag-item">
                    <ca-search v-model="value7" :show-action="false" input-align="left" />
                </view>
            </view>
            <view class="ca-demo-block__content m-t-10">
                <view class="ca-page__tag-item">
                    <ca-search v-model="value8" :show-action="false" input-align="center" />
                </view>
            </view>
            <view class="ca-demo-block__content m-t-10">
                <view class="ca-page__tag-item">
                    <ca-search v-model="value9" :show-action="false" input-align="right" />
                </view>
            </view>
        </view>
        <view class="ca-demo-block">
            <text class="ca-demo-block__title">自定义</text>
            <view class="ca-demo-block__content">
                <view class="ca-page__tag-item">
                    <ca-search
                        v-model="value10" :show-action="false" border-color="rgb(230, 230, 230)"
                        bg-color="#fff" />
                </view>
            </view>
            <view class="ca-demo-block__content m-t-10">
                <view class="ca-page__tag-item">
                    <ca-search v-model="value11" :show-action="false" search-icon-color="#FF0000" />
                </view>
            </view>
            <view class="ca-demo-block__content m-t-10">
                <view class="ca-page__tag-item">
                    <ca-search v-model="value12" :show-action="false" placeholder-color="#FF0000" />
                </view>
            </view>
            <view class="ca-demo-block__content m-t-10">
                <view class="ca-page__tag-item">
                    <ca-search v-model="value13" :show-action="false" color="#FF0000" />
                </view>
            </view>
            <view class="ca-demo-block__content m-t-10">
                <view class="ca-page__tag-item">
                    <ca-search v-model="value14" label="手机" :show-action="false" />
                </view>
            </view>
            <view class="ca-demo-block__content m-t-10">
                <view class="ca-page__tag-item">
                    <ca-search v-model="value15" search-icon="scan" :show-action="false" />
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            value1: '',
            value2: '天山雪莲',
            value3: '',
            value4: '',
            value5: '',
            value6: '',
            value7: '',
            value8: '',
            value9: '',
            value10: '',
            value11: '',
            value12: '',
            value13: '',
            value14: '',
            value15: ''
        }
    },
    watch: {
        value1(newValue, oldValue) {
            // console.log('value1', newValue);
        }
    },
    methods: {
        change(e) {
            console.log(e)
        },
        clickIcon() {
            uni.$ca.toast('点击了左侧图标')
        }
    }
}
</script>

<style lang="scss">
.ca-page__tag-item {
    @include flex(column);
    flex: 1
}

.m-t-10 {
    margin-top: 10px;
}
</style>
