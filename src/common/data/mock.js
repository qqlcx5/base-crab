/*
 * @Author: sanshui
 * @Date: 2022-07-21 09:11:08
 * @LastEditors: sanshui
 * @LastEditTime: 2023-08-15 11:28:10
 * @Description: For better maintenance, please fill in the document description carefully, thank you ~
 */
export default new Map([
    ['/api/app/source/productSearch', (len = 6) => {
        return createFillArr(len, {}).map((o, index) => {
            return {
                productId: `test_${index}`,
                minPrice: '666.00',
                maxPrice: Math.random() < 0.5 ? '666.00' : '999.00',
                marketPrice: '999',
                productCode: '88888888',
                productName: '这里是商品名称，最多展示2行。',
                mainImage: '/static/common/loading.jpg'
            }
        })
    }], ['searchIndex', () => {
        return {
            height: 1920,
            width: 1080,
            name: 'Sanshui播报页',
            status: '0',
            activeAppTemplatePublishId: null,
            pageType: '3',
            pageSettingData: {
                backgroundColor: 'rgba(255, 255, 255, 1)',
                backgroundImage: '',
                showStoreName: false,
                broadcastPageId: {}
            },
            storeDataSourceId: 10,
            appTemplateModuleVOList: [
                {
                    api: null,
                    moduleName: 'header',
                    moduleNo: 101,
                    parentModuleNo: null,
                    moduleTemplate: 'sub-pages-header',
                    extra: {
                        titleLayer: {
                            title: '搜索'
                        },
                        mode: 'float',
                        outerLayer: {
                            clearHeight: '192rpx',
                            color: 'rgba(51, 51, 51, 1)',
                            bgColor: 'rgba(255,255,255,1)',
                            backgroundColor: 'rgba(255,255,255,1)'
                        },
                        innerLayer: {}
                    },
                    data: null
                },
                {
                    api: null,
                    apiParams: null,
                    moduleName: 'line',
                    moduleNo: 107,
                    parentModuleNo: null,
                    moduleTemplate: 'sub-pages-separation',
                    extra: {
                        mode: 'blank',
                        outerLayer: {
                            height: '48rpx',
                            bgColor: 'rgba(255, 255, 255, 0)',
                            backgroundColor: 'rgba(255, 255, 255, 0)'
                        },
                        innerLayer: {},
                        titleLayer: {}
                    },
                    data: null
                },
                {
                    api: null,
                    apiParams: null,
                    moduleName: 'search_panel',
                    moduleNo: 104,
                    parentModuleNo: null,
                    moduleTemplate: 'sub-pages-search-panel',
                    extra: {
                        outerLayer: {
                            collapse: 1,
                            margin: '0 36rpx'
                        },
                        titleLayer: {
                            title: '历史搜索'
                        },
                        mode: 'clientSearch',
                        innerLayer: {}
                    },
                    data: []
                },
                {
                    api: null,
                    apiParams: null,
                    moduleName: 'line',
                    moduleNo: 106,
                    parentModuleNo: null,
                    moduleTemplate: 'sub-pages-separation',
                    extra: {
                        mode: 'blank',
                        outerLayer: {
                            height: '48rpx',
                            bgColor: 'rgba(255, 255, 255, 0)',
                            backgroundColor: 'rgba(255, 255, 255, 0)'
                        },
                        innerLayer: {},
                        titleLayer: {}
                    },
                    data: null
                },
                {
                    api: null,
                    apiParams: null,
                    moduleName: 'search_panel',
                    moduleNo: 105,
                    parentModuleNo: null,
                    moduleTemplate: 'sub-pages-search-panel',
                    extra: {
                        outerLayer: {
                            collapse: 0,
                            margin: '0 36rpx'
                        },
                        titleLayer: {
                            title: '大家都在搜'
                        },
                        mode: 'hotKeyword',
                        innerLayer: {}
                    },
                    data: []
                },
                {
                    api: null,
                    apiParams: null,
                    moduleName: 'search',
                    moduleNo: 102,
                    parentModuleNo: 101,
                    moduleTemplate: 'sub-pages-search',
                    extra: {
                        mode: 'circle',
                        innerLayer: {
                            defaultValue: '',
                            placeholder: '请输入商品/货号'
                        },
                        outerLayer: {
                            margin: '0 36rpx',
                            bgColor: 'rgba(244, 248, 252, 1)',
                            backgroundColor: 'rgba(244, 248, 252, 1)'
                        },
                        titleLayer: {}
                    },
                    data: null
                },
                {
                    api: null,
                    apiParams: null,
                    moduleName: 'line',
                    moduleNo: 103,
                    parentModuleNo: 101,
                    moduleTemplate: 'sub-pages-separation',
                    extra: {
                        mode: 'blank',
                        outerLayer: {
                            height: '6rpx',
                            bgColor: 'rgba(255, 255, 255, 0)',
                            backgroundColor: 'rgba(255, 255, 255, 0)'
                        },
                        innerLayer: {},
                        titleLayer: {}
                    },
                    data: null
                }
            ],
            theme: null,
            themeId: null,
            pageMode: '4'
        }
    }]
])

function createFillArr(len, val) {
    const arr = []
    for (let i = 0; i < len; i++) {
        arr.push(val)
    }
    return arr
}
