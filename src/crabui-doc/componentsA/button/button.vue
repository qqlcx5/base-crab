<template>
    <view class="-page">
        <view class="u-demo-block">
            <text class="u-demo-block__title">按钮类型</text>
            <view class="u-demo-block__content">
                <view class="u-page__button-item">
                    <ca-button text="默认按钮" size="normal" type="info" @click="click">
                        默认按钮
                    </ca-button>
                </view>
                <view class="u-page__button-item">
                    <ca-button text="成功按钮" size="normal" type="success">
                        默认按钮
                    </ca-button>
                </view>
                <view class="u-page__button-item">
                    <ca-button text="危险按钮" size="normal" type="danger">
                        默认按钮
                    </ca-button>
                </view>
                <view class="u-page__button-item">
                    <ca-button text="主要按钮" size="normal" type="primary">
                        默认按钮
                    </ca-button>
                </view>
                <view class="u-page__button-item">
                    <ca-button text="警告按钮" size="normal" type="warning">
                        默认按钮
                    </ca-button>
                </view>
            </view>
        </view>
        <view class="u-demo-block">
            <text class="u-demo-block__title">镂空按钮</text>
            <view class="u-demo-block__content">
                <view class="u-page__button-item">
                    <ca-button text="镂空按钮" size="normal" type="info" plain>镂空按钮</ca-button>
                </view>
                <view class="u-page__button-item">
                    <ca-button text="镂空按钮" size="normal" type="success" plain>镂空按钮</ca-button>
                </view>
                <view class="u-page__button-item">
                    <ca-button text="镂空按钮" size="normal" type="danger" plain>镂空按钮</ca-button>
                </view>
                <view class="u-page__button-item">
                    <ca-button text="镂空按钮" size="normal" type="primary" plain>镂空按钮</ca-button>
                </view>
                <view class="u-page__button-item">
                    <ca-button text="镂空按钮" size="normal" type="warning" plain>镂空按钮</ca-button>
                </view>
            </view>
        </view>

        <view class="u-demo-block">
            <text class="u-demo-block__title">禁用按钮</text>
            <view class="u-demo-block__content">
                <view class="u-page__button-item">
                    <ca-button disabled size="normal" type="info">
                        禁用按钮
                    </ca-button>
                </view>
                <view class="u-page__button-item">
                    <ca-button disabled size="normal" type="success">
                        禁用按钮
                    </ca-button>
                </view>
                <view class="u-page__button-item">
                    <ca-button disabled size="normal" type="danger">
                        禁用按钮
                    </ca-button>
                </view>
                <view class="u-page__button-item">
                    <ca-button disabled size="normal" type="primary">
                        禁用按钮
                    </ca-button>
                </view>
                <view class="u-page__button-item">
                    <ca-button disabled size="normal" type="warning">
                        禁用按钮
                    </ca-button>
                </view>
            </view>
        </view>

        <view class="u-demo-block">
            <text class="u-demo-block__title">加载中</text>
            <view class="u-demo-block__content">
                <view class="u-page__button-item">
                    <ca-button loading-text="加载中" size="normal" loading loading-mode="circle" type="success" />
                </view>
                <view class="u-page__button-item">
                    <ca-button class="button-layout__item" loading-text="加载中" size="normal" loading type="danger" />
                </view>
            </view>
        </view>
        <view class="u-demo-block">
            <text class="u-demo-block__title">按钮图标&按钮形状</text>
            <view class="u-demo-block__content">
                <view class="u-page__button-item">
                    <ca-button text="按钮图标" size="normal" icon="ca-sousuo" plain type="warning">按钮图标</ca-button>
                </view>
                <view class="u-page__button-item">
                    <ca-button text="按钮图标" size="normal" plain circle type="success">
                        按钮图标
                    </ca-button>
                </view>
            </view>
        </view>
        <view class="u-demo-block">
            <text class="u-demo-block__title">自定义颜色</text>
            <view class="u-demo-block__content">
                <view class="u-page__button-item">
                    <ca-button
                        text="渐变色按钮" size="normal"
                        color="linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186))">
                        渐变色按钮
                    </ca-button>
                </view>
                <view class="u-page__button-item">
                    <ca-button
                        text="渐变色按钮" size="normal"
                        color="linear-gradient(to right, rgb(220, 194, 11), rgb(4, 151, 99))">
                        渐变色按钮
                    </ca-button>
                </view>
                <view class="u-page__button-item">
                    <ca-button text="青绿色按钮" size="normal" color="rgb(10, 185, 156)"> 青绿色按钮 </ca-button>
                </view>
            </view>
        </view>

        <view class="u-demo-block">
            <text class="u-demo-block__title">自定义大小</text>
            <view
                class="u-demo-block__content"
                style="padding-bottom: 15px; flex-direction: column;align-items: stretch;flex-wrap: nowrap;">
                <ca-button text="超大尺寸" size="large" type="success"> 超大尺寸 </ca-button>
            </view>
            <view class="u-demo-block__content">
                <view class="u-page__button-item">
                    <ca-button text="普通尺寸" size="normal" type="danger"> 普通尺寸 </ca-button>
                </view>
                <view class="u-page__button-item">
                    <ca-button text="小型尺寸" size="small" type="primary">小型尺寸</ca-button>
                </view>
                <view class="u-page__button-item">
                    <ca-button class="button-layout__item" text="超小尺寸" size="mini" type="warning"> 超小尺寸 </ca-button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            // type: 'default',
            // disabled: false
        }
    },
    onLoad() {
        setTimeout(() => {
            this.type = 'primary'
            this.disabled = true
        }, 2000)
    },
    methods: {
        click() {
            console.log('click')
        }
    }
}
</script>

<style lang="scss">
.u-page {
    &__button-item {
        margin: 0 15px 15px 0;
    }
}

.u-demo-block__content {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
}
</style>
