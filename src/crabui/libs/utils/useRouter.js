import { useRouter, useRoute } from '@/crabui/libs/router'
export default function useNewRouter() {
    const router = useRouter()
    const route = useRoute()
    function jump(name, params, navType = 'push') {
        return router[navType]({
            name,
            params
        })
    }
    function jumpDetails(name, id, params, navType = 'push') {
        return router[navType]({
            name,
            params: {
                detailsId: id,
                ...params
            }
        })
    }
    function back(dalte = 1) {
        return router.back(dalte)
    }
    return {
        back,
        jump,
        route,
        router,
        jumpDetails
    }
}
