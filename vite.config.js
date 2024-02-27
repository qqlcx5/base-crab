/*
 * @Author: sanshui
 * @Date: 2022-05-09 10:11:46
 * @LastEditors: sanshui
 * @LastEditTime: 2022-05-26 14:19:33
 * @Description: For better maintenance, please fill in the document description carefully, thank you ~
 */
import { defineConfig } from 'vite'
import eslintPlugin from 'vite-plugin-eslint'
import uni from '@dcloudio/vite-plugin-uni'
import vitePluginUniRouter from './src/crabui/libs/router/compiler'
import legacy from '@vitejs/plugin-legacy'

// https://vitejs.dev/config/
export default defineConfig({
    lintOnSave: true,
    plugins: [
        vitePluginUniRouter({
            routesMain: './router/routes.js',
            pluginPath: './crabui/libs/router'
        }),
        uni({
            template: {
                compilerOptions: {
                    compatConfig: {
                        // 兼容性配置
                        mode: 'compatible'
                    }
                }
            }
        }),
        // 添加下面这块
        eslintPlugin({
            include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue']
        }),
        legacy({
            targets: ['defaults', 'not IE 11']
        })
    ],
    base: './',
    server: {
        port: 8090,
        https: true,
        disableHostCheck: true,
        proxy: {
            '/fm': {
                target: 'https://api-test.cikelink.com',
                changeOrigin: true
            }
        }
    }
})
