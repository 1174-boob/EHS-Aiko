export const chemicalsMsds = [
  {
    path: 'msdsApprove',
    name: '化学品MSDS审批',
    meta: {
      title: '化学品MSDS审批',
      routerCode:'msdsApprove',
      isKeepalive:true,
      isPage: true,
    },
    component: resolve => require(['@/pages/chemicals/chemicalsIdentification/msdsApprove/index.vue'], resolve),
  },
  {
    path: 'msdsApproveDraftList',
    name: '化学品MSDS审批草稿箱',
    meta: {
      title: '化学品MSDS审批草稿箱',
      routerCode:'msdsApprove',
      isKeepalive:true,
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/chemicals/chemicalsIdentification/msdsApprove/draftList.vue'], resolve),
  },
  {
    path: 'msdsApproveCreate',
    name: '化学品MSDS审批新建',
    meta: {
      title: '化学品MSDS审批新建',
      routerCode:'msdsApprove',
      isPage: true,
      isCreate: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/chemicals/chemicalsIdentification/msdsApprove/create.vue'], resolve),
  },
  {
    path: 'msdsApproveEdit',
    name: '化学品MSDS审批编辑',
    meta: {
      title: '化学品MSDS审批编辑',
      routerCode:'msdsApprove',
      isPage: true,
      isEdit: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/chemicals/chemicalsIdentification/msdsApprove/create.vue'], resolve),
  },
  {
    path: 'msdsApproveResolve',
    name: '化学品MSDS审批处理',
    meta: {
      title: '化学品MSDS审批处理',
      routerCode:'msdsApprove',
      isPage: true,
      isResolve: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/chemicals/chemicalsIdentification/msdsApprove/create.vue'], resolve),
  },
  {
    path: 'msdsApproveView',
    name: '化学品MSDS审批查看',
    meta: {
      title: '化学品MSDS审批查看',
      routerCode:'msdsApprove',
      isPage: true,
      isView: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/chemicals/chemicalsIdentification/msdsApprove/create.vue'], resolve),
  },
  {
    path: 'msdsStore',
    name: '化学品MSDS库',
    meta: {
      title: '化学品MSDS库',
      routerCode:'msdsStore',
      isPage: true,
    },
    component: resolve => require(['@/pages/chemicals/chemicalsIdentification/msdsStore/index.vue'], resolve),
  },
  {
    path: 'trainingDatabase',
    name: '化学品培训资料库',
    meta: {
      title: '化学品培训资料库',
      routerCode:'trainingDatabase',
      isKeepalive:true,
      isPage: true,
    },
    component: resolve => require(['@/pages/chemicals/chemicalsIdentification/trainingDatabase/index.vue'], resolve),
  },
  {
    path: 'trainingDatabaseCreate',
    name: '化学品培训资料库新建',
    meta: {
      title: '化学品培训资料库新建',
      routerCode:'trainingDatabase',
      isPage: true,
      invisible: true
    },
    component: resolve => require(['@/pages/chemicals/chemicalsIdentification/trainingDatabase/create.vue'], resolve),
  },
  {
    path: 'trainingDatabaseEdit',
    name: '化学品培训资料库编辑',
    meta: {
      title: '化学品培训资料库编辑',
      routerCode:'trainingDatabase',
      isPage: true,
      invisible: true
    },
    component: resolve => require(['@/pages/chemicals/chemicalsIdentification/trainingDatabase/create.vue'], resolve),
  },
  {
    path: 'trainingDatabaseView',
    name: '化学品培训资料库查看',
    meta: {
      title: '化学品培训资料库查看',
      routerCode:'trainingDatabase',
      isPage: true,
      isView: true,
      invisible: true
    },
    component: resolve => require(['@/pages/chemicals/chemicalsIdentification/trainingDatabase/create.vue'], resolve),
  }
]

export const chemicalsMsdsMap = chemicalsMsds.reduce((prev,item)=> {
  const { name, meta, component } = item
  prev[item.path] = {
    name,
    meta,
    component
  }
  return prev
},{})
