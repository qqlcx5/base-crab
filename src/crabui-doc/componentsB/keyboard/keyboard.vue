<template>
    <view class="ca-page">
        <!-- <ca-navbar title="键盘" safe-area-inset-top fixed placeholder @left-click="navigateBack" /> -->
        <!-- <ca-gap height="20" bg-color="#fff" /> -->
        输出：{{ input }}
        <ca-cell-group>
            <ca-cell
                v-for="(item, index) in list" :key="index" :title-style="{ fontWeight: 500 }" :title="item.title"
                arrow :icon="item.iconUrl" @click="openKeyboard(index)" />
        </ca-cell-group>
        <ca-keyboard
            v-model="show" :mode="keyData.mode" :dot-disabled="keyData.dotDisabled" :random="keyData.random"
            @close="close" @cancel="cancel" @confirm="confirm" @change="change" @backspace="backspace" />
    </view>
</template>

<script>
export default {
    data() {
        return {
            input: '',
            keyData: {
                mode: '',
                dotDisabled: false,
                random: false
            },
            list: [{
                title: '车牌号键盘',
                iconUrl: 'https://cdn.uviewui.com/uview/demo/keyboard/car.png'
            },
            {
                title: '数字键盘',
                iconUrl: 'https://cdn.uviewui.com/uview/demo/keyboard/number.png'
            },
            {
                title: '身份证键盘',
                iconUrl: 'https://cdn.uviewui.com/uview/demo/keyboard/IdCard.png'
            },
            {
                title: '隐藏键盘"."符号',
                iconUrl: 'https://cdn.uviewui.com/uview/demo/keyboard/dot.png'
            },
            {
                title: '打乱键盘按键的顺序',
                iconUrl: 'https://cdn.uviewui.com/uview/demo/keyboard/order.png'
            }
            ],
            show: false
        }
    },
    methods: {
        navigateBack() {
            uni.navigateBack()
        },
        // 点击展示不同的键盘
        openKeyboard(indexNum) {
            this.keyData = {
                mode: '',
                dotDisabled: false,
                random: false
            }
            if (indexNum === 0) {
                this.keyData.mode = ''
            } else if (indexNum === 1) {
                this.keyData.mode = 'number'
            } else if (indexNum === 2) {
                this.keyData.mode = 'card'
            } else if (indexNum === 3) {
                this.keyData.mode = 'number'
                this.keyData.dotDisabled = true
            } else if (indexNum === 4) {
                this.keyData.mode = 'number'
                this.keyData.random = true
            }
            this.input = ''
            this.show = true
        },
        change(e) {
            // console.log('change');
            const { value } = e.detail
            this.input += value
        },
        close() {
            // console.log('close');
            this.show = false
        },
        cancel() {
            // console.log('cancel');
            this.show = false
        },
        confirm() {
            // console.log('confirm');
            this.show = false
        },
        backspace() {
            this.input = this.input.slice(0, -1)
        }

    }
}
</script>

<style lang="scss">
.ca-page {
    padding: 0;
}
</style>
