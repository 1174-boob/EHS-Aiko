/** 危险源台账 */ 
export const dangerBook = [
  {
    path: 'dangerBook',
    name: '危险源台账',
    meta: {
      title: '危险源台账',
      routerCode:'dangerBook',
      isKeepalive:true,
      isPage: true,
    },
    component: resolve => require(['@/pages/dangerSource/dangerBook/index.vue'], resolve),
  },
  {
    path: 'addEditDangerBook',
    name: '新增编辑危险源台账',
    meta: {
      title: '新增编辑危险源台账',
      routerCode:'dangerBook',
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/dangerSource/dangerBook/addEditDangerBook.vue'], resolve),
  },
  {
    path: 'previewDangerBook',
    name: '查看危险源台账',
    meta: {
      title: '查看危险源台账',
      routerCode:'dangerBook',
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/dangerSource/dangerBook/previewDangerBook.vue'], resolve),
  },
]