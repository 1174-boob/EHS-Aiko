// 视图组件
// import { chemicalsMsdsMap } from '../children/chemicalsMsds'
// import { occupationHealthMap } from '../children/occupationHealth'
// import { dangerSourceMap } from '../children/dangerSource'
// import { dangerWorkMap } from '../children/dangerWorkStatic'
// import { hiddenPerilsMap } from '../children/hiddenPerils'
// import { dataAnalysisMap } from '../children/dataAnalysis/dataAnalysis.js'
// import { safeCorpMap } from '../children/safeMonthReport'
// import { emergencyMap } from '../children/emergency'
// import { envMonthReportMap } from '../children/envMonthReport/index.js'
// import { deviceSafetyMap } from '../children/deviceSafety/index.js'
// import { networkControlMap } from '../children/networkControl.js'
// import { improveProposalMap } from '../children/improveProposal.js'

// import { specialDeviceMap } from '../children/specialDevice'
import { localRoutesMap } from '@/router/localRoutes'
const view = {
  tabs: () => import('@/layouts/tabs'),
  blank: () => import('@/layouts/BlankView'),
  page: () => import('@/layouts/PageView')
}
// import NoBreadcrumb from '@/layouts/NoBreadcrumb'
// 路由组件注册
const routerMap = {
  login: {
    authority: '*',
    path: '/login',
    component: resolve => require(['@/pages/login'], resolve),
  },
  root: {
    path: '/',
    name: '登录',
    meta: {
      // title: '总览',
      isPage: true,
    },
    redirect: process.env.NODE_ENV == "development" ? '/login' : '/overview/preview',
    component: view.tabs
  },
  ...localRoutesMap,
  // preview: {
  //   name: '总览',
  //   // icon: 'preview-icon',
  //   meta: {
  //     title: '总览',
  //     isPage: true,
  //     icon: 'icon-zonglanhuise',
  //   },
  //   component: resolve => require(['@/pages/preview'], resolve)
  // },
  // securityThinkTank: {
  //   name: '安全智库',
  //   meta: {
  //     title: '安全智库',
  //     icon: 'svg-icon-secutiry',
  //   },
  //   component: view.page,
  // },
  // notice: {
  //   name: '通知公告',
  //   meta: {
  //     title: '通知公告',
  //     isPage: true,
  //   },
  //   component: resolve => require(['@/pages/notice'], resolve),
  // },
  // noticeAddEdit: {
  //   name: '通知公告新建编辑',
  //   meta: {
  //     title: '新建编辑',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/notice/addEdit.vue'], resolve)
  // },
  // noticePreview: {
  //   name: '预览',
  //   meta: {
  //     title: '预览',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/notice/preview.vue'], resolve)
  // },
  // policy: {
  //   name: '政策法规',
  //   meta: {
  //     title: '政策法规',
  //     isPage: true,
  //   },
  //   component: resolve => require(['@/pages/policy'], resolve),
  // },
  // policyAddEdit: {
  //   name: '政策法规新建编辑',
  //   meta: {
  //     title: '新建编辑',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/policy/addEdit.vue'], resolve)
  // },
  // policyPreview: {
  //   name: '政策法规预览',
  //   meta: {
  //     title: '预览',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/policy/preview.vue'], resolve)
  // },
  // hiddendangermanage: {
  //   name: '隐患排查管理',
  //   meta: {
  //     title: '隐患排查管理',
  //     icon: 'svg-icon-danger-manage',
  //     isPage: false,
  //   },
  //   component: view.page,
  // },
  // standingbook1: {
  //   name: '隐患排查台账',
  //   meta: {
  //     title: '隐患排查台账',
  //     isPage: true,
  //     url: "/hiddendangermanage/standingbook1",
  //     draftUrl: "/hiddendangermanage/draftbox1",
  //     detailUrl: "/hiddendangermanage/standbookdetail1",
  //     detailName: "隐患详情",
  //     addName: "新建隐患"
  //   },
  //   component: resolve => require(['@/pages/sceneManagement/hiddenDanger/standingbook1.vue'], resolve),
  //   children: [
  //   ]
  // },
  // addhiddendanger1: {
  //   name: '新建隐患',
  //   meta: {
  //     title: '新建隐患',
  //     isPage: true,
  //     invisible: true,
  //     url: "/hiddendangermanage/standingbook1",
  //     draftUrl: "/hiddendangermanage/draftbox1",
  //     detailUrl: "/hiddendangermanage/standbookdetail1",
  //     detailName: "隐患详情",
  //     addName: "新建隐患"
  //   },
  //   component: resolve => require(['@/pages/sceneManagement/hiddenDanger/addHiddenDanger1.vue'], resolve),
  // },
  // standbookdetail1: {
  //   name: '隐患详情',
  //   meta: {
  //     title: '隐患详情',
  //     isPage: true,
  //     invisible: true,
  //     url: "/hiddendangermanage/standingbook1",
  //     draftUrl: "/hiddendangermanage/draftbox1",
  //     detailUrl: "/hiddendangermanage/standbookdetail1",
  //     detailName: "隐患详情",
  //     addName: "新建隐患"
  //   },
  //   component: resolve => require(['@/pages/sceneManagement/hiddenDanger/detail.vue'], resolve),
  // },
  // draftbox1: {
  //   name: '隐患草稿箱',
  //   meta: {
  //     title: '隐患草稿箱',
  //     isPage: true,
  //     invisible: true,
  //     url: "/hiddendangermanage/standingbook1",
  //     draftUrl: "/hiddendangermanage/draftbox1",
  //     detailUrl: "/hiddendangermanage/standbookdetail1",
  //     detailName: "隐患详情",
  //     addName: "新建隐患"
  //   },
  //   component: resolve => require(['@/pages/sceneManagement/hiddenDanger/draftBox.vue'], resolve),
  // },
  // emergencyManagement: {
  //   name: '应急演练管理',
  //   meta: {
  //     title: '应急演练管理',
  //     icon: 'emergency-icon',
  //     isPage: false,
  //   },
  //   component: view.page,
  // },
  // ...emergencyMap,
  // dangerWork: {
  //   name: '危险作业管理',
  //   meta: {
  //     title: '危险作业管理',
  //     icon: 'danger-work',
  //     isPage: false,
  //   },
  //   component: view.page,
  // },
  // standingbook2: {
  //   name: '危险作业台账',
  //   meta: {
  //     title: '危险作业台账',
  //     isPage: true,
  //     url: "/dangerWork/standingbook2",
  //     draftUrl: "/dangerWork/draftbox2",
  //     detailUrl: "/dangerWork/standbookdetail2",
  //     detailName: "作业详情",
  //     addName: "新建作业"
  //   },
  //   component: resolve => require(['@/pages/sceneManagement/hiddenDanger/standingbook1.vue'], resolve),
  // },
  // draftbox2: {
  //   name: '作业草稿箱',
  //   meta: {
  //     title: '作业草稿箱',
  //     isPage: true,
  //     invisible: true,
  //     url: "/dangerWork/standingbook2",
  //     draftUrl: "/dangerWork/draftbox2",
  //     detailUrl: "/dangerWork/standbookdetail2",
  //     detailName: "作业详情",
  //     addName: "新建作业"
  //   },
  //   component: resolve => require(['@/pages/sceneManagement/hiddenDanger/draftBox.vue'], resolve),
  // },
  // addhiddendanger2: {
  //   name: '新建作业',
  //   meta: {
  //     title: '新建作业',
  //     isPage: true,
  //     invisible: true,
  //     url: "/dangerWork/standingbook2",
  //     draftUrl: "/dangerWork/draftbox2",
  //     detailUrl: "/dangerWork/standbookdetail2",
  //     detailName: "作业详情",
  //     addName: "新建作业"
  //   },
  //   component: resolve => require(['@/pages/sceneManagement/hiddenDanger/addHiddenDanger1.vue'], resolve),
  // },
  // standbookdetail2: {
  //   name: '作业详情',
  //   meta: {
  //     title: '作业详情',
  //     isPage: true,
  //     invisible: true,
  //     url: "/dangerWork/standingbook2",
  //     draftUrl: "/dangerWork/draftbox2",
  //     detailUrl: "/dangerWork/standbookdetail2",
  //     detailName: "作业详情",
  //     addName: "新建作业"
  //   },
  //   component: resolve => require(['@/pages/sceneManagement/hiddenDanger/detail.vue'], resolve),
  // },
  // accidentManagement: {
  //   name: '事故事件管理',
  //   meta: {
  //     title: '事故事件管理',
  //     icon: 'accident-icon',
  //     isPage: false,
  //   },
  //   component: view.page,
  // },
  // accidentList: {
  //   name: '事故事件台账',
  //   meta: {
  //     title: '事故事件台账',
  //     isPage: true,
  //   },
  //   component: resolve => require(['@/pages/accidentManagement/accident/index.vue'], resolve),
  // },
  // accidentDraft: {
  //   name: '事故事件草稿箱',
  //   meta: {
  //     title: '事故事件草稿箱',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/accidentManagement/accident/draftList.vue'], resolve),
  // },
  // accidentCreate: {
  //   name: '新建事故事件',
  //   meta: {
  //     title: '新建事故事件',
  //     isPage: true,
  //     invisible: true,
  //     isCreate: true, // 新建
  //   },
  //   component: resolve => require(['@/pages/accidentManagement/accident/create.vue'], resolve),
  // },
  // accidentResolve: {
  //   name: '处理事故事件',
  //   meta: {
  //     title: '处理事故事件',
  //     isPage: true,
  //     isResolve: true,
  //     invisible: true, // 处理
  //   },
  //   component: resolve => require(['@/pages/accidentManagement/accident/create.vue'], resolve),
  // },
  // accidentEdit: {
  //   name: '编辑事故事件',
  //   meta: {
  //     title: '编辑事故事件',
  //     isPage: true,
  //     invisible: true,
  //     isEdit: true // 编辑
  //   },
  //   component: resolve => require(['@/pages/accidentManagement/accident/create.vue'], resolve),
  // },
  // accidentDetail: {
  //   name: '事故事件详情',
  //   meta: {
  //     title: '事故事件详情',
  //     isPage: true,
  //     invisible: true,
  //     disabled: true,
  //     isView: true, // 查看
  //   },
  //   component: resolve => require(['@/pages/accidentManagement/accident/create.vue'], resolve),
  // },
  // accidentManagement: {
  //   name: '事故事件管理',
  //   meta: {
  //     title: '事故事件管理',
  //     icon: 'accident-icon',
  //     isPage: false,
  //   },
  //   component: view.page,
  // },
  // falseAlarm: {
  //   name: '虚惊未遂事件',
  //   meta: {
  //     title: '虚惊未遂事件',
  //     isPage: true,
  //   },
  //   component: resolve => require(['@/pages/accidentManagement/falseAlarm/index.vue'], resolve),
  // },
  // falseAlarmDarft: {
  //   name: '虚惊未遂事件草稿箱',
  //   meta: {
  //     title: '虚惊未遂事件草稿箱',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/accidentManagement/falseAlarm/draftList.vue'], resolve),
  // },
  // falseAlarmCreate: {
  //   name: '虚惊未遂事件新建',
  //   meta: {
  //     title: '虚惊未遂事件新建',
  //     isPage: true,
  //     invisible: true,
  //     isCreate: true
  //   },
  //   component: resolve => require(['@/pages/accidentManagement/falseAlarm/create.vue'], resolve),
  // },
  // falseAlarmEdit: {
  //   name: '虚惊未遂事件编辑',
  //   meta: {
  //     title: '虚惊未遂事件编辑',
  //     isPage: true,
  //     invisible: true,
  //     isEdit: true
  //   },
  //   component: resolve => require(['@/pages/accidentManagement/falseAlarm/create.vue'], resolve),
  // },
  // falseAlarmResolve: {
  //   name: '虚惊未遂事件审核',
  //   meta: {
  //     title: '虚惊未遂事件审核',
  //     isPage: true,
  //     invisible: true,
  //     isResolve: true
  //   },
  //   component: resolve => require(['@/pages/accidentManagement/falseAlarm/create.vue'], resolve),
  // },
  // falseAlarmView: {
  //   name: '虚惊未遂事件详情',
  //   meta: {
  //     title: '虚惊未遂事件详情',
  //     isPage: true,
  //     invisible: true,
  //     isView: true
  //   },
  //   component: resolve => require(['@/pages/accidentManagement/falseAlarm/create.vue'], resolve),
  // },

  // emergencydrill: {
  //   name: '应急演练管理',
  //   meta: {
  //     title: '应急演练管理',
  //     icon: 'emergency-icon',
  //     isPage: false,
  //   },
  //   component: view.page,
  // },
  // standingbook5: {
  //   name: '应急演练计划',
  //   meta: {
  //     title: '应急演练计划',
  //     isPage: true,
  //     url: "/emergencydrill/standingbook5",
  //     draftUrl: "/emergencydrill/draftbox5",
  //     detailUrl: "/emergencydrill/standbookdetail5",
  //     detailName: "计划详情",
  //     addName: "新建计划"
  //   },
  //   component: resolve => require(['@/pages/sceneManagement/hiddenDanger/standingbook1.vue'], resolve),
  // },
  // draftbox5: {
  //   name: '计划草稿箱',
  //   meta: {
  //     title: '计划草稿箱',
  //     isPage: true,
  //     invisible: true,
  //     url: "/emergencydrill/standingbook5",
  //     draftUrl: "/emergencydrill/draftbox5",
  //     detailUrl: "/emergencydrill/standbookdetail5",
  //     detailName: "计划详情",
  //     addName: "新建计划"
  //   },
  //   component: resolve => require(['@/pages/sceneManagement/hiddenDanger/draftBox.vue'], resolve),
  // },
  // addhiddendanger5: {
  //   name: '新建计划',
  //   meta: {
  //     title: '新建计划',
  //     isPage: true,
  //     invisible: true,
  //     url: "/emergencydrill/standingbook5",
  //     draftUrl: "/emergencydrill/draftbox5",
  //     detailUrl: "/emergencydrill/standbookdetail5",
  //     detailName: "计划详情",
  //     addName: "新建计划"
  //   },
  //   component: resolve => require(['@/pages/sceneManagement/hiddenDanger/addHiddenDanger1.vue'], resolve),
  // },
  // standbookdetail5: {
  //   name: '计划详情',
  //   meta: {
  //     title: '计划详情',
  //     isPage: true,
  //     invisible: true,
  //     url: "/emergencydrill/standingbook5",
  //     draftUrl: "/emergencydrill/draftbox5",
  //     detailUrl: "/emergencydrill/standbookdetail5",
  //     detailName: "计划详情",
  //     addName: "新建计划"
  //   },
  //   component: resolve => require(['@/pages/sceneManagement/hiddenDanger/detail.vue'], resolve),
  // },
  // standingbook6: {
  //   name: '应急演练报告',
  //   meta: {
  //     title: '应急演练报告',
  //     isPage: true,
  //     url: "/emergencydrill/standingbook6",
  //     draftUrl: "/emergencydrill/draftbox6",
  //     detailUrl: "/emergencydrill/standbookdetail6",
  //     detailName: "报告详情",
  //     addName: "新建报告"
  //   },
  //   component: resolve => require(['@/pages/sceneManagement/hiddenDanger/standingbook1.vue'], resolve),
  // },
  // draftbox6: {
  //   name: '报告草稿箱',
  //   meta: {
  //     title: '报告草稿箱',
  //     isPage: true,
  //     invisible: true,
  //     url: "/emergencydrill/standingbook6",
  //     draftUrl: "/emergencydrill/draftbox6",
  //     detailUrl: "/emergencydrill/standbookdetail6",
  //     detailName: "报告详情",
  //     addName: "新建报告"
  //   },
  //   component: resolve => require(['@/pages/sceneManagement/hiddenDanger/draftBox.vue'], resolve),
  // },
  // addhiddendanger6: {
  //   name: '新建报告',
  //   meta: {
  //     title: '新建报告',
  //     isPage: true,
  //     invisible: true,
  //     url: "/emergencydrill/standingbook6",
  //     draftUrl: "/emergencydrill/draftbox6",
  //     detailUrl: "/emergencydrill/standbookdetail6",
  //     detailName: "报告详情",
  //     addName: "新建报告"
  //   },
  //   component: resolve => require(['@/pages/sceneManagement/hiddenDanger/addHiddenDanger1.vue'], resolve),
  // },
  // standbookdetail6: {
  //   name: '报告详情',
  //   meta: {
  //     title: '报告详情',
  //     isPage: true,
  //     invisible: true,
  //     url: "/emergencydrill/standingbook6",
  //     draftUrl: "/emergencydrill/draftbox6",
  //     detailUrl: "/emergencydrill/standbookdetail6",
  //     detailName: "报告详情",
  //     addName: "新建报告"
  //   },
  //   component: resolve => require(['@/pages/sceneManagement/hiddenDanger/detail.vue'], resolve),
  // },
  // standingbook7: {
  //   name: '应急演练预案',
  //   meta: {
  //     title: '应急演练预案',
  //     isPage: true,
  //     url: "/emergencydrill/standingbook7",
  //     draftUrl: "/emergencydrill/draftbox7",
  //     detailUrl: "/emergencydrill/standbookdetail7",
  //     detailName: "预案详情",
  //     addName: "新建预案"
  //   },
  //   component: resolve => require(['@/pages/sceneManagement/hiddenDanger/standingbook1.vue'], resolve),
  // },
  // draftbox7: {
  //   name: '预案草稿箱',
  //   meta: {
  //     title: '预案草稿箱',
  //     isPage: true,
  //     invisible: true,
  //     url: "/emergencydrill/standingbook7",
  //     draftUrl: "/emergencydrill/draftbox7",
  //     detailUrl: "/emergencydrill/standbookdetail7",
  //     detailName: "预案详情",
  //     addName: "新建预案"
  //   },
  //   component: resolve => require(['@/pages/sceneManagement/hiddenDanger/draftBox.vue'], resolve),
  // },
  // addhiddendanger7: {
  //   name: '新建预案',
  //   meta: {
  //     title: '新建预案',
  //     isPage: true,
  //     invisible: true,
  //     url: "/emergencydrill/standingbook7",
  //     draftUrl: "/emergencydrill/draftbox7",
  //     detailUrl: "/emergencydrill/standbookdetail7",
  //     detailName: "预案详情",
  //     addName: "新建预案"
  //   },
  //   component: resolve => require(['@/pages/sceneManagement/hiddenDanger/addHiddenDanger1.vue'], resolve),
  // },
  // standbookdetail7: {
  //   name: '预案详情',
  //   meta: {
  //     title: '预案详情',
  //     isPage: true,
  //     invisible: true,
  //     url: "/emergencydrill/standingbook7",
  //     draftUrl: "/emergencydrill/draftbox7",
  //     detailUrl: "/emergencydrill/standbookdetail7",
  //     detailName: "预案详情",
  //     addName: "新建预案"
  //   },
  //   component: resolve => require(['@/pages/sceneManagement/hiddenDanger/detail.vue'], resolve),
  // },
  // specialequipment: {
  //   name: '特种设备管理',
  //   meta: {
  //     title: '特种设备管理',
  //     icon: 'speciale-icon',
  //     isPage: false,
  //   },
  //   component: view.page,
  // },
  // standingbook8: {
  //   name: '特种设备台账',
  //   meta: {
  //     title: '特种设备台账',
  //     isPage: true,
  //     url: "/specialequipment/standingbook8",
  //     draftUrl: "/specialequipment/draftbox8",
  //     detailUrl: "/specialequipment/standbookdetail8",
  //     detailName: "设备详情",
  //     addName: "新建设备"
  //   },
  //   component: resolve => require(['@/pages/sceneManagement/hiddenDanger/standingbook1.vue'], resolve),
  // },
  // draftbox8: {
  //   name: '设备草稿箱',
  //   meta: {
  //     title: '设备草稿箱',
  //     isPage: true,
  //     invisible: true,
  //     url: "/specialequipment/standingbook8",
  //     draftUrl: "/specialequipment/draftbox8",
  //     detailUrl: "/specialequipment/standbookdetail8",
  //     detailName: "设备详情",
  //     addName: "新建设备"
  //   },
  //   component: resolve => require(['@/pages/sceneManagement/hiddenDanger/draftBox.vue'], resolve),
  // },
  // addhiddendanger8: {
  //   name: '新建设备',
  //   meta: {
  //     title: '新建设备',
  //     isPage: true,
  //     invisible: true,
  //     url: "/specialequipment/standingbook8",
  //     draftUrl: "/specialequipment/draftbox8",
  //     detailUrl: "/specialequipment/standbookdetail8",
  //     detailName: "设备详情",
  //     addName: "新建设备"
  //   },
  //   component: resolve => require(['@/pages/sceneManagement/hiddenDanger/addHiddenDanger1.vue'], resolve),
  // },
  // standbookdetail8: {
  //   name: '设备详情',
  //   meta: {
  //     title: '设备详情',
  //     isPage: true,
  //     invisible: true,
  //     url: "/specialequipment/standingbook8",
  //     draftUrl: "/specialequipment/draftbox8",
  //     detailUrl: "/specialequipment/standbookdetail8",
  //     detailName: "设备详情",
  //     addName: "新建设备"
  //   },
  //   component: resolve => require(['@/pages/sceneManagement/hiddenDanger/detail.vue'], resolve),
  // },
  // standingbook9: {
  //   name: '安全附件台账',
  //   meta: {
  //     title: '安全附件台账',
  //     isPage: true,
  //     url: "/specialequipment/standingbook9",
  //     draftUrl: "/specialequipment/draftbox9",
  //     detailUrl: "/specialequipment/standbookdetail9",
  //     detailName: "附件详情",
  //     addName: "新建附件"
  //   },
  //   component: resolve => require(['@/pages/sceneManagement/hiddenDanger/standingbook1.vue'], resolve),
  // },
  // draftbox9: {
  //   name: '附件草稿箱',
  //   meta: {
  //     title: '附件草稿箱',
  //     isPage: true,
  //     invisible: true,
  //     url: "/specialequipment/standingbook9",
  //     draftUrl: "/specialequipment/draftbox9",
  //     detailUrl: "/specialequipment/standbookdetail9",
  //     detailName: "附件详情",
  //     addName: "新建附件"
  //   },
  //   component: resolve => require(['@/pages/sceneManagement/hiddenDanger/draftBox.vue'], resolve),
  // },
  // addhiddendanger9: {
  //   name: '新建附件',
  //   meta: {
  //     title: '新建附件',
  //     isPage: true,
  //     invisible: true,
  //     url: "/specialequipment/standingbook9",
  //     draftUrl: "/specialequipment/draftbox9",
  //     detailUrl: "/specialequipment/standbookdetail9",
  //     detailName: "附件详情",
  //     addName: "新建附件"
  //   },
  //   component: resolve => require(['@/pages/sceneManagement/hiddenDanger/addHiddenDanger1.vue'], resolve),
  // },
  // standbookdetail9: {
  //   name: '附件详情',
  //   meta: {
  //     title: '附件详情',
  //     isPage: true,
  //     invisible: true,
  //     url: "/specialequipment/standingbook9",
  //     draftUrl: "/specialequipment/draftbox9",
  //     detailUrl: "/specialequipment/standbookdetail9",
  //     detailName: "附件详情",
  //     addName: "新建附件"
  //   },
  //   component: resolve => require(['@/pages/sceneManagement/hiddenDanger/detail.vue'], resolve),
  // },
  // // {
  // //   path: 'specialDevice',
  // //   name: '特种设备管理-new',
  // //   meta: {
  // //     title: '特种设备管理-new',
  // //     icon: 'speciale-icon',
  // //     isPage: false,
  // //   },
  // //   component: PageView,
  // //   // component: resolve => require(['@/pages/sceneManagement/hiddenDangerManage.vue'], resolve),
  // //   children: [
  // //     ...specialDevice
  // //   ]
  // // },
  // specialDevice: {
  //   name: '特种设备管理-新',
  //   meta: {
  //     title: '特种设备管理-新',
  //     isPage: false,
  //     icon: 'speciale-icon',
  //   },
  //   component: view.page,
  // },
  // ...specialDeviceMap,
  // cooperationPartner: {
  //   name: '合作伙伴管理',
  //   meta: {
  //     title: '合作伙伴管理',
  //     isPage: false,
  //     icon: 'partner-icon',
  //   },
  //   component: view.page,
  // },
  // partnerInvitation: {
  //   name: '合作伙伴邀请',
  //   meta: {
  //     title: '合作伙伴邀请',
  //     isPage: true,
  //   },
  //   component: resolve => require(['@/pages/cooperationPartner/partnerInvitation'], resolve),
  // },
  // audit: {
  //   name: '邀请审核',
  //   meta: {
  //     title: '邀请审核',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/cooperationPartner/partnerInvitation/audit.vue'], resolve),
  // },
  // view: {
  //   name: '邀请查看',
  //   meta: {
  //     title: '邀请查看',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/cooperationPartner/partnerInvitation/view.vue'], resolve),
  // },
  // completeInformation: {
  //   name: '完善信息',
  //   meta: {
  //     title: '完善信息',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/cooperationPartner/partnerInvitation/completeInformation.vue'], resolve),
  // },
  // changeInformation: {
  //   name: '变更信息',
  //   meta: {
  //     title: '变更信息',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/cooperationPartner/partnerInvitation/changeInformation.vue'], resolve),
  // },
  // partnerList: {
  //   name: '合作伙伴列表',
  //   meta: {
  //     title: '合作伙伴列表',
  //     isPage: true,
  //   },
  //   component: resolve => require(['@/pages/cooperationPartner/partnerList'], resolve),
  // },
  // dispatch: {
  //   name: '派工',
  //   meta: {
  //     title: '派工',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/cooperationPartner/partnerList/dispatch.vue'], resolve),
  // },
  // dispatchDetail: {
  //   name: '查看派工',
  //   meta: {
  //     title: '查看派工',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/cooperationPartner/partnerList/dispatchDetail.vue'], resolve),
  // },
  // learn: {
  //   name: '学习记录',
  //   meta: {
  //     title: '学习记录',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/cooperationPartner/partnerList/learn.vue'], resolve),
  // },
  // partnerDetail: {
  //   name: '详情',
  //   meta: {
  //     title: '详情',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/cooperationPartner/partnerList/partnerDetail'], resolve),
  // },
  // punishmentRecord: {
  //   name: '处罚记录',
  //   meta: {
  //     title: '处罚记录',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/cooperationPartner/partnerList/punishmentRecord.vue'], resolve),
  // },
  // blacklistManagement: {
  //   name: '黑名单管理',
  //   meta: {
  //     title: '黑名单管理',
  //     isPage: true,
  //     url: "/cooperationPartner/standingbook10",
  //     draftUrl: "/cooperationPartner/draftbox10",
  //     detailUrl: "/cooperationPartner/standbookdetail10",
  //     detailName: "申请单详情",
  //     addName: "新建审批"
  //   },
  //   component: resolve => require(['@/pages/cooperationPartner/partnerList/blacklistManagement.vue'], resolve),
  // },
  // blacklistApprovalList: {
  //   name: '移除黑名单审批记录',
  //   meta: {
  //     title: '移除黑名单审批记录',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/cooperationPartner/partnerList/blacklistApproval/index.vue'], resolve),
  // },
  // blacklistDraft: {
  //   name: '移除黑名单草稿箱',
  //   meta: {
  //     title: '移除黑名单草稿箱',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/cooperationPartner/partnerList/blacklistApproval/draftList.vue'], resolve),
  // },
  // blacklistCreate: {
  //   name: '新建移除黑名单申请',
  //   meta: {
  //     title: '新建移除黑名单申请',
  //     isPage: true,
  //     invisible: true,
  //     isCreate: true, // 新建
  //   },
  //   component: resolve => require(['@/pages/cooperationPartner/partnerList/blacklistApproval/create.vue'], resolve),
  // },
  // blacklistResolve: {
  //   name: '处理移除黑名单审批',
  //   meta: {
  //     title: '处理移除黑名单审批',
  //     isPage: true,
  //     isResolve: true,
  //     invisible: true, // 处理
  //   },
  //   component: resolve => require(['@/pages/cooperationPartner/partnerList/blacklistApproval/create.vue'], resolve),
  // },
  // blacklistEdit: {
  //   name: '编辑移除黑名单审批',
  //   meta: {
  //     title: '编辑移除黑名单审批',
  //     isPage: true,
  //     invisible: true,
  //     isEdit: true // 编辑
  //   },
  //   component: resolve => require(['@/pages/cooperationPartner/partnerList/blacklistApproval/create.vue'], resolve),
  // },
  // blacklistDetail: {
  //   name: '移除黑名单审批详情',
  //   meta: {
  //     title: '移除黑名单审批详情',
  //     isPage: true,
  //     invisible: true,
  //     disabled: true,
  //     isView: true, // 查看
  //   },
  //   component: resolve => require(['@/pages/cooperationPartner/partnerList/blacklistApproval/create.vue'], resolve),
  // },
  // educationmanagement: {
  //   name: '教育培训管理',
  //   meta: {
  //     title: '教育培训管理',
  //     icon: 'education-icon',
  //   },
  //   component: view.page,
  // },
  // subjectmanagement: {
  //   name: '科目管理',
  //   meta: {
  //     title: '科目管理',
  //     isPage: true,
  //   },
  //   component: resolve => require(['@/pages/resourcepool/subjectmanagement/index.vue'], resolve),
  //   children: []
  // },
  // instructormanagement: {
  //   name: '讲师管理',
  //   meta: {
  //     title: '讲师管理',
  //     isPage: true,
  //   },
  //   component: resolve => require(['@/pages/resourcepool/instructormanagement/index.vue'], resolve),
  // },
  // coursewaremanagement: {
  //   name: '课件管理',
  //   meta: {
  //     title: '课件管理',
  //     isPage: true,
  //   },
  //   component: resolve => require(['@/pages/resourcepool/coursewaremanagement/index.vue'], resolve),
  // },
  // questionbankmanagement: {
  //   name: '题库管理',
  //   meta: {
  //     title: '题库管理',
  //     isPage: true,
  //   },
  //   component: resolve => require(['@/pages/resourcepool/questionbankmanagement/index.vue'], resolve),
  // },
  // questionbankManagementAOC: {
  //   name: '题库新增编辑',
  //   meta: {
  //     title: '新建编辑',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/resourcepool/questionbankmanagement/questionbankManagementAOC'], resolve)
  // },
  // examinationPaper: {
  //   name: '试卷管理',
  //   meta: {
  //     title: '试卷管理',
  //     isPage: false,
  //   },
  //   component: resolve => require(['@/pages/resourcepool/examinationPaper'], resolve),
  // },
  // examinationLook: {
  //   name: '查看试卷',
  //   meta: {
  //     title: '查看试卷',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/resourcepool/examinationPaper/examinationPaperLook'], resolve),
  // },
  // examinationAOCOne: {
  //   name: '试卷新增编辑',
  //   meta: {
  //     title: '新增编辑',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/resourcepool/examinationPaper/examinationAOCOne'], resolve),
  // },
  // examinationAOCTwo: {
  //   name: '新增编辑',
  //   meta: {
  //     title: '新增编辑',
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/resourcepool/examinationPaper/examinationAOCTwo'], resolve),
  // },
  // subjectContent: {
  //   name: '内容管理',
  //   meta: {
  //     title: '内容管理',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/resourcepool/subjectmanagement/subjectContent/index.vue'], resolve),
  // },
  // coursemanagement: {
  //   name: '课程管理',
  //   meta: {
  //     title: '课程管理',
  //     isPage: true,
  //   },
  //   component: resolve => require(['@/pages/courseManagement/index.vue'], resolve),
  // },
  // testManagement: {
  //   name: '考试管理',
  //   meta: {
  //     title: '考试管理',
  //     isPage: true,
  //   },
  //   component: resolve => require(['@/pages/testManagement/index.vue'], resolve),
  // },
  // testManagementOne: {
  //   name: '新增考试',
  //   meta: {
  //     title: '新增考试',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/testManagement/testManagementOne/index.vue'], resolve),
  // },
  // addcourse: {
  //   name: '新建课程',
  //   meta: {
  //     title: '新建课程',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/courseManagement/addCourse.vue'], resolve),
  // },
  // editscourse: {
  //   name: '编辑课程',
  //   meta: {
  //     title: '编辑课程',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/courseManagement/addCourse.vue'], resolve),
  // },
  // detailcourse: {
  //   name: '查看课程',
  //   meta: {
  //     title: '查看课程',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/courseManagement/detailCourse.vue'], resolve),
  // },
  // pushstaff: {
  //   name: '推送课程',
  //   meta: {
  //     title: '推送课程',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/courseManagement/pushStaff.vue'], resolve),
  // },
  // environmental: {
  //   name: '环境数据监测',
  //   meta: {
  //     title: '环境数据监测',
  //     icon: 'environmental-icon',
  //   },
  //   component: view.page
  // },
  // flueGasMonitoring: {
  //   name: '废气在线监测',
  //   meta: {
  //     title: '废气在线监测',
  //     isPage: true,
  //   },
  //   component: resolve => require(['@/pages/environmental/flueGasMonitoring'], resolve),
  // },
  // wasteWaterMonitoring: {
  //   name: '废水在线监测',
  //   meta: {
  //     title: '废水在线监测',
  //     isPage: true,
  //   },
  //   component: resolve => require(['@/pages/environmental/wasteWaterMonitoring'], resolve),
  // },
  // flueGasMore: {
  //   name: '废气更多',
  //   meta: {
  //     title: '更多',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/environmental/flueGasMonitoring/more'], resolve),
  // },
  // wasteWaterMore: {
  //   name: '废水更多',
  //   meta: {
  //     title: '更多',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/environmental/wasteWaterMonitoring/more'], resolve),
  // },
  // chemicalsManage: {
  //   name: '化学品入厂管理',
  //   meta: {
  //     title: '化学品入厂管理',
  //     icon: 'chemicals-manage-icon',
  //   },
  //   component: view.page,
  // },
  // chemicals: {
  //   name: '化学品清单',
  //   meta: {
  //     title: '化学品清单',
  //     icon: 'chemicals-manage-icon',
  //   },
  //   component: view.page,
  //   redirect: '/chemicals/chemicalsList',
  // },
  // chemicalsList: {
  //   name: '化学品清单列表',
  //   meta: {
  //     title: '化学品清单列表',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/chemicals/chemicalsManage/chemicalsList'], resolve),
  // },
  // addChemical: {
  //   name: '新建化学品',
  //   meta: {
  //     title: '新建化学品',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/chemicals/chemicalsManage/chemicalsList/addChemical'], resolve),
  // },
  // chemicalsListPreview: {
  //   name: '查看化学品',
  //   meta: {
  //     title: '查看化学品',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/chemicals/chemicalsManage/chemicalsList/previewChemicalsList.vue'], resolve),
  // },
  // newlyChemicals: {
  //   name: '新导入化学品入厂',
  //   meta: {
  //     title: '新导入化学品入厂',
  //     isPage: true,
  //   },
  //   component: resolve => require(['@/pages/chemicals/chemicalsManage/newlyChemicals'], resolve),
  // },
  // addNewlyChemicals: {
  //   name: '新建导入化学品',
  //   meta: {
  //     title: '新建导入化学品',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/chemicals/chemicalsManage/newlyChemicals/addNewlyChemicals.vue'], resolve),
  // },
  // newlyChemicalsDraft: {
  //   name: '新导入化学品草稿箱',
  //   meta: {
  //     title: '新导入化学品草稿箱',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/chemicals/chemicalsManage/newlyChemicals/draft.vue'], resolve),
  // },
  // handleNewly: {
  //   name: '新导入化学品处理',
  //   meta: {
  //     title: '新导入化学品处理',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/chemicals/chemicalsManage/newlyChemicals/handleNewly.vue'], resolve),
  // },
  // transientChemicals: {
  //   name: '临时化学品入厂',
  //   meta: {
  //     title: '临时化学品入厂',
  //     isPage: true,
  //   },
  //   component: resolve => require(['@/pages/chemicals/chemicalsManage/transientChemicals/index.vue'], resolve),
  // },
  // transientChemicalsDraft: {
  //   name: '临时化学品草稿箱',
  //   meta: {
  //     title: '临时化学品草稿箱',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/chemicals/chemicalsManage/transientChemicals/transientChemicalsDraft/transientChemicalsDraft.vue'], resolve),
  // },
  // transientChemicalsAdd: {
  //   name: '临时化学品入厂新建编辑',
  //   meta: {
  //     title: '临时化学品入厂新建编辑',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/chemicals/chemicalsManage/transientChemicals/transientChemicalsAdd/transientChemicalsAdd.vue'], resolve),
  // },
  // transientChemicalsShow: {
  //   name: '临时化学品入厂查看',
  //   meta: {
  //     title: '临时化学品入厂查看',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/chemicals/chemicalsManage/transientChemicals/transientChemicalsHandle/transientChemicalsHandle.vue'], resolve),
  // },
  // transientChemicalsHandle: {
  //   name: '临时化学品入厂管理处理',
  //   meta: {
  //     title: '临时化学品入厂管理处理',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/chemicals/chemicalsManage/transientChemicals/transientChemicalsHandle/transientChemicalsHandle.vue'], resolve),
  // },
  // transientChemicalsTag: {
  //   name: '临时化学品入厂管理标签',
  //   meta: {
  //     title: '临时化学品入厂管理标签',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/chemicals/chemicalsManage/transientChemicals/transientChemicalsTag/transientChemicalsTag.vue'], resolve),
  // },
  // transientChemicalsList: {
  //   name: '临时化学品清单',
  //   meta: {
  //     title: '临时化学品清单',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/chemicals/chemicalsManage/transientChemicals/transientChemicalsList'], resolve),
  // },
  // chemicalsDeposit: {
  //   name: '化学品储存管理',
  //   meta: {
  //     title: '化学品储存管理',
  //     icon: 'chemicals-deposit-icon',
  //   },
  //   component: view.page,
  // },
  // storageDepot: {
  //   name: '化学品库房储存管理',
  //   meta: {
  //     title: '化学品库房储存管理',
  //     isPage: true,
  //   },
  //   component: resolve => require(['@/pages/chemicals/chemicalsDeposit/storageDepot.vue'], resolve),
  // },
  // addEditDepot: {
  //   name: '新建化学品存放库',
  //   meta: {
  //     title: '新建化学品存放库',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/chemicals/chemicalsDeposit/addEditDepot.vue'], resolve),
  // },
  // depotPreview: {
  //   name: '化学品存放库预览',
  //   meta: {
  //     title: '化学品存放库预览',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/chemicals/chemicalsDeposit/depotPreview.vue'], resolve),
  // },
  // storageTank: {
  //   name: '化学品柜储存管理',
  //   meta: {
  //     title: '化学品柜储存管理',
  //     isPage: true,
  //   },
  //   component: resolve => require(['@/pages/chemicals/chemicalsDeposit/storageTank.vue'], resolve),
  // },
  // addEditTank: {
  //   name: '新建化学品存放柜',
  //   meta: {
  //     title: '新建化学品存放柜',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/chemicals/chemicalsDeposit/addEditTank.vue'], resolve),
  // },
  // tankPreview: {
  //   name: '化学品存放柜预览',
  //   meta: {
  //     title: '化学品存放柜预览',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/chemicals/chemicalsDeposit/tankPreview.vue'], resolve),
  // },
  // systemManagement: {
  //   name: '系统管理',
  //   meta: {
  //     title: '系统管理',
  //     icon: 'system-icon',
  //   },
  //   component: view.page,
  // },
  // dictionary: {
  //   name: '字典管理',
  //   meta: {
  //     title: '字典管理',
  //     isPage: true,
  //   },
  //   component: resolve => require(['@/pages/authority/dictionary'], resolve),
  // },
  // organization: {
  //   name: '组织管理',
  //   meta: {
  //     title: '组织管理',
  //     isPage: true,
  //   },
  //   component: resolve => require(['@/pages/authority/organization'], resolve),
  // },
  // holiday: {
  //   name: '节假日配置',
  //   meta: {
  //     title: '节假日配置',
  //     isPage: true,
  //   },
  //   component: resolve => require(['@/pages/holiday'], resolve),
  // },
  // message: {
  //   name: '消息管理',
  //   meta: {
  //     title: '消息管理',
  //     isPage: true,
  //   },
  //   component: resolve => require(['@/pages/authority/message/index.vue'], resolve)
  // },
  // ngformlist: {
  //   name: '表单流程配置',
  //   meta: {
  //     title: '表单流程配置',
  //     isPage: true,
  //   },
  //   component: resolve => require(['@/pages/ngform/ngformList.vue'], resolve)
  // },
  // formFlowConfiguration: {
  //   name: '表单流程',
  //   meta: {
  //     title: '表单流程',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/formFlowConfiguration'], resolve)
  // },
  // corporation: {
  //   name: '法人机构',
  //   meta: {
  //     title: '法人机构',
  //     isPage: true,
  //   },
  //   component: resolve => require(['@/pages/corporation/index.vue'], resolve)
  // },
  // menuDataPermission: {
  //   name: '菜单数据权限',
  //   meta: {
  //     title: '菜单数据权限',
  //     isPage: true,
  //   },
  //   component: resolve => require(['@/pages/menuDataPermission/index.vue'], resolve)
  // },
  // networkControl: {
  //   name: '报警联网管控',
  //   meta: {
  //     title: '报警联网管控',
  //     icon: 'network-control-icon',
  //   },
  //   component: view.page,
  // },
  // ...networkControlMap,
  // chemicalsIdentification: {
  //   name: '化学品标识管理',
  //   meta: {
  //     title: '化学品标识管理',
  //     icon: 'chemicals-identification-icon',
  //   },
  //   component: view.page,
  // },
  // chemicalIdentSafetyTips: {
  //   name: '化学品安全提示卡',
  //   meta: {
  //     title: '化学品安全提示卡',
  //     isPage: true,
  //   },
  //   component: resolve => require(['@/pages/chemicals/chemicalsIdentification/chemicalIdentSafetyTips/index.vue'], resolve),
  // },
  // chemicalIdentSafetyTipsAdd: {
  //   name: '化学品安全提示卡新建编辑',
  //   meta: {
  //     title: '化学品安全提示卡新建编辑',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/chemicals/chemicalsIdentification/chemicalIdentSafetyTips/chemicalIdentSafetyTipsAdd/chemicalIdentSafetyTipsAdd.vue'], resolve),
  // },
  // chemicalIdentSafetyTipsShow: {
  //   name: '化学品安全提示卡查看',
  //   meta: {
  //     title: '查看',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/chemicals/chemicalsIdentification/chemicalIdentSafetyTips/chemicalIdentSafetyTipsShow/chemicalIdentSafetyTipsShow.vue'], resolve),
  // },
  // chemicalIdentSafetySigns: {
  //   name: '化学品安全标签',
  //   meta: {
  //     title: '化学品安全标签',
  //     isPage: true,
  //   },
  //   component: resolve => require(['@/pages/chemicals/chemicalsIdentification/chemicalIdentSafetySigns/index.vue'], resolve),
  // },
  // chemicalIdentSafetySignsAdd: {
  //   name: '化学品安全标签新建编辑',
  //   meta: {
  //     title: '化学品安全标签新建编辑',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/chemicals/chemicalsIdentification/chemicalIdentSafetySigns/chemicalIdentSafetySignsAdd/chemicalIdentSafetySignsAdd.vue'], resolve),
  // },
  // chemicalIdentSafetySignsShow: {
  //   name: '化学品安全标签查看',
  //   meta: {
  //     title: '化学品安全标签查看',
  //     isPage: true,
  //     invisible: true,
  //   },
  //   component: resolve => require(['@/pages/chemicals/chemicalsIdentification/chemicalIdentSafetySigns/chemicalIdentSafetySignsShow/chemicalIdentSafetySignsShow.vue'], resolve),
  // },
  // ...chemicalsMsdsMap,
  // occupationHealth: {
  //   name: '职业健康管理',
  //   meta: {
  //     title: '职业健康管理',
  //     icon: 'occupation-health-icon',
  //   },
  //   component: view.page,
  // },
  // ...occupationHealthMap,
  // dangerSource: {
  //   name: '危险源管理',
  //   meta: {
  //     title: '危险源管理',
  //     icon: 'occupation-health-icon',
  //   },
  //   component: view.page,
  // },
  // ...dangerSourceMap,
  // dangerWorkStatic: {
  //   name: '危险作业管理',
  //   meta: {
  //     title: '危险作业管理',
  //     icon: 'danger-work',
  //     isPage: false,
  //   },
  //   component: view.page,
  // },
  // ...dangerWorkMap,
  // hiddenPerils: {
  //   name: '隐患排查管理',
  //   meta: {
  //     title: '隐患排查管理',
  //     icon: 'svg-icon-danger-manage',
  //     isPage: false,
  //   },
  //   component: view.page,
  // },
  // ...hiddenPerilsMap,
  // // 数据统计分析
  // ...dataAnalysisMap,
  // monthReportManage: {
  //   name: '月报管理',
  //   meta: {
  //     title: '月报管理',
  //     icon: 'svg-icon-danger-manage',
  //     isPage: false,
  //   },
  //   component: view.page,
  // },
  // ...safeCorpMap,
  // envMonthReport: {
  //   name: '环境月报管理',
  //   meta: {
  //     title: '环境月报管理',
  //     icon: 'svg-icon-danger-manage',
  //     isPage: false,
  //   },
  //   component: view.page,
  // },
  // ...envMonthReportMap,
  // deviceSafety: {
  //   name: '设备安全管理',
  //   meta: {
  //     title: '设备安全管理',
  //     icon: 'svg-icon-danger-manage',
  //     isPage: false,
  //   },
  //   component: view.page,
  // },
  // ...deviceSafetyMap,
  // improveProposalManagement: {
  //   name: '改善提案管理',
  //   meta: {
  //     title: '改善提案管理',
  //     icon: 'occupation-health-icon',
  //   },
  //   component: view.page,
  // },
  // ...improveProposalMap,
  exception: {
    name: '异常页',
    icon: 'warning',
    component: view.blank
  },
  exp403: {
    authority: '*',
    name: 'exp403',
    path: '403',
    component: resolve => require(['@/pages/exception/403'], resolve),
  },
  exp404: {
    name: 'exp404',
    path: '404',
    component: resolve => require(['@/pages/exception/404'], resolve),
  },
  exp500: {
    name: 'exp500',
    path: '500',
    component: resolve => require(['@/pages/exception/500'], resolve),
  },
  blankPage: {
    name: 'blankPage',
    path: 'blankPage',
    component: resolve => require(['@/pages/exception/blankPage'], resolve),
  },
}
console.log("---fff-----", routerMap);
export default routerMap

