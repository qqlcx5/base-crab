<template>
    <view class="demo-page">
        <view>按钮演示</view>
        <view class="ca-flex ca-flex-wrap">
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
        </view>

        <!-- 禁用按钮 -->
        <ca-button type="primary" disabled @click="onClick">禁用按钮</ca-button>

        <!-- 加载按钮 -->
        <view class="ca-flex">
            <ca-button type="primary" :loading="true" width="158" @click="onClick" />
            <view class="ca-ml-20">
                <ca-button type="primary" :loading="true" loading-text="加载中..." @click="onClick" />
            </view>
        </view>

        <!-- 按钮尺寸 -->
        <view class="button-sizes">
            <ca-button size="mini" @click="onClick">小号按钮</ca-button>
            <ca-button size="small" @click="onClick">中号按钮</ca-button>
            <ca-button size="normal" @click="onClick">普通按钮</ca-button>
            <ca-button size="large" @click="onClick">大按钮</ca-button>
        </view>

        <!-- 圆形按钮 -->
        <ca-button>
            圆形按钮
        </ca-button>

        <!-- 带图标的按钮 -->
        <ca-button type="primary" icon="ca-sousuo" @click="onClick">搜索</ca-button>
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
