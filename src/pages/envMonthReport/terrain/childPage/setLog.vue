<template>
    <div class="log bg-fc border-radius-3 border-f4">
        <div class="log-wrapper bg-fc">
            <h3 class="border-b-e7 border-b-f6 bg-fff pd-l-20 pd-r-20 font-18 color-333">操作日志</h3>
            <!-- beauty-scroll -->
            <div class="item-wrapper clx-show-scroll beauty-scroll pd-l-20 pd-r-20">
                <div class="log-item"
                     v-for="item in flowLogList"
                     :key="item.id">
                    <!-- <div class="pd-b-18 font-16 font-weight-bold">{{item.activityName}}</div> -->
                    <div class="border-b-f6">
                        <h3>{{item.handerType}}</h3>
                        <div class="pd-b-16 flex">
                            <span class="width-70 color-999">操作人：</span>
                            <span class="color-333 flex-1">{{item.hander}}</span>
                        </div>
                        <div class="pd-b-16 flex">
                            <span class="width-70 color-999">操作时间：</span>
                            <span class="color-333 flex-1">{{item.handerTime}}</span>
                        </div>
                        <div class="pd-b-16 flex">
                            <span class="width-70 color-999">备注:</span>
                            <span class="remarks-text color-333 flex-1 text-ellipsis">{{item.handerExplain}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        flowLogList: {
            type: Array,
            default: () => []
        },
    },
}
</script>

<style lang="less" scoped>
.log {
    width: 426px;
    overflow: hidden;
    height: 100%;
    margin-left: 20px;
    h3 {
        height: 58px;
        line-height: 58px;
    }
    .log-wrapper {
        height: 100%;
        overflow: hidden;
        .item-wrapper {
            height: calc(100% - 78px);
            .log-item {
                margin-top: 16px;
                &:nth-of-type(1) {
                    margin-top: 30px;
                }
                .remarks-text {
                    transform: translateY(-2.5px);
                }
            }
        }
    }
}
.width-70 {
    width: 70px;
}
.text-ellipsis {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    line-height: 20px;
}

@scrollbar-thumb: #ccc;
@scrollbar-track: transparent;
// 横向滚动条样式
.beauty-scroll {
    scrollbar-color: @scrollbar-thumb @scrollbar-track;
    scrollbar-width: thin;
    -ms-overflow-style: none;
    position: relative;

    &::-webkit-scrollbar {
        width: 3px;
        height: 6px;
    }

    &::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background: #ddd;
    }

    &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0);
        border-radius: 3px;
        background: @scrollbar-track;
    }
}
@media screen and (max-width: 1366px) {
    .log {
        width: 270px;
    }
}
@media screen and (min-width: 1367px) and (max-width: 1440px) {
    .log {
        width: 326px;
    }
}
</style>
  