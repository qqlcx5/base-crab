export default {
    askInfo: {
        type: 'get',
        url: '/fm/v2/webapi/tape/askInfo',
        loading: true,
        catchName: 'askInfo',
        catchBefore: (data, query) => {
            data.code = query.code
            const transparency = parseFloat(data.transparency)
            data.transparency = isNaN(transparency) ? 1 : transparency
            data.tempBackgroundImageUrl = data.backgroundImageUrl
            return data
        }
    },
    answers: {
        type: 'get',
        url: '/fm/v2/webapi/tape/answers'
    },
    ask: {
        url: '/fm/v2/webapi/tape/ask',
        loading: true
    },
    question: {
        url: '/fm/v2/webapi/tape/question',
        type: 'get',
        loading: true
    }
}
