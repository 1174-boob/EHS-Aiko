<template>
  <HasFixedBottomWrapper>
    <div class="clx-flex-1">
      <div class="baseInfo">
        <a-row type="flex" justify="space-around">
          <a-col :span="4">设备名称：{{queryData.equipmentName}}</a-col>
          <a-col :span="4" v-if="queryData.forkliftPlateNum!= null" >牌照编号：{{queryData.forkliftPlateNum}}</a-col>
          <a-col :span="4">设备代码：{{queryData.equipmentCode}}</a-col>
          <a-col :span="4">所在位置：{{queryData.equipmentLocation}}</a-col>
        </a-row>
        <a-form-model ref="editForm" :model="editForm" :rules="editFormRules" :colon="false" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row type="flex" justify="space-around" class="bottom">
            <a-col v-if="queryData.checkType!= '3'" :span="12">
              <StaffOrDept
                :treeType="'user'"
                :propKey="'checkUserId'"
                :treeRoles="editFormRules"
                :labelTitle="'检查者'"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                @getTreeData="personThingOne"
                :checkedTreeNode="editForm.checkUserId"
              />
            </a-col>
            <a-col v-if="queryData.checkType== '3'" :span="9">安全管理人员：{{queryData.row.checkUserName}}/{{queryData.row.checkUserJobNumber}}</a-col>
            <a-col :span="12">
              <a-form-model-item ref="checkDate" label="检查时间" prop="checkDate">
                <a-date-picker :disabled-date="disabledDate" style="width: 100%;" v-model="editForm.checkDate" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" placeholder="请选择检查时间" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row v-if="queryData.equipType == '4'">
            <a-col :span="12">
              <a-form-model-item label="班次" prop="checkClasses" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-select :placeholder="'请选择班次'" v-model="editForm.checkClasses"  show-search>
                  <a-select-option v-for="item in checkClasses" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </div>
    <PageTitle v-if="queryData.checkType== '1'"><span style="color:red;">*</span>日常检查及维护保养</PageTitle>
    <PageTitle v-if="queryData.checkType== '2'"><span style="color:red;">*</span>月度检查内容及要求</PageTitle>
    <PageTitle v-if="queryData.checkType== '3'"><span style="color:red;">*</span>年度检查内容及要求</PageTitle>
    <vxe-table 
      border 
      align="center"
      ref="xTable" 
      :span-method="rowspanMethod"
      :seq-config="{startIndex: 0}" 
      show-overflow :column-config="{resizable: true}"
      :row-config="{height: 60, isHover: true}" 
      :data="tableData"
      >
      <vxe-column field="seq" type="seq" title="序号" width="60"></vxe-column>
      <vxe-column v-if="startStatus" field="checkName" title="检查项目" width="300">
        <template #default="{ row }">
          <a-input disabled v-model="row.checkName" placeholder="请输入检查项目"></a-input>
        </template>
      </vxe-column>
      <vxe-column field="checkContent" title="检查内容">
        <template #default="{ row }">
          <a-input disabled v-model="row.checkContent" placeholder="请输入检查内容" allowClear></a-input>
        </template>
      </vxe-column>
      <vxe-column title="检查情况" width="140" align="center">
        <template #default="{ row }">
          <a-radio-group v-model="row.checkResult">
            <a-radio :value="'1'">
              √
            </a-radio>
            <a-radio :value="'0'">
              ×
            </a-radio>
          </a-radio-group>
        </template>
      </vxe-column>
    </vxe-table>
    <div v-if="queryData.checkType== '1'" class="clx-flex-1">
      <div class="baseInfo">
        <a-row type="flex" justify="space-around">
          <a-col :span="24">注：每天操作前进行检查并将检查情况填入单元格内（√表示正常；×表示异常）。发现异常马上报告负责人并经负责人确认后及时处理，处理后在下表中做好记录。</a-col>
        </a-row>
      </div>
    </div>

    <template title="异常问题处理记录">
      <div>
        <div class="m-t-20 border-b-e7 ttile ttile-add-btn">
          <PageTitle class="ttile-text">异常问题处理记录</PageTitle>
          <DashBtn class="ttile-bbtn" v-if="!isShowPage">
            <div>
              <a-button type="dashed" @click="openFireModel">
                <a-icon type="plus" />添加
              </a-button>
            </div>
          </DashBtn>
        </div>
        <div class="m-t-20"></div>
      </div>
      <a-form-model-item ref="itemList" label=" " prop="itemList" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
        <CommonTable>
          <vxe-table
            class="vxe-scrollbar beauty-scroll-fireBox"
            border
            :show-header-overflow="!isShowPage"
            :show-overflow="!isShowPage"
            align="center"
            :seq-config="{startIndex: 0}" 
            :row-config="{isHover: true}"
            :data="iFrom.fireAlarmList"
          >
            <vxe-column field="seq" type="seq" title="序号" width="60"></vxe-column>
            <vxe-column field="description" title="异常问题描述">
              <template #default="{ row }">
                <span>{{ row.description }}</span>
              </template>
            </vxe-column>
            <vxe-column field="dealWith" title="异常问题处理情况">
              <template #default="{ row }">
                <span>{{ row.dealWith }}</span>
              </template>
            </vxe-column>
            <vxe-column field="handleUserId" title="处理人">
              <template #default="{ row }">
                <span>{{ row.handleUserName[0]}}/{{ row.handleUserJobNumber[0]}}</span>
              </template>
            </vxe-column>
            <vxe-column field="handleDate" title="处理日期">
              <template #default="{ row }">
                <span>{{ row.handleDate}}</span>
              </template>
            </vxe-column>
            <vxe-column field="secureManageUserId" title="安全管理员">
              <template #default="{ row }">
                <span>{{ row.secureManageUserName[0]}}/{{ row.secureManageUserJobNumber[0]}}</span>
              </template>
            </vxe-column>
            <vxe-column field="secureManageHandleDate" title="处理日期">
              <template #default="{ row }">
                <span>{{ row.secureManageHandleDate}}</span>
              </template>
            </vxe-column>
            <vxe-column field="remark" title="备注">
              <template #default="{ row }">
                <span>{{ row.remark == null ? '--' : row.remark }}</span>
              </template>
            </vxe-column>
            <vxe-column field="action" fixed="right" title="操作" width="120" v-if="!isShowPage">
              <template #default="{ row }">
                <div class="table-btn-box">
                  <span class="color-0067cc cursor-pointer m-r-15" @click="openFireModel(row)">编辑</span>
                  <span class="color-ff4d4f cursor-pointer" @click="rmFireRecordItem(row)">删除</span>
                </div>
              </template>
            </vxe-column>
            <template #empty>
              <div style="padding:16px 0;">
                <a-empty />
              </div>
            </template>
          </vxe-table>
        </CommonTable>
      </a-form-model-item>
    </template>

    <!-- 新增面板弹窗 -->
    <NewDataModel
      v-model="inspectionRecordModelShowFire"
      :formModelOldData="formModelFireData"
      :fireType="fireType"
      @addModuleList="openInspectionRecordModelFire"
      @changeModuleList="editInspectionRecordItemFire"
    />

    <div slot="fixedBottom">
      <!-- 按钮-查看/编辑/新建 -->
      <FixedBottom>
        <div>
          <a-button class="m-r-15" @click="goBack">取消</a-button>
          <a-button :loading="btnLoading" type="primary" class="m-r-15" @click="confirm">确定</a-button>
        </div>
      </FixedBottom>
    </div>
  </HasFixedBottomWrapper>
