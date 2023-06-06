
import { debounce, isEmpty } from "lodash";
import refreshSvg from "@/assets/echarts/refresh.svg";
import downloadSvg from "@/assets/echarts/download.svg";
import exportSvg from "@/assets/echarts/export.svg";

// 折线图划过的效果
export const barObj = {
    // 折线图划过的效果
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            crossStyle: {
                color: '#999'
            }
        }
    },
    emphasis: {
        iconStyle: {
            textPadding: 10,
        }
    },
    // 间隔
    grid: {
        top: "18%",
        left: "5%",
        right: "90px",
        bottom: "5%",
        containLabel: true,
    },
    xAxis: {
        axisLabel: {
            interval: 0,
            rotate: -40,
        },
        axisPointer: {
            type: 'shadow'
        },
    },
}
// 饼状图
export const pieObj = {
    radius: ['40%', '70%'],
}
const dataAnalysisMinxin = {
    data() {
        return {
            deptList: [],
            disabledCommonDept: false,
            barMaxWidth: 50,
        }
    },
    computed: {
        corporationIdObj() {
            let arr = this.$refs.commonSearchItem.commonCenterAreaList || []
            let corporationIdObj = {}
            if (arr && arr.length == 1 && Array.isArray(arr[0].corporationList) && arr[0].corporationList.length == 1) {
                corporationIdObj.centerId = arr[0].corporationList[0].centerId
                corporationIdObj.corporationId = arr[0].corporationList[0].id
            }
            return corporationIdObj
        }
    },
    methods: {
        getFeatureMixin({ refreshFnName, exportFnObj }) {
            let { fileName } = exportFnObj
            let feature = {
                myRefresh: {
                    show: true,
                    title: "刷新",
                    icon: `image://${refreshSvg}`,
                    onclick: () => this.refreshMinxin(refreshFnName),
                },
                saveAsImage: {
                    show: true,
                    title: '下载',
                    name: fileName || '图表',
                    icon: `image://${downloadSvg}`,
                },
                myExport: {
                    show: true,
                    title: '导出',
                    icon: `image://${exportSvg}`,
                    onclick: () => this.exportMixin(exportFnObj),
                }
            }
            return feature
        },
        getdataZoom(end) {
            let dataZoom = [
                {
                    type: 'slider',
                    start: 0,
                    end,
                }
            ]
            return dataZoom
        },
        barDataHandle(ajaxData, needStack = false, needMatchXAxis = false) {
            // x轴数据
            let xAxisData = ajaxData.map(item => item.xdata)
            xAxisData = needMatchXAxis ? this.matchXAxis(xAxisData) : xAxisData
            // console.log('x轴数据', xAxisData);
            // series数据
            let series = [];
            (ajaxData[0].list || []).forEach(item => {
                let obj = {}
                obj.name = item.name
                obj.type = item.type ? item.type : 'bar'
                if (obj.type == 'line') {
                    obj.yAxisIndex = 1
                } else if (obj.type == 'bar') {
                    obj.barMaxWidth = this.barMaxWidth
                    if (needStack) obj.stack = 'stack'
                }
                series.push(obj)
            })
            // console.log('series数据1', series);
            series.forEach((item, index) => {
                let data = ajaxData.map(item1 => {
                    return item1.list[index].value || 0
                })
                item.data = data
            })
            // console.log('series数据2', series);
            // 图例
            let legendData = series.map(item => item.name)
            // console.log('图例', legendData);
            return { xAxisData, series, legendData }
        },
        // 匹配X轴数据
        matchXAxis(xAxis) {
            let xAxisData = []
            // 汇总
            if (this.summary) {  //x轴为中心
                xAxisData = xAxis.map(item => {
                    let orgAbbrName = this.getMappingValue(this.setCorporationTree, "corporationCode", item).corporationName
                    return orgAbbrName ? orgAbbrName : item
                })
            } else {
                if (this.formInline.corporationId || !isEmpty(this.corporationIdObj)) {  //x轴为部门
                    xAxisData = xAxis.map(item => {
                        let orgAbbrName = this.deptCache[item] ? this.deptCache[item] : item
                        return orgAbbrName
                    })
                } else {
                    xAxisData = xAxis.map(item => {  //x轴为组织
                        let orgName = this.getMappingValue(this.getCommonAddOrgnizeListAll, "orgId", item).orgName
                        return orgName ? orgName : item
                    })
                }
            }
            return xAxisData
        },
        // 各图表刷新
        refreshMinxin: debounce(function (methodName) {
            this[methodName]()
        }, 250, { leading: true, trailing: false }),
        // 各图表下载
        exportMixin: debounce(function (exportFnObj) {
            let { fnName, apiName, fileName } = exportFnObj
            fnName = fnName || 'exportEchartsDataFn'
            fileName = fileName || '图表'
            apiName && this[fnName](apiName, fileName)
        }, 250, { leading: true, trailing: false }),
        // 所属组织-获取部门
        corporationDeptChange(treeData) {
            this.deptList = treeData
        },
        corporationChange() {
            this.$set(this.formInline, 'deptId', undefined)
        },
    },
};

export default dataAnalysisMinxin;