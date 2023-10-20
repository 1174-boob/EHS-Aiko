<template>
  <!-- 三级安全教育管理 -->
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" :hasDepartment="false"></CommonSearchItem>
        <a-form-model-item label="发起人">
          <a-input v-model="formInline.createNameOrJobNumber" placeholder="请输入发起人姓名或工号"></a-input>
        </a-form-model-item>
        <a-form-model-item label="类型">
          <a-select allowClear show-search v-model="formInline.type" placeholder="请选择类型">
            <a-select-option v-for="item in getDictTarget('s','employeeType')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="当前级别">
          <a-select allowClear show-search v-model="formInline.currentLevel" placeholder="请选择当前级别">
            <a-select-option v-for="item in getDictTarget('s','educationLevel')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-select allowClear show-search v-model="formInline.status" placeholder="请选择状态">
            <a-select-option v-for="item in getDictTarget('s','securityEducationStatus')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="日期">
          <a-range-picker format="YYYY-MM-DD" class="search-range-picker" style="width: 200px" valueFormat="YYYY-MM-DD" v-model="formInline.entryDate" :placeholder="['发起日期','结束日期']"/>
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>

    <DashBtn>
      <div>
        <a-button type="dashed" @click="goSafetyEduInitiate">发起</a-button>
      </div>
    </DashBtn>

    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table bordered :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>{return record.id}" :pagination="false">
        <div slot="createUserJobNumber" slot-scope="record">{{ record.createUserName }}/{{ record.createUserJobNumber }}</div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="goCorrectionGrades(record,'add')">成绩纠错</span>
          <span class="color-0067cc cursor-pointer" @click="goCorrectionGrades(record,'show')">查看</span>
          <span class="color-0067cc cursor-pointer" @click="reAllocation(record)">重新分配</span>
          <span class="color-ff4d4f cursor-pointer" @click="rmSafetyEduItem(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>

    <!-- 重新分配弹框 -->
    <CommonModal :title="titleText" :visible="addVisible" :cancelFn="addCancle">
      <template slot="form">
        <a-form-model
          ref="editForm"
          :model="editForm"
          :rules="editFormRules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :colon="false"
          labelAlign="left"
        >
          <a-form-model-item class="flex" label="当前处理节点" prop="resolve">
            <a-input disabled :maxLength="50" v-model="editForm.resolve" placeholder="请输入当前处理节点"></a-input>
          </a-form-model-item>
          <a-form-model-item class="flex" label="原处理人" prop="resolvePeople">
            <a-input disabled :maxLength="50" v-model="editForm.resolvePeople" placeholder="请输入原处理人"></a-input>
          </a-form-model-item>
          <StaffOrDept
            :treeType="'user'"
            :propKey="'holdUserId'"
            :treeRoles="editFormRules"
            :labelTitle="'重新分配人员'"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            @getTreeData="personThingOne"
            :checkedTreeNode="editForm.holdUserId"
          />
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="addCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="editConfirm"
          >确定</a-button
        >
      </template>
    </CommonModal>
  </div>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis"
import cancelLoading from '@/mixin/cancelLoading'
import dayJs from "dayjs"
import {getDictTarget} from '@/utils/dictionary'
import { debounce, cloneDeep } from 'lodash'
import StaffOrDept from "@/components/staffOrDept";
import { formValidator } from "@/utils/clx-form-validator.js"
import {getEducationListPage, educationDelete ,educationDetail,educationReallocation} from "@/services/api.js"
import optionsMixin from '@/pages/occupationHealth/physicalExam/mixin/optionsMixin'
import postOptionsMixin from '@/pages/occupationHealth/physicalExam/mixin/postOptions'

