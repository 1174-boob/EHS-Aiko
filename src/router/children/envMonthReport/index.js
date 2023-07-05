// 安全月报子公司
export const envMonthReport = [
  {
      path: 'collect',
      name: '环境能源月报汇总',
      meta: {
          title: '环境能源月报汇总',
          routerCode:'collect',
          isPage: true,
      },
      component: resolve => require(['@/pages/envMonthReport/collect/index.vue'], resolve),
  },{
    path: 'terrain',
    name: '环境能源月报',
    meta: {
        title: '环境能源月报',
        routerCode:'terrain',
        isKeepalive:true,
        isPage: true,
    },
    component: resolve => require(['@/pages/envMonthReport/terrain/index.vue'], resolve),
},{
    path: 'envDetails',
    name: '环境月报信息',
    meta: {
        title: '环境月报信息',
        routerCode:'envDetails',
        isPage: true,
        invisible: true,
    },
    component: resolve => require(['@/pages/envMonthReport/terrain/childPage/envDetails.vue'], resolve),
},
]

export const envMonthReportMap = envMonthReport.reduce((prev, item) => {
    const { name, meta, component } = item
    prev[item.path] = {
    name,
    meta,
    component
    }
    return prev
  }, {})