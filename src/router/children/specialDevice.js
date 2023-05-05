export const specialDevice = [
  {
    path: 'specalDeviceAccount',
    name: '特种设备台帐',
    meta: {
      title: '特种设备台帐',
      routerCode: 'specalDeviceAccount',
      isKeepalive:true,
      isPage: true,
    },
    component: resolve => require(['@/pages/specialDevice/specialDevice/index.vue'], resolve),
  },
  {
    path: 'forkliftCreate',
    name: '特种设备台帐叉车新建',
    meta: {
      title: '特种设备台帐叉车新建',
      routerCode: 'specalDeviceAccount',
      isPage: true,
      isCreate: true,
      invisible: true
    },
    component: resolve => require(['@/pages/specialDevice/specialDevice/forkliftCreate.vue'], resolve),
  },
  {
    path: 'forkliftView',
    name: '特种设备台帐叉车查看',
    meta: {
      title: '特种设备台帐叉车查看',
      routerCode: 'specalDeviceAccount',
      isPage: true,
      isView: true,
      invisible: true
    },
    component: resolve => require(['@/pages/specialDevice/specialDevice/forkliftCreate.vue'], resolve),
  },
  {
    path: 'forkliftEdit',
    name: '特种设备台帐叉车编辑',
    meta: {
      title: '特种设备台帐叉车编辑',
      routerCode: 'specalDeviceAccount',
      isPage: true,
      isEdit: true,
      invisible: true
    },
    component: resolve => require(['@/pages/specialDevice/specialDevice/forkliftCreate.vue'], resolve),
  },
  {
    path: 'skyCarCreate',
    name: '特种设备台帐天车新建',
    meta: {
      title: '特种设备台帐天车新建',
      routerCode: 'specalDeviceAccount',
      isPage: true,
      isCreate: true,
      invisible: true
    },
    component: resolve => require(['@/pages/specialDevice/specialDevice/skyCarCreate.vue'], resolve),
  },
  {
    path: 'skyCarEdit',
    name: '特种设备台帐天车编辑',
    meta: {
      title: '特种设备台帐天车编辑',
      routerCode: 'specalDeviceAccount',
      isPage: true,
      isEdit: true,
      invisible: true
    },
    component: resolve => require(['@/pages/specialDevice/specialDevice/skyCarCreate.vue'], resolve),
  },
  {
    path: 'skyCarView',
    name: '特种设备台帐天车查看',
    meta: {
      title: '特种设备台帐天车查看',
      routerCode: 'specalDeviceAccount',
      isPage: true,
      isView: true,
      invisible: true
    },
    component: resolve => require(['@/pages/specialDevice/specialDevice/skyCarCreate.vue'], resolve),
  },
  {
    path: 'liftCreate',
    name: '特种设备台帐电梯新建',
    meta: {
      title: '特种设备台帐电梯新建',
      routerCode: 'specalDeviceAccount',
      isPage: true,
      isCreate: true,
      invisible: true
    },
    component: resolve => require(['@/pages/specialDevice/specialDevice/liftCreate.vue'], resolve),
  },
  {
    path: 'liftEdit',
    name: '特种设备台帐电梯编辑',
    meta: {
      title: '特种设备台帐电梯编辑',
      routerCode: 'specalDeviceAccount',
      isPage: true,
      isEdit: true,
      invisible: true
    },
    component: resolve => require(['@/pages/specialDevice/specialDevice/liftCreate.vue'], resolve),
  },
  {
    path: 'liftView',
    name: '特种设备台帐电梯查看',
    meta: {
      title: '特种设备台帐电梯查看',
      routerCode: 'specalDeviceAccount',
      isPage: true,
      isView: true,
      invisible: true
    },
    component: resolve => require(['@/pages/specialDevice/specialDevice/liftCreate.vue'], resolve),
  },
  {
    path: 'pipeCreate',
    name: '特种设备台帐压力管道新建',
    meta: {
      title: '特种设备台帐压力管道新建',
      routerCode: 'specalDeviceAccount',
      isPage: true,
      isCreate: true,
      invisible: true
    },
    component: resolve => require(['@/pages/specialDevice/specialDevice/pipeCreate.vue'], resolve),
  },
  {
    path: 'pipeEdit',
    name: '特种设备台帐压力管道编辑',
    meta: {
      title: '特种设备台帐压力管道编辑',
      routerCode: 'specalDeviceAccount',
      isPage: true,
      isEdit: true,
      invisible: true
    },
    component: resolve => require(['@/pages/specialDevice/specialDevice/pipeCreate.vue'], resolve),
  },
  {
    path: 'pipeView',
    name: '特种设备台帐压力管道查看',
    meta: {
      title: '特种设备台帐压力管道查看',
      routerCode: 'specalDeviceAccount',
      isPage: true,
      isView: true,
      invisible: true
    },
    component: resolve => require(['@/pages/specialDevice/specialDevice/pipeCreate.vue'], resolve),
  },
  {
    path: 'vesselCreate',
    name: '特种设备台帐压力容器新建',
    meta: {
      title: '特种设备台帐压力容器新建',
      routerCode: 'specalDeviceAccount',
      isPage: true,
      isCreate: true,
      invisible: true
    },
    component: resolve => require(['@/pages/specialDevice/specialDevice/vesselCreate.vue'], resolve),
  },
  {
    path: 'vesselEdit',
    name: '特种设备台帐压力容器编辑',
    meta: {
      title: '特种设备台帐压力容器编辑',
      routerCode: 'specalDeviceAccount',
      isPage: true,
      isEdit: true,
      invisible: true
    },
    component: resolve => require(['@/pages/specialDevice/specialDevice/vesselCreate.vue'], resolve),
  },
  {
    path: 'vesselView',
    name: '特种设备台帐压力容器查看',
    meta: {
      title: '特种设备台帐压力容器查看',
      routerCode: 'specalDeviceAccount',
      isPage: true,
      isView: true,
      invisible: true
    },
    component: resolve => require(['@/pages/specialDevice/specialDevice/vesselCreate.vue'], resolve),
  },
  {
    path: 'safeAttachAccount',
    name: '安全附件台帐',
    meta: {
      title: '安全附件台帐',
      routerCode: 'safeAttachAccount',
      isKeepalive:true,
      isPage: true,
    },
    component: resolve => require(['@/pages/specialDevice/safeAttach/index.vue'], resolve),
  },
  {
    path: 'safeAttachCreate',
    name: '安全附件新建',
    meta: {
      title: '安全附件新建',
      routerCode: 'safeAttachAccount',
      isPage: true,
      isCreate: true,
      invisible: true
    },
    component: resolve => require(['@/pages/specialDevice/safeAttach/create.vue'], resolve),
  },
  {
    path: 'safeAttachEdit',
    name: '安全附件编辑',
    meta: {
      title: '安全附件编辑',
      routerCode: 'safeAttachAccount',
      isPage: true,
      isEdit: true,
      invisible: true
    },
    component: resolve => require(['@/pages/specialDevice/safeAttach/create.vue'], resolve),
  },
  {
    path: 'safeAttachView',
    name: '安全附件查看',
    meta: {
      title: '安全附件查看',
      routerCode: 'safeAttachAccount',
      isPage: true,
      isView: true,
      invisible: true
    },
    component: resolve => require(['@/pages/specialDevice/safeAttach/create.vue'], resolve),
  },
]

export const specialDeviceMap = specialDevice.reduce((prev, item) => {
  const { name, meta, component } = item
  prev[item.path] = {
    name,
    meta,
    component
  }
  return prev
}, {})
