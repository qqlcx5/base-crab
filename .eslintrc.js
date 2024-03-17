/*
 * @Author: sanshui
 * @Date: 2022-05-26 13:53:56
 * @LastEditors: sanshui
 * @LastEditTime: 2023-08-07 10:41:54
 * @Description: For better maintenance, please fill in the document description carefully, thank you ~
 */
module.exports = {
    globals: {
        uni: true,
        getCurrentPages: true,
        getApp: true,
        weex: true,
        wx: true,
        Component: true,
        Page: true,
        uniCloud: true,
        plus: true
    },
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        'standard',
        // 新增这里vue3支持
        'plugin:vue/vue3-recommended'
    ],
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
            modules: true
        },
        requireConfigFile: false,
        parser: '@babel/eslint-parser'
    },
    plugins: [
        'vue'
    ],
    rules: {
        semi: [2, 'never'], // 禁止尾部使用分号“ ; ”
        'no-var': 'error', // 禁止使用 var
        'no-mixed-spaces-and-tabs': 'error', // 不能空格与tab混用
        quotes: [2, 'single'], // 使用单引号
        'vue/html-closing-bracket-newline': 'off', // 不强制换行
        'vue/singleline-html-element-content-newline': 'off', // 不强制换行
        'vue/max-attributes-per-line': ['error', { // vue template模板元素第一行最多5个属性
            singleline: { max: 5 },
            multiline: { max: 5 }
        }],
        'vue/first-attribute-linebreak': ['error', {
            singleline: 'ignore',
            multiline: 'below'
        }],
        'space-before-function-paren': 0,
        indent: ['error', 4, { SwitchCase: 1 }],
        // html模板缩进
        'vue/html-indent': ['error', 4, {
            attribute: 1,
            baseIndent: 1,
            closeBracket: 0,
            alignAttributesVertically: true,
            ignores: []
        }],
        camelcase: 0,
        'no-unused-vars': 0,
        // vue文件name值规格，不采用驼峰
        'vue/multi-word-component-names': 0
    }
}
