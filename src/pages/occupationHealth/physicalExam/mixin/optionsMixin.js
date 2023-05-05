import dictionary from '@/utils/newDictionary'
import oldDictionary from '@/utils/dictionary'

export default {
  computed: {
    //体检类型
    checkTypeOptions() {
      return oldDictionary('healthCheckType')
    },
    //体检项目
    checkItemOptions() {
      return dictionary('inspection_items')
    },
    //体检机构
    checkAgencyOptions() {
      return dictionary('healthy_institution')
    },
    chemicalApproveStatusOptions() {
      return oldDictionary('chemicalApproveStatus')
    },
    //是否构成职业病
    universalOptions() {
      return oldDictionary('universal')
    },
    positionOptions() {
      return dictionary('position')
    },
    //体检结论
    checkResultOptions() {
      return oldDictionary('checkResult')
    },
    tellStatusOptions() {
      return oldDictionary('tellStatus')
    },
    //体检状态
    checkStatusOptions() {
      return oldDictionary('checkStatus')
    },
    corporationList() {
      return this.$store.state.setting.corporationList;
    }
  },
  methods: {
    corporationLabel(val) {
      return ((this.corporationList || []).find(item => {
        return item.corporationId === val
      }) || {}).orgAbbrName
    },
    checkStatusLabel(val) {
      return ((this.checkStatusOptions || []).find(item => {
        return item.key === val
      }) || {}).value
    },
    tellStatusLabel(val) {
      return ((this.tellStatusOptions || []).find(item => {
        return item.key === val
      }) || {}).value
    },
    approvalStatusLabel(val) {
      return ((this.chemicalApproveStatusOptions || []).find(item => {
        return item.key === val
      }) || {}).value
    },
    checkResultLabel(val) {
      return ((this.checkResultOptions || []).find(item => {
        return item.key === val
      }) || {}).value
    },
    checkTypeLabel(val) {
      return ((this.checkTypeOptions || []).find(item => {
        return item.key === val
      }) || {}).value
    },
    jobLabel(val) {
      return ((this.positionOptions || []).find(item => {
        return item.dictValue === val
      }) || {}).dictLabel
    },
    isSickLabel(val) {
      return ((this.universalOptions || []).find(item => {
        return item.key === val
      }) || {}).value
    },
    checkAgencyLabel(val) {
      return ((this.checkAgencyOptions || []).find(item => {
        return item.dictValue === val
      }) || {}).dictLabel
    },
  }
}