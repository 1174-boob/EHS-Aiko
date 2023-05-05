export const hiddenPerils = [
    {
      path: 'hiddenPerilsList',
      name: '隐患排查台账',
      meta: {
        title: '隐患排查台账',
        routerCode:'hiddenPerilsList',
        isKeepalive:true,
        isPage: true,
      },
      component: resolve => require(['@/pages/hiddenPerils/hiddenPerilsList/index.vue'], resolve),
    },
    {
        path: 'draftBoxList',
        name: '隐患排查草稿箱',
        meta: {
          title: '隐患排查草稿箱',
          routerCode:'hiddenPerilsList',
          isKeepalive:true,
          isPage: true,
          invisible: true,
        },
        component: resolve => require(['@/pages/hiddenPerils/draftBoxList/index.vue'], resolve),
    },
    {
      path: 'addHiddenPerils',
      name: '隐患排查新增编辑',
      meta: {
        title: '隐患排查新增编辑',
        routerCode:'hiddenPerilsList',
        isPage: true,
        invisible: true,
      },
      component: resolve => require(['@/pages/hiddenPerils/addHiddenPerils/index.vue'], resolve),
    },
    {
      path: 'dealHiddenPage',
      name: '隐患排查处理查看',
      meta: {
        title: '隐患排查处理查看',
        routerCode:'hiddenPerilsList',
        isPage: true,
        invisible: true,
      },
      component: resolve => require(['@/pages/hiddenPerils/dealHiddenPage/index.vue'], resolve),
    },
    {
      path: 'dealNoFour',
      name: '非四不放过处理查看',
      meta: {
        title: '非四不放过处理查看',
        routerCode:'hiddenPerilsList',
        isPage: true,
        invisible: true,
      },
      component: resolve => require(['@/pages/hiddenPerils/dealNoFour/index.vue'], resolve),
    },
    {
      path: 'dealIsFour',
      name: '四不放过处理查看',
      meta: {
        title: '四不放过处理查看',
        routerCode:'hiddenPerilsList',
        isPage: true,
        invisible: true,
      },
      component: resolve => require(['@/pages/hiddenPerils/dealIsFour/index.vue'], resolve),
    },
  ]
  
  export const hiddenPerilsMap = hiddenPerils.reduce((prev, item) => {
    const { name, meta, component } = item
    prev[item.path] = {
      name,
      meta,
      component
    }
    return prev
  }, {})
  