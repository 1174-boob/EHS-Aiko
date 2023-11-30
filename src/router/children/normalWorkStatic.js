export const normalWork = [
  {
    path: 'normalWorkStaticAccount',
    name: '一般作业台账',
    meta: {
      title: '一般作业台账',
      routerCode:'normalWorkStaticAccount',
      isKeepalive:true,
      isPage: true,
    },
    component: resolve => require(['@/pages/normalWorkStatic/index.vue'], resolve),
  },
  {
    path: 'normalWorkStaticDraft',
    name: '一般作业草稿箱',
    meta: {
      title: '一般作业草稿箱',
      routerCode:'normalWorkStaticDraft',
      isKeepalive:true,
      isPage: true,
    },
    component: resolve => require(['@/pages/normalWorkStatic/draft/index.vue'], resolve),
  },
  {
    path: 'normalWorkStaticAddAndChange',
    name: '一般作业新增编辑',
    meta: {
      title: '一般作业新增编辑',
      routerCode:'normalWorkStaticAccount',
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/normalWorkStatic/addAndChange/addAndChange.vue'], resolve),
  },
  {
    path: 'normalWorkStaticShow',
    name: '一般作业查看',
    meta: {
      title: '一般作业查看',
      isShowPage: true,
      routerCode:'normalWorkStaticAccount',
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/normalWorkStatic/shouAndHandle/shouAndHandle.vue'], resolve),
  },
  {
    path: 'normalWorkStaticHandle',
    name: '一般作业处理',
    meta: {
      title: '一般作业处理',
      routerCode:'normalWorkStaticAccount',
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/normalWorkStatic/shouAndHandle/shouAndHandle.vue'], resolve),
  },
]

export const normalWorkMap = normalWork.reduce((prev, item) => {
  const { name, meta, component } = item
  prev[item.path] = {
    name,
    meta,
    component
  }
  return prev
}, {})
