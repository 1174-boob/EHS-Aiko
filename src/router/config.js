import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
// 有面包屑、有padding、有背景 的父级盒子
import PageView from '@/layouts/PageView'
// 无面包屑、无padding、有背景 的父级盒子 
import NoBreadcrumb from '@/layouts/NoBreadcrumb'
// 无面包屑、无padding、无背景 的父级盒子 
import NoBreadcrumbNoBg from '@/layouts/NoBreadcrumbNoBg'
import { chemicalsMsds } from './children/chemicalsMsds'
import { occupationHealth } from './children/occupationHealth'
import { dangerSource } from './children/dangerSource'
import { dangerWork } from './children/dangerWorkStatic'
import { hiddenPerils } from './children/hiddenPerils'
import { safeCorp } from './children/safeMonthReport'
import { emergency } from './children/emergency';
import { envMonthReport } from './children/envMonthReport'
import { deviceSafety } from './children/deviceSafety'
import { networkControl } from './children/networkControl'
import { improveProposal } from './children/improveProposal'
import { performanceManagement } from './children/performanceManagement'
import { performanceManagementBranch, performanceManagementBranchMap } from './children/performanceManagementBranch'
import { specialDevice } from './children/specialDevice'
// import { getDictTree } from '@/services/api'
import { accidentManagementDA, dangerWorkDA, resourcepoolDA, hiddenPerilsDA, emergencyManagementDA } from './children/dataAnalysis/dataAnalysis.js'
const view = {
  tabs: () => import('@/layouts/tabs'),
  blank: () => import('@/layouts/BlankView'),
  page: () => import('@/layouts/PageView')
}

// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: resolve => require(['@/pages/login'], resolve)
    },
    {
      path: '*',
      name: 'blankPage',
      component: resolve => require(['@/pages/exception/blankPage'], resolve)
    },
    {
      path: '/404',
      name: '404',
      component: resolve => require(['@/pages/exception/404'], resolve)
    },
    {
      path: '/403',
      name: '403',
      component: resolve => require(['@/pages/exception/403'], resolve)
    },
    {
      path: '/',
      name: '登录',
      component: view.tabs,
      meta: {
        // title: '首页管理',
        isPage: true,
      },
      redirect: process.env.NODE_ENV == "development" ? '/login' : '/overview/preview',
      children: [
        {
          path: 'overview',
          name: '总览',
          meta: {
            title: '总览',
            isPage: false,
            icon: 'icon-zonglanhuise',
          },
          component: NoBreadcrumbNoBg,
          children: [
            {
              path: 'preview',
              name: '首页',
              meta: {
                title: '首页',
                isPage: true,
              },
              component: resolve => require(['@/pages/preview'], resolve),
            },
          ]
        },
        {
          path: 'notice',
          name: '通知公告',
          meta: {
            title: '通知公告',
            isPage: true,
            routerCode:'notice',
            icon: 'icon-tzgghuise',
          },
          component: PageView,
          children: [
            {
              path: 'systemNotice',
              name: '系统公告',
              meta: {
                title: '系统公告',
                isKeepalive:true,
                routerCode:'systemNotice',
                isPage: true,
              },
              component: resolve => require(['@/pages/notice'], resolve),
            },
            {
              path: 'noticeAddEdit',
              name: '通知公告新建编辑',
              meta: {
                title: '新建编辑',
                isPage: true,
                routerCode:'systemNotice',
                invisible: true,
              },
              component: resolve => require(['@/pages/notice/addEdit.vue'], resolve)
            },
            {
              path: 'noticePreview',
              name: '预览',
              meta: {
                title: '预览',
                isPage: true,
                routerCode:'systemNotice',
                invisible: true,
              },
              component: resolve => require(['@/pages/notice/preview.vue'], resolve)
            },
          ]
        },
        {
          path: 'safeManage',
          name: '安全管理',
          meta: {
            title: '安全管理',
            icon: 'svg-icon-secutiry',
          },
          component: PageView,
          children: [
            {
              path: 'securityThinkTank',
              name: '安全智库',
              meta: {
                title: '安全智库',
                icon: 'none',
              },
              isPage: false,
              component: NoBreadcrumb,
              children: [
                {
                  path: 'policy',
                  name: '政策法规',
                  meta: {
                    title: '政策法规',
                    routerCode:'policy',
                    isKeepalive:true,
                    isPage: true,
                  },
                  component: resolve => require(['@/pages/policy'], resolve),
                },
                {
                  path: 'policyAddEdit',
                  name: '政策法规新建编辑',
                  meta: {
                    title: '新建编辑',
                    routerCode:'policy',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/policy/addEdit.vue'], resolve)
                },
                {
                  path: 'policyPreview',
                  name: '政策法规预览',
                  meta: {
                    title: '预览',
                    routerCode:'policy',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/policy/preview.vue'], resolve)
                },
                {
                  path: 'improveProposalManagement',
                  name: '改善提案管理',
                  meta: {
                    title: '改善提案管理',
                    icon: 'none',
                  },
                  isPage: false,
                  component: NoBreadcrumb,
                  children: [
                    ...improveProposal,
                  ]
                },
                {
                  path: 'monthReportManage',
                  name: '安全运行数据',
                  meta: {
                    title: '安全运行数据',
                    icon: 'none',
                  },
                  component: NoBreadcrumb,
                  children: [
                    ...safeCorp,
                  ]
                },
              ]
            },
            {
              path: 'dualControlManage',
              name: '双控管理',
              meta: {
                title: '双控管理',
                icon: 'none',
              },
              isPage: false,
              component: NoBreadcrumb,
              children: [
                {
                  path: 'riskManage',
                  name: '风险管理',
                  meta: {
                    title: '风险管理',
                    icon: 'none',
                  },
                  isPage: false,
                  component: NoBreadcrumb,
                  children: [
                    ...dangerSource,
                  ]
                },
                {
                  path: 'hiddenPerils',
                  name: '隐患排查管理',
                  meta: {
                    title: '隐患排查管理',
                    icon: 'none',
                    isPage: false,
                  },
                  component: NoBreadcrumb,
                  children: [
                    ...hiddenPerils,
                    ...hiddenPerilsDA,
                  ]
                },
              ]
            },
            {
              path: 'dangerWorkStatic',
              name: '危险作业管理',
              meta: {
                title: '危险作业管理',
                icon: 'none',
                isPage: false,
              },
              component: NoBreadcrumb,
              children: [
                ...dangerWork,
                ...dangerWorkDA,
              ]
            },
            {
              path: 'emergencyManagement',
              name: '应急管理',
              meta: {
                title: '应急管理',
                icon: 'none',
                isPage: false,
              },
              component: NoBreadcrumb,
              children: [
                {
                  path: 'emergencyDrillManagement',
                  name: '应急演练管理',
                  meta: {
                    title: '应急演练管理',
                    icon: 'none',
                    isPage: false,
                  },
                  component: NoBreadcrumb,
                  children: [
                    ...emergency,
                    ...emergencyManagementDA,
                  ]
                },
                {
                  path: 'accidentManagement',
                  name: '事故事件管理',
                  meta: {
                    title: '事故事件管理',
                    icon: 'none',
                    isPage: false,
                  },
                  component: NoBreadcrumb,
                  children: [
                    {
                      path: 'accidentList',
                      name: '事故事件台账',
                      meta: {
                        title: '事故事件台账',
                        routerCode:'accidentList',
                        isKeepalive:true,
                        isPage: true,
                      },
                      component: resolve => require(['@/pages/accidentManagement/accident/index.vue'], resolve),
                    },
                    {
                      path: 'accidentDraft',
                      name: '事故事件草稿箱',
                      meta: {
                        title: '事故事件草稿箱',
                        routerCode:'accidentList',
                        isKeepalive:true,
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/accidentManagement/accident/draftList.vue'], resolve),
                    },
                    {
                      path: 'accidentCreate',
                      name: '新建事故事件',
                      meta: {
                        title: '新建事故事件',
                        routerCode:'accidentList',
                        isPage: true,
                        invisible: true,
                        isCreate: true, // 新建
                      },
                      component: resolve => require(['@/pages/accidentManagement/accident/create.vue'], resolve),
                    },
                    {
                      path: 'accidentResolve',
                      name: '处理事故事件',
                      meta: {
                        title: '处理事故事件',
                        routerCode:'accidentList',
                        isPage: true,
                        isResolve: true,
                        invisible: true, // 处理
                      },
                      component: resolve => require(['@/pages/accidentManagement/accident/create.vue'], resolve),
                    },
                    {
                      path: 'accidentEdit',
                      name: '编辑事故事件',
                      meta: {
                        title: '编辑事故事件',
                        routerCode:'accidentList',
                        isPage: true,
                        invisible: true,
                        isEdit: true // 编辑
                      },
                      component: resolve => require(['@/pages/accidentManagement/accident/create.vue'], resolve),
                    },
                    {
                      path: 'accidentDetail',
                      name: '事故事件详情',
                      meta: {
                        title: '事故事件详情',
                        routerCode:'accidentList',
                        isPage: true,
                        invisible: true,
                        disabled: true,
                        isView: true, // 查看
                      },
                      component: resolve => require(['@/pages/accidentManagement/accident/create.vue'], resolve),
                    },
                    {
                      path: 'falseAlarm',
                      name: '虚惊未遂事件',
                      meta: {
                        title: '虚惊未遂事件',
                        routerCode:'falseAlarm',
                        isKeepalive:true,
                        isPage: true,
                      },
                      component: resolve => require(['@/pages/accidentManagement/falseAlarm/index.vue'], resolve),
                    },
                    {
                      path: 'falseAlarmDarft',
                      name: '虚惊未遂事件草稿箱',
                      meta: {
                        title: '虚惊未遂事件草稿箱',
                        routerCode:'falseAlarm',
                        isKeepalive:true,
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/accidentManagement/falseAlarm/draftList.vue'], resolve),
                    },
                    {
                      path: 'falseAlarmCreate',
                      name: '虚惊未遂事件新建',
                      meta: {
                        title: '虚惊未遂事件新建',
                        routerCode:'falseAlarm',
                        isPage: true,
                        invisible: true,
                        isCreate: true
                      },
                      component: resolve => require(['@/pages/accidentManagement/falseAlarm/create.vue'], resolve),
                    },
                    {
                      path: 'falseAlarmEdit',
                      name: '虚惊未遂事件编辑',
                      meta: {
                        title: '虚惊未遂事件编辑',
                        routerCode:'falseAlarm',
                        isPage: true,
                        invisible: true,
                        isEdit: true
                      },
                      component: resolve => require(['@/pages/accidentManagement/falseAlarm/create.vue'], resolve),
                    },
                    {
                      path: 'falseAlarmResolve',
                      name: '虚惊未遂事件审核',
                      meta: {
                        title: '虚惊未遂事件审核',
                        routerCode:'falseAlarm',
                        isPage: true,
                        invisible: true,
                        isResolve: true
                      },
                      component: resolve => require(['@/pages/accidentManagement/falseAlarm/create.vue'], resolve),
                    },
                    {
                      path: 'falseAlarmView',
                      name: '虚惊未遂事件详情',
                      meta: {
                        title: '虚惊未遂事件详情',
                        routerCode:'falseAlarm',
                        isPage: true,
                        invisible: true,
                        isView: true
                      },
                      component: resolve => require(['@/pages/accidentManagement/falseAlarm/create.vue'], resolve),
                    },
                    ...accidentManagementDA,
                  ]
                },
                {
                  path: 'networkControl',
                  name: '报警联网管控',
                  meta: {
                    title: '报警联网管控',
                    icon: 'none',
                  },
                  component: NoBreadcrumb,
                  children: [
                    ...networkControl
                  ]
                },
              ]
            },
            {
              path: 'deviceSafeManage',
              name: '设备安全管理',
              meta: {
                title: '设备安全管理',
                icon: 'none',
              },
              isPage: false,
              component: NoBreadcrumb,
              children: [
                {
                  path: 'deviceSafety',
                  name: '设备安全履历',
                  meta: {
                    title: '设备安全履历',
                    icon: 'none',
                  },
                  component: NoBreadcrumb,
                  children: [
                    ...deviceSafety,
                  ]
                },
                {
                  path: 'specialeDevice',
                  name: '特种设备管理',
                  meta: {
                    title: '特种设备管理',
                    icon: 'none',
                    isPage: false,
                  },
                  component: NoBreadcrumb,
                  children: [
                    ...specialDevice
                  ]
                },
              ]
            },
            {
              path: 'chemicalSafeManage',
              name: '化学品安全管理',
              meta: {
                title: '化学品安全管理',
                icon: 'none',
              },
              isPage: false,
              component: NoBreadcrumb,
              children: [
                {
                  path: 'chemicalListManage',
                  name: '化学品清单管理',
                  meta: {
                    title: '化学品清单管理',
                    icon: 'none',
                    isPage: false,
                  },
                  component: NoBreadcrumb,
                  children: [
                    {
                      path: 'chemicalsList',
                      name: '化学品清单列表',
                      meta: {
                        title: '化学品清单列表',
                        routerCode:'chemicalsList',
                        isKeepalive:true,
                        isPage: true,
                      },
                      component: resolve => require(['@/pages/chemicals/chemicalsManage/chemicalsList'], resolve),
                    },
                    {
                      path: 'addChemical',
                      name: '新建化学品',
                      meta: {
                        title: '新建化学品',
                        routerCode:'chemicalsList',
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/chemicals/chemicalsManage/chemicalsList/addChemical'], resolve),
                    },
                    {
                      path: 'chemicalsListPreview',
                      name: '查看化学品',
                      meta: {
                        title: '查看化学品',
                        routerCode:'chemicalsList',
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/chemicals/chemicalsManage/chemicalsList/previewChemicalsList.vue'], resolve),
                    },
                    {
                      path: 'newlyChemicals',
                      name: '新导入化学品入厂',
                      meta: {
                        title: '新导入化学品入厂',
                        routerCode:'chemicalsList',
                        isKeepalive:true,
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/chemicals/chemicalsManage/newlyChemicals/index.vue'], resolve),
                    },
                    {
                      path: 'addNewlyChemicals',
                      name: '新建导入化学品',
                      meta: {
                        title: '新建导入化学品',
                        routerCode:'chemicalsList',
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/chemicals/chemicalsManage/newlyChemicals/addNewlyChemicals.vue'], resolve),
                    },
                    {
                      path: 'newlyChemicalsDraft',
                      name: '新导入化学品草稿箱',
                      meta: {
                        title: '新导入化学品草稿箱',
                        routerCode:'chemicalsList',
                        isKeepalive:true,
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/chemicals/chemicalsManage/newlyChemicals/draft.vue'], resolve),
                    },
                    {
                      path: 'handleNewly',
                      name: '新导入化学品处理',
                      meta: {
                        title: '新导入化学品处理',
                        routerCode:'chemicalsList',
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/chemicals/chemicalsManage/newlyChemicals/handleNewly.vue'], resolve),
                    },

                  ]
                },
                {
                  path: 'chemicalStoreManage',
                  name: '化学品存储管理',
                  meta: {
                    title: '化学品存储管理',
                    icon: 'none',
                    isPage: false,
                  },
                  component: NoBreadcrumb,
                  children: [
                    {
                      path: 'storageDepot',
                      name: '化学品库房储存管理',
                      meta: {
                        title: '化学品库房储存管理',
                        routerCode:'storageDepot',
                        isKeepalive:true,
                        isPage: true,
                      },
                      component: resolve => require(['@/pages/chemicals/chemicalsDeposit/storageDepot.vue'], resolve),
                    },
                    {
                      path: 'addEditDepot',
                      name: '新建化学品存放库',
                      meta: {
                        title: '新建化学品存放库',
                        routerCode:'storageDepot',
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/chemicals/chemicalsDeposit/addEditDepot.vue'], resolve),
                    },
                    {
                      path: 'depotPreview',
                      name: '化学品存放库预览',
                      meta: {
                        title: '化学品存放库预览',
                        routerCode:'storageDepot',
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/chemicals/chemicalsDeposit/depotPreview.vue'], resolve),
                    },
                    {
                      path: 'storageTank',
                      name: '化学品柜储存管理',
                      meta: {
                        title: '化学品柜储存管理',
                        routerCode:'storageTank',
                        isKeepalive:true,
                        isPage: true,
                      },
                      component: resolve => require(['@/pages/chemicals/chemicalsDeposit/storageTank.vue'], resolve),
                    },
                    {
                      path: 'addEditTank',
                      name: '新建化学品存放柜',
                      meta: {
                        title: '新建化学品存放柜',
                        routerCode:'storageTank',
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/chemicals/chemicalsDeposit/addEditTank.vue'], resolve),
                    },
                    {
                      path: 'tankPreview',
                      name: '化学品存放柜预览',
                      meta: {
                        title: '化学品存放柜预览',
                        routerCode:'storageTank',
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/chemicals/chemicalsDeposit/tankPreview.vue'], resolve),
                    },
                  ],
                },
                {
                  path: 'chemicalsIdentification',
                  name: '化学品标识管理',
                  meta: {
                    title: '化学品标识管理',
                    icon: 'none',
                    isPage: false,
                  },
                  component: NoBreadcrumb,
                  children: [
                    {
                      path: 'chemicalIdentSafetyTips',
                      name: '化学品安全提示卡',
                      meta: {
                        title: '化学品安全提示卡',
                        routerCode:'chemicalIdentSafetyTips',
                        isKeepalive:true,
                        isPage: true,
                      },
                      component: resolve => require(['@/pages/chemicals/chemicalsIdentification/chemicalIdentSafetyTips/index.vue'], resolve),
                    },
                    {
                      path: 'chemicalIdentSafetyTipsAdd',
                      name: '化学品安全提示卡新建编辑',
                      meta: {
                        title: '化学品安全提示卡新建编辑',
                        routerCode:'chemicalIdentSafetyTips',
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/chemicals/chemicalsIdentification/chemicalIdentSafetyTips/chemicalIdentSafetyTipsAdd/chemicalIdentSafetyTipsAdd.vue'], resolve),
                    },
                    {
                      path: 'chemicalIdentSafetyTipsShow',
                      name: '化学品安全提示卡查看',
                      meta: {
                        title: '化学品安全提示卡查看',
                        routerCode:'chemicalIdentSafetyTips',
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/chemicals/chemicalsIdentification/chemicalIdentSafetyTips/chemicalIdentSafetyTipsShow/chemicalIdentSafetyTipsShow.vue'], resolve),
                    },
                    {
                      path: 'chemicalIdentSafetySigns',
                      name: '化学品安全标签',
                      meta: {
                        title: '化学品安全标签',
                        routerCode:'chemicalIdentSafetySigns',
                        isKeepalive:true,
                        isPage: true,
                      },
                      component: resolve => require(['@/pages/chemicals/chemicalsIdentification/chemicalIdentSafetySigns/index.vue'], resolve),
                    },
                    {
                      path: 'chemicalIdentSafetySignsAdd',
                      name: '化学品安全标签新建编辑',
                      meta: {
                        title: '化学品安全标签新建编辑',
                        routerCode:'chemicalIdentSafetySigns',
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/chemicals/chemicalsIdentification/chemicalIdentSafetySigns/chemicalIdentSafetySignsAdd/chemicalIdentSafetySignsAdd.vue'], resolve),
                    },
                    {
                      path: 'chemicalIdentSafetySignsShow',
                      name: '化学品安全标签查看',
                      meta: {
                        title: '化学品安全标签查看',
                        routerCode:'chemicalIdentSafetySigns',
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/chemicals/chemicalsIdentification/chemicalIdentSafetySigns/chemicalIdentSafetySignsShow/chemicalIdentSafetySignsShow.vue'], resolve),
                    },
                    ...chemicalsMsds,
                  ]
                },
              ]
            },

          ]
        },
        {
          path: 'occupationHealth',
          name: '职业健康管理',
          meta: {
            title: '职业健康管理',
            icon: 'occupation-health-icon',
          },
          component: PageView,
          children: [
            ...occupationHealth,
          ]
        },
        {
          path: 'environmentManage',
          name: '环境管理',
          meta: {
            title: '环境管理',
            icon: 'environmental-icon',
          },
          component: PageView,
          children: [
            {
              path: 'environmental',
              name: '环境在线数据监测',
              meta: {
                title: '环境在线数据监测',
                icon: 'none',
              },
              component: NoBreadcrumb,
              children: [
                {
                  path: 'environmentalDataMap',
                  name: '环境数据地图',
                  meta: {
                    title: '环境数据地图',
                    icon: 'none',
                    isPage: true,
                  },
                  component: resolve => require(['@/pages/environmental/environmentalDataMap'], resolve),
                },
                {
                  path: 'labelingDetail',
                  name: '地图数据详情',
                  meta: {
                    title: '地图数据详情',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/environmental/environmentalDataMap/labelingDetail.vue'], resolve),
                },
                // {
                //   path: 'dataMonitoring',
                //   name: '数据监测首页',
                //   meta: {
                //     title: '数据监测首页',
                //     isPage: true,
                //   },
                //   component: resolve => require(['@/pages/environmental/dataMonitoring'], resolve),
                // },
                {
                  path: 'bitmapManage',
                  name: '点位图管理',
                  meta: {
                    title: '点位图管理',
                    isPage: true,
                    invisible: true
                  },
                  component: resolve => require(['@/pages/environmental/bitmapManage'], resolve),
                },
                {
                  path: 'alarmAndWarning',
                  name: '预警/报警管理',
                  meta: {
                    title: '预警/报警管理',
                    routerCode:'alarmAndWarning',
                    isPage: true,
                  },
                  component: resolve => require(['@/pages/environmental/alarmAndWarning'], resolve),
                },
                {
                  path: 'flueGasMonitoring',
                  name: '废气在线监测',
                  meta: {
                    title: '废气在线监测',
                    isPage: true,
                  },
                  component: resolve => require(['@/pages/environmental/flueGasMonitoring'], resolve),
                },
                {
                  path: 'wasteWaterMonitoring',
                  name: '废水在线监测',
                  meta: {
                    title: '废水在线监测',
                    isPage: true,
                  },
                  component: resolve => require(['@/pages/environmental/wasteWaterMonitoring'], resolve),
                },
                {
                  path: 'flueGasMore',
                  name: '废气更多',
                  meta: {
                    title: '更多',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/environmental/flueGasMonitoring/more'], resolve),
                },
                {
                  path: 'wasteWaterMore',
                  name: '废水更多',
                  meta: {
                    title: '更多',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/environmental/wasteWaterMonitoring/more'], resolve),
                },
                {
                  path: 'pointMapManage',
                  name: '点位图管理',
                  meta: {
                    title: '点位图管理',
                    routerCode:'pointMapManage',
                    isKeepalive:true,
                    isPage: true,
                  },
                  component: resolve => require(['@/pages/environmental/markManage/index'], resolve),
                },
                {
                  path: 'polluteDataList',
                  name: '污染物数据',
                  meta: {
                    title: '污染物数据',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/environmental/markManage/polluteData'], resolve),
                },
                {
                  path: 'pointMapDataList',
                  name: '点位图数据',
                  meta: {
                    title: '点位图数据',
                    routerCode:'pointMapManage',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/environmental/markManage/markData'], resolve),
                },
                {
                  path: 'envAddMark',
                  name: '标注点位',
                  meta: {
                    title: '标注点位',
                    routerCode:'pointMapManage',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/environmental/markManage/addMark'], resolve),
                },
                {
                  path: 'envViewMark',
                  name: '查看标注点位',
                  meta: {
                    title: '查看标注点位',
                    routerCode:'pointMapManage',
                    isPage: true,
                    isView: true,
                    invisible: true
                  },
                  component: resolve => require(['@/pages/environmental/markManage/addMark'], resolve),
                },
                {
                  path: 'envMarkDetail',
                  name: '点位详情',
                  meta: {
                    title: '点位详情',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/environmental/markManage/markDetail'], resolve),
                },
                {
                  path: 'earlyWarnInfo',
                  name: '预警信息',
                  meta: {
                    title: '预警信息',
                    routerCode:'earlyWarnInfo',
                    isKeepalive:true,
                    isPage: true,
                  },
                  component: resolve => require(['@/pages/environmental/earlyWarnInfo/index.vue'], resolve),
                },
                {
                  path: 'wasteGasHandle',
                  name: '废气预警信息处理',
                  meta: {
                    title: '废气预警信息处理',
                    routerCode:'earlyWarnInfo',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/environmental/earlyWarnInfo/tpl/wasteGasShowOrHandle.vue'], resolve),
                },
                {
                  path: 'wasteGasShow',
                  name: '废气预警信息查看',
                  meta: {
                    title: '废气预警信息查看',
                    routerCode:'earlyWarnInfo',
                    isPage: true,
                    invisible: true,
                    isShowPage: true,
                  },
                  component: resolve => require(['@/pages/environmental/earlyWarnInfo/tpl/wasteGasShowOrHandle.vue'], resolve),
                },
                {
                  path: 'wasteWaterHandle',
                  name: '废水预警信息处理',
                  meta: {
                    title: '废水预警信息处理',
                    routerCode:'earlyWarnInfo',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/environmental/earlyWarnInfo/tpl/wasteWaterShowOrHandle.vue'], resolve),
                },
                {
                  path: 'wasteWaterShow',
                  name: '废水预警信息查看',
                  meta: {
                    title: '废水预警信息查看',
                    routerCode:'earlyWarnInfo',
                    isPage: true,
                    invisible: true,
                    isShowPage: true,
                  },
                  component: resolve => require(['@/pages/environmental/earlyWarnInfo/tpl/wasteWaterShowOrHandle.vue'], resolve),
                },
                {
                  path: 'ambientAlarmInfo',
                  name: '报警信息',
                  meta: {
                    title: '报警信息',
                    routerCode:'ambientAlarmInfo',
                    isKeepalive:true,
                    isPage: true,
                  },
                  component: resolve => require(['@/pages/environmental/ambientAlarmInfo/index.vue'], resolve),
                },
                {
                  path: 'ambientWasteGasHandle',
                  name: '废气报警信息处理',
                  meta: {
                    title: '废气报警信息处理',
                    routerCode:'ambientAlarmInfo',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/environmental/ambientAlarmInfo/tpl/wasteGasShowOrHandle.vue'], resolve),
                },
                {
                  path: 'ambientWasteGasShow',
                  name: '废气报警信息查看',
                  meta: {
                    title: '废气报警信息查看',
                    routerCode:'ambientAlarmInfo',
                    isPage: true,
                    invisible: true,
                    isShowPage: true,
                  },
                  component: resolve => require(['@/pages/environmental/ambientAlarmInfo/tpl/wasteGasShowOrHandle.vue'], resolve),
                },
                {
                  path: 'ambientWasteWaterHandle',
                  name: '废水报警信息处理',
                  meta: {
                    title: '废水报警信息处理',
                    routerCode:'ambientAlarmInfo',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/environmental/ambientAlarmInfo/tpl/wasteWaterShowOrHandle.vue'], resolve),
                },
                {
                  path: 'ambientWasteWaterShow',
                  name: '废水报警信息查看',
                  meta: {
                    title: '废水报警信息查看',
                    routerCode:'ambientAlarmInfo',
                    isPage: true,
                    invisible: true,
                    isShowPage: true,
                  },
                  component: resolve => require(['@/pages/environmental/ambientAlarmInfo/tpl/wasteWaterShowOrHandle.vue'], resolve),
                }
              ]
            },
            {
              path: 'envMonthReport',
              name: '环境报表管理',
              meta: {
                title: '环境报表管理',
                icon: 'none',
              },
              component: NoBreadcrumb,
              children: [
                ...envMonthReport,
              ]
            },
          ]
        },
        {
          path: 'ehsGerneralManage',
          name: 'EHS综合管理',
          meta: {
            title: 'EHS综合管理',
            icon: 'ehs-total-manage-icon',
          },
          component: PageView,
          children: [
            {
              path: 'educationmanagement',
              name: '教育培训管理',
              meta: {
                title: '教育培训管理',
                icon: 'none',
              },
              component: NoBreadcrumb,
              children: [
                {
                  path: 'resource',
                  name: '资源库管理',
                  meta: {
                    title: '资源库',
                    icon: 'none',
                  },
                  component: NoBreadcrumb,
                  children: [
                    {
                      path: 'subjectmanagement',
                      name: '科目管理',
                      meta: {
                        title: '科目管理',
                        routerCode:'subjectmanagement',
                        isKeepalive:true,
                        isPage: true,
                      },
                      component: resolve => require(['@/pages/resourcepool/subjectmanagement/index.vue'], resolve),
                      children: []
                    },
                    {
                      path: 'instructormanagement',
                      name: '讲师管理',
                      meta: {
                        title: '讲师管理',
                        routerCode:'instructormanagement',
                        isPage: true,
                      },
                      component: resolve => require(['@/pages/resourcepool/instructormanagement/index.vue'], resolve),
                    },
                    {
                      path: 'coursewaremanagement',
                      name: '课件管理',
                      meta: {
                        title: '课件管理',
                        routerCode:'coursewaremanagement',
                        isPage: true,
                      },
                      component: resolve => require(['@/pages/resourcepool/coursewaremanagement/index.vue'], resolve),
                    },
                    {
                      path: 'questionbankmanagement',
                      name: '题库管理',
                      meta: {
                        title: '题库管理',
                        routerCode:'questionbankmanagement',
                        isKeepalive:true,
                        isPage: true,
                      },
                      component: resolve => require(['@/pages/resourcepool/questionbankmanagement/index.vue'], resolve),
                    },
                    {
                      path: 'questionbankManagementAOC',
                      name: '题库新增编辑',
                      meta: {
                        title: '新建编辑',
                        routerCode:'questionbankmanagement',
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/resourcepool/questionbankmanagement/questionbankManagementAOC'], resolve)
                    },
                    {
                      path: 'examinationPaper',
                      name: '试卷管理',
                      meta: {
                        title: '试卷管理',
                        routerCode:'examinationPaper',
                        isKeepalive:true,
                        isPage: false,
                      },
                      component: resolve => require(['@/pages/resourcepool/examinationPaper'], resolve),
                    },
                    {
                      path: 'examinationLook',
                      name: '查看试卷',
                      meta: {
                        title: '查看试卷',
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/resourcepool/examinationPaper/examinationPaperLook'], resolve),
                    },
                    {
                      path: 'examinationAOCOne',
                      name: '试卷新增编辑',
                      meta: {
                        title: '新增编辑',
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/resourcepool/examinationPaper/examinationAOCOne'], resolve),
                    },
                    {
                      path: 'examinationAOCTwo',
                      name: '新增编辑',
                      meta: {
                        title: '新增编辑',
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/resourcepool/examinationPaper/examinationAOCTwo'], resolve),
                    },
                    {
                      path: 'subjectContent',
                      name: '内容管理',
                      meta: {
                        title: '内容管理',
                        routerCode:'subjectmanagement',
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/resourcepool/subjectmanagement/subjectContent/index.vue'], resolve),
                    },
                  ]
                },
                {
                  path: 'coursemanagement',
                  name: '课程管理',
                  meta: {
                    title: '课程管理',
                    routerCode:'coursemanagement',
                    isKeepalive:true,
                    isPage: true,
                  },
                  component: resolve => require(['@/pages/courseManagement/index.vue'], resolve),
                },
                {
                  path: 'candidateFile',
                  name: '考生档案',
                  meta: {
                    title: '考生档案',
                    routerCode:'candidateFile',
                    isKeepalive:true,
                    isPage: true,
                  },
                  component: resolve => require(['@/pages/educationmanagement/candidateFile/index.vue'], resolve),
                },
                {
                  path: 'fileDetail',
                  name: '考生档案详情',
                  meta: {
                    title: '考生档案详情',
                    routerCode:'candidateFile',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/educationmanagement/candidateFile/fileDetail/index.vue'], resolve),
                },
                {
                  path: 'filePreview',
                  name: '考生档案预览试卷',
                  meta: {
                    title: '预览试卷',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/educationmanagement/candidateFile/filePreview/index.vue'], resolve),
                },
                {
                  path: 'myCourseTest',
                  name: '我的课程考试',
                  meta: {
                    title: '我的课程考试',
                    routerCode:'myCourseTest',
                    isKeepalive:true,
                    isPage: true,
                  },
                  component: resolve => require(['@/pages/educationmanagement/myCourseTest/index.vue'], resolve),
                },
                {
                  path: 'myCourseDetail',
                  name: '我的课程考试详情',
                  meta: {
                    title: '课程详情',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/educationmanagement/myCourseTest/myCourseDetail/index.vue'], resolve),
                },
                {
                  path: 'myCourseStudy',
                  name: '我的课程课程学习',
                  meta: {
                    title: '课程学习',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/educationmanagement/myCourseTest/myCourseStudy/index.vue'], resolve),
                },
                {
                  path: 'myExamIng',
                  name: '我的课程考试中',
                  meta: {
                    title: '考试中',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/educationmanagement/myCourseTest/myExamIng/index.vue'], resolve),
                },
                {
                  path: 'myExamResult',
                  name: '我的课程考试结果',
                  meta: {
                    title: '考试结果',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/educationmanagement/myCourseTest/myExamResult/index.vue'], resolve),
                },
                {
                  path: 'myExamDetail',
                  name: '我的课程考试答题详情',
                  meta: {
                    title: '答题详情',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/educationmanagement/myCourseTest/myExamDetail/index.vue'], resolve),
                },
                {
                  path: 'testManagement',
                  name: '考试管理',
                  meta: {
                    title: '考试管理',
                    routerCode:'testManagement',
                    isKeepalive:true,
                    isPage: true,
                  },
                  component: resolve => require(['@/pages/testManagement/index.vue'], resolve),
                },
                {
                  path: 'testManagementOne',
                  name: '新增考试',
                  meta: {
                    title: '新增考试',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/testManagement/testManagementOne/index.vue'], resolve),
                },
                {
                  path: 'addcourse',
                  name: '新建课程',
                  meta: {
                    title: '新建课程',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/courseManagement/addCourse.vue'], resolve),
                },
                {
                  path: 'editscourse',
                  name: '编辑课程',
                  meta: {
                    title: '编辑课程',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/courseManagement/addCourse.vue'], resolve),
                },
                {
                  path: 'detailcourse',
                  name: '查看课程',
                  meta: {
                    title: '查看课程',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/courseManagement/detailCourse.vue'], resolve),
                },
                ...resourcepoolDA,
              ]
            },
            {
              path: 'securityArchiveManagement',
              name: '安全档案管理',
              meta: {
                title: '安全档案管理',
                icon: 'none',
              },
              component: NoBreadcrumb,
              children: [
                {
                  path: 'certificatesManagement',
                  name: '证书管理',
                  meta: {
                    title: '证书管理',
                    routerCode:'certificatesManagement',
                    isKeepalive:true,
                    isPage: true,
                  },
                  component: resolve => require(['@/pages/certificatesManagement/index.vue'], resolve),
                },
                {
                  path: 'employeesMessagesSet',
                  name: '消息推送设置',
                  meta: {
                    title: '消息推送设置',
                    routerCode:'employeesMessagesSet',
                    isPage: true,
                    invisible: true,
                    isKeepalive:true,
                  },
                  component: resolve => require(['@/pages/certificatesManagement/employeesMessagesSet.vue'], resolve),
                },
                {
                  path: 'occupationalHazardNotification',
                  name: '职业危害告知书',
                  meta: {
                    title: '职业危害告知书',
                    routerCode:'occupationalHazardNotification',
                    isKeepalive:true,
                    isPage: true,
                  },
                  component: resolve => require(['@/pages/occupationalHazardNotification/index.vue'], resolve),
                  children: []
                },
                {
                  path: 'occupationalPreview',
                  name: '签署告知书',
                  meta: {
                    title: '签署告知书',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/occupationalHazardNotification/occupationalPreview.vue'], resolve),
                },
                {
                  path: 'safetyResponsibilityLetter',
                  name: '安全责任书',
                  meta: {
                    title: '安全责任书',
                    routerCode:'safetyResponsibilityLetter',
                    isKeepalive:true,
                    isPage: true,
                  },
                  component: resolve => require(['@/pages/safetyResponsibilityLetter/index.vue'], resolve),
                  children: []
                },
                {
                  path: 'safetyResponsibilityPreview',
                  name: '签署责任书',
                  meta: {
                    title: '签署责任书',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/safetyResponsibilityLetter/safetyResponsibilityPreview.vue'], resolve),
                },
                {
                  path: 'safetyEduManagement',
                  name: '三级安全教育管理',
                  meta: {
                    title: '三级安全教育管理',
                    routerCode:'safetyEduManagement',
                    isKeepalive:true,
                    isPage: true,
                  },
                  component: resolve => require(['@/pages/safetyEduManagement/index.vue'], resolve),
                },
                {
                  path: 'safetyEduInitiate',
                  name: '三级安全教育管理发起',
                  meta: {
                    title: '发起',
                    routerCode:'safetyEduInitiate',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/safetyEduManagement/safetyEduInitiate/index.vue'], resolve),
                },
                {
                  path: 'safetyEduCorrectionGrades',
                  name: '三级安全教育管理成绩纠错',
                  meta: {
                    title: '成绩纠错',
                    routerCode:'safetyEduCorrectionGrades',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/safetyEduManagement/safetyEduCorrectionGrades/index.vue'], resolve),
                },

                {
                  path: 'safetyEduArchives',
                  name: '三级安全教育档案',
                  meta: {
                    title: '三级安全教育档案',
                    routerCode:'safetyEduArchives',
                    isKeepalive:true,
                    isPage: true,
                  },
                  component: resolve => require(['@/pages/safetyEduArchives/index.vue'], resolve),
                },
                {
                  path: 'signManagement',
                  name: '签名管理',
                  meta: {
                    title: '签名管理',
                    routerCode:'signManagement',
                    isPage: true,
                  },
                  component: resolve => require(['@/pages/signManagement/index.vue'], resolve),
                },
              ]
            },
            {
              path: 'cooperationPartner',
              name: '相关方管理',
              meta: {
                title: '相关方管理',
                icon: 'none',
              },
              component: NoBreadcrumb,
              children: [
                {
                  path: 'cooperationBaseInfo',
                  name: '相关方基本信息',
                  meta: {
                    title: '相关方基本信息',
                    icon: 'none',
                  },
                  component: NoBreadcrumb,
                  children: [
                    // {
                    //   path: 'partnerInvitation',
                    //   name: '相关方邀请',
                    //   meta: {
                    //     title: '相关方邀请',
                    //     routerCode:'partnerInvitation',
                    //     isKeepalive:true,
                    //     isPage: true,
                    //   },
                    //   component: resolve => require(['@/pages/cooperationPartner/partnerInvitation/index.vue'], resolve),
                    // },
                    {
                      path: 'examine',
                      name: '相关方审批',
                      meta: {
                        title: '相关方审批',
                        routerCode:'examine',
                        isKeepalive:true,
                        isPage: true,
                      },
                      component: resolve => require(['@/pages/cooperationPartner/partnerInvitation/examine.vue'], resolve),
                    },
                    {
                      path: 'examineAdd',
                      name: '相关方审批新建编辑',
                      meta: {
                        title: '相关方审批新建编辑',
                        routerCode:'examine',
                        invisible: true,
                        isKeepalive:true,
                        isPage: true,
                      },
                      component: resolve => require(['@/pages/cooperationPartner/partnerInvitation/examineAdd.vue'], resolve),
                    },
                    {
                      path: 'examinePreview',
                      name: '相关方审批查看',
                      meta: {
                        title: '相关方审批查看',
                        invisible: true,
                        routerCode:'examine',
                        isKeepalive:true,
                        isPage: true,
                      },
                      component: resolve => require(['@/pages/cooperationPartner/partnerInvitation/examinePreview.vue'], resolve),
                    },
                    {
                      path: 'examineHandle',
                      name: '相关方审批处理',
                      meta: {
                        invisible: true,
                        title: '相关方审批处理',
                        routerCode:'examine',
                        isKeepalive:true,
                        isPage: true,
                      },
                      component: resolve => require(['@/pages/cooperationPartner/partnerInvitation/examineHandle.vue'], resolve),
                    },
                    {
                      path: 'audit',
                      name: '邀请审核',
                      meta: {
                        title: '邀请审核',
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/cooperationPartner/partnerInvitation/audit.vue'], resolve),
                    },
                    {
                      path: 'view',
                      name: '邀请查看',
                      meta: {
                        title: '邀请查看',
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/cooperationPartner/partnerInvitation/view.vue'], resolve),
                    },
                    {
                      path: 'completeInformation',
                      name: '完善信息',
                      meta: {
                        title: '完善信息',
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/cooperationPartner/partnerInvitation/completeInformation.vue'], resolve),
                    },
                    {
                      path: 'changeInformation',
                      name: '变更信息',
                      meta: {
                        title: '变更信息',
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/cooperationPartner/partnerInvitation/changeInformation.vue'], resolve),
                    },
                    {
                      path: 'partnerList',
                      name: '相关方列表',
                      meta: {
                        title: '相关方列表',
                        routerCode:'partnerList',
                        isKeepalive:true,
                        isPage: true,
                      },
                      component: resolve => require(['@/pages/cooperationPartner/partnerList'], resolve),
                    },
                    {
                      path: 'dispatch',
                      name: '派工',
                      meta: {
                        title: '派工',
                        routerCode:'partnerList',
                        isKeepalive:true,
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/cooperationPartner/partnerList/dispatch.vue'], resolve),
                    },
                    {
                      path: 'dispatchDetail',
                      name: '相关方派工',
                      meta: {
                        title: '相关方派工',
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/cooperationPartner/partnerList/dispatchDetail.vue'], resolve),
                    },
                    {
                      path: 'learn',
                      name: '学习记录',
                      meta: {
                        title: '学习记录',
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/cooperationPartner/partnerList/learn.vue'], resolve),
                    },
                    {
                      path: 'partnerDetail',
                      name: '详情',
                      meta: {
                        title: '详情',
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/cooperationPartner/partnerList/partnerDetail'], resolve),
                    },
                    {
                      path: 'punishmentRecord',
                      name: '处罚记录',
                      meta: {
                        title: '处罚记录',
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/cooperationPartner/partnerList/punishmentRecord.vue'], resolve),
                    },
                    {
                      path: 'blacklistManagement',
                      name: '黑名单管理',
                      meta: {
                        title: '黑名单管理',
                        routerCode:'blacklistManagement',
                        isKeepalive:true,
                        isPage: true,
                      },
                      component: resolve => require(['@/pages/cooperationPartner/partnerList/blacklistManagement.vue'], resolve),
                    },
                    {
                      path: 'blacklistApprovalList',
                      name: '移除黑名单审批记录',
                      meta: {
                        title: '黑名单审批',
                        routerCode:'blacklistManagement',
                        isKeepalive:true,
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/cooperationPartner/partnerList/blacklistApproval/index.vue'], resolve),
                    },
                    {
                      path: 'blacklistDraft',
                      name: '移除黑名单草稿箱',
                      meta: {
                        title: '移除黑名单草稿箱',
                        isKeepalive:true,
                        isPage: true,
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/cooperationPartner/partnerList/blacklistApproval/draftList.vue'], resolve),
                    },
                    {
                      path: 'blacklistCreate',
                      name: '新建移除黑名单申请',
                      meta: {
                        title: '新建移除黑名单申请',
                        isPage: true,
                        invisible: true,
                        isCreate: true, // 新建
                      },
                      component: resolve => require(['@/pages/cooperationPartner/partnerList/blacklistApproval/create.vue'], resolve),
                    },
                    {
                      path: 'blacklistResolve',
                      name: '处理移除黑名单审批',
                      meta: {
                        title: '处理移除黑名单审批',
                        routerCode:'blacklistManagement',
                        isPage: true,
                        isResolve: true, // 处理
                        invisible: true,
                      },
                      component: resolve => require(['@/pages/cooperationPartner/partnerList/blacklistApproval/create.vue'], resolve),
                    },
                    {
                      path: 'blacklistEdit',
                      name: '编辑移除黑名单审批',
                      meta: {
                        title: '编辑移除黑名单审批',
                        isPage: true,
                        invisible: true,
                        isEdit: true // 编辑
                      },
                      component: resolve => require(['@/pages/cooperationPartner/partnerList/blacklistApproval/create.vue'], resolve),
                    },
                    {
                      path: 'blacklistDetail',
                      name: '移除黑名单审批详情',
                      meta: {
                        title: '移除黑名单审批详情',
                        isPage: true,
                        invisible: true,
                        disabled: true,
                        isView: true, // 查看
                      },
                      component: resolve => require(['@/pages/cooperationPartner/partnerList/blacklistApproval/create.vue'], resolve),
                    },
                  ]
                },
                {
                  path: 'transientChemicals',
                  name: '临时化学品入厂管理',
                  meta: {
                    title: '临时化学品入厂管理',
                    routerCode:'transientChemicals',
                    isKeepalive:true,
                    isPage: true,
                  },
                  component: resolve => require(['@/pages/chemicals/chemicalsManage/transientChemicals/index.vue'], resolve),
                },
                {
                  path: 'transientChemicalsDraft',
                  name: '临时化学品草稿箱',
                  meta: {
                    title: '临时化学品草稿箱',
                    routerCode:'transientChemicals',
                    isKeepalive:true,
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/chemicals/chemicalsManage/transientChemicals/transientChemicalsDraft/transientChemicalsDraft.vue'], resolve),
                },
                {
                  path: 'transientChemicalsAdd',
                  name: '临时化学品入厂新建编辑',
                  meta: {
                    title: '临时化学品入厂新建编辑',
                    routerCode:'transientChemicals',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/chemicals/chemicalsManage/transientChemicals/transientChemicalsAdd/transientChemicalsAdd.vue'], resolve),
                },
                {
                  path: 'transientChemicalsShow',
                  name: '临时化学品入厂查看',
                  meta: {
                    title: '临时化学品入厂查看',
                    routerCode:'transientChemicals',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/chemicals/chemicalsManage/transientChemicals/transientChemicalsHandle/transientChemicalsHandle.vue'], resolve),
                },
                {
                  path: 'transientChemicalsHandle',
                  name: '临时化学品入厂管理处理',
                  meta: {
                    title: '临时化学品入厂管理处理',
                    routerCode:'transientChemicals',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/chemicals/chemicalsManage/transientChemicals/transientChemicalsHandle/transientChemicalsHandle.vue'], resolve),
                },
                {
                  path: 'transientChemicalsTag',
                  name: '临时化学品入厂管理标签',
                  meta: {
                    title: '临时化学品入厂管理标签',
                    routerCode:'transientChemicals',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/chemicals/chemicalsManage/transientChemicals/transientChemicalsTag/transientChemicalsTag.vue'], resolve),
                },
                {
                  path: 'transientChemicalsList',
                  name: '临时化学品清单',
                  meta: {
                    title: '临时化学品清单',
                    isPage: true,
                    invisible: true,
                  },
                  component: resolve => require(['@/pages/chemicals/chemicalsManage/transientChemicals/transientChemicalsList'], resolve),
                },
              ]
            },
            {
              path: 'performanceManagement',
              name: 'EHS绩效管理',
              meta: {
                title: 'EHS绩效管理',
                icon: 'none',
                isPage: false,
              },
              component: NoBreadcrumb,
              children: [
                ...performanceManagement,
              ]
            },
            {
              path: 'orgPerformanceManage',
              name: '组织绩效管理',
              meta: {
                title: '组织绩效管理',
                icon: 'none',
                isPage: false,
              },
              component: NoBreadcrumb,
              children: [
                ...performanceManagementBranch,
              ]
            },
          ]
        },
        {
          path: 'systemManagement',
          name: '系统管理',
          meta: {
            title: '系统管理',
            icon: 'system-icon',
          },
          component: PageView,
          children: [
            {
              path: 'dictionary',
              name: '字典管理',
              meta: {
                title: '字典管理',
                isPage: true,
              },
              component: resolve => require(['@/pages/authority/dictionary'], resolve),
            },
            {
              path: 'menuDataPermission',
              name: '菜单数据权限',
              meta: {
                title: '菜单数据权限',
                isPage: true,
              },
              component: resolve => require(['@/pages/menuDataPermission/index.vue'], resolve)
            },
            {
              path: 'labelManagement',
              name: '标签组管理',
              meta: {
                title: '标签组管理',
                isPage: true,
              },
              component: resolve => require(['@/pages/system/labelManagement/index.vue'], resolve),
            },
            {
              path: 'business',
              name: '业务组织管理',
              meta: {
                title: '业务组织管理',
                isPage: true,
              },
              component: resolve => require(['@/pages/system/business/index.vue'], resolve),
            },
            {
              path: 'department',
              name: '部门管理',
              meta: {
                title: '部门管理',
                isPage: true,
              },
              component: resolve => require(['@/pages/system/department/department.vue'], resolve),
            },
            {
              path: 'role',
              name: '角色管理',
              meta: {
                title: '角色管理',
                isPage: true,
              },
              component: resolve => require(['@/pages/system/appAuthRole/appAuthRole.vue'], resolve),
            },
            // {
            //   path: 'positionManagement',
            //   name: '职位管理',
            //   meta: {
            //     title: '职位管理',
            //     isPage: true,
            //   },
            //   component: resolve => require(['@/pages/system/positionManagement/index.vue'], resolve),
            // },
            {
              path: 'user',
              name: '用户管理',
              meta: {
                title: '用户管理',
                isPage: true,
              },
              component: resolve => require(['@/pages/system/user/user.vue'], resolve),
            },
          ]
        },
      ]
    }
  ]
}

export default options
