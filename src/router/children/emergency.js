/** 应急演练管理 */ 
export const emergency = [
  {
    path: 'emergencyPlan',
    name: '应急演练计划',
    meta: {
      title: '应急演练计划',
      routerCode:'emergencyPlan',
      isKeepalive:true,
      isPage: true,
    },
    component: resolve => require(['@/pages/emergencyManagement/emergencyPlan/index.vue'], resolve),
  },
  {
    path: 'addEmergencyPlan',
    name: '新建应急演练计划',
    meta: {
      title: '新建应急演练计划',
      routerCode:'emergencyPlan',
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/emergencyManagement/emergencyPlan/addEmergencyPlan.vue'], resolve),
  },
  {
    path: 'editEmergencyPlan',
    name: '编辑应急演练计划',
    meta: {
      title: '编辑应急演练计划',
      routerCode:'emergencyPlan',
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/emergencyManagement/emergencyPlan/editEmergencyPlan.vue'], resolve),
  },
  {
    path: 'planAdjust',
    name: '计划调整',
    meta: {
      title: '计划调整',
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/emergencyManagement/emergencyPlan/planAdjust.vue'], resolve),
  },
  {
    path: 'inputReport',
    name: '录入报告',
    meta: {
      title: '录入报告',
      routerCode:'emergencyPlan',
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/emergencyManagement/emergencyPlan/inputReport.vue'], resolve),
  },
  {
    path: 'previewEmergencyPlan',
    name: '查看应急演练计划',
    meta: {
      title: '查看应急演练计划',
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/emergencyManagement/emergencyPlan/previewEmergencyPlan.vue'], resolve),
  },
  {
    path: 'emergencyReport',
    name: '应急演练报告',
    meta: {
      title: '应急演练报告',
      routerCode:'emergencyReport',
      isKeepalive:true,
      isPage: true,
    },
    component: resolve => require(['@/pages/emergencyManagement/emergencyReport/index.vue'], resolve),
  },
  {
    path: 'editReport',
    name: '编辑应急演练报告',
    meta: {
      title: '编辑应急演练报告',
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/emergencyManagement/emergencyReport/editReport.vue'], resolve),
  },
  {
    path: 'previewReport',
    name: '查看应急演练报告',
    meta: {
      title: '查看应急演练报告',
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/emergencyManagement/emergencyReport/previewReport.vue'], resolve),
  },
  {
    path: 'emergencyApprove',
    name: '应急演练审批',
    meta: {
      title: '应急演练审批',
      routerCode:'emergencyApprove',
      isKeepalive:true,
      isPage: true,
    },
    component: resolve => require(['@/pages/emergencyManagement/emergencyApprove/index.vue'], resolve),
  },
  {
    path: 'approvePlanHandle',
    name: '应急演练计划处理',
    meta: {
      title: '应急演练计划处理',
      routerCode:'emergencyApprove',
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/emergencyManagement/emergencyApprove/approveHandle.vue'], resolve),
  },
  {
    path: 'approveReportHandle',
    name: '应急演练报告处理',
    meta: {
      title: '应急演练报告处理',
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/emergencyManagement/emergencyApprove/approveHandle.vue'], resolve),
  },
  {
    path: 'approvePlanView',
    name: '应急演练计划查看',
    meta: {
      title: '应急演练计划查看',
      routerCode:'emergencyApprove',
      isPage: true,
      invisible: true,
      isView: true
    },
    component: resolve => require(['@/pages/emergencyManagement/emergencyApprove/approveHandle.vue'], resolve),
  },
  {
    path: 'approveReportView',
    name: '应急演练报告查看',
    meta: {
      title: '应急演练报告查看',
      isPage: true,
      invisible: true,
      isView: true
    },
    component: resolve => require(['@/pages/emergencyManagement/emergencyApprove/approveHandle.vue'], resolve),
  },
  {
    path: 'emergencyDatabase',
    name: '应急预案数据库',
    meta: {
      title: '应急预案数据库',
      routerCode:'emergencyDatabase',
      isKeepalive:true,
      isPage: true,
    },
    component: resolve => require(['@/pages/emergencyManagement/emergencyDatabase/index.vue'], resolve),
  },
  {
    path: 'addDatabase',
    name: '新建应急预案数据库',
    meta: {
      title: '新建应急预案数据库',
      routerCode:'emergencyDatabase',
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/emergencyManagement/emergencyDatabase/addDatabase.vue'], resolve),
  },
  {
    path: 'editDatabase',
    name: '编辑应急预案数据库',
    meta: {
      title: '编辑应急预案数据库',
      routerCode:'emergencyDatabase',
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/emergencyManagement/emergencyDatabase/editDatabase.vue'], resolve),
  },
  {
    path: 'previewDatabase',
    name: '查看应急预案数据库',
    meta: {
      title: '查看应急预案数据库',
      routerCode:'emergencyDatabase',
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/emergencyManagement/emergencyDatabase/previewDatabase.vue'], resolve),
  },
  {
    path: 'emergencyDraftbox',
    name: '应急演练草稿箱',
    meta: {
      title: '应急演练草稿箱',
      routerCode:'emergencyDraftbox',
      isKeepalive:true,
      isPage: true,
    },
    component: resolve => require(['@/pages/emergencyManagement/emergencyDraftbox/index.vue'], resolve),
  },
  {
    path: 'editEmergencyDraft',
    name: '编辑应急演练草稿箱',
    meta: {
      title: '编辑应急演练草稿箱',
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/emergencyManagement/emergencyDraftbox/editEmergencyDraft.vue'], resolve),
  },
]
export const emergencyMap = emergency.reduce((prev, item) => {
  const { name, meta, component } = item
  prev[item.path] = {
    name,
    meta,
    component
  }
  return prev
}, {})