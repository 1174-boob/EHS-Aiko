export const outterOptions2 =  {
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
    data: ['上年同月', '已选月', '环比']
  },
  color:['#ee6666', '#fac858'],
  xAxis: [
    {
      type: 'category',
      axisLabel: {
        rotate: 40
      },
      data: [],
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
      name: '上年同月',
      type: 'bar',
      stack: 'Ad',
      emphasis: {
        focus: 'series'
      },
      barMaxWidth: 50,
      data: []
    },
    {
      name: '已选月',
      type: 'bar',
      stack: 'Ad',
      emphasis: {
        focus: 'series'
      },
      barMaxWidth: 50,
      data: []
    },
    {
      name: '环比',
      type: 'line',
      yAxisIndex: 1,
      tooltip: {
        valueFormatter: function (value) {
          return value + ' %';
        }
      },
      data: []
    }
  ]
}