import Accident from './Accident.vue'
import HiddenTrouble from './HiddenTrouble.vue'
import AlertData from './AlertData.vue'
import SpecialDevice from './SpecialDevice.vue'
import EmergencyDrill from './EmergencyDrill.vue'
import DeviceSafeCheck from './DeviceSafeCheck.vue'
import OutterFactoryTrain from './OutterFactoryTrain.vue'
import EHSTrainReport from './EHSTrainReport.vue'
import ShouldGetCheck from './ShouldGetCheck.vue'
import DangerWork from './DangerWork.vue'
import DeviceSafeCertificate from './DeviceSafeCertificate.vue'
import PhysicalHealthManage from './PhysicalHealthManage'

export const tabComps = [
  {
    component: Accident,
    name: '事故事件分析',
    id: 'accident',
    isActive: true
  },
  {
    component: HiddenTrouble,
    name: '隐患总结分析',
    id: 'hiddenTrouble',
    isActive: true
  },
  {
    component: AlertData,
    name: '报警数据分析',
    id: 'alertData',
    isActive: true
  },
  {
    component: SpecialDevice,
    name: '特种设备分析',
    id: 'specialDevice',
    isActive: false
  },
  {
    component: EmergencyDrill,
    name: '应急演练分析',
    id: 'emergencyDrill',
    isActive: true
  },
  {
    component: DeviceSafeCheck,
    name: '设备安全联锁抽查',
    id: 'deviceSafeCheck',
    isActive: false
  },
  {
    component: OutterFactoryTrain,
    name: '外协厂商培训',
    id: 'outterFactoryTrain',
    isActive: true
  },
  {
    component: EHSTrainReport,
    name: 'EHS培训报告',
    id: 'EHSTrainReport',
    isActive: false
  },
  {
    component: ShouldGetCheck,
    name: '应知应会抽查',
    id: 'shouldGetCheck',
    isActive: false
  },
  {
    component: DangerWork,
    name: '危险作业分析',
    id: 'dangerWork',
    isActive: false
  },
  {
    component: DeviceSafeCertificate,
    name: '设备安全认证',
    id: 'deviceSafeCertificate',
    isActive: false
  },
  {
    component: PhysicalHealthManage,
    name: '职业健康管理',
    id: 'physicalHealthManage',
    isActive: false
  }
]