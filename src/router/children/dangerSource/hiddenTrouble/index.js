export const hiddenTrouble = [
    {
        path: 'hiddenTrouble',
        name: '隐患排查任务管理',
        meta: {
          title: '隐患排查任务管理',
          routerCode:'hiddenTrouble',
          isKeepalive:true,
          isPage: true,
        },
        component: resolve => require(['@/pages/dangerSource/hiddenTrouble/index.vue'], resolve),
    },
    {
        path: 'historyTask',
        name: '隐患排查历史任务单',
        meta: {
            title: '隐患排查历史任务单',
            routerCode:'hiddenTrouble',
            isKeepalive:true,
            isPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/dangerSource/hiddenTrouble/childPage/historyTask.vue'], resolve),
   },
   {
        path: 'progressTask',
        name: '进度异常任务单',
        meta: {
            title: '进度异常任务单',
            routerCode:'hiddenTrouble',
            isKeepalive:true,
            isPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/dangerSource/hiddenTrouble/childPage/progressTask.vue'], resolve),
    },
    {
        path: 'statisticsTask',
        name: '任务统计',
        meta: {
            title: '任务统计',
            routerCode:'hiddenTrouble',
            isPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/dangerSource/hiddenTrouble/childPage/statisticsTask.vue'], resolve),
    },
    {
        path: 'taskListCheck',
        name: '隐患排查任务单查看',
        meta: {
            title: '隐患排查任务单查看',
            routerCode:'hiddenTrouble',
            isPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/dangerSource/hiddenTrouble/childPage/taskList.vue'], resolve),
    },
    {
        path: 'taskListEdit',
        name: '隐患排查任务单编辑',
        meta: {
            title: '隐患排查任务单编辑',
            routerCode:'hiddenTrouble',
            isPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/dangerSource/hiddenTrouble/childPage/taskList.vue'], resolve),
    },
]