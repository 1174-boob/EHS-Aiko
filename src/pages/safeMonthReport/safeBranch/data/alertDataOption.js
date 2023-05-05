export const options =  {
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
    data: ['真实报警数', '虚惊报警数','例行测试报警数']
  },
  color:['#ee6666', '#fac858', '#5470c6'],
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
    },
  ],
  series: [
    {
      name: '真实报警数',
      type: 'bar',
      stack: 'Ad',
      emphasis: {
        focus: 'series'
      },
      barMaxWidth: 50,
      data: []
    },
    {
      name: '虚惊报警数',
      type: 'bar',
      stack: 'Ad',
      emphasis: {
        focus: 'series'
      },
      barMaxWidth: 50,
      data: []
    },
    {
      name: '例行测试报警数',
      type: 'bar',
      stack: 'Ad',
      emphasis: {
        focus: 'series'
      },
      barMaxWidth: 50,
      data: []
    }
  ]
}