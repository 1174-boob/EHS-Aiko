export const dangerWork = [
  {
    path: 'dangerWorkStaticAccount',
    name: '危险作业台账',
    meta: {
      title: '危险作业台账',
      routerCode:'dangerWorkStaticAccount',
      isKeepalive:true,
      isPage: true,
    },
    component: resolve => require(['@/pages/dangerWorkStatic/index.vue'], resolve),
  },
  {
    path: 'dangerWorkStaticDraft',
    name: '危险作业草稿箱',
    meta: {
      title: '危险作业草稿箱',
      routerCode:'dangerWorkStaticDraft',
      isKeepalive:true,
      isPage: true,
    },
    component: resolve => require(['@/pages/dangerWorkStatic/draft/index.vue'], resolve),
  },
  {
    path: 'dangerWorkStaticAddAndChange',
    name: '危险作业新增编辑',
    meta: {
      title: '危险作业新增编辑',
      routerCode:'dangerWorkStaticAccount',
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/dangerWorkStatic/addAndChange/addAndChange.vue'], resolve),
  },
  {
    path: 'dangerWorkStaticShow',
    name: '危险作业查看',
    meta: {
      title: '危险作业查看',
      isShowPage: true,
      routerCode:'dangerWorkStaticAccount',
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/dangerWorkStatic/shouAndHandle/shouAndHandle.vue'], resolve),
  },
  {
    path: 'dangerWorkStaticHandle',
    name: '危险作业处理',
    meta: {
      title: '危险作业处理',
      routerCode:'dangerWorkStaticAccount',
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/dangerWorkStatic/shouAndHandle/shouAndHandle.vue'], resolve),
  },
]

export const dangerWorkMap = dangerWork.reduce((prev, item) => {
  const { name, meta, component } = item
  prev[item.path] = {
    name,
    meta,
    component
  }
  return prev
}, {})
