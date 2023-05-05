// 事故事件管理-数据统计分析
export const accidentManagementDA = [
  {
    path: 'accidentManagementDA',
    name: '数据统计分析',
    meta: {
      title: '数据统计分析',
      routerCode:'accidentManagementDA',
      isPage: true,
    },
    component: resolve => require(['@/pages/accidentManagement/dataAnalysis/index.vue'], resolve),
  },
]
// 危险作业管理-数据统计分析
export const dangerWorkDA = [
  {
    path: 'dangerWorkDA',
    name: '数据统计分析',
    meta: {
      title: '数据统计分析',
      routerCode:'dangerWorkDA',
      isPage: true,
    },
    component: resolve => require(['@/pages/dangerWorkStatic/dataAnalysis/index.vue'], resolve),
  },
]
// 教育培训管理-数据统计分析
export const resourcepoolDA = [
  {
    path: 'resourcepoolDA',
    name: '数据统计分析',
    meta: {
      title: '数据统计分析',
      routerCode:'resourcepoolDA',
      isPage: true,
    },
    component: resolve => require(['@/pages/resourcepool/dataAnalysis/index.vue'], resolve),
  },
]
// 隐患排查管理-数据统计分析
export const hiddenPerilsDA = [
  {
    path: 'hiddenPerilsDA',
    name: '数据统计分析',
    meta: {
      title: '数据统计分析',
      routerCode:'hiddenPerilsDA',
      isPage: true,
    },
    component: resolve => require(['@/pages/hiddenPerils/dataAnalysis/index.vue'], resolve),
  },
]
// 应急演练管理-数据统计分析
export const emergencyManagementDA = [
  {
    path: 'emergencyManagementDA',
    name: '数据统计分析',
    meta: {
      title: '数据统计分析',
      routerCode:'emergencyManagementDA',
      isPage: true,
    },
    component: resolve => require(['@/pages/emergencyManagement/dataAnalysis/index.vue'], resolve),
  },
]

const dataAnalysis = [
  ...accidentManagementDA,
  ...dangerWorkDA,
  ...resourcepoolDA,
  ...hiddenPerilsDA,
  ...emergencyManagementDA,
]
export const dataAnalysisMap = dataAnalysis.reduce((prev, item) => {
  const { name, meta, component } = item
  prev[item.path] = {
    name,
    meta,
    component
  }
  return prev
}, {})
