<template>
    <view class="demo-page">
        <view>按钮演示</view>

        <!-- 默认按钮 -->
        <ca-button type="default" @click="onClick">默认按钮</ca-button>

        <!-- 主题按钮 -->
        <ca-button type="primary" @click="onClick">主题按钮</ca-button>

        <!-- 成功按钮 -->
        <ca-button type="success" @click="onClick">成功按钮</ca-button>

        <!-- 信息按钮 -->
        <ca-button type="info" @click="onClick">信息按钮</ca-button>

        <!-- 警告按钮 -->
        <ca-button type="warning" @click="onClick">警告按钮</ca-button>

        <!-- 危险按钮 -->
        <ca-button type="danger" @click="onClick">危险按钮</ca-button>

        <!-- 禁用按钮 -->
        <ca-button disabled @click="onClick">禁用按钮</ca-button>

        <!-- 加载按钮 -->
        <ca-button :loading="true" loading-text="加载中" @click="onClick" />

        <!-- 按钮尺寸 -->
        <view class="button-sizes">
            <ca-button size="mini" @click="onClick">迷你按钮</ca-button>
            <ca-button size="small" @click="onClick">小按钮</ca-button>
            <ca-button size="normal" @click="onClick">普通按钮</ca-button>
            <ca-button size="large" @click="onClick">大按钮</ca-button>
        </view>

        <!-- 圆形按钮 -->
        <ca-button circle icon="home" @click="onClick" />

        <!-- 带图标的按钮 -->
        <ca-button type="primary" icon="search" @click="onClick">搜索</ca-button>
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
