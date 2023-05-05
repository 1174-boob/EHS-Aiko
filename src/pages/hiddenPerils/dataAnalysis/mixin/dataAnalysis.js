import {
    debounce,
    isEmpty
} from "lodash";
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
            // textPosition: 'top'
            textPadding: 10,
            // texetPaddingTop:20
        }
    },
    // 间隔
    grid: {
        top: "18%",
        left: "5%",
        right: "70px",
        bottom: "5%",
        containLabel: true,
    },
    //总览页间隔-不带图标下载
    gridNoIcon: {
        top: "12%",
        left: "5%",
        right: "5%",
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
        },
        corporationIdObjTwo() {
            let arr = this.$refs.commonSearchItemTwo.commonCenterAreaList || []
            let corporationIdObj = {}
            if (arr && arr.length == 1 && Array.isArray(arr[0].corporationList) && arr[0].corporationList.length == 1) {
                corporationIdObj.centerId = arr[0].corporationList[0].centerId
                corporationIdObj.corporationId = arr[0].corporationList[0].id
            }
            return corporationIdObj
        }
    },
    methods: {
        getFeatureMixin({
            refreshFnName,
            exportFnObj
        }) {
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
                    icon: `image://${downloadSvg}`,
                },
                myExport: {
                    show: this.hiddenEexport ? false : true,
                    title: '导出',
                    icon: `image://${exportSvg}`,
                    onclick: () => this.exportMixin(exportFnObj),
                }
            }
            return feature
        },
        getdataZoom(end) {
            let dataZoom = [{
                type: 'slider',
                start: 0,
                end,
            }]
            return dataZoom
        },
        barDataHandle(ajaxData, needStack = false, needMatchXAxis = false, needSearchFormName = 'formInline') {
            // x轴数据
            let xAxisData = ajaxData.map(item => item.xdata)
            xAxisData = needMatchXAxis ? this.matchXAxis(xAxisData, needSearchFormName) : xAxisData
            // series数据
            let series = []
            ajaxData[0].list.forEach(item => {
                let obj = { ...item }
                obj.name = item.name
                obj.type = item.type ? item.type : 'bar'
                if (obj.type == 'line') {
                    obj.yAxisIndex = 1
                } else if (obj.type == 'bar') {
                    obj.barMaxWidth = 50
                    if (needStack) obj.stack = 'stack'
                }
                series.push(obj)
            })
            series.forEach((item, index) => {
                let data = ajaxData.map(item1 => {
                    return item1.list[index].value || 0
                })
                item.data = data
            })
            // 图例
            let legendData = series.map(item => item.name)
            return {
                xAxisData,
                series,
                legendData
            }
        },
        // 匹配X轴数据
        matchXAxis(xAxis, needSearchFormName) {
            let xAxisData = []
            if (needSearchFormName == 'none') { //带查询但不展示查询-例如总览
                if (this.formInline.corporationId) { //x轴为部门
                    xAxisData = xAxis.map(item => {
                        let orgAbbrName = this.deptCache[item] ? this.deptCache[item] : item
                        return orgAbbrName
                    })
                } else {
                    xAxisData = xAxis.map(item => { //x轴为组织
                        let orgAbbrName = this.getMappingValue(this.getCommonAddOrgnizeListAll, "id", item).orgAbbrName
                        return orgAbbrName ? orgAbbrName : item
                    })
                }
            } else if (this[needSearchFormName].isSummary) { // 汇总
                xAxisData = xAxis.map(item => {
                    let orgAbbrName = this.getMappingValue(this.setCorporationTree, "corporationCode", item).corporationName
                    return orgAbbrName ? orgAbbrName : item
                })
            } else {
                if (needSearchFormName == 'formInline') {
                    if (this.formInline.corporationId || !isEmpty(this.corporationIdObj)) { //x轴为部门
                        xAxisData = xAxis.map(item => {
                            let orgAbbrName = this.deptCache[item] ? this.deptCache[item] : item
                            return orgAbbrName
                        })
                    } else {
                        xAxisData = xAxis.map(item => { //x轴为组织
                            let orgAbbrName = this.getMappingValue(this.getCommonAddOrgnizeListAll, "id", item).orgAbbrName
                            return orgAbbrName ? orgAbbrName : item
                        })
                    }
                } else {
                    if (this.formInline.corporationId || this.formInlineTwoObj.corporationId || !isEmpty(this.corporationIdObjTwo)) { //x轴为部门
                        xAxisData = xAxis.map(item => {
                            let orgAbbrName = this.deptCache[item] ? this.deptCache[item] : item
                            return orgAbbrName
                        })
                    } else {
                        xAxisData = xAxis.map(item => { //x轴为组织
                            let orgAbbrName = this.getMappingValue(this.getCommonAddOrgnizeListAll, "id", item).orgAbbrName
                            return orgAbbrName ? orgAbbrName : item
                        })
                    }
                }

            }
            return xAxisData
        },
        // 各图表刷新
        refreshMinxin: debounce(function (methodName) {
            this[methodName]()
        }, 250, {
            leading: true,
            trailing: false
        }),
        // 各图表下载
        exportMixin: debounce(function (exportFnObj) {
            let {
                fnName,
                apiName
            } = exportFnObj
            fnName = fnName ? fnName : 'exportEchartsDataFn'
            apiName && this[fnName](apiName)
        }, 250, {
            leading: true,
            trailing: false
        }),
        // 所属组织-获取部门
        corporationDeptChange(treeData) {
            this.deptList = treeData
        },
        corporationChange(needSearchFormName) {
            this.$set(this[needSearchFormName], 'deptId', undefined)
        }
    },
};

export default dataAnalysisMinxin;