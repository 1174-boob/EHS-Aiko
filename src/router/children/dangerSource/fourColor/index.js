export const fourColor = [
  {
    path: 'fourColorList',
    name: '风险分级四色图',
    meta: {
      title: '风险分级四色图',
      routerCode:'fourColorList',
      isKeepalive:true,
      isPage: true,
    },
    component: resolve => require(['@/pages/dangerSource/fourColorPic/index.vue'], resolve),
  },{
    path: 'addMark',
    name: '标记风险点',
    meta: {
      title: '标记风险点',
      routerCode:'fourColorList',
      isPage: true,
      invisible: true
    },
    component: resolve => require(['@/pages/dangerSource/fourColorPic/addMark.vue'], resolve),
  },{
    path: 'viewMark',
    name: '查看风险点标注',
    meta: {
      title: '查看风险点标注',
      routerCode:'fourColorList',
      isPage: true,
      isView: true,
      invisible: true
    },
    component: resolve => require(['@/pages/dangerSource/fourColorPic/addMark.vue'], resolve),
  },{
    path: 'buildingData',
    name: '建筑结构数据',
    meta: {
      title: '建筑结构数据',
      isPage: true,
      invisible: true
    },
    component: resolve => require(['@/pages/dangerSource/fourColorPic/buildingData.vue'], resolve),
  },
]