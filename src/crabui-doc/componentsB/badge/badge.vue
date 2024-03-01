<template>
    <view class="u-page">
        <!-- <view class="u-demo-block">
            <text class="u-demo-block__title">直角边形状</text>
            <view class="u-demo-block__content">
                <view class="u-page__tag-item">
                    <ca-badge :value="1500" />
                </view>
            </view>
        </view> -->
        <view class="u-demo-block">
            <text class="u-demo-block__title">徽标数显示方式</text>
            <view class="u-demo-block__content">
                <view class="u-page__tag-item">
                    <ca-badge :value="5132" />
                </view>
                <view class="u-page__tag-item">
                    <ca-badge :value="1011" />
                </view>
                <view class="u-page__tag-item">
                    <ca-badge :value="1500" />
                </view>

                <view class="u-page__tag-item">
                    <ca-badge :value="45187" />
                </view>
            </view>
        </view>
        <view class="u-demo-block">
            <text class="u-demo-block__title">显示圆点</text>
            <view class="u-demo-block__content">
                <view class="u-page__tag-item">
                    <ca-badge dot />
                </view>
            </view>
        </view>
        <!-- <view class="u-demo-block">
            <text class="u-demo-block__title">自定义主题</text>
            <view class="u-demo-block__content">
                <view class="u-page__tag-item">
                    <ca-badge :value="9" type="error" />
                </view>
                <view class="u-page__tag-item">
                    <ca-badge :value="9" type="warning" />
                </view>
                <view class="u-page__tag-item">
                    <ca-badge :value="9" type="success" />
                </view>
                <view class="u-page__tag-item">
                    <ca-badge :value="9" type="primary" />
                </view>
            </view>
        </view> -->
        <!-- <view class="u-demo-block">
            <text class="u-demo-block__title">反转色</text>
            <view class="u-demo-block__content">
                <view class="u-page__tag-item">
                    <ca-badge :value="9" type="error" inverted />
                </view>
                <view class="u-page__tag-item">
                    <ca-badge :value="1532" inverted type="warning" />
                </view>
                <view class="u-page__tag-item">
                    <ca-badge :value="12" inverted type="success" />
                </view>
                <view class="u-page__tag-item">
                    <ca-badge :value="999" inverted type="primary" />
                </view>
            </view>
        </view> -->
    </view>
</template>

<script>
export default {
    data() {
        return {}
    }
}
</script>

<style lang="scss">
.box {
    justify-content: space-between;
}

.u-page__tag-item {
    margin-right: 40px;
    margin-top: 10px;
    background-color: #E6E6E6;
    position: relative;

}

.badge-box {
    width: 45px;
    height: 45px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    background-color: #E6E6E6;
}

.u-demo-block__content {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    background: #000;
}
</style>
