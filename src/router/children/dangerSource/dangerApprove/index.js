/** 危险源审批 */ 
export const dangerApprove = [
  {
    path: 'dangerApprove',
    name: '危险源评审',
    meta: {
      title: '危险源评审',
      routerCode:'dangerApprove',
      isKeepalive:true,
      isPage: true,
    },
    component: resolve => require(['@/pages/dangerSource/dangerApprove/index.vue'], resolve),
  },
  {
    path: 'processReview',
    name: '处理危险源评审',
    meta: {
      title: '处理危险源评审',
      routerCode:'dangerApprove',
      isPage: true,
      invisible: true,
    },
    component: resolve => require(['@/pages/dangerSource/dangerApprove/processReview.vue'], resolve),
  },
]