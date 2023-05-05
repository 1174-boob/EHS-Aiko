export const improveProposal = [
  {
    path: 'myProposal',
    name: '我的提案',
    meta: {
      title: '我的提案',
      routerCode:'myProposal',
      isKeepalive:true,
      isPage: true,
    },
    component: resolve => require(['@/pages/improveProposalManagement/myProposal/index.vue'], resolve),
  },
  {
    path: 'addProposal',
    name: '新建提案',
    meta: {
      title: '新建提案',
      routerCode:'myProposal',
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/improveProposalManagement/myProposal/addProposal.vue'], resolve),
  },
  {
    path: 'editProposal',
    name: '编辑提案',
    meta: {
      title: '编辑提案',
      routerCode:'myProposal',
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/improveProposalManagement/myProposal/editProposal.vue'], resolve),
  },
  {
    path: 'previewProposal',
    name: '查看提案',
    meta: {
      title: '查看提案',
      routerCode:'myProposal',
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/improveProposalManagement/myProposal/previewProposal.vue'], resolve),
  },
  {
    path: 'proposalApprove',
    name: '评审提案',
    meta: {
      title: '评审提案',
      routerCode:'proposalApprove',
      isKeepalive:true,
      isPage: true,
    },
    component: resolve => require(['@/pages/improveProposalManagement/proposalApprove/index.vue'], resolve),
  },
  {
    path: 'approveScoring',
    name: '评审',
    meta: {
      title: '评审',
      routerCode:'proposalApprove',
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/improveProposalManagement/proposalApprove/approveScoring.vue'], resolve),
  },
  {
    path: 'proposalDatabase',
    name: '提案数据库',
    meta: {
      title: '提案数据库',
      routerCode:'proposalDatabase',
      isKeepalive:true,
      isPage: true,
    },
    component: resolve => require(['@/pages/improveProposalManagement/proposalDatabase/index.vue'], resolve),
  },
  {
    path: 'previewProposalDatabase',
    name: '查看数据库',
    meta: {
      title: '查看数据库',
      routerCode:'proposalDatabase',
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/improveProposalManagement/proposalDatabase/previewProposalDatabase.vue'], resolve),
  },
  {
    path: 'proposalAnalysis',
    name: '提案数据分析',
    meta: {
      title: '提案数据分析',
      isPage: true,
    },
    component: resolve => require(['@/pages/improveProposalManagement/proposalAnalysis/index.vue'], resolve),
  },

]
export const improveProposalMap = improveProposal.reduce((prev, item) => {
  const { name, meta, component } = item
  prev[item.path] = {
    name,
    meta,
    component
  }
  return prev
}, {})