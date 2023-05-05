/** 应急演练管理 */ 
export const performanceManagementBranch = [
  {
    path: 'performanceBranchIndex',
    name: '组织绩效指标',
    meta: {
      title: '组织绩效指标',
      isPage: true,
    },
    component: resolve => require(['@/pages/performanceManagement/performanceBranch/performanceIndex/index.vue'], resolve),
  },
  {
    path: 'performanceBranchReport',
    name: '组织绩效报表',
    meta: {
      title: '组织绩效报表',
      isPage: true,
    },
    component: resolve => require(['@/pages/performanceManagement/performanceBranch/performanceReport/index.vue'], resolve),
  },
  {
    path: 'performanceBranchData',
    name: '组织绩效数据',
    meta: {
      title: '组织绩效数据',
      isPage: true,
      routerCode:'',
      isKeepalive:true,
    },
    component: resolve => require(['@/pages/performanceManagement/performanceBranch/performanceData/index.vue'], resolve),
  },
  {
    path: 'branchDataFilling',
    name: '组织填报管理绩效',
    meta: {
      title: '组织填报管理绩效',
      isPage: true,
      invisible: true
    },
    component: resolve => require(['@/pages/performanceManagement/performanceBranch/performanceData/dataFilling.vue'], resolve),
  },
  {
    path: 'branchDataFillingView',
    name: '查看管理绩效',
    meta: {
      title: '查看管理绩效',
      isPage: true,
      invisible: true,
      isView: true,
    },
    component: resolve => require(['@/pages/performanceManagement/performanceBranch/performanceData/dataFilling.vue'], resolve),
  },
  {
    path: 'branchDataFillingEdit',
    name: '编辑管理绩效',
    meta: {
      title: '编辑管理绩效',
      isPage: true,
      invisible: true,
      isEdit: true,
    },
    component: resolve => require(['@/pages/performanceManagement/performanceBranch/performanceData/dataFilling.vue'], resolve),
  },
  
  {
    path: 'performanceBranchReportConfig',
    name: '组织绩效报表配置',
    meta: {
      title: '组织绩效报表配置',
      isPage: true,
      invisible: true
    },
    component: resolve => require(['@/pages/performanceManagement/performanceBranch/performanceReport/addAndEdit.vue'], resolve),
  },
  {
    path: 'performanceBranchCorporation',
    name: '组织绩效-部门',
    meta: {
      title: '组织绩效-部门',
      isPage: true,
    },
    component: resolve => require(['@/pages/performanceManagement/performanceBranch/performanceCorporation/index.vue'], resolve),
  },
  {
    path: 'performanceBranchSummary',
    name: '组织绩效汇总',
    meta: {
      title: '组织绩效汇总',
      isPage: true,
    },
    component: resolve => require(['@/pages/performanceManagement/performanceBranch/performanceSummary/index.vue'], resolve),
  },
]
export const performanceManagementBranchMap = performanceManagementBranch.reduce((prev, item) => {
  const { name, meta, component } = item
  prev[item.path] = {
    name,
    meta,
    component
  }
  return prev
}, {})