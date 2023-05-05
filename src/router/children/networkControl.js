export const networkControl = [
    {
        path: 'dutyManagement',
        name: '值班管理',
        meta: {
            title: '值班管理',
            routerCode:'dutyManagement',
            isKeepalive:true,
            isPage: true,
        },
        component: resolve => require(['@/pages/networkControl/dutyManagement/index.vue'], resolve),
    },
    {
        path: 'infoMaintenance',
        name: '设备信息维护',
        meta: {
            title: '设备信息维护',
            isPage: true,
        },
        component: resolve => require(['@/pages/networkControl/infoMaintenance/index.vue'], resolve),
    },
    {
        path: 'alarmInfo',
        name: '报警信息处理',
        meta: {
            title: '报警信息处理',
            routerCode:'alarmInfo',
            isKeepalive:true,
            isPage: true,
        },
        component: resolve => require(['@/pages/networkControl/alarmInfo/index.vue'], resolve),
    },
    {
        path: 'lookOrdealFire',
        name: '火灾处理查看',
        meta: {
            title: '火灾处理查看',
            routerCode:'alarmInfo',
            isPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/networkControl/alarmInfo/tpl/lookOrdealFire.vue'], resolve),
    },
    {
        path: 'lookOrdealSpec',
        name: '特气处理查看',
        meta: {
            title: '特气处理查看',
            routerCode:'alarmInfo',
            isPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/networkControl/alarmInfo/tpl/lookOrdealSpec.vue'], resolve),
    },
    {
        path: 'alarmTest',
        name: '预警测试记录',
        meta: {
            title: '预警测试记录',
            routerCode:'alarmTest',
            isKeepalive:true,
            isPage: true,
        },
        component: resolve => require(['@/pages/networkControl/alarmTest/index.vue'], resolve),
    },
    {
        path: 'errorRecording',
        name: '故障记录',
        meta: {
            title: '故障记录',
            isPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/networkControl/errorRecording/index.vue'], resolve),
    },
    {
        path: 'ondutyConfigure',
        name: '配置值班表',
        meta: {
            title: '配置值班表',
            isPage: true,
            isAddPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/networkControl/onduty/configure/index.vue'], resolve),
    },
    {
        path: 'ondutyEdit',
        name: '修改值班表',
        meta: {
            title: '修改值班表',
            isPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/networkControl/onduty/configure/index.vue'], resolve),
    },
    {
        path: 'ondutyShow',
        name: '查看值班表',
        meta: {
            title: '查看值班表',
            isPage: true,
            isShowPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/networkControl/onduty/configure/index.vue'], resolve),
    },
    {
        path: 'ondutyRecordChangeShifts',
        name: '交接班',
        meta: {
            title: '交接班',
            isPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/networkControl/onduty/recordChangeShifts/index.vue'], resolve),
    },
    {
        path: 'ondutyRecordEdit',
        name: '值班记录编辑',
        meta: {
            title: '值班记录编辑',
            isPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/networkControl/onduty/ondutyRecord/index.vue'], resolve),
    },
    {
        path: 'ondutyRecordShow',
        name: '值班记录查看',
        meta: {
            title: '值班记录查看',
            isPage: true,
            isShowPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/networkControl/onduty/ondutyRecord/index.vue'], resolve),
    },
]


export const networkControlMap = networkControl.reduce((prev, item) => {
    const {
        name,
        meta,
        component
    } = item
    prev[item.path] = {
        name,
        meta,
        component
    }
    return prev
}, {})