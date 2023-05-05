export const occupationHealth = [
  {
    path: 'physicalExam',
    name: '体检管理',
    meta: {
      title: '体检管理',
      routerCode:'physicalExam',
      isKeepalive:true,
      isPage: true,
    },
    component: resolve => require(['@/pages/occupationHealth/physicalExam/physicalExamManage/index.vue'], resolve),
  },
  {
    path: 'physicalExamApprove',
    name: '体检管理审批',
    meta: {
      title: '体检管理审批',
      routerCode:'physicalExam',
      isKeepalive:true,
      invisible: true,
      isPage: true,
    },
    component: resolve => require(['@/pages/occupationHealth/physicalExam/physicalExamApprove/index.vue'], resolve),
  },
  {
    path: 'physicalExamDraftList',
    name: '体检申请草稿箱',
    meta: {
      title: '体检申请草稿箱',
      routerCode:'physicalExam',
      invisible: true,
      isKeepalive:true,
      isPage: true,
    },
    component: resolve => require(['@/pages/occupationHealth/physicalExam/physicalExamApprove/draftList.vue'], resolve),
  },
  {
    path: 'PEBook',
    name: '体检预约',
    meta: {
      title: '体检预约',
      routerCode:'physicalExam',
      isPage: true,
      isCreate: true,
      invisible: true
    },
    component: resolve => require(['@/pages/occupationHealth/physicalExam/physicalExamManage/PEBook.vue'], resolve),
  },
  {
    path: 'PEBookDetail',
    name: '体检详情',
    meta: {
      title: '体检详情',
      routerCode:'physicalExam',
      isPage: true,
      isDetail: true,
      invisible: true
    },
    component: resolve => require(['@/pages/occupationHealth/physicalExam/physicalExamManage/PEBookDetail.vue'], resolve),
  },
  {
    path: 'PEBookView',
    name: '体检预约查看',
    meta: {
      title: '体检预约查看',
      routerCode:'physicalExam',
      isPage: true,
      isView: true,
      invisible: true
    },
    component: resolve => require(['@/pages/occupationHealth/physicalExam/physicalExamManage/PEBook.vue'], resolve),
  },
  {
    path: 'PEBookResolve',
    name: '体检申请审核',
    meta: {
      title: '体检申请审核',
      routerCode:'physicalExam',
      isPage: true,
      isResolve: true,
      invisible: true
    },
    component: resolve => require(['@/pages/occupationHealth/physicalExam/physicalExamManage/PEBook.vue'], resolve),
  },
  {
    path: 'PEBookEdit',
    name: '体检申请编辑',
    meta: {
      title: '体检申请编辑',
      routerCode:'physicalExam',
      isPage: true,
      isEdit: true,
      invisible: true
    },
    component: resolve => require(['@/pages/occupationHealth/physicalExam/physicalExamManage/PEBook.vue'], resolve),
  },
  {
    path: 'PERecheck',
    name: '复查预约',
    meta: {
      title: '复查预约',
      routerCode:'physicalExam',
      isPage: true,
      isRecheck: true,
      invisible: true
    },
    component: resolve => require(['@/pages/occupationHealth/physicalExam/physicalExamManage/PEBook.vue'], resolve),
  },
  {
    path: 'multiPEBook',
    name: '批量预约体检新建',
    meta: {
      title: '批量预约体检新建',
      routerCode:'physicalExam',
      isCreate: true,
      isPage: true,
      invisible: true
    },
    component: resolve => require(['@/pages/occupationHealth/physicalExam/physicalExamManage/multiPEBook.vue'], resolve),
  },
  {
    path: 'multiPEBookEdit',
    name: '批量预约体检编辑',
    meta: {
      title: '批量预约体检编辑',
      routerCode:'physicalExam',
      isEdit: true,
      isPage: true,
      invisible: true
    },
    component: resolve => require(['@/pages/occupationHealth/physicalExam/physicalExamManage/multiPEBook.vue'], resolve),
  },
  {
    path: 'multiPEBookView',
    name: '批量预约体检查看',
    meta: {
      title: '批量预约体检查看',
      routerCode:'physicalExam',
      isPage: true,
      isView: true,
      invisible: true
    },
    component: resolve => require(['@/pages/occupationHealth/physicalExam/physicalExamManage/multiPEBook.vue'], resolve),
  },
  {
    path: 'multiPEBookResolve',
    name: '批量预约体检审核',
    meta: {
      title: '批量预约体检审核',
      routerCode:'physicalExam',
      isResolve: true,
      isPage: true,
      invisible: true
    },
    component: resolve => require(['@/pages/occupationHealth/physicalExam/physicalExamManage/multiPEBook.vue'], resolve),
  },
  {
    path: 'multiPEBookCreate',
    name: '批量预约体检编辑',
    meta: {
      title: '批量预约体检编辑',
      routerCode:'physicalExam',
      isEdit: true,
      isPage: true,
      invisible: true
    },
    component: resolve => require(['@/pages/occupationHealth/physicalExam/physicalExamManage/multiPEBook.vue'], resolve),
  },
  {
    path: 'postChange',
    name: '岗位管理',
    meta: {
      title: '岗位管理',
      routerCode:'postChange',
      isKeepalive:true,
      isPage: true,
    },
    component: resolve => require(['@/pages/occupationHealth/postManagement/index.vue'], resolve)
  },
  {
    path: 'postChangeDraftList',
    name: '岗位变动申请草稿箱',
    meta: {
      title: '岗位变动申请草稿箱',
      routerCode:'postChange',
      isKeepalive:true,
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/occupationHealth/postManagement/draftList.vue'], resolve)
  },
  {
    path: 'postChangeCreate',
    name: '新建变岗申请',
    meta: {
      title: '新建变岗申请',
      routerCode:'postChange',
      isPage: true,
      invisible: true,
      isCreate: true, // 新建
    },
    component: resolve => require(['@/pages/occupationHealth/postManagement/create.vue'], resolve)
  },
  {
    path: 'postChangeEdit',
    name: '编辑变岗申请',
    meta: {
      title: '编辑变岗申请',
      routerCode:'postChange',
      isPage: true,
      invisible: true,
      isEdit: true, // 编辑
    },
    component: resolve => require(['@/pages/occupationHealth/postManagement/create.vue'], resolve)
  },
  {
    path: 'postChangeResolve',
    name: '处理变岗申请',
    meta: {
      title: '处理变岗申请',
      routerCode:'postChange',
      isPage: true,
      isResolve: true,
      invisible: true, // 处理
    },
    component: resolve => require(['@/pages/occupationHealth/postManagement/create.vue'], resolve),
  },
  {
    path: 'postChangeView',
    name: '查看变岗申请',
    meta: {
      title: '查看变岗申请',
      routerCode:'postChange',
      isPage: true,
      invisible: true,
      disabled: true,
      isView: true, // 查看
    },
    component: resolve => require(['@/pages/occupationHealth/postManagement/create.vue'], resolve)
  },
  {
    path: 'ppeManage',
    name: 'PPE管理',
    meta: {
      title: 'PPE管理',
      routerCode:'ppeManage',
      isKeepalive:true,
      isPage: true,
      isView: true,
    },
    component: resolve => require(['@/pages/ppeManage/index.vue'], resolve),
  },
  {
    path: 'ppeClaimAdd',
    name: 'PPE领用管理新增编辑',
    meta: {
      title: 'PPE领用申请',
      routerCode:'ppeManage',
      isPage: true,
      isView: true,
      invisible: true
    },
    component: resolve => require(['@/pages/ppeManage/ppeClaim/ppeClaimAdd/ppeClaimAdd.vue'], resolve),
  },
  {
    path: 'ppeClaimShow',
    name: 'PPE领用管理查看',
    meta: {
      title: 'PPE领用查看',
      routerCode:'ppeManage',
      isPage: true,
      isView: true,
      invisible: true
    },
    component: resolve => require(['@/pages/ppeManage/ppeClaim/ppeClaimHandleAndShow/ppeClaimHandleAndShow.vue'], resolve),
  },
  {
    path: 'ppeClaimHandle',
    name: 'PPE领用管理处理',
    meta: {
      title: 'PPE领用审批',
      routerCode:'ppeManage',
      isPage: true,
      isView: true,
      invisible: true
    },
    component: resolve => require(['@/pages/ppeManage/ppeClaim/ppeClaimHandleAndShow/ppeClaimHandleAndShow.vue'], resolve),
  },
  {
    path: 'ppeClaimDraft',
    name: 'PPE领用管理草稿箱',
    meta: {
      title: 'PPE领用管理草稿箱',
      routerCode:'ppeManage',
      isKeepalive:true,
      isPage: true,
      isView: true,
      invisible: true
    },
    component: resolve => require(['@/pages/ppeManage/ppeClaim/ppeClaimDraft/ppeClaimDraft.vue'], resolve),
  },
  {
    path: 'ppeStockAdd',
    name: 'PPE报废管理新增编辑',
    meta: {
      title: 'PPE报废申请',
      routerCode:'ppeManage',
      isPage: true,
      isView: true,
      invisible: true
    },
    component: resolve => require(['@/pages/ppeManage/ppeStock/ppeStockAdd/ppeStockAdd.vue'], resolve),
  },
  {
    path: 'ppeStockShow',
    name: 'PPE报废管理查看',
    meta: {
      title: 'PPE报废查看',
      routerCode:'ppeManage',
      isPage: true,
      isView: true,
      invisible: true
    },
    component: resolve => require(['@/pages/ppeManage/ppeStock/ppeStockHandleAndShow/ppeStockHandleAndShow.vue'], resolve),
  },
  {
    path: 'ppeStockHandle',
    name: 'PPE报废管理处理',
    meta: {
      title: 'PPE报废审批',
      routerCode:'ppeManage',
      isPage: true,
      isView: true,
      invisible: true
    },
    component: resolve => require(['@/pages/ppeManage/ppeStock/ppeStockHandleAndShow/ppeStockHandleAndShow.vue'], resolve),
  },
  {
    path: 'ppeStockDraft',
    name: 'PPE报废管理草稿箱',
    meta: {
      title: 'PPE报废管理草稿箱',
      routerCode:'ppeManage',
      isKeepalive:true,
      isPage: true,
      isView: true,
      invisible: true
    },
    component: resolve => require(['@/pages/ppeManage/ppeStock/ppeStockDraft/ppeStockDraft.vue'], resolve),
  },
  {
    path: 'healthStandingBook',
    name: '人员台账',
    meta: {
      title: '人员台账',
      routerCode:'healthStandingBook',
      isKeepalive:true,
      isPage: true,
    },
    component: resolve => require(['@/pages/occupationHealth/healthStandingBook/index.vue'], resolve)
  },
  {
    path: 'addEditStandingBook',
    name: '新增编辑人员台账',
    meta: {
      title: '新增编辑人员台账',
      routerCode:'healthStandingBook',
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/occupationHealth/healthStandingBook/addEditStandingBook.vue'], resolve)
  },
  {
    path: 'standingBookDetail',
    name: '人员台账详情',
    meta: {
      title: '人员台账详情',
      routerCode:'healthStandingBook',
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/occupationHealth/healthStandingBook/standingBookDetail.vue'], resolve)
  },
  {
    path: 'hazardInformationDatabase',
    name: '危害岗位信息数据库',
    meta: {
      title: '危害岗位信息数据库',
      isPage: true,
    },
    component: resolve => require(['@/pages/occupationHealth/hazardInformationDatabase'], resolve)
  }, {
    path: 'occupationHarmElement',
    name: '职业危害因素检测',
    meta: {
      title: '职业危害因素检测',
      isPage: true,
    },
    component: resolve => require(['@/pages/occupationHealth/occupationHarmElement/index.vue'], resolve),
  },
  {
    path: 'dataStatsAnalyse',
    name: '数据统计分析',
    meta: {
      title: '数据统计分析',
      isPage: true,
    },
    component: resolve => require(['@/pages/occupationHealth/dataStatsAnalyse/index.vue'], resolve),
  }, {
    path: 'dataStatsAnalyseGroup',
    name: '数据统计分析-集团',
    meta: {
      title: '数据统计分析-集团',
      isPage: true,
    },
    component: resolve => require(['@/pages/occupationHealth/dataStatsAnalyseGroup/index.vue'], resolve),
  },
]

export const occupationHealthMap = occupationHealth.reduce((prev, item) => {
  const { name, meta, component } = item
  prev[item.path] = {
    name,
    meta,
    component
  }
  return prev
}, {})
