import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { ref, nextTick } from 'vue'
class List {
    constructor(config = {}) {
        const { page = 1, limit = 10, reqParams = {}, assignBefore = null, finishInit = null, loadMore = true, defaultParams = {}, routeName = '', autoReq = true, lodingText = '数据加载中', noDataText = '暂无数据', lastText = '- 我是有底线的 -', reqName = '' } = config
        this.page = page
        this.limit = limit
        this.busy = false // 请求拦截，防止多次加载
        this.finish = false // 是否请求完成，用于页面展示效果
        this.pageList = ref([]) // 页面数据
        this.reqParams = ref(reqParams) // 页面请求参数，可被改变的
        this.defaultParams = defaultParams // 页面请求参数，下拉刷新不会被重置的改变
        this.routeName = routeName // 特殊情况，页面需要复用别人的list的时候
        this.autoReq = autoReq // onload是否自己去请求
        this.lodingText = ref('') // 请求中底部显示的文案
        this.defaultLoadingText = lodingText
        this.noDataText = noDataText // 自定义无数据文案
        this.lastText = lastText
        this.noData = ref(false) // 页面无数据
        this.reqName = reqName // 请求地址名称
        this.loadMore = loadMore
        this.assignBefore = assignBefore
        this.finishInit = finishInit
        this.init()
    }

    init() {
        onLoad(() => {
            this.autoReq && this.initPage(false, true)
        })
        onPullDownRefresh(() => {
            this.pullDownRefreshFn()
        })
        onReachBottom(() => {
            if (!this.loadMore) return
            this.reachBottomFn()
        })
    }

    async initPage(saveParams = true, refresh = false, reqOptions) {
        // 初始化所有变量
        this.page = 1
        this.busy = false
        this.finish = false
        this.noData.value = false
        this.lodingText.value = this.defaultLoadingText
        if (saveParams) {
            const { page, limit } = this.reqParams.value
            page && (this.page = page)
            limit && (this.limit = limit)
        } else {
            this.reqParams.value = {}
        }
        await this.getCommonList(refresh, reqOptions)
    }

    // 下拉刷新函数
    pullDownRefreshFn() {
        this.initData()
        this.initPage(false, true)
    }

    // 上啦加载函数
    reachBottomFn() {
        this.getCommonList()
    }

    // 重置数据,方便调用（一般在外面自定义清空一些数据）
    initData() { // 重置data里面的变量，方便外面引用这个mixin的时候，下拉刷新重置变量

    }

    // 列表获取数据接口
    async getCommonList(refresh, reqOptions) {
        if (!this.reqName) return
        if (this.busy) return
        this.busy = true
        this.finish = false
        this.lodingText.value = this.defaultLoadingText
        try {
            const query = {
                ...this.defaultParams,
                ...this.reqParams.value,
                offset: this.page - 1,
                count: this.limit
            }
            let { data } = await uni.$ca.http(this.reqName, query, reqOptions)
            if (this.page === 1) this.pageList.value = []
            /**
             * [Node.JS中用concat和push连接两个或多个数组的性能比较](http://ourjs.com/detail/5cb3fe1c44b4031138b4a1e2)
             * 那么两者在node.js的性能如何？ 我们做了一组测试数据，两种分别测试100万次。
             * push比concat方法快3倍左右。因为push只是在原数组的基础上进行修改，所以会快一点。
             * push返回的是数组的长度，所以没重新定义变量再判断了
             * [Array.prototype.push.apply(arr1, arr2)无法自动触发DOM更新](https://www.imooc.com/wenda/detail/494323)
             * 因为 this.pageList.push !== Array.prototype.push,，this.pageList.push指向的是vue重写过的方法
             */
            this.finish = true
            data = this.assignBefore?.(data) || data
            const { list, count } = data
            const resLen = list?.length || 0
            if (resLen === 0) {
                this.resSuccess(list, refresh)
                return
            }
            const listLen = this.pageList.value.push.apply(this.pageList.value, list)
            if (listLen < count && this.limit <= resLen) { // 说明还有数据
                this.busy = false
                this.page = Math.ceil(listLen / this.limit) + 1
            }
            this.resSuccess(list, refresh)
        } catch (e) {
            // 防止接口报错锁死
            this.busy = false
            this.finish = true
        }
    }

    resSuccess(data, refresh) {
        /* 增加loadMore参数，用于控制无需下拉加载更多的场景，例如推荐商品
        项目里已有的做法是接口res.data.count = null来控制的，后续可选用loadMore=false来控制，无需后端修改count
        */
        if (this.finish && this.busy) {
            if (this.pageList.value.length > 0) {
                nextTick(() => {
                    setTimeout(() => {
                        this.lodingText.value = this.lastText
                    }, 100)
                })
            } else {
                this.lodingText.value = this.noDataText
                this.noData.value = true
            }
        }
        refresh && uni.stopPullDownRefresh()
        this.finishInit?.(data)
    }
}
export default List
