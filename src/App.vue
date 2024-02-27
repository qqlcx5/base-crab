<!--
 * @Descripttion: 默认入口
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-11-15 11:06:55
-->
<script>
export default {
    onLaunch: function () {
        console.log('App Launch')
    },
    onShow: function () {
        console.log('App Show')
    },
    onHide: function () {
        console.log('App Hide')
    }
}
</script>

<style lang="scss">
/*每个页面公共css */
@import '~@/crabui/libs/styles/index.scss';
@import '~@/common/styles/base.scss';
@import '~@/common/styles/din-font.css';
@import '~@/common/styles/qq-font.css';
</style>
