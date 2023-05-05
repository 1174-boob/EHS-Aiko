<template>
  <div class="myChart-box" :id="idBox" ref="idBox">
    <div ref="myChart" :id="id" class="iCharts"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import elementResizeDetectorMaker from "element-resize-detector";
const erd = elementResizeDetectorMaker();
import { debounce } from "lodash";
export default {
  props: {
    option: {
      type: Object,
      default: {}
    },
  },
  data() {
    return {
      myChart: null,
      idBox: undefined,
      id: undefined,
    }
  },
  created() {
    this.idBox = this.guid()
    this.id = this.guid()
  },
  mounted() {
    // 防止初次渲染宽度溢出的情况 
    setTimeout(() => {
      this.init()
      let doc = this.$refs.idBox
      let _this = this
      erd.listenTo(doc, debounce(function () {
        _this.resize()
      }, 100))
    })
  },
  methods: {
    resize() {
      this.$nextTick(() => {
        this.myChart && this.myChart.resize()
      });
    },
    init() {
      this.myChart && this.myChart.dispose()
      this.myChart = echarts.init(document.getElementById(`${this.id}`))
      this.myChart.setOption(this.option, true)
    },
  },
  watch: {
    option: {
      handler(newVal, oldVal) {
        this.init();
      },
      deep: true
    }
  },
  beforeDestroy() {
    this.$refs.idBox && erd.uninstall(this.$refs.idBox);
    this.myChart && this.myChart.dispose()
  }
}
</script>

<style lang="less" scoped>
.myChart-box {
  width: 100%;
  height: 100%;
  display: flex;
  .iCharts {
    flex: 1;
    width: 100%;
    height: 100%;
  }
}
</style>