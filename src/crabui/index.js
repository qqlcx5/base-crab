/*
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2022-01-01 11:59:06
 */
import { useVModel, useEmit, useVModelBase } from './libs/utils/useCore.js'
import * as allTools from './libs/utils/tools.js'
import { useRipple } from './components/ripple/useRipple'
import validate, { validateCondition } from './libs/utils/validate.js'
import sendHttp, {
    setRequestList,
    setKeyAndCode
} from './libs/service/index.js'
import { setHttpConfig } from './libs/service/request.js'
import * as componentsEnum from './config/components.js'
import * as messageTools from './libs/utils/message.js'
import useRouter from './libs/utils/useRouter'
const zzspVuex = null

export const getVuex = () => {
    return zzspVuex
}
export default {
    install(Vue, extra = {}) {
        const { http, tools = {} } = extra

        if (http) {
            setHttpConfig(http)
            setRequestList(http.apiList || [])
            setKeyAndCode(http)
        }

        uni.$ca = {
            useEmit,
            useVModel,
            useRipple,
            useVModelBase,
            http: sendHttp,
            validateCondition,
            validate,
            useRouter,
            enum: componentsEnum,
            toast: messageTools.showToast,
            loading: messageTools.showLoading,
            hideLoading: messageTools.hideLoading,
            modal: messageTools.showModal,
            ...allTools,
            ...tools
        }
    }
}
