<template>
  <view class="ca-tabbar">
    <ca-fixed-menu
      v-model="tabbarValue"
      :duration="0"
      height="50px"
      mode="bottom"
    >
      <view class="flex c-tabbar-bd c-underline__top">
        <view
          v-for="(item, index) in tabbarList_"
          :key="index"
          class="flex-1"
          @click="changeTab(item.app_page, index)"
        >
          <view class="c-tabbar__image">
            <ca-icon
              :type="selectIndex_ === index ? item.img_active : item.img"
              size="20px"
            />
          </view>
          <view>{{ item.name }}</view>
        </view>
      </view>
    </ca-fixed-menu>
  </view>
</template>

<script>
import { defineComponent, computed, ref } from 'vue'
import { useVModel } from '../../libs/utils/useCore.js'
import { getUrlInfo, diffByObj } from '../../libs/utils/tools.js'
import { useStore } from 'vuex'

import props from './props.js'
export default defineComponent({
    name: 'CrabTabbar',
    props,
    setup(props) {
        const pages = getCurrentPages()
        const store = useStore()
        const curRoute = pages[pages.length - 1]
        const tabbarValue = useVModel()
        const tabbarList_ = computed(() => {
            return props.list.length
                ? props.list
                : [{
                    app_page: '/',
                    img: '',
                    img_active: '',
                    name: ''
                }, {
                    app_page: '/',
                    img: '',
                    img_active: '',
                    name: ''
                }, {
                    app_page: '/',
                    img: '',
                    img_active: '',
                    name: ''
                }, {
                    app_page: '/',
                    img: '',
                    img_active: '',
                    name: ''
                }]
        })
        const selectIndex_ = computed(() => {
            return tabbarList_.value.findIndex(o => {
                const routeObj = getUrlInfo(o.app_page)
                const { query = {} } = curRoute
                const { query: tabQuery } = routeObj
                if ([curRoute.path, curRoute.aliasPath, curRoute.name].includes(routeObj.path)) {
                    let isExit = true
                    // 这边考虑到当前地址会有额外参数
                    for (const k in tabQuery) {
                        if (!diffByObj(tabQuery[k], query[k])) {
                            isExit = false
                            break
                        }
                    }
                    return isExit
                }
                return false
            })
        })
        function changeTab(url, index) {
            if (this.selectIndex_ === index || !url) return
            // this.$jump(url.length <= 1 ? 'home' : url, {}, 'replace')
        }
        return {
            tabbarValue,
            tabbarList_,
            selectIndex_,
            changeTab
        }
    },
    data() {
        return {
            shieldReview: false,
            newList: [],
            shopConfig: {},
            curRoute: {
                query: {}
            }
        }
    }
})
</script>

<style lang="scss" scoped>
.c-tabbar {
    &-bd {
        .flex-1 {
            @include flex(column);
            align-items: center;
            padding-top: 6px;
        }
    }

    &__image {
        width: 20px;
        height: 20px;
        position: relative;
        overflow: hidden;
    }

    &__text {
        text-align: center;
        font-size: 12px;
        line-height: 16px;
        height: 16px;
        color: inherit;
        margin-top: 4px;
        /* #ifndef APP-PLUS-NVUE */
        min-width: 50%;
        /* #endif */
    }

    &__doted {
        @include abs(0, 0);
        width: 6px;
        height: 6px;
        background-color: red;
        border-radius: 100%;
        z-index: 2;
    }
}
</style>
