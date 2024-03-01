<template>
    <view class="cell-page">
        <view class="ca-page__item">
            <text class="ca-page__item__title">基础功能</text>
            <ca-cell-group>
                <ca-cell title="crab UI" value="内容" />
                <ca-cell title="利剑出鞘" value="内容1111" />
            </ca-cell-group>
        </view>
        <view class="ca-page__item">
            <text class="ca-page__item__title">自定义图标/图片</text>
            <ca-cell-group>
                <ca-cell title="单元格" icon="ca-star" />
                <ca-cell title="单元格" icon="https://cdn.uviewui.com/uview/example/tag.png" />
            </ca-cell-group>
        </view>
        <view class="ca-page__item">
            <text class="ca-page__item__title">自定义大小</text>
            <ca-cell-group size="large">
                <ca-cell title="单元格" value="内容" />
                <ca-cell title="单元格" value="内容" label="描述信息" />
            </ca-cell-group>
        </view>
        <view class="ca-page__item">
            <text class="ca-page__item__title">显示右箭头</text>
            <ca-cell-group>
                <ca-cell title="单元格" value="组件" arrow />
                <ca-cell title="单元格" value="工具" arrow-direction="up" arrow />
                <ca-cell title="单元格" value="模板" arrow-direction="down" arrow />
            </ca-cell-group>
        </view>
        <view class="ca-page__item">
            <text class="ca-page__item__title">跳转页面</text>
            <ca-cell-group>
                <ca-cell title="打开标签页" arrow url="/pages/componentsB/tag/tag" />
                <ca-cell title="打开徽标页" arrow url="/pages/componentsB/badge/badge" />
            </ca-cell-group>
        </view>
        <view class="ca-page__item">
            <text class="ca-page__item__title">右侧内容垂直居中</text>
            <ca-cell-group>
                <ca-cell title="单元格" value="内容" label="描述信息" center />
            </ca-cell-group>
        </view>
        <view class="ca-page__item">
            <text class="ca-page__item__title">自定义插槽</text>
            <ca-cell-group>
                <ca-cell value="内容">
                    <template #title>
                        <view class="ca-slot-title">
                            <text class="ca-cell-text">单元格</text>
                            <ca-tag text="标签" plain size="mini" type="warning" />
                        </view>
                    </template>
                </ca-cell>
                <ca-cell title="单元格" arrow>
                    <template #value>
                        <text class="ca-slot-value">
                            99
                        </text>
                    </template>
                </ca-cell>
            </ca-cell-group>
        </view>
    </view>
</template>
<script>
export default {
    data() {
        return {}
    },
    methods: {
        click() {
            console.log('Cell is clicked.')
        }
    }
}
</script>

<style lang="scss">
.cell-page {
    padding-bottom: 20px;
}

.cell-box {
    &__title {
        font-size: 14px;
        color: rgb(143, 156, 162);
        margin: 20px 0px 0px 15px;
    }

    &__block {
        // background-color: #fff;
        margin-top: 20px;
    }
}

.ca-page {
    padding: 0;

    &__item {

        &__title {
            color: $color-primary;
            background-color: $bg-color;
            padding: 15px;
            font-size: 15px;
            display: flex;

            &__slot-title {
                color: $color-primary;
                font-size: 14px;
            }
        }
    }
}

.ca-slot-title {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.ca-cell-text {
    font-size: 15px;
    line-height: 22px;
    color: #303133;
    margin-right: 5px;
}

.ca-slot-value {
    line-height: 17px;
    text-align: center;
    font-size: 10px;
    padding: 0 5px;
    height: 17px;
    color: #FFFFFF;
    border-radius: 100px;
    background-color: #f56c6c;
}
</style>
