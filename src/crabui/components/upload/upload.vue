<template>
    <view class="ca-upload">
        <view class="ca-upload-list">
            <view
                v-for="(path, index) in vmodelValue"
                :key="index"
                class="ca-upload-item drag-item"
                :class="[
                    dragElIndex === index ? 'ca-upload-item--drag' : '',
                    targetElIndex === index ? 'ca-upload-item--target' : ''
                ]"
            >
                <image
                    :src="path"
                    class="ca-upload-item__image"
                    :draggable="true"
                    :data-index="index"
                    @click="previewImage"
                    @touchstart="handleTouchStart"
                    @touchmove.stop.prevent="handleTouchMove"
                    @touchend="handleTouchEnd"
                />
                <view
                    v-if="showDel_"
                    class="ca-upload-item__del"
                    @click="handleDelImage(index)"
                />
            </view>
            <view
                v-if="showAdd_"
                class="ca-upload-item ca-upload-item__add"
                @click="handleSelectImage"
            >
                ＋
            </view>
            <view
                v-if="isMove"
                class="ca-upload-item ca-upload-item--ghost"
                :style="{left: `${dragPos.posLeft}px`, top: `${dragPos.posTop}px`}"
            >
                <image
                    class=" ca-upload-item__image"
                    :src="dragEl_"
                />
            </view>
        </view>
    </view>
</template>

