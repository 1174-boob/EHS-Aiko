
/**
 * @author: 成礼雄
 * @description 按钮loading状态
 */
const cancelLoading = {
    data() {
        return {
            loading: false,
            loadingTwo: false,
            loadingThree: false,
            loadingFour: false,
            cancelLoadingTimer: undefined,
            cancelLoadingTimerTwo: undefined,
            cancelLoadingTimerThree: undefined,
            cancelLoadingTimerFour: undefined,
        }
    },
    methods: {
        //第四个按钮
        handleLoadingFour() {
            this.loadingFour = true
            this.cancelLoadingTimerFour && window.clearTimeout(this.cancelLoadingTimerFour)
        },
        cancelLoadingFour(time = 100) {
            this.cancelLoadingTimerFour = setTimeout(() => {
                this.loadingFour = false
            }, time)
        },
        changeLoadingFour(boolean) {
            this.loadingFour = boolean
        },
        //第三个按钮
        handleLoadingThree() {
            this.loadingThree = true
            this.cancelLoadingTimerThree && window.clearTimeout(this.cancelLoadingTimerThree)
        },
        cancelLoadingThree(time = 100) {
            this.cancelLoadingTimerThree = setTimeout(() => {
                this.loadingThree = false
            }, time)
        },
        changeLoadingThree(boolean) {
            this.loadingThree = boolean
        },
        //第二个按钮
        handleLoadingTwo() {
            this.loadingTwo = true
            this.cancelLoadingTimerTwo && window.clearTimeout(this.cancelLoadingTimerTwo)
        },
        cancelLoadingTwo(time = 100) {
            this.cancelLoadingTimerTwo = setTimeout(() => {
                this.loadingTwo = false
            }, time)
        },
        changeLoadingTwo(boolean) {
            this.loadingTwo = boolean
        },
        //第一个按钮
        handleLoading() {
            this.loading = true
            this.cancelLoadingTimer && window.clearTimeout(this.cancelLoadingTimer)
        },
        cancelLoading(time = 100) {
            this.cancelLoadingTimer = setTimeout(() => {
                this.loading = false
            }, time)
        },
        changeLoading(boolean) {
            this.loading = boolean
        }
    },
    beforeDestroy() {
        this.cancelLoadingTimer && window.clearTimeout(this.cancelLoadingTimer)
        this.cancelLoadingTimerTwo && window.clearTimeout(this.cancelLoadingTimerTwo)
        this.cancelLoadingTimerThree && window.clearTimeout(this.cancelLoadingTimerThree)
        this.cancelLoadingTimerFour && window.clearTimeout(this.cancelLoadingTimerFour)
    },
};
export default cancelLoading;