export const echartFst =  {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999'
      }
    }
  },
  grid: {
    top: '12%',
    left: '1%',
    right: '1%',
    bottom: '2%',
    containLabel: true
  },
  legend: {
    data: ['红线隐患', '一类隐患','二类隐患','三类隐患', '整改率']
  },
  color:['#ee6666', '#fac858', '#5470c6', '#91cc75', '#73c0de'],
  xAxis: [
    {
      type: 'category',
      axisLabel: {
        rotate: 40
      },
      data: ['制造部', '企划部', '产销管理部', 'CF技术部', 'Array技术部', 'Module技术部', 'Cell技术部','技安环保部','智造技术部','动力技术部'],
      axisPointer: {
        type: 'shadow'
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      name: '数量',
      min: 0,
      max: 500,
      interval: 100,
    },
    {
      type: 'value',
      name: '整改率',
      min: 0,
      max: 100,
      interval: 20,
      axisLabel: {
        formatter: '{value} %'
      }
    }
  ],
  series: [
    {
      name: '红线隐患',
      type: 'bar',
      stack: 'Ad',
      emphasis: {
        focus: 'series'
      },
      barMaxWidth: 50,
      data: [20, 25, 76, 135, 162, 32, 20, 60, 135, 162]
    },
    {
      name: '一类隐患',
      type: 'bar',
      stack: 'Ad',
      emphasis: {
        focus: 'series'
      },
      barMaxWidth: 50,
      data: [60, 59, 90, 26, 28, 70, 175, 182, 48, 18]
    },
    {
      name: '二类隐患',
      type: 'bar',
      stack: 'Ad',
      emphasis: {
        focus: 'series'
      },
      barMaxWidth: 50,
      data: [18, 9, 20, 26, 118, 77, 56, 18, 48, 88]
    },
    {
      name: '三类隐患',
      type: 'bar',
      stack: 'Ad',
      emphasis: {
        focus: 'series'
      },
      barMaxWidth: 50,
      data: [6, 9, 9, 26, 128, 70, 76, 18, 47, 20]
    },
    {
      name: '整改率',
      type: 'line',
      yAxisIndex: 1,
      tooltip: {
        valueFormatter: function (value) {
          return value + ' %';
        }
      },
      data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2,10.2, 20.3, 23.4,]
    }
  ]
}