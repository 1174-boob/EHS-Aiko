
import { debounce, cloneDeep } from "lodash";
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
    grid: (bottom = '5%') => {
        return {
            top: "18%",
            left: "5%",
            right: "90px",
            bottom,
            containLabel: true,
        }
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
    // 警示线
    markLine: {
        // 报警值
        alarmValue: {
            silent: false,             //鼠标悬停事件  true没有，false有
            lineStyle: {               //警戒线的样式  ，虚实  颜色
                type: "solid",
                color: "#dc243c",
            },
            label: {
                position: 'end',
                formatter: "报警值：{c}",
                color: "inherit",
            },
        },
        // 预警值
        alertValue: {
            silent: false,             //鼠标悬停事件  true没有，false有
            lineStyle: {               //警戒线的样式  ，虚实  颜色
                type: "solid",
                color: "#f59a23",
            },
            label: {
                position: 'end',
                formatter: "预警值：{c}",
                color: "inherit",
            },
        }
    }
}
// 饼状图
export const pieObj = {
    radius: ['40%', '70%'],
}
const dataAnalysisMinxin = {
    data() {
        return {
            barMaxWidth: 50,
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
            }
            return feature
        },
        getdataZoom(start = 0, end = 100) {
            let dataZoom = [
                {
                    type: 'slider',
                    start,
                    end,
                }
            ]
            return dataZoom
        },
        barDataHandle(ajaxData) {
            // x轴数据
            let xAxisData = ajaxData.xdata || []

            // series数据
            let barData = (ajaxData.barData || []).map(item => item - 0)
            let lineData = (ajaxData.lineData || []).map(item => item - 0)
            let series = { barData, lineData }

            // y轴最大值
            let alarm = (ajaxData.alarm || []).filter(item => item).map(item => item - 0)
            let warning = (ajaxData.warning || []).filter(item => item).map(item => item - 0)
            let maxMarkLineArr = [...alarm, ...warning].sort((x, y) => y - x)
            let maxMarkLineValue = maxMarkLineArr.length ? maxMarkLineArr[0] : 0
            let barDataAndlineDataArr = [...barData, ...lineData].sort((x, y) => y - x)
            let barDataAndlineDataMaxVal = barDataAndlineDataArr.length ? barDataAndlineDataArr[0] : 0
            let yAxisMax = barDataAndlineDataMaxVal <= maxMarkLineValue ? maxMarkLineValue : undefined

            // 警戒线markLine
            let markLine = []
            alarm.forEach(item => {
                let obj = {
                    ...barObj.markLine.alarmValue,
                    yAxis: item,
                }
                markLine.push(obj)
            })
            warning.forEach(item => {
                let obj = {
                    ...barObj.markLine.alertValue,
                    yAxis: item,
                }
                markLine.push(obj)
            })

            return { xAxisData, series, yAxisMax, markLine }
        },
        // 各图表刷新
        refreshMinxin: debounce(function (methodName) {
            this[methodName]()
        }, 250, { leading: true, trailing: false }),
    },
};

export default dataAnalysisMinxin;