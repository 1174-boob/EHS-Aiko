// 安全月报子公司
export const deviceSafety = [
    {
        path: 'deviceInfo',
        name: '设备信息台账',
        meta: {
            title: '设备信息台账',
            routerCode: 'deviceInfo',
            isKeepalive:true,
            isPage: true,
        },
        component: resolve => require(['@/pages/deviceSafety/deviceInfo/index.vue'], resolve),
    },
    {
        path: 'deviceAuth',
        name: '设备认证审批',
        meta: {
            title: '设备认证审批',
            routerCode: 'deviceAuth',
            isKeepalive:true,
            isPage: true,
        },
        component: resolve => require(['@/pages/deviceSafety/deviceAuth/index.vue'], resolve),
    },
    {
        path: 'deviceStatistics',
        name: '数据统计分析',
        meta: {
            title: '数据统计分析',
            isPage: true,
            // invisible: true,
        },
        component: resolve => require(['@/pages/deviceSafety/deviceStatistics/index.vue'], resolve),
    },
    {
        path: 'authRecord',
        name: '设备安全认证履历',
        meta: {
            title: '设备安全认证履历',
            routerCode: 'deviceInfo',
            isPage: true,
            isView: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/deviceSafety/deviceInfo/childPage/authRecord.vue'], resolve),
    },
    {
        path: 'recordDteails',
        name: '设备安全认证履历详情',
        meta: {
            title: '设备安全认证履历详情',
            isPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/deviceSafety/deviceInfo/childPage/recordDteails.vue'], resolve),
    },
    {
        path: 'changeRecord',
        name: '设备变更记录',
        meta: {
            title: '设备变更记录',
            routerCode: 'deviceInfo',
            isPage: true,
            invisible: true,
            isResolve: true,
        },
        component: resolve => require(['@/pages/deviceSafety/deviceInfo/childPage/changeRecord.vue'], resolve),
    },
    {
        path: 'deviceAuthDrafts',
        name: '草稿箱',
        meta: {
            title: '草稿箱',
            routerCode: 'deviceAuth',
            isKeepalive:true,
            isPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/deviceSafety/deviceAuth/childPage/deviceAuthDrafts.vue'], resolve),
    },
    {
        path: 'deviceAuthDetails',
        name: '设备信息认证信息',
        meta: {
            title: '设备信息认证信息',
            routerCode: 'deviceAuth',
            isPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/deviceSafety/deviceAuth/childPage/deviceAuthDetails.vue'], resolve),
    }
]

export const deviceSafetyMap = deviceSafety.reduce((prev, item) => {
    const { name, meta, component } = item
    prev[item.path] = {
        name,
        meta,
        component
    }
    return prev
}, {})