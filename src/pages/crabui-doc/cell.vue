<template>
    <view>
        <ca-cell-group
            border :icon-style="{
                color: 'red',
                fontSize: '22px'
            }">
            <ca-cell title="用户资料" icon="ca-shijian1" :cell-style="{ backgroundColor: '#f3f3f3' }" arrow />
            <ca-cell
                :icon-style="{
                    color: '#07c160',
                    fontSize: '28px'
                }" title="设置" icon="ca-warning" arrow />
            <ca-cell title="通知" label="描述信息" icon="ca-youxiang" :value="'启用'" />
            <ca-cell title="关于" :value="'版本 1.0.0'" :border="false" />
        </ca-cell-group>
        <ca-cell-group title="分组 title 插槽">
            <ca-cell title="单元格" value="内容" />
            <ca-cell value="内容" />
            <ca-cell value="内容">
                <!-- 使用 title 插槽来自定义标题 -->
                <template #title>
                    <view class="ca-flex-column">
                        <view class="custom-title">单元格</view>
                        <ca-tag type="danger">标签</ca-tag>
                    </view>
                </template>
            </ca-cell>
        </ca-cell-group>
    </view>
</template>
<script>
export default {
    name: 'DemoPage',
    methods: {
        onClick() {
            console.log('按钮被点击')
        }
    }
}
</script>
<style scoped>
.demo-page {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    h2 {
        margin-bottom: 20px;
    }

    .button-sizes {
        display: flex;
        gap: 10px;
    }
}
</style>
