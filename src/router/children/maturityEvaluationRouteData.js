/** 成熟度评价 */ 
export const maturityEvaluationRouteData = [
  {
    path: 'maturityEvaluationQuota',
    name: '成熟度评价指标',
    meta: {
      title: '成熟度评价指标',
      isPage: true,
      isKeepalive:true,
    },
    component: resolve => require(['@/pages/maturityEvaluation/maturityEvaluationQuota/index.vue'], resolve),
  },
  {
    path: 'maturityEvaluationQuotaReport',
    name: '成熟度评价报表',
    meta: {
      title: '成熟度评价报表',
      isPage: true,
      isKeepalive:true,
    },
    component: resolve => require(['@/pages/maturityEvaluation/maturityEvaluationQuotaReport/index.vue'], resolve),
  },
  {
    path: 'maturityEvaluationQuotaReportConfig',
    name: '成熟度评价报表配置',
    meta: {
      title: '成熟度评价报表配置',
      isPage: true,
      invisible: true
    },
    component: resolve => require(['@/pages/maturityEvaluation/maturityEvaluationQuotaReport/addAndEdit.vue'], resolve),
  },
  {
    path: 'maturityEvaluationData',
    name: '成熟度评价数据',
    meta: {
      title: '成熟度评价数据',
      isPage: true,
      routerCode:'',
      isKeepalive:true,
    },
    component: resolve => require(['@/pages/maturityEvaluation/maturityEvaluationData/index.vue'], resolve),
  },
  {
    path: 'maturityEvaluationDataFilling',
    name: '填报成熟度评价数据',
    meta: {
      title: '填报成熟度评价数据',
      isPage: true,
      invisible: true,
      isKeepalive:true,
    },
    component: resolve => require(['@/pages/maturityEvaluation/maturityEvaluationData/dataFilling.vue'], resolve),
  },
  {
    path: 'maturityEvaluationSummary',
    name: '成熟度评价汇总',
    meta: {
      title: '成熟度评价汇总',
      isPage: true,
    },
    component: resolve => require(['@/pages/maturityEvaluation/maturityEvaluationSummary/index.vue'], resolve),
  },
]

export const performanceManagementMap = maturityEvaluationRouteData.reduce((prev, item) => {
  const { name, meta, component } = item
  prev[item.path] = {
    name,
    meta,
    component
  }
  return prev
}, {})