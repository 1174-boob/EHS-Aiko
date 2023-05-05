// 安全月报总公司
export const mainCorp = [
  {
      path: 'safeBranchMain',
      name: '安全月报管理汇总',
      meta: {
          title: '安全月报管理汇总',
          isPage: true,
      },
      component: resolve => require(['@/pages/safeMonthReport/safeMain/index.vue'], resolve),
  },
]