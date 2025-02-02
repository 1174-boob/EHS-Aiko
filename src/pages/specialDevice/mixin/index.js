
// import dictionary from '@/utils/newDictionary'
import { formValidator } from "@/utils/clx-form-validator.js";
import oldDictionary from '@/utils/dictionary'
import { mapGetters } from 'vuex'
import { debounce } from 'lodash'
import { getQueryVariable } from "@/utils/util.js"
import { queryDeptTree, GetfileMsgList } from '@/services/api'
import moment from 'moment'
import { specialEquipmentInsert, specialEquipmentUpdate, specialEquipmentDetail } from "@/services/specialDevice.js"
const mixin = {
  data() {
    return {
      infoFileIdList: [],
      draftDeptData: [],//起草人部门
      deptData: [],//保管部门
      iFrom:{},
      deptTreeId: '',//人员组件接收的保管组织id
    }
  },
  computed: {
    ...mapGetters('setting', ['getCommonAddOrgnizeListAll']),
    disabled() {
      return this.$route.meta && this.$route.meta.isView
    },
    isView() {
      return this.$route.meta && this.$route.meta.isView
    },
    isEdit() {
      return this.$route.meta && this.$route.meta.isEdit
    },
    isCreate() {
      return this.$route.meta && this.$route.meta.isCreate
    },
    //电梯类型
    elevatorTypeOptions() {
      return oldDictionary('elevatorType')
    },
    //附件类型
    annexTypeOptions() {
      return oldDictionary('annexType')
    },
    //附件状态
    annexStatusOptions() {
      return oldDictionary('annexStatus')
    },
    //设备类型
    equipmentTypeOptions() {
      return oldDictionary('equipmentType')
    },
    //设备状态
    equipmentStatusOptions() {
      return oldDictionary('equipmentStatus')
    },
    //数据筛选
    flagOptions() {
      return oldDictionary('flag')
    }
  },
  methods: {
    initApplicant() {
      let userInfo = JSON.parse(sessionStorage.getItem('zconsole_userInfo')) || {}
      let user = userInfo.user || {}
      this.newlyForm.applicant = user.jobNumber ? user.name + '/' + user.jobNumber : user.name
      this.newlyForm.draftNum = user.jobNumber
      this.newlyForm.draftName = user.name
      this.newlyForm.draftDept
      this.newlyForm.draftId = user.userId
    },
    async fetchDetail() {
      let para = {
        specialEquipmentId: this.$route.query.id != undefined ? this.$route.query.id : getQueryVariable('id')
      }
      const { data } = await specialEquipmentDetail(para)
      this.newlyForm = {
        ...data.specialEquipmentInfoVo,
        specialEquipmentDetail: {
          ...data.specialEquipmentDetailDto,
        },
      }
      console.log('data.safeAnnexList',data.safeAnnexList);
      this.iFrom.fireAlarmList = data.safeAnnexList && data.safeAnnexList.length == 0 ? null : data.safeAnnexList
      // console.log('this.iFrom.fireAlarmList2',this.iFrom.fireAlarmList);
      const specialVehicleImagesList = data.specialEquipmentDetailDto.specialVehicleImagesFileList; 
      if( specialVehicleImagesList && specialVehicleImagesList.length > 0) {
        const fileLists = [];
        const photoList = [];
        for (let index = 0; index < specialVehicleImagesList.length; index++) {
          const item = specialVehicleImagesList[index];
          let fileObj = {
            uid: item.id,
            id: item.id,
            name: item.fileName,
            url: item.filePath,
            status: 'done',
          };
          fileLists.push(fileObj);
          photoList.push(item.id);
        }
        this.specialVehicleImagesList = fileLists;
        this.newlyForm.specialVehicleImagesList = photoList;
      }
      //起草人
      this.newlyForm.applicant = this.newlyForm.draftName + '/' + this.newlyForm.draftNum
      //保管人
      console.log(this.newlyForm.custodianList);
      let saveArr = this.newlyForm.custodianList.map(item => item.userId)
      this.checkedTreeNode = saveArr
      let list = this.getCommonAddOrgnizeList
      let deptId = this.getMappingValue(list, "id", this.newlyForm.corporationId).deptId

      let list2 = this.getCommonAddOrgnizeListAll
      let deptId2 = this.getMappingValue(list2, 'id', this.newlyForm.saveCorporationId).deptId
      queryDeptTree({
        deptId: deptId
      }).then(res => {
        this.draftDeptData = res.data ? [res.data] : []
      }).catch(err => { console.log(err) })
      queryDeptTree({
        deptId: deptId2
      }).then(res => {
        this.deptData = res.data ? [res.data] : []
      }).catch(err => { console.log(err) })
      if (this.newlyForm.specialEquipmentDetail.infoFileIdList && this.newlyForm.specialEquipmentDetail.infoFileIdList.length > 0) {
        let result = await GetfileMsgList(this.newlyForm.specialEquipmentDetail.infoFileIdList) || {}
        this.infoFileIdList = (result.data || []).map(item => {
          return {
            uid: item.id,
            name: item.sourceFileName,
            status: 'done',
            url: item.filePath
          }
        })
      }
    },
    handleSaveCorporationIdChange(id) {
      this.$set(this.newlyForm, 'saveDept', undefined)
      this.$set(this.newlyForm, 'saveDeptCode', undefined)
      // this.deptTreeId = id
      let saveCorporation = this.getMappingValue(this.getCommonAddOrgnizeListAll, "orgId", id).orgName
      this.$set(this.newlyForm, 'saveCorporation', saveCorporation)
      let list = this.getCommonAddOrgnizeListAll
      let deptId = this.getMappingValue(list, 'id', id).deptId
      queryDeptTree({
        deptId: deptId
      }).then(res => {
        this.deptData = res.data ? [res.data] : []
      }).catch(err => { console.log(err) })
    },
    // 所属组织改变
    corporationChange(val, deptId) {
      this.$set(this.newlyForm, 'draftDeptCode', undefined)
      this.$set(this.newlyForm, 'draftDept', undefined)
    },
    //所属组织变化获取起草人部门数据
    corporationDeptChange(value) {
      this.draftDeptData = value
    },
    // 选择测试人员
    getTreeData(value) {
      let list = value.treeNameAndCodeList || [];
      let custodian = JSON.parse(JSON.stringify(list).replace(/id/g, 'userId').replace(/treeName/g, 'userName').replace(/treeCode/g, 'userJobNumber'));  
      let savePersonId = (value.treeIdList || [])[0]
      let savePerson = (value.treeNameAndCodeList || [])[0].treeName
      let savePersonNum = (value.treeNameAndCodeList || [])[0].treeCode
      this.$set(this.newlyForm, 'savePersonId', savePersonId)
      this.$set(this.newlyForm, 'savePerson', savePerson)
      this.$set(this.newlyForm, 'savePersonNum', savePersonNum)
      this.$set(this.newlyForm, 'custodian', custodian)
      if (!formValidator.formItemValidate(this, "savePersonId", "newlyForm")) {
        return
      }
    },
    //保管部门change
    saveDeptChange(id, name) {
      this.$set(this.newlyForm, 'saveDept', name.join())
      this.deptTreeId = id
    },
    //起草人部门change
    draftDeptChange(id, name) {
      this.$set(this.newlyForm, 'draftDept', name.join())
    },
    handleSuccess(data) {
      this.newlyForm.specialEquipmentDetail.infoFileIdList = data.map(item => {
        return item.id
      })
    },
    cancel() {
      this.setKeepalive(true)
      this.$router.push({
        path: '/safeManage/deviceSafeManage/specialDevice/specialDeviceAccount'
      })
    },
    // 特种设备保存
    save: debounce(function () {
      // console.log('this.iFrom.fireAlarmList ',this.iFrom == undefined );
      // return
      this.$refs.newlyForm.validate(async valid => {
        if (valid) {
          const para = {
            ...this.newlyForm,
          }
          if (this.iFrom != undefined) {
            para.safeAnnexList = this.iFrom.fireAlarmList ? this.iFrom.fireAlarmList :null
          }
          if (this.isEdit) {
            para.specialEquipmentId = this.$route.query.id
          }
          if (para.specialEquipmentDetail.forkliftPlateDate) {
            para.specialEquipmentDetail.forkliftPlateDate = moment(para.specialEquipmentDetail.forkliftPlateDate).format('YYYY-MM-DD')
          }
          if (para.specialEquipmentDetail.equipmentBuildDate) {
            para.specialEquipmentDetail.equipmentBuildDate = moment(para.specialEquipmentDetail.equipmentBuildDate).format('YYYY-MM-DD')
          }
          if (para.checkDate) {
            para.checkDate = moment(para.checkDate).format('YYYY-MM-DD')
          }
          if (para.nextCheckDate) {
            para.nextCheckDate = moment(para.nextCheckDate).format('YYYY-MM-DD')
          }
          let api = this.isCreate ? specialEquipmentInsert : specialEquipmentUpdate
          await api(para)
          this.$antMessage.success('保存成功')
          this.$router.push({
            path: '/safeManage/deviceSafeManage/specialDevice/specialDeviceAccount'
          })
        }
      })
    }, 250),
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
  }
};
export default mixin