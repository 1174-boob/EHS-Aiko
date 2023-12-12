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
          <span class="color-0067cc cursor-pointer" v-if="record.status == '0' && record.eduUserIdList && record.eduUserIdList.indexOf(userId) != -1" @click="assignLecturers(record)">分配讲师</span>
          <span class="color-0067cc cursor-pointer" v-if="record.status == '2'" @click="goCorrectionGrades(record,'add')">成绩纠错</span>
          <span class="color-0067cc cursor-pointer" @click="goCorrectionGrades(record,'show')">查看</span>
          <span class="color-0067cc cursor-pointer" v-if="!((record.status == '3') || (record.status == '0'))" @click="reAllocation(record)">重新分配</span>
          <span class="color-ff4d4f cursor-pointer" @click="rmSafetyEduItem(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>

    <!-- 分配人员弹框 -->
    <CommonModal title="分配" :visible="popVisible" :cancelFn="popCancle">
      <template slot="form">
        <a-form-model
          ref="popForm"
          :model="popForm"
          :rules="popFormRules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :colon="false"
          labelAlign="left"
        >
          <StaffOrDept
            :treeType="'user'"
            :propKey="'deptTrainerUserId'"
            :treeRoles="popFormRules"
            :labelTitle="'车间(部门)级'"
            :label-col="labelCol"
            :checkAbel="false"
            :wrapper-col="wrapperCol"
            @getTreeData="personThingTwo"
            :checkedTreeNode="popForm.deptTrainerUserId"
          />
          <StaffOrDept
            :treeType="'user'"
            :propKey="'groupTrainerUserId'"
            :treeRoles="popFormRules"
            :labelTitle="'班组级'"
            :label-col="labelCol"
            :checkAbel="false"
            :wrapper-col="wrapperCol"
            @getTreeData="personThingThree"
            :checkedTreeNode="popForm.groupTrainerUserId"
          />
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="popCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="popConfirm"
          >确定</a-button
        >
      </template>
    </CommonModal>



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
            <span>{{editForm.resolve}}</span>
          </a-form-model-item>
          <a-form-model-item class="flex" label="原处理人" prop="resolvePeople">
            <span>{{editForm.resolvePeople}}</span>
          </a-form-model-item>
          <StaffOrDept
            :treeType="'user'"
            :propKey="'holdUserId'"
            :treeRoles="editFormRules"
            :labelTitle="'重新分配人员'"
            :label-col="labelCol"
            :checkAbel="false"
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

    <!--  分配讲师弹框  -->
    <CommonModal :title="assignTitle" :visible="assignVisible" :cancelFn="assignCancle">
      <template slot="form">
        <SearchTerm>
          <a-form-model layout="inline" :model="popInline" :colon="false">
            <CommonSearchItem ref="commonSearchItem" :CommonFormInline="popInline" :hasDepartment="true" deptLabel="所属部门"></CommonSearchItem>
            <a-form-model-item label="姓名或工号">
              <a-input allowClear v-model="popInline.userNameOrJobNumber" placeholder="请输入姓名或工号"></a-input>
            </a-form-model-item>
            <a-form-model-item label="岗位">
              <a-input allowClear v-model="popInline.jobName" placeholder="请输入岗位"></a-input>
            </a-form-model-item>
            <a-form-model-item class="float-right">
              <a-button type="primary" :loading="loading" @click="popSearch">查询</a-button>
              <a-button @click="popRest">重置</a-button>
            </a-form-model-item>
          </a-form-model>
        </SearchTerm>
        <DashBtn>
          <div>
            <a-button type="dashed" @click="goAssign">{{assignTeacher}}</a-button>
          </div>
        </DashBtn>
        <CommonTable :page="pagePop" :pageNoChange="pageNoChangePop" :showSizeChange="onShowSizeChangePop">
          <a-table :row-selection="{ selectedRowKeys: selectedRowKeys, selectedRows: choosedArr, onChange: onSelectChange, onSelectAll: onSelectAllSelect }" bordered :columns="columnsPop" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="dataSource" :rowKey="(record, index)=>{return record.id}" :pagination="false">
            <div slot="userName" slot-scope="record">{{ record.userName }}</div>
            <div slot="deptName" slot-scope="record">{{ record.deptName }}</div>
            <div slot="userJobNumber" slot-scope="record">{{ record.userJobNumber }}</div>
            <div slot="jobName" slot-scope="record">{{ record.jobName }}</div>
            <div slot="companyTrainerUserId" slot-scope="record">{{ record.companyTrainerUserName }}/{{ record.companyTrainerJobNumber }}</div>
            <div slot="deptTrainerUserId" slot-scope="record">{{ record.deptTrainerUserName }}/{{ record.deptTrainerJobNumber }}</div>
            <div slot="groupTrainerUserId" slot-scope="record">{{ record.groupTrainerUserName }}/{{ record.groupTrainerJobNumber }}</div>
          </a-table>
        </CommonTable>
      </template>
      <template slot="btn">
        <a-button @click="assignCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="assignConfirm"
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
import {getEducationListPage, educationDelete ,educationDetail,educationReallocation,getEducationUserListPage,assignInstructor} from "@/services/api.js"
import optionsMixin from '@/pages/occupationHealth/physicalExam/mixin/optionsMixin'
import postOptionsMixin from '@/pages/occupationHealth/physicalExam/mixin/postOptions'
import centerOrganizeVue from '../ngform/components/centerOrganize/centerOrganize.vue'

