<template>
    <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
        <div class="download"
             v-if="showView == '1'">
            选择年份： <el-date-picker v-model="downloadYear"
                            type="year"
                            value-format="yyyy"
                            placeholder="选择年"
                            :clearable='false'>
            </el-date-picker>
            <span style="display: inline-block;width: 10px;"></span>
            <a-button type="primary"
                      @click="handelDownload">下载</a-button>
        </div>
        <div class="card-container">
            <a-tabs default-active-key="1"
                    @change="tabChange">
                <a-tab-pane v-for="(item, index) in titleList"
                            :key="item.value"
                            :tab="item.name">
                    <!-- <itemLiberty></itemLiberty> -->
                </a-tab-pane>
            </a-tabs>
            <dataCollect ref="dataCollectRef" v-if="showView == '1'"></dataCollect>
            <!-- <pieceYardage v-if="showView == '2'"></pieceYardage> -->
            <!-- <envIndexList v-if="showView == '3'"></envIndexList> -->
            <!-- <carbonEmission v-if="showView == '4'"></carbonEmission> -->
            <electricQuantity v-if="showView == '5'"></electricQuantity>
            <!-- <waterResource v-if="showView == '6'"></waterResource> -->
            <!-- <naturalGas v-if="showView == '7'"></naturalGas> -->
            <rubbish v-if="showView == '8'"></rubbish>
            <contaminant v-if="showView == '9'"></contaminant>
            <!-- <meanValueContrast v-if="showView == '10'"></meanValueContrast> -->
            <!-- <wasteWater v-if="showView == '11'"></wasteWater> -->
        </div>
    </div>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import getDictionaryItemObj from "@/utils/dictionary.js";
import { debounce } from "lodash";
import { getHiddenTroubleList } from "@/services/dangerSource/hiddenTrouble/index.js";
import dataCollect from "./childPage/dataCollect";
// import pieceYardage from "./childPage/pieceYardage";
// import envIndexList from "./childPage/envIndexList";
// import carbonEmission from "./childPage/carbonEmission";
import electricQuantity from "./childPage/electricQuantity";
// import waterResource from "./childPage/waterResource";
// import naturalGas from "./childPage/naturalGas";
import rubbish from "./childPage/rubbish";
import contaminant from "./childPage/contaminant";
// import meanValueContrast from "./childPage/meanValueContrast";
// import wasteWater from "./childPage/wasteWater";
import { downloadFile } from "@/services/envMonth.js";
import dayJs from "dayjs";
export default {
    data () {
        return {
            titleList: [
                {
                    name: "数据汇总表",
                    value: "1",
                },
                // {
                //     name: "单耗环比",
                //     value: "2",
                // },
                // {
                //     name: "环境指标详表",
                //     value: "3",
                // },
                // {
                //     name: "碳排放量",
                //     value: 4,
                // },
                {
                    name: "电量",
                    value: 5,
                },
                // {
                //     name: "水资源管理",
                //     value: 6,
                // },
                // {
                //     name: "天然气数据",
                //     value: 7,
                // },
                {
                    name: "废弃物",
                    value: 8,
                },
                {
                    name: "废水废气污染物排放",
                    value: 9,
                },
                // {
                //     name: "在线均值对比",
                //     value: 10,
                // },
                // {
                //     name: "废水管理",
                //     value: 11,
                // },
            ],
            showView: "1",
            downloadYear: null
        };
    },
    components: {
        dataCollect,
        // pieceYardage,
        // envIndexList,
        // carbonEmission,
        electricQuantity,
        // waterResource,
        // naturalGas,
        rubbish,
        contaminant,
        // meanValueContrast,
        // wasteWater,
    },
    computed: {},
    created () {
        this.setRouterCode("collect");
        this.downloadYear = dayJs(new Date()).format('YYYY')
    },
    methods: {
        // tab切换
        tabChange (e) {
            console.log(e);
            this.showView = e;
        },
        handelDownload () {
            console.log('下载')
            let corporationIds = []
            if (this.$refs.dataCollectRef.columnsIng && this.$refs.dataCollectRef.columnsIng.length) {
                corporationIds = this.$refs.dataCollectRef.columnsIng.filter(i => {
                    if (i.corporationId) {
                        return true
                    } else {
                        return false
                    }
                }).map(i => i.corporationId)
            }

            downloadFile({ year: this.downloadYear, corporationIds: corporationIds }).then(res => {
                const name = '环境月报汇总导出'
                const blob = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
                const downloadElement = document.createElement('a')
                const href = URL.createObjectURL(blob) //创建下载链接
                downloadElement.href = href
                downloadElement.download = name + '.xlsx'
                document.body.appendChild(downloadElement)
                downloadElement.click()
                document.body.removeChild(downloadElement)// 下载完成移除元素
                window.URL.revokeObjectURL(href) // 释放掉blob对象
                this.$antMessage.success("导出成功");
                this.exportCancle();
            })
        }
    },
};
</script>

<style lang="less" scoped>
.download {
    padding: 20px 0;
}
</style>
