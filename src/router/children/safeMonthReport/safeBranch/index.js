// 安全月报子公司
export const branchCorp = [
    {
        path: 'safeBranchCorp',
        name: ' 安全月报管理',
        meta: {
            title: '安全月报（子公司）',
            routerCode:'dangerWorkStaticAccount',
            isKeepalive:true,
            isPage: true,
        },
        component: resolve => require(['@/pages/safeMonthReport/safeBranch/index.vue'], resolve),
    },
    {
        path: 'safeBranchCorpCreate',
        name: ' 数据填报',
        meta: {
            title: ' 数据填报',
            routerCode:'dangerWorkStaticAccount',
            isPage: true,
            invisible: true,
            isCreate: true,
        },
        component: resolve => require(['@/pages/safeMonthReport/safeBranch/create.vue'], resolve),
    },
    {
        path: 'safeBranchCorpEdit',
        name: ' 数据填报编辑',
        meta: {
            title: ' 数据填报编辑',
            routerCode:'dangerWorkStaticAccount',
            isPage: true,
            invisible: true,
            isEdit: true
        },
        component: resolve => require(['@/pages/safeMonthReport/safeBranch/create.vue'], resolve),
    },
    {
        path: 'safeBranchCorpResolve',
        name: ' 数据填报审批',
        meta: {
            title: ' 数据填报审批',
            routerCode:'dangerWorkStaticAccount',
            isPage: true,
            invisible: true,
            isResolve: true
        },
        component: resolve => require(['@/pages/safeMonthReport/safeBranch/create.vue'], resolve),
    },
    {
        path: 'safeBranchCorpView',
        name: ' 数据填报查看',
        meta: {
            title: ' 数据填报',
            routerCode:'dangerWorkStaticAccount',
            isPage: true,
            invisible: true,
            isView: true
        },
        component: resolve => require(['@/pages/safeMonthReport/safeBranch/create.vue'], resolve),
    },
]