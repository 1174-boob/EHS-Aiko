// 默认菜单路由配置
// 无面包屑、无padding、无背景 的父级盒子 
import NoBreadcrumbNoBg from '@/layouts/NoBreadcrumbNoBg'
const defaultRoutes = [
  {
    path: 'overview',
    name: '总览',
    meta: {
      title: '总览',
      isPage: false,
      icon: 'icon-zonglanhuise',
    },
    component: NoBreadcrumbNoBg,
    children: [
      {
        path: 'preview',
        name: '首页',
        meta: {
          title: '首页',
          isPage: true,
        },
        component: resolve => require(['@/pages/preview'], resolve),
      },
    ]
  },
  // {
  //   router: "orderPay",
  //   parentId: 'root',
  //   name: '订单',
  //   children: [
  //     {
  //       router: 'pay',
  //       name: '确认订单',
  //     },
  //   ]
  // },
];

// 默认子菜单路由配置
const defaultSeedMenuRoutes = [
  {
    router: 'workOrderSuccess',
    parentUrl: 'work',
    name: '提交工单成功',
  },
];
export { defaultRoutes, defaultSeedMenuRoutes }
