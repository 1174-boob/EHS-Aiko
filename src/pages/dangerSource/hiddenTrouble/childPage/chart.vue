<template>
    <div :class="className"
         :style="{ height: height, width: width }" />
</template>
<script>
import * as echarts from "echarts";
const animationDuration = 1500;
export default {
    // mixins: [resize],
    props: {
        className: {
            type: String,
            default: "chart",
        },
        width: {
            type: String,
            default: "100%",
        },
        height: {
            type: String,
            default: "500px",
        },
        option: {
            type: Object,
            default: () => {
                return {
                    title: {
                        text: "暂无数据",
                        x: "center",
                        y: "center",
                        textStyle: {
                            fontSize: 14,
                            fontWeight: "normal",
                        },
                    },
                };
            },
        },
    },
    data () {
        return {
            chart: null,
        };
    },
    watch: {
        option: {
            handler (newData, oldData) {
                if (this.chart) {
                    this.chart.setOption(newData);
                } else {
                    this.chart = echarts.init(this.$el);
                    this.chart.setOption(newData);
                }
            },
            deep: true,
        },
    },
    mounted () {
        this.$nextTick(() => {
            // this.initChart();
        });
    },
    beforeDestroy () {
        if (!this.chart) {
            return;
        }
        this.chart.dispose();
        this.chart = null;
    },
    methods: {
        initChart () {
            this.chart = echarts.init(this.$el);
            this.chart.setOption(this.option);
        },
    },
};
</script>
