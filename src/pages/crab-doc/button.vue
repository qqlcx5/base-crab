<template>
    <view class="demo-page">
        <view>按钮演示</view>

        <!-- 默认按钮 -->
        <ca-botton type="default" @click="onClick">默认按钮</ca-botton>

        <!-- 主题按钮 -->
        <ca-botton type="primary" @click="onClick">主题按钮</ca-botton>

        <!-- 成功按钮 -->
        <ca-botton type="success" @click="onClick">成功按钮</ca-botton>

        <!-- 信息按钮 -->
        <ca-botton type="info" @click="onClick">信息按钮</ca-botton>

        <!-- 警告按钮 -->
        <ca-botton type="warning" @click="onClick">警告按钮</ca-botton>

        <!-- 危险按钮 -->
        <ca-botton type="danger" @click="onClick">危险按钮</ca-botton>

        <!-- 禁用按钮 -->
        <ca-botton disabled @click="onClick">禁用按钮</ca-botton>

        <!-- 加载按钮 -->
        <ca-botton :loading="true" loading-text="加载中" @click="onClick" />

        <!-- 按钮尺寸 -->
        <view class="button-sizes">
            <ca-botton size="mini" @click="onClick">迷你按钮</ca-botton>
            <ca-botton size="small" @click="onClick">小按钮</ca-botton>
            <ca-botton size="normal" @click="onClick">普通按钮</ca-botton>
            <ca-botton size="large" @click="onClick">大按钮</ca-botton>
        </view>

        <!-- 圆形按钮 -->
        <ca-botton circle icon="home" @click="onClick" />

        <!-- 带图标的按钮 -->
        <ca-botton type="primary" icon="search" @click="onClick">搜索</ca-botton>
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
  align-items: start;
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