export default {
  components: { StaffOrDept },
  mixins: [teableCenterEllipsis, cancelLoading, optionsMixin, postOptionsMixin],
  data() {
    return {
      getDictTarget,
      labelColSpec: { span: 6 },
      wrapperColSpec: { span: 18 },
      titleText: "重新分配",
      addVisible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      // 表单验证
      editFormRules: {
        holdUserId: [
          { required: true, message: "重新分配人员不能为空", trigger: "change" },
        ],
      },
      editPoint:'',
      editId:'',
      editForm: {},
      editParams:{},
      formInline: {},
      choosedArr: [],
      selectedRowKeys: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      tableSpinning: false,
      columns:  [
        {
          title: '编号',
          dataIndex: 'num',
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
          width: 200
        },
        {
          title: '标题',
          dataIndex: 'title',
          width: 150,
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: '类型',
          dataIndex: 'type',
          width: 150,
          customRender: (text) => {
            text = text ? this.getType(text) : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: '当前级别',
          dataIndex: 'currentLevel',
          width: 150,
          customRender: (text) => {
            text = text ? this.getCurrentLevel(text) : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: '发起人',
          scopedSlots: { customRender: 'createUserJobNumber' },
          width: 150
        },
        {
          title: '发起时间',
          dataIndex: 'createTime',
          width: 150,
          customRender: (text) => {
            text = text ? text: '--'
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: '签署截止时间',
          dataIndex: 'signDeadline',
          width: 160,
          customRender: (text) => {
            text = text ? text: '--'
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: 150,
          customRender: (text) => {
            text = text ? this.getStatus(text) : '--'
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          fixed: 'right', // 固定操作列
          width: 240 // 宽度根据操作自定义设置
        }
      ],
      tableDataList: [],
      userId: undefined
    }
  },
  created() {
    this.columns.splice(1, 0, this.addCommonColumnItem(150, true));
    this.init()
    let zconsole_userInfo = JSON.parse(sessionStorage.getItem("zconsole_userInfo"))
    this.userId = zconsole_userInfo.user.userId
  },
  activated(){
    if(this.$route.query.activeKey == 1){
      this.getDataList()
    }
  },
  methods: {
    async init() {
      this.getDataList()
    },
    getType(text){
      if(text==1){
        return '新员工'
      } else if (text==2){
        return '转(复)岗'
      } else {
        return '--'
      }
    },
    getCurrentLevel(text){
      if(text==1){
        return '公司级'
      } else if (text==2){
        return '车间(部门)级'
      } else if (text==3){
        return '班组级'
      } else {
        return '--'
      }
    },
    getStatus(text){
      if(text==1){
        return '待开始'
      } else if (text==2){
        return '进行中'
      } else if (text==3){
        return '已完成'
      } else {
        return '--'
      }
    },
    
    getSearchData(){
      const { entryDate } = this.formInline
      const createDateStart = entryDate?.length ? entryDate[0] : undefined
      const createDateEnd = entryDate?.length ? entryDate[1] : undefined
      let apiData = {
        // 查询项
        ...this.formInline,
        entryDate:undefined,
        createDateStart,
        createDateEnd,
        // 页码
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
        // 级别
      }
      return apiData
    },  
    getDataList() {
      let params = this.getSearchData()
      this.tableSpinning = true
      return getEducationListPage(params)
        .then((res) => {
          let { list: tableDataList, total } = res.data ? res.data : { list: [], total: 0 };
          this.tableDataList = tableDataList || [];
          this.page.total = total;
          // 处理页码 问题
          if (this.tableDataList.length === 0 && (this.page.pageNo !== 1 && this.page.total !== 0)) {
            this.page.pageNo = 1;
            this.getTableList();
          }
        })
        .catch(err=>{})
        .finally(() => {
          this.tableSpinning = false
        })
    },

    // 跳转发起页面
    goSafetyEduInitiate(targetItem){
      let query = {
        id:targetItem.id,
        type:'add',
      }
      this.$router.push({
        path:'/ehsGerneralManage/securityArchiveManagement/safetyEduInitiate',
        query,
      })
    },  

    // 成绩纠错，查看
    goCorrectionGrades(targetItem,type){
      let query = {
        id:targetItem.id,
        type,
      }
      this.$router.push({
        path:'/ehsGerneralManage/securityArchiveManagement/safetyEduCorrectionGrades',
        query,
      })
    },  
    
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page
      this.choosedArr = []
      this.selectedRowKeys = []
      // 获取列表
      this.getDataList()
    },
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1
      this.page.pageSize = pageSize
      this.getDataList()
    },
    // 查询
    iSearch() {
      // 获取列表
      this.page.pageNo = 1
      this.getDataList()
        .finally(() => {
          this.cancelLoading()
        })
      this.selectedRowKeys = []
      this.choosedArr = []
    },
    // 重置
    iRest: debounce(function () {
      this.$refs.commonSearchItem.reset()
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {}
      this.selectedRowKeys = []
      this.choosedArr = []
      this.getDataList()
    }, 250, { leading: true, trailing: false }),
    // 重新分配
    reAllocation(row){
      this.editPoint = row.currentLevel
      this.editId = row.id
      var _this = this;
      if(row.currentLevel == '1'){
        educationDetail({ id: row.id }).then((res) => {
          _this.editForm.resolve = '公司级培训讲师签署'
          _this.editForm.resolvePeople = res.data.trainerCompanyUserName +'/'+ res.data.trainerCompanyJobNumber
        })
      }else if(row.currentLevel == '2'){
        educationDetail({ id: row.id }).then((res) => {
          _this.editForm.resolve = '车间(部门)级培训讲师签署'
          _this.editForm.resolvePeople = res.data.trainerDeptUserName +'/'+ res.data.trainerDeptJobNumber
        })
      }else if(row.currentLevel == '3'){
        educationDetail({ id: row.id }).then((res) => {
          _this.editForm.resolve = '班组级培训讲师签署'
          _this.editForm.resolvePeople = res.data.trainerGroupUserName +'/'+ res.data.trainerGroupJobNumber
        })
      }
      this.$antConfirm({
        title: '重新分配签署人员会影响原有流程，是否确认进行重新分配？',
        onOk() {
          _this.addVisible = true;
        }
      })
    },
    // 重新分配确认
    editConfirm(){
      if (!formValidator.formAll(this, "editForm")) {
        return;
      }
      if(this.editForm.holdUserId.length > 1){
        this.$antMessage.warn('只能选择一名人员！');
        return
      }
      if(this.editPoint == 1) {
        this.editParams = {
          id:this.editId,
          trainerCompanyUserId:this.editForm.holdUserId[0],
          trainerCompanyJobNumber:this.editForm.holdUserJobNumber[0],
          trainerCompanyUserName:this.editForm.holdUserName[0]
        }
      } else if (this.editPoint == 2){
        this.editParams = {
          id:this.editId,
          trainerDeptUserId:this.editForm.holdUserId[0],
          trainerDeptJobNumber:this.editForm.holdUserJobNumber[0],
          trainerDeptUserName:this.editForm.holdUserName[0]
        }
      } else if (this.editPoint == 3){
        this.editParams = {
          id:this.editId,
          trainerGroupUserId:this.editForm.holdUserId[0],
          trainerGroupJobNumber:this.editForm.holdUserJobNumber[0],
          trainerGroupUserName:this.editForm.holdUserName[0]
        }
      }
      educationReallocation(this.editParams).then((res)=>{
        if(res.code == 20000){
          this.$antMessage.success('分配成功')
          this.addVisible = false
          this.editParams = {}
          this.editForm = {}
        } else {
          this.$antMessage.warn(res.message)
          return
        }
      })
    },
    // 点击取消按钮
    addCancle() {
      this.addVisible = false;
      this.editForm = {};
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

    //重新分配人员
    personThingOne(data) {
      this.editForm.holdUserId = data.treeIdList;
      let list = data.treeNameAndCodeList || [];
      this.editForm.holdUserName = this.getName(list);
      this.editForm.holdUserJobNumber = this.getWorkNum(list);
    },
    // 删除
    rmSafetyEduItem(row){
      this.$antConfirm({
        title: '确认删除？',
        onOk: async () => {
          let para = {
           id:row.id
          }
          await educationDelete(para)
          this.$antMessage.success('删除成功')
          this.getDataList()
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
.ttips {
  height: 100%;
  display: flex;
  align-items: center;
  .circle-item {
    margin-right: 15px;
  }
}
::v-deep .dashed-btn{
  .ant-btn-primary {
    background: #f1f4ff;
    color: #0067cc;
    border: 1px dashed #9fcaf5 !important;
  }
  .ant-btn-primary:hover {
    border: 1px dashed #0067cc !important;
  }
}
.testInfo {
  border: 2px dashed grey;
  overflow: hidden;
}
.pe-data-item{
  display: inline-block;
  width:224px;
  height: 64px;
  cursor: pointer;
  position: relative;
  background: rgba(250,250,250,0.50);
  border: 1px solid rgba(244,244,244,1);
  border-radius: 4px;
  padding-left:30px;
  margin-right: 20px;
  margin-bottom: 20px;
  &:last-child{
    margin-right: 0px;
  }
  // & +.pe-data-item{
  //   margin-right: 20px;
  // }
  &.active{
    background:#fff;
  }
  i {
    position: absolute;
    display: inline-block;
    background-color: #333;
    -webkit-mask-image: url(~@/assets/images/data-icon.svg);
    mask-image: url(~@/assets/images/data-icon.svg);
    width:14px;
    top: 37px;
    right: 20px;
    height: 14px;
  }
}
.link-span{
  cursor: pointer;
  color:#02A7F0;
}
.total-pe-num{
  &.active{
    border: 1px solid rgba(0,103,204,1);
    box-shadow: 0px 0px 10px 0px rgba(0,103,204,0.1);
    .pe-data-body{
      color: #0067CC;
    }
    .en-illus{
      color: #0067CC;
    }
    i {
      background-color: rgba(0,103,204,1);
    }
  }
}
.cyan-pe-num{
  &.active{
    border: 1px solid #56E9C8;
    box-shadow: 0px 0px 10px 0px rgba(255,157,1,0.1);
    .pe-data-body,.en-illus{
      color: #56E9C8;
    }
    i {
      background-color:#56E9C8;
    }
  }
}
.purple-pe-num{
  &.active{
    border: 1px solid #CC66B0;
    box-shadow: 0px 0px 10px 0px rgba(87,234,201,0.1);
    .pe-data-body,.en-illus{
      color: #CC66B0;
    }
    i {
      background-color:#CC66B0;
    }
  }
}
.yellow-pe-num{
  &.active{
    border: 1px solid #FFAF30;
    box-shadow: 0px 0px 10px 0px rgba(87,234,201,0.1);
    .pe-data-body,.en-illus{
      color: #FFAF30;
    }
    i {
      background-color:#FFAF30;
    }
  }
}
.red-pe-num{
  &.active{
    border: 1px solid #FF8A8A;
    box-shadow: 0px 0px 10px 0px rgba(87,234,201,0.1);
    .pe-data-body,.en-illus{
      color: #FF8A8A;
    }
    i {
      background-color:#FF8A8A;
    }
  }
}
.pe-data-container{
  margin-bottom:0px;
  .pe-data-body{
    display: inline-block;
    font-size: 14px;
    color: #333333;
  }
  .en-illus{
    opacity: 0.5;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #333333;
    line-height: 12px;
    font-weight: 400;
    margin-top:10px;
  }
}
.pe-green{
  color: #02DFAD;
}
.pe-red{
  color:#FF1212;
}
.pe-data-title{
  margin-bottom: 30px;
  padding-bottom:20px;
  font-size: 16px;
  color: rgba(0,0,0,0.85);
  line-height: 24px;
  font-weight: 500;
  border-bottom: 1px solid #f4f4f4;
}
.pe-data-body{
  margin-top: 15px;
}
.pre-test {
  /deep/ .ant-modal-wrap {
    z-index: 1001;
  }
}
</style>