/*
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-12-17 09:00:10
 */

import {
    getCurrentInstance,
    shallowRef,
    watch,
    unref,
    ref,
    nextTick,
    computed,
    onBeforeUnmount
} from 'vue'
import { getRect, getVarType, getParent, diffByObj, getResponsiveValue } from './tools'
const inputTypes = ['modelValue', 'input']

// 数据双向绑定
export const useVModel = (pro = 'modelValue', vmCallback, proCallback) => {
    const { proxy } = getCurrentInstance()
    const singleValue = ref(proxy.$props[pro])
    const event = pro || 'modelValue'
    const options = {
        immediate: true,
        deep: true
    }
    useVModelBase(() => proxy.$props[pro], null, (...arg) => {
        singleValue.value = arg[0]
        proCallback?.(...arg)
    }, options)
    useVModelBase(singleValue, event, (...arg) => {
        vmCallback?.(...arg)
    }, options)
    return singleValue
}

export const useDualVModel = ({
    pro = 'modelValue',
    callback = () => { },
    proCallback = () => { },
    destroyEle = true,
    duration = 300
}) => {
    // 是否是第一次进来
    let isFirst = true
    // 定时器
    let timer = null
    // 事件句柄
    const emitEvent = useEmit()
    // 双向绑定
    const singleValue = useVModel(pro, (value) => {
        !isFirst && emitEvent('state', value ? 'open' : 'close')
        if (isFirst) isFirst = false
        nextTick(() => {
            value ? open() : close()
        })
        callback && callback(value)
    }, proCallback)
    const dualValue = ref({
        outer: !destroyEle,
        inner: false
    })
    const open = () => {
        change('outer', 'inner', true)
    }
    const close = () => {
        change('inner', 'outer', false)
    }
    const change = (pro1, pro2, status) => {
        dualValue.value[pro1] = status
        clearTimeout(timer)
        timer = null
        if (duration <= 0) {
            dualValue.value[pro2] = status
        } else {
            if (status) {
                // #ifdef H5 || MP
                timer = setTimeout(() => {
                    dualValue.value[pro2] = status
                }, 50)
                // #endif
                // #ifndef H5 || MP
                nextTick(() => {
                    dualValue.value[pro2] = status
                })
                // #endif
            } else {
                timer = setTimeout(() => {
                    destroyEle && (dualValue.value[pro2] = status)
                }, duration * 10)
            }
        }
    }
    return {
        singleValue,
        dualValue,
        open,
        close,
        change
    }
}

export const useVModelBase = (source, event, callback, options = {
    deep: false,
    immediate: false
}) => {
    if (!source) return
    const emitEvent = useVMEvent()
    watch(source, (value, oldValue) => {
        emitEvent(event, value)
        callback && callback(value, oldValue)
    }, options)
}

export const useVMEvent = (vm) => {
    const _vm = getVM(vm)
    const _emit = _vm?.emit || _vm?.$emit?.bind(_vm)
    return (event, data) => {
        if (!event) return
        const newValue = getResponsiveValue(data)
        _emit(`update:${event}`, newValue)
    }
}

/**
 * @description: 通用的事件句柄
 * @param {ComponentInternalInstance} vm 当前实例
 * @return {Function} 触发emit方法
 */
export const useEmit = (vm) => {
    const _vm = getVM(vm)
    const _emit = _vm?.emit || _vm?.$emit?.bind(_vm)
    const vmEvent = useVMEvent()
    /**
     * @description:
     * @param {String} event emit事件句柄名称
     * @param {any} data 暴露出去的内容
     * @param {Boolean} format 是否要格式化进行转换
     * @return {Void}
     */
    return (event, data, format = true) => {
        if (!event) return
        const newValue = getResponsiveValue(data)
        if (inputTypes.includes(event)) {
            vmEvent(event, data)
        } else {
            _emit(event, format
                ? {
                    type: event,
                    detail: ['Array', 'Object'].includes(getVarType(newValue))
                        ? newValue
                        : {
                            value: newValue
                        }
                }
                : newValue)
        }
    }
}

/**
 * @description: 获取props，默认当前实例props高于父级的props
 * @param {String} parentName 上级组件的name值
 * @param {ComponentInternalInstance} vm 当前实例
 * @return {Function} 查询上级props的方法，并返回属性值
 */
export function useProps(parentName = undefined, vm) {
    if (!parentName) throw Error('请传入父级')
    const _vm = getVM(vm)
    const defaultProps = (_vm.propsOptions || [])[0]
    const _props = _vm.props || _vm.$props?.bind(_vm)
    const parent = getParent(parentName, _vm.proxy)
    return (pro, defaultValue = 0) => {
        if (!defaultProps[pro]) return parent ? parent[pro] : defaultValue
        const emptyValue = getVarType(defaultProps[pro].default) === 'Function' ? defaultProps[pro].default() : defaultProps[pro].default
        const proValue = !diffByObj(_props[pro], emptyValue) ? _props[pro] : parent?.[pro]
        return (proValue === undefined) ? defaultValue : proValue
    }
}

/**
 * @description: 获取节点位置信息
 * @param {String} className 需要查询节点的class或者id名称，多个用逗号隔开，nvue传入ref值，且只能查询一个
 * @param {Object} fields 需要查询节点的额外信息
 * @param {ComponentInternalInstance} vm 当前实例
 * @return {Object | Array} 返回查询节点的信息，单个则为Object，多个则是数组形式返回
 */
export const useRect = (className, fields, vm) => {
    const _vm = getVM(vm)
    const rect = shallowRef()
    watch(() => unref(className), (v) => {
        getRect(v, fields, _vm?.proxy).then((v) => {
            rect.value = v
        })
    }, {
        immediate: true
    })

    return rect
}

export const useRootRect = (className, pro, vm) => {
    const _vm = getVM(vm)
    if (!_vm) return null
    return useRect(className, pro, _vm.proxy?.$root)
}

export const useParent = (className, isRoot) => {
    const { proxy } = getCurrentInstance() || {}
    return getParent(className, isRoot ? proxy?.$root : proxy)
}

export const useCmptName = () => {
    const { proxy } = getCurrentInstance() || {}
    return proxy.name || `${proxy.$options?.name || 'Crab'}_${Math.random().toString(32).slice(2)}`
}

// 上下级存储关系
export function useCaChildren() {
    const caChildren = ref([])
    watch(caChildren, (val) => {
        val.forEach((instance, index) => {
            instance.setIndex(index)
        })
    })
    return {
        caChildren
    }
}

export function useCaParent(pName) {
    const uid = uni.$ca.guuid()
    const current = ref(-1)
    // 把自身绑定给上级
    const parent = useParent(pName)
    if (parent && parent.caChildren) {
        parent.caChildren = [...parent.caChildren, {
            uid,
            setIndex: (index) => {
                current.value = index
            }
        }]
        // 组件卸载的话 要移除caChildren
        onBeforeUnmount(() => {
            parent.caChildren = parent.caChildren.filter(o => o.uid !== uid)
        })
    }
    const isLast = computed(() => {
        return current.value === parent.caChildren.length - 1
    })
    return {
        current,
        parent,
        isLast
    }
}

function getVM(vm) {
    const _vm = vm || getCurrentInstance()
    if (!_vm) {
        throw Error('请在setup周期内调用这个方法，或传入当前实例')
    }
    return _vm
}
