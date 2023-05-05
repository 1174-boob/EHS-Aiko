//风险点台账
export const risk = [
    {
        path: 'riskBook',
        name: '风险点台账',
        meta: {
            title: '风险点台账',
            routerCode:'riskBook',
            isKeepalive:true,
            isPage: true,
        },
        component: resolve => require(['@/pages/dangerSource/riskBook/index.vue'], resolve),
    },
    {
        path: 'riskBookAdd',
        name: '风险点台账新增',
        meta: {
            title: '风险点台账新增',
            routerCode:'riskBook',
            pageType: 'add',
            isPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/dangerSource/riskBook/riskHandle/riskBookAddOrChange/riskBookAddOrChange.vue'], resolve),
    },
    {
        path: 'riskBookEdit',
        name: '风险点台账编辑',
        meta: {
            title: '风险点台账编辑',
            routerCode:'riskBook',
            pageType: 'edit',
            isPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/dangerSource/riskBook/riskHandle/riskBookAddOrChange/riskBookAddOrChange.vue'], resolve),
    },
    {
        path: 'riskBookChange',
        name: '风险点台账变更',
        meta: {
            title: '风险点台账变更',
            pageType: 'change',
            routerCode:'riskBook',
            isPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/dangerSource/riskBook/riskHandle/riskBookAddOrChange/riskBookAddOrChange.vue'], resolve),
    },
    {
        path: 'riskBookShow',
        name: '风险点台账查看',
        meta: {
            title: '风险点台账查看',
            routerCode:'riskBook',
            isPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/dangerSource/riskBook/riskHandle/riskBookShow/riskBookShow.vue'], resolve),
    },
    {
        path: 'riskApproval',
        name: '风险点审批台账',
        meta: {
            title: '风险点审批台账',
            routerCode:'riskBook',
            isKeepalive:true,
            isPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/dangerSource/riskBook/riskApproval/index.vue'], resolve),
    },
    {
        path: 'riskApprovalAdd',
        name: '风险点审批台账新增',
        meta: {
            title: '风险点审批台账新增',
            routerCode:'riskBook',
            isPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/dangerSource/riskBook/riskApproval/riskApprovalAddOrChange/riskApprovalAddOrChange.vue'], resolve),
    },
    {
        path: 'riskApprovalEdit',
        name: '风险点审批台账编辑',
        meta: {
            title: '风险点审批台账编辑',
            routerCode:'riskBook',
            isPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/dangerSource/riskBook/riskApproval/riskApprovalAddOrChange/riskApprovalAddOrChange.vue'], resolve),
    },
    {
        path: 'riskApprovalHandle',
        name: '风险点审批台账处理',
        meta: {
            title: '风险点审批台账处理',
            routerCode:'riskBook',
            isPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/dangerSource/riskBook/riskApproval/riskApprovalHandleOrShow/riskApprovalHandleOrShow.vue'], resolve),
    },
    {
        path: 'riskApprovalShow',
        name: '风险点审批台账查看',
        meta: {
            title: '风险点审批台账查看',
            routerCode:'riskBook',
            isShowPage: true,
            isPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/dangerSource/riskBook/riskApproval/riskApprovalHandleOrShow/riskApprovalHandleOrShow.vue'], resolve),
    },
]