<template>
    <ca-cell-group
        border :icon-style="{
            color: 'red',
            fontSize: '22px'
        }">
        <ca-cell title="User Profile" icon="ca-shijian1" :cell-style="{ backgroundColor: '#f3f3f3' }" arrow />
        <ca-cell title="Settings" icon="ca-warning" arrow />
        <ca-cell title="Notifications" label="描述信息" icon="ca-youxiang" :value="'Enabled'" />
        <ca-cell title="About" :value="'Version 1.0.0'" :border="false" />
    </ca-cell-group>
    <ca-cell-group title="分组 title 插槽">
        <ca-cell title="单元格" value="内容" />
        <ca-cell value="内容" />
        <ca-cell value="内容">
            <!-- 使用 title 插槽来自定义标题 -->
            <template #title>
                <span class="custom-title">单元格</span>
                <ca-tag type="danger">标签</ca-tag>
            </template>
        </ca-cell>
    </ca-cell-group>
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
