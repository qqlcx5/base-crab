// 引入国际化
import { useI18n } from 'vue-i18n'
export function useLocale() {
    const { locale } = useI18n()

    // 语言切换
    function setLocale(e) {
        uni.setLocale(e)
        locale.value = e
    }
    return {
        locale,
        setLocale
    }
}
