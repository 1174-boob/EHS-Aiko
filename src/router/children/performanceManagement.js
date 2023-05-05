/** 应急演练管理 */ 
export const performanceManagement = [
  {
    path: 'performanceSummary',
    name: '管理绩效汇总',
    meta: {
      title: '管理绩效汇总',
      isPage: true,
    },
    component: resolve => require(['@/pages/performanceManagement/performanceMain/performanceSummary/index.vue'], resolve),
  },
  {
    path: 'performanceCorporation',
    name: '管理绩效-现地',
    meta: {
      title: '管理绩效-现地',
      isPage: true,
    },
    component: resolve => require(['@/pages/performanceManagement/performanceMain/performanceCorporation/index.vue'], resolve),
  },
  {
    path: 'performanceData',
    name: '管理绩效数据',
    meta: {
      title: '管理绩效数据',
      routerCode:'performanceData',
      isKeepalive:true,
      isPage: true,
    },
    component: resolve => require(['@/pages/performanceManagement/performanceMain/performanceData/index.vue'], resolve),
  },
  {
    path: 'dataFilling',
    name: '填报管理绩效',
    meta: {
      title: '填报管理绩效',
      isPage: true,
      invisible: true
    },
    component: resolve => require(['@/pages/performanceManagement/performanceMain/performanceData/dataFilling.vue'], resolve),
  },
  {
    path: 'dataFillingView',
    name: '查看管理绩效',
    meta: {
      title: '查看管理绩效',
      isPage: true,
      invisible: true,
      isView: true,
    },
    component: resolve => require(['@/pages/performanceManagement/performanceMain/performanceData/dataFilling.vue'], resolve),
  },
  {
    path: 'dataFillingEdit',
    name: '编辑管理绩效',
    meta: {
      title: '编辑管理绩效',
      isPage: true,
      invisible: true,
      isEdit: true,
    },
    component: resolve => require(['@/pages/performanceManagement/performanceMain/performanceData/dataFilling.vue'], resolve),
  },
  {
    path: 'performanceReport',
    name: '管理绩效报表',
    meta: {
      title: '管理绩效报表',
      routerCode:'performanceReport',
      isKeepalive:true,
      isPage: true,
    },
    component: resolve => require(['@/pages/performanceManagement/performanceMain/performanceReport/index.vue'], resolve),
  },
  {
    path: 'performanceReportConfig',
    name: '绩效报表配置',
    meta: {
      title: '绩效报表配置',
      isPage: true,
      invisible: true
    },
    component: resolve => require(['@/pages/performanceManagement/performanceMain/performanceReport/addAndEdit.vue'], resolve),
  },
  {
    path: 'performanceIndex',
    name: '管理绩效指标',
    meta: {
      title: '管理绩效指标',
      isPage: true,
    },
    component: resolve => require(['@/pages/performanceManagement/performanceMain/performanceIndex/index.vue'], resolve),
  },
  {
    path: 'performanceApproval',
    name: '管理绩效审批',
    meta: {
      title: '管理绩效审批',
      routerCode:'performanceApproval',
      isKeepalive:true,
      isPage: true,
    },
    component: resolve => require(['@/pages/performanceManagement/performanceMain/performanceApproval/index.vue'], resolve),
  },
  {
    path: 'performanceApprovalDetail',
    name: '绩效审批单详情',
    meta: {
      title: '绩效审批单详情',
      isPage: true,
      invisible: true,
      isView: true
    },
    component: resolve => require(['@/pages/performanceManagement/performanceMain/performanceApproval/resolveAndDetail.vue'], resolve),
  },
  {
    path: 'performanceApprovalResolve',
    name: '绩效审批单审批',
    meta: {
      title: '绩效审批单审批',
      routerCode:'performanceApproval',
      isPage: true,
      invisible: true,
      isResolve: true
    },
    component: resolve => require(['@/pages/performanceManagement/performanceMain/performanceApproval/resolveAndDetail.vue'], resolve),
  },
]
export const performanceManagementMap = performanceManagement.reduce((prev, item) => {
  const { name, meta, component } = item
  prev[item.path] = {
    name,
    meta,
    component
  }
  return prev
}, {})