/** 危险源清单 */ 
export const dangerList = [
    {
        path: 'dangerList',
        name: '危险源清单',
        meta: {
          title: '危险源清单',
          routerCode:'dangerList',
          isKeepalive:true,
          isPage: true,
        },
        component: resolve => require(['@/pages/dangerSource/dangerList/index.vue'], resolve),
    },
    {
      path: 'editDangerList',
      name: '编辑危险源清单',
      meta: {
        title: '编辑危险源清单',
        routerCode:'dangerList',
        isPage: true,
        invisible: true,
      },
      component: resolve => require(['@/pages/dangerSource/dangerList/editDangerList/index.vue'], resolve),
    },
    {
      path: 'detailDanger',
      name: '危险源清单详情',
      meta: {
        title: '危险源清单详情',
        routerCode:'dangerList',
        isPage: true,
        invisible: true,
      },
      component: resolve => require(['@/pages/dangerSource/dangerList/detailDanger/index.vue'], resolve),
    },
    {
      path: 'classification',
      name: '分类配置',
      meta: {
        title: '分类配置',
        routerCode:'dangerList',
        isPage: true,
        invisible: true,
      },
      component: resolve => require(['@/pages/dangerSource/dangerList/classification/index.vue'], resolve),
      // riskScreening
    },
  
]