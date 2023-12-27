export const hiddenPerilsAssociation = [
    {
        path: 'hiddenPerilsListAssociation',
        name: '关联隐患排查台账',
        meta: {
            title: '隐患排查台账',
            routerCode:'hiddenPerilsListAssociation',
            isKeepalive:true,
            isPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/hiddenPerilsAssociation/hiddenPerilsList/index.vue'], resolve),
    },
    {
        path: 'draftBoxListAssociation',
        name: '关联隐患排查草稿箱',
        meta: {
            title: '隐患排查草稿箱',
            routerCode:'hiddenPerilsListAssociation',
            isKeepalive:true,
            isPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/hiddenPerilsAssociation/draftBoxList/index.vue'], resolve),
    },
    {
        path: 'addHiddenPerilsAssociation',
        name: '关联隐患排查新增编辑',
        meta: {
            title: '隐患排查新增编辑',
            routerCode:'hiddenPerilsListAssociation',
            isPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/hiddenPerilsAssociation/addHiddenPerils/index.vue'], resolve),
    },
    {
        path: 'dealHiddenPageAssociation',
        name: '关联隐患排查处理查看',
        meta: {
            title: '隐患排查处理查看',
            routerCode:'hiddenPerilsListAssociation',
            isPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/hiddenPerilsAssociation/dealHiddenPage/index.vue'], resolve),
    },
    {
        path: 'dealNoFourAssociation',
        name: '关联非四不放过处理查看',
        meta: {
            title: '非四不放过处理查看',
            routerCode:'hiddenPerilsListAssociation',
            isPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/hiddenPerilsAssociation/dealNoFour/index.vue'], resolve),
    },
    {
        path: 'dealIsFourAssociation',
        name: '关联四不放过处理查看',
        meta: {
            title: '四不放过处理查看',
            routerCode:'hiddenPerilsListAssociation',
            isPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/hiddenPerilsAssociation/dealIsFour/index.vue'], resolve),
    },
  ]
  
  export const hiddenPerilsMap = hiddenPerilsAssociation.reduce((prev, item) => {
    const { name, meta, component } = item
    prev[item.path] = {
        name,
        meta,
        component
    }
    return prev
  }, {})
  