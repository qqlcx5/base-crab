<template>
    <view class="ca-page">
        <view class="ca-demo-block">
            <text class="ca-demo-block__title">基础用法</text>
            <view class="ca-demo-block__content">
                <view class="ca-page__upload-item">
                    <ca-upload
                        :file-list="fileList1" name="1" multiple :max-count="10" @after-read="afterRead"
                        @delete="deletePic" />
                </view>
            </view>
        </view>
        <view class="ca-demo-block">
            <text class="ca-demo-block__title">上传视频</text>
            <view class="ca-demo-block__content">
                <view class="ca-page__upload-item">
                    <ca-upload
                        :file-list="fileList2" name="2" multiple :max-count="10" accept="video"
                        @after-read="afterRead" @delete="deletePic" />
                </view>
            </view>
        </view>
        <view class="ca-demo-block">
            <text class="ca-demo-block__title">文件预览</text>
            <view class="ca-demo-block__content">
                <view class="ca-page__upload-item">
                    <ca-upload
                        :file-list="fileList3" name="3" multiple :max-count="10" :preview-full-image="true"
                        @after-read="afterRead" @delete="deletePic" />
                </view>
            </view>
        </view>
        <view class="ca-demo-block">
            <text class="ca-demo-block__title">隐藏上传按钮</text>
            <view class="ca-demo-block__content">
                <view class="ca-page__upload-item">
                    <ca-upload
                        :file-list="fileList4" name="4" multiple :max-count="2" @after-read="afterRead"
                        @delete="deletePic" />
                </view>
            </view>
        </view>
        <view class="ca-demo-block">
            <text class="ca-demo-block__title">限制上传数量</text>
            <view class="ca-demo-block__content">
                <view class="ca-page__upload-item">
                    <ca-upload
                        :file-list="fileList5" name="5" multiple :max-count="3" @after-read="afterRead"
                        @delete="deletePic" />
                </view>
            </view>
        </view>
        <view class="ca-demo-block">
            <text class="ca-demo-block__title">自定义上传样式</text>
            <view class="ca-demo-block__content">
                <view class="ca-page__upload-item">
                    <ca-upload
                        :file-list="fileList6" name="6" multiple :max-count="1" width="250"
                        height="150" @after-read="afterRead" @delete="deletePic">
                        <image src="https://cdn.uviewui.com/uview/demo/upload/positive.png" mode="widthFix" style="width: 250px; height: 150px" />
                    </ca-upload>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            fileList1: [],
            fileList2: [],
            fileList3: [
                {
                    url: 'https://cdn.uviewui.com/uview/swiper/1.jpg'
                }
            ],
            fileList4: [
                {
                    url: 'https://cdn.uviewui.com/uview/swiper/1.jpg'
                },
                {
                    url: 'https://cdn.uviewui.com/uview/swiper/1.jpg'
                }
            ],
            fileList5: [],
            fileList6: [],
            fileList7: []
        }
    },
    onLoad() {},
    methods: {
    // 删除图片
        deletePic(event) {
            this[`fileList${event.name}`].splice(event.index, 1)
        },
        // 新增图片
        async afterRead(event) {
            // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
            const lists = [].concat(event.file)
            let fileListLen = this[`fileList${event.name}`].length
            // lists.map(item => {
            //     this[`fileList${event.name}`].push({
            //         ...item,
            //         status: 'uploading',
            //         message: '上传中'
            //     })
            // })
            for (let i = 0; i < lists.length; i++) {
                const result = await this.uploadFilePromise(lists[i].url)
                const item = this[`fileList${event.name}`][fileListLen]
                this[`fileList${event.name}`].splice(
                    fileListLen,
                    1,
                    Object.assign(item, {
                        status: 'success',
                        message: '',
                        url: result
                    })
                )
                fileListLen++
            }
        },
        uploadFilePromise(url) {
            return new Promise((resolve, reject) => {
                const a = uni.uploadFile({
                    url: 'http://www.example.com/upload', // 仅为示例，非真实的接口地址
                    filePath: url,
                    name: 'file',
                    formData: {
                        user: 'test'
                    },
                    success: res => {
                        setTimeout(() => {
                            resolve(res.data.data)
                        }, 1000)
                    }
                })
                console.log('🚀 - returnnewPromise - a:', a)
            })
        }
    }
}
</script>

<style lang="scss">
.ca-page {
  &__upload-item {
    margin-top: 5px;
  }
}
</style>
