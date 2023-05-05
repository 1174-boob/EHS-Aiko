// 全局后台API服务映射表
const serviceNameList = {
  auth: process.env.VUE_APP_AUTH,
  authehs: process.env.VUE_APP_AUTH_EHS,
  btp: process.env.VUE_APP_BTP,
  btp_corrse: process.env.VUE_APP_BTP_COURSE,
  contract: process.env.VUE_APP_CONTRACT,
  coupon: process.env.VUE_APP_COUPON,
  customer: process.env.VUE_APP_CUSTOMER,
  invoice: process.env.VUE_APP_INVOICE,
  payment: process.env.VUE_APP_PAYMENT,
  worklist: process.env.VUE_APP_WORKLIST,
  notice: process.env.VUE_APP_NOTICE,
  promotion: process.env.VUE_APP_PROMOTION,
  danger: process.env.VUE_APP_DANGER,
  message: process.env.VUE_APP_MESSAGE,
  form: process.env.VUE_APP_FORM,
  doc: process.env.VUE_APP_DOC,
  proposal: process.env.VUE_APP_PROPOSAL,
  course: process.env.VUE_APP_COURSE,
  btpFile: process.env.VUE_APP_BTNFILE,
  chemicals: process.env.VUE_APP_CHEMICALS,
  health: process.env.VUE_APP_HEALTH,
  risk: process.env.VUE_APP_RISK,
  envMonth: process.env.VUE_APP_MONTH,
  ehsEquip: process.env.VUE_APP_EQUIP,
  ehsKpi: process.env.VUE_APP_KPI,
  safe: process.env.VUE_APP_SAFE,
  kpi: process.env.VUE_APP_KPI,
  monitor: process.env.VUE_APP_MONITOR
}
window.serviceName = serviceNameList;
export default serviceNameList;