<script>
import { defineComponent, ref, computed, getCurrentInstance, toRaw } from 'vue'
export default defineComponent({
    name: 'CaUpload',
    props: {
        modelValue: {
            type: Array,
            default: () => []
        },
        /**
         * 选择文件类型
         * image 图片【兼容性：全平台】
         * video 拍摄视频或从手机相册中选视频，返回视频的临时文件路径【兼容性：全平台】
         * file  从本地选择文件【兼容性：H5(HBuilder X2.9.9+)，微信小程序，QQ小程序】
         * media 拍摄或从手机相册中选择图片或视频【兼容性：微信小程序】
        */
        type: {
            type: String,
            default: 'image'
        },
        /**
         * 仅在 type 为 image 或 video 时可用
         * album 从相册选图
         * camera 使用相机
        */
        sourceType: {
            type: Array,
            default: () => ['album', 'camera']
        },
        /**
         * 所选的文件的类型(过滤)
         * type 为 image 时 accept可以是任何图片地址后缀【兼容性：H5(HBuilder X2.9.9+)】
         * type 为 video 时 accept可以是任何视频地址后缀【兼容性：H5(HBuilder X2.9.9+)】
         * type 为 file  时 accept可选值 all video image【取数组第一项】
         * type 为 media 时 accept可选值 video image【取数组第一项】
        */
        accept: {
            type: Array,
            default: () => []
        },
        /**
         * 压缩类型【兼容性：App、微信小程序、支付宝小程序、百度小程序】
         * original   原图
         * compressed 压缩图
        */
        sizeType: {
            type: Array,
            default: () => ['original', 'compressed']
        },
        showAdd: {
            type: Boolean,
            default: true
        },
        enableDel: {
            type: Boolean,
            default: true
        },
        // 是否限制图片上传张数， -1表示不限制
        limit: {
            type: Number,
            default: -1
        },
        /**
         * 是否开启图片多选
         * type 为 image 下该属性才生效
         * 由于兼容限制，最多只能上传9张
        */
        multiple: {
            type: Boolean,
            default: true
        },
        // HTTP 请求中其他额外的 form data
        formData: {
            type: Object,
            default: () => ({})
        },
        // 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
        fileName: {
            type: String,
            default: 'file'
        },
        // HTTP 请求 Header, header 中不能设置 Referer。
        header: {
            type: Object,
            default: () => ({})
        },
        // 设置即表示图片要上传到服务器
        serverUrl: {
            type: String,
            default: ''
        },
        // 拍摄视频最长拍摄时间，单位秒。最长支持 60 秒【APP平台 1.9.7+(iOS支持，Android取决于ROM的拍照组件是否实现此功能，如果没实现此功能则忽略此属性。) 微信小程序、百度小程序】。
        maxDuration: {
            type: Number,
            default: 60,
            validator: (value) => {
                return value <= 60
            }
        }
    },
    setup(props) {
        const { proxy } = getCurrentInstance()
        // 时间句柄
        const emitEvent = uni.$ca.useEmit()
        const allNodeInfo = ref([])
        const imgList = ref([])
        const vmodelValue = uni.$ca.useVModel('modelValue', async (value) => {
            imgList.value = value.map(o => {
                return {
                    path: o,
                    tempPaths: o,
                    progress: 100
                }
            })
            allNodeInfo.value = await getImgNodeInfo()
        })
        // 拖拽的下标
        const dragElIndex = ref(-1)
        // 被替换对象
        const targetElIndex = ref(-1)

        // 拖拽元素
        const dragEl_ = computed(() => {
            return vmodelValue.value[dragElIndex.value]
        })
        // 拖拽位置
        const dragPos = ref({})
        // 是否正在移动
        const isMove = ref(false)
        const showDel_ = computed(() => {
            if (props.enableDel === false) {
                return false
            } else {
                return true
            }
        })
        const showAdd_ = computed(() => {
            if (props.showAdd === false) {
                return false
            } else {
                return true
            }
        })
        // 拖拽边界值
        const dragBoundaryValue = computed(() => {
            const nodeInfo = toRaw(allNodeInfo.value)
            const sortNodeInfo = [...nodeInfo].sort((a, b) => b.left - a.left)
            const maxLength = nodeInfo.length
            let colLen = maxLength
            const firstLeft = nodeInfo[0].left
            for (const i in nodeInfo) {
                if (Number(i) !== 0 && nodeInfo[i].left === firstLeft) {
                    colLen = Number(i)
                    break
                }
            }
            return {
                maxLength,
                row: colLen,
                minLeft: nodeInfo[0]?.left,
                maxLeft: sortNodeInfo[0]?.left,
                minTop: nodeInfo[0]?.top,
                maxTop: nodeInfo[maxLength - 1]?.top || 0
            }
        })
        // 拖拽开始
        const handleTouchStart = (e) => {
            const dragIndex = e.target.dataset.index
            dragElIndex.value = dragIndex
            const touch = e.touches[0]
            dragPos.value = {
                baseX: touch.pageX,
                baseY: touch.pageY,
                ...allNodeInfo.value[dragIndex]
            }
        }
        // 拖拽进行中
        const handleTouchMove = (e) => {
            const touch = e.touches[0]
            setDragPos(touch)
            targetElIndex.value = getExchangeEl()
            isMove.value = true
        }
        // 拖拽结束
        const handleTouchEnd = () => {
            isMove.value = false
            if (targetElIndex.value !== -1 && dragElIndex.value !== targetElIndex.value) {
                vmodelValue.value[targetElIndex.value] = vmodelValue.value.splice(dragElIndex.value, 1, vmodelValue.value[targetElIndex.value])[0]
            }
            targetElIndex.value = -1
            dragElIndex.value = -1
        }
        // 上传图片
        const handleSelectImage = async (e) => {
            const curLen = vmodelValue.value.length
            // 已经超过最大上传张数
            if (props.limit !== -1 && props.limit <= curLen) {
                return false
            }
            const allowableNum = props.multiple ? (props.limit !== -1 ? props.limit - curLen : 9) : 1
            // count （注意：ios不可大于9）
            const data = await chooseFile({
                count: Math.min(allowableNum, 9),
                accept: props.accept,
                type: props.type,
                sourceType: props.sourceType,
                sizeType: props.sizeType,
                maxDuration: props.maxDuration,
                multiple: props.multiple
            })
            emitEvent('choose', {
                value: data,
                allImages: vmodelValue.value
            })
            if (props.serverUrl) {
                uploadFile(data)
            }
        }
        function uploadFile(data) {
            const promiseArr = []
            const newImgList = []
            data.forEach(o => {
                newImgList.push({
                    path: '',
                    tempPaths: o,
                    progress: 0
                })
                promiseArr.push(
                    proxy.$http(props.serverUrl, {
                        filePath: o,
                        name: props.fileName,
                        ...props.formData
                    }, {
                        toast: false,
                        loading: false
                    })
                )
            })
            imgList.value = imgList.value.push(...newImgList)
            Promise.all(promiseArr).then(res => {
                console.log(res)
            })
        }
        // 删除图片
        function handleDelImage(index) {
            vmodelValue.value.splice(index, 1)
        }
        // 设置严重元素的滑动
        function setDragPos({ pageX, pageY }) {
            const _dragBoundaryValue = toRaw(dragBoundaryValue.value)
            const dragPosRaw = toRaw(dragPos.value)
            let posLeft = dragPosRaw.left + pageX - dragPosRaw.baseX
            let posTop = dragPosRaw.top + pageY - dragPosRaw.baseY
            posLeft = posLeft > _dragBoundaryValue.maxLeft ? _dragBoundaryValue.maxLeft : (posLeft < _dragBoundaryValue.minLeft ? _dragBoundaryValue.minLeft : posLeft)
            posTop = posTop > _dragBoundaryValue.maxTop ? _dragBoundaryValue.maxTop : (posTop < _dragBoundaryValue.minTop ? _dragBoundaryValue.minTop : posTop)
            dragPos.value.posLeft = posLeft
            dragPos.value.posTop = posTop
        }
        // 获取要要被交换元素的下标值
        function getExchangeEl() {
            const _dragBoundaryValue = toRaw(dragBoundaryValue.value)
            const dragPosRaw = toRaw(dragPos.value)
            const col = Math.floor(dragPosRaw.posLeft / dragPosRaw.width)
            const row = Math.floor(dragPosRaw.posTop / dragPosRaw.height)
            const targerIndex = row * _dragBoundaryValue.row + col
            return targerIndex > _dragBoundaryValue.maxLength ? -1 : targerIndex
        }
        // 获取元素信息
        async function getImgNodeInfo() {
            let data = await uni.$ca.getRect('.ca-upload, .drag-item', null, proxy)
            data = Array.isArray(data) ? data : [data]
            const firstItem = data[0]
            return data.splice(1).map((o, i) => {
                return {
                    ...o,
                    top: o.top - firstItem.top,
                    left: o.left - firstItem.left
                }
            })
        }
        // 预览图片
        function previewImage(e) {
            const imageIndex = e.target.dataset.index
            const imgList = toRaw(vmodelValue.value)
            uni.previewImage({
                current: imgList[imageIndex],
                indicator: 'number',
                loop: 'true',
                urls: imgList
            })
        }
        function formatRes(res, {
            type, count,
            multiple
        }) {
            let tempFilePaths = []
            switch (type) {
                case 'image':
                    tempFilePaths = res.tempFilePaths
                    break
                // #ifdef MP-WEIXIN
                case 'media':
                    tempFilePaths = res.tempFiles.map(o => o.tempFilePath)
                    break
                // #endif
                case 'video':
                    tempFilePaths = [res.tempFilePath]
                    break
                // #ifdef MP-WEIXIN || H5
                case 'file':
                    // #ifdef MP-WEIXIN
                    tempFilePaths = res.tempFiles.map(o => o.path)
                    // #endif
                    // #ifdef H5
                    tempFilePaths = res.tempFilePaths
                    // #endif
                    break
                // #endif
            }

            // 如果设置了limit限制，在web上count参数无效，这里做判断控制选择的数量是否合要求
            // 在非微信小程序里，虽然可以选多张，但选择的结果会被截掉
            // 在app里，会自动做选择数量的限制
            // #ifdef H5
            if (count < tempFilePaths.length) {
                tempFilePaths = tempFilePaths.slice(0, count)
            }
            // #endif
            return multiple ? tempFilePaths : tempFilePaths[0]
        }
        function chooseFile(config) {
            const {
                type,
                accept,
                compressed,
                maxDuration,
                sizeType,
                camera,
                count,
                sourceType
            } = config
            console.log(type)
            return new Promise((resolve, reject) => {
                const fileType = accept[0] || 'all'
                switch (type) {
                    case 'image':
                        uni.chooseImage({
                            count,
                            sourceType,
                            sizeType,
                            success: (res) => resolve(formatRes(res, config)),
                            fail: reject
                        })
                        break
                    // #ifdef MP-WEIXIN
                    case 'media':
                        wx.chooseMedia({
                            count,
                            sourceType,
                            maxDuration,
                            sizeType,
                            camera,
                            success: (res) => resolve(formatRes(res, config)),
                            fail: reject
                        })
                        break
                    // #endif
                    case 'video':
                        uni.chooseVideo({
                            sourceType,
                            compressed,
                            maxDuration,
                            camera,
                            success: (res) => resolve(formatRes(res, config)),
                            fail: reject
                        })
                        break
                    // #ifdef MP-WEIXIN || H5
                    // 只有微信小程序才支持chooseMessageFile接口
                    case 'file':
                        // #ifdef MP-WEIXIN
                        wx.chooseMessageFile({
                            count,
                            type: fileType,
                            success: (res) => resolve(formatRes(res, config)),
                            fail: reject
                        })
                        // #endif
                        // #ifdef H5
                        // 需要hx2.9.9以上才支持uni.chooseFile
                        uni.chooseFile({
                            count,
                            type: fileType,
                            success: (res) => resolve(formatRes(res, config)),
                            fail: reject
                        })
                        // #endif
                        break
                    // #endif
                    default:
                        console.error(`该环境暂不支持[${type}]类型文件上传`)
                }
            })
        }
        return {
            dragElIndex,
            targetElIndex,
            dragPos,
            showAdd_,
            showDel_,
            dragEl_,
            vmodelValue,
            isMove,
            previewImage,
            handleTouchStart,
            handleTouchMove,
            handleTouchEnd,
            handleDelImage,
            handleSelectImage
        }
    }
})
</script>

<style lang="scss">
.ca-upload {
    &-list {
        display: flex;
        flex-wrap: wrap;
        padding: 10rpx;
        position: relative;
    }
    &-item {
        position: relative;
        padding: 10rpx;
        width: 160rpx;
        height: 160rpx;
        &--ghost {
            position: absolute;
            z-index: 10;
        }
        &--target {
            box-shadow: 0 0 10rpx #4fa5e1;
        }
        &--drag {
            opacity: 1;
        }
        &__del {
            position: absolute;
            top: 10rpx;
            right: 10rpx;
            width: 30rpx;
            height: 30rpx;
            border-radius: 20rpx;
            box-shadow: 0 0 10rpx #999;
            background: url('data:image/png;base64,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')
                center no-repeat;
            background-size: cover;
        }
        &__image {
            width: 140rpx;
            height: 140rpx;
        }
        &__add {
            order: 9999999999999;
            @include flex(row);
            align-items: center;
            justify-content: center;
            font-size: 120rpx;
            color: #d9d9d9;
            border: 1px solid #d9d9d9;
            border-radius: 8rpx;
        }
    }
}
</style>
