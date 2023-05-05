/**风险频次 */
export const riskFreqency = [
    {
        path: 'riskScreening',
        name: '风险排查频次库',
        meta: {
            title: '风险排查频次库',
            isPage: true,
            invisible: true,
        },
        component: resolve => require(['@/pages/dangerSource/hiddenTrouble/riskScreening/index.vue'], resolve),
    }
]