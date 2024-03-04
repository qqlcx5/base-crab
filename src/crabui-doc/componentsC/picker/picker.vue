<template>
    <view ref="page" class="ca-page">
        <!-- <ca-navbar title="选择器" safe-area-inset-top fixed placeholder @left-click="navigateBack" /> -->
        <ca-cell-group>
            <ca-cell v-for="(item, index) in list" :key="index" :title="item.title" is-link @click="showPicker(index)">
                <template #icon>
                    <image class="ca-cell-icon" :src="item.iconUrl" mode="widthFix" />
                </template>
            </ca-cell>
        </ca-cell-group>
        <ca-picker v-model="show1" :columns="columns1" @change="change" @cancel="cancel" @confirm="confirm" />
        <ca-picker
            v-model="show2" :columns="columns2" :default-index="[1]" @cancel="cancel" @confirm="confirm"
            @change="change" />
        <ca-picker
            ref="uPicker3" v-model="show3" :columns="columns3" @cancel="cancel" @confirm="confirm"
            @change="changeHandler1" />
        <ca-picker
            ref="uPicker4" v-model="show4" :columns="columns4" :loading="loading" @cancel="cancel"
            @confirm="confirm" @change="changeHandler2" />
        <ca-picker
            v-model="show5" :columns="columns5" title="标题太长就会显示省略号" @cancel="cancel" @confirm="confirm"
            @change="change" />
        <ca-picker
            v-model="show6" :columns="columns6" close-on-click-overlay @cancel="cancel" @confirm="confirm"
            @close="close" @change="change" />
    </view>
</template>

<script>
export default {
    data() {
        return {
            index: 0,
            loading: false,
            columnData: [
                ['深圳', '厦门', '上海', '拉萨'],
                ['得州', '华盛顿', '纽约', '阿拉斯加']
            ],
            columns1: [
                ['中国', '美国', '日本']
            ],
            columns2: [
                ['中国', '美国', '日本']
            ],
            columns3: [
                ['中国', '美国'],
                ['深圳', '厦门', '上海', '拉萨']
            ],
            columns4: [
                ['中国', '美国'],
                ['深圳', '厦门', '上海', '拉萨']
            ],
            columns5: [
                ['中国', '美国', '日本']
            ],
            columns6: [
                ['中国', '美国', '日本']
            ],
            show1: false,
            show2: false,
            show3: false,
            show4: false,
            show5: false,
            show6: false,
            list: [{
                title: '基础使用',
                iconUrl: 'https://cdn.uviewui.com/uview/demo/picker/2.png'
            },
            {
                title: '设置默认项',
                iconUrl: 'https://cdn.uviewui.com/uview/demo/picker/5.png'
            },
            {
                title: '多列联动',
                iconUrl: 'https://cdn.uviewui.com/uview/demo/picker/1.png'
            },
            {
                title: '加载中状态(切换第一列)',
                iconUrl: 'https://cdn.uviewui.com/uview/demo/picker/3.png'
            },
            {
                title: '设置标题',
                iconUrl: 'https://cdn.uviewui.com/uview/demo/picker/4.png'
            }, {
                title: '允许点击遮罩关闭',
                iconUrl: 'https://cdn.uviewui.com/uview/demo/picker/6.png'
            }
            ]
        }
    },
    methods: {
        changeHandler1(e) {
            this.change(e)
            const {
                columnIndex,
                value,
                values,
                index,
                // 微信小程序无法将picker实例传出来，只能通过ref操作
                picker = this.$refs.uPicker3
            } = e
            console.log('🚀 - changeHandler1 - values:', value, values)

            if (columnIndex === 0) {
                picker.setColumnValues(1, this.columnData[index])
            }
        },
        changeHandler2(e) {
            this.change(e)
            const {
                columnIndex,
                value,
                values,
                index,
                // 微信小程序无法将picker实例传出来，只能通过ref操作
                picker = this.$refs.uPicker4
            } = e
            console.log('🚀 - changeHandler1 - values:', value, values)

            if (columnIndex === 0) {
                this.loading = true
                uni.$u.sleep(1500).then(() => {
                    picker.setColumnValues(1, this.columnData[index])
                    this.loading = false
                })
            }
        },
        navigateBack() {
            uni.navigateBack()
        },
        change(e) {
            // console.log('change', e);
        },
        showPicker(index) {
            this.index = index + 1
            this[`show${index + 1}`] = true
        },
        close() {
            // console.log('close');
            this[`show${this.index}`] = false
        },
        confirm(e) {
            // console.log('confirm', e);
            this[`show${this.index}`] = false
        },
        cancel() {
            // console.log('cancel');
            this[`show${this.index}`] = false
        }
    }
}
</script>

<style lang="scss">
.ca-page {
    padding: 0;
}
</style>