export default {
  components: { StaffOrDept },
  mixins: [teableCenterEllipsis, cancelLoading, optionsMixin, postOptionsMixin],
  data() {
    return {
      getDictTarget,
      labelColSpec: { span: 6 },
      wrapperColSpec: { span: 18 },
      titleText: "修改讲师",
      addVisible: false,
      popVisible: false,
      assignVisible: false,
      assignTitle: '分配讲师',
      assignTeacher:'分配讲师',
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      // 表单验证
      editFormRules: {
        holdUserId: [
          { required: true, message: "重新分配人员不能为空", trigger: "change" },
        ],
      },
      popFormRules: {
        deptTrainerUserId: [
          { required: true, message: "车间(部门)级人员不能为空", trigger: "change" },
        ],
        groupTrainerUserId: [
          { required: true, message: "班组级人员不能为空", trigger: "change" },
        ],
      },
      editPoint:'',
      editId:'',
      editForm: {},
      popForm: {},
      editParams:{},
      formInline: {},
      popInline: {},
      popId:'',
      pagePop: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      dataSource:[],
      columnsPop: [
        {
          title: '姓名',
          scopedSlots: { customRender: 'userName' },
          width: 80,
          align: "center",
        },
        {
          title: '部门',
          scopedSlots: { customRender: 'deptName' },
          width: 150,
          align: "center",
        },
        {
          title: '工号',
          scopedSlots: { customRender: 'userJobNumber' },
          width: 100,
          align: "center",
        },
        {
          title: '岗位',
          scopedSlots: { customRender: 'jobName' },
          width: 100,
          align: "center",
        },
        {
          title: '公司级讲师',
          scopedSlots: { customRender: 'companyTrainerUserId' },
          width: 180,
          align: "center",
        },
        {
          title: '车间(部门)级别讲师',
          scopedSlots: { customRender: 'deptTrainerUserId' },
          width: 180,
          align: "center",
        },
        {
          title: '班组级讲师',
          scopedSlots: { customRender: 'groupTrainerUserId' },
          width: 180,
          align: "center",
        },
        
      ],
      cutData:'',
      choosedArr: [],
      needChooseArr:[],
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
      } else if (text==0){
        return '待分配'
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
      // 获取列表
      this.getDataList()
    },
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1
      this.page.pageSize = pageSize
      this.getDataList()
    },
    popSearch() {
      let params = {
        id: this.popId ,
        pageNo: this.pagePop.pageNo,
        pageSize: this.pagePop.pageSize,
        ...this.popInline
      }
      getEducationUserListPage(params)
        .then((res) => {
          this.dataSource = res.data.list ? res.data.list : [];
          this.pagePop.total = res.data.total
        })
        .catch((err) => {
          console.log('err2',err);
        });
    },
    popRest() {
      this.popInline = {}
      this.getDetailDown()
    },
    // 分配讲师
    assignLecturers(row){
      console.log('row',row);
      this.assignTitle = '分配讲师'
      this.assignTeacher = '分配讲师'
      this.cutData = this.columnsPop.splice(4,1)[0]
      this.popId = row.id
      this.assignVisible = true
      this.getDetailDown()
    },
    // 分配讲师按钮 || 修改讲述按钮
    goAssign(){
      if (this.assignTitle == '分配讲师'){
        if(!this.checkDeptIdConsistency(this.choosedArr)){
          this.$antMessage.warn('请选择同一部门下的人员')
          return
        } else {
          console.log('分配讲师统一部门');
          this.popVisible = true;
          this.popForm = {}
          this.editForm = {}
        }
      } else if (this.assignTitle == '重新分配') {
        if(!this.checkDeptIdAndTeacherConsistency(this.choosedArr)){
          this.$antMessage.warn('请选择同一部门下且同一级别的人员')
          return
        } else {
          this.addVisible = true;
          console.log('this.choosedArr',this.choosedArr);
          if(this.choosedArr[0].currentLevel == '1'){
            this.editForm.resolve = '公司级培训讲师签署'
            this.editForm.resolvePeople = this.choosedArr[0].companyTrainerUserName +'/'+ this.choosedArr[0].companyTrainerJobNumber
          }else if(this.choosedArr[0].currentLevel == '2'){
            this.editForm.resolve = '车间(部门)级培训讲师签署'
            this.editForm.resolvePeople = this.choosedArr[0].deptTrainerUserName +'/'+ this.choosedArr[0].deptTrainerJobNumber
          }else if(this.choosedArr[0].currentLevel == '3'){
            this.editForm.resolve = '班组级培训讲师签署'
            this.editForm.resolvePeople = this.choosedArr[0].groupTrainerUserName +'/'+ this.choosedArr[0].groupTrainerJobNumber
          }
        }
      }
      
    },
    // 分配人员弹框确认按钮
    popConfirm() {
      if (!formValidator.formAll(this, "popForm")) {
        return;
      }
      this.$nextTick(()=>{
        this.choosedArr.forEach(item => {
          this.dataSource.forEach( _item => {
            if(item.id === _item.id) {
              _item.deptTrainerUserId = this.popForm.deptTrainerUserId[0]
              _item.deptTrainerUserName = this.popForm.deptTrainerUserName[0] 
              _item.deptTrainerJobNumber = this.popForm.deptTrainerJobNumber[0]
              _item.groupTrainerUserId = this.popForm.groupTrainerUserId[0] 
              _item.groupTrainerUserName = this.popForm.groupTrainerUserName[0] 
              _item.groupTrainerJobNumber = this.popForm.groupTrainerJobNumber[0]
              item.deptTrainerUserId = this.popForm.deptTrainerUserId[0]
              item.deptTrainerUserName = this.popForm.deptTrainerUserName[0] 
              item.deptTrainerJobNumber = this.popForm.deptTrainerJobNumber[0]
              item.groupTrainerUserId = this.popForm.groupTrainerUserId[0] 
              item.groupTrainerUserName = this.popForm.groupTrainerUserName[0] 
              item.groupTrainerJobNumber = this.popForm.groupTrainerJobNumber[0]
            }
          })
        })
      })
      this.needChooseArr.push(this.choosedArr)
      this.selectedRowKeys = []
      this.popVisible = false;
      console.log('this.choosedArr989',this.choosedArr);
    },
    // 分配讲师弹框确定按钮 
    assignConfirm(){
        let promiseFn = this.assignTitle == '分配讲师'? assignInstructor :educationReallocation
        console.log('分配讲师111接口',this.needChooseArr);
        const result = this.needChooseArr.reduce((acc, curr) => {
          curr.forEach(obj => {
            acc[obj.id] = obj;
          });
          return acc;
        }, {});
        const finalArray = Object.values(result);
        console.log('finalArray77',finalArray);
        let params = {
          id: this.popId,
          securityEducationRecordsList:finalArray
        }
        promiseFn(params).then((res) => {
          console.log(res,'ressss');
          const {code,...rest} = res 
          if (code === 20000) {
            this.$antMessage.success('操作成功')
            this.needChooseArr = []
          }
          this.assignVisible = false
          if (this.assignTitle == '分配讲师') {
            this.columnsPop.splice(4,0,this.cutData)
          } else {
            this.editForm = {}
          }
          this.getDataList()
        })
        .catch((err) => {
          console.log('err3',err);
        });

    },
    // 关闭分配讲师弹框
    assignCancle() {
      this.assignVisible = false;
      this.needChooseArr = []
      this.choosedArr = []
      this.editForm = {}
      this.selectedRowKeys = []
      if (this.assignTitle == '分配讲师') {
        this.columnsPop.splice(4,0,this.cutData)
      }
    },
    getDetailDown(){
      getEducationUserListPage({ id: this.popId ,pageNo: this.pagePop.pageNo,pageSize: this.pagePop.pageSize})
        .then((res) => {
          this.dataSource = res.data.list ? res.data.list : [];
          // console.log('res.data.list',res.data.list);
          this.pagePop.total = res.data.total
        })
        .catch((err) => {
          console.log('err4',err);
        });
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = JSON.parse(JSON.stringify(selectedRowKeys))
      this.choosedArr = JSON.parse(JSON.stringify(selectedRows))
      console.log('selectedRowKeys111',selectedRowKeys,'selectedRows222',selectedRows);
    },
    onSelectAllSelect(selected, selectedRows, changeRows) {
      this.selectedRowKeys = selectedRows.map((item,index) => {
        return item.id
      }) || []
      this.choosedArr = selectedRows
    },
    // 页码改变
    pageNoChangePop(page) {
      this.pagePop.pageNo = page
      this.choosedArr = []
      this.selectedRowKeys = []
      // 获取列表
      this.getDetailDown()
    },
    onShowSizeChangePop(current, pageSize) {
      this.pagePop.pageNo = 1
      this.pagePop.pageSize = pageSize
      this.getDetailDown()
    },
    // 必须是同一个部门的才可以点击确定
    checkDeptIdConsistency(arr) {
      const deptIdList = arr.map(obj => obj.deptId);
      const uniqueNames = new Set(deptIdList);
      if (uniqueNames.size === 1) {
        return true;
      } else {
        return false;
      }
    },
    checkDeptIdAndTeacherConsistency(arr) {
      const deptIdList = arr.map(obj => obj.deptId);
      const currentLeveldList = arr.map(obj => obj.currentLevel);
      const uniqueNames = new Set(deptIdList);
      const uniquecurrentLevel = new Set(currentLeveldList);
      if (uniqueNames.size === 1 && uniquecurrentLevel.size === 1) {
        return true;
      } else {
        return false;
      }
    },
    // 查询
    iSearch() {
      // 获取列表
      this.page.pageNo = 1
      this.getDataList()
        .finally(() => {
          this.cancelLoading()
        })
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
      this.getDataList()
    }, 250, { leading: true, trailing: false }),
    // 重新分配
    reAllocation(row){
      this.editPoint = row.currentLevel
      this.editId = row.id
      console.log('行，知道了',row);
      this.assignTeacher = '修改讲师'
      this.assignTitle = '重新分配'
      var _this = this;
      this.$antConfirm({
        title: '重新分配签署人员会影响原有流程，是否确认进行重新分配？',
        onOk() {
          _this.popId = row.id
          _this.assignVisible = true
          _this.choosedArr = []
          _this.selectedRowKeys = []
          _this.getDetailDown()
        }
      })
    },
    // 重新分配确认
    editConfirm(){
      if (!formValidator.formAll(this, "editForm")) {
        return;
      }
      if(this.editPoint == 1) {
        this.$nextTick(()=>{
          this.choosedArr.forEach(item => {
            this.dataSource.forEach( _item => {
              if(item.id === _item.id) {
                _item.companyTrainerUserId = this.editForm.holdUserId[0],
                _item.companyTrainerUserName = this.editForm.holdUserName[0],
                _item.companyTrainerJobNumber = this.editForm.holdUserJobNumber[0]
                item.companyTrainerUserId = this.editForm.holdUserId[0],
                item.companyTrainerUserName = this.editForm.holdUserName[0],
                item.companyTrainerJobNumber = this.editForm.holdUserJobNumber[0]
              }
            })
          })
        })
      } else if (this.editPoint == 2){
        this.$nextTick(()=>{
          this.choosedArr.forEach(item => {
            this.dataSource.forEach( _item => {
              if(item.id === _item.id) {
                _item.deptTrainerUserId = this.editForm.holdUserId[0],
                _item.deptTrainerUserName = this.editForm.holdUserName[0],
                _item.deptTrainerJobNumber = this.editForm.holdUserJobNumber[0]
                item.deptTrainerUserId = this.editForm.holdUserId[0],
                item.deptTrainerUserName = this.editForm.holdUserName[0],
                item.deptTrainerJobNumber = this.editForm.holdUserJobNumber[0]
              }
            })
          })
        })
      } else if (this.editPoint == 3){
        this.$nextTick(()=>{
          this.choosedArr.forEach(item => {
            this.dataSource.forEach( _item => {
              if(item.id === _item.id) {
                _item.groupTrainerUserId = this.editForm.holdUserId[0],
                _item.groupTrainerUserName = this.editForm.holdUserName[0],
                _item.groupTrainerJobNumber = this.editForm.holdUserJobNumber[0]
                item.groupTrainerUserId = this.editForm.holdUserId[0],
                item.groupTrainerUserName = this.editForm.holdUserName[0],
                item.groupTrainerJobNumber = this.editForm.holdUserJobNumber[0]
              }
            })
          })
        })
      }
      this.needChooseArr.push(this.choosedArr)
      this.selectedRowKeys = []
      this.addVisible = false;
      console.log('this.choosedArr88888',this.choosedArr);
    },
    // 分配人员取消按钮
    popCancle() {
      this.popVisible = false;
      this.popForm = {};
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
    personThingTwo(data) {
      this.popForm.deptTrainerUserId = data.treeIdList;
      let list = data.treeNameAndCodeList || [];
      this.popForm.deptTrainerUserName = this.getName(list);
      this.popForm.deptTrainerJobNumber = this.getWorkNum(list);
    },
    personThingThree(data) {
      this.popForm.groupTrainerUserId = data.treeIdList;
      let list = data.treeNameAndCodeList || [];
      this.popForm.groupTrainerUserName = this.getName(list);
      this.popForm.groupTrainerJobNumber = this.getWorkNum(list);
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
.clx-model {
  ::v-deep .ant-modal {
    width: 1200px !important;
    padding-bottom: 0px !important;
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