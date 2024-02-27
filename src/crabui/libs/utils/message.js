/*
 * @Descripttion: 通用的消息文件
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2022-01-25 16:01:27
 */

/*
    消息提示框
    title String 是 提示的内容，长度与 icon 取值有关。
    icon String 否 图标，有效值 "success", "loading", "none"
    duration Number 否 提示的延迟时间，单位毫秒，默认：1500
    image String 否 自定义图标的本地路径
    mask Boolean 否 是否显示透明蒙层，防止触摸穿透，默认：false
*/
export function showToast(msg, icon = 0, duration = 1500, mask = true, image = false) {
    if (!msg) return
    const icons = ['none', 'success', 'loading']
    const _icon = icons[icon]
    const params = {
        icon: _icon,
        title: msg,
        duration,
        // #ifndef MP-TOUTIAO
        mask
        // #endif
    }
    image && (params.image = image)
    uni.showToast(params)
}

// loading框
export function showLoading(msg = '加载中', mask = true) {
    const params = {
        // #ifndef MP-TOUTIAO
        mask,
        // #endif
        title: msg
    }
    uni.showLoading(params)
}

// 隐藏loading框
export function hideLoading() {
    uni.hideLoading()
}

/**
 * @description: 显示对话框
 * @param {String} title 提示的标题
 * @param {String} content 提示的内容
 * @param {Boolean} showCancel 是否显示取消按钮，默认为 true
 * @param {String} cancelText 取消按钮的文字，默认为"取消"，最多 4 个字符
 * @param {HexColor} cancelColor 取消按钮的文字颜色，默认为"#000000"(平台兼容：H5、微信小程序、百度小程序)
 * @param {String} confirmText 确定按钮的文字，默认为"确定"，最多 4 个字符
 * @param {HexColor} confirmColor 确定按钮的文字颜色，H5平台默认为"#007aff"，微信小程序平台默认为"#3CC51F"，百度小程序平台默认为"#3c76ff"(平台兼容：H5、微信小程序、百度小程序)
 * @param {Function} success 接口调用成功的回调函数
 * @param {Function} fail 接口调用失败的回调函数
 * @param {Function} complete 接口调用结束的回调函数（调用成功、失败都会执行）
 * @return {Void}
 */
export function showModal({
    title = '',
    content = '这是一个模态框',
    showCancel = true,
    cancelText = '取消',
    cancelColor = '#666',
    confirmText = '确定',
    confirmColor = '#0260fe',
    success,
    fail,
    complete
}) {
    uni.showModal({
        title,
        content,
        showCancel,
        cancelText,
        cancelColor,
        confirmText,
        confirmColor,
        success: (res) => {
            success && success(res)
        },
        fail: (err) => {
            fail && fail(err)
        },
        complete: (res) => {
            complete && complete(res)
        }
    })
}
