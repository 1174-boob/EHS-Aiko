
/**
 * @author: 成礼雄
 * @description url下载
 */
const downloadMixin = {
    methods: {
        download(id, isOnline, baseUrl) {
            id = id + ''
            baseUrl = baseUrl === undefined ? process.env.VUE_APP_API_BASE_URL : baseUrl
            let href = `${baseUrl}/boeplat-customer/api/bps/file/download`
            window.location.href = `${href}?id=${id}&isOnline=${isOnline}`
        },
    },
};

export default downloadMixin;