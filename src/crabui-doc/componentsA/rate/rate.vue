<template>
    <view class="ca-page">
        <view class="ca-demo-block">
            <text class="ca-demo-block__title">基本案例</text>
            <view class="ca-demo-block__content">
                <view class="ca-page__tag-item">
                    <ca-rate size="20" />
                </view>
            </view>
        </view>
        <view class="ca-demo-block">
            <text class="ca-demo-block__title">自定义选中星星数量</text>
            <view class="ca-demo-block__content">
                <view class="ca-page__tag-item">
                    <ca-rate
                        v-model="value"
                        size="20"
                        @change="change"
                    />
                </view>
            </view>
        </view>
        <view class="ca-demo-block">
            <text class="ca-demo-block__title">自定义星星大小</text>
            <view class="ca-demo-block__content">
                <view class="ca-page__tag-item">
                    <ca-rate size="30" count="4" />
                </view>
            </view>
        </view>
        <view class="ca-demo-block">
            <text class="ca-demo-block__title">是否禁用评分</text>
            <view class="ca-demo-block__content">
                <view class="ca-page__rate-item">
                    <ca-rate size="20" disabled />
                </view>
            </view>
        </view>
        <view class="ca-demo-block">
            <text class="ca-demo-block__title">是否只读评分</text>
            <view class="ca-demo-block__content">
                <view class="ca-page__rate-item">
                    <ca-rate size="20" readonly />
                </view>
            </view>
        </view>
        <view class="ca-demo-block">
            <text class="ca-demo-block__title">自定义选中星星颜色</text>
            <view class="ca-demo-block__content">
                <view class="ca-page__rate-item">
                    <ca-rate
                        v-model="activeColorValue"
                        size="20"
                        active-color="#2979ff"
                    />
                </view>
            </view>
        </view>
        <view class="ca-demo-block">
            <text class="ca-demo-block__title">自定义未选中星星颜色</text>
            <view class="ca-demo-block__content">
                <view class="ca-page__rate-item">
                    <ca-rate
                        v-model="value1"
                        size="20"
                        inactive-color="#2979ff"
                    />
                </view>
            </view>
        </view>
        <view class="ca-demo-block">
            <text class="ca-demo-block__title">禁止触摸选择</text>
            <view class="ca-demo-block__content">
                <view class="ca-page__rate-item">
                    <ca-rate size="20" :touchable="false" />
                </view>
            </view>
        </view>
        <view class="ca-demo-block">
            <text class="ca-demo-block__title">允许触摸选择</text>
            <view class="ca-demo-block__content">
                <view class="ca-page__rate-item">
                    <ca-rate size="20" :touchable="true" />
                </view>
            </view>
        </view>
        <view class="ca-demo-block">
            <text class="ca-demo-block__title">是否允许半星</text>
            <view class="ca-demo-block__content">
                <view class="ca-page__rate-item">
                    <ca-rate
                        v-model="HalfValue"
                        size="20"
                        :allow-half="true"
                        @change="change"
                    />
                </view>
            </view>
        </view>
        <view class="ca-demo-block">
            <text class="ca-demo-block__title">自定义选中的图标</text>
            <view class="ca-demo-block__content">
                <view class="ca-page__rate-item">
                    <ca-rate
                        v-model="activeIconValue"
                        size="20"
                        inactive-icon="heart"
                        active-icon="heart-fill"
                    />
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            // 自定义星星的个数
            value: 3,
            value1: 2,
            // 自定义选择星星颜色个数
            activeColorValue: 3,
            // 是否允许半星的个数
            HalfValue: 3.5,
            // 自定义图标星星个数
            activeIconValue: 3
        }
    },
    watch: {
        value(newValue, oldValue) {
            // console.log(newValue);
        }
    },
    methods: {
        change(e) {
            // console.log('change', e);
        }
    }
}
</script>