</template>

<script>
// import { VxeTablePropTypes } from 'vxe-table'
// 通用行合并函数（将相同多列数据合并为一行）
const rowspanMethod = ({ row, _rowIndex, column, visibleData }) => {
  const fields = ['checkName']
  const cellValue = row[column.field]
  if (cellValue && fields.includes(column.field)) {
    const prevRow = visibleData[_rowIndex - 1]
    let nextRow = visibleData[_rowIndex + 1]
    if (prevRow && prevRow[column.field] === cellValue) {
      return { rowspan: 0, colspan: 0 }
    } else {
      let countRowspan = 1
      while (nextRow && nextRow[column.field] === cellValue) {
        nextRow = visibleData[++countRowspan + _rowIndex]
      }
      if (countRowspan > 1) {
        return { rowspan: countRowspan, colspan: 1 }
      }
    }
  }
}
import { debounce } from "lodash";
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import NewDataModel from './NewDataModel.vue'
import reLogin from "@/utils/reLogin";
import moment from 'moment'
import { formValidator } from "@/utils/clx-form-validator.js"
import dictionary from "@/utils/dictionary";
import StaffOrDept from "@/components/staffOrDept";
import { getMenuAuthList, updateDataAuth } from "@/services/api.js";
import { checkInsertTask, checkExecute, checkItemList} from "@/services/deviceSafety.js"
export default {
  name: "ClkchkSearch",
  components: {
    FixedBottom, NewDataModel,StaffOrDept
  },
  props: {
    chkType: {
      type: String,
      default: "day",
    },
  },
  created(){
    console.log(this.$route.query,'888');
    this.queryData = this.$route.query
    this.checkClasses = dictionary("check_classes");
    this.initData()
  },
  data() {
    return {
      rowspanMethod: rowspanMethod,
      tableData: [
        { checkName: ""},
      ],
      dictionary,
      dayTableDataList: [],
      startStatus: false,
      btnLoading: false,
      queryData:{},
      editForm: {},
      checkClasses:[],
      // 表单验证
      editFormRules: {
        checkUserId: [
          { required: true, message: "检查人不能为空", trigger: "change" },
        ],
        checkClasses: [
          { required: true, message: '请选择班次', trigger: ['blur', 'change'] },
        ],
        checkDate: [
          { required: true, message: "检查时间不能为空", trigger: "change" },
        ],
      },
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      iFrom: {
        fireAlarmList: [],
      },
      formModelFireData: {},
      fireType: '',
      inspectionRecordModelShowFire: false,
    };
  },
  computed: {
    // 当前页面是否为查看
    isShowPage() {
      return Boolean(this.$route.meta.isShowPage)
    },
  },
  methods: {
    confirm(){
      if (!formValidator.formAll(this, "editForm")) {
        return;
      }
      if (this.queryData.checkType=='1' || this.queryData.checkType=='2'){
        if(this.editForm.checkUserId.length > 1){
          // console.log('this.editForm.checkUserId.length',this.editForm.checkUserId.length);
          this.$antMessage.warn('只能选择一名检查人！');
          return
        }
      }
      
      for (let i = 0; i < this.tableData.length; i++) {
        if (!this.tableData[i].checkResult) {
          this.$antMessage.warn("检查情况必须填写");
          return;
        }
      }
      const filteredTableData = this.tableData.map(item => {
        const { _X_ROW_KEY, ...rest } = item;
        return rest;
      });
      const newArray = this.iFrom.fireAlarmList.map(obj => {
        return { ...obj, handleUserId: obj.handleUserId[0] ,handleUserName: obj.handleUserName[0],handleUserJobNumber: obj.handleUserJobNumber[0],
          secureManageUserId: obj.secureManageUserId [0],secureManageUserName: obj.secureManageUserName[0],secureManageUserJobNumber: obj.secureManageUserJobNumber[0],
        };
      });
      let params = {
        equipId:this.queryData.equipId,
        checkType:this.queryData.checkType,
        checkId:this.queryData.row.checkId== undefined? null:this.queryData.row.checkId,
        checkUserId:this.editForm.checkUserId ? this.editForm.checkUserId[0] :null,
        checkUserName:this.editForm.checkUserName ? this.editForm.checkUserName[0] :null,
        checkUserJobNumber:this.editForm.checkUserJobNumber? this.editForm.checkUserJobNumber[0] :null,
        checkDate:this.editForm.checkDate,
        checkClasses:this.editForm.checkClasses?this.editForm.checkClasses:null,
        checkResult: filteredTableData,
        checkException: newArray
      }
      this.btnLoading = true;
      let promiseFn = this.queryData.row.checkId != undefined ?checkExecute:checkInsertTask
      promiseFn(params).then ((res)=>{
        console.log(res,'resss');
        this.$antMessage.success("操作成功");
        this.setKeepalive(true)
        this.$router.go(-1)
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        this.btnLoading = false;
      })
    },
    // 初始化数据
    initData() {
      if (this.$route.query.checkType && this.$route.query.equipType) {
        this.echoReportEdit();
      } else {
        this.$antMessage.warn("缺少参数~");
        return
      }
    },
    // 报告-编辑/查看
    echoReportEdit() {
      checkItemList({ checkType: this.$route.query.checkType, equipType: this.$route.query.equipType}).then(res => {
        console.log(res.data,'万千傻逼随它去');
        if (res.data.length != 0 ){
          let resultObj = res.data || {};
          // 表格回显
          this.tableData = resultObj
          this.startStatus = resultObj[0].enableProjectLevel == '1'? true : false// 是否启用
        } else {
          this.tableData = [{ checkName: ""}]
        }
      }).catch(err => {
        console.log(err,'error')
      }).finally(() => {

      })
    },
    // 禁用日期
    disabledDate(current) {
      return current && current > moment().endOf('day');
    },
    //检查人
    personThingOne(data) {
      this.editForm.checkUserId = data.treeIdList;
      let list = data.treeNameAndCodeList || [];
      this.editForm.checkUserName = this.getName(list);
      this.editForm.checkUserJobNumber = this.getWorkNum(list);
    },
    //获取name
    getName(list) {
      let listName = [];
      if (list.length) {
        for (var i = 0; i < list.length; i++) {
          listName.push(list[i].treeName);
        }
      }
      return listName;
    },
    //获取工号
    getWorkNum(list) {
      let listName = [];
      if (list.length) {
        for (var i = 0; i < list.length; i++) {
          listName.push(list[i].treeCode);
        }
      }
      return listName;
    },
    goBack() {
      this.setKeepalive(true)
      this.$router.go(-1);
    },
    openFireModel(row) {
      console.log(row, '?')
      this.fireType = row.fireTimeStamp ? '编辑' : '新增';
      this.formModelFireData = row.fireTimeStamp ? row : {};
      this.inspectionRecordModelShowFire = true;
    },
    openInspectionRecordModelFire(row) {
      this.iFrom.fireAlarmList.push(row)
    },
    editInspectionRecordItemFire(row) {
      let currentIndex;
      this.iFrom.fireAlarmList.forEach((item, index)=>{
        row.fireTimeStamp == item.fireTimeStamp && (currentIndex = index);
      })
      Object.assign(this.iFrom.fireAlarmList[currentIndex], row)
    },
    rmFireRecordItem(row) {
      let currentIndex;
      this.iFrom.fireAlarmList.forEach((item, index)=>{
        row.fireTimeStamp == item.fireTimeStamp && (currentIndex = index);
      })
      this.$antConfirm({
        title: "确定删除吗?",
        onOk: () => {
          this.iFrom.fireAlarmList.splice(currentIndex, 1)
        },
      });
    },
    submitConfirm() {
      console.log(this.menuList);
    },
  },
};
</script>

<style lang="less" scoped>
.download {
  padding: 20px 0;
}
.baseInfo {
  padding: 30px 0;
  .bottom {
    margin-top: 30px;
  }
}
</style